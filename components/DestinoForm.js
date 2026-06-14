import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';

export default function DestinoForm({ onSalvar }) {
  const [endereco, setEndereco] = useState('');

  const salvarDestino = async () => {
    try {
      const resultado = await Location.geocodeAsync(endereco);
      if (resultado.length > 0) {
        const { latitude, longitude } = resultado[0];
        onSalvar(latitude, longitude);
        setEndereco('');
      } else {
        alert('Endereço não encontrado');
      }
    } catch (error) {
      alert('Erro ao buscar endereço');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Digite o endereço"
        value={endereco}
        onChangeText={setEndereco}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Buscar e Marcar" onPress={salvarDestino} />
    </View>
  );
}
