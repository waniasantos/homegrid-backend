import { Anomalia } from "../../domain/entities/Anomalia";
import { IMedicaoRepository } from "../../../ingestion/application/interfaces/IMedicaoRepository";
import { IEventPublisher } from "../../../ingestion/application/interfaces/IEventPublisher";
import { IAnomaliaRepository } from "../interfaces/IAnomaliaRepository";
import { CalculadoraEstatistica } from "../../infrastructure/services/CalculadoraEstatistica";

interface MedicaoInput {
  dispositivoId: string;
  consumo: number;
  timestamp: string;
}

export class DetectarAnomaliaUseCase {
  private calculadora = new CalculadoraEstatistica();

  constructor(
    private medicaoRepository: IMedicaoRepository,
    private eventPublisher: IEventPublisher,
    private anomaliaRepository: IAnomaliaRepository
  ) {}

  async executar(medicao: MedicaoInput): Promise<void> {
    console.log("[Detector] Analisando medição:", medicao);

    const historico = await this.medicaoRepository.listarTodas(20);
    
    if (historico.length < 5) {
      console.log("[Detector] Histórico insuficiente para análise");
      return;
    }

    const consumos = historico.map((m: any) => m.consumo);
    const media = this.calculadora.calcularMedia(consumos);
    const desvioPadrao = this.calculadora.calcularDesvioPadrao(consumos);
    
    console.log(`[Detector] Média: ${media.toFixed(2)}W, Desvio: ${desvioPadrao.toFixed(2)}W`);

    if (this.calculadora.ehAnomalia(medicao.consumo, media, desvioPadrao, 2)) {
      const anomalia = new Anomalia(
        medicao.dispositivoId,
        "CONSUMO_ANORMAL",
        this.definirSeveridade(medicao.consumo, media, desvioPadrao),
        medicao.consumo,
        media,
        new Date(medicao.timestamp)
      );

      console.log(`[Detector] ANOMALIA DETECTADA! ${anomalia.percentualDesvio.toFixed(1)}% acima da média`);

      await this.anomaliaRepository.salvar(anomalia);

      await this.eventPublisher.publicar({
        type: "AnomaliaDetectada",
        data: {
          dispositivoId: anomalia.dispositivoId,
          tipo: anomalia.tipo,
          severidade: anomalia.severidade,
          consumoAtual: anomalia.consumoAtual,
          consumoEsperado: anomalia.consumoEsperado,
          percentualDesvio: anomalia.percentualDesvio,
          timestamp: anomalia.timestamp.toISOString()
        }
      } as any);
    } else {
      console.log("[Detector] Consumo dentro do padrão");
    }
  }

  private definirSeveridade(consumo: number, media: number, desvioPadrao: number): "BAIXA" | "MEDIA" | "ALTA" {
    const desvios = Math.abs(consumo - media) / desvioPadrao;
    if (desvios > 3) return "ALTA";
    if (desvios > 2.5) return "MEDIA";
    return "BAIXA";
  }
}
