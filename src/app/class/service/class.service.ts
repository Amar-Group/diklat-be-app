import { IClassService } from "../contract/class.contract";
import { CreateClassRequestDto, UpdateClassRequestDto } from "../dto/class-request.dto";
import { ClassResponseDto } from "../dto/class-response.dto";
import { ClassReadRepository } from "../repository/class-read.repository";
import { ClassWriteRepository } from "../repository/class-write.repository";

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
}
