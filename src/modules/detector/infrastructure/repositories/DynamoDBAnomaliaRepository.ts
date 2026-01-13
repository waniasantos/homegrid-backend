import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "../../../../shared/infra/awsClients";
import { Anomalia } from "../../domain/entities/Anomalia";
import { IAnomaliaRepository } from "../../application/interfaces/IAnomaliaRepository";

export class DynamoDBAnomaliaRepository implements IAnomaliaRepository {
  private tableName = process.env.ANOMALIAS_TABLE_NAME || "HomeGrid_Anomalias";

  async salvar(anomalia: Anomalia): Promise<void> {
    const id = `${anomalia.dispositivoId}-${Date.now()}`;
    
    const params = new PutCommand({
      TableName: this.tableName,
      Item: {
        id,
        dispositivoId: anomalia.dispositivoId,
        tipo: anomalia.tipo,
        severidade: anomalia.severidade,
        consumoAtual: anomalia.consumoAtual,
        consumoEsperado: anomalia.consumoEsperado,
        percentualDesvio: anomalia.percentualDesvio,
        timestamp: anomalia.timestamp.toISOString(),
      },
    });

    try {
      await dynamoDbClient.send(params);
      console.log("[DynamoDB] Anomalia salva:", id);
    } catch (error) {
      console.error("[DynamoDB] Erro ao salvar anomalia:", error);
      throw error;
    }
  }

  async listarTodas(limit: number = 50): Promise<any[]> {
    const params = new ScanCommand({
      TableName: this.tableName,
      Limit: limit,
    });

    try {
      const result = await dynamoDbClient.send(params);
      const items = result.Items || [];
      return items.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error("[DynamoDB] Erro ao listar anomalias:", error);
      throw error;
    }
  }
}
