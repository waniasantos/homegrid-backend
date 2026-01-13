import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ArmazenarMedicaoUseCase } from "../../application/usecases/ArmazenarMedicaoUseCase";
import { DynamoDBMedicaoRepository } from "../../infrastructure/repositories/DynamoDBMedicaoRepository";
import { EventBridgePublisher } from "../../infrastructure/messaging/EventBridgePublisher";

const medicaoRepository = new DynamoDBMedicaoRepository();
const eventPublisher = new EventBridgePublisher();
const armazenarMedicaoUseCase = new ArmazenarMedicaoUseCase(medicaoRepository, eventPublisher);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("[Handler] Evento recebido:", event.body);

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "O corpo da requisição (body) é obrigatório." }),
      };
    }

    const body = JSON.parse(event.body);

    await armazenarMedicaoUseCase.executar({
      dispositivoId: body.dispositivoId,
      consumo: body.consumo,
      timestamp: body.timestamp
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Medição recebida e processada com sucesso." }),
    };

  } catch (error: any) {
    console.error("[Handler] Erro:", error);

    
    const isDomainError = error.message.includes("consumo") || error.message.includes("timestamp");
    
    return {
      statusCode: isDomainError ? 400 : 500,
      body: JSON.stringify({ 
        error: error.message || "Erro interno do servidor." 
      }),
    };
  }
};