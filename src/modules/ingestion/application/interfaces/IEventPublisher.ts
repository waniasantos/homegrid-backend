export interface IEventPublisher {
  publicar(event: any): Promise<void>;
}
