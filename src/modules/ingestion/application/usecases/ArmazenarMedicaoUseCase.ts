import { Medicao } from "../../domain/entities/Medicao";
import { IMedicaoRepository } from "../interfaces/IMedicaoRepository";
import { IEventPublisher } from "../interfaces/IEventPublisher";

// DTO: Define o formato dos dados que chegam de fora (ex: do JSON da Lambda)
export interface InputMedicaoDTO {
  dispositivoId: string;
  consumo: number;
  timestamp: string | Date;
}

export class ArmazenarMedicaoUseCase {
  constructor(
    // Injeção de dependência via construtor
    private medicaoRepository: IMedicaoRepository,
    private eventPublisher: IEventPublisher
  ) {}

  async executar(dados: InputMedicaoDTO): Promise<void> {
    // 1. Converte e cria a entidade de domínio (a validação acontece no construtor da entidade)
    const dataObj = typeof dados.timestamp === 'string' 
      ? new Date(dados.timestamp) 
      : dados.timestamp;

    const medicao = new Medicao(
      dados.dispositivoId,
      dados.consumo,
      dataObj
    );

    // 2. Persiste os dados (usando o contrato, sem saber que é DynamoDB)
    await this.medicaoRepository.salvar(medicao);

    // 3. Publica evento para outros sistemas (usando contrato, sem saber que é EventBridge)
    // Isso é crucial para a arquitetura Event-Driven descrita no PDF
    await this.eventPublisher.publicar(medicao);
    
    console.log(`[UseCase] Medição do dispositivo ${medicao.dispositivoId} processada com sucesso.`);
  }
}