import { Medicao } from "../../domain/entities/Medicao";

export interface IEventPublisher {
  publicar(medicao: Medicao): Promise<void>;
}