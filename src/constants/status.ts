import { StatusMedicao } from '../types/medicao';

// Aparência de cada status devolvido pela API (mesmas cores da Sprint 1)
export const STATUS_INFO: Record<StatusMedicao, { label: string; cor: string; descricao: string }> = {
  NORMAL: { label: 'NORMAL', cor: '#4CAF50', descricao: 'dentro da faixa ideal' },
  ALERTA: { label: 'ALERTA', cor: '#FF9800', descricao: 'perto de um limite' },
  CRITICO: { label: 'CRÍTICO', cor: '#F44336', descricao: 'fora da faixa' },
};

export const ORDEM_STATUS: StatusMedicao[] = ['NORMAL', 'ALERTA', 'CRITICO'];
