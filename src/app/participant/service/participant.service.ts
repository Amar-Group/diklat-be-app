import { IParticipantService } from "../contract/participant.contract";
import { CreateParticipantRequestDto, UpdateParticipantRequestDto } from "../dto/participant-request.dto";
import { ParticipantResponseDto } from "../dto/participant-response.dto";
import { ParticipantReadRepository } from "../repository/participant-read.repository";
import { ParticipantWriteRepository } from "../repository/participant-write.repository";

export class ParticipantService implements IParticipantService {
  async create(data: CreateParticipantRequestDto): Promise<ParticipantResponseDto> {
    const id = await ParticipantWriteRepository.create(data);
    const participant = await ParticipantReadRepository.findById(id);
    if (!participant) throw new Error("Failed to create participant");
    return new ParticipantResponseDto(participant);
  }

  async update(id: number, data: UpdateParticipantRequestDto): Promise<ParticipantResponseDto> {
    const existing = await ParticipantReadRepository.findById(id);
    if (!existing) throw new Error("Participant not found");

    await ParticipantWriteRepository.update(id, existing.user_id, data);
    const updated = await ParticipantReadRepository.findById(id);
    if (!updated) throw new Error("Failed to get updated participant");
    return new ParticipantResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    const existing = await ParticipantReadRepository.findById(id);
    if (!existing) throw new Error("Participant not found");
    
    await ParticipantWriteRepository.delete(id, existing.user_id);
  }

  async findById(id: number): Promise<ParticipantResponseDto | null> {
    const participant = await ParticipantReadRepository.findById(id);
    return participant ? new ParticipantResponseDto(participant) : null;
  }

  async findAll(): Promise<ParticipantResponseDto[]> {
    const participants = await ParticipantReadRepository.findAll();
    return participants.map((p) => new ParticipantResponseDto(p));
  }
}
