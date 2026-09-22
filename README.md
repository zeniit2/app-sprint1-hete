# VerdeSmart - Sprint 3 (Integração Mobile + Backend)

Aplicativo em **React Native (Expo + TypeScript)** do projeto **VerdeSmart** (cortador de grama autônomo) - FIAP Mecatrônica. Nesta sprint o app deixa de simular dados no celular e passa a consumir a API **Spring Boot** do projeto: lista as medições reais dos sensores e dispara novas coletas no servidor.

- Backend (Spring Boot): https://github.com/zeniit2/monitoramento-api-sprint1
- Frontend (este repositório): https://github.com/zeniit2/app-sprint1-hete

## O que o sistema monitora

O cortador autônomo percorre trechos de rodovia com sensores embarcados. A API guarda os **sensores** (nome, tipo, unidade e faixa de operação) e as **medições** que eles produzem. Cada medição recebe, no servidor, um status em relação à faixa do sensor:

- **NORMAL** (verde): dentro da faixa ideal
- **ALERTA** (laranja): perto do limite mínimo ou máximo
- **CRÍTICO** (vermelho): fora da faixa

Sensores cadastrados pelo backend: altura da vegetação (cm), umidade do solo (%), inclinação do terreno (graus), temperatura (°C), densidade da vegetação (%), obstáculos (cm), crescimento NDVI (índice) e GPS (sem faixa, não entra na simulação).

## Sobre a Sprint

- **Sprints 1 e 2:** as medições eram geradas na própria interface (`Math.random` + `useState`).
- **Sprint 3:** ao abrir, o app faz `GET` na API e lista as medições; o botão **Simular coleta** faz `POST` no backend e recarrega a lista. Nada é gerado no celular, e o status exibido é o que a API devolve.

## Tecnologias

- React Native + Expo (SDK 55) e TypeScript
- `fetch` nativo encapsulado em `src/services/api.ts` (com timeout de 10 s)
- `useState` / `useEffect` para os estados da tela: carregando, erro e sucesso
- `expo-constants` e `expo-device` para descobrir o endereço da API conforme o ambiente
- `react-native-safe-area-context` para respeitar as áreas seguras (status bar e barra de navegação) no celular

## Estrutura

```
src/
  types/
    sensor.ts               # Sensor (espelha o JSON da API)
    medicao.ts              # Medicao + StatusMedicao
  interfaces/
    MonitoramentoService.ts # contrato da camada de serviços
    NovaMedicao.ts          # corpo do POST /api/medicoes
  services/
    api.ts                  # BASE_URL, fetch, timeout e erros: único lugar que fala HTTP
  constants/
    status.ts               # rótulo e cor de cada status
  utils/
    formatadores.ts         # data, valor + unidade e faixa ideal
  components/
    MedicaoCard.tsx         # card de uma medição
    ResumoStatus.tsx        # contadores NORMAL / ALERTA / CRÍTICO
    MensagemEstado.tsx      # blocos de carregando, erro e lista vazia
  screens/
    DashboardScreen.tsx     # tela principal: estado, lista e botão
```

A tela não monta URL nem chama `fetch`: ela só usa as funções de `api.ts`.

## Tipagem alinhada à API

```ts
export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
  // extras que a API também envia
  local?: string;
  limiteMinimo?: number | null;
  limiteMaximo?: number | null;
  ativo?: boolean;
};

export type StatusMedicao = 'NORMAL' | 'ALERTA' | 'CRITICO';

export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: string; // ISO 8601, ex.: "2026-09-21T21:40:00"
  status: StatusMedicao;
};
```

`data` é `string` porque a API devolve a data em ISO 8601; a conversão para `dd/MM/yyyy HH:mm` acontece só na exibição (`utils/formatadores.ts`).

## Camada de serviços (`src/services/api.ts`)

| Função                   | Chamada HTTP                  | Uso na tela                          |
| ------------------------ | ----------------------------- | ------------------------------------ |
| `api.listarMedicoes()`   | `GET /api/medicoes`           | ao abrir, ao atualizar e após simular |
| `api.simularColeta()`    | `POST /api/medicoes/simular`  | botão **Simular coleta**             |
| `api.listarSensores()`   | `GET /api/sensores`           | disponível para telas futuras        |
| `api.registrarMedicao()` | `POST /api/medicoes`          | disponível para telas futuras (registro manual) |

Falhas de rede, timeout e respostas HTTP de erro viram um `ErroApi` com mensagem pronta para a tela.

## Status na tela

O backend calcula o status a partir da faixa de cada sensor (crítico fora da faixa, alerta a menos de 15% da largura da faixa de um limite, normal no centro) e devolve `status` no JSON. O app usa esse valor direto: cor da borda e do selo do card, contadores no cabeçalho e a faixa ideal impressa no card para explicar a classificação.

## Como executar

### 1. Backend (porta 8080)

Na pasta do repositório do backend (Java 17 + Maven):

```bash
mvn spring-boot:run
```

Confirme que a API responde JSON antes de abrir o app:

```bash
curl http://localhost:8080/api/medicoes
```

### 2. App

Na pasta deste repositório:

```bash
npm install
npx expo start
```

Em seguida pressione `w` (navegador), `a` (emulador Android) ou leia o QR Code com o **Expo Go** no celular. As duas stacks precisam estar no ar ao mesmo tempo.

## BASE_URL

O endereço da API fica em `src/services/api.ts` e é escolhido conforme o ambiente:

| Onde o app roda                 | BASE_URL                    | Como o app descobre                          |
| ------------------------------- | --------------------------- | -------------------------------------------- |
| Navegador (web) / simulador iOS | `http://localhost:8080`     | `Platform.OS`                                |
| Emulador Android                | `http://10.0.2.2:8080`      | Android sem ser dispositivo físico            |
| Celular físico (Expo Go)        | `http://IP_DA_MAQUINA:8080` | IP do Metro (`Constants.expoConfig.hostUri`) |

Para forçar um endereço (por exemplo, se o Wi-Fi tiver mais de uma rede), copie `.env.example` para `.env`, defina `EXPO_PUBLIC_API_URL=http://192.168.0.10:8080` e reinicie o Expo. No celular físico, computador e celular precisam estar na mesma rede e o firewall do Windows precisa liberar a porta 8080 para o `java.exe`. O endereço em uso aparece no cabeçalho da tela.

Casos especiais: com `npx expo start --tunnel` o app não consegue deduzir o IP da máquina, então o `.env` é obrigatório; com o celular no cabo USB, `adb reverse tcp:8080 tcp:8080` faz `http://localhost:8080` funcionar no aparelho.

## Endpoints usados pelo app

Chamados pela tela nesta sprint:

| Método | Endpoint                | O que faz                                                                        | Resposta |
| ------ | ----------------------- | -------------------------------------------------------------------------------- | -------- |
| GET    | `/api/medicoes`         | Histórico de medições, mais recente primeiro, com sensor e status                | 200      |
| POST   | `/api/medicoes/simular` | Gera e grava uma leitura para cada sensor ativo com faixa (o GPS fica de fora)   | 201      |

Também encapsulados em `api.ts`, disponíveis para telas futuras:

| Método | Endpoint                | O que faz                                                          | Resposta |
| ------ | ----------------------- | ------------------------------------------------------------------ | -------- |
| GET    | `/api/sensores`         | Lista os sensores cadastrados                                      | 200      |
| POST   | `/api/medicoes`         | Registra uma leitura manual `{ "sensorId": 1, "valor": 18.5 }`     | 201      |

Os controllers do backend têm `@CrossOrigin(origins = "*")`, o que libera o app rodando em outra porta/origem.

## O que o botão "Simular coleta" faz

1. Desabilita o botão e mostra "Simulando coleta...".
2. Chama `api.simularColeta()` → `POST /api/medicoes/simular`. O servidor sorteia um valor para cada sensor ativo com faixa cadastrada (7 dos 8 sensores iniciais; o valor pode ultrapassar os limites), calcula o status e persiste no H2.
3. Chama `api.listarMedicoes()` → `GET /api/medicoes` e substitui a lista pela resposta.

A lista também pode ser atualizada puxando-a para baixo (pull to refresh), que só faz o `GET`.

## Se o backend estiver parado

- Ao abrir: a tela mostra "Não foi possível carregar as medições", a mensagem "Não foi possível conectar ao backend em http://...:8080" e o botão **Tentar novamente**.
- Ao simular com a lista já carregada: a lista permanece e aparece um aviso vermelho no topo com a mesma mensagem e **Tentar novamente**.
- Nenhuma medição é inventada no celular; quando o backend voltar, **Tentar novamente** recarrega o histórico persistido.

## Verificação

```bash
npx tsc --noEmit
```

Roteiro manual: suba a API, abra o app e confira a lista; toque em **Simular coleta** e veja as novas medições no topo com data/hora e status; recarregue a página e confira que o histórico continua (vem do H2); pare a API, toque em **Simular coleta** e veja o erro; religue a API e toque em **Tentar novamente**.

## Grupo

| RM     | Nome                       |
| ------ | -------------------------- |
| 563318 | Christopher Takeuti        |
| 565268 | Erick Lima                 |
| 564390 | Luiz Henrique de Almeida   |
| 564021 | Mateus Bustamante          |
| 565575 | Pedro Lopes                |

Entrega: arquivo `entregavel-sprint3.txt` com integrantes e links dos dois repositórios.
