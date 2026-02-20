# Documentación — Pruebas de rendimiento con k6

Este documento centraliza la información operativa y la guía para ejecutar, parametrizar e interpretar las pruebas de rendimiento incluidas en este repositorio.

1) Objetivo

   Proveer scripts y procesos reproducibles para validar el rendimiento de una aplicación usando k6. Permite ejecución local y ejecución en CI con GitHub Actions.

2) Estructura del repositorio

   - `performance.js` — script principal de prueba de rendimiento.
   - `load.js`, `smoke.js`, `stress.js`, `soak.js`, `spike.js`, `spike-checkout.js` — scripts auxiliares/variantes.
   - `results/` — carpeta donde se depositan resultados JSON (ignorados por defecto en git).
   - `all-results.json`, `summary-results.json` — ejemplos/artefactos.

3) Variables de entorno y configuración

   - TARGET_BASE_URL: URL base del servicio bajo prueba (ej: https://staging.example.com)
   - Cualquier otro valor de configuración específico se define en el script y se documenta en la cabecera del mismo.

4) Comandos comunes

   - Ejecutar localmente con 10 VUs por 30s:

     k6 run --vus 10 --duration 30s performance.js

   - Exportar resultados a JSON:

     mkdir -p results
     k6 run --vus 10 --duration 30s --out json=results/k6-results.json performance.js

   - Ejecutar con parámetros dinámicos (ejemplo pasando target):

     TARGET_BASE_URL=https://staging.example.com k6 run --vus 50 --duration 1m performance.js

5) Interpretación de resultados

   - El JSON contiene métricas por iteración y métricas agregadas (http_req_duration, checks, etc.).
   - Buscar indicadores clave: p(95) latency, error rates, throughput (req/s).
   - Si usas thresholds en k6, el script devolerá exit code distinto de 0 si fallan.

6) CI / GitHub Actions

   - El workflow definido en `.github/workflows/k6-performance.yml`:
     - instala k6 en el runner
     - ejecuta `performance.js` con salida JSON
     - sube el JSON como artefacto del job

   - Recomendación: en repositorios públicos, usar un `TARGET_BASE_URL` que apunte a un entorno dedicado de pruebas y mantener la URL en `secrets`.

7) Consejos y buenas prácticas

   - No probar contra entornos de producción sin autorización.
   - Mantén tests pequeños y reproducibles. Empieza con smoke tests.
   - Versiona los scripts y documenta cambios en los tests (por qué sube la carga, qué endpoint se está evaluando).
