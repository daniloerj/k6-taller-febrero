# Performance testing con k6

Proyecto de ejemplo para ejecutar pruebas de rendimiento con k6.

Contenido
- Scripts de prueba: `performance.js`, `load.js`, `smoke.js`, `stress.js`, `soak.js`, `spike.js`, `spike-checkout.js`.
- Resultados: `all-results.json`, `summary-results.json` (generados por los scripts cuando se usa salida JSON).

Requisitos
- k6 (https://k6.io)
- Node.js (opcional, solo si algunos scripts auxiliares lo requieren)

Instalación rápida (macOS / Linux)

1. Instalar k6 (método recomendado):

   - macOS (homebrew):
     brew install k6

   - Debian/Ubuntu:
     sudo apt-get update && sudo apt-get install -y gnupg2 software-properties-common wget
     wget -q -O - https://dl.k6.io/key.gpg | sudo apt-key add -
     echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
     sudo apt-get update && sudo apt-get install -y k6

Cómo ejecutar localmente

1. Ejecutar el test principal:

   k6 run --vus 10 --duration 30s performance.js

2. Ejecutar con salida JSON (útil para CI y reportes):

   mkdir -p results
   k6 run --vus 10 --duration 30s --out json=results/k6-results.json performance.js

3. Variables de entorno recomendadas

- TARGET_BASE_URL: URL base de la aplicación bajo prueba (si el script la utiliza).
- Otras variables específicas pueden estar documentadas en `docs/README.md`.

CI / GitHub Actions

Se incluye un workflow que instala k6 en el runner, ejecuta `performance.js` y sube los resultados como artefacto.

Contribuir

- Abrir issues para problemas o mejoras.
- Hacer PRs hacia la rama `main`.

Licencia

Este proyecto puede ser usado como ejemplo. Añade la licencia apropiada si lo publicas.
