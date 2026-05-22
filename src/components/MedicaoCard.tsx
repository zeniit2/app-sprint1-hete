import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Medicao, StatusMedicao } from '../types/medicao';

type Props = {
  medicao: Medicao;
};

const STATUS_CONFIG: Record<StatusMedicao, { label: string; cor: string }> = {
  normal: { label: 'NORMAL', cor: '#4CAF50' },
  alerta: { label: 'ALERTA', cor: '#FF9800' },
  critico: { label: 'CRÍTICO', cor: '#F44336' },
};

export const MedicaoCard: React.FC<Props> = ({ medicao }) => {
  const { label, cor } = STATUS_CONFIG[medicao.status];

  return (
    <View style={[styles.card, { borderLeftColor: cor }]}>
      <View style={styles.linhaSuperior}>
        <Text style={styles.sensor}>{medicao.sensor}</Text>
        <View style={[styles.statusBadge, { backgroundColor: cor }]}>
          <Text style={styles.statusText}>{label}</Text>
        </View>
      </View>
      <Text style={styles.valor}>{medicao.valor.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sensor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  valor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
});
