import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { eventBridgeClient } from "../../../../shared/infra/awsClients";
import { IEventPublisher } from "../../application/interfaces/IEventPublisher";
import { Medicao } from "../../domain/entities/Medicao";

export class EventBridgePublisher implements IEventPublisher {
  private eventBusName = process.env.EVENT_BUS_NAME || "HomeGridEventBus";

  async publicar(medicao: Medicao): Promise<void> {
    const params = new PutEventsCommand({
      Entries: [
        {
          Source: "homegrid.ingestion", // Quem gerou o evento
          DetailType: "MedicaoRecebida", // O tipo do evento (importante para regras de filtragem)
          EventBusName: this.eventBusName,
          Time: new Date(),
          // O payload do evento
          Detail: JSON.stringify({
            dispositivoId: medicao.dispositivoId,
            consumo: medicao.consumo,
            timestamp: medicao.timestamp.toISOString()
          }),
        },
      ],
    });

    try {
      await eventBridgeClient.send(params);
      console.log(`[EventBridge] Evento 'MedicaoRecebida' publicado.`);
    } catch (error) {
      console.error("[EventBridge] Erro ao publicar evento:", error);
      // Dependendo da criticidade, podemos lançar erro ou apenas logar
      // Aqui vamos lançar para garantir que o fluxo falhe se não conseguir notificar
      throw new Error("Erro ao publicar evento de medição.");
    }
  }
}