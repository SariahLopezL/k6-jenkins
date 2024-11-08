import http from 'k6/http';
import { check, sleep } from 'k6';

// Definir las ubicaciones geográficas de los usuarios virtuales
export let options = {
  stages: [
    { duration: '2m', target: 10 },  // Simula 10 usuarios durante 2 minutos
    { duration: '3m', target: 30 },  // Escala a 30 usuarios durante 3 minutos
    { duration: '2m', target: 0 },   // Reduce a 0 usuarios durante 2 minutos
  ],
  // Definimos ubicaciones geográficas para los usuarios
  locations: [
    { location: 'us-east-1', weight: 1 },  // USA (Este)
    { location: 'eu-central-1', weight: 1 }, // Europa (Central)
    { location: 'ap-southeast-1', weight: 1 }, // Asia (Sudeste)
  ],
};

// URL de los servidores que deseas probar
const servers = [
  { url: 'https://server-us.example.com', name: 'Server US' },
  { url: 'https://server-eu.example.com', name: 'Server EU' },
  { url: 'https://server-ap.example.com', name: 'Server APAC' },
];

export default function () {
  // Elegir un servidor al azar para cada usuario virtual
  const server = servers[Math.floor(Math.random() * servers.length)];

  // Realizar una solicitud HTTP GET al servidor
  let response = http.get(server.url);

  // Verificar que la respuesta sea exitosa
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Registrar información adicional si es necesario
  console.log(`User from ${__ENV.LOCATION} testing ${server.name}`);

  // Dormir un segundo entre peticiones
  sleep(1);
}