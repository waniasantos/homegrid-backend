import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "../../../../shared/infra/awsClients";
import { IMedicaoRepository } from "../../application/interfaces/IMedicaoRepository";
import { Medicao } from "../../domain/entities/Medicao";

export class DynamoDBMedicaoRepository implements IMedicaoRepository {
  private tableName = process.env.MEDICOES_TABLE_NAME || "HomeGrid_Medicoes";

  async salvar(medicao: Medicao): Promise<void> {
    const params = new PutCommand({
      TableName: this.tableName,
      Item: {
        dispositivoId: medicao.dispositivoId,
        timestamp: medicao.timestamp.toISOString(),
        consumo: medicao.consumo,
        tipo: "MEDICAO",
      },
    });

    try {
      await dynamoDbClient.send(params);
      console.log(`[DynamoDB] Item salvo: ${medicao.dispositivoId}`);
    } catch (error) {
      console.error("[DynamoDB] Erro ao salvar item:", error);
      throw new Error("Erro de persistência no banco de dados.");
    }
  }

  async listarTodas(limit: number = 100): Promise<any[]> {
    const params = new ScanCommand({
      TableName: this.tableName,
      Limit: limit,
    });

    try {
      const result = await dynamoDbClient.send(params);
      // Ordenar por timestamp (mais recentes primeiro)
      const items = result.Items || [];
      return items.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error("[DynamoDB] Erro ao scan itens:", error);
      throw new Error("Erro ao consultar banco de dados.");
    }
  }
}
