import { Medicao } from "../../domain/entities/Medicao";

export interface IMedicaoRepository {
  salvar(medicao: Medicao): Promise<void>;
  listarTodas(limit: number): Promise<any[]>;
}
