import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Medicao } from '../types/medicao';
import { ORDEM_STATUS, STATUS_INFO } from '../constants/status';

type Props = {
  medicoes: Medicao[];
};

// Contadores NORMAL / ALERTA / CRÍTICO calculados sobre a lista vinda da API
export const ResumoStatus: React.FC<Props> = ({ medicoes }) => (
  <View style={styles.linha}>
    {ORDEM_STATUS.map((status) => {
      const total = medicoes.filter((medicao) => medicao.status === status).length;
      return (
        <View key={status} style={[styles.chip, { backgroundColor: STATUS_INFO[status].cor }]}>
          <Text style={styles.total}>{total}</Text>
          <Text style={styles.label}>{STATUS_INFO[status].label}</Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  total: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
