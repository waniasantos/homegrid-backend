import { Medicao } from "../../domain/entities/Medicao";
import { IMedicaoRepository } from "../interfaces/IMedicaoRepository";
import { IEventPublisher } from "../interfaces/IEventPublisher";

export interface InputMedicaoDTO {
  dispositivoId: string;
  consumo: number;
  timestamp: string | Date;
}

export class ArmazenarMedicaoUseCase {
  constructor(
    private medicaoRepository: IMedicaoRepository,
    private eventPublisher: IEventPublisher
  ) {}

  async executar(dados: InputMedicaoDTO): Promise<void> {
    const dataObj = typeof dados.timestamp === 'string' 
      ? new Date(dados.timestamp) 
      : dados.timestamp;

    const medicao = new Medicao(
      dados.dispositivoId,
      dados.consumo,
      dataObj
    );

    await this.medicaoRepository.salvar(medicao);

    await this.eventPublisher.publicar({
      type: "MedicaoRecebida",
      data: {
        dispositivoId: medicao.dispositivoId,
        consumo: medicao.consumo,
        timestamp: medicao.timestamp.toISOString(),
      },
    });
    
    console.log(`[UseCase] Medição do dispositivo ${medicao.dispositivoId} processada com sucesso.`);
  }
}
