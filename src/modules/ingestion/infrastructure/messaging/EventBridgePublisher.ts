import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { eventBridgeClient } from "../../../../shared/infra/awsClients";
import { IEventPublisher } from "../../application/interfaces/IEventPublisher";

export class EventBridgePublisher implements IEventPublisher {
  async publicar(event: any): Promise<void> {
    const params = new PutEventsCommand({
      Entries: [
        {
          Source: "homegrid.ingestion",
          DetailType: event.type,
          Detail: JSON.stringify(event.data),
          EventBusName: process.env.EVENT_BUS_NAME || "HomeGridEventBus",
        },
      ],
    });

    try {
      await eventBridgeClient.send(params);
      console.log(`[EventBridge] Evento '${event.type}' publicado.`);
    } catch (error) {
      console.error("[EventBridge] Erro ao publicar evento:", error);
      throw error;
    }
  }
}
