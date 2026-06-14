import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export default function DestinoItem({ destino, onAtualizar, onDeletar, localAtual }) {
  const [lat, setLat] = useState(destino.latitude?.toString() || '');
  const [lon, setLon] = useState(destino.longitude?.toString() || '');

  const calcularDistancia = () => {
    if (!localAtual || !destino.latitude || !destino.longitude) return null;
    const R = 6371; // raio da Terra em km
    const dLat = (destino.latitude - localAtual.latitude) * Math.PI / 180;
    const dLon = (destino.longitude - localAtual.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(localAtual.latitude * Math.PI/180) * Math.cos(destino.latitude * Math.PI/180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const handleAtualizar = () => {
    if (!lat || !lon) {
      alert("Preencha latitude e longitude");
      return;
    }
    onAtualizar(Number(lat), Number(lon));
  };

  return (
    <View style={{ marginVertical: 10, padding: 10, borderWidth: 1 }}>
      <Text>Destino #{destino.id ?? 'novo'}</Text>

      <TextInput
        placeholder="Latitude"
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        placeholder="Longitude"
        value={lon}
        onChangeText={setLon}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />

      <Button title="Atualizar" onPress={handleAtualizar} />
      <Button title="Deletar" onPress={onDeletar} color="red" />

      {localAtual && <Text>Distância até aqui: {calcularDistancia()} km</Text>}
    </View>
  );
}
