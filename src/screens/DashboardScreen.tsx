import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MedicaoCard } from '../components/MedicaoCard';
import { Medicao, StatusMedicao } from '../types/medicao';

const SENSORES = [
  'Altura da Vegetação (cm)',
  'Umidade do Solo (%)',
  'Temperatura (°C)',
  'Densidade da Vegetação (%)',
  'Inclinação do Terreno (°)',
];

const classificarStatus = (valor: number): StatusMedicao => {
  if (valor < 40) return 'normal';
  if (valor < 70) return 'alerta';
  return 'critico';
};

const gerarMedicoes = (): Medicao[] =>
  SENSORES.map((sensor, index) => {
    const valor = Math.random() * 100;
    return {
      id: index + 1,
      sensor,
      valor,
      status: classificarStatus(valor),
    };
  });

export const DashboardScreen: React.FC = () => {
  const [medicoes, setMedicoes] = useState<Medicao[]>(gerarMedicoes);
  const [coletas, setColetas] = useState(1);

  const novaColeta = () => {
    setMedicoes(gerarMedicoes());
    setColetas((c) => c + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>VerdeSmart</Text>
        <Text style={styles.subtitle}>Monitoramento de Vegetação em Rodovias</Text>
        <Text style={styles.coletas}>Coleta #{coletas}</Text>
      </View>

      <FlatList
        data={medicoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MedicaoCard medicao={item} />}
        contentContainerStyle={styles.lista}
      />

      <TouchableOpacity style={styles.botao} onPress={novaColeta} activeOpacity={0.8}>
        <Text style={styles.botaoTexto}>Gerar Novas Medições</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    paddingTop: 50,
    paddingBottom: 24,
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
  coletas: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.85,
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
  },
  botao: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
