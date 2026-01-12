import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbClient } from "../../../../shared/infra/awsClients";
import { IMedicaoRepository } from "../../application/interfaces/IMedicaoRepository";
import { Medicao } from "../../domain/entities/Medicao";

export class DynamoDBMedicaoRepository implements IMedicaoRepository {
  // Nome da tabela vem das variáveis de ambiente (definidas no serverless.yml futuramente)
  private tableName = process.env.MEDICOES_TABLE_NAME || "HomeGrid_Medicoes";

  async salvar(medicao: Medicao): Promise<void> {
    const params = new PutCommand({
      TableName: this.tableName,
      Item: {
        // Partition Key (PK)
        dispositivoId: medicao.dispositivoId, 
        // Sort Key (SK) - data ISO para permitir ordenação cronológica
        timestamp: medicao.timestamp.toISOString(), 
        consumo: medicao.consumo,
        // Atributo útil para queries futuras (GSI)
        tipo: "MEDICAO" 
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
}