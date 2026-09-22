import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MedicaoCard } from '../components/MedicaoCard';
import { MensagemEstado } from '../components/MensagemEstado';
import { ResumoStatus } from '../components/ResumoStatus';
import { api, BASE_URL } from '../services/api';
import { Medicao } from '../types/medicao';

const mensagemDeErro = (erro: unknown): string =>
  erro instanceof Error ? erro.message : 'Erro inesperado ao falar com a API.';

export const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Fonte da lista: sempre a API (nada é gerado no celular)
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [simulando, setSimulando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // GET /api/medicoes: ao abrir o app, no "puxar para atualizar", em Tentar novamente e após cada simulação.
  // O erro só é limpo quando a lista chega com sucesso.
  const carregarMedicoes = useCallback(async () => {
    setCarregando(true);
    try {
      setMedicoes(await api.listarMedicoes());
      setErro(null);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarMedicoes();
  }, [carregarMedicoes]);

  // POST /api/medicoes/simular no backend e, em seguida, recarrega a lista
  const simularColeta = async () => {
    setSimulando(true);
    try {
      await api.simularColeta();
      await carregarMedicoes();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSimulando(false);
    }
  };

  const ocupado = carregando || simulando;
  const listaVazia = medicoes.length === 0;
  const textoAndamento = simulando ? 'Simulando coleta no servidor...' : 'Atualizando a lista...';

  const totalTexto = `${medicoes.length} ${medicoes.length === 1 ? 'medição' : 'medições'} no servidor`;
  const resumo = listaVazia && ocupado ? 'Consultando a API...' : listaVazia && erro ? 'Sem resposta da API' : totalTexto;

  const renderConteudo = () => {
    if (ocupado && listaVazia) {
      return (
        <MensagemEstado
          carregando
          titulo={simulando ? 'Simulando coleta no servidor...' : 'Carregando medições...'}
          descricao={`Consultando ${BASE_URL}`}
        />
      );
    }

    if (erro && listaVazia) {
      return (
        <MensagemEstado
          titulo="Não foi possível carregar as medições"
          descricao={erro}
          acao={{ rotulo: 'Tentar novamente', onPress: carregarMedicoes }}
        />
      );
    }

    return (
      <FlatList
        data={medicoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MedicaoCard medicao={item} />}
        contentContainerStyle={[
          styles.lista,
          { paddingBottom: 100 + insets.bottom },
          listaVazia && styles.listaVazia,
        ]}
        refreshing={carregando}
        onRefresh={carregarMedicoes}
        ListHeaderComponent={
          ocupado ? (
            <View style={styles.andamento}>
              <ActivityIndicator size="small" color="#2E7D32" />
              <Text style={styles.andamentoTexto}>{textoAndamento}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <MensagemEstado
            titulo="Nenhuma medição registrada"
            descricao="Toque em Simular coleta para gerar as primeiras leituras no servidor."
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.appName}>VerdeSmart</Text>
        <Text style={styles.subtitle}>Monitoramento de Vegetação em Rodovias</Text>
        <Text style={styles.info}>
          {resumo} · API: {BASE_URL}
        </Text>
        {!listaVazia ? <ResumoStatus medicoes={medicoes} /> : null}
      </View>

      {erro && !listaVazia ? (
        <View style={styles.aviso} accessibilityRole="alert">
          <Text style={styles.avisoTexto}>{erro}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={carregarMedicoes} disabled={ocupado}>
            <Text style={styles.avisoAcao}>{carregando ? 'Tentando novamente...' : 'Tentar novamente'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {renderConteudo()}

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled: ocupado }}
        style={[styles.botao, { bottom: 24 + insets.bottom }, ocupado && styles.botaoDesabilitado]}
        onPress={simularColeta}
        disabled={ocupado}
        activeOpacity={0.8}
      >
        {simulando ? <ActivityIndicator color="#FFFFFF" style={styles.botaoIndicador} /> : null}
        <Text style={styles.botaoTexto}>{simulando ? 'Simulando coleta...' : 'Simular coleta'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#C8E6C9',
    marginBottom: 12,
  },
  info: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.85,
  },
  aviso: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  avisoTexto: {
    color: '#B71C1C',
    fontSize: 13,
    lineHeight: 18,
  },
  avisoAcao: {
    color: '#B71C1C',
    fontWeight: 'bold',
    marginTop: 8,
  },
  andamento: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  andamentoTexto: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '600',
  },
  lista: {
    padding: 16,
  },
  listaVazia: {
    flexGrow: 1,
  },
  botao: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.30)',
    elevation: 8,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoIndicador: {
    marginRight: 10,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
