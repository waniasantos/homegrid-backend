import { IMedicaoRepository } from "../interfaces/IMedicaoRepository";

export class ListarMedicoesUseCase {
  constructor(private medicaoRepository: IMedicaoRepository) {}

  async executar(limit: number = 100): Promise<any[]> {
    return this.medicaoRepository.listarTodas(limit);
  }
}
