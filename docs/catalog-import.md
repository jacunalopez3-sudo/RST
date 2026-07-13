# Importación del catálogo de clientes y equipos

1. Coloque exactamente un archivo `.xlsx` en `data/` con encabezados `Cliente`, `Equipo`, `Marca`, `Modelo`, `Serie`, `Activo` (el orden no importa).
2. Ejecute `npm install`.
3. Revise sin escribir: `npm run catalog:dry-run`.
4. Copie `.env.example` a `.env`, complete las dos variables y ejecute con el entorno cargado: `npm run catalog:import`.
5. Revise `reports/catalog-import-report.json`.

El importador trata `0` como dato ausente, no fusiona nombres de cliente ambiguos y nunca incluye la service role en archivos públicos. Es idempotente por cliente + serie; si no hay serie usa activo; y si ambos faltan usa equipo + marca + modelo.