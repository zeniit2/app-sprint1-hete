// Corpo do POST /api/medicoes (registro manual de uma leitura).
export interface NovaMedicao {
  sensorId: number;
  valor: number;
}
