import { EventBridgeEvent } from "aws-lambda";
import { DetectarAnomaliaUseCase } from "../../application/usecases/DetectarAnomaliaUseCase";
import { DynamoDBMedicaoRepository } from "../../../ingestion/infrastructure/repositories/DynamoDBMedicaoRepository";
import { EventBridgePublisher } from "../../../ingestion/infrastructure/messaging/EventBridgePublisher";
import { DynamoDBAnomaliaRepository } from "../../infrastructure/repositories/DynamoDBAnomaliaRepository";

const medicaoRepository = new DynamoDBMedicaoRepository();
const eventPublisher = new EventBridgePublisher();
const anomaliaRepository = new DynamoDBAnomaliaRepository();

const detectarAnomaliaUseCase = new DetectarAnomaliaUseCase(
  medicaoRepository,
  eventPublisher,
  anomaliaRepository
);

export const handler = async (event: EventBridgeEvent<string, any>): Promise<void> => {
  try {
    console.log("[Handler] Evento recebido do EventBridge:", JSON.stringify(event));

    const medicao = event.detail;

    await detectarAnomaliaUseCase.executar(medicao);

    console.log("[Handler] Análise concluída");
  } catch (error: any) {
    console.error("[Handler] Erro ao detectar anomalia:", error);
    throw error;
  }
};
