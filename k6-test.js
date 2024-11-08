import { check } from 'k6';
import http from 'k6/http';

export let options = {
    stages: [
        { duration: '30s', target: 10 }, // 10 usuarios durante 30 segundos
        { duration: '1m', target: 10 },  // Mantener 10 usuarios durante 1 minuto
        { duration: '30s', target: 0 },  // Reducir usuarios a 0 en 30 segundos
    ],
};

export default function () {
    let response = http.get('https://test-api.k6.io');

    // Realizar chequeos básicos
    check(response, {
        'is status 200': (r) => r.status === 200,
        'response time is below 200ms': (r) => r.timings.duration < 200,
    });
}