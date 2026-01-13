export class CalculadoraEstatistica {
  calcularMedia(valores: number[]): number {
    if (valores.length === 0) return 0;
    const soma = valores.reduce((acc, val) => acc + val, 0);
    return soma / valores.length;
  }

  calcularDesvioPadrao(valores: number[]): number {
    if (valores.length === 0) return 0;
    const media = this.calcularMedia(valores);
    const variancia = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
    return Math.sqrt(variancia);
  }

  ehAnomalia(valorAtual: number, media: number, desvioPadrao: number, limiar: number = 2): boolean {
    return Math.abs(valorAtual - media) > limiar * desvioPadrao;
  }
}
