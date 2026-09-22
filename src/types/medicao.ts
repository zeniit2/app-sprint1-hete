import { Sensor } from './sensor';

// Status calculado pelo backend (MedicaoService) a partir da faixa de cada sensor.
export type StatusMedicao = 'NORMAL' | 'ALERTA' | 'CRITICO';

// Espelha o JSON de Medicao devolvido pela API (GET /api/medicoes).
export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: string; // ISO 8601 vindo da API, ex.: "2026-09-21T21:40:00" (formatado só na exibição)
  status: StatusMedicao;
};
