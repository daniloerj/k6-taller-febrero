import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';

// ✅ Métricas custom (las 4)
const checkout_duration = new Trend('checkout_duration'); // tiempos del paso de checkout (Trend)
const orders_created = new Counter('orders_created');     // cantidad de órdenes OK (Counter)
const checkout_ok = new Rate('checkout_ok');              // % de checkouts OK (Rate)
const order_queue_depth = new Gauge('order_queue_depth'); // “valor actual” de cola (Gauge)

// ✅ Config k6
export const options = {
  scenarios: {
    ecommerce: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 30 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    // Performance técnico
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000', 'p(99)<1200'],

    // Performance del paso crítico (checkout)
    checkout_duration: ['p(95)<1500', 'p(99)<2500'],

    // Negocio
    checkout_ok: ['rate>0.98'],        // 98% de checkouts válidos
    orders_created: ['count>200'],     // al menos 200 órdenes OK en toda la prueba

    // Capacidad/operación
    order_queue_depth: ['value<500'],  // la cola no debe pasar 500 (último valor observado)
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://test-api.k6.io';

export default function () {
  // 1) Buscar usuario (simulado)
  const search = http.get("https://jsonplaceholder.typicode.com/users?id=8");
  check(search, { 'search 200': (r) => r.status === 200 });

  // 2) Crear usuario (simulado)
  const add = http.post("https://jsonplaceholder.typicode.com/users", {name: "Danilo Ramirez"});
  check(add, { 'add 200/201': (r) => r.status === 200 || r.status === 201 });

  // 3) Checkout (paso crítico)
  const start = Date.now();
  const checkout = http.post("https://jsonplaceholder.typicode.com/posts", {title: "Order", body: "Order details", userId: 8});
  const stepMs = Date.now() - start;

  checkout_duration.add(stepMs);

  // ✅ “éxito de negocio”: no solo status, también condición (ej: body esperado)
  const ok = check(checkout, {
    'checkout status ok': (r) => r.status === 200 || r.status === 201,
    // En tu API real aquí validarías: token, orderId, total > 0, etc.
  });

  checkout_ok.add(ok);
  if (ok) orders_created.add(1);

  // 4) Métrica operativa (Gauge): cola de órdenes / backlog / sesiones activas
  // En tu sistema real sería algo como: /metrics, /health, /ops/queue
  const ops = http.get("https://jsonplaceholder.typicode.com/posts/3"); // placeholder de demo
  // Ejemplo real: order_queue_depth.add(ops.json().queueDepth)
  // Aquí solo demostramos el patrón con un valor sintético:
  order_queue_depth.add(Math.floor(Math.random() * 600));

}