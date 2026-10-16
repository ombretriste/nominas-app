# PayCTRL

*by OmT Finance* · nombre provisional

Versión **0.2.0**. Las correcciones y ajustes suben el último número; las novedades, el del medio.

Web app (PWA) para guardar todas tus nóminas, con la misma estructura y estética que UnderCTRL pero en verde jade (turquesa–esmeralda–lima).

- **Pantalla de entrada** con logo, botón Face ID / código / «Entrar» según el nivel de seguridad y la versión.
- **Resumen** del año elegido: neto percibido, bruto, retención IRPF, Seguridad Social, tipo IRPF medio, reparto del bruto y 4 bloques (Nóminas, Conceptos, Evolución, Documentos).
- **Nóminas**: lista por años plegables (mes, bruto, IRPF, neto). Cada nómina abre su detalle con devengos, deducciones y el documento adjunto.
- **Subir nóminas**: se eligen uno o varios PDF y se leen solos (pdf.js): mes, paga extra, empresa, % de retención, líquido y cada línea del recibo (formato SAP de Airbus: CLAVE · CONCEPTO · ORIGEN · HORAS/% · DESCUENTOS · ABONOS · BASE). Se comprueba que el cálculo coincide con el líquido impreso. Si un archivo no se puede leer (foto, otro formato), se mete a mano. Los archivos se guardan en IndexedDB del dispositivo.
- **Conceptos**: catálogo con nombre claro de cada clave (`CATALOG` en `app.js`): devengos por clase (A1 personales, A2 puesto, A3 cantidad o calidad, A4 pagas, A5 incidencias, B1 no salariales), descuentos (Seguridad Social, IRPF, plan de pensiones, cuota sindical, acciones ESOP, créditos), retribución en especie, solo base de cotización y aportación de la empresa. Suma anual de cada uno; los atrasos y regularizaciones muestran sus meses de origen.
- **Renta**: rendimientos dinerarios y en especie, aportación de la empresa al plan, retenciones, Seguridad Social, cuotas sindicales, aportaciones propias al plan y atrasos de años anteriores (referencia; lo oficial es el certificado de retenciones).
- **Evolución**: gráfico del neto mensual y tabla por años (el año en curso se compara con los mismos meses del anterior).
- **Documentos**: todos los archivos adjuntos, con visor.
- **Menú ⋯**: perfiles (una persona por perfil y «Total»), opciones de visualización (oscuro/claro/automático y 4 fondos), importar/exportar copia (con los documentos), nivel de seguridad y bloquear.
- Deshacer, ocultar importes (ojo) y datos de ejemplo para ver el boceto.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura de la app |
| `app.js` | Navegación, cálculos, guardado, Face ID |
| `styles.css` | Estilos de UnderCTRL con la paleta jade (al final, piezas propias) |
| `manifest.json`, `icons/` | Instalación en la pantalla de inicio |
| `sw.js` | Permite abrir la app sin conexión |
| `vendor/pdf.min.js`, `vendor/pdf.worker.min.js` | pdf.js 3.11.174 (Apache 2.0) para leer las nóminas; se carga solo al subir un PDF |
