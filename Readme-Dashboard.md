# Performance Test — Visualización de resultados

Este documento explica, de forma concisa y práctica, cómo publicar y visualizar los resultados de tus pruebas de carga usando InfluxDB + Grafana en local, y cómo ejecutar/visualizar pruebas en k6 Cloud.

## Requisitos
- macOS (instrucciones con Homebrew)
- k6 instalado (https://k6.io)
- InfluxDB v1 (para uso con las integraciones habituales de k6)
- Grafana

## Instalación rápida (macOS / Homebrew)
- Instalar InfluxDB v1:
  ```bash
  brew install influxdb@1
  ```
- Iniciar InfluxDB:
  ```bash
  brew services start influxdb@1
  ```
- Instalar Grafana:
  ```bash
  brew install grafana
  ```
- Iniciar Grafana:
  ```bash
  brew services start grafana
  ```

## Verificar instalaciones
- InfluxDB: abrir [http://localhost:8086](http://localhost:8086)
- Grafana: abrir [http://localhost:3000](http://localhost:3000) (usuario/por defecto: admin / admin — cambiar contraseña al primer inicio)

## Preparar InfluxDB para k6 (local)
1. Crear una base de datos para k6 (InfluxDB v1). Ejemplo:
   ```bash
   curl -G http://localhost:8086/query --data-urlencode "q=CREATE DATABASE k6"
   ```
2. (Opcional) revisar bases de datos:
   ```bash
   curl -G http://localhost:8086/query --data-urlencode "q=SHOW DATABASES"
   ```

## Enviar resultados de k6 a InfluxDB (ejemplo)
- Comando de ejemplo para ejecutar una prueba y enviar resultados a InfluxDB local:
  ```bash
  k6 run --out influxdb=http://localhost:8086/k6 script.js
  ```
  - Adaptar `k6` y `script.js` según tu script.
  - Si usas parámetros de autenticación o DB distinta, ajusta la URL conforme a tu configuración.

Nota: revisa la documentación de k6 para el formato exacto de la URL del adaptor de InfluxDB en tu versión si necesitas parámetros adicionales.

## Configurar Grafana para visualizar datos locales
1. Acceder a Grafana: [http://localhost:3000](http://localhost:3000)
2. Crear un datasource:
   - Ir a Configuration → Data Sources → Add data source → InfluxDB
   - URL: `http://localhost:8086`
   - Database: `k6`
   - Version: InfluxDB 1.x
   - Guardar y probar conexión
3. Crear o importar un dashboard:
   - Crear dashboard nuevo o ir a Manage → Import
   - Subir o pegar el ID/JSON de un dashboard de k6 / InfluxDB (hay plantillas públicas)
   - Seleccionar el datasource creado y completar la importación

## Ejecución local y ver dashboard
1. Ejecuta tu script k6 con salida hacia InfluxDB (ver sección anterior).
2. En Grafana abre el dashboard importado/creado; los paneles deberían mostrar métricas (latencias, tasa de éxito, RPS, etc.) conforme vayan llegando los puntos a InfluxDB.

## Uso de k6 Cloud (visualización en la nube)
1. Crear cuenta/trial en: [https://k6.io/cloud](https://k6.io/cloud)
2. Autenticarse / obtener token según instrucciones de k6 Cloud.
3. Ejecutar prueba en la nube:
   - Comando típico:
     ```bash
     k6 cloud script.js
     ```
   - O bien autenticar con `k6 login cloud` y enviar con `k6 cloud`.
4. Visualizar resultados:
   - Entrar al dashboard de k6 Cloud desde la consola web (la UI de cloud mostrará resultados, dashboards y detalles de ejecuciones sin necesidad de Grafana/InfluxDB locales).

## Buenas prácticas
- Crear una base de datos/retención específica para pruebas de carga para evitar crecimiento descontrolado.
- Exportar/importar dashboards (JSON) para mantener consistencia entre entornos.
- Automatizar la creación de la BD en entornos de CI/CD si ejecutas pruebas de forma recurrente.

## Recursos
- k6 docs (para salida a InfluxDB y uso de k6 Cloud)
- Grafana docs (configurar datasources e importar dashboards)
- InfluxDB v1 docs (consultas y administración básica)

--- 
Fin del documento. Ajusta nombres de base de datos, URLs y credenciales según tu entorno.
