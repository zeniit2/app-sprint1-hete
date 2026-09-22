import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Medicao } from '../types/medicao';
import { STATUS_INFO } from '../constants/status';
import { formatarData, formatarFaixa, formatarValor } from '../utils/formatadores';

type Props = {
  medicao: Medicao;
};

// Exibe uma medição vinda da API: sensor, tipo, valor + unidade, data e status
export const MedicaoCard: React.FC<Props> = ({ medicao }) => {
  const { sensor } = medicao;
  const { label, cor } = STATUS_INFO[medicao.status];
  const faixa = formatarFaixa(sensor.limiteMinimo, sensor.limiteMaximo, sensor.unidade);

  return (
    <View style={[styles.card, { borderLeftColor: cor }]}>
      <View style={styles.linhaSuperior}>
        <Text style={styles.sensor}>{sensor.nome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: cor }]}>
          <Text style={styles.statusText}>{label}</Text>
        </View>
      </View>

      <Text style={styles.tipo}>Tipo: {sensor.tipo}</Text>
      <Text style={styles.valor}>{formatarValor(medicao.valor, sensor.unidade)}</Text>

      <View style={styles.rodape}>
        <Text style={styles.detalhe}>{formatarData(medicao.data)}</Text>
        {faixa ? <Text style={styles.detalhe}>Faixa ideal: {faixa}</Text> : null}
      </View>
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.10)',
    elevation: 3,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sensor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
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
  tipo: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  valor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  detalhe: {
    fontSize: 12,
    color: '#666',
  },
});
