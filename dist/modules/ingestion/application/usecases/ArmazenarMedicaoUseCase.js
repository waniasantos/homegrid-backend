"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmazenarMedicaoUseCase = void 0;
const Medicao_1 = require("../../domain/entities/Medicao");
class ArmazenarMedicaoUseCase {
    medicaoRepository;
    eventPublisher;
    constructor(
    // Injeção de dependência via construtor
    medicaoRepository, eventPublisher) {
        this.medicaoRepository = medicaoRepository;
        this.eventPublisher = eventPublisher;
    }
    async executar(dados) {
        // 1. Converte e cria a entidade de domínio (a validação acontece no construtor da entidade)
        const dataObj = typeof dados.timestamp === 'string'
            ? new Date(dados.timestamp)
            : dados.timestamp;
        const medicao = new Medicao_1.Medicao(dados.dispositivoId, dados.consumo, dataObj);
        // 2. Persiste os dados (usando o contrato, sem saber que é DynamoDB)
        await this.medicaoRepository.salvar(medicao);
        // 3. Publica evento para outros sistemas (usando contrato, sem saber que é EventBridge)
        // Isso é crucial para a arquitetura Event-Driven descrita no PDF
        await this.eventPublisher.publicar(medicao);
        console.log(`[UseCase] Medição do dispositivo ${medicao.dispositivoId} processada com sucesso.`);
    }
}
exports.ArmazenarMedicaoUseCase = ArmazenarMedicaoUseCase;
