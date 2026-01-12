"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicao = void 0;
class Medicao {
    dispositivoId;
    consumo;
    timestamp;
    constructor(dispositivoId, consumo, // em kW
    timestamp) {
        this.dispositivoId = dispositivoId;
        this.consumo = consumo;
        this.timestamp = timestamp;
        this.validar();
    }
    validar() {
        if (this.consumo < 0) {
            throw new Error("O consumo não pode ser negativo.");
        }
        if (!this.dispositivoId) {
            throw new Error("O ID do dispositivo é obrigatório.");
        }
        // Regra: Timestamp não pode ser muito no futuro (ex: tolerância de 5 min)
        const agora = new Date();
        const tolerancia = 5 * 60 * 1000;
        if (this.timestamp.getTime() > agora.getTime() + tolerancia) {
            throw new Error("O timestamp da medição está no futuro.");
        }
    }
}
exports.Medicao = Medicao;
