# Homegrid Backend

## Visão Geral
O Homegrid Backend é uma aplicação modular desenvolvida para gerenciar e processar dados relacionados a medições e detecção de anomalias. A arquitetura segue os princípios da Clean Architecture, garantindo separação de responsabilidades e facilidade de manutenção.

## Estrutura de Pastas
A estrutura do projeto está organizada da seguinte forma:

```
modules/
  detector/
    application/
      interfaces/
        IAnomaliaRepository.ts
      usecases/
        DetectarAnomaliaUseCase.ts
    domain/
      entities/
        Anomalia.ts
    infrastructure/
      repositories/
        DynamoDBAnomaliaRepository.ts
      services/
        CalculadoraEstatistica.ts
    interfaces/
      eventbridge/
        detectarAnomaliaHandler.ts
      http/
        listarAnomaliasHandler.ts
  ingestion/
    application/
      interfaces/
        IEventPublisher.ts
        IMedicaoRepository.ts
      usecases/
        ArmazenarMedicaoUseCase.ts
        ListarMedicoesUseCase.ts
    domain/
      entities/
        Medicao.ts
    infrastructure/
      messaging/
        EventBridgePublisher.ts
      repositories/
        DynamoDBMedicaoRepository.ts
    interfaces/
      http/
        armazenarMedicaoHandler.ts
        listarMedicoesHandler.ts
shared/
  domain/
  infra/
    awsClients.ts
```

### Descrição dos Módulos

#### **Módulo `detector`**
Responsável por detectar anomalias nos dados.

- **`application/`**: Contém a lógica de aplicação.
  - **`interfaces/IAnomaliaRepository.ts`**: Define a interface para o repositório de anomalias.
  - **`usecases/DetectarAnomaliaUseCase.ts`**: Implementa o caso de uso para detectar anomalias.
- **`domain/`**: Define as entidades e regras de negócio.
  - **`entities/Anomalia.ts`**: Representa o modelo de domínio para anomalias.
- **`infrastructure/`**: Implementa interfaces e gerencia a comunicação com serviços externos.
  - **`repositories/DynamoDBAnomaliaRepository.ts`**: Implementação do repositório de anomalias usando DynamoDB.
  - **`services/CalculadoraEstatistica.ts`**: Serviço para cálculos estatísticos usados na detecção de anomalias.
- **`interfaces/`**: Define os pontos de entrada.
  - **`eventbridge/detectarAnomaliaHandler.ts`**: Handler para eventos do EventBridge.
  - **`http/listarAnomaliasHandler.ts`**: Handler HTTP para listar anomalias.

#### **Módulo `ingestion`**
Responsável por ingerir e armazenar medições.

- **`application/`**: Contém a lógica de aplicação.
  - **`interfaces/IEventPublisher.ts`**: Define a interface para publicação de eventos.
  - **`interfaces/IMedicaoRepository.ts`**: Define a interface para o repositório de medições.
  - **`usecases/ArmazenarMedicaoUseCase.ts`**: Caso de uso para armazenar medições.
  - **`usecases/ListarMedicoesUseCase.ts`**: Caso de uso para listar medições.
- **`domain/`**: Define as entidades e regras de negócio.
  - **`entities/Medicao.ts`**: Representa o modelo de domínio para medições.
- **`infrastructure/`**: Implementa interfaces e gerencia a comunicação com serviços externos.
  - **`messaging/EventBridgePublisher.ts`**: Publica eventos no EventBridge.
  - **`repositories/DynamoDBMedicaoRepository.ts`**: Implementação do repositório de medições usando DynamoDB.
- **`interfaces/`**: Define os pontos de entrada.
  - **`http/armazenarMedicaoHandler.ts`**: Handler HTTP para armazenar medições.
  - **`http/listarMedicoesHandler.ts`**: Handler HTTP para listar medições.

#### **Módulo `shared`**
Contém código compartilhado entre os módulos.

- **`domain/`**: Classes ou interfaces de domínio reutilizáveis.
- **`infra/awsClients.ts`**: Configura e gerencia clientes AWS, como DynamoDB e EventBridge.

---

## Arquitetura
A aplicação segue os princípios da Clean Architecture e do Event-Driven Architecture, com separação clara entre camadas e comunicação baseada em eventos. Essa combinação permite uma aplicação modular, escalável e de fácil manutenção:

1. **Application**: Contém os casos de uso e interfaces.
2. **Domain**: Define as entidades e regras de negócio.
3. **Infrastructure**: Implementa interfaces e gerencia a comunicação com serviços externos.
4. **Interfaces**: Define os pontos de entrada, como handlers HTTP ou de eventos.

Para mais detalhes sobre os diagramas de classes, contexto e container, acesse o link abaixo:

[Diagramas de Arquitetura](https://drive.google.com/file/d/1H9vrjfrFE70n_pkOChqLGljf5uRrX35c/view?usp=sharing)

---

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **AWS DynamoDB**: Banco de dados NoSQL.
- **AWS EventBridge**: Serviço de barramento de eventos.
- **Serverless Framework**: Gerenciamento de infraestrutura como código.
