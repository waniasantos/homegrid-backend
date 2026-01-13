import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ListarMedicoesUseCase } from "../../application/usecases/ListarMedicoesUseCase";
import { DynamoDBMedicaoRepository } from "../../infrastructure/repositories/DynamoDBMedicaoRepository";

const medicaoRepository = new DynamoDBMedicaoRepository();
const listarMedicoesUseCase = new ListarMedicoesUseCase(medicaoRepository);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("[Handler] Listando todas as medições");

    const limit = Number(event.queryStringParameters?.limit || 100);

    const medicoes = await listarMedicoesUseCase.executar(limit);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        medicoes,
        count: medicoes.length,
      }),
    };
  } catch (error: any) {
    console.error("[Handler] Erro:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
