import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { MonitoramentoService } from '../interfaces/MonitoramentoService';
import { NovaMedicao } from '../interfaces/NovaMedicao';
import { Medicao } from '../types/medicao';
import { Sensor } from '../types/sensor';

const PORTA_API = 8080;
const TIMEOUT_MS = 10000;

/**
 * Endereço da API conforme o ambiente (ver README):
 *   - Web / simulador iOS ........ http://localhost:8080
 *   - Emulador Android ........... http://10.0.2.2:8080   (10.0.2.2 = "localhost" do computador)
 *   - Celular físico (Expo Go) ... http://IP_DA_MAQUINA:8080 (mesmo IP que o Metro já usa)
 *
 * Para forçar um endereço, defina EXPO_PUBLIC_API_URL no arquivo .env (ver .env.example).
 */
const resolverBaseUrl = (): string => {
  const urlForcada = process.env.EXPO_PUBLIC_API_URL;
  if (urlForcada) return urlForcada.replace(/\/+$/, '');

  if (Platform.OS === 'web') return `http://localhost:${PORTA_API}`;

  if (Platform.OS === 'android' && !Device.isDevice) return `http://10.0.2.2:${PORTA_API}`;

  // Celular físico: hostUri = "192.168.0.10:8081" (IP da máquina onde o Expo está rodando).
  // Só vale quando é um IPv4 da rede local; no modo --tunnel o host é um domínio do Expo
  // que não aponta para a API, e aí é preciso definir EXPO_PUBLIC_API_URL.
  const hostMetro = Constants.expoConfig?.hostUri?.split(':')[0];
  if (Device.isDevice && hostMetro && /^\d{1,3}(\.\d{1,3}){3}$/.test(hostMetro)) {
    return `http://${hostMetro}:${PORTA_API}`;
  }

  return `http://localhost:${PORTA_API}`;
};

export const BASE_URL = resolverBaseUrl();

// Erro lançado pela camada de serviços; a tela só mostra a mensagem
export class ErroApi extends Error {
  constructor(mensagem: string, readonly status?: number) {
    super(mensagem);
    this.name = 'ErroApi';
  }
}

// Único ponto que fala HTTP: monta a URL, aplica timeout e traduz falhas em ErroApi
const requisitar = async <T>(caminho: string, opcoes: RequestInit = {}): Promise<T> => {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), TIMEOUT_MS);
  let resposta: Response;

  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      ...opcoes,
      signal: controle.signal,
      headers: {
        Accept: 'application/json',
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  } catch (erro) {
    const motivo =
      erro instanceof Error && erro.name === 'AbortError' ? 'tempo de resposta esgotado' : 'falha de conexão';
    throw new ErroApi(
      `Não foi possível conectar ao backend em ${BASE_URL} (${motivo}). Verifique se a API está no ar.`,
    );
  } finally {
    clearTimeout(temporizador);
  }

  if (!resposta.ok) {
    throw new ErroApi(`A API respondeu com erro HTTP ${resposta.status} em ${caminho}.`, resposta.status);
  }

  return (await resposta.json()) as T;
};

// Funções que a tela usa. Cada uma corresponde a um endpoint da API Spring Boot.
export const api: MonitoramentoService = {
  listarSensores: () => requisitar<Sensor[]>('/api/sensores'),

  listarMedicoes: () => requisitar<Medicao[]>('/api/medicoes'),

  registrarMedicao: (nova: NovaMedicao) =>
    requisitar<Medicao>('/api/medicoes', { method: 'POST', body: JSON.stringify(nova) }),

  simularColeta: () => requisitar<Medicao[]>('/api/medicoes/simular', { method: 'POST' }),
};
