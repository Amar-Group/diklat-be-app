import { IClassService } from "../contract/class.contract";
import { CreateClassRequestDto, UpdateClassRequestDto } from "../dto/class-request.dto";
import { ClassResponseDto } from "../dto/class-response.dto";
import { ClassReadRepository } from "../repository/class-read.repository";
import { ClassWriteRepository } from "../repository/class-write.repository";
import { ClassMemberRepository } from "../repository/class-member.repository";

export class ClassService implements IClassService {
  async create(data: CreateClassRequestDto): Promise<ClassResponseDto> {
    const id = await ClassWriteRepository.create(data);
    const cls = await ClassReadRepository.findById(id);
    if (!cls) throw new Error("Failed to create class");
    return new ClassResponseDto(cls);
  }

  async update(id: number, data: UpdateClassRequestDto): Promise<ClassResponseDto> {
    const existing = await ClassReadRepository.findById(id);
    if (!existing) throw new Error("Class not found");

    await ClassWriteRepository.update(id, data);
    const updated = await ClassReadRepository.findById(id);
    if (!updated) throw new Error("Failed to get updated class");
    return new ClassResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    const existing = await ClassReadRepository.findById(id);
    if (!existing) throw new Error("Class not found");
    
    await ClassWriteRepository.delete(id);
  }

  async findById(id: number): Promise<ClassResponseDto | null> {
    const cls = await ClassReadRepository.findById(id);
    return cls ? new ClassResponseDto(cls) : null;
  }

  async findAll(): Promise<ClassResponseDto[]> {
    const classes = await ClassReadRepository.findAll();
    return classes.map((c) => new ClassResponseDto(c));
  }

  async findMyLearning(userId: number, roleCode: string): Promise<any[]> {
    let classes = await ClassReadRepository.findAll();
    
    if (roleCode === 'PARTICIPANT') {
      const participantClassIds = await ClassMemberRepository.getClassesForParticipant(userId);
      classes = classes.filter(c => participantClassIds.includes(c.id));
    } else if (roleCode === 'INSTRUCTOR') {
      const instructorClassIds = await ClassMemberRepository.getClassesForInstructor(userId);
      classes = classes.filter(c => instructorClassIds.includes(c.id));
    }
    
    // Convert to response DTO and add progress percent
    const mapped = classes.map((c) => new ClassResponseDto(c));
    
    if (roleCode !== 'PARTICIPANT') return mapped;

    // Calculate progress for participants
    const { db } = await import("../../../db");
    const { course_modules, materials, participant_progress } = await import("../../../db/schema");
    const { eq, inArray, and } = await import("drizzle-orm");

    const result = [];
    for (const cls of mapped) {
      if (!cls.course_id) {
        result.push({ ...cls, progress_percent: 0 });
        continue;
      }
      
      const modules = await db.select().from(course_modules).where(eq(course_modules.course_id, cls.course_id));
      const moduleIds = modules.map(m => m.id);
      
      if (moduleIds.length === 0) {
         result.push({ ...cls, progress_percent: 0 });
         continue;
      }
      
      const mats = await db.select().from(materials).where(inArray(materials.module_id, moduleIds));
      if (mats.length === 0) {
         result.push({ ...cls, progress_percent: 0 });
         continue;
      }
      
      const matIds = mats.map(m => m.id);
      const progress = await db.select().from(participant_progress).where(
        and(
          eq(participant_progress.participant_id, userId),
          inArray(participant_progress.material_id, matIds),
          eq(participant_progress.is_completed, true)
        )
      );
      
      const percent = Math.round((progress.length / mats.length) * 100);
      result.push({ ...cls, progress_percent: percent });
    }

    return result;
  }

  async getSyllabus(classId: number, userId: number): Promise<any> {
    const { db } = await import("../../../db");
    const { classes, courses, course_modules, materials, quizzes, participant_progress } = await import("../../../db/schema");
    const { eq, and, asc } = await import("drizzle-orm");

    // 1. Get class and course info
    const classData = await db
      .select()
      .from(classes)
      .leftJoin(courses, eq(classes.course_id, courses.id))
      .where(eq(classes.id, classId))
      .limit(1);

    if (classData.length === 0) throw new Error("Class not found");

    const courseId = classData[0].classes.course_id;
    const courseTitle = classData[0].courses?.title;

    // 2. Get modules
    const modulesData = await db
      .select()
      .from(course_modules)
      .where(eq(course_modules.course_id, courseId))
      .orderBy(asc(course_modules.order_sequence));

    const moduleIds = modulesData.map((m: any) => m.id);
    
    // 3. Get materials and quizzes
    let materialsData: any[] = [];
    let quizzesData: any[] = [];
    let progressData: any[] = [];

    if (moduleIds.length > 0) {
      // Drizzle 'inArray' needs import, let's just fetch all and filter for now to avoid import issues
      const { inArray } = await import("drizzle-orm");
      
      materialsData = await db
        .select()
        .from(materials)
        .where(inArray(materials.module_id, moduleIds));

      quizzesData = await db
        .select()
        .from(quizzes)
        .where(inArray(quizzes.module_id, moduleIds));

      const materialIds = materialsData.map(m => m.id);
      if (materialIds.length > 0) {
        progressData = await db
          .select()
          .from(participant_progress)
          .where(
            and(
              eq(participant_progress.participant_id, userId),
              inArray(participant_progress.material_id, materialIds)
            )
          );
      }
    }

    // 4. Map progress to materials
    const materialsWithProgress = materialsData.map((mat: any) => {
      const prog = progressData.find((p: any) => p.material_id === mat.id);
      return {
        ...mat,
        is_completed: prog ? prog.is_completed : false,
        last_watched_second: prog ? prog.last_watched_second : 0
      };
    });

    // 5. Structure payload
    return {
      class: {
        ...classData[0].classes,
        course_title: courseTitle,
      },
      modules: modulesData.map((mod: any) => ({
        ...mod,
        materials: materialsWithProgress.filter((mat: any) => mat.module_id === mod.id),
        quizzes: quizzesData.filter((q: any) => q.module_id === mod.id),
      }))
    };
  }
}
