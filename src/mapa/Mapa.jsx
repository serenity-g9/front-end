import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, CircularProgress } from '@mui/material';


/*
TODO: passar função para back end;
Usar o cep é mais confiável: se possuir o cep, desconsiderar o restante dos campos e utilizar somente
o cep (buscando do ViaCep). Se não, tentar usar o valor do restante dos campos. Exibir erro caso falhe.
*/
async function buscarCoordenadas(endereco) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&addressdetails=1&limit=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    return { latitude: lat, longitude: lon };
  } else {
    throw new Error('Endereço não encontrado!');
  }
}

const Mapa = ({logradouro, cidade, uf, popup}) => {
  const [coords, setCoords] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const endereco = `${logradouro}, ${cidade}, ${uf}`;
    buscarCoordenadas(endereco)
      .then(coordenadas => {
        setCoords(coordenadas);
      })
      .catch(err => {
        console.error('Erro ao buscar coordenadas:', err)
        setErro(true);
      });

  }, [logradouro, cidade, uf]);

  return (
    <Box className="flexRowCenter" sx={{ width: '300px', height: '300px', boxShadow: 3, borderRadius: 4, overflow: 'hidden', m: 2 }}>
        { coords ? (
          <MapContainer center={[coords.latitude, coords.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[coords.latitude, coords.longitude]}>
              <Popup>{popup}</Popup>
            </Marker>
          </MapContainer>
      ) : (
        <>
        {erro ? <>Não foi possível localizar endereço</> : <CircularProgress color="secondary"/>}
        </>
      )}
    </Box>
  );
};

export default Mapa;
