# VerdeSmart - Sprint 1 (MVP Mobile)

Aplicativo em **React Native (Expo + TypeScript)** que simula um sistema de monitoramento de sensores de vegetação em rodovias. Faz parte do projeto **VerdeSmart** (cortador de grama autônomo) - FIAP Mecatrônica.

## Sobre a Sprint

MVP visual standalone que exibe medições simuladas de sensores, sem integração com backend. A cada toque no botão, novas medições são geradas e classificadas em três níveis:

- **NORMAL** (verde)
- **ALERTA** (laranja)
- **CRÍTICO** (vermelho)

## Tecnologias

- React Native + Expo
- TypeScript
- `useState` para gerenciamento de estado local

## Estrutura

```
src/
  components/
    MedicaoCard.tsx     # Card de exibição de uma medição
  screens/
    DashboardScreen.tsx # Tela principal com lista e botão
  types/
    medicao.ts          # Tipagem da Medicao
```

## Tipagem principal

```ts
type Medicao = {
  id: number;
  sensor: string;
  valor: number;
  status: "normal" | "alerta" | "critico";
};
```

## Como executar

```bash
npm install
npm start
```

Em seguida, abra o app **Expo Go** no celular e leia o QR Code, ou pressione `a` para abrir no emulador Android / `w` para abrir no navegador.

## Grupo

| RM     | Nome                       |
| ------ | -------------------------- |
| 562129 | Tiago Ferreira             |
| 564021 | Mateus Bustamante          |
| 563318 | Christopher Takeuti        |
| 565268 | Erick Lima                 |
| 565575 | Pedro Lopes                |
| 564390 | Luiz Henrique de Almeida   |
