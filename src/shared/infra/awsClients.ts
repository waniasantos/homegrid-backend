import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

const region = process.env.AWS_REGION || "us-east-1";
const isOffline = process.env.IS_OFFLINE; 

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

const dbClient = new DynamoDBClient(dbConfig);
export const dynamoDbClient = DynamoDBDocumentClient.from(dbClient);

export const eventBridgeClient = new EventBridgeClient({ region });