import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

const region = process.env.AWS_REGION || "us-east-1";
const isOffline = process.env.IS_OFFLINE; // Variável injetada pelo plugin

// Configuração Dinâmica do DynamoDB
const dbConfig = isOffline
  ? {
      region: "localhost",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "MOCK_ACCESS_KEY",
        secretAccessKey: "MOCK_SECRET_KEY",
      },
    }
  : { region };

// Inicializa DynamoDB
const dbClient = new DynamoDBClient(dbConfig);
export const dynamoDbClient = DynamoDBDocumentClient.from(dbClient);

export const eventBridgeClient = new EventBridgeClient({ region });