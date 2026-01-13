import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBAnomaliaRepository } from "../../infrastructure/repositories/DynamoDBAnomaliaRepository";

const anomaliaRepository = new DynamoDBAnomaliaRepository();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("[Handler] Listando anomalias");

    const limit = Number(event.queryStringParameters?.limit || 50);
    const anomalias = await anomaliaRepository.listarTodas(limit);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: anomalias,
        count: anomalias.length,
        updatedAt: new Date().toISOString()
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
