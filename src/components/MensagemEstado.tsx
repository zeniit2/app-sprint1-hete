import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

type Props = {
  titulo: string;
  descricao?: string;
  carregando?: boolean;
  acao?: {
    rotulo: string;
    onPress: () => void;
  };
};

// Bloco centralizado usado nos estados "carregando", "erro" e "lista vazia"
export const MensagemEstado: React.FC<Props> = ({ titulo, descricao, carregando, acao }) => (
  <View style={styles.container}>
    {carregando ? <ActivityIndicator size="large" color="#2E7D32" style={styles.indicador} /> : null}
    <Text style={styles.titulo}>{titulo}</Text>
    {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
    {acao ? (
      <TouchableOpacity style={styles.botao} onPress={acao.onPress} activeOpacity={0.8}>
        <Text style={styles.botaoTexto}>{acao.rotulo}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  indicador: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  botao: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  botaoTexto: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
