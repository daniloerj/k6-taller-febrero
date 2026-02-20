import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

/*
    Spike test para k6:
    - Baseline ligero
    - Spike rápido a muchos VUs y mantención corta
    - Recuperación a baseline
    Ajusta BASE_URL y ENDPOINT con tu servicio.
*/

export let options = {
    // Etapas que simulan un spike (ramp-up rápido, hold, ramp-down)
    stages: [
        { duration: '1m', target: 10 },    // baseline
        { duration: '15s', target: 10 },
        { duration: '15s', target: 500 },  // spike: subir rápidamente a 500 VUs
        { duration: '1m', target: 500 },   // mantener el spike
        { duration: '30s', target: 10 },   // bajar rápidamente
        { duration: '1m', target: 10 },    // recuperación
    ],
    thresholds: {
        // Límites recomendados, ajusta según tu SLO
        http_req_failed: ['rate<0.05'],       // <5% errores
        http_req_duration: ['p(95)<2000'],   // 95% < 2000ms
    },
    // Opcional: aumentar control de logs y conexiones
    noConnectionReuse: false,
};

const BASE_URL = __ENV.BASE_URL || 'https://test-api.example.com';
const ENDPOINT = __ENV.ENDPOINT || '/checkout';
const checkoutTime = new Trend('checkout_time_ms');

export default function () {
    const payload = JSON.stringify({
        cartId: `cart-${__VU}-${__ITER}`,
        items: [
            { id: 'sku-1', qty: 1 },
            { id: 'sku-2', qty: 2 },
        ],
        payment: { method: 'test-card' },
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'checkout' },
    };

    const res = http.post(`${BASE_URL}${ENDPOINT}`, payload, params);

    checkoutTime.add(res.timings.duration);

    check(res, {
        'status 200': (r) => r.status === 200,
        'response has orderId': (r) => {
            try {
                const body = r.json();
                return !!body.orderId;
            } catch (e) {
                return false;
            }
        },
    });

    // Pequeña espera aleatoria para evitar sincronía total
    sleep(Math.random() * 1.5);
}