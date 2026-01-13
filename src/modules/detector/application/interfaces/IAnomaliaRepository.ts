import { Anomalia } from "../../domain/entities/Anomalia";

export interface IAnomaliaRepository {
  salvar(anomalia: Anomalia): Promise<void>;
  listarTodas(limit: number): Promise<any[]>;
}
