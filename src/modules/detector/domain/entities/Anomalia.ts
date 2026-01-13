export class Anomalia {
  constructor(
    public readonly dispositivoId: string,
    public readonly tipo: string,
    public readonly severidade: "BAIXA" | "MEDIA" | "ALTA",
    public readonly consumoAtual: number,
    public readonly consumoEsperado: number,
    public readonly timestamp: Date
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.dispositivoId) {
      throw new Error("O ID do dispositivo é obrigatório.");
    }
    if (!["BAIXA", "MEDIA", "ALTA"].includes(this.severidade)) {
      throw new Error("Severidade inválida.");
    }
  }

  get percentualDesvio(): number {
    if (this.consumoEsperado === 0) return 0;
    return ((this.consumoAtual - this.consumoEsperado) / this.consumoEsperado) * 100;
  }
}
