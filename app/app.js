import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { inicializarBanco, listarDestinos, inserirDestino, atualizarDestino, deletarDestino } from '../db';
import DestinoForm from '../components/DestinoForm';
import DestinoItem from '../components/DestinoItem';

export default function App() {
  const [destinos, setDestinos] = useState([]);
  const [localAtual, setLocalAtual] = useState(null);

  useEffect(() => {
    inicializarBanco();
    carregarDestinos();
    obterLocalizacao();
  }, []);

  const carregarDestinos = () => {
    const dados = listarDestinos();
    setDestinos(dados);
  };

  const obterLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão negada para acessar localização');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocalAtual(location.coords);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: -22.2375,   // Nova Andradina - MS
          longitude: -53.3439,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {localAtual && (
          <Marker
            coordinate={localAtual}
            title="Você está aqui"
            pinColor="blue"
          />
        )}
        {destinos.map((destino) => (
          <Marker
            key={destino.id}
            coordinate={{ latitude: destino.latitude, longitude: destino.longitude }}
            title={`Destino #${destino.id}`}
          />
        ))}
      </MapView>

      <View style={styles.form}>
        <Text style={styles.titulo}>Adicionar Destino</Text>
        <DestinoForm 
          onSalvar={(lat, lon) => { 
            inserirDestino(lat, lon); 
            carregarDestinos(); // recarrega lista e mapa
          }} 
        />
      </View>

      <FlatList
        data={destinos}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <DestinoItem
            destino={item}
            localAtual={localAtual}
            onAtualizar={(lat, lon) => { 
              atualizarDestino(item.id, lat, lon); 
              carregarDestinos(); // recarrega lista e mapa
            }}
            onDeletar={() => { 
              deletarDestino(item.id); 
              carregarDestinos(); // recarrega lista e mapa
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapa: { flex: 1 },
  form: { padding: 10, backgroundColor: '#fff' },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});
