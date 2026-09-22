import { Medicao } from '../types/medicao';
import { Sensor } from '../types/sensor';
import { NovaMedicao } from './NovaMedicao';

// Contrato da camada de serviços: a tela só conhece estas funções,
// nunca monta URL nem chama fetch diretamente.
export interface MonitoramentoService {
  listarSensores(): Promise<Sensor[]>;
  listarMedicoes(): Promise<Medicao[]>;
  registrarMedicao(nova: NovaMedicao): Promise<Medicao>;
  simularColeta(): Promise<Medicao[]>;
}
