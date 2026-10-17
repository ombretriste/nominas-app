# PayCTRL

*by OmT Finance* · nombre provisional

Versión **0.5.0**. Las correcciones y ajustes suben el último número; las novedades, el del medio.

Web app (PWA) para guardar todas tus nóminas, con la misma estructura y estética que UnderCTRL pero en verde jade (turquesa–esmeralda–lima).

- **Pantalla de entrada** con logo, botón Face ID / código / «Entrar» según el nivel de seguridad y la versión.
- **Resumen** del año elegido: neto percibido, bruto, retención IRPF, Seguridad Social, tipo IRPF medio, reparto del bruto y 4 bloques (Nóminas, Conceptos, Evolución, Renta).
- **Nóminas**: lista por años plegables (mes, bruto, IRPF, neto). Cada nómina abre su detalle con devengos, deducciones y el documento adjunto.
- **Subir nóminas**: se eligen uno o varios PDF y se leen solos (pdf.js): mes, paga extra, empresa, % de retención, líquido y cada línea del recibo (formato SAP de Airbus: CLAVE · CONCEPTO · ORIGEN · HORAS/% · DESCUENTOS · ABONOS · BASE). Se comprueba que el cálculo coincide con el líquido impreso. Si un archivo no se puede leer (foto, otro formato), se mete a mano. Los archivos se guardan en IndexedDB del dispositivo.
- **Conceptos**: catálogo con nombre claro de cada clave (`CATALOG` en `app.js`): devengos por clase (A1 personales, A2 puesto, A3 cantidad o calidad, A4 pagas, A5 incidencias, B1 no salariales), descuentos (Seguridad Social, IRPF, plan de pensiones, cuota sindical, acciones ESOP, créditos), retribución en especie, solo base de cotización y aportación de la empresa. Suma anual de cada uno; los atrasos y regularizaciones muestran sus meses de origen.
- **Certificado de retenciones** (dentro de Renta): se sube su PDF (o se elige junto a las nóminas) y se lee solo. Se compara casilla a casilla con la suma de las nóminas de ese año: retribuciones dinerarias, retenciones, Seguridad Social y aportación de la empresa al plan deben coincidir (margen de 1 €); especie y rentas exentas son orientativas. El Resumen indica si cuadra.
- **Declaración de la Renta** (dentro de Renta): se sube el PDF de la declaración presentada (Modelo 100) y se lee solo; se guardan solo las casillas con importe (sin nombres, NIF ni direcciones). Muestra un resumen (resultado a devolver o ingresar, fecha de presentación, tipo medio, rendimiento neto del trabajo, capital mobiliario, ganancias patrimoniales, bases liquidables, cuotas, deducciones, pagos a cuenta y pérdidas pendientes) y comprueba casillas con el certificado (0003, 0004, 0005, 0008, 0013 y 0596 = retenciones + ingresos a cuenta) y con las nóminas (0014 cuotas sindicales, 0426 aportación al plan de empresa).
- **Renta**: rendimientos dinerarios y en especie, aportación de la empresa al plan, retenciones, Seguridad Social, cuotas sindicales, aportaciones propias al plan y atrasos de años anteriores (referencia; lo oficial es el certificado de retenciones).
- **Evolución**: bruto y neto por años (barras) y tabla con su variación; el año en curso se compara con los mismos meses del anterior.
- **Selector de año**: todos los años con datos, 4 a la vista; la barra se desliza para ver los anteriores.
- **Documentos** (menú ⋯): todos los PDF de nóminas y certificados, con visor.
- **Menú ⋯**: documentos, perfiles (una persona por perfil y «Total»), opciones de visualización (oscuro/claro/automático y 4 fondos), importar/exportar copia (con los documentos), nivel de seguridad y bloquear.
- **Sincronización en la nube** (menú ⋯), como en UnderCTRL: crear cuenta con usuario, contraseña y la misma **clave de registro**; datos y PDF **cifrados de extremo a extremo** (PBKDF2 + AES-256-GCM) antes de subirse. Copia de seguridad semanal de los datos. La cuenta es independiente de la de UnderCTRL aunque uses el mismo usuario.
- Deshacer, ocultar importes (ojo) y datos de ejemplo para ver el boceto.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura de la app |
| `app.js` | Navegación, cálculos, guardado, Face ID |
| `styles.css` | Estilos de UnderCTRL con la paleta jade (al final, piezas propias) |
| `manifest.json`, `icons/` | Instalación en la pantalla de inicio |
| `sw.js` | Permite abrir la app sin conexión |
| `api/sync.js` | Función de Vercel: guarda los datos y los PDF cifrados de cada cuenta (Upstash Redis, claves `nom:`) |
| `vendor/pdf.min.js`, `vendor/pdf.worker.min.js` | pdf.js 3.11.174 (Apache 2.0) para leer las nóminas; se carga solo al subir un PDF |

## Publicar

1. **Vercel**: *Add New → Project*, importa el repositorio `nominas-app` y pulsa *Deploy* (Framework: *Other*, sin comando de build).
2. **Nube**: en el proyecto → **Storage** → conecta la misma base **Upstash for Redis** que UnderCTRL (o una nueva). Las claves no se mezclan (`nom:` frente a `fin:`). Vuelve a desplegar.
3. Para comprobarlo, abre `https://<tu-app>.vercel.app/api/sync` en el navegador: debe decir `"configured": true`. Si dice `false`, la lista `vars` muestra qué variables de base de datos ve el servidor (solo nombres). Sirve cualquier par `…REST_API_URL` / `…REST_API_TOKEN`, tenga el prefijo que tenga.
4. Si en UnderCTRL cambiaste la clave de registro con la variable `SIGNUP_CODE`, ponla también aquí.
