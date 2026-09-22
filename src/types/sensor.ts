// Espelha o JSON de Sensor devolvido pela API
// (GET /api/sensores e o campo "sensor" de cada Medicao).
export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
  // Campos extras que a API também envia (a tela usa a faixa para explicar o status)
  local?: string;
  limiteMinimo?: number | null;
  limiteMaximo?: number | null;
  ativo?: boolean;
};
