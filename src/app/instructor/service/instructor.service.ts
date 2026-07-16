import { IInstructorService } from "../contract/instructor.contract";
import { CreateInstructorRequestDto, UpdateInstructorRequestDto } from "../dto/instructor-request.dto";
import { InstructorResponseDto } from "../dto/instructor-response.dto";
import { InstructorReadRepository } from "../repository/instructor-read.repository";
import { InstructorWriteRepository } from "../repository/instructor-write.repository";

export class InstructorService implements IInstructorService {
  async create(data: CreateInstructorRequestDto): Promise<InstructorResponseDto> {
    const id = await InstructorWriteRepository.create(data);
    const instructor = await InstructorReadRepository.findById(id);
    if (!instructor) throw new Error("Failed to create instructor");
    return new InstructorResponseDto(instructor);
  }

  async update(id: number, data: UpdateInstructorRequestDto): Promise<InstructorResponseDto> {
    const existing = await InstructorReadRepository.findById(id);
    if (!existing) throw new Error("Instructor not found");

    await InstructorWriteRepository.update(id, existing.user_id, data);
    const updated = await InstructorReadRepository.findById(id);
    if (!updated) throw new Error("Failed to get updated instructor");
    return new InstructorResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    const existing = await InstructorReadRepository.findById(id);
    if (!existing) throw new Error("Instructor not found");
    
    await InstructorWriteRepository.delete(id, existing.user_id);
  }

  async findById(id: number): Promise<InstructorResponseDto | null> {
    const instructor = await InstructorReadRepository.findById(id);
    return instructor ? new InstructorResponseDto(instructor) : null;
  }

  async findAll(): Promise<InstructorResponseDto[]> {
    const instructors = await InstructorReadRepository.findAll();
    return instructors.map((i) => new InstructorResponseDto(i));
  }
}
