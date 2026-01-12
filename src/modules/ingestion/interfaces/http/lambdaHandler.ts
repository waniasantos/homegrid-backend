import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ArmazenarMedicaoUseCase } from "../../application/usecases/ArmazenarMedicaoUseCase";
import { DynamoDBMedicaoRepository } from "../../infrastructure/repositories/DynamoDBMedicaoRepository";
import { EventBridgePublisher } from "../../infrastructure/messaging/EventBridgePublisher";

// --- Composition Root (Injeção de Dependência) ---
// Instanciamos fora do handler para aproveitar o "Warm Start" da Lambda (reaproveita conexões)
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

    // Executa o Caso de Uso
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

    // Tratamento básico de erro
    // Se a mensagem for conhecida (regras de domínio), retorna 400 (Bad Request)
    // Se for erro técnico (banco, aws), retorna 500 (Internal Server Error)
    
    // Dica: Em produção, evitar expor detalhes do erro 500 para o cliente
    const isDomainError = error.message.includes("consumo") || error.message.includes("timestamp");
    
    return {
      statusCode: isDomainError ? 400 : 500,
      body: JSON.stringify({ 
        error: error.message || "Erro interno do servidor." 
      }),
    };
  }
};