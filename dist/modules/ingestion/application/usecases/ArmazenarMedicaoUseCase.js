"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmazenarMedicaoUseCase = void 0;
const Medicao_1 = require("../../domain/entities/Medicao");
class ArmazenarMedicaoUseCase {
    medicaoRepository;
    eventPublisher;
    constructor(medicaoRepository, eventPublisher) {
        this.medicaoRepository = medicaoRepository;
        this.eventPublisher = eventPublisher;
    }
    async executar(dados) {
        const dataObj = typeof dados.timestamp === 'string'
            ? new Date(dados.timestamp)
            : dados.timestamp;
        const medicao = new Medicao_1.Medicao(dados.dispositivoId, dados.consumo, dataObj);
        await this.medicaoRepository.salvar(medicao);
        await this.eventPublisher.publicar({
            type: "MedicaoRecebida",
            data: {
                dispositivoId: medicao.dispositivoId,
                consumo: medicao.consumo,
                timestamp: medicao.timestamp.toISOString(),
            },
        });
        console.log(`[UseCase] Medição do dispositivo ${medicao.dispositivoId} processada com sucesso.`);
    }
}
exports.ArmazenarMedicaoUseCase = ArmazenarMedicaoUseCase;
