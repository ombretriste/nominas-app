'use strict';

// ---------- Configuración ----------
// Versión de la app (se ve en la pantalla de inicio). Arreglos y ajustes: 1.0.x; novedades: 1.x.0.
const APP_VERSION = '1.7.0';
// Uso de la app en Vercel Analytics: es una sola página, así que cada función se cuenta como una
// página virtual. Solo se envía el nombre de la función, nunca datos de la app.
const track = (path) => { try { window.va?.('pageview', { path }); } catch (_) { /* sin analítica */ } };
const trackLabel = (label) => track(`/${label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`);
const CURRENCY = 'EUR';
const LOCALE = 'es-ES';
const STORAGE_KEY = 'nominas:data';
const CRED_KEY = 'nominas:credId';
const PRIVACY_KEY = 'nominas:private';
const SESSION_KEY = 'nominas:session';
const LAST_VIEW_KEY = 'nominas:lastView';
const PIN_KEY = 'nominas:pin';
const SECURITY_KEY = 'nominas:security';
const INSTALL_HINT_KEY = 'nominas:installHint';
const DISPLAY_KEY = 'nominas:display';
// Tras desbloquear, volver a la app antes de este tiempo no pide Face ID otra vez.
const RELOCK_AFTER_MS = 2 * 60 * 1000;
const MASK = '••••••';
const TOTAL_ID = 'total';
const PROFILE_COLORS = ['#2dd4bf', '#f472b6', '#4f8cff', '#f5a524', '#a78bfa', '#34d399', '#ff9f6b'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
// Tipo de nómina: la mensual, una paga extra o atrasos (se suman al mes en que se cobran).
const KINDS = { monthly: 'Mensual', extra: 'Paga extra', arrears: 'Atrasos' };

const ICONS = {
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none"/>',
  summary: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  payslips: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.5 12.5h7M8.5 16h4.5"/>',
  concepts: '<path d="M4 6.5h16M4 12h16M4 17.5h10"/><circle cx="18.5" cy="17.5" r="2"/>',
  evolution: '<path d="M4.5 20v-5M9.5 20v-8M14.5 20v-5.5M19.5 20V9"/><path d="M4.5 11l5-4.5 5 3 5-5"/>',
  documents: '<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  renta: '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
  sim: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><circle cx="9" cy="11.5" r=".9" fill="currentColor"/><circle cx="12" cy="11.5" r=".9" fill="currentColor"/><circle cx="15" cy="11.5" r=".9" fill="currentColor"/><circle cx="9" cy="15" r=".9" fill="currentColor"/><circle cx="12" cy="15" r=".9" fill="currentColor"/><path d="M15 14v3"/><circle cx="9" cy="18" r=".9" fill="currentColor"/><circle cx="12" cy="18" r=".9" fill="currentColor"/>',
  alert: '<path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z"/><path d="M12 11v5M9.5 13.5L12 11l2.5 2.5"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 17v1.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V17"/>',
  swap: '<path d="M7 4L4 7l3 3"/><path d="M4 7h12.5"/><path d="M17 20l3-3-3-3"/><path d="M20 17H7.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.1-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
};
const icon = (name, size = 22) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// Bloques del Resumen: cada uno abre su pantalla (y es también una pestaña de la barra inferior).
const SCREENS = [
  { key: 'payslips',  label: 'Nóminas',    color: '#2dd4bf' },
  { key: 'concepts',  label: 'Conceptos',  color: '#34d399' },
  { key: 'evolution', label: 'Evolución',  color: '#22d3ee' },
  { key: 'renta',     label: 'Renta',      color: '#bef264' },
];
// Pantallas que se abren desde el menú ⋯ (no salen en el Resumen ni en la barra inferior).
const MENU_SCREENS = [
  { key: 'documents', label: 'Documentos', color: '#a3e635' },
];
// Subpantallas: se abren desde otra (parent), a la que vuelve la flecha.
const SUB_SCREENS = [
  { key: 'sim', label: 'Simulador Renta', color: '#22d3ee', parent: 'renta' },
];
const screenByKey = Object.fromEntries([...SCREENS, ...MENU_SCREENS, ...SUB_SCREENS].map((s) => [s.key, s]));
// Colores del reparto del bruto (neto, IRPF, Seguridad Social, otras deducciones)
const SPLIT_COLORS = { net: '#2dd4bf', irpf: '#f5a524', ss: '#4f8cff', other: '#a78bfa' };

// ---------- Utilidades ----------
const $ = (id) => document.getElementById(id);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
const round2 = (n) => Math.round((n || 0) * 100) / 100;
const sumBy = (arr, fn) => round2(arr.reduce((a, x) => a + (fn(x) || 0), 0));

const formatters = {};
const fmtCcy = (signed = false) =>
  (formatters[signed] ??= new Intl.NumberFormat(LOCALE, {
    style: 'currency', currency: CURRENCY, currencyDisplay: 'narrowSymbol', useGrouping: 'always',
    ...(signed ? { signDisplay: 'exceptZero' } : {}),
  }));
const isPrivate = () => document.body.classList.contains('private');
const money = (n, signed = false) => (isPrivate() ? `${MASK} €` : fmtCcy(signed).format(n || 0));
const pctText = (x) => (isPrivate() ? MASK : `${(x * 100).toLocaleString(LOCALE, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} %`);
const numStr2 = (n) => (isPrivate() ? MASK : (n || 0).toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }));
const formatInput = (n) => (n ? n.toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }) : '');
const sizeText = (b) => (b > 1e6 ? `${(b / 1e6).toLocaleString(LOCALE, { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

// Importes: admite 1.234,56 · 1234.56 · 1.234
function parseAmount(str) {
  let s = String(str).replace(/[^\d.,-]/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

// ---------- Almacenamiento ----------
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Los PDF e imágenes de las nóminas van en IndexedDB (localStorage se queda corto).
const files = {
  db: null,
  open() {
    return (this.db ??= new Promise((resolve, reject) => {
      const req = indexedDB.open('nominas-files', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('files');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const t = db.transaction('files', mode);
      const r = fn(t.objectStore('files'));
      t.oncomplete = () => resolve(r?.result);
      t.onerror = () => reject(t.error);
    });
  },
  put: (id, blob) => files.tx('readwrite', (s) => s.put(blob, id)),
  get: (id) => files.tx('readonly', (s) => s.get(id)),
  del: (id) => files.tx('readwrite', (s) => s.delete(id)),
  clear: () => files.tx('readwrite', (s) => s.clear()),
};

// Una nómina: mes y año, tipo, empresa, importes y (opcional) el desglose por conceptos y el archivo.
// Si tiene conceptos, el bruto y las deducciones salen de ellos; si no, de los importes escritos.
function normSlip(s) {
  return {
    id: s.id || uid(),
    year: Number(s.year) || new Date().getFullYear(),
    month: Math.min(12, Math.max(1, Number(s.month) || 1)),
    kind: KINDS[s.kind] ? s.kind : 'monthly',
    company: s.company || '',
    gross: Number(s.gross) || 0,
    irpf: Number(s.irpf) || 0,
    ss: Number(s.ss) || 0,
    other: Number(s.other) || 0,
    concepts: Array.isArray(s.concepts) ? s.concepts.map(normConcept) : [],
    // Datos leídos del PDF: líquido impreso (para comprobar el cálculo) y % de retención.
    liquid: s.liquid == null ? null : Number(s.liquid),
    irpfPct: s.irpfPct == null ? null : Number(s.irpfPct),
    file: s.file && s.file.id ? { id: s.file.id, name: s.file.name || 'nómina', type: s.file.type || '', size: Number(s.file.size) || 0 } : null,
    demo: !!s.demo,
    generic: !!s.generic, // leída con el lector general (solo totales)
  };
}
// Concepto de una nómina. type: 'dev' (abono), 'ded' (descuento), 'info' (solo base de cotización
// o pago en especie: no se cobra) o 'emp' (aportación de la empresa). cat (descuentos): irpf, ss u other.
function normConcept(k) {
  // «Adelanto neto» (3682): la nómina lo resta como abono negativo, pero es la devolución de un
  // anticipo ya cobrado (y que Hacienda cuenta como cobrado): se trata como descuento.
  // (Sin usar constantes definidas más abajo: esto se ejecuta al cargar los datos.)
  if ((k.code || '').split(' ').at(-1) === '3682' && k.type === 'dev') k = { ...k, type: 'ded', cat: 'other', amount: -(Number(k.amount) || 0) };
  return {
    id: k.id || uid(),
    code: k.code || '',
    name: k.name || '',
    origin: k.origin || '',
    qty: k.qty == null ? null : Number(k.qty),
    type: ['dev', 'ded', 'info', 'emp'].includes(k.type) ? k.type : 'dev',
    cat: ['irpf', 'ss'].includes(k.cat) ? k.cat : 'other',
    amount: Number(k.amount) || 0,
  };
}

// ---------- Lectura de nóminas en PDF ----------
// Formato de recibo SAP (Airbus y similares): tabla CLAVE · CONCEPTO · FECHA DE ORIGEN ·
// HORAS/% · DESCUENTOS · ABONOS · INCIDE EN BASE. La clave dice qué es cada línea:
// A1–A5 percepciones salariales, B1 no salariales, C descuentos, D solo base de cotización
// (y pagos en especie) y sin letra, datos de la empresa (/399 su aportación a la S. Social).
const PDFJS_SRC = 'vendor/pdf.min.js'; // pdf.js 3.11.174 (Apache 2.0), se carga solo al leer un PDF
const PDFJS_WORKER = 'vendor/pdf.worker.min.js';
const CLASS_LABELS = {
  A1: 'Personales', A2: 'De puesto de trabajo', A3: 'De cantidad o calidad de trabajo',
  A4: 'Pagas (vencimiento superior al mes)', A5: 'Abonos negativos (incidencias)', B1: 'Percepciones no salariales',
};
const ACRONYMS = ['IRPF', 'PP', 'ESOP', 'AT', 'S.S.', 'TR', 'MEI', 'IT', 'IMS'];
function prettyName(s) {
  s = s.replace(/\s+/g, ' ').trim();
  if (/[a-zá-ú]/.test(s)) return s; // ya viene en minúsculas y mayúsculas
  const out = s.toLowerCase().replace(/^./, (c) => c.toUpperCase());
  return out.split(' ').map((w) => ACRONYMS.find((a) => a.toLowerCase() === w.toLowerCase()) ?? w).join(' ')
    .replace(/\bi\.\s?r\.\s?p\.\s?f\.?/gi, 'IRPF').replace(/^Retencion\b/, 'Retención');
}
const NUM_RE = /^\d{1,3}(?:\.\d{3})*,\d{2}-?$/;
const pdfNum = (s) => { const n = parseAmount(s.replace(/-$/, '')); return s.endsWith('-') ? -n : n; };
// Claves de paga extra (gratificaciones de julio y Navidad y su antigüedad)
const EXTRA_CODES = ['0414', '0418', '0096', '0098'];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('script'));
    document.head.append(s);
  });
}
async function loadPdfJs() {
  if (!window.pdfjsLib) await loadScript(PDFJS_SRC);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  return window.pdfjsLib;
}

// Devuelve { year, month, kind, company, liquid, irpfPct, concepts } o null si no es un recibo reconocible.
async function readPayslipPdf(file) {
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  const concepts = [];
  let text = '';
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const items = (await page.getTextContent()).items
      .filter((it) => it.str.trim())
      .map((it) => ({ s: it.str.trim(), x: it.transform[4], y: it.transform[5], w: it.width }));
    text += ' ' + items.map((it) => it.s).join(' ');
    // Columnas de importes: centro de cada cabecera
    const head = (re) => items.find((it) => re.test(it.s));
    const colOf = (it) => (it ? it.x + it.w / 2 : null);
    const cols = {
      qty: colOf(head(/^HORAS/)), desc: colOf(head(/^DESCUENTOS$/)),
      abono: colOf(head(/^ABONOS$/)), base: colOf(head(/^(INCIDE|INDICE)/)), // las de 2014 dicen «INDICE»
    };
    // Filas: elementos a la misma altura
    const rows = [];
    [...items].sort((a, b) => b.y - a.y || a.x - b.x).forEach((it) => {
      const row = rows.find((r) => Math.abs(r.y - it.y) < 2.5);
      if (row) row.items.push(it);
      else rows.push({ y: it.y, items: [it] });
    });
    for (const r of rows) {
      r.items.sort((a, b) => a.x - b.x);
      const line = r.items.map((it) => it.s).join(' ');
      // Origen: MM/AAAA, o una sigla como «E.J» (paga extra de julio en las nóminas antiguas)
      const m = line.match(/^(?:([A-D]\d?)\s+)?(\/?[0-9A-Z]{3,4})\s+(.+?)\s+(\d{2}\/\d{4}|[A-Z]\.[A-Z]\.?)(?:\s|$)/);
      if (!m) continue;
      const [, cls = '', code, name, origin] = m;
      const nums = r.items.filter((it) => NUM_RE.test(it.s) && it.x > r.items[0].x + 40);
      if (!nums.length) continue;
      const byCol = {};
      nums.forEach((it) => {
        const c = colOf(it);
        const best = Object.entries(cols).filter(([, x]) => x != null)
          .sort((a, b) => Math.abs(a[1] - c) - Math.abs(b[1] - c))[0];
        byCol[best ? best[0] : 'last'] = pdfNum(it.s);
      });
      const last = pdfNum(nums.at(-1).s);
      const letter = cls[0] || '';
      let type, amount;
      if (letter === 'A' || letter === 'B') { type = 'dev'; amount = byCol.abono ?? last; }
      else if (letter === 'C') { type = 'ded'; amount = byCol.desc ?? last; }
      else if (letter === 'D') { type = 'info'; amount = byCol.base ?? last; }
      // Sin letra de clase: /399 es la empresa; el resto se decide por la columna del importe
      // (p. ej. «7750 Amortización préstamo» va en DESCUENTOS).
      else if (code === '/399') { type = 'emp'; amount = last; }
      else if (byCol.desc != null) { type = 'ded'; amount = byCol.desc; }
      else if (byCol.abono != null) { type = 'dev'; amount = byCol.abono; }
      else { type = 'info'; amount = last; }
      concepts.push(normConcept({
        code: `${cls ? cls + ' ' : ''}${code}`,
        name: prettyName(name),
        origin,
        qty: (type === 'dev' || type === 'ded') && byCol.qty != null ? byCol.qty : null,
        type,
        cat: code === '/398' ? 'ss' : code === '/401' ? 'irpf' : 'other',
        amount,
      }));
    }
  }
  if (!concepts.some((k) => k.type === 'dev')) return null;
  // Periodo: «Enero (01.01.2026 a 31.01.2026)», «Extra Julio 2026» o, en las antiguas,
  // «Abril 2014» / «JULIO 2014» (mes seguido del año). No vale un mes suelto: los conceptos
  // también llevan meses («Compl result julio»).
  let year = null, month = null, kind = 'monthly';
  const M = MONTHS.join('|');
  const extra = text.match(new RegExp(`Extra\\s+(${M})\\s+(\\d{4})`, 'i'));
  const period = text.match(new RegExp(`(${M})\\s*\\(\\d{2}\\.(\\d{2})\\.(\\d{4})`, 'i'));
  const plain = text.match(new RegExp(`\\b(${M})\\s+((?:19|20)\\d{2})\\b`, 'i'));
  if (extra) { kind = 'extra'; month = MONTHS.indexOf(extra[1].toLowerCase()) + 1; year = Number(extra[2]); }
  else if (period) { month = Number(period[2]); year = Number(period[3]); }
  else if (plain) { month = MONTHS.indexOf(plain[1].toLowerCase()) + 1; year = Number(plain[2]); }
  // Paga extra sin la palabra «Extra»: solo gratificaciones, sin salario base del mes
  const codes = concepts.filter((k) => k.type === 'dev').map((k) => k.code.split(' ').at(-1));
  if (kind === 'monthly' && !codes.includes('0080') && codes.some((c) => EXTRA_CODES.includes(c))) kind = 'extra';
  const liq = text.match(/L[ÍI]QUIDO A PERCIBIR[ .…]*€\s*(\d{1,3}(?:\.\d{3})*,\d{2})/i);
  // Empresa: entre «…SEGURIDAD SOCIAL» y «CIF:» de la cabecera (p. ej. «EADS-CASA (Sociedad Unipersonal)»)
  const company = (text.match(/SEGURIDAD SOCIAL\s+(.{3,80}?)\s+CIF:/)?.[1]
    ?? text.match(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ][\wÁÉÍÓÚÑáéíóúñ&.\- ]{0,60}?,?\s+S\.(?:A|L)\.(?:U\.)?)/)?.[1] ?? '').trim();
  return {
    year, month, kind, company,
    liquid: liq ? parseAmount(liq[1]) : 0, // sin cifra (p. ej. abril con acciones): líquido 0
    irpfPct: concepts.find((k) => k.cat === 'irpf')?.qty ?? null,
    concepts,
  };
}
// ---------- Lector por columnas (A3, Sage y otros programas de nóminas) ----------
// Recibos con una tabla «Concepto · Unidades · Precio/Importe · Devengado/Devengos · A deducir/
// Deducciones» y los totales en cajas aparte («Total devengado», «Total deducciones», «Líquido»).
// En el texto del PDF etiquetas e importes salen desordenados, así que se usa la posición de cada
// texto en la página. Lee cada concepto; si los totales cuadran se guarda sin más, si no, se revisa.
const T_NUM = /^-?\d{1,3}(?:\.\d{3})*,\d{2,4}-?$|^-?\d+,\d{2,4}-?$/;
const tNum = (s) => { const neg = s.startsWith('-') || s.endsWith('-'); const n = parseAmount(s.replace(/-/g, '')); return neg ? -n : n; };

async function pdfItems(file) {
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    pages.push((await page.getTextContent()).items.filter((it) => it.str.trim())
      .map((it) => ({ s: it.str.trim().replace(/\s+/g, ' '), x: it.transform[4], y: it.transform[5], w: it.width })));
  }
  return pages;
}

async function readTablePayslipPdf(file) {
  const pages = await pdfItems(file);
  const text = (await pdfText(file));
  const concepts = [];
  let gross = null, dedTotal = null, liquid = null;
  const center = (it) => it.x + it.w / 2;
  for (const items of pages) {
    const head = items.find((it) => /^Concepto/i.test(it.s));
    if (!head) continue;
    const onHead = items.filter((it) => Math.abs(it.y - head.y) < 4);
    const devH = onHead.find((it) => /^(Devengad|Devengos|Percepciones|Abonos)/i.test(it.s));
    const dedH = onHead.find((it) => /Deducir|Deducciones|Descuentos/i.test(it.s));
    if (!devH || !dedH) continue;
    const cols = { dev: center(devH), ded: center(dedH) };
    const qtyH = onHead.find((it) => /^(Unidades|Cantidad|Horas|D[ií]as)/i.test(it.s));
    const priceH = onHead.find((it) => /^(Precio|Importe)/i.test(it.s));
    if (qtyH) cols.qty = center(qtyH);
    if (priceH) cols.price = center(priceH);
    // Cajas de totales: lo que hay por debajo ya no son conceptos
    const footLabels = items.filter((it) => it.y < head.y - 4 && /^(Total|Remuneraci[óo]n Total|Prorrata|L[íi]quido|Base|Aportaci[óo]n|APORTACI[ÓO]N)/i.test(it.s));
    const footTop = footLabels.length ? Math.max(...footLabels.map((it) => it.y)) : -Infinity;
    const body = items.filter((it) => it.y < head.y - 4 && it.y > footTop + 3);
    const rows = [];
    [...body].sort((a, b) => b.y - a.y || a.x - b.x).forEach((it) => {
      const row = rows.find((r) => Math.abs(r.y - it.y) < 3);
      if (row) row.items.push(it); else rows.push({ y: it.y, items: [it] });
    });
    for (const r of rows) {
      const nums = r.items.filter((it) => T_NUM.test(it.s));
      const name = r.items.filter((it) => !T_NUM.test(it.s) && center(it) < (cols.qty ?? cols.price ?? cols.dev) - 20).map((it) => it.s).join(' ').trim();
      if (!name || !nums.length) continue;
      const byCol = {};
      nums.forEach((it) => {
        const c = center(it);
        const best = Object.entries(cols).sort((a, b) => Math.abs(a[1] - c) - Math.abs(b[1] - c))[0][0];
        byCol[best] = tNum(it.s);
      });
      if (byCol.dev == null && byCol.ded == null) continue;
      const cat = /I\.?\s?R\.?\s?P\.?\s?F|RETENCI/i.test(name) ? 'irpf'
        : /CONT\.?\s*COM|CONTINGENC|COTIZ|DESEMPLEO|FORMACI[ÓO]N|\bS\.?\s?S\.?\b|SEG\.?\s*SOC|\bM\.?E\.?I\b|EQUIDAD|HORAS EXTRA/i.test(name) ? 'ss' : 'other';
      // Una línea puede ir en las dos columnas: p. ej. «Seguro colectivo», retribución en especie
      // que se suma al devengado y se descuenta por el mismo importe.
      const both = byCol.dev != null && byCol.ded != null;
      const label = prettyName(name) + (both && Math.abs(byCol.dev - byCol.ded) < 0.005 ? ' (en especie)' : '');
      if (byCol.dev != null) concepts.push(normConcept({ name: label, type: 'dev', cat: 'other', amount: byCol.dev, qty: byCol.qty ?? null }));
      if (byCol.ded != null) concepts.push(normConcept({ name: label, type: 'ded', cat, amount: byCol.ded, qty: byCol.qty ?? null }));
    }
    // Totales: el importe a la derecha en la misma línea o justo debajo de la etiqueta
    const valueOf = (re) => {
      const lab = items.find((it) => re.test(it.s));
      if (!lab) return null;
      const cand = items.filter((it) => T_NUM.test(it.s)).map((it) => {
        const dy = lab.y - it.y, dx = center(it) - center(lab);
        const same = Math.abs(dy) < 3 && it.x > lab.x;
        const below = dy > 0 && dy < 30 && Math.abs(dx) < 70;
        return same || below ? { it, d: same ? it.x - lab.x : dy * 3 + Math.abs(dx) } : null;
      }).filter(Boolean).sort((a, b) => a.d - b.d);
      return cand.length ? tNum(cand[0].it.s) : null;
    };
    gross ??= valueOf(/^Total Devengado|^Total Devengos|^Total Percepciones/i);
    dedTotal ??= valueOf(/^Total Deducciones|^Total a Deducir|^Total Descuentos/i);
    liquid ??= valueOf(/^L[íi]quido|^Total a percibir|^Neto a percibir/i);
    // Recuadros de cotizaciones («Aportación del trabajador» y «de la empresa»), columna «Cuota»
    const apW = items.find((it) => /APORTACI[ÓO]N DEL TRABAJADOR/i.test(it.s));
    const apE = items.find((it) => /APORTACI[ÓO]N DE LA EMPRESA/i.test(it.s));
    const leftEdge = Math.min(...[apW, apE].filter(Boolean).map((it) => it.x)) - 5;
    const boxCuotas = (ap) => {
      if (!ap) return [];
      const cuota = items.find((it) => /^Cuota$/i.test(it.s) && it.y < ap.y && it.x > ap.x - 20 && it.x < ap.x + ap.w + 10);
      if (!cuota) return [];
      return items.filter((it) => it.y < cuota.y - 3 && it.y > cuota.y - 140 && it.x < leftEdge && !T_NUM.test(it.s))
        .map((lab) => {
          const v = items.find((it) => T_NUM.test(it.s) && Math.abs(it.y - lab.y) < 3 && Math.abs(center(it) - center(cuota)) < 30);
          return v && tNum(v.s) ? { name: prettyName(lab.s), amount: tNum(v.s) } : null;
        }).filter(Boolean);
    };
    const worker = boxCuotas(apW);
    const workerSum = round2(worker.reduce((a, x) => a + x.amount, 0));
    const dedSum = round2(concepts.filter((k) => k.type === 'ded').reduce((a, k) => a + k.amount, 0));
    const ssLine = concepts.find((k) => k.type === 'ded' && k.cat === 'ss');
    if (worker.length && ssLine && concepts.filter((k) => k.cat === 'ss').length === 1 && Math.abs(ssLine.amount - workerSum) < 0.02) {
      // Una sola línea de Seguridad Social («Descuentos seg. soc.»): se sustituye por su desglose
      concepts.splice(concepts.indexOf(ssLine), 1, ...worker.map((x) => normConcept({ name: x.name, type: 'ded', cat: 'ss', amount: x.amount })));
    } else if (worker.length && dedTotal != null && Math.abs(dedSum + workerSum - dedTotal) < 0.02) {
      // Cotizaciones que solo figuran en el recuadro: se añaden
      worker.forEach((x) => concepts.push(normConcept({ name: x.name, type: 'ded', cat: 'ss', amount: x.amount })));
    }
    boxCuotas(apE).forEach((x) => concepts.push(normConcept({ name: x.name, type: 'emp', amount: x.amount })));
  }
  if (!concepts.some((k) => k.type === 'dev') || liquid == null) return null;
  // Periodo: «Del 01 de ENERO de 2017 al 31 de DICIEMBRE de 2017» (o con fechas dd/mm/aaaa).
  // Si abarca varios meses (bonus anual, atrasos…) cuenta la fecha de pago (la de la firma).
  const M = `${MONTHS.join('|')}|setiembre`;
  const mIdx = (w) => MONTHS.indexOf(w.toLowerCase().replace('setiembre', 'septiembre')) + 1;
  let year = null, month = null, kind = 'monthly';
  const pw = text.match(new RegExp(`Del?\\s+\\d{1,2}\\s+de\\s+(${M})\\s+de\\s+(\\d{4})\\s+al?\\s+\\d{1,2}\\s+de\\s+(${M})\\s+de\\s+(\\d{4})`, 'i'));
  const pd = text.match(/Del?\s+\d{1,2}[\/.-](\d{1,2})[\/.-](\d{4})\s+al?\s+\d{1,2}[\/.-](\d{1,2})[\/.-](\d{4})/i);
  const span = pw ? [mIdx(pw[1]), +pw[2], mIdx(pw[3]), +pw[4]] : pd ? [+pd[1], +pd[2], +pd[3], +pd[4]] : null;
  if (span && span[0] === span[2] && span[1] === span[3]) { month = span[0]; year = span[1]; }
  else if (span) {
    const rest = pw ? text.replace(pw[0], '') : pd ? text.replace(pd[0], '') : text;
    const paid = rest.match(new RegExp(`\\b\\d{1,2}\\s+de\\s+(${M})\\s+de\\s+(\\d{4})`, 'i'));
    if (paid) { month = mIdx(paid[1]); year = +paid[2]; } else { month = span[2]; year = span[3]; }
    kind = 'extra';
  } else {
    const named = text.match(new RegExp(`\\b(${M})\\b\\s*(?:de\\s+|\\/\\s*)?((?:19|20)\\d{2})\\b`, 'i'));
    if (named) { month = mIdx(named[1]); year = +named[2]; }
  }
  if (/(?:PAGA|GRATIFICACI[ÓO]N)\s+(?:EXTRA|EXTRAORDINARIA)/i.test(text) && !concepts.some((k) => /SALARIO|SUELDO/i.test(k.name))) kind = 'extra';
  const companyIt = pages.flat().find((it) => /,?\s*S\.\s?(?:A|L)\.(?:\s?U\.)?$|\bS\.?\s?COOP\.?$/i.test(it.s) && it.s.length > 6);
  const t = slipTotals(normSlip({ concepts }));
  const check = Math.abs(t.net - liquid) < 0.02 && (gross == null || Math.abs(t.gross - gross) < 0.02) && (dedTotal == null || Math.abs(t.gross - t.net - dedTotal) < 0.02);
  return {
    table: true, year, month, kind, company: companyIt ? prettyCompany(companyIt.s) : '',
    concepts, liquid, irpfPct: concepts.find((k) => k.cat === 'irpf')?.qty ?? null,
    gross: t.gross, irpf: t.irpf, ss: t.ss, other: t.other, check,
  };
}

// ---------- Lector general de nóminas (cualquier empresa) ----------
// Solo se usa si el PDF no tiene el formato de recibo SAP de arriba. Se apoya en el modelo oficial
// de recibo de salarios (Orden ESS/2098/2014), común a todas las empresas: «Total devengado»,
// «Total a deducir», «Líquido total a percibir», IRPF y las cotizaciones del trabajador
// (contingencias comunes, desempleo, formación profesional, MEI…). Lee los totales, no cada
// concepto, y siempre se enseña al usuario para que lo revise antes de guardar.
const G_AMT = /\d{1,3}(?:\.\d{3})+,\d{2}|\d+,\d{2}/g;
function gAmountsAfter(t, re, { from = 0, to = t.length, max = 3 } = {}) {
  const slice = t.slice(from, to);
  const m = slice.match(re);
  if (!m) return null;
  const at = from + m.index;
  const rest = t.slice(at + m[0].length, Math.min(to, at + m[0].length + 160));
  const out = [];
  let last = 0;
  for (const am of rest.matchAll(G_AMT)) {
    // Entre la etiqueta y el importe no puede haber otra etiqueta (palabras de 4 o más letras;
    // se admite algo como «(A-B)»). Tras el primer importe, cualquier letra es ya otra línea.
    const gap = rest.slice(last, am.index);
    if (out.length ? /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(gap) : /[A-Za-zÁÉÍÓÚÑáéíóúñ]{4,}/.test(gap)) break;
    const pct = /^\s*%/.test(rest.slice(am.index + am[0].length));
    out.push({ v: parseAmount(am[0]), pct });
    last = am.index + am[0].length;
    if (out.length >= max) break;
  }
  return out.length ? { at, values: out } : null;
}
// Importe de una línea «concepto [base] [%] importe»: el último que no sea un porcentaje.
function gLineAmount(found) {
  if (!found) return null;
  const money = found.values.filter((x) => !x.pct);
  const pct = found.values.find((x) => x.pct)?.v ?? (found.values.length > 1 && found.values[0].v <= 60 ? found.values[0].v : null);
  const v = money.length ? money.at(-1).v : null;
  return v == null ? null : { v, pct };
}

async function readGenericPayslipPdf(file) {
  const t = await pdfText(file);
  if (!/L[ÍI]QUIDO|NETO A PERCIBIR/i.test(t) || !/DEVENG|BRUTO/i.test(t)) return null;
  const netF = gAmountsAfter(t, /L[ÍI]QUIDO\s+(?:TOTAL\s+)?A\s+(?:PERCIBIR|COBRAR)|TOTAL\s+L[ÍI]QUIDO|NETO\s+A\s+PERCIBIR/i);
  const grossF = gAmountsAfter(t, /TOTAL\s+DEVENGADO|TOTAL\s+DEVENGOS|TOTAL\s+BRUTO|DEVENGOS\s+TOTALES/i);
  const net = gLineAmount(netF)?.v, gross = gLineAmount(grossF)?.v;
  if (net == null || gross == null) return null;
  // Las cotizaciones de la empresa suelen ir después del líquido: se busca solo antes.
  const to = netF.at;
  const dedF = gAmountsAfter(t, /TOTAL\s+A\s+DEDUCIR|TOTAL\s+DEDUCCIONES|TOTAL\s+DESCUENTOS/i, { to });
  const ded = gLineAmount(dedF)?.v ?? round2(gross - net);
  const irpfL = gLineAmount(gAmountsAfter(t, /RETENCI[ÓO]N\s+(?:A\s+CUENTA\s+)?(?:DEL?\s+)?I\.?\s?R\.?\s?P\.?\s?F\.?|IMPUESTO\s+SOBRE\s+LA\s+RENTA(?:\s+DE\s+LAS\s+PERSONAS\s+F[ÍI]SICAS)?|\bI\.?R\.?P\.?F\.?(?![A-Z])/i, { to }));
  const ssLabels = [/CONTINGENCIAS\s+COMUNES/i, /DESEMPLEO/i, /FORMACI[ÓO]N\s+PROFESIONAL/i, /\bM\.?E\.?I\.?\b|MECANISMO\s+DE\s+EQUIDAD/i, /HORAS\s+EXTRA(?:ORDINARIAS|S)?(?:\s+(?:FUERZA\s+MAYOR|ESTRUCTURALES|RESTO))?/i];
  const totalAport = gLineAmount(gAmountsAfter(t, /TOTAL\s+APORTACIONES/i, { to }))?.v;
  const ss = totalAport ?? round2(ssLabels.reduce((a, re) => a + (gLineAmount(gAmountsAfter(t, re, { to }))?.v || 0), 0));
  const irpf = irpfL?.v ?? 0;
  const other = round2(Math.max(0, ded - irpf - ss));
  // Periodo: «del 01/03/2025 al 31/03/2025», «MARZO 2025», «marzo de 2025» o «03/2025»
  let year = null, month = null;
  const range = t.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-]((?:19|20)\d{2})\s*(?:al?|-|hasta)\s*\d{1,2}[\/.-]\d{1,2}[\/.-](?:19|20)\d{2}/i);
  const named = t.match(new RegExp(`\\b(${MONTHS.join('|')}|setiembre)\\b\\s*(?:de\\s+|\\/\\s*)?((?:19|20)\\d{2})\\b`, 'i'));
  const mmyy = t.match(/PER[ÍI]ODO[^\d]{0,30}(\d{1,2})[\/-]((?:19|20)\d{2})/i);
  if (range) { month = Number(range[2]); year = Number(range[3]); }
  else if (named) { month = MONTHS.indexOf(named[1].toLowerCase().replace('setiembre', 'septiembre')) + 1; year = Number(named[2]); }
  else if (mmyy) { month = Number(mmyy[1]); year = Number(mmyy[2]); }
  if (!(month >= 1 && month <= 12)) month = null;
  const extra = /(?:PAGA|GRATIFICACI[ÓO]N)\s+(?:EXTRA|EXTRAORDINARIA)/i.test(t) && !/SALARIO\s+BASE/i.test(t);
  const company = (t.match(/EMPRESA:?\s+(.{3,60}?)\s+(?:DOMICILIO|C\.?I\.?F|N\.?I\.?F|C\.?C\.?C|CENTRO)/i)?.[1]
    ?? t.match(/([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ&.,\- ]{1,60}?,?\s+S\.\s?(?:A|L)\.(?:U\.)?)/)?.[1] ?? '').trim();
  return {
    generic: true, year, month, kind: extra ? 'extra' : 'monthly', company: prettyCompany(company),
    gross, irpf, ss, other, liquid: net, irpfPct: irpfL?.pct ?? null,
    // ¿Cuadran los totales leídos entre sí? (bruto − descuentos = líquido)
    check: dedF != null && Math.abs(gross - ded - net) < 0.02 && Math.abs(gross - irpf - ss - other - net) < 0.02,
  };
}

// ---------- Certificado de retenciones (modelo de la AEAT) ----------
// Lo da la empresa cada año para la Renta. Se guardan sus casillas y se comparan con la suma
// de las nóminas de ese ejercicio.
function normCert(c) {
  const n = (v) => Number(v) || 0;
  return {
    id: c.id || uid(),
    year: Number(c.year) || new Date().getFullYear() - 1,
    company: c.company || '',
    gross: n(c.gross),          // retribuciones dinerarias: importe íntegro satisfecho
    ret: n(c.ret),              // retenciones practicadas
    especie: n(c.especie),      // retribuciones en especie: valoración
    iac: n(c.iac),              // ingresos a cuenta efectuados
    iacRep: n(c.iacRep),        // ingresos a cuenta repercutidos
    pp: n(c.pp),                // contribuciones empresariales a planes de pensiones
    ss: n(c.ss),                // gastos deducibles (cotizaciones a la Seguridad Social)
    exentas: n(c.exentas),      // rentas exentas (mod. 190)
    dietas: n(c.dietas),        // dietas exceptuadas de gravamen
    arrears: Array.isArray(c.arrears) ? c.arrears.map((a) => ({ year: Number(a.year) || 0, gross: n(a.gross), ret: n(a.ret) })) : [],
    file: c.file && c.file.id ? { id: c.file.id, name: c.file.name || 'certificado', type: c.file.type || '', size: Number(c.file.size) || 0 } : null,
  };
}

// Texto de un PDF (se recuerda por archivo: al subir se mira si es declaración, certificado o nómina).
const pdfTextCache = new WeakMap();
function pdfText(file) {
  if (!pdfTextCache.has(file)) pdfTextCache.set(file, readPdfText(file));
  return pdfTextCache.get(file);
}
async function readPdfText(file) {
  const lib = await loadPdfJs();
  const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  let text = '';
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    text += ' ' + (await page.getTextContent()).items.map((it) => it.str).join(' ');
  }
  return text.replace(/\s+/g, ' ');
}

// Devuelve las casillas del certificado o null si el PDF no es un certificado de retenciones.
async function readCertPdf(file) {
  const t = await pdfText(file);
  if (!/Certificado de retenciones/i.test(t)) return null;
  const AMT = '(\\d{1,3}(?:\\.\\d{3})*,\\d{2})';
  // Importes que siguen a una etiqueta (tras los puntos de relleno), hasta `max`
  const after = (label, max = 1) => {
    const lm = t.match(label);
    if (!lm) return [];
    // Tras la etiqueta: se salta el texto hasta los puntos de relleno (si los hay)
    let rest = t.slice(lm.index + lm[0].length);
    if (!/^[\s.]*\d/.test(rest)) rest = rest.replace(/^.*?\.{3,}/, '');
    const m = rest.match(new RegExp(`^[\\s.]*${AMT}(?:\\s+${AMT})?(?:\\s+${AMT})?`));
    return m ? m.slice(1, 1 + max).filter(Boolean).map(parseAmount) : [];
  };
  // Modelo antiguo (hasta 2016): columnas «Retenciones · Importe», al revés que el actual.
  const old = /Rendimientos correspondientes al ejercicio\s+Retenciones\s+Importe/i.test(t);
  const pair = (v) => (old ? [v[1], v[0]] : v); // → [importe, retención]
  const [gross = 0, ret = 0] = pair(after(/Retribuciones dinerarias/, 2));
  const [especie = 0, iac = 0, iacRep = 0] = after(/Retribuciones en especie/, 3);
  const [pp = 0] = after(/excepto a seguros colectivos de dependencia\)/).length
    ? after(/excepto a seguros colectivos de dependencia\)/) : after(/Contrib\. Planes Pensiones/);
  const [ss = 0] = after(/Gastos fiscalmente deducibles/);
  const [exentas = 0] = after(/\(mod\. 190\)/).length ? after(/\(mod\. 190\)/) : after(/Otras rentas exentas/);
  const [dietas = 0] = after(/cuantías exceptuadas de gravamen del IRPF/).length
    ? after(/cuantías exceptuadas de gravamen del IRPF/) : after(/Dietas y asignaciones para gastos de viaje/);
  // Atrasos: filas «ejercicio importe retención» (en el antiguo, «ejercicio retención importe»)
  const a0 = t.search(old ? /Rendimientos de ejercicios anteriores/ : /Ejercicio de devengo/);
  const a1 = t.search(old ? /Cantidades reintegradas/ : /Información de interés para el perceptor\.- La percepción/);
  const arrears = [];
  if (a0 >= 0 && a1 > a0) {
    for (const m of t.slice(a0, a1).matchAll(new RegExp(`\\b(20\\d{2})\\s+${AMT}(?:\\s+${AMT})?`, 'g'))) {
      const [g, r] = old && m[3] ? [m[3], m[2]] : [m[2], m[3]];
      arrears.push({ year: Number(m[1]), gross: parseAmount(g), ret: r ? parseAmount(r) : 0 });
    }
  }
  const year = Number((t.match(/correspondientes al ejercicio (\d{4})/i) ?? t.match(/\bEjercicio (\d{4})/))?.[1]) || null;
  const company = (t.match(/entidad pagadora .*?razón social [A-Z]\d{7}[A-Z0-9] (.+?) • /)
    ?? t.match(/Datos del pagador .*?Razón Social [A-Z]\d{7}[A-Z0-9] (.+?) Domicilio/))?.[1]?.trim() || '';
  return { year, company: prettyCompany(company), gross, ret, especie, iac, iacRep, pp, ss, exentas, dietas, arrears };
}
const prettyCompany = (s) => (/[a-z]/.test(s) ? s : s.toLowerCase().replace(/(^|[\s(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()).replace(/\bS\.a\./i, 'S.A.').replace(/\bS\.l\./i, 'S.L.').replace(/\b(And|Of|De|Del|Y)\b/g, (w) => w.toLowerCase()));

// Comparación certificado ↔ nóminas del mismo año. strict: deben coincidir (margen de 1 €);
// el resto son informativos (la empresa valora la especie y las rentas exentas con criterio fiscal).
function certCheck(cert, slips, pool = slips) {
  const r = rentaData(slips, pool, cert.year);
  const cajaNote = r.caja ? `Incluye ${numStr2(r.caja)} € cobrados por caja` : '';
  const rows = [
    { label: 'Retribuciones dinerarias', slips: round2(r.gross + r.caja), cert: cert.gross, strict: true, note: cajaNote },
    // La retención de los pagos por caja es una estimación: margen de 1 € + 2 % de lo estimado
    { label: 'Retenciones de IRPF', slips: round2(r.irpf + r.cajaRet), cert: cert.ret, strict: true, tol: 1 + r.cajaRet * 0.02,
      note: r.cajaRet ? `Incluye ~${numStr2(r.cajaRet)} € estimados de los pagos por caja` : '' },
    { label: 'Cotizaciones a la Seguridad Social', slips: r.ss, cert: cert.ss, strict: true, note: 'Gastos deducibles' },
    { label: 'Aportación de la empresa al plan de pensiones', slips: r.ppCo, cert: cert.pp, strict: true },
    { label: 'Especie + rentas exentas', slips: r.especie, cert: cert.especie + cert.exentas, strict: false, note: 'Orientativo: comedor, seguros y acciones' },
  ];
  rows.forEach((x) => { x.diff = round2(x.slips - x.cert); x.ok = Math.abs(x.diff) < (x.tol ?? 1); });
  return { rows, ok: rows.filter((x) => x.strict).every((x) => x.ok), count: slips.length };
}

// ---------- Declaración de la Renta presentada (Modelo 100 de la AEAT) ----------
// La numeración de las casillas cambia según el año (0003 en 2018–2023, 0002 en 2017, 001 en
// 2015–2016, 01 en el borrador de 2014), así que cada dato se busca por su etiqueta, que no cambia.
// Se guardan solo esos importes (v), su número de casilla de ese año (b) y la fecha de presentación;
// no se copian nombres, NIF ni direcciones.
const DECL_FIELDS = [
  ['gross', /Retribuciones dinerarias/],
  ['especie', /Valoración (?:de la )?retribución en especie/],
  ['iac', /Ingresos a cuenta de (?:la )?retribución en especie/],
  ['pp', /Contribuciones empresariales a Planes de Pensiones y Mutualidades de Previsión Social/],
  ['ingresosTrabajo', /Total ingresos íntegros computables/],
  ['ss', /Cotizac(?:\.|iones) (?:a la )?Seguridad Social[^\d]{0,140}?Hu[ée]rfanos/],
  ['union', /Cuotas satisfechas a sindicatos/],
  ['rnTrabajo', /Rendimiento neto reducido/], // el primero es el del trabajo
  ['capital', /Suma de rendimientos de capital mobiliario a integrar en la base imponible del ahorro/],
  ['ganancias', /Saldo neto positivo de ganan.{0,90}?ahorro/],
  ['ppTrab', /Aportaciones del trabajador al PP de la empresa/],
  ['ppRed', /Reducción por aportaciones[^\d]{0,120}(?:Importe que se aplica|\(régimen general\))/],
  ['blg', /Base liquidable general sometida a gravamen/],
  ['bla', /Base liquidable del ahorro/],
  ['tme', /Tipo medio estatal/],
  ['tma', /Tipo medio autonómico/],
  ['cie', /Cuota íntegra estatal/],
  ['cia', /Cuota íntegra autonómica/],
  ['cle', /Cuota líquida estatal/],
  ['cla', /Cuota líquida autonómica/],
  ['cuotaLiq', /Cuota líquida incrementada total/],
  ['retTrabajo', /Por rendimientos del trabajo/],
  ['pagosCuenta', /Total pagos a cuenta/],
  ['cuotaDif', /Cuota diferencial/],
  ['result', /Resultado de la declaración(?! complementaria)|Resultado \[\(/],
  ['perdidas', /Pendiente de aplicación en ejercicios futuros/],
  ['minE', /Mínimo personal y familiar para calcular el gravamen estatal/],
  ['minA', /Mínimo personal y familiar para calcular el gravamen autonómico/],
];
// Casillas del modelo 2018–2023 (para declaraciones guardadas con la versión 0.5.0)
const DECL_BOX_2023 = { '0003': 'gross', '0004': 'especie', '0005': 'iac', '0008': 'pp', '0012': 'ingresosTrabajo', '0013': 'ss',
  '0014': 'union', '0025': 'rnTrabajo', '0041': 'capital', '0424': 'ganancias', '0426': 'ppTrab', '0492': 'ppRed', '0505': 'blg',
  '0510': 'bla', '0534': 'tme', '0535': 'tma', '0545': 'cie', '0546': 'cia', '0570': 'cle', '0571': 'cla', '0587': 'cuotaLiq',
  '0596': 'retTrabajo', '0609': 'pagosCuenta', '0610': 'cuotaDif', '0670': 'result', '1263': 'perdidas' };

function normDecl(d) {
  const v = {}, b = {};
  Object.entries(d.v || {}).forEach(([k, x]) => { if (Number.isFinite(Number(x))) v[k] = Number(x); });
  Object.entries(d.b || {}).forEach(([k, x]) => { if (/^[\dA-Z]{2,4}$/.test(x)) b[k] = x; });
  // Formato antiguo (v0.5.0): casillas del modelo 2023 → campos
  Object.entries(d.c || {}).forEach(([box, x]) => { const k = DECL_BOX_2023[box]; if (k && !(k in v)) { v[k] = Number(x); b[k] = box; } });
  return {
    id: d.id || uid(),
    year: Number(d.year) || new Date().getFullYear() - 1,
    presented: d.presented || '', // AAAA-MM-DD
    draft: !!d.draft,             // borrador (no presentada)
    v, b,
    file: d.file && d.file.id ? { id: d.file.id, name: d.file.name || 'declaración', type: d.file.type || '', size: Number(d.file.size) || 0 } : null,
  };
}

// Devuelve { year, presented, draft, v, b } o null si el PDF no es una declaración de la Renta.
async function readDeclPdf(file) {
  const t = await pdfText(file);
  if (/Certificado de retenciones/i.test(t)) return null;
  if (!/Renta de las Personas F[ií]sicas|I\.R\.P\.F\./i.test(t) || !/Modelo|MODELO|BORRADOR DE DECLARACI/.test(t)) return null;
  const AMT = /-?\d{1,3}(?:\.\d{3})*,\d{2}/;
  const v = {}, b = {};
  for (const [key, label] of DECL_FIELDS) {
    const lm = t.match(label);
    if (!lm) continue;
    const rest = t.slice(lm.index + lm[0].length, lm.index + lm[0].length + 400);
    const am = rest.match(AMT);
    if (!am) continue;
    // Entre la etiqueta y el importe no puede haber otra etiqueta (palabras en minúscula):
    // si el dato está vacío, el siguiente importe es de otra casilla.
    const between = rest.slice(0, am.index);
    // (lo que va entre corchetes es la fórmula de la casilla: «[suma de (592) a (606)]»)
    if (/[a-záéíóúñ]{2,}/.test(between.replace(/\[[^\]]*\]/g, '')) || between.length > 250) continue;
    v[key] = pdfNum(am[0]);
    // Número de casilla: delante del importe (borrador de 2014) o justo detrás (resto de años)
    const before = between.replace(/\[[^\]]*\]/g, '').match(/(\d{2,4}|[A-Z]{2,4})\s*$/);
    const after = rest.slice(am.index + am[0].length).match(/^\s*(\d{3,4})(?![\d,])/);
    if (after) b[key] = after[1];
    else if (before) b[key] = before[1];
  }
  if (v.gross == null || (v.cie == null && v.blg == null && v.result == null)) return null;
  if (v.result == null && v.cuotaDif != null) v.result = v.cuotaDif;
  // Ejercicio de origen de las pérdidas pendientes («Ejercicio 2020. Pendiente de aplicación…»)
  const py = t.match(/Ejercicio (\d{4})\.\s*Pendiente de aplicación en ejercicios futuros/);
  if (py) v.perdidasYear = Number(py[1]);
  const year = Number((t.match(/Modelo\s*100\s+Ejercicio\s+(\d{4})/i) ?? t.match(/I\.R\.P\.F\.\s+EJERCICIO\s+(\d{4})/)
    ?? t.match(/\bEjercicio\s*(20\d{2})\b/i) ?? t.match(/ejercicio (20\d{2}) de la que se derive/i))?.[1]) || null;
  const p = t.match(/(\d{2})-(\d{2})-(\d{4})\s+a las\s+\d{1,2}[:.]\d{2}/);
  return { year, presented: p ? `${p[3]}-${p[2]}-${p[1]}` : '', draft: /BORRADOR DE DECLARACI/.test(t), v, b };
}
const dv = (d, ...keys) => round2(keys.reduce((a, k) => a + (d.v[k] || 0), 0));
const dhas = (d, ...keys) => keys.some((k) => d.v[k] != null);

// Datos que deben coincidir con el certificado de la empresa y con las nóminas del ejercicio.
function declCheck(d, cert, slips, pool) {
  const r = rentaData(slips, pool, d.year);
  const rows = [];
  const add = (label, key, ref, src, tol = 1) => {
    if (d.v[key] == null && !ref) return; // ni en la declaración ni en la referencia
    const value = dv(d, key);
    const diff = ref == null ? null : round2(value - ref);
    rows.push({ label, box: d.b[key] || '', value, ref, src, diff, ok: diff != null && Math.abs(diff) < tol });
  };
  if (cert) {
    add('Retribuciones dinerarias', 'gross', cert.gross, 'Certificado');
    add('Valoración de la especie', 'especie', cert.especie, 'Certificado');
    add('Ingresos a cuenta de la especie', 'iac', cert.iac, 'Certificado');
    add('Aportación de la empresa al plan', 'pp', cert.pp, 'Certificado');
    add('Seguridad Social', 'ss', cert.ss, 'Certificado');
    // Pagos a cuenta del trabajo = retenciones + ingresos a cuenta de la especie
    add('Retenciones del trabajo', 'retTrabajo', round2(cert.ret + cert.iac), 'Certificado');
  } else if (slips.length) {
    add('Retribuciones dinerarias', 'gross', round2(r.gross + r.caja), 'Nóminas');
    add('Seguridad Social', 'ss', r.ss, 'Nóminas');
    add('Aportación de la empresa al plan', 'pp', r.ppCo, 'Nóminas');
  }
  if (slips.length) {
    add('Cuotas sindicales', 'union', r.union, 'Nóminas');
    if (d.v.ppTrab != null) add('Tu aportación al plan de empresa', 'ppTrab', r.ppEmp, 'Nóminas');
  }
  return { rows, ok: rows.length > 0 && rows.every((x) => x.ok), hasCert: !!cert, count: slips.length };
}

// Resumen rápido de la declaración y comprobación dato a dato.
function declSection(p, d) {
  const cert = p.certs.find((c) => c.year === d.year) ?? null;
  const chk = declCheck(d, cert, p.slips.filter((s) => s.year === d.year), p.slips);
  const result = d.v.result ?? null;
  const refund = result != null && result < 0;
  const who = data.profiles.length > 1 ? ` · ${esc(p.name)}` : '';
  const line = (label, v, note = '', cls = '') => (v == null ? '' : `
    <div class="cat-row"><span class="cat-name">${label}${note ? `<small class="muted">${note}</small>` : ''}</span><span class="amount ${cls}">${money(v)}</span></div>`);
  const cuotaIntegra = dhas(d, 'cie', 'cia') ? dv(d, 'cie', 'cia') : null;
  const cuotaLiquida = dhas(d, 'cuotaLiq') ? dv(d, 'cuotaLiq') : dhas(d, 'cle', 'cla') ? dv(d, 'cle', 'cla') : null;
  const deducciones = cuotaIntegra != null && cuotaLiquida != null ? round2(cuotaIntegra - cuotaLiquida) : null;
  const tipoMedio = dhas(d, 'tme', 'tma') ? dv(d, 'tme', 'tma') : null;
  const presented = d.presented ? new Date(d.presented).toLocaleDateString(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const status = !chk.rows.length
    ? `<p class="small muted">Sube el certificado o las nóminas de ${d.year} para comprobarla.</p>`
    : chk.ok
      ? `<p class="small ok-line">${icon('check', 14)} Cuadra con ${chk.hasCert ? 'el certificado' : 'las nóminas'}${chk.hasCert && chk.count ? ' y las nóminas' : ''}</p>`
      : '<p class="small warn-line">Hay datos que no cuadran: revisa las diferencias.</p>';
  return `
    <section class="group decl-group">
      <h2>${d.draft ? 'Borrador de la Renta' : 'Declaración de la Renta'} ${d.year}${who}</h2>
      <div class="list cert-card decl-card">
        <div class="decl-head">
          <span class="label">${result == null ? 'Resultado' : refund ? 'A devolver' : 'A ingresar'}</span>
          <span class="decl-result ${result == null ? '' : refund ? 'pos' : 'neg'}">${result == null ? '—' : money(Math.abs(result))}</span>
          <span class="muted small">${presented ? `Presentada el ${presented}` : d.draft ? 'Borrador (Modelo 100)' : 'Modelo 100'}${tipoMedio != null ? ` · tipo medio ${isPrivate() ? MASK : numPct(tipoMedio)}` : ''}</span>
        </div>
        <div class="cert-extra decl-lines">
          ${line('Rendimiento neto del trabajo', d.v.rnTrabajo, 'Tras Seguridad Social, cuotas sindicales y otros gastos')}
          ${line('Rendimientos del capital mobiliario', d.v.capital, 'Dividendos, intereses… (neto)')}
          ${line('Ganancias y pérdidas patrimoniales', d.v.ganancias, 'Saldo neto (venta de acciones, fondos…)')}
          ${line('Reducción por planes de pensiones', d.v.ppRed)}
          ${line('Base liquidable general', d.v.blg)}
          ${line('Base liquidable del ahorro', d.v.bla)}
          ${line('Cuota íntegra', cuotaIntegra, 'Estatal + autonómica')}
          ${deducciones ? line('Deducciones', -deducciones, 'Vivienda, donativos, autonómicas…', 'neg') : ''}
          ${line('Cuota líquida', cuotaLiquida)}
          ${line('Retenciones y pagos a cuenta', d.v.pagosCuenta != null ? -d.v.pagosCuenta : null, '', 'neg')}
          ${line(refund ? 'Resultado: a devolver' : 'Resultado: a ingresar', result == null ? null : Math.abs(result), '', refund ? 'pos' : 'neg')}
          ${d.v.perdidas ? line('Pérdidas pendientes de compensar', d.v.perdidas, 'Para ejercicios futuros') : ''}
        </div>
        <div class="decl-check-head">${status}</div>
        ${chk.rows.length ? `
        <div class="amort-cols cert-cols"><span>Dato</span><span>Declaración</span><span>${chk.hasCert ? 'Certif./nóminas' : 'Nóminas'}</span><span>Dif.</span></div>
        ${chk.rows.map((x) => `
        <div class="amort-row cert-cols">
          <span class="cc-label">${esc(x.label)}<small class="muted">${x.box ? `Casilla ${x.box} · ` : ''}según ${x.src.toLowerCase()}</small></span>
          <span>${numStr2(x.value)}</span><span>${numStr2(x.ref)}</span>
          <span class="${x.ok ? 'pos' : 'neg'}">${x.ok ? icon('check', 13) : (x.diff > 0 ? '+' : '') + numStr2(x.diff)}</span>
        </div>`).join('')}` : ''}
        <div class="cert-actions">
          ${d.file ? `<button class="link-btn-text" type="button" data-decl-open="${d.id}">${icon('documents', 16)} Ver declaración</button>` : '<span></span>'}
          <button class="link-btn-text danger" type="button" data-decl-del="${d.id}">Eliminar</button>
        </div>
      </div>
    </section>`;
}
function findDecl(id) {
  for (const p of data.profiles) {
    const d = p.decls.find((x) => x.id === id);
    if (d) return { d, p };
  }
  return null;
}

function normData(d) {
  const profiles = Array.isArray(d?.profiles) && d.profiles.length ? d.profiles : [{ name: 'Yo' }];
  return {
    profiles: profiles.map((p, i) => ({
      id: p.id || uid(),
      name: p.name || `Persona ${i + 1}`,
      color: p.color || PROFILE_COLORS[i % PROFILE_COLORS.length],
      slips: (p.slips || []).map(normSlip),
      certs: (p.certs || []).map(normCert),
      decls: (p.decls || []).map(normDecl),
      sim: p.sim && typeof p.sim === 'object' ? p.sim : {}, // ajustes del simulador de la Renta, por año
    })),
  };
}

let data = normData(load(STORAGE_KEY, null));
let viewId = load(LAST_VIEW_KEY, null);
let screen = 'lock';
let navDir = null;
let navScrollY = 0;
let selYear = new Date().getFullYear();
const openYears = new Set([String(new Date().getFullYear())]);

// ---------- Deshacer ----------
const undoStack = [];
function persist() {
  save(STORAGE_KEY, data);
  markDirty(); // se sube a la nube si la sincronización está activa
}
function trackUndo() {
  undoStack.push(JSON.stringify(data));
  if (undoStack.length > 60) undoStack.shift();
  updateUndoBtn();
}
function updateUndoBtn() {
  $('undo-btn').classList.toggle('dim', !undoStack.length);
}
function undo() {
  if (!undoStack.length) return;
  data = normData(JSON.parse(undoStack.pop()));
  persist();
  updateUndoBtn();
  if (screen.startsWith('slip:') && !findSlip(screen.slice(5))) screen = 'payslips';
  render();
  showToast('Cambio deshecho');
}
// Cambio con posibilidad de deshacer: guarda el estado anterior, aplica y guarda.
function change(fn) {
  trackUndo();
  fn();
  persist();
}

// ---------- Perfiles ----------
const isTotal = () => viewId === TOTAL_ID && data.profiles.length > 1;
const profileById = (id) => data.profiles.find((p) => p.id === id);
const viewProfiles = () => (isTotal() ? data.profiles : [profileById(viewId) ?? data.profiles[0]]);
const currentProfile = () => (isTotal() ? null : viewProfiles()[0]);
const avatarLabel = (p) => esc((p.name.trim()[0] || '?').toUpperCase());
const viewName = () => (isTotal() ? 'Total' : viewProfiles()[0].name);
function validView(id) {
  return id === TOTAL_ID ? data.profiles.length > 1 : !!profileById(id);
}
if (!validView(viewId)) viewId = data.profiles[0].id;

// ---------- Cálculos ----------
// Totales de una nómina: devengos (bruto), IRPF, Seguridad Social, otras deducciones y líquido.
function slipTotals(s) {
  if (s.concepts.length) {
    const dev = s.concepts.filter((k) => k.type === 'dev');
    const ded = s.concepts.filter((k) => k.type === 'ded');
    const gross = sumBy(dev, (k) => k.amount);
    const irpf = sumBy(ded.filter((k) => k.cat === 'irpf'), (k) => k.amount);
    const ss = sumBy(ded.filter((k) => k.cat === 'ss'), (k) => k.amount);
    const other = sumBy(ded.filter((k) => k.cat === 'other'), (k) => k.amount);
    return { gross, irpf, ss, other, net: round2(gross - irpf - ss - other) };
  }
  return { gross: s.gross, irpf: s.irpf, ss: s.ss, other: s.other, net: round2(s.gross - s.irpf - s.ss - s.other) };
}
function aggregate(slips) {
  const ts = slips.map(slipTotals);
  const t = { gross: 0, irpf: 0, ss: 0, other: 0, net: 0, count: slips.length };
  ts.forEach((x) => { for (const k of ['gross', 'irpf', 'ss', 'other', 'net']) t[k] += x[k]; });
  for (const k of ['gross', 'irpf', 'ss', 'other', 'net']) t[k] = round2(t[k]);
  t.irpfRate = t.gross ? t.irpf / t.gross : 0;
  return t;
}
const allSlips = (profiles = viewProfiles()) => profiles.flatMap((p) => p.slips.map((s) => ({ ...s, owner: p })));
const slipsOfYear = (year, profiles) => allSlips(profiles).filter((s) => s.year === year);
const sortSlips = (arr) => [...arr].sort((a, b) => b.year - a.year || b.month - a.month || (a.kind === 'monthly' ? 1 : -1));
function yearsWithData(profiles = viewProfiles()) {
  const ys = new Set([...allSlips(profiles).map((s) => s.year), ...profiles.flatMap((p) => [...p.certs, ...p.decls].map((c) => c.year))]);
  ys.add(new Date().getFullYear());
  return [...ys].sort((a, b) => b - a);
}
function findCert(id) {
  for (const p of data.profiles) {
    const c = p.certs.find((x) => x.id === id);
    if (c) return { c, p };
  }
  return null;
}
function findSlip(id) {
  for (const p of data.profiles) {
    const s = p.slips.find((x) => x.id === id);
    if (s) return { s, p };
  }
  return null;
}
const slipTitle = (s) => `${MONTHS[s.month - 1][0].toUpperCase()}${MONTHS[s.month - 1].slice(1)} ${s.year}`;
const slipSub = (s) => [s.kind !== 'monthly' ? KINDS[s.kind] : '', s.company].filter(Boolean).join(' · ');

// ---------- Face ID / Touch ID ----------
// El sistema usa el sensor que tenga el dispositivo; aquí solo se adapta el texto.
const isIPad = /iPad/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
const isIPhone = /iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
const isWindows = /Windows/.test(navigator.userAgent);
const BIO = isIPhone ? 'Face ID' : isAndroid ? 'la huella' : isWindows ? 'Windows Hello' : 'Touch ID';
const BIO_NAME = BIO === 'la huella' ? 'Huella dactilar' : BIO;
let bioAvailable = null;
const securityLevel = () => {
  const s = load(SECURITY_KEY, null);
  return s === 'pin' || s === 'none' ? s : 'bio';
};
const effectiveLevel = () => (securityLevel() === 'bio' && bioAvailable === false ? 'pin' : securityLevel());
const b64 = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))),
  dec: (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
};
const randomBytes = (n) => crypto.getRandomValues(new Uint8Array(n));

async function biometricsAvailable() {
  return !!(window.PublicKeyCredential &&
    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
}
async function registerFaceId() {
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge: randomBytes(32),
      rp: { name: 'PayCTRL' },
      user: { id: randomBytes(16), name: 'omt-nominas', displayName: 'PayCTRL' },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' },
      timeout: 60000,
    },
  });
  localStorage.setItem(CRED_KEY, b64.enc(cred.rawId));
}
async function verifyFaceId() {
  const id = localStorage.getItem(CRED_KEY);
  await navigator.credentials.get({
    publicKey: {
      challenge: randomBytes(32),
      allowCredentials: [{ type: 'public-key', id: b64.dec(id) }],
      userVerification: 'required',
      timeout: 60000,
    },
  });
}

// ---------- Bloqueo y sesión ----------
const session = {
  mark: () => save(SESSION_KEY, { at: Date.now() }),
  clear: () => { try { localStorage.removeItem(SESSION_KEY); } catch {} },
  get: () => {
    const s = load(SESSION_KEY, null);
    return s && Date.now() - s.at < RELOCK_AFTER_MS ? s : null;
  },
};
let unlocked = false;

function lockApp() {
  closeSheet();
  closeViewer();
  unlocked = false;
  session.clear();
  closeMenu();
  go('lock');
}

async function pinHash(pin, salt) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 200000 }, base, 256);
  return b64.enc(bits);
}

function pinSheet(create, intro = '') {
  return new Promise((resolve) => {
    const back = document.createElement('div');
    back.className = 'sheet-backdrop';
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Código de acceso">
        <h2 class="sheet-title">${create ? 'Crea un código de acceso' : 'Código de acceso'}</h2>
        <p class="muted small">${intro || (create
          ? 'Elige un código numérico de al menos 4 cifras para proteger la app en este dispositivo.'
          : 'Introduce tu código para ver los datos.')}</p>
        <label class="field"><span>Código</span><input class="p1" type="password" inputmode="numeric" autocomplete="${create ? 'new-password' : 'current-password'}" maxlength="32"></label>
        ${create ? '<label class="field"><span>Repite el código</span><input class="p2" type="password" inputmode="numeric" autocomplete="new-password" maxlength="32"></label>' : ''}
        <p class="error p-err" role="alert"></p>
        <div class="body-actions">
          <button class="text-btn p-cancel" type="button">Cancelar</button>
          <button class="text-btn done-btn p-ok" type="button">${create ? 'Guardar' : 'Entrar'}</button>
        </div>
      </div>`;
    const q = (sel) => back.querySelector(sel);
    const done = (v) => { back.remove(); resolve(v); };
    q('.p-cancel').addEventListener('click', () => done(false));
    const submit = async () => {
      const pin = q('.p1').value;
      if (pin.length < 4) return void (q('.p-err').textContent = 'Mínimo 4 caracteres.');
      if (create) {
        if (!/^\d{4,12}$/.test(pin)) return void (q('.p-err').textContent = 'Usa solo números (de 4 a 12 cifras).');
        if (pin !== q('.p2').value) return void (q('.p-err').textContent = 'Los códigos no coinciden.');
        const salt = crypto.getRandomValues(new Uint8Array(16));
        save(PIN_KEY, { salt: b64.enc(salt), hash: await pinHash(pin, salt) });
        return done(true);
      }
      const stored = load(PIN_KEY, null);
      if (stored && (await pinHash(pin, b64.dec(stored.salt))) === stored.hash) return done(true);
      q('.p-err').textContent = 'Código incorrecto.';
      q('.p1').select();
    };
    q('.p-ok').addEventListener('click', submit);
    back.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    document.body.append(back);
    q('.p1').focus();
  });
}

async function authenticate(level = effectiveLevel()) {
  if (level === 'none') return true;
  if (level === 'pin' || !(await biometricsAvailable())) return pinSheet(!load(PIN_KEY, null));
  return bioAuth();
}
async function bioAuth() {
  try {
    if (!localStorage.getItem(CRED_KEY)) await registerFaceId();
    else await verifyFaceId();
    return true;
  } catch (err) {
    console.warn(err);
    showToast(err.name === 'NotAllowedError'
      ? `Verificación cancelada. Vuelve a tocar el botón para intentarlo con ${BIO}.`
      : `No se pudo verificar con ${BIO}.`, { warn: true });
    return false;
  }
}
async function unlock() {
  if (!session.get() && !(await authenticate())) return false;
  unlocked = true;
  session.mark();
  syncNow();
  return true;
}

biometricsAvailable().then((v) => {
  bioAvailable = v;
  if (screen === 'lock') render();
}).catch(() => { bioAvailable = false; });

// ---------- Nivel de seguridad (menú ⋯) ----------
const FACE_GLYPH = '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 15.5c1.5 1.2 3.5 1.2 5 0"/>';
const FINGER_GLYPH = '<path d="M7.5 17.5c.8-1.6 1.2-3.4 1.2-5.3a3.3 3.3 0 0 1 6.6 0c0 .9 0 1.8-.2 2.6"/><path d="M5.2 14.8c.3-.9.5-1.8.5-2.8a6.3 6.3 0 0 1 12.2-2.2"/><path d="M12 12.2c0 2.9-.8 5.6-2.2 7.8"/><path d="M14.8 17.2c-.3 1-.7 1.9-1.2 2.8"/><path d="M18.3 13.5c0 1.5-.2 3-.6 4.4"/>';
const LOCK_GLYPH = '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>';
const KEYPAD_GLYPH = [6, 12, 18].flatMap((y) => [6, 12, 18].map((x) => `<circle cx="${x}" cy="${y - 1.5}" r="1.6"/>`)).join('') + '<circle cx="12" cy="22" r="1.6"/>';
const ENTER_GLYPH = '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>';
const SECURITY_OPTS = [
  { key: 'bio', title: () => BIO_NAME, sub: () => (bioAvailable === false ? 'No disponible en este dispositivo' : `Se pide ${BIO} al entrar en la app.`) },
  { key: 'pin', title: () => 'Código numérico', sub: () => 'Un código de 4 a 12 cifras.' },
  { key: 'none', title: () => 'Sin protección', sub: () => 'Se entra con un toque. Quien use este dispositivo podrá ver tus nóminas.' },
];
const SECURITY_GLYPH = { bio: () => (isIPhone ? FACE_GLYPH : FINGER_GLYPH), pin: () => KEYPAD_GLYPH, none: () => ENTER_GLYPH };

function openSecuritySheet() {
  const back = newSheet();
  const draw = () => {
    const cur = effectiveLevel();
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Nivel de seguridad">
        <h2 class="sheet-title">Nivel de seguridad</h2>
        <p class="muted small">Cómo se entra en la app en este dispositivo. Para cambiarlo se pide primero el método actual.</p>
        <div class="list sec-list" role="radiogroup">${SECURITY_OPTS.map((o) => `
          <button class="sec-opt ${cur === o.key ? 'on' : ''}" type="button" role="radio" aria-checked="${cur === o.key}" data-level="${o.key}" ${o.key === 'bio' && bioAvailable === false ? 'disabled' : ''}>
            <span class="cat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SECURITY_GLYPH[o.key]()}</svg></span>
            <span class="sec-text"><span class="sec-title">${esc(o.title())}</span><span class="muted small">${esc(o.sub())}</span></span>
            <span class="sec-check">${cur === o.key ? icon('check', 18) : ''}</span>
          </button>`).join('')}</div>
        ${cur === 'pin' ? '<button class="link-btn-text sec-change" type="button">Cambiar el código</button>' : ''}
        <div class="body-actions"><span></span><button class="text-btn done-btn s-close" type="button">Listo</button></div>
      </div>`;
    back.querySelectorAll('.sec-opt').forEach((b) => b.addEventListener('click', async () => {
      if (b.dataset.level === effectiveLevel()) return;
      if (await changeSecurity(b.dataset.level)) draw();
    }));
    back.querySelector('.sec-change')?.addEventListener('click', async () => {
      if (await changeSecurity('pin', true)) draw();
    });
    back.querySelector('.s-close').addEventListener('click', closeSheet);
  };
  draw();
}
async function changeSecurity(next, changePin = false) {
  const cur = effectiveLevel();
  if (cur === 'bio' && !(await bioAuth())) return false;
  if (cur === 'pin' && load(PIN_KEY, null) &&
      !(await pinSheet(false, changePin ? 'Introduce el código actual.' : 'Introduce tu código actual para cambiar el nivel de seguridad.'))) return false;
  if (next === 'pin' && !(await pinSheet(true, changePin ? 'Elige el nuevo código (de 4 a 12 cifras).' : 'Elige un código numérico de 4 a 12 cifras para entrar en la app.'))) return false;
  if (next === 'bio' && !(await bioAuth())) return false;
  if (next !== 'pin') { try { localStorage.removeItem(PIN_KEY); } catch {} }
  save(SECURITY_KEY, next);
  session.mark();
  showToast(changePin ? 'Código actualizado'
    : next === 'none' ? 'Seguridad desactivada: se entra con un toque'
    : `Se pedirá ${next === 'pin' ? 'el código' : BIO} al entrar`);
  return true;
}

document.addEventListener('visibilitychange', () => {
  if (!unlocked) {
    if (!document.hidden && sync) syncNow(); // en la pantalla de entrada también se trae lo nuevo
    return;
  }
  if (document.hidden) {
    session.mark(); // hora en que se salió de la app
    if (sync?.dirty) syncNow(); // sube lo pendiente antes de salir
  } else if (session.get() || effectiveLevel() === 'none') {
    session.mark();
    syncNow();
  } else {
    lockApp();
  }
});

// ---------- Navegación ----------
function buildTabbar() {
  const tabs = [{ key: 'summary', label: 'Resumen' }, ...SCREENS];
  $('tabbar').innerHTML = tabs.map((t) =>
    `<button class="tab" data-tab="${t.key}">${icon(t.key, 24)}<span>${t.label}</span></button>`).join('');
  $('tabbar').querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => go(b.dataset.tab)));
}

// dir: 'forward' (entra desde la derecha) | 'back' (desde la izquierda) | null (sin animación)
function go(next, dir = null) {
  // De las nóminas (slip:id) no se envía cuál
  if (next !== screen && next !== 'lock') track(`/pantalla/${next.split(':')[0]}`);
  navScrollY = window.scrollY;
  navDir = dir;
  screen = next;
  closeMenu();
  window.scrollTo(0, 0);
  render();
}
// Volver un nivel: nómina → Nóminas, simulador → Renta, el resto → Resumen.
function back() {
  go(screen.startsWith('slip:') ? 'payslips' : screenByKey[screen]?.parent ?? 'summary', 'back');
}
function switchView(id) {
  if (!validView(id) || id === viewId) return;
  viewId = id;
  save(LAST_VIEW_KEY, id);
  session.mark();
  closeMenu();
  if (screen.startsWith('slip:')) screen = 'payslips';
  render();
}

function render() {
  const locked = screen === 'lock' || !unlocked;
  if (locked) screen = 'lock';
  document.body.classList.toggle('locked', locked);
  $('tabbar').hidden = locked;
  $('profilebar').hidden = locked || data.profiles.length < 2;
  if (!$('profilebar').hidden) buildProfileBar();
  $('back-btn').hidden = screen === 'summary';
  $('subtitle').textContent = locked ? '' : viewName();
  const slip = screen.startsWith('slip:') ? findSlip(screen.slice(5)) : null;
  if (screen.startsWith('slip:') && !slip) screen = 'payslips';
  $('title').textContent = locked ? '' : screen === 'summary' ? 'Resumen' : slip ? 'Nómina' : screenByKey[screen].label;
  const tabKey = slip ? 'payslips' : screenByKey[screen]?.parent ?? screen;
  $('tabbar').querySelectorAll('.tab').forEach((b) => b.toggleAttribute('aria-current', b.dataset.tab === tabKey));

  const el = locked ? renderLock()
    : screen === 'summary' ? renderSummary()
    : slip ? renderSlip(slip.s, slip.p)
    : screen === 'payslips' ? renderPayslips()
    : screen === 'concepts' ? renderConcepts()
    : screen === 'renta' ? renderRenta()
    : screen === 'sim' ? renderSim()
    : screen === 'evolution' ? renderEvolution()
    : renderDocuments();
  const dir = navDir;
  navDir = null;
  swapView(el, locked ? null : dir);
  scheduleFade();
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
function swapView(el, dir) {
  const view = $('view');
  view.querySelectorAll('.page-old').forEach((p) => p.remove());
  const old = view.firstElementChild;
  if (!dir || !old || reduceMotion.matches) {
    view.replaceChildren(el);
    return;
  }
  old.classList.add('page-old');
  old.style.top = `${-navScrollY}px`;
  view.append(el);
  const dx = dir === 'forward' ? 1 : -1;
  const timing = { duration: 340, easing: 'cubic-bezier(.22,.8,.24,1)' };
  const out = old.animate([
    { transform: 'translateX(0)', opacity: 1 },
    { transform: `translateX(${-dx * 35}%)`, opacity: 0 },
  ], timing);
  el.animate([
    { transform: `translateX(${dx * 100}%)`, opacity: 0.4 },
    { transform: 'translateX(0)', opacity: 1 },
  ], timing);
  out.onfinish = () => old.remove();
}

// ---------- Menú ⋯ ----------
const MENU = [
  { label: 'Documentos', icon: 'documents', run: () => go('documents', screen === 'documents' ? null : 'forward') },
  { label: 'Administrar perfiles', icon: 'users', run: () => openProfilesSheet() },
  { label: 'Opciones de visualización', icon: 'palette', run: () => openDisplaySheet() },
  { label: 'Sincronización en la nube', icon: 'cloud', run: () => openSyncSheet() },
  { label: 'Importar/exportar copia', icon: 'swap', run: () => openBackupSheet() },
  { label: 'Nivel de seguridad', icon: 'shield', run: () => openSecuritySheet() },
  { label: 'Bloquear', icon: 'lock', run: () => lockApp() },
  { label: 'Información', icon: 'info', run: () => openInfoSheet() },
];
function openPopover(anchor, items) {
  const menu = $('menu');
  menu.innerHTML = items.map((m, i) =>
    `<button class="menu-item ${m.danger ? 'danger' : ''}" role="menuitem" data-i="${i}">${icon(m.icon, 20)}<span>${m.label}</span></button>`).join('');
  menu.querySelectorAll('.menu-item').forEach((b) => b.addEventListener('click', () => {
    closeMenu();
    trackLabel(items[b.dataset.i].label);
    items[b.dataset.i].run();
  }));
  const r = anchor.getBoundingClientRect();
  menu.style.top = `${r.bottom + 6}px`;
  menu.style.right = `${Math.max(8, window.innerWidth - r.right)}px`;
  menu.hidden = false;
}
function openMenu() {
  openPopover($('menu-btn'), MENU);
  $('menu-btn').setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  $('menu').hidden = true;
  $('menu-btn').setAttribute('aria-expanded', 'false');
}

// ---------- Pantalla de entrada (logo + desbloqueo) ----------
// Logo de PayCTRL (by OmT Finance): los dos anillos de la familia y, dentro, una nómina de líneas finas.
function logoSVG(size = 132) {
  return `
    <svg class="logo-mark" viewBox="0 0 120 120" width="${size}" height="${size}" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <defs>
        <linearGradient id="omt-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#22d3ee"/><stop offset=".55" stop-color="#34d399"/><stop offset="1" stop-color="#bef264"/>
        </linearGradient>
      </defs>
      <circle class="lg-ring" pathLength="1" cx="60" cy="60" r="52" stroke="url(#omt-g)" stroke-width="1.2" transform="rotate(-90 60 60)"/>
      <circle class="lg-dash" cx="60" cy="60" r="42" stroke="url(#omt-g)" stroke-width=".8" stroke-dasharray="2 5" opacity=".6"/>
      <path class="lg-doc" pathLength="1" d="M44 33 H68 L78 43 V87 H44 Z" stroke="url(#omt-g)" stroke-width="1.6"/>
      <path class="lg-fold" pathLength="1" d="M68 33 V43 H78" stroke="url(#omt-g)" stroke-width="1.6"/>
      <path class="lg-rows" pathLength="1" d="M51 54 H71 M51 62 H71 M51 70 H63" stroke="url(#omt-g)" stroke-width="1.6"/>
      <path class="lg-spark" pathLength="1" d="M44 33 H68 L78 43 V87 H44 Z" stroke="#fff" stroke-width="2.2"/>
      <circle class="lg-dot lg-dot1" cx="51" cy="79" r="2.2" fill="#22d3ee" stroke="none"/>
      <circle class="lg-dot lg-dot2" cx="58" cy="79" r="2.2" fill="#34d399" stroke="none"/>
    </svg>`;
}

// Sin nivel de seguridad, al abrir la app no hay botón: el logo se ve un instante y se pasa sola al
// Resumen con la transición de cristal de las otras apps de OmT (ChatCTRL, TaskCTRL…). Con Face ID o
// código, o tras «Bloquear», se entra con el botón como siempre.
// La transición empieza cuando la animación del logo ha terminado entera: se dibuja (≈2,3 s) y el
// destello recorre la nómina una vez (empieza a los 2,1 s, dura 3,2 s y se apaga a la mitad: 3,7 s).
// Si se cambian los tiempos de .lg-spark en styles.css, hay que cambiarlos aquí también.
const SPARK_DELAY_MS = 2100, SPARK_CYCLE_MS = 3200;
const SPLASH_HOLD_MS = SPARK_DELAY_MS + SPARK_CYCLE_MS * 0.5 + 150;
const SPLASH_OUT_MS = 1200;
let autoEntry = true; // solo al abrir la app
async function autoEnter() {
  autoEntry = false;
  if (screen !== 'lock' || effectiveLevel() !== 'none') return void render();
  // La pantalla de inicio pasa a una capa fija y se disuelve en cristal sobre el Resumen
  const veil = document.createElement('div');
  veil.className = 'splash-veil';
  const lock = $('view').querySelector('.lockscreen');
  if (lock) veil.append(lock.cloneNode(true));
  document.body.append(veil);
  if (!(await unlock())) { veil.remove(); return void render(); }
  go('summary');
  document.body.classList.add('entering');
  setTimeout(() => {
    veil.remove();
    document.body.classList.remove('entering');
    setTimeout(maybeShowInstallHint, 350);
  }, SPLASH_OUT_MS);
}

function renderLock() {
  const el = document.createElement('div');
  const level = effectiveLevel();
  const auto = autoEntry && level === 'none';
  el.className = auto ? 'lockscreen auto' : 'lockscreen';
  const glyph = level === 'none' ? ENTER_GLYPH
    : level === 'pin' ? KEYPAD_GLYPH
    : isIPhone ? FACE_GLYPH : (isAndroid || isIPad || !isWindows) ? FINGER_GLYPH : LOCK_GLYPH;
  const label = level === 'none' ? 'Entrar' : level === 'pin' ? 'Entrar con código' : `Entrar con ${BIO}`;
  el.innerHTML = `
    <div class="ls-top">
      ${logoSVG()}
      <div class="brand-mark"><span class="bm-omt">Pay<b>CTRL</b></span><span class="bm-by">by OmT Finance</span></div>
    </div>
    ${auto ? '' : `
    <div class="ls-bottom">
      <button class="ls-unlock" type="button" aria-label="${esc(label)}">
        <svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph}</svg>
      </button>
      <p class="ls-label">${esc(label)}</p>
    </div>
    `}
    <p class="ls-version">Versión ${APP_VERSION}</p>`;
  const btn = el.querySelector('.ls-unlock');
  btn?.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      if (await unlock()) {
        go('summary');
        setTimeout(maybeShowInstallHint, 350);
      }
    } finally {
      btn.disabled = false;
    }
  });
  return el;
}

// ---------- Aviso: añadir a la pantalla de inicio (solo móvil y tablet) ----------
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let installHintShown = false;
const HINT_ICONS = {
  share: '<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M7 10.5H6a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-1"/>',
  more: '<circle cx="12" cy="5.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18.5" r="1.5" fill="currentColor"/>',
  add: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};
const hintIcon = (name) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${HINT_ICONS[name]}</svg>`;

function maybeShowInstallHint() {
  const isIOS = isIPhone || isIPad;
  if (installHintShown || !(isIOS || isAndroid) || isStandalone()) return;
  if (load(INSTALL_HINT_KEY, null) === 'off') return;
  installHintShown = true;
  const steps = isIOS
    ? [
        ['share', 'Pulsa el botón <b>Compartir</b> de Safari (abajo en el iPhone, arriba en el iPad).'],
        ['add', 'Desliza hacia abajo y elige <b>Añadir a pantalla de inicio</b>.'],
        ['check', 'Pulsa <b>Añadir</b>. El icono de PayCTRL aparecerá junto a tus apps.'],
      ]
    : [
        ['more', 'Pulsa el menú <b>⋮</b> de Chrome, arriba a la derecha.'],
        ['add', 'Elige <b>Añadir a pantalla de inicio</b> o <b>Instalar aplicación</b>.'],
        ['check', 'Confirma con <b>Instalar</b>. El icono de PayCTRL aparecerá junto a tus apps.'],
      ];
  closeSheet();
  const back = document.createElement('div');
  back.className = 'sheet-backdrop blur center';
  back.innerHTML = `
    <div class="sheet install-sheet" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <span class="install-logo">${logoSVG(56)}</span>
      <h2 class="sheet-title" id="install-title">Añade PayCTRL a tu pantalla de inicio</h2>
      <p class="muted small">Así la abrirás como una app más, a pantalla completa y con un solo toque.</p>
      <ol class="install-steps">
        ${steps.map(([ic, text]) => `<li><span class="step-icon">${hintIcon(ic)}</span><span>${text}</span></li>`).join('')}
      </ol>
      <div class="install-footer">
        <label class="no-more"><input type="checkbox" id="install-no-more" /> No mostrar más</label>
        <button class="text-btn done-btn" type="button" id="install-ok">Aceptar</button>
      </div>
    </div>`;
  document.body.append(back);
  back.querySelector('#install-ok').addEventListener('click', () => {
    if (back.querySelector('#install-no-more').checked) save(INSTALL_HINT_KEY, 'off');
    closeSheet();
  });
}

// ---------- Barra de perfiles (abajo; aparece con dos o más personas) ----------
function buildProfileBar() {
  const chips = [
    ...data.profiles.map((p) => ({ id: p.id, name: p.name, color: p.color, label: avatarLabel(p) })),
    { id: TOTAL_ID, name: 'Total', color: null, label: icon('users', 15) },
  ];
  const bar = $('profilebar');
  bar.innerHTML = chips.map((ch) => `
    <button class="pchip ${ch.id === viewId ? 'on' : ''}" type="button" data-view="${ch.id}" aria-pressed="${ch.id === viewId}">
      <span class="pchip-av ${ch.color ? '' : 'total'}" ${ch.color ? `style="background:${ch.color}"` : ''}>${ch.label}</span>
      <span class="pchip-name">${esc(ch.name)}</span>
    </button>`).join('');
  bar.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => switchView(b.dataset.view)));
}

// ---------- Ventanas (sheets) ----------
function newSheet() {
  closeSheet();
  const back = document.createElement('div');
  back.className = 'sheet-backdrop';
  document.body.append(back);
  back.addEventListener('click', (e) => { if (e.target === back) closeSheet(); });
  return back;
}
function closeSheet() {
  document.querySelector('.sheet-backdrop')?.remove();
}
function confirmSheet(title, text, okLabel = 'Eliminar') {
  return new Promise((resolve) => {
    const back = newSheet();
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <h2 class="sheet-title">${esc(title)}</h2>
        <p class="muted small">${text}</p>
        <div class="body-actions">
          <button class="text-btn c-no" type="button">Cancelar</button>
          <button class="text-btn done-btn c-yes" type="button">${esc(okLabel)}</button>
        </div>
      </div>`;
    back.querySelector('.c-no').addEventListener('click', () => { closeSheet(); resolve(false); });
    back.querySelector('.c-yes').addEventListener('click', () => { closeSheet(); resolve(true); });
  });
}

// ---------- Administrar perfiles ----------
function openProfilesSheet() {
  const back = newSheet();
  const draw = () => {
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Administrar perfiles">
        <h2 class="sheet-title">Administrar perfiles</h2>
        <p class="muted small">Una persona por perfil, cada una con sus nóminas. Con dos o más aparece abajo la barra de perfiles y el «Total».</p>
        <div class="list adm-list">${data.profiles.map((p) => `
          <div class="adm-row" data-p="${p.id}">
            <span class="avatar small-avatar" style="background:${p.color}">${avatarLabel(p)}</span>
            <span class="adm-name">${esc(p.name)}<small class="muted">${p.slips.length} ${p.slips.length === 1 ? 'nómina' : 'nóminas'}</small></span>
            <button class="mini-icon" data-act="rename" type="button" aria-label="Cambiar nombre">${icon('pencil', 16)}</button>
            <button class="mini-icon" data-act="delete" type="button" aria-label="Eliminar" ${data.profiles.length < 2 ? 'disabled' : ''}>${icon('trash', 16)}</button>
          </div>`).join('')}
        </div>
        <button class="add-btn adm-add" type="button">${icon('plus', 18)} Añadir persona</button>
        <div class="body-actions"><span></span><button class="text-btn done-btn adm-close" type="button">Listo</button></div>
      </div>`;
    back.querySelectorAll('[data-p]').forEach((row) => {
      const p = profileById(row.dataset.p);
      row.querySelector('[data-act="rename"]').addEventListener('click', () => {
        const name = prompt('Nombre del perfil', p.name)?.trim();
        if (!name) return;
        change(() => { p.name = name; });
        render(); draw();
      });
      row.querySelector('[data-act="delete"]').addEventListener('click', async () => {
        if (!(await confirmSheet('Eliminar perfil', `Se borrarán «${esc(p.name)}» y sus ${p.slips.length} nóminas. Se puede deshacer.`))) return openProfilesSheet();
        change(() => { data.profiles = data.profiles.filter((x) => x !== p); });
        if (!validView(viewId)) viewId = data.profiles[0].id;
        render(); openProfilesSheet();
      });
    });
    back.querySelector('.adm-add').addEventListener('click', () => {
      const name = prompt('Nombre de la persona')?.trim();
      if (!name) return;
      change(() => { data.profiles.push(normData({ profiles: [{ name, color: PROFILE_COLORS[data.profiles.length % PROFILE_COLORS.length] }] }).profiles[0]); });
      render(); draw();
    });
    back.querySelector('.adm-close').addEventListener('click', closeSheet);
  };
  draw();
}

// ---------- Resumen ----------
// Todos los años con datos, del más antiguo (izquierda) al más reciente (derecha). Caben 4 a la
// vista; la barra se desliza para ver los anteriores y se abre colocada en el año elegido.
function yearSelector() {
  const ys = yearsWithData().sort((a, b) => a - b);
  if (!ys.includes(selYear)) selYear = ys.at(-1);
  return `<div class="seg full year-seg ${ys.length > 4 ? 'scrolls' : ''}" role="group" aria-label="Año">${ys.map((y) =>
    `<button type="button" data-year="${y}" class="${y === selYear ? 'on' : ''}">${y}</button>`).join('')}</div>`;
}
let yearSegScroll = null; // posición de la barra, para que no salte al cambiar de año
function bindYearSelector(el) {
  const seg = el.querySelector('.year-seg');
  el.querySelectorAll('[data-year]').forEach((b) => b.addEventListener('click', () => {
    selYear = Number(b.dataset.year);
    yearSegScroll = seg.scrollLeft;
    render();
  }));
  if (!seg?.classList.contains('scrolls')) return;
  requestAnimationFrame(() => {
    const on = seg.querySelector('.on');
    if (yearSegScroll != null) { seg.scrollLeft = yearSegScroll; yearSegScroll = null; }
    else if (on) seg.scrollLeft = on.offsetLeft + on.offsetWidth - seg.clientWidth + 3;
  });
}
function splitBar(t) {
  if (isPrivate() || t.gross <= 0) return '';
  const parts = [['net', 'Neto', t.net], ['irpf', 'IRPF', t.irpf], ['ss', 'Seg. Social', t.ss], ['other', 'Otras', t.other]].filter((p) => p[2] > 0);
  return `
    <section class="composition">
      <p class="label">Reparto del bruto</p>
      <div class="bar">${parts.map(([k, , v]) => `<span style="width:${(v / t.gross) * 100}%;background:${SPLIT_COLORS[k]}"></span>`).join('')}</div>
      <div class="legend">${parts.map(([k, l, v]) => `<span><i style="background:${SPLIT_COLORS[k]}"></i>${l} ${Math.round((v / t.gross) * 100)}%</span>`).join('')}</div>
    </section>`;
}
function renderSummary() {
  const profiles = viewProfiles();
  const slips = slipsOfYear(selYear, profiles);
  const t = aggregate(slips);
  const months = new Set(slips.map((s) => s.month)).size;
  const blockValue = {
    payslips: money(t.net),
    concepts: '',
    renta: (() => {
      const pairs = profiles.flatMap((p) => p.certs.filter((c) => c.year === selYear).map((c) => certCheck(c, p.slips.filter((x) => x.year === selYear), p.slips)));
      if (!pairs.length) return '';
      return pairs.every((x) => x.ok) ? `<span class="pos small-status">${icon('check', 14)} cuadra</span>` : '<span class="neg small-status">no cuadra</span>';
    })(),
    evolution: '',
  };
  const hasAny = allSlips(profiles).length > 0;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="summary-grid"><div class="sum-left">
    <section class="hero">
      <p class="label">Neto percibido ${selYear}</p>
      <div class="net-row">
        <p class="net amount">${money(t.net)}</p>
        ${isTotal() ? '' : `<button class="icon-btn add-slip-btn" type="button" aria-label="Subir nóminas" title="Subir nóminas">${icon('upload', 20)}</button>`}
      </div>
      <p class="muted small">${t.count ? `${t.count} ${t.count === 1 ? 'nómina' : 'nóminas'} · ${months} ${months === 1 ? 'mes' : 'meses'}${months ? ` · media mensual ${money(t.net / months)}` : ''}` : 'Aún no hay nóminas de este año.'}</p>
    </section>
    <section class="summary">
      <div class="pill"><span class="label">Bruto</span><span class="amount pos">${money(t.gross)}</span></div>
      <div class="pill"><span class="label">Retención IRPF</span><span class="amount neg">${money(-t.irpf)}</span></div>
      <div class="pill"><span class="label">Seguridad Social</span><span class="amount neg">${money(-t.ss)}</span></div>
      <div class="pill"><span class="label">Tipo IRPF medio</span><span class="amount">${t.gross ? pctText(t.irpfRate) : '—'}</span></div>
    </section>
    ${yearSelector()}
    ${splitBar(t)}
    ${hasAny ? '' : `
    <section class="group demo-box">
      <div class="list demo-card">
        <p class="muted small">Todavía no has subido ninguna nómina. Pulsa ${icon('upload', 14)} para añadir la primera o mira cómo queda la app con datos de ejemplo.</p>
        <button class="add-btn demo-load" type="button">${icon('sparkle', 18)} Ver con datos de ejemplo</button>
      </div>
    </section>`}
    </div><div class="sum-right">
    <section class="group">
      <h2>Bloques</h2>
      <div class="blocks">${SCREENS.map((b) => `
        <button class="block" type="button" data-go="${b.key}" style="--block-color:${b.color}">
          <span class="cat-icon" style="color:${b.color}">${icon(b.key)}</span>
          <span class="cat-text"><span class="cat-name">${b.label}</span></span>
          <span class="amount">${blockValue[b.key]}</span>
          <span class="chev">${icon('chevron', 16)}</span>
        </button>`).join('')}</div>
      ${allSlips(profiles).some((s) => s.demo) ? `<button class="link-btn-text demo-clear" type="button">Borrar los datos de ejemplo</button>` : ''}
    </section>
    </div></div>`;
  bindYearSelector(el);
  el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go, 'forward')));
  el.querySelector('.add-slip-btn')?.addEventListener('click', () => openSlipSheet());
  el.querySelector('.demo-load')?.addEventListener('click', loadDemo);
  el.querySelector('.demo-clear')?.addEventListener('click', clearDemo);
  return el;
}

// ---------- Nóminas (lista por años plegables) ----------
function renderPayslips() {
  const profiles = viewProfiles();
  const slips = sortSlips(allSlips(profiles));
  const years = new Map();
  slips.forEach((s) => {
    if (!years.has(s.year)) years.set(s.year, []);
    years.get(s.year).push(s);
  });
  const t = aggregate(slipsOfYear(selYear, profiles));
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero">
      <p class="label">Neto ${selYear}</p>
      <p class="net amount">${money(t.net)}</p>
    </section>
    <section class="summary">
      <div class="pill"><span class="label">Bruto ${selYear}</span><span class="amount pos">${money(t.gross)}</span></div>
      <div class="pill"><span class="label">Deducciones</span><span class="amount neg">${money(-(t.irpf + t.ss + t.other))}</span></div>
    </section>
    ${yearSelector()}
    <section class="group">
      <h2>Nóminas <span class="hint">· ${slips.length}</span></h2>
      <ul class="movs amort hist-list" id="slip-list"></ul>
      ${isTotal() ? '<p class="muted small amort-note">Para subir una nómina, elige abajo la persona.</p>' : `<button class="add-btn slip-add" type="button">${icon('upload', 18)} Subir nóminas</button>`}
    </section>`;
  bindYearSelector(el);
  const list = el.querySelector('#slip-list');
  const draw = () => {
    if (!slips.length) {
      list.innerHTML = '<li class="mv-empty muted">Aún no hay nóminas. Pulsa «Subir nómina» para añadir la primera.</li>';
      return;
    }
    list.innerHTML = [...years].map(([y, rows]) => {
      const open = openYears.has(String(y));
      const yt = aggregate(rows);
      return `
      <li class="mv-year ${open ? 'open' : ''}" data-y="${y}">
        <button class="mv-year-head ay-head" type="button" aria-expanded="${open}">
          <span class="mv-type">${y}</span>
          <span class="mv-amt">${money(yt.net)}</span>
          <span class="sh-chev">${icon('down', 16)}</span>
        </button>
        ${open ? `<div class="amort-rows">
          <div class="amort-cols slip-cols"><span>Mes</span><span>Bruto</span><span>IRPF</span><span>Neto</span></div>
          ${rows.map((s) => {
            const st = slipTotals(s);
            return `
            <div class="amort-row slip-cols" data-slip="${s.id}" role="button" tabindex="0">
              <span>${esc(MONTHS_SHORT[s.month - 1])}${s.kind !== 'monthly' ? ` <small class="muted">${s.kind === 'extra' ? 'extra' : 'atrasos'}</small>` : ''}${s.file ? ' <small class="muted">📎</small>' : ''}${isTotal() ? ` <small class="muted">${esc(s.owner.name)}</small>` : ''}</span>
              <span>${numStr2(st.gross)}</span><span>${numStr2(st.irpf)}</span><span>${numStr2(st.net)}</span>
            </div>`;
          }).join('')}
        </div>` : ''}
      </li>`;
    }).join('');
    list.querySelectorAll('.mv-year-head').forEach((b) => b.addEventListener('click', () => {
      const y = b.closest('.mv-year').dataset.y;
      if (openYears.has(y)) openYears.delete(y);
      else openYears.add(y);
      draw();
    }));
    list.querySelectorAll('[data-slip]').forEach((r) => {
      const open = () => go(`slip:${r.dataset.slip}`, 'forward');
      r.addEventListener('click', open);
      r.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
    });
  };
  draw();
  el.querySelector('.slip-add')?.addEventListener('click', () => openSlipSheet());
  return el;
}

// ---------- Catálogo de conceptos ----------
// Nombre claro de cada clave del recibo (por su número, sin la letra de clase). Las que no estén
// aquí se muestran con el texto de la nómina. especie: retribución en especie (no se cobra, pero
// tributa); renta: cómo cuenta en «Datos para la Renta».
const CATALOG = {
  // Abonos
  '0080': { name: 'Salario base' },
  '0100': { name: 'Antigüedad (quinquenios)' },
  '0096': { name: 'Antigüedad de la paga de julio' },
  '2770': { name: 'Ajuste por incremento del seguro de vida' },
  '2193': { name: 'Importe a cuenta' },
  '2142': { name: 'Complemento por resultado' },
  '214D': { name: 'Complemento por resultado (paga de Navidad)' },
  '214J': { name: 'Complemento por resultado (paga de julio)' },
  '0414': { name: 'Gratificación de julio (paga extra)' },
  '0418': { name: 'Gratificación de Navidad (paga extra)' },
  '0098': { name: 'Antigüedad de la paga de Navidad' },
  '5516': { name: 'Horas de conflicto laboral' },
  '5599': { name: 'Horas de conflicto laboral (no cotizan)' },
  '0500': { name: 'Descuento de horas de falta en la paga extra' },
  '3170': { name: 'Reparto de beneficios' },
  '7999': { name: 'Percepciones por caja (cobradas fuera de la nómina)' },
  '5569': { name: 'Días de compensación' },
  '2498': { name: 'Ayuda al transporte' },
  // Descuentos
  '/398': { name: 'Cotización a la Seguridad Social' },
  '/401': { name: 'Retención de IRPF' },
  '2350': { name: 'Aportación al plan de pensiones (tuya)', renta: 'ppEmp' },
  '2907': { name: 'Cuota sindical', renta: 'union' },
  '3760': { name: 'Compra de acciones (ESOP)' },
  '3917': { name: 'Descuento Grupo de Empresa' },
  '/561': { name: 'Crédito (saldo que pasa al mes siguiente)' },
  '3682': { name: 'Devolución de adelanto' },
  '7750': { name: 'Amortización del préstamo de empresa' },
  '/563': { name: 'Pendiente del mes anterior' },
  // Solo base de cotización / en especie
  '/34C': { name: 'Prorrata de pagas extra' },
  '234C': { name: 'Prorrata del reparto de beneficios' },
  '5220': { name: 'Comedor', especie: true, exenta: true }, // exenta (vales de comida, con límite diario)
  '2310': { name: 'Seguro de accidentes y RC', especie: true, exenta: true }, // no es rendimiento en especie (art. 42.2 LIRPF)
  '2772': { name: 'Seguro de vida', especie: true },
  '3310': { name: 'Acciones', especie: true, exenta: true }, // exenta hasta 12.000 €/año
  '3352': { name: 'Aportación de la empresa al plan de pensiones', especie: true, renta: 'ppCo' },
  '3354': { name: 'Reparto lineal' },
  '3992': { name: 'Especie no repercutida', especie: true },
  '777E': { name: 'Seguro médico de empresa', especie: true, exenta: true }, // exento hasta 500 €/año
  '778E': { name: 'Seguro médico (base de Seguridad Social)' },
  '775E': { name: 'Intereses del préstamo de empresa', especie: true },
  // Empresa
  '/399': { name: 'Cotización de la empresa a la Seguridad Social' },
  '/342': { name: 'Ajuste de base: contingencias comunes' },
  '/343': { name: 'Ajuste de base: contingencias profesionales' },
};
const codeNum = (k) => k.code.split(' ').at(-1);
const codeClass = (k) => (k.code.includes(' ') ? k.code.split(' ')[0] : '');
const catalogOf = (k) => CATALOG[codeNum(k)] ?? {};
const conceptLabel = (k) => catalogOf(k).name ?? k.name;
const isEspecie = (k) => k.type === 'info' && !!catalogOf(k).especie;
const originYM = (k) => { const m = k.origin.match(/^(\d{2})\/(\d{4})$/); return m ? `${m[2]}-${m[1]}` : ''; };
const originText = (ym) => `${MONTHS_SHORT[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`;

// Agrupa conceptos por clave (o por nombre, si no tienen): suma importes y guarda los meses de origen.
function groupConcepts(list) {
  const map = new Map();
  list.forEach((k) => {
    const key = `${k.type}|${k.code ? codeNum(k) : k.name}`;
    if (!map.has(key)) map.set(key, { key, label: conceptLabel(k), cls: codeClass(k), type: k.type, cat: k.cat, k, amount: 0, origins: [], qty: k.qty });
    const g = map.get(key);
    g.amount = round2(g.amount + k.amount);
    if (originYM(k)) g.origins.push(originYM(k));
  });
  return [...map.values()].filter((g) => Math.abs(g.amount) >= 0.005);
}
// Texto bajo el concepto: meses de origen cuando no son el de la nómina (atrasos, regularizaciones).
function originsNote(g, s) {
  const own = s ? `${s.year}-${String(s.month).padStart(2, '0')}` : null;
  const os = [...new Set(g.origins)].sort();
  const others = os.filter((o) => o !== own);
  if (!others.length) return '';
  if (os.length === 1) return `De ${originText(os[0])}`;
  return `${os.length} meses · ${originText(os[0])} – ${originText(os.at(-1))}`;
}
function conceptRows(groups, s, { neg = false, pct = false } = {}) {
  if (!groups.length) return '<p class="empty muted small">Nada este mes.</p>';
  return groups.map((g) => {
    const note = [originsNote(g, s), pct && g.cat === 'irpf' && g.qty != null && s ? `${numPct(g.qty)} de retención` : ''].filter(Boolean).join(' · ');
    return `
    <div class="cat-row">
      <span class="cat-name">${esc(g.label)}${note ? `<small class="muted">${esc(note)}</small>` : ''}</span>
      <span class="amount ${(neg ? -g.amount : g.amount) < 0 ? 'neg' : neg && g.amount ? 'pos' : ''}">${money(neg ? -g.amount : g.amount)}</span>
    </div>`;
  }).join('');
}
const numPct = (n) => `${n.toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
// Devengos agrupados por su clase del recibo (A1 personales, A3 cantidad o calidad…).
function devSections(groups, s) {
  const classes = [...new Set(groups.map((g) => g.cls))];
  if (classes.length <= 1 || classes.every((c) => !CLASS_LABELS[c])) return `<div class="list ts-list">${conceptRows(groups, s)}</div>`;
  return classes.map((c) => `
    <p class="sub-label">${esc(CLASS_LABELS[c] ?? 'Otros')}</p>
    <div class="list ts-list">${conceptRows(groups.filter((g) => g.cls === c), s)}</div>`).join('');
}
// Bloque plegable (en especie, aportaciones de la empresa…)
const openFolds = new Set();
function foldGroup(key, title, total, inner) {
  const open = openFolds.has(key);
  return `
    <section class="group fold ${open ? 'open' : ''}" data-fold="${key}">
      <h2><button class="fold-head" type="button" aria-expanded="${open}"><span class="fold-title">${title}</span><span class="fold-amt">${total}</span><span class="sh-chev">${icon('down', 16)}</span></button></h2>
      <div class="fold-body" ${open ? '' : 'hidden'}>${inner}</div>
    </section>`;
}
function bindFolds(el) {
  el.querySelectorAll('[data-fold]').forEach((sec) => sec.querySelector('.fold-head').addEventListener('click', () => {
    const k = sec.dataset.fold;
    if (openFolds.has(k)) openFolds.delete(k);
    else openFolds.add(k);
    const open = openFolds.has(k);
    sec.classList.toggle('open', open);
    sec.querySelector('.fold-head').setAttribute('aria-expanded', String(open));
    sec.querySelector('.fold-body').hidden = !open;
  }));
}

// ---------- Detalle de una nómina ----------
function renderSlip(s, p) {
  const st = slipTotals(s);
  const has = s.concepts.length > 0;
  const of = (type) => groupConcepts(s.concepts.filter((k) => k.type === type));
  const dev = of('dev');
  const ded = of('ded');
  const info = of('info');
  const emp = of('emp');
  const especie = info.filter((g) => isEspecie(g.k));
  const baseOnly = info.filter((g) => !isEspecie(g.k));
  const check = s.liquid != null && (has || s.generic)
    ? Math.abs(st.net - s.liquid) < 0.01
      ? `<p class="muted small ok-line">${icon('check', 14)} Coincide con el líquido de la nómina</p>`
      : `<p class="small warn-line">El cálculo (${money(st.net)}) no coincide con el líquido impreso (${money(s.liquid)}).</p>`
    : '';
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero">
      <p class="label">${esc(slipTitle(s))}${s.kind !== 'monthly' ? ` · ${KINDS[s.kind]}` : ''}${data.profiles.length > 1 ? ` · ${esc(p.name)}` : ''}</p>
      <div class="net-row">
        <p class="net amount">${money(st.net)}</p>
        <button class="icon-btn slip-edit" type="button" aria-label="Editar nómina" title="Editar nómina">${icon('pencil', 20)}</button>
      </div>
      <p class="muted small">Líquido a percibir${s.company ? ` · ${esc(s.company)}` : ''}</p>
      ${check}
    </section>
    <section class="summary">
      <div class="pill"><span class="label">Bruto</span><span class="amount pos">${money(st.gross)}</span></div>
      <div class="pill"><span class="label">IRPF${s.irpfPct != null ? ` · ${isPrivate() ? MASK : numPct(s.irpfPct)}` : st.gross ? ` · ${pctText(st.irpf / st.gross)}` : ''}</span><span class="amount neg">${money(-st.irpf)}</span></div>
      <div class="pill"><span class="label">Seguridad Social</span><span class="amount neg">${money(-st.ss)}</span></div>
      <div class="pill"><span class="label">Otros descuentos</span><span class="amount ${st.other ? 'neg' : ''}">${money(-st.other)}</span></div>
    </section>
    ${splitBar(st)}
    ${has ? `
    <section class="group"><h2>Devengos <span class="hint">· ${money(st.gross)}</span></h2>${devSections(dev, s)}</section>
    <section class="group"><h2>Descuentos <span class="hint">· ${money(-(st.irpf + st.ss + st.other))}</span></h2>
      <div class="list ts-list">${conceptRows(ded, s, { neg: true, pct: true })}</div></section>
    ${especie.length ? foldGroup('slip-especie', 'Retribución en especie', money(sumBy(especie, (g) => g.amount)),
      `<p class="muted small fold-note">No se cobra, pero suma a tu base de IRPF.</p><div class="list ts-list">${conceptRows(especie, s)}</div>`) : ''}
    ${baseOnly.length ? foldGroup('slip-base', 'Solo base de cotización', money(sumBy(baseOnly, (g) => g.amount)),
      `<p class="muted small fold-note">Prorratas y otros importes que solo cuentan para la Seguridad Social.</p><div class="list ts-list">${conceptRows(baseOnly, s)}</div>`) : ''}
    ${emp.length ? foldGroup('slip-emp', 'Aportación de la empresa', money(sumBy(emp, (g) => g.amount)),
      `<div class="list ts-list">${conceptRows(emp, s)}</div>`) : ''}` : `
    <section class="group"><h2>Conceptos</h2><div class="list ts-list"><p class="empty muted small">${s.generic
      ? 'Leída por sus totales con el lector general (formato de nómina no reconocido): sin detalle por conceptos.'
      : 'Sin desglose: sube el PDF de la nómina y se leerán sus conceptos.'}</p></div></section>`}
    <section class="group">
      <h2>Documento</h2>
      ${s.file ? `
      <button class="block" type="button" data-file style="--block-color:#a3e635">
        <span class="cat-icon" style="color:#a3e635">${icon('documents')}</span>
        <span class="cat-text"><span class="cat-name">${esc(s.file.name)}</span><span class="muted small">${sizeText(s.file.size)}</span></span>
        <span class="chev">${icon('chevron', 16)}</span>
      </button>` : '<p class="empty muted small">No hay archivo adjunto. Pulsa el lápiz para añadir el PDF.</p>'}
    </section>
    <button class="link-btn-text danger slip-del" type="button">Eliminar esta nómina</button>`;
  bindFolds(el);
  el.querySelector('.slip-edit').addEventListener('click', () => openSlipSheet(s, p));
  el.querySelector('[data-file]')?.addEventListener('click', () => openFile(s.file, slipTitle(s)));
  el.querySelector('.slip-del').addEventListener('click', async () => {
    if (!(await confirmSheet('Eliminar nómina', `Se borrará la nómina de ${esc(slipTitle(s))}. Se puede deshacer.`))) return;
    change(() => { p.slips = p.slips.filter((x) => x.id !== s.id); });
    go('payslips', 'back');
  });
  return el;
}

// ---------- Subir nóminas ----------
// Los PDF se leen solos (mes, tipo, empresa y todos los conceptos). Se pueden elegir varios a la vez.
// Si un archivo no se puede leer (una foto, otro formato), se abre el formulario para meterla a mano.
async function importFiles(fileList, owner) {
  const list = [...fileList];
  const done = [], skipped = [], review = [], certsDone = [], declsDone = [];
  showToast(`Leyendo ${list.length === 1 ? 'el archivo' : `${list.length} archivos`}…`);
  const parsed = [];
  for (const f of list) {
    let r = null;
    if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) {
      // ¿Declaración de la Renta (Modelo 100)? Se guarda en su ejercicio (sustituye a la que hubiera).
      try {
        const d = await readDeclPdf(f);
        if (d?.year) {
          const id = uid();
          await files.put(id, f);
          change(() => {
            owner.decls = owner.decls.filter((x) => x.year !== d.year);
            owner.decls.push(normDecl({ ...d, file: { id, name: f.name, type: f.type || 'application/pdf', size: f.size } }));
          });
          declsDone.push(d.year);
          continue;
        }
      } catch (e) { console.warn(e); }
      // ¿Certificado de retenciones? Se guarda en su año (sustituye al que hubiera).
      try {
        const c = await readCertPdf(f);
        if (c?.year) {
          const id = uid();
          await files.put(id, f);
          change(() => {
            owner.certs = owner.certs.filter((x) => x.year !== c.year);
            owner.certs.push(normCert({ ...c, file: { id, name: f.name, type: f.type || 'application/pdf', size: f.size } }));
          });
          certsDone.push(c.year);
          continue;
        }
      } catch (e) { console.warn(e); }
      try { r = await readPayslipPdf(f); } catch (e) { console.warn(e); }
      // Recibo en tabla por columnas (A3, Sage…): si cuadra con sus totales se guarda; si no, se revisa
      if (!r || !r.year || !r.month) {
        let tb = null;
        try { tb = await readTablePayslipPdf(f); } catch (e) { console.warn(e); }
        if (tb?.check && tb.year && tb.month) r = tb;
        // (sin los conceptos, para poder corregir los importes en la ventana)
        else if (tb) { review.push({ file: f, prefill: { ...tb, concepts: [], generic: true } }); continue; }
      }
      // Formato desconocido: lector general de totales, que se revisa antes de guardar
      if (!r || !r.year || !r.month) {
        let g = null;
        try { g = await readGenericPayslipPdf(f); } catch (e) { console.warn(e); }
        if (g) { review.push({ file: f, prefill: g }); continue; }
      }
    }
    if (!r || !r.year || !r.month) { review.push({ file: f, prefill: null }); continue; }
    parsed.push({ f, r });
  }
  if (parsed.length) {
    const fileIds = [];
    for (const { f } of parsed) {
      const id = uid();
      await files.put(id, f);
      fileIds.push(id);
    }
    change(() => {
      owner.slips = owner.slips.filter((x) => !x.demo); // los datos de ejemplo se quitan al subir las reales
      parsed.forEach(({ f, r }, i) => {
        // Si ya está con su desglose, no se duplica; si se metió a mano, la del PDF la sustituye.
        const dup = owner.slips.find((x) => x.year === r.year && x.month === r.month && x.kind === r.kind);
        if (dup?.concepts.length) { skipped.push(`${slipTitle(dup)}${dup.kind !== 'monthly' ? ` (${KINDS[dup.kind].toLowerCase()})` : ''}`); return; }
        const s = normSlip({ ...r, file: { id: fileIds[i], name: f.name, type: f.type || 'application/pdf', size: f.size } });
        if (dup) owner.slips = owner.slips.filter((x) => x !== dup);
        owner.slips.push(s);
        done.push(s);
      });
    });
  }
  if (done.length) {
    selYear = done[0].year;
    done.forEach((s) => openYears.add(String(s.year)));
  }
  const msg = [
    done.length ? `${done.length === 1 ? 'Nómina guardada' : `${done.length} nóminas guardadas`}` : '',
    certsDone.length ? `certificado ${certsDone.join(', ')} guardado` : '',
    declsDone.length ? `declaración ${declsDone.join(', ')} guardada` : '',
    skipped.length ? `ya estaban: ${skipped.join(', ')}` : '',
  ].filter(Boolean).join(' · ');
  if (msg) showToast(msg, { warn: !done.length });
  if ((certsDone.length || declsDone.length) && !done.length) {
    selYear = declsDone[0] ?? certsDone[0];
    go('renta', screen === 'renta' ? null : 'forward');
  } else if (done.length === 1 && !review.length) go(`slip:${done[0].id}`, 'forward');
  else if (done.length) go('payslips', screen === 'payslips' ? null : 'forward');
  // Las que no tienen formato conocido (o no se pudieron leer) se revisan de una en una.
  for (const [i, item] of review.entries()) {
    await new Promise((resolve) => openSlipSheet(null, owner, item.file, item.prefill, resolve, review.length > 1 ? `${i + 1} de ${review.length}` : ''));
  }
}

// Ventana para subir (elegir PDF) o editar a mano una nómina.
// prefill: datos del lector general para revisarlos; onClose: al guardar o cancelar (cola de revisión).
function openSlipSheet(existing = null, owner = currentProfile(), pendingFile = null, prefill = null, onClose = null, counter = '') {
  if (!owner) return onClose?.();
  const now = new Date();
  const s = existing ? { ...existing } : normSlip({ year: now.getFullYear(), month: now.getMonth() + 1, ...(prefill || {}),
    ...(prefill && !prefill.year ? { year: now.getFullYear() } : {}), ...(prefill && !prefill.month ? { month: now.getMonth() + 1 } : {}) });
  let pickedFile = pendingFile;
  let closed = false;
  const finish = () => { if (closed) return; closed = true; onClose?.(); };
  const back = newSheet();
  back.addEventListener('click', (e) => { if (e.target === back) finish(); });
  back.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${existing ? 'Editar nómina' : 'Subir nóminas'}">
      <h2 class="sheet-title">${existing ? 'Editar nómina' : prefill ? 'Revisa la nómina' : pendingFile ? 'Nómina a mano' : 'Subir nóminas'}${counter ? ` <small class="muted">· ${counter}</small>` : ''}</h2>
      ${existing || pendingFile ? '' : `
      <label class="add-btn file-pick main-pick">${icon('upload', 18)} <span>Elegir PDF de nóminas o certificados</span>
        <input type="file" class="multi-pick" accept="application/pdf,image/*" multiple hidden>
      </label>
      <p class="muted small">Puedes elegir varios a la vez: se leen solos (mes, paga extra, empresa y todos los conceptos). El certificado de retenciones y la declaración de la Renta también se reconocen y van a su año. Si alguno no se puede leer, podrás meterlo a mano.</p>
      <p class="opt-label">O a mano</p>`}
      ${pendingFile && prefill ? `<p class="muted small">${prefill.table
        ? `«${esc(pendingFile.name)}» se ha leído por columnas, pero sus conceptos no cuadran del todo con los totales impresos. Revisa el mes y los importes antes de guardar.`
        : `«${esc(pendingFile.name)}» no tiene un formato conocido: se han leído sus totales con el lector general. Revisa el mes y los importes antes de guardar.`}</p>
      ${prefill.check
        ? `<p class="small ok-line">${icon('check', 14)} Bruto − descuentos = líquido impreso (${money(prefill.liquid)})</p>`
        : `<p class="small warn-line">No se ha podido comprobar con el líquido impreso (${money(prefill.liquid)}): revísalo con el PDF.</p>`}
      ${!prefill.year || !prefill.month ? '<p class="small warn-line">No se ha encontrado el mes de la nómina: elígelo.</p>' : ''}` : ''}
      ${pendingFile && !prefill ? `<p class="muted small">No se ha podido leer «${esc(pendingFile.name)}»${/^image\//.test(pendingFile.type) ? ' (es una foto: la app no lee imágenes)' : ''}. Rellena los importes y se guardará con el archivo.</p>` : ''}
      ${existing ? `
      <label class="add-btn file-pick">${icon('upload', 18)} <span class="fp-name">${s.file ? esc(s.file.name) : 'Adjuntar PDF o foto'}</span>
        <input type="file" class="one-pick" accept="application/pdf,image/*" hidden>
      </label>` : ''}
      <div class="mrow-fields">
        <label class="field"><span>Mes</span><select class="f-month">${MONTHS.map((m, i) => `<option value="${i + 1}" ${s.month === i + 1 ? 'selected' : ''}>${m[0].toUpperCase() + m.slice(1)}</option>`).join('')}</select></label>
        <label class="field"><span>Año</span><input class="f-year" inputmode="numeric" maxlength="4" value="${s.year}"></label>
      </div>
      <div class="seg full f-kind" role="group" aria-label="Tipo">${Object.entries(KINDS).map(([k, l]) =>
        `<button type="button" data-kind="${k}" class="${s.kind === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <label class="field"><span>Empresa</span><input class="f-company" value="${esc(s.company)}" placeholder="Opcional"></label>
      ${s.concepts.length ? '<p class="muted small">Esta nómina tiene sus conceptos leídos del PDF: los importes salen de ellos.</p>' : `
      <div class="mrow-fields">
        <label class="field"><span>Bruto (devengos)</span><input class="f-gross" inputmode="decimal" value="${formatInput(s.gross)}"></label>
        <label class="field"><span>Retención IRPF</span><input class="f-irpf" inputmode="decimal" value="${formatInput(s.irpf)}"></label>
        <label class="field"><span>Seguridad Social</span><input class="f-ss" inputmode="decimal" value="${formatInput(s.ss)}"></label>
        <label class="field"><span>Otros descuentos</span><input class="f-other" inputmode="decimal" value="${formatInput(s.other)}"></label>
      </div>
      <label class="field"><span>Líquido a percibir</span><input class="f-net" readonly></label>`}
      <p class="error f-err" role="alert"></p>
      <div class="body-actions">
        <button class="text-btn f-cancel" type="button">Cancelar</button>
        <button class="text-btn done-btn f-save" type="button">Guardar</button>
      </div>
    </div>`;
  const q = (sel) => back.querySelector(sel);
  const val = (sel) => (q(sel) ? parseAmount(q(sel).value) : 0);
  const updateNet = () => { if (q('.f-net')) q('.f-net').value = formatInput(round2(val('.f-gross') - val('.f-irpf') - val('.f-ss') - val('.f-other'))) || '0,00'; };
  back.querySelectorAll('.f-gross, .f-irpf, .f-ss, .f-other').forEach((i) => i.addEventListener('input', updateNet));
  updateNet();
  back.querySelectorAll('[data-kind]').forEach((b) => b.addEventListener('click', () => {
    s.kind = b.dataset.kind;
    back.querySelectorAll('[data-kind]').forEach((x) => x.classList.toggle('on', x === b));
  }));
  q('.multi-pick')?.addEventListener('change', (e) => {
    const fl = e.target.files;
    if (!fl.length) return;
    closeSheet();
    importFiles(fl, owner);
  });
  q('.one-pick')?.addEventListener('change', (e) => {
    pickedFile = e.target.files[0] || null;
    if (pickedFile) q('.fp-name').textContent = pickedFile.name;
  });
  q('.f-cancel').addEventListener('click', () => { closeSheet(); finish(); });
  q('.f-save').addEventListener('click', async () => {
    const year = Number(q('.f-year').value);
    if (!(year >= 1990 && year <= 2100)) return void (q('.f-err').textContent = 'Revisa el año.');
    s.year = year;
    s.month = Number(q('.f-month').value);
    s.company = q('.f-company').value.trim();
    if (!s.concepts.length) {
      s.gross = val('.f-gross'); s.irpf = val('.f-irpf'); s.ss = val('.f-ss'); s.other = val('.f-other');
      if (!s.generic) s.liquid = null;
    }
    if (pickedFile) {
      const id = uid();
      try {
        await files.put(id, pickedFile);
      } catch {
        return void (q('.f-err').textContent = 'No se pudo guardar el archivo en este dispositivo.');
      }
      s.file = { id, name: pickedFile.name, type: pickedFile.type, size: pickedFile.size };
    }
    s.demo = false;
    change(() => {
      const ns = normSlip(s);
      if (existing) owner.slips = owner.slips.map((x) => (x.id === ns.id ? ns : x));
      else owner.slips.push(ns);
    });
    selYear = s.year;
    openYears.add(String(s.year));
    closeSheet();
    showToast(existing ? 'Nómina actualizada' : `Nómina de ${slipTitle(s).toLowerCase()} guardada`);
    if (!existing) go(`slip:${s.id}`, 'forward');
    else render();
    finish();
  });
}

// ---------- Visor del documento ----------
let viewerUrl = null;
// ref: { id, name, type } del archivo; title: lo que se ve arriba del visor.
async function openFile(ref, title) {
  let blob = null;
  try { blob = await files.get(ref.id); } catch {}
  if (!blob) return showToast('El archivo no está en este dispositivo.', { warn: true });
  closeViewer();
  viewerUrl = URL.createObjectURL(blob);
  const isImg = (ref.type || blob.type).startsWith('image/');
  const v = document.createElement('div');
  v.className = 'sheet-backdrop doc-viewer';
  v.innerHTML = `
    <div class="sheet doc-sheet" role="dialog" aria-modal="true" aria-label="${esc(ref.name)}">
      <div class="doc-head">
        <h2 class="sheet-title">${esc(title)}</h2>
        <button class="icon-btn doc-close" type="button" aria-label="Cerrar">${icon('plus', 20).replace('M12 5v14M5 12h14', 'M6 6l12 12M18 6L6 18')}</button>
      </div>
      <div class="doc-body">${isImg ? `<img src="${viewerUrl}" alt="${esc(ref.name)}">` : `<iframe src="${viewerUrl}" title="${esc(ref.name)}"></iframe>`}</div>
      <div class="body-actions">
        <a class="text-btn" href="${viewerUrl}" download="${esc(ref.name)}">Descargar</a>
        <a class="text-btn done-btn" href="${viewerUrl}" target="_blank" rel="noopener">Abrir</a>
      </div>
    </div>`;
  v.addEventListener('click', (e) => { if (e.target === v) closeViewer(); });
  v.querySelector('.doc-close').addEventListener('click', closeViewer);
  document.body.append(v);
}
function closeViewer() {
  document.querySelector('.doc-viewer')?.remove();
  if (viewerUrl) URL.revokeObjectURL(viewerUrl);
  viewerUrl = null;
}

// ---------- Conceptos (acumulado del año) ----------
// Cada concepto sumado en todas las nóminas del año, con las mismas secciones que una nómina.
// Las nóminas metidas a mano (sin desglose) aportan sus importes generales.
function yearConcepts(slips) {
  const all = [];
  slips.forEach((s) => {
    if (s.concepts.length) return all.push(...s.concepts);
    const add = (type, cat, name, amount) => { if (amount) all.push(normConcept({ type, cat, name, amount })); };
    add('dev', 'other', 'Bruto (nóminas sin desglose)', s.gross);
    add('ded', 'irpf', 'Retención de IRPF', s.irpf);
    add('ded', 'ss', 'Cotización a la Seguridad Social', s.ss);
    add('ded', 'other', 'Otros descuentos', s.other);
  });
  // Nóminas a mano y leídas suman juntas en IRPF y Seguridad Social
  return all.map((k) => (k.code || k.type !== 'ded' || k.cat === 'other' ? k : { ...k, code: k.cat === 'irpf' ? 'C /401' : 'C /398' }));
}
function renderConcepts() {
  const slips = slipsOfYear(selYear, viewProfiles());
  const t = aggregate(slips);
  const ks = yearConcepts(slips);
  const of = (type) => groupConcepts(ks.filter((k) => k.type === type)).sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  const dev = of('dev');
  const info = of('info');
  const emp = of('emp');
  const especie = info.filter((g) => isEspecie(g.k));
  const baseOnly = info.filter((g) => !isEspecie(g.k));
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero">
      <p class="label">Devengos ${selYear}</p>
      <p class="net amount">${money(t.gross)}</p>
      <p class="muted small">Cada concepto sumado en las ${t.count} nóminas del año.</p>
    </section>
    ${yearSelector()}
    <section class="group"><h2>Devengos</h2>${devSections(dev, null)}</section>
    <section class="group"><h2>Descuentos <span class="hint">· ${money(-(t.irpf + t.ss + t.other))}</span></h2>
      <div class="list ts-list">${conceptRows(of('ded'), null, { neg: true })}</div></section>
    ${especie.length ? foldGroup('y-especie', 'Retribución en especie', money(sumBy(especie, (g) => g.amount)), `<div class="list ts-list">${conceptRows(especie, null)}</div>`) : ''}
    ${baseOnly.length ? foldGroup('y-base', 'Solo base de cotización', money(sumBy(baseOnly, (g) => g.amount)), `<div class="list ts-list">${conceptRows(baseOnly, null)}</div>`) : ''}
    ${emp.length ? foldGroup('y-emp', 'Aportación de la empresa', money(sumBy(emp, (g) => g.amount)), `<div class="list ts-list">${conceptRows(emp, null)}</div>`) : ''}`;
  bindYearSelector(el);
  bindFolds(el);
  return el;
}

// ---------- Datos para la Renta ----------
// Sumas del año que pide la declaración, sacadas de los conceptos de las nóminas.
// Es una referencia: lo oficial es el certificado de retenciones que da la empresa.
// Percepciones por caja (7999): se cobran fuera de la nómina, que solo las anota (a veces en la del
// mes siguiente). Hacienda las cuenta en el año en que se cobraron (su mes de origen) y les aplica
// retención, que se estima con el % de la nómina donde aparecen. pool: todas las nóminas de la persona.
function cajaOf(year, pool) {
  let amount = 0, ret = 0;
  pool.filter((s) => s.year === year || s.year === year + 1).forEach((s) => s.concepts.forEach((k) => {
    if (k.code.split(' ').at(-1) !== '7999' || Number(originYM(k).slice(0, 4)) !== year) return;
    amount += k.amount;
    ret += (k.amount * (s.irpfPct ?? 0)) / 100;
  }));
  return { amount: round2(amount), ret: round2(ret) };
}
function rentaData(slips, pool = slips, year = slips[0]?.year) {
  const ks = yearConcepts(slips);
  const by = (fn) => sumBy(ks.filter(fn), (k) => k.amount);
  const t = aggregate(slips);
  const caja = cajaOf(year, pool);
  const prevYears = ks.filter((k) => k.type === 'dev' && originYM(k) && Number(originYM(k).slice(0, 4)) < year);
  return {
    gross: t.gross,
    especie: by((k) => isEspecie(k) && catalogOf(k).renta !== 'ppCo'),
    ppCo: by((k) => catalogOf(k).renta === 'ppCo'),
    irpf: t.irpf,
    ss: t.ss,
    union: by((k) => catalogOf(k).renta === 'union'),
    ppEmp: by((k) => catalogOf(k).renta === 'ppEmp'),
    arrears: groupConcepts(prevYears.map((k) => ({ ...k, type: 'dev' }))),
    arrearsTotal: sumBy(prevYears, (k) => k.amount),
    caja: caja.amount,
    cajaRet: caja.ret,
  };
}
// Certificado del año frente a las nóminas de esa persona: casilla a casilla, con la diferencia.
function certSection(p, cert) {
  const slips = p.slips.filter((s) => s.year === cert.year);
  const chk = certCheck(cert, slips, p.slips);
  const who = data.profiles.length > 1 ? ` · ${esc(p.name)}` : '';
  const status = !chk.count
    ? `<p class="small warn-line">No hay nóminas de ${cert.year}: súbelas para comprobar el certificado.</p>`
    : chk.ok
      ? `<p class="small ok-line">${icon('check', 14)} Cuadra con tus ${chk.count} nóminas de ${cert.year}</p>`
      : `<p class="small warn-line">No cuadra con tus ${chk.count} nóminas: revisa las diferencias${slips.length < 12 ? ` (¿falta alguna nómina? hay ${new Set(slips.filter((s) => s.kind === 'monthly').map((s) => s.month)).size} de 12 meses)` : ''}.</p>`;
  const cell = (v) => `<span>${numStr2(v)}</span>`;
  return `
    <section class="group cert-group">
      <h2>Certificado de retenciones ${cert.year}${who}</h2>
      <div class="list cert-card">
        <div class="cert-head">
          <span class="cert-co">${esc(cert.company || 'Empresa')}</span>
          ${status}
        </div>
        ${chk.count ? `
        <div class="amort-cols cert-cols"><span>Concepto</span><span>Nóminas</span><span>Certificado</span><span>Dif.</span></div>
        ${chk.rows.map((x) => `
        <div class="amort-row cert-cols ${x.strict ? '' : 'soft'}">
          <span class="cc-label">${esc(x.label)}${x.note ? `<small class="muted">${esc(x.note)}</small>` : ''}</span>
          ${cell(x.slips)}${cell(x.cert)}
          <span class="${x.ok ? 'pos' : x.strict ? 'neg' : 'muted'}">${x.ok ? icon('check', 13) : (x.diff > 0 ? '+' : '') + numStr2(x.diff)}</span>
        </div>`).join('')}` : ''}
        <div class="cert-extra">
          ${[['Retribuciones en especie (valoración)', cert.especie], ['Ingresos a cuenta efectuados', cert.iac], ['Ingresos a cuenta repercutidos', cert.iacRep],
            ['Rentas exentas', cert.exentas], ['Dietas exceptuadas de gravamen', cert.dietas]].filter(([, v]) => v).map(([l, v]) =>
            `<div class="cat-row"><span class="cat-name">${l}</span><span class="amount">${money(v)}</span></div>`).join('')}
          ${cert.arrears.map((a) => `<div class="cat-row"><span class="cat-name">Atrasos de ${a.year}<small class="muted">Retención ${money(a.ret)}</small></span><span class="amount">${money(a.gross)}</span></div>`).join('')}
        </div>
        <div class="cert-actions">
          ${cert.file ? `<button class="link-btn-text" type="button" data-cert-open="${cert.id}">${icon('documents', 16)} Ver certificado</button>` : '<span></span>'}
          <button class="link-btn-text danger" type="button" data-cert-del="${cert.id}">Eliminar</button>
        </div>
      </div>
    </section>`;
}

// Simulador: solo en los años sin la declaración presentada (siempre el año en curso).
function simCard() {
  if (isTotal()) return '';
  const p = currentProfile();
  if (p.decls.some((d) => d.year === selYear && !d.draft)) return '';
  const S = simInputs(p, selYear);
  const r = calcRenta(S.x).result;
  const what = [S.slips.length ? 'tus nóminas' : '', S.fc.total ? 'la previsión hasta diciembre' : '', S.fin ? 'UnderCTRL' : ''].filter(Boolean);
  return `
    <section class="group">
      <button class="block sim-go" type="button" style="--block-color:#22d3ee">
        <span class="cat-icon" style="color:#22d3ee">${icon('sim')}</span>
        <span class="cat-text"><span class="cat-name">Simular la Renta ${selYear}</span><span class="muted small">${what.length ? `Con ${what.join(', ').replace(/, ([^,]*)$/, ' y $1')}` : 'Aún sin datos de este año'}</span></span>
        <span class="amount ${r < 0 ? 'pos' : 'neg'}">${money(Math.abs(r))}</span>
        <span class="chev">${icon('chevron', 16)}</span>
      </button>
      <p class="muted small amort-note">${r < 0 ? 'A devolver' : 'A ingresar'}, según la simulación. Cuando subas la declaración presentada se verá ella en su lugar.</p>
    </section>`;
}

function renderRenta() {
  const slips = slipsOfYear(selYear, viewProfiles());
  const r = rentaData(slips, allSlips(viewProfiles()), selYear);
  const row = (label, v, note = '', neg = false) => `
    <div class="cat-row"><span class="cat-name">${label}${note ? `<small class="muted">${note}</small>` : ''}</span><span class="amount ${neg && v ? 'neg' : ''}">${money(neg ? -v : v)}</span></div>`;
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero">
      <p class="label">Rendimientos del trabajo ${selYear}</p>
      <p class="net amount">${money(r.gross + r.caja + r.especie + r.ppCo)}</p>
      <p class="muted small">Dinerarios + en especie + aportación de la empresa al plan, según tus nóminas.</p>
    </section>
    <section class="summary">
      <div class="pill"><span class="label">Retenciones IRPF</span><span class="amount neg">${money(-r.irpf)}</span></div>
      <div class="pill"><span class="label">Seguridad Social</span><span class="amount neg">${money(-r.ss)}</span></div>
    </section>
    ${yearSelector()}
    ${simCard()}
    ${viewProfiles().flatMap((p) => p.decls.filter((d) => d.year === selYear).map((d) => declSection(p, d))).join('')}
    ${viewProfiles().flatMap((p) => p.certs.filter((c) => c.year === selYear).map((c) => certSection(p, c))).join('')}
    ${isTotal() || currentProfile().certs.some((c) => c.year === selYear) ? '' : `
    <section class="group"><button class="add-btn cert-add" type="button">${icon('upload', 18)} Subir certificado de retenciones ${selYear}</button>
      <p class="muted small amort-note">El que da la empresa para la Renta. Se comprobará si cuadra con la suma de tus nóminas de ${selYear}.</p></section>`}
    ${isTotal() || currentProfile().decls.some((d) => d.year === selYear) ? '' : `
    <section class="group"><button class="add-btn cert-add" type="button">${icon('upload', 18)} Subir declaración de la Renta ${selYear}</button>
      <p class="muted small amort-note">El PDF de la declaración presentada (Modelo 100). Verás su resumen y si cuadra con el certificado y las nóminas.</p></section>`}
    <section class="group"><h2>Ingresos</h2><div class="list ts-list">
      ${row('Retribuciones dinerarias', r.gross, 'Todos los abonos de las nóminas')}
      ${r.caja ? row('Percepciones por caja', r.caja, `Cobradas fuera de la nómina en ${selYear}; retención estimada ${numStr2(r.cajaRet)} €`) : ''}
      ${row('Retribuciones en especie', r.especie, 'Comedor, seguros, acciones…')}
      ${row('Aportación de la empresa al plan de pensiones', r.ppCo, 'Se imputa como retribución en especie')}
    </div></section>
    <section class="group"><h2>Retenciones y gastos</h2><div class="list ts-list">
      ${row('Retenciones de IRPF', r.irpf, '', true)}
      ${row('Cotizaciones a la Seguridad Social', r.ss, 'Gasto deducible', true)}
      ${row('Cuotas sindicales', r.union, 'Gasto deducible', true)}
    </div></section>
    <section class="group"><h2>Plan de pensiones</h2><div class="list ts-list">
      ${row('Aportaciones tuyas', r.ppEmp, 'Reducen la base imponible')}
      ${row('Aportaciones de la empresa', r.ppCo)}
    </div></section>
    ${r.arrears.length ? `
    <section class="group"><h2>Atrasos de años anteriores <span class="hint">· ${money(r.arrearsTotal)}</span></h2>
      <div class="list ts-list">${conceptRows(r.arrears, null)}</div>
      <p class="muted small amort-note">Cobrados en ${selYear} pero devengados antes: están incluidos en las retribuciones dinerarias.</p>
    </section>` : ''}
    <p class="muted small amort-note">Referencia calculada con tus nóminas. Lo que vale para la declaración es el certificado de retenciones de la empresa.</p>`;
  bindYearSelector(el);
  el.querySelector('.sim-go')?.addEventListener('click', () => go('sim', 'forward'));
  el.querySelectorAll('.cert-add').forEach((btn) => btn.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/pdf';
    inp.addEventListener('change', () => { if (inp.files.length) importFiles(inp.files, currentProfile()); });
    inp.click();
  }));
  el.querySelectorAll('[data-decl-open]').forEach((b) => b.addEventListener('click', () => {
    const { d } = findDecl(b.dataset.declOpen);
    openFile(d.file, `Declaración ${d.year}`);
  }));
  el.querySelectorAll('[data-decl-del]').forEach((b) => b.addEventListener('click', async () => {
    const { d, p } = findDecl(b.dataset.declDel);
    if (!(await confirmSheet('Eliminar declaración', `Se borrará la declaración de ${d.year}. Se puede deshacer.`))) return;
    change(() => { p.decls = p.decls.filter((x) => x !== d); });
    render();
  }));
  el.querySelectorAll('[data-cert-open]').forEach((b) => b.addEventListener('click', () => {
    const { c } = findCert(b.dataset.certOpen);
    openFile(c.file, `Certificado ${c.year}`);
  }));
  el.querySelectorAll('[data-cert-del]').forEach((b) => b.addEventListener('click', async () => {
    const { c, p } = findCert(b.dataset.certDel);
    if (!(await confirmSheet('Eliminar certificado', `Se borrará el certificado de ${c.year}. Se puede deshacer.`))) return;
    change(() => { p.certs = p.certs.filter((x) => x !== c); });
    render();
  }));
  return el;
}

// ---------- Simulador de la Renta ----------
// Estima la declaración de un ejercicio (por defecto el año en curso, que se presenta el siguiente)
// con las nóminas, la previsión de los meses que faltan y los datos de UnderCTRL. Escalas estatal
// y de la Comunidad de Madrid vigentes desde 2023 (comprobadas con la declaración de 2023 al céntimo);
// tributación individual. Es una estimación: no incluye todas las deducciones ni situaciones.
const TRAMOS = {
  estatal: [[12450, 9.5], [20200, 12], [35200, 15], [60000, 18.5], [300000, 22.5], [Infinity, 24.5]],
  madrid: [[13362.22, 8.5], [19004.63, 10.7], [35425.68, 12.8], [57320.4, 17.4], [Infinity, 20.5]],
  ahorro: [[6000, 9.5], [50000, 10.5], [200000, 11.5], [300000, 13.5], [Infinity, 15]], // cada mitad (estatal y autonómica)
};
const MIN_PERSONAL = { estatal: 5550, madrid: 5956.65 };
const OTROS_GASTOS_TRABAJO = 2000; // art. 19.2.f LIRPF
function cuotaEscala(base, tramos) {
  let c = 0, prev = 0;
  for (const [hasta, pct] of tramos) {
    if (base <= prev) break;
    c += ((Math.min(base, hasta) - prev) * pct) / 100;
    prev = hasta;
  }
  return round2(c);
}
// Reducción por obtención de rendimientos del trabajo (art. 20, desde 2024)
function reduccionTrabajo(rn) {
  if (rn <= 14852) return 7302;
  if (rn <= 17673.52) return round2(7302 - 1.75 * (rn - 14852));
  if (rn <= 19747.5) return round2(2364.34 - 1.14 * (rn - 17673.52));
  return 0;
}

// x: datos del ejercicio → todas las cifras de la declaración simulada
function calcRenta(x) {
  const ingresos = round2(x.dinerarias + x.especie + x.ppCo);
  const rnPrevio = round2(ingresos - x.ss - x.union);
  const otrosGastos = Math.min(x.otrosGastos, Math.max(0, rnPrevio));
  const rnSinRed = round2(rnPrevio - otrosGastos);
  const redTrabajo = Math.min(reduccionTrabajo(rnSinRed), Math.max(0, rnSinRed));
  const rnTrabajo = round2(rnSinRed - redTrabajo);
  // Planes de pensiones: 1.500 € de aportaciones propias + hasta 8.500 € más por planes de empresa;
  // nunca más del 30 % de los rendimientos netos del trabajo.
  const ppTotal = round2(x.ppPersonal + x.ppTrab + x.ppCo);
  const ppRed = round2(Math.min(ppTotal, Math.min(x.ppPersonal, 1500) + Math.min(x.ppTrab + x.ppCo, 8500), 0.3 * Math.max(0, rnTrabajo)));
  const big = rnTrabajo;
  const blg = round2(Math.max(0, big - ppRed));
  // Ahorro: pérdidas del año compensan hasta el 25 % del capital mobiliario; las pendientes de años
  // anteriores, primero contra ganancias y luego hasta el 25 % del capital mobiliario.
  let rcm = x.rcm, gp = x.gp, pend = x.perdidasPend;
  if (gp < 0) { const off = Math.min(-gp, 0.25 * Math.max(0, rcm)); rcm -= off; gp = 0; }
  const aplicGp = Math.min(pend, Math.max(0, gp)); gp -= aplicGp; pend -= aplicGp;
  const aplicRcm = Math.min(pend, 0.25 * Math.max(0, rcm)); rcm -= aplicRcm; pend -= aplicRcm;
  const bla = round2(Math.max(0, rcm + gp));
  const cGenE = Math.max(0, cuotaEscala(blg, TRAMOS.estatal) - cuotaEscala(Math.min(x.minE, blg), TRAMOS.estatal));
  const cGenA = Math.max(0, cuotaEscala(blg, TRAMOS.madrid) - cuotaEscala(Math.min(x.minA, blg), TRAMOS.madrid));
  const cAho = cuotaEscala(bla, TRAMOS.ahorro);
  const cie = round2(cGenE + cAho), cia = round2(cGenA + cAho);
  // Donativos (Ley 49/2002): 80 % de los primeros 250 € y 40 % del resto (45 % si son recurrentes)
  const donDed = round2(Math.min((Math.min(x.donativos, 250) * 0.8) + Math.max(0, x.donativos - 250) * (x.donRecurrent ? 0.45 : 0.4), 0.1 * (blg + bla)));
  // Doble imposición internacional (art. 80): lo retenido fuera, con el tope de lo que tributa aquí ese
  // dividendo (al tipo medio del ahorro de la declaración)
  const tipoAhorro = bla > 0 ? (2 * cAho) / bla : 0;
  const dobleImp = round2(Math.min(x.divOrigin || 0, (x.divGross || 0) * tipoAhorro));
  const deducciones = round2(Math.min(cie + cia, donDed + dobleImp + x.otrasDed));
  const cuotaLiq = round2(cie + cia - deducciones);
  const result = round2(cuotaLiq - x.retenciones);
  return { ingresos, rnPrevio, otrosGastos, redTrabajo, rnTrabajo, ppTotal, ppRed, big, blg, aplicPend: round2(aplicGp + aplicRcm), bla, cie, cia, donDed, dobleImp, deducciones, cuotaLiq, result,
    tipoMedio: blg ? round2(((cGenE + cGenA) / blg) * 100) : 0, cGenE: round2(cGenE), cGenA: round2(cGenA) };
}

// Comprobación de las escalas con una declaración presentada (cuota íntegra estatal y autonómica)
function calibrate(d) {
  if (d.year < 2023 || d.v.blg == null || d.v.cie == null || d.v.cia == null) return null;
  const minE = d.v.minE ?? MIN_PERSONAL.estatal, minA = d.v.minA ?? MIN_PERSONAL.madrid;
  const bla = d.v.bla || 0;
  const cie = round2(cuotaEscala(d.v.blg, TRAMOS.estatal) - cuotaEscala(Math.min(minE, d.v.blg), TRAMOS.estatal) + cuotaEscala(bla, TRAMOS.ahorro));
  const cia = round2(cuotaEscala(d.v.blg, TRAMOS.madrid) - cuotaEscala(Math.min(minA, d.v.blg), TRAMOS.madrid) + cuotaEscala(bla, TRAMOS.ahorro));
  return { year: d.year, diff: round2(cie + cia - d.v.cie - d.v.cia) };
}

const simSettings = (p, y) => ({ donativos: 0, donRecurrent: false, ppExtra: 0, gpExtra: 0, rcmExtra: 0, retExtra: 0, dedExtra: 0,
  otrosGastos: OTROS_GASTOS_TRABAJO, exclude: {}, ...(p.sim?.[y] ?? {}) });
const inYear = (date, y) => String(date || '').startsWith(`${y}-`);

// Previsión de los meses que faltan del año en curso (y la paga extra pendiente).
function forecastWork(p, y, fin) {
  const now = new Date();
  if (y !== now.getFullYear()) return { months: [], total: null };
  const slips = p.slips.filter((s) => s.year === y);
  const monthly = sortSlips(p.slips.filter((s) => s.kind === 'monthly')).slice(0, 3);
  if (!monthly.length) return { months: [], total: null, missing: true };
  const ts = monthly.map(slipTotals);
  const sum = (k) => ts.reduce((a, t) => a + t[k], 0);
  const avg = { gross: sum('gross') / ts.length, net: sum('net') / ts.length };
  const rate = { irpf: sum('irpf') / sum('gross'), ss: sum('ss') / sum('gross'), grossPerNet: sum('gross') / sum('net') };
  const ppOf = (s, code) => s.concepts.filter((k) => k.code.split(' ').at(-1) === code).reduce((a, k) => a + k.amount, 0);
  const ppAvg = { trab: monthly.reduce((a, s) => a + ppOf(s, '2350'), 0) / monthly.length, co: monthly.reduce((a, s) => a + ppOf(s, '3352'), 0) / monthly.length };
  const lastM = Math.max(0, ...slips.filter((s) => s.kind === 'monthly').map((s) => s.month));
  const months = [];
  for (let m = lastM + 1; m <= 12; m++) {
    const ym = `${y}-${String(m).padStart(2, '0')}`;
    const projNet = fin?.nomina?.[ym];
    const big = projNet && projNet > avg.net * 1.5; // la proyección ya incluye una paga extra ese mes
    const gross = projNet ? projNet * rate.grossPerNet : avg.gross;
    months.push({ m, kind: 'monthly', src: projNet ? 'UnderCTRL' : 'media', net: projNet || avg.net, gross, includesExtra: big });
    // Paga extra de ese mes el año pasado que este año aún no se ha cobrado
    const prevExtra = p.slips.find((s) => s.year === y - 1 && s.month === m && s.kind === 'extra');
    if (prevExtra && !big && !slips.some((s) => s.month === m && s.kind === 'extra')) {
      const lastExtra = sortSlips(slips.filter((s) => s.kind === 'extra'))[0] ?? prevExtra;
      months.push({ m, kind: 'extra', src: 'extra', gross: slipTotals(lastExtra).gross, from: lastExtra, prevExtra });
    }
  }
  const tot = { gross: 0, irpf: 0, ss: 0, ppTrab: 0, ppCo: 0 };
  months.forEach((x) => {
    x.irpf = x.gross * rate.irpf;
    // La paga extra no cotiza aparte (va prorrateada): en un mes previsto con la extra incluida, la
    // Seguridad Social se calcula solo sobre la parte de nómina normal (el bruto medio)
    x.ss = x.kind === 'monthly' ? (x.includesExtra ? Math.min(x.gross, avg.gross) : x.gross) * rate.ss : 0;
    tot.gross += x.gross;
    tot.irpf += x.irpf;
    if (x.kind === 'monthly') { tot.ss += x.ss; tot.ppTrab += ppAvg.trab; tot.ppCo += ppAvg.co; }
  });
  Object.keys(tot).forEach((k) => { tot[k] = round2(tot[k]); });
  return { months, total: tot, rate, ref: monthly, avg, ppAvg, lastM };
}

// Ahorro y planes de UnderCTRL del ejercicio
function financeYear(fin, y, set) {
  const out = { items: [], ppPersonal: 0, ppTrab: 0, ppCo: 0, divGross: 0, divOrigin: 0, divLocal: 0 };
  if (!fin) return out;
  const add = (it) => { it.excluded = !!set.exclude[it.id]; out.items.push(it); };
  for (const pl of fin.pensions) {
    const ins = pl.movements.filter((m) => m.type === 'in' && inYear(m.date, y));
    if (pl.planType === 'personal') out.ppPersonal += ins.reduce((a, m) => a + m.amount, 0);
    else { out.ppTrab += ins.reduce((a, m) => a + m.amount, 0); out.ppCo += ins.reduce((a, m) => a + m.company, 0); }
  }
  for (const s of fin.sold.filter((x) => inYear(x.sellDate, y))) {
    const basis = s.fiscalPrice || s.buyPrice;
    const eur = s.currency === 'EUR';
    const ok = eur || (s.buyFx && s.sellFx);
    const gain = ok ? round2(s.qty * s.sellPrice * (eur ? 1 : s.sellFx) - s.qty * basis * (eur ? 1 : s.buyFx)) : 0;
    add({ id: `s-${s.id}`, kind: 'gp', label: `Venta de ${s.name}`, amount: gain,
      note: !ok ? 'Sin cambio de divisa: no se puede calcular' : s.fiscalPrice ? 'Con el precio de compra fiscal' : basis ? 'Con el precio de compra' : 'Falta el precio de compra', bad: !ok || !basis });
  }
  const divs = fin.dividends.filter((d) => inYear(d.date, y));
  if (divs.length) {
    const gross = round2(divs.reduce((a, d) => a + d.total, 0));
    const origin = round2(divs.reduce((a, d) => a + (d.origin || 0), 0));
    const local = round2(divs.reduce((a, d) => a + (d.local || 0), 0));
    add({ id: 'divs', kind: 'rcm', label: `Dividendos (${divs.length})`, amount: gross,
      note: ['Importe bruto', origin ? `retención en origen ${numStr2(origin)} € (doble imposición)` : '', local ? `retención en España ${numStr2(local)} €` : ''].filter(Boolean).join(' · ') });
    if (!set.exclude.divs) Object.assign(out, { divGross: gross, divOrigin: origin, divLocal: local });
  }
  for (const f of [...fin.funds.map((x) => ({ ...x, t: 'Fondo' })), ...fin.crypto.map((x) => ({ ...x, t: 'Crypto' }))]) {
    const outs = f.movements.filter((m) => m.type === 'out' && inYear(m.date, y));
    if (!outs.length) continue;
    const contributed = f.movements.filter((m) => m.type === 'in').reduce((a, m) => a + m.amount, 0);
    const withdrawn = f.movements.filter((m) => m.type === 'out').reduce((a, m) => a + m.amount, 0);
    const value = f.amount + withdrawn;
    const ratio = value > 0 ? Math.max(0, value - contributed) / value : 0; // parte de cada reembolso que es ganancia (media)
    const sold = outs.reduce((a, m) => a + m.amount, 0);
    add({ id: `f-${f.id}`, kind: 'gp', label: `${f.t === 'Fondo' ? 'Reembolso' : 'Venta'} de ${f.name}`, amount: round2(sold * ratio),
      note: `Estimado sobre ${numStr2(sold)} € retirados${f.t === 'Fondo' ? '; si fue un traspaso no tributa' : ''}` });
  }
  ['ppPersonal', 'ppTrab', 'ppCo'].forEach((k) => { out[k] = round2(out[k]); });
  return out;
}

// Datos del ejercicio para calcRenta, con el origen de cada cifra
function simInputs(p, y) {
  const set = simSettings(p, y);
  const fin = finPerson(p);
  const slips = p.slips.filter((s) => s.year === y);
  const r = rentaData(slips, p.slips, y);
  const fc = forecastWork(p, y, fin);
  const fy = financeYear(fin, y, set);
  const incl = fy.items.filter((it) => !it.excluded);
  const last = [...p.decls].sort((a, b) => b.year - a.year).find((d) => d.year < y) ?? null;
  // Pérdidas pendientes de la última declaración: se compensan durante los 4 años siguientes al de origen.
  // Sin el año de origen (declaraciones subidas antes de la v1.3.0) no se aplican.
  const pendValid = last?.v.perdidas && last.v.perdidasYear && last.v.perdidasYear + 4 >= y ? last.v.perdidas : 0;
  const f = fc.total ?? { gross: 0, irpf: 0, ss: 0, ppTrab: 0, ppCo: 0 };
  // Especie que tributa (no el comedor, el seguro médico ni las acciones, exentos con límites) y
  // su ingreso a cuenta, estimado con el % de IRPF del año
  const espT = round2(yearConcepts(slips).filter((k) => isEspecie(k) && !catalogOf(k).exenta && catalogOf(k).renta !== 'ppCo').reduce((a, k) => a + k.amount, 0));
  const irpfPct = r.gross ? r.irpf / r.gross : (fc.rate?.irpf ?? 0);
  const iac = round2(espT * irpfPct);
  return {
    set, fin, slips, r, fc, fy, last,
    x: {
      dinerarias: round2(r.gross + r.caja + f.gross), especie: round2(espT + iac), ppCo: round2(r.ppCo + f.ppCo),
      ss: round2(r.ss + f.ss), union: r.union, otrosGastos: Number(set.otrosGastos) || 0,
      ppPersonal: round2(fy.ppPersonal + (Number(set.ppExtra) || 0)), ppTrab: round2(r.ppEmp + f.ppTrab),
      rcm: round2(incl.filter((it) => it.kind === 'rcm').reduce((a, it) => a + it.amount, 0) + (Number(set.rcmExtra) || 0)),
      gp: round2(incl.filter((it) => it.kind === 'gp').reduce((a, it) => a + it.amount, 0) + (Number(set.gpExtra) || 0)),
      perdidasPend: pendValid,
      minE: last?.v.minE ?? MIN_PERSONAL.estatal, minA: last?.v.minA ?? MIN_PERSONAL.madrid,
      donativos: Number(set.donativos) || 0, donRecurrent: !!set.donRecurrent, otrasDed: Number(set.dedExtra) || 0,
      retenciones: round2(r.irpf + r.cajaRet + iac + f.irpf + fy.divLocal + (Number(set.retExtra) || 0)),
      divGross: fy.divGross, divOrigin: fy.divOrigin,
    },
  };
}

// Aportaciones a planes de empresa: UnderCTRL frente a las nóminas (meses con nómina del año)
function pensionMismatch(p, fin, y) {
  if (!fin) return null;
  const company = fin.pensions.filter((pl) => pl.planType === 'company');
  if (!company.length) return null;
  const slips = p.slips.filter((s) => s.year === y && s.concepts.length);
  if (!slips.length) return null;
  const months = new Set(slips.map((s) => String(s.month).padStart(2, '0')));
  const code = (s, c) => s.concepts.filter((k) => k.code.split(' ').at(-1) === c).reduce((a, k) => a + k.amount, 0);
  const nom = { trab: round2(slips.reduce((a, s) => a + code(s, '2350'), 0)), co: round2(slips.reduce((a, s) => a + code(s, '3352'), 0)) };
  if (!nom.trab && !nom.co) return null;
  const movs = company.flatMap((pl) => pl.movements).filter((m) => m.type === 'in' && inYear(m.date, y) && months.has(m.date.slice(5, 7)));
  const uc = { trab: round2(movs.reduce((a, m) => a + m.amount, 0)), co: round2(movs.reduce((a, m) => a + m.company, 0)) };
  const ok = Math.abs(uc.trab - nom.trab) < 1 && Math.abs(uc.co - nom.co) < 1;
  return { ok, nom, uc, months: months.size };
}

function renderSim() {
  const el = document.createElement('div');
  if (isTotal()) {
    el.innerHTML = '<section class="hero"><p class="label">Simulador de la Renta</p><p class="muted small">La Renta es de cada persona: elige una abajo.</p></section>';
    return el;
  }
  const p = currentProfile();
  const y = selYear;
  const S = simInputs(p, y);
  const c = calcRenta(S.x);
  const refund = c.result < 0;
  const decl = p.decls.find((d) => d.year === y) ?? null;
  const cal = [...p.decls].sort((a, b) => b.year - a.year).map(calibrate).find(Boolean);
  const mis = pensionMismatch(p, S.fin, y);
  const row = (label, v, note = '', cls = '', attrs = '') => `
    <div class="cat-row" ${attrs}><span class="cat-name">${label}${note ? `<small class="muted">${note}</small>` : ''}</span><span class="amount ${cls}">${money(v)}</span></div>`;
  const nReal = S.slips.length;
  const fcM = S.fc.months.filter((m) => m.kind === 'monthly');
  const fcE = S.fc.months.filter((m) => m.kind === 'extra');
  const fromUC = fcM.filter((m) => m.src === 'UnderCTRL').length;
  const linkCard = !link
    ? `<button class="add-btn sim-link" type="button">${icon('swap', 18)} Vincular con UnderCTRL</button>
       <p class="muted small amort-note">Para sumar tus planes de pensiones, acciones vendidas, dividendos, fondos y la nómina prevista.</p>`
    : `<button class="block sim-link" type="button" style="--block-color:#22d3ee">
        <span class="cat-icon" style="color:#22d3ee">${icon('swap')}</span>
        <span class="cat-text"><span class="cat-name">UnderCTRL</span><span class="muted small">${linkError ? esc(linkError)
          : S.fin ? `«${esc(S.fin.name)}» · datos del ${new Date(linkData.at).toLocaleString(LOCALE, { dateStyle: 'short', timeStyle: 'short' })}`
          : `No hay ninguna persona llamada «${esc(p.name)}» en UnderCTRL${Object.keys(linkData?.people ?? {}).length ? ` (hay: ${Object.values(linkData.people).map((x) => esc(x.name)).join(', ')})` : ''}`}</span></span>
        <span class="chev">${icon('chevron', 16)}</span>
      </button>`;
  el.innerHTML = `
    <section class="hero">
      <p class="label">Renta ${y} · simulación</p>
      <div class="net-row">
        <p class="net amount ${refund ? 'pos' : 'neg'}">${money(Math.abs(c.result))}</p>
        <button class="icon-btn sim-set" type="button" aria-label="Ajustes de la simulación" title="Ajustes">${icon('pencil', 20)}</button>
      </div>
      <p class="muted small">${refund ? 'A devolver' : 'A ingresar'} · se presenta en ${y + 1} · Madrid, tributación individual</p>
      ${mis && !mis.ok ? `<p class="small warn-line">${icon('alert', 13)} Las aportaciones al plan de empresa de UnderCTRL no coinciden con tus nóminas (ver abajo).</p>` : ''}
    </section>
    <section class="summary">
      <div class="pill"><span class="label">Cuota líquida</span><span class="amount">${money(c.cuotaLiq)}</span></div>
      <div class="pill"><span class="label">Retenciones</span><span class="amount neg">${money(-S.x.retenciones)}</span></div>
      <div class="pill"><span class="label">Base liquidable</span><span class="amount">${money(c.blg + c.bla)}</span></div>
      <button class="pill pill-info" type="button" data-tipo aria-label="Ver cómo se calcula el tipo medio"><span class="label">Tipo medio <span class="info-dot" aria-hidden="true">i</span></span><span class="amount">${isPrivate() ? MASK : numPct(c.tipoMedio)}</span></button>
    </section>
    <section class="group">${linkCard}</section>
    ${decl ? `<section class="group"><div class="list cert-card"><p class="small ${Math.abs(c.result - (decl.v.result ?? 0)) < 50 ? 'ok-line' : 'warn-line'}">Declaración presentada: ${decl.v.result < 0 ? 'a devolver' : 'a ingresar'} ${money(Math.abs(decl.v.result ?? 0))} · la simulación da ${money(Math.abs(c.result))} (diferencia ${money(round2(c.result - (decl.v.result ?? 0)), true)})</p></div></section>` : ''}
    <section class="group"><h2>Rendimientos del trabajo</h2><div class="list ts-list">
      ${row('Nóminas cobradas', round2(S.r.gross + S.r.caja), `${nReal} ${nReal === 1 ? 'nómina' : 'nóminas'} de ${y}${S.r.caja ? ', con pagos por caja' : ''}`)}
      ${S.fc.total ? row(`Previsión hasta diciembre <span class="info-dot" aria-hidden="true">i</span>`, S.fc.total.gross,
        `${fcM.length} ${fcM.length === 1 ? 'mes' : 'meses'}${fcE.length ? ` + ${fcE.length} paga extra` : ''} · ${fromUC ? `líquido de las proyecciones de UnderCTRL en ${fromUC}, ` : ''}bruto e IRPF según tus últimas nóminas · toca para ver el cálculo`,
        '', 'data-fc role="button" tabindex="0" aria-label="Ver cómo se calcula la previsión hasta diciembre"') : ''}
      ${S.fc.missing ? '<p class="empty muted small">Sube alguna nómina para prever el resto del año.</p>' : ''}
      ${row('Retribuciones en especie', S.x.especie, 'Las que tributan, con su ingreso a cuenta (comedor, seguro médico y acciones están exentos)')}
      ${row('Aportación de la empresa al plan', S.x.ppCo)}
      ${row('Seguridad Social', -S.x.ss, 'Gasto deducible', 'neg')}
      ${S.x.union ? row('Cuotas sindicales', -S.x.union, 'Gasto deducible', 'neg') : ''}
      ${row('Otros gastos deducibles', -c.otrosGastos, 'General de 2.000 €', 'neg')}
      ${c.redTrabajo ? row('Reducción por rendimientos del trabajo', -c.redTrabajo, '', 'neg') : ''}
      ${row('Rendimiento neto del trabajo', c.rnTrabajo)}
    </div></section>
    <section class="group"><h2>Planes de pensiones</h2><div class="list ts-list">
      ${row('Tus aportaciones al plan de empresa', S.x.ppTrab, 'Nóminas')}
      ${row('Aportaciones de la empresa', S.x.ppCo, 'Nóminas')}
      ${row('Planes individuales', S.x.ppPersonal, S.fin ? `UnderCTRL${Number(S.set.ppExtra) ? ` + ${numStr2(S.set.ppExtra)} € previstos` : ''}` : 'Vincula UnderCTRL o añádelas en ajustes')}
      ${row('Reducción aplicada', -c.ppRed, c.ppRed < c.ppTotal ? 'Limitada por ley' : '', 'neg')}
      ${mis ? `<div class="cat-row"><span class="cat-name">${mis.ok ? `<span class="ok-line">${icon('check', 13)} UnderCTRL coincide con tus nóminas</span>` : `<span class="warn-line">${icon('alert', 13)} UnderCTRL no coincide con tus nóminas</span>`}<small class="muted">Plan de empresa en los ${mis.months} meses con nómina: tú ${numStr2(mis.uc.trab)} (nóminas ${numStr2(mis.nom.trab)}) · empresa ${numStr2(mis.uc.co)} (nóminas ${numStr2(mis.nom.co)})</small></span></div>` : ''}
    </div></section>
    <section class="group"><h2>Ahorro</h2><div class="list ts-list">
      ${S.fy.items.map((it) => `
      <div class="cat-row sim-item ${it.excluded ? 'off' : ''}" data-excl="${it.id}" role="button" tabindex="0">
        <span class="cat-name">${esc(it.label)}<small class="muted">${it.kind === 'rcm' ? 'Capital mobiliario' : 'Ganancia patrimonial'} · ${esc(it.note)}${it.excluded ? ' · no se cuenta' : ''}</small></span>
        <span class="amount ${it.bad ? 'warn' : ''}">${money(it.amount)}</span>
      </div>`).join('') || `<p class="empty muted small">${S.fin ? `Sin ventas, dividendos ni reembolsos en ${y}.` : 'Vincula UnderCTRL para incluir acciones, dividendos y fondos.'}</p>`}
      ${Number(S.set.gpExtra) ? row('Otras ganancias o pérdidas', S.set.gpExtra, 'Ajustes') : ''}
      ${Number(S.set.rcmExtra) ? row('Otro capital mobiliario', S.set.rcmExtra, 'Ajustes') : ''}
      ${c.aplicPend ? row('Pérdidas de años anteriores compensadas', -c.aplicPend, `De ${S.last.v.perdidasYear}, según tu declaración de ${S.last.year}${S.last.year < y - 1 ? `; si las usaste en ${S.last.year + 1}${S.last.year + 1 < y - 1 ? `–${y - 1}` : ''} será menos` : ''}`, 'neg') : ''}
      ${S.last?.v.perdidas && !S.last.v.perdidasYear ? `<p class="empty muted small">Tu declaración de ${S.last.year} tiene ${money(S.last.v.perdidas)} de pérdidas pendientes, pero no se sabe de qué año son: vuelve a subirla para tenerlas en cuenta.</p>` : ''}
      ${row('Base liquidable del ahorro', c.bla)}
    </div>
    ${S.fy.items.length ? '<p class="muted small amort-note">Toca una línea para no contarla (p. ej. un traspaso entre fondos).</p>' : ''}</section>
    <section class="group"><h2>Cálculo</h2><div class="list ts-list">
      ${row('Base liquidable general', c.blg)}
      ${row('Cuota íntegra estatal', c.cie)}
      ${row('Cuota íntegra autonómica', c.cia, 'Madrid')}
      ${c.dobleImp ? row('Deducción por doble imposición internacional', -c.dobleImp, `Retención en origen de los dividendos (${numStr2(S.x.divOrigin)} €), con el tope de lo que tributan aquí`, 'neg') : ''}
      ${c.deducciones - c.dobleImp > 0.004 ? row(c.dobleImp ? 'Otras deducciones' : 'Deducciones', -round2(c.deducciones - c.dobleImp), S.x.donativos ? 'Donativos y otras' : 'Ajustes', 'neg') : ''}
      ${row('Cuota líquida', c.cuotaLiq)}
      ${row('Retenciones y pagos a cuenta', -S.x.retenciones, `Nóminas${S.fc.total ? ' (cobradas y previstas)' : ''}${S.r.cajaRet ? ', pagos por caja' : ''}${S.fy.divLocal ? `, dividendos (${numStr2(S.fy.divLocal)} € retenidos en España)` : ''}${Number(S.set.retExtra) ? ' + ajustes' : ''}`, 'neg')}
      ${row(refund ? 'Resultado: a devolver' : 'Resultado: a ingresar', Math.abs(c.result), '', refund ? 'pos' : 'neg')}
    </div>
    <p class="muted small amort-note">Mínimo personal ${S.last?.v.minE != null ? `de tu declaración de ${S.last.year}` : 'general'}. ${cal ? `Escalas comprobadas con tu declaración de ${cal.year}: ${Math.abs(cal.diff) < 1 ? 'cuota íntegra exacta' : `diferencia de ${money(cal.diff, true)}`}. ` : ''}Estimación orientativa: no incluye deducciones autonómicas, vivienda, familia ni otras rentas.</p></section>`;
  el.querySelector('.sim-link').addEventListener('click', openLinkSheet);
  el.querySelector('[data-tipo]')?.addEventListener('click', () => openTipoInfo(S, c, y));
  const fcRow = el.querySelector('[data-fc]');
  fcRow?.addEventListener('click', () => openForecastInfo(S, y));
  fcRow?.addEventListener('keydown', (e) => { if (e.key === 'Enter') openForecastInfo(S, y); });
  el.querySelector('.sim-set').addEventListener('click', () => openSimSettings(p, y));
  el.querySelectorAll('[data-excl]').forEach((r) => r.addEventListener('click', () => {
    change(() => {
      p.sim ??= {};
      const s = (p.sim[y] ??= {});
      s.exclude ??= {};
      if (s.exclude[r.dataset.excl]) delete s.exclude[r.dataset.excl]; else s.exclude[r.dataset.excl] = true;
    });
    render();
  }));
  return el;
}

// Tramos de una escala aplicados a una base: [desde, hasta, %, cuota]
function tramosDe(base, tramos) {
  const out = [];
  let prev = 0;
  for (const [hasta, pct] of tramos) {
    if (base <= prev) break;
    const top = Math.min(base, hasta);
    out.push([prev, top, pct, round2(((top - prev) * pct) / 100)]);
    prev = hasta;
  }
  return out;
}
// Ventana que explica el tipo medio (como en la declaración) y por qué no coincide con el % de las nóminas.
function openTipoInfo(S, c, y) {
  const P = (v) => (isPrivate() ? MASK : numPct(v));
  const e = (v) => (isPrivate() ? MASK : numStr2(v));
  const blg = c.blg;
  const minE = Math.min(S.x.minE, blg), minA = Math.min(S.x.minA, blg);
  const marg = (tramos) => tramos.find(([hasta]) => blg <= hasta)?.[1] ?? 0;
  const workGross = round2(S.r.gross + S.r.caja + (S.fc.total?.gross ?? 0));
  const workIrpf = round2(S.r.irpf + S.r.cajaRet + (S.fc.total?.irpf ?? 0));
  const efectivo = c.ingresos ? ((c.cGenE + c.cGenA) / c.ingresos) * 100 : 0;
  const retNom = workGross ? (workIrpf / workGross) * 100 : 0;
  const escala = (titulo, tramos, min, cuotaGen) => {
    const rows = tramosDe(blg, tramos);
    const cuotaBase = round2(rows.reduce((a, r) => a + r[3], 0));
    const cuotaMin = cuotaEscala(min, tramos);
    return `
      <p class="opt-label">${titulo}</p>
      <div class="list fc-table">
        <div class="amort-cols tipo-cols"><span>Tramo de la base</span><span>%</span><span>Cuota</span></div>
        ${rows.map(([a, b, pct, q]) => `<div class="amort-row tipo-cols"><span>${e(a)} – ${e(b)}</span><span>${numPct(pct)}</span><span>${e(q)}</span></div>`).join('')}
        <div class="amort-row tipo-cols"><span>Cuota de la base</span><span></span><span>${e(cuotaBase)}</span></div>
        <div class="amort-row tipo-cols"><span>− Mínimo personal (${e(min)} €)</span><span></span><span>−${e(cuotaMin)}</span></div>
        <div class="amort-row tipo-cols fc-total"><span>Cuota</span><span>${blg ? P((cuotaGen / blg) * 100) : '—'}</span><span>${e(cuotaGen)}</span></div>
      </div>`;
  };
  const back = newSheet();
  back.innerHTML = `
    <div class="sheet fc-sheet" role="dialog" aria-modal="true" aria-label="Cómo se calcula el tipo medio">
      <h2 class="sheet-title">Tipo medio · ${P(c.tipoMedio)}</h2>
      <p class="muted small">Es el tipo medio de gravamen de la declaración (las casillas «tipo medio estatal» y «tipo medio autonómico» sumadas): la cuota que corresponde a tu base general dividida entre la <b>base liquidable general</b>.</p>
      <ol class="fc-steps">
        <li><b>Base liquidable general: ${e(blg)} €.</b> Ingresos del trabajo ${e(c.ingresos)} € − Seguridad Social ${e(S.x.ss)} €${S.x.union ? ` − cuotas sindicales ${e(S.x.union)} €` : ''} − otros gastos ${e(c.otrosGastos)} €${c.redTrabajo ? ` − reducción del trabajo ${e(c.redTrabajo)} €` : ''}${c.ppRed ? ` − planes de pensiones ${e(c.ppRed)} €` : ''}.</li>
        <li><b>Escalas.</b> A la base se le aplican por tramos la escala estatal y la de Madrid, y a cada una se le resta la cuota que corresponde al mínimo personal (esa parte no tributa).</li>
        <li><b>Tipo medio</b> = (cuota estatal ${e(c.cGenE)} € + cuota autonómica ${e(c.cGenA)} €) ÷ base ${e(blg)} € = <b>${P(c.tipoMedio)}</b>.</li>
      </ol>
      ${escala('Escala estatal', TRAMOS.estatal, minE, c.cGenE)}
      ${escala('Escala de Madrid', TRAMOS.madrid, minA, c.cGenA)}
      <p class="opt-label">¿Por qué es mayor que el % de tus nóminas?</p>
      <div class="list ts-list">
        <div class="cat-row"><span class="cat-name">Tipo medio de la declaración<small class="muted">Sobre la base liquidable general</small></span><span class="amount">${P(c.tipoMedio)}</span></div>
        <div class="cat-row"><span class="cat-name">Sobre tus ingresos del trabajo<small class="muted">La misma cuota sobre el bruto, antes de restar Seguridad Social, gastos y planes</small></span><span class="amount">${P(efectivo)}</span></div>
        <div class="cat-row"><span class="cat-name">Retención media de tus nóminas de ${y}<small class="muted">IRPF retenido ÷ bruto${S.fc.total ? ', con la previsión' : ''}</small></span><span class="amount">${P(retNom)}</span></div>
        <div class="cat-row"><span class="cat-name">Tipo marginal<small class="muted">Lo que tributa cada euro más de base (estatal ${numPct(marg(TRAMOS.estatal))} + Madrid ${numPct(marg(TRAMOS.madrid))})</small></span><span class="amount">${P(marg(TRAMOS.estatal) + marg(TRAMOS.madrid))}</span></div>
      </div>
      <p class="muted small">El % de IRPF de la nómina se aplica sobre el <b>bruto</b>; el tipo medio, sobre la <b>base liquidable</b>, que es menor porque ya descuenta la Seguridad Social, los gastos y los planes de pensiones. Por eso el tipo medio sale más alto aunque la cuota sea la misma. Para comparar con tus nóminas, mira la línea «sobre tus ingresos del trabajo».${isPrivate() || !retNom ? '' : efectivo > retNom + 0.1
        ? ` En tu caso la cuota sobre el bruto (${P(efectivo)}) es mayor que lo que te retienen las nóminas (${P(retNom)}): por eso la parte del trabajo sale a ingresar, antes de deducciones y del resto de rentas.`
        : efectivo < retNom - 0.1 ? ` En tu caso las nóminas retienen (${P(retNom)}) más que la cuota sobre el bruto (${P(efectivo)}): por eso la parte del trabajo sale a devolver.` : ''}</p>
      <div class="body-actions"><span></span><button class="text-btn done-btn fc-close" type="button">Entendido</button></div>
    </div>`;
  back.querySelector('.fc-close').addEventListener('click', closeSheet);
}

// Ventana que explica la previsión de los meses que faltan, mes a mes.
function openForecastInfo(S, y) {
  const fc = S.fc;
  const pct = (v) => (isPrivate() ? MASK : numPct(v * 100));
  const mon = (m) => MONTHS_SHORT[m - 1];
  const back = newSheet();
  back.innerHTML = `
    <div class="sheet fc-sheet" role="dialog" aria-modal="true" aria-label="Cómo se calcula la previsión">
      <h2 class="sheet-title">Previsión hasta diciembre</h2>
      <p class="muted small">Los meses de ${y} que aún no tienen nómina${fc.lastM ? ` (de ${MONTHS[fc.lastM]} a diciembre)` : ''} se estiman así:</p>
      <ol class="fc-steps">
        <li><b>Nóminas de referencia.</b> Tus ${fc.ref.length} últimas nóminas mensuales:
          <span class="fc-ref">${fc.ref.map((s) => { const t = slipTotals(s); return `${mon(s.month)} ${s.year}: ${money(t.gross)} bruto, ${money(t.net)} líquido`; }).join('<br>')}</span>
          De media, ${money(fc.avg.gross)} brutos y ${money(fc.avg.net)} líquidos al mes.</li>
        <li><b>Proporciones.</b> En esas nóminas, cada euro líquido son ${isPrivate() ? MASK : fc.rate.grossPerNet.toLocaleString(LOCALE, { maximumFractionDigits: 3 })} € brutos; la retención de IRPF es el ${pct(fc.rate.irpf)} del bruto y la Seguridad Social, el ${pct(fc.rate.ss)}.</li>
        <li><b>Bruto de cada mes.</b> Si en UnderCTRL tienes ese mes en la fila «Nómina» de tus proyecciones, se toma ese líquido y se pasa a bruto con la proporción anterior. Si no, se usa el bruto medio de tus nóminas. A cada bruto se le aplica el % de IRPF y de Seguridad Social.</li>
        ${fc.months.some((x) => x.kind === 'extra') ? `<li><b>Paga extra.</b> ${fc.months.filter((x) => x.kind === 'extra').map((x) => `En ${mon(x.m)} de ${y - 1} cobraste una paga extra que este año aún no tienes: se prevé por el bruto de ${x.from === x.prevExtra ? `aquella (${mon(x.prevExtra.month)} ${x.prevExtra.year})` : `tu última paga extra (${mon(x.from.month)} ${x.from.year})`}, con el mismo % de IRPF y sin Seguridad Social.`).join(' ')}</li>` : ''}
        ${fc.months.some((x) => x.includesExtra) ? '<li><b>Meses con paga extra en UnderCTRL.</b> Si el líquido previsto de un mes supera en más de un 50 % al líquido medio, se entiende que ya incluye la paga extra y no se suma otra. La Seguridad Social de ese mes se calcula solo sobre la parte de nómina normal, porque la paga extra no cotiza aparte.</li>' : ''}
        ${fc.ppAvg.trab || fc.ppAvg.co ? `<li><b>Plan de pensiones de empresa.</b> Cada mes previsto suma lo de tus nóminas de referencia: ${money(fc.ppAvg.trab)} tuyos y ${money(fc.ppAvg.co)} de la empresa.</li>` : ''}
      </ol>
      <div class="list fc-table">
        <div class="amort-cols fc-cols"><span>Mes</span><span>Líquido</span><span>Bruto</span><span>IRPF</span><span>Seg. Soc.</span></div>
        ${fc.months.map((x) => `
        <div class="amort-row fc-cols">
          <span>${mon(x.m)}<small class="fc-src ${x.src === 'UnderCTRL' ? 'uc' : ''}">${x.kind === 'extra' ? 'extra' : x.src === 'UnderCTRL' ? (x.includesExtra ? 'UC + extra' : 'UnderCTRL') : 'media'}</small></span>
          <span>${x.net != null ? numStr2(x.net) : '—'}</span><span>${numStr2(x.gross)}</span><span>${numStr2(x.irpf)}</span><span>${x.ss ? numStr2(x.ss) : '—'}</span>
        </div>`).join('')}
        <div class="amort-row fc-cols fc-total"><span>Total</span><span></span><span>${numStr2(fc.total.gross)}</span><span>${numStr2(fc.total.irpf)}</span><span>${numStr2(fc.total.ss)}</span></div>
      </div>
      <p class="muted small">No se prevén pagos puntuales (bonus, complementos por resultado, atrasos…): si esperas alguno, la Renta real te saldrá distinta. ${S.fin ? 'Para que la previsión use tu líquido previsto, rellena la fila «Nómina» en las proyecciones de UnderCTRL.' : 'Vincula UnderCTRL para usar el líquido previsto de tus proyecciones.'}</p>
      <div class="body-actions"><span></span><button class="text-btn done-btn fc-close" type="button">Entendido</button></div>
    </div>`;
  back.querySelector('.fc-close').addEventListener('click', closeSheet);
}

function openSimSettings(p, y) {
  const set = simSettings(p, y);
  const back = newSheet();
  const f = (cls, label, v, hint = '') => `<label class="field"><span>${label}</span><input class="${cls}" inputmode="decimal" value="${formatInput(Number(v) || 0)}" placeholder="0,00">${hint ? `<small class="muted">${hint}</small>` : ''}</label>`;
  back.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Ajustes de la simulación">
      <h2 class="sheet-title">Ajustes · Renta ${y}</h2>
      <p class="muted small">Lo que la app no puede saber por sí sola. Se guarda para este año y esta persona.</p>
      ${f('s-ppx', 'Aportación a planes individuales prevista hasta fin de año', set.ppExtra, 'Además de las de UnderCTRL')}
      <div class="mrow-fields">
        ${f('s-don', 'Donativos del año', set.donativos)}
        ${f('s-ded', 'Otras deducciones', set.dedExtra)}
      </div>
      <label class="no-more s-rec-l"><input type="checkbox" class="s-rec" ${set.donRecurrent ? 'checked' : ''}> Donativos recurrentes (3 años a la misma entidad)</label>
      <div class="mrow-fields">
        ${f('s-gp', 'Otras ganancias (− pérdidas)', set.gpExtra)}
        ${f('s-rcm', 'Intereses y otro capital mobiliario', set.rcmExtra)}
      </div>
      <div class="mrow-fields">
        ${f('s-ret', 'Otras retenciones', set.retExtra, 'Fondos, intereses…')}
        ${f('s-og', 'Otros gastos del trabajo', set.otrosGastos, '2.000 € en general')}
      </div>
      <div class="body-actions">
        <button class="text-btn s-cancel" type="button">Cancelar</button>
        <button class="text-btn done-btn s-save" type="button">Guardar</button>
      </div>
    </div>`;
  const v = (cls) => parseAmount(back.querySelector(`.${cls}`).value);
  back.querySelector('.s-cancel').addEventListener('click', closeSheet);
  back.querySelector('.s-save').addEventListener('click', () => {
    change(() => {
      p.sim ??= {};
      p.sim[y] = { ...(p.sim[y] ?? {}), ppExtra: v('s-ppx'), donativos: v('s-don'), dedExtra: v('s-ded'), donRecurrent: back.querySelector('.s-rec').checked,
        gpExtra: v('s-gp'), rcmExtra: v('s-rcm'), retExtra: v('s-ret'), otrosGastos: v('s-og') };
    });
    closeSheet();
    render();
  });
}

// ---------- Evolución ----------
// Bruto y neto de cada año (barras) y la tabla con su variación. El año en curso, si aún no está
// completo, se compara con los mismos meses del anterior.
function yearRows(profiles) {
  const years = [...new Set(allSlips(profiles).map((s) => s.year))].sort((a, b) => a - b);
  return years.map((y) => {
    const slips = slipsOfYear(y, profiles);
    const lastM = Math.max(...slips.map((s) => s.month));
    const t = aggregate(slips);
    const prev = slipsOfYear(y - 1, profiles);
    const base = prev.length ? aggregate(prev.filter((s) => lastM === 12 || s.month <= lastM)) : null;
    return { y, ...t, lastM, partial: lastM < 12, dGross: base ? t.gross - base.gross : null, dNet: base ? t.net - base.net : null };
  });
}
function evolutionChart(rows) {
  if (!rows.length) return '<p class="muted small hist-empty">El gráfico aparecerá cuando subas nóminas.</p>';
  const shown = rows.slice(-8);
  const W = 320, H = 150, P = 4, TOP = 14, LBL = 18;
  const max = Math.max(...shown.map((r) => r.gross), 1);
  const slot = (W - 2 * P) / shown.length;
  const bw = Math.min(26, slot * 0.32);
  const h = (v) => Math.max(0, ((H - TOP - LBL) * v) / max);
  const bars = shown.map((r, i) => {
    const cx = P + slot * (i + 0.5);
    const yb = H - LBL;
    return `
      <rect x="${(cx - bw - 1.5).toFixed(1)}" y="${(yb - h(r.gross)).toFixed(1)}" width="${bw.toFixed(1)}" height="${h(r.gross).toFixed(1)}" rx="3" fill="url(#evo-gross)"/>
      <rect x="${(cx + 1.5).toFixed(1)}" y="${(yb - h(r.net)).toFixed(1)}" width="${bw.toFixed(1)}" height="${h(r.net).toFixed(1)}" rx="3" fill="url(#evo-net)"/>
      <text x="${cx.toFixed(1)}" y="${H - 4}" text-anchor="middle" class="evo-lbl">${r.y}${r.partial ? '*' : ''}</text>`;
  }).join('');
  return `
    <svg class="evo-chart" viewBox="0 0 ${W} ${H}" aria-label="Bruto y neto por años">
      <defs>
        <linearGradient id="evo-gross" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#22d3ee" stop-opacity=".35"/></linearGradient>
        <linearGradient id="evo-net" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#bef264"/><stop offset="1" stop-color="#34d399" stop-opacity=".45"/></linearGradient>
      </defs>
      ${bars}
    </svg>
    <div class="legend evo-legend"><span><i style="background:#22d3ee"></i>Bruto</span><span><i style="background:#a3e635"></i>Neto</span>${shown.some((r) => r.partial) ? '<span class="muted">* año en curso</span>' : ''}</div>`;
}
function renderEvolution() {
  const profiles = viewProfiles();
  const rows = yearRows(profiles);
  const cur = rows.at(-1);
  const diffCls = (v) => (isPrivate() || !v ? '' : v > 0 ? 'pos' : 'neg');
  const signed = (v) => (v == null ? '—' : isPrivate() ? MASK : (v > 0 ? '+' : '') + numStr2(v));
  const period = cur && cur.partial ? `ene–${MONTHS_SHORT[cur.lastM - 1]} ’${String(cur.y - 1).slice(2)}` : cur ? String(cur.y - 1) : '';
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero compact">
      <p class="label">Bruto ${cur ? cur.y : new Date().getFullYear()}${cur?.partial ? ` · hasta ${MONTHS[cur.lastM - 1]}` : ''}</p>
      <p class="net amount">${money(cur?.gross)}</p>
      <p class="muted small">Neto ${money(cur?.net)}${cur?.gross ? ` · ${isPrivate() ? MASK : numPct((cur.net / cur.gross) * 100)} del bruto` : ''}</p>
    </section>
    <section class="summary hist-pills">
      <div class="pill"><span class="label">Bruto vs. ${cur?.dGross != null ? period : 'año anterior'}</span><span class="amount ${diffCls(cur?.dGross)}">${cur?.dGross != null ? money(cur.dGross, true) : '—'}</span></div>
      <div class="pill"><span class="label">Neto vs. ${cur?.dNet != null ? period : 'año anterior'}</span><span class="amount ${diffCls(cur?.dNet)}">${cur?.dNet != null ? money(cur.dNet, true) : '—'}</span></div>
    </section>
    <section class="group hist-chart-wrap"><div class="list hist-chart-box">${evolutionChart(rows)}</div></section>
    <section class="group">
      <h2>Por años</h2>
      <ul class="movs amort hist-list">
        <li class="mv-year open"><div class="amort-rows">
          <div class="amort-cols evo-cols"><span>Año</span><span>Bruto</span><span>Neto</span><span>Var. bruto</span><span>Var. neto</span></div>
          ${[...rows].reverse().map((r) => `
          <div class="amort-row evo-cols"><span>${r.y}${r.partial ? '*' : ''}</span><span>${numStr2(r.gross)}</span><span>${numStr2(r.net)}</span>
            <span class="${diffCls(r.dGross)}">${signed(r.dGross)}</span><span class="${diffCls(r.dNet)}">${signed(r.dNet)}</span></div>`).join('')
          || '<div class="amort-row"><span class="muted">Sin datos</span></div>'}
        </div></li>
      </ul>
      ${rows.some((r) => r.partial) ? '<p class="muted small amort-note">* Año sin terminar: la variación se calcula frente a los mismos meses del año anterior.</p>' : ''}
    </section>`;
  return el;
}

// ---------- Documentos ----------
function renderDocuments() {
  const profiles = viewProfiles();
  const slips = sortSlips(allSlips(profiles).filter((s) => s.file));
  const certs = profiles.flatMap((p) => p.certs).filter((c) => c.file).sort((a, b) => b.year - a.year);
  const decls = profiles.flatMap((p) => p.decls).filter((d) => d.file).sort((a, b) => b.year - a.year);
  const total = [...slips, ...certs, ...decls].reduce((a, x) => a + x.file.size, 0);
  const n = slips.length + certs.length + decls.length;
  const docBtn = (attr, ic, title, f) => `
        <button class="block" type="button" ${attr} style="--block-color:#a3e635">
          <span class="cat-icon" style="color:#a3e635">${icon(ic)}</span>
          <span class="cat-text"><span class="cat-name">${esc(title)}</span><span class="muted small">${esc(f.name)} · ${sizeText(f.size)}</span></span>
          <span class="chev">${icon('chevron', 16)}</span>
        </button>`;
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero compact">
      <p class="label">Documentos guardados</p>
      <p class="net">${n}</p>
      <p class="muted small">${n ? `${sizeText(total)} en este dispositivo` : 'Los PDF de tus nóminas, certificados y declaraciones aparecerán aquí.'}</p>
    </section>
    ${decls.length ? `<section class="group"><h2>Declaraciones de la Renta</h2><div class="blocks">${decls.map((d) =>
      docBtn(`data-decl="${d.id}"`, 'renta', `Declaración ${d.year}`, d.file)).join('')}</div></section>` : ''}
    ${certs.length ? `<section class="group"><h2>Certificados de retenciones</h2><div class="blocks">${certs.map((c) =>
      docBtn(`data-cert="${c.id}"`, 'renta', `Certificado ${c.year}`, c.file)).join('')}</div></section>` : ''}
    <section class="group">
      ${certs.length || decls.length ? '<h2>Nóminas</h2>' : ''}
      <div class="blocks">${slips.map((s) => docBtn(`data-doc="${s.id}"`, 'payslips', `${slipTitle(s)}${s.kind !== 'monthly' ? ` · ${KINDS[s.kind]}` : ''}`, s.file)).join('') || '<p class="empty muted">No hay documentos.</p>'}</div>
    </section>`;
  el.querySelectorAll('[data-doc]').forEach((b) => b.addEventListener('click', () => { const s = findSlip(b.dataset.doc).s; openFile(s.file, slipTitle(s)); }));
  el.querySelectorAll('[data-cert]').forEach((b) => b.addEventListener('click', () => { const c = findCert(b.dataset.cert).c; openFile(c.file, `Certificado ${c.year}`); }));
  el.querySelectorAll('[data-decl]').forEach((b) => b.addEventListener('click', () => { const d = findDecl(b.dataset.decl).d; openFile(d.file, `Declaración ${d.year}`); }));
  return el;
}

// ---------- Datos de ejemplo (para ver el boceto) ----------
function loadDemo() {
  const p = currentProfile() ?? data.profiles[0];
  const y = new Date().getFullYear();
  const mk = (year, month, kind, gross, irpfRate) => {
    const ss = kind === 'monthly' ? round2(gross * 0.0647) : round2(gross * 0.0647);
    return normSlip({ year, month, kind, company: 'Empresa S.A.', gross, irpf: round2(gross * irpfRate), ss, demo: true });
  };
  const slips = [];
  for (let m = 1; m <= 12; m++) slips.push(mk(y - 1, m, 'monthly', 2850, 0.17));
  slips.push(mk(y - 1, 6, 'extra', 2850, 0.17), mk(y - 1, 12, 'extra', 2850, 0.17));
  const lastMonth = new Date().getMonth();
  for (let m = 1; m <= lastMonth; m++) slips.push(mk(y, m, 'monthly', 2990, 0.18));
  if (lastMonth >= 6) slips.push(mk(y, 6, 'extra', 2990, 0.18));
  if (lastMonth >= 3) slips.push(mk(y, 3, 'arrears', 420, 0.18));
  change(() => { p.slips.push(...slips); });
  openYears.add(String(y));
  render();
  showToast('Datos de ejemplo cargados');
}
function clearDemo() {
  change(() => { data.profiles.forEach((p) => { p.slips = p.slips.filter((s) => !s.demo); }); });
  render();
  showToast('Datos de ejemplo borrados', { action: { label: 'Deshacer', run: undo } });
}

// ---------- Importar/exportar copia ----------
// Un archivo con todas las nóminas y sus documentos (en base64) para pasarlo a otro dispositivo.
const BACKUP_MARK = 'PayCTRL-copia';
const blobToB64 = (blob) => new Promise((resolve) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1]);
  r.readAsDataURL(blob);
});
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
async function exportBackup() {
  const out = { mark: BACKUP_MARK, version: APP_VERSION, at: new Date().toISOString(), data, files: {} };
  for (const f of data.profiles.flatMap((p) => [...p.slips, ...p.certs, ...p.decls]).map((x) => x.file).filter(Boolean)) {
    const blob = await files.get(f.id).catch(() => null);
    if (blob) out.files[f.id] = { type: blob.type, b64: await blobToB64(blob) };
  }
  const name = `PayCTRL copia ${new Date().toISOString().slice(0, 10)}.txt`;
  const blob = new Blob([JSON.stringify(out)], { type: 'text/plain' });
  const file = new File([blob], name, { type: 'text/plain' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  downloadBlob(blob, name);
}
async function importBackup(file) {
  let obj;
  try { obj = JSON.parse(await file.text()); } catch {}
  if (obj?.mark !== BACKUP_MARK) return showToast('Ese archivo no es una copia de PayCTRL.', { warn: true });
  if (!(await confirmSheet('Importar copia', 'Se sustituirán todas las nóminas de este dispositivo por las de la copia.', 'Importar'))) return;
  await files.clear().catch(() => {});
  for (const [id, f] of Object.entries(obj.files || {})) {
    const bytes = b64.dec(f.b64);
    await files.put(id, new Blob([bytes], { type: f.type }));
  }
  trackUndo();
  data = normData(obj.data);
  persist();
  if (!validView(viewId)) viewId = data.profiles[0].id;
  go('summary');
  showToast('Copia importada');
}
function openBackupSheet() {
  const back = newSheet();
  back.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Importar/exportar copia">
      <h2 class="sheet-title">Importar/exportar copia</h2>
      <p class="muted small">Guarda todas tus nóminas, con sus documentos, en un archivo y cárgalo en otro dispositivo sin usar la nube. No se copian el nivel de seguridad ni la apariencia.</p>
      <button class="add-btn b-export" type="button">${icon('upload', 18)} Exportar copia</button>
      <label class="add-btn b-import">${icon('swap', 18)} Importar copia<input type="file" accept=".txt,text/plain" hidden></label>
      <div class="body-actions"><span></span><button class="text-btn done-btn b-close" type="button">Listo</button></div>
    </div>`;
  back.querySelector('.b-export').addEventListener('click', () => { closeSheet(); exportBackup(); });
  back.querySelector('.b-import input').addEventListener('change', (e) => { const f = e.target.files[0]; closeSheet(); if (f) importBackup(f); });
  back.querySelector('.b-close').addEventListener('click', closeSheet);
}

// ---------- Sincronización en la nube ----------
// Igual que en UnderCTRL: cuenta con usuario y contraseña (crearla pide la clave de registro, la
// misma de UnderCTRL) y cifrado de extremo a extremo: los datos y los PDF se cifran aquí
// (PBKDF2 + AES-256-GCM) antes de subirse; el servidor solo guarda bloques ilegibles.
// Las claves derivan con sal propia («nominas-…»): mismo usuario que en UnderCTRL, cuenta distinta.
const SYNC_KEY = 'nominas:sync';
const SYNC_API = '/api/sync';
const SYNC_EVERY_MS = 3 * 60 * 1000; // sincronización periódica mientras la app está abierta
const PBKDF2_ITERATIONS = 310000;
const BACKUP_CHECK_MS = 6.5 * 24 * 3600e3; // copia de seguridad semanal en la nube
const utf8 = new TextEncoder();

let sync = load(SYNC_KEY, null); // { username, user, auth, key, rev, dirty, at, backupAt }
const saveSync = () => { if (sync) save(SYNC_KEY, sync); else { try { localStorage.removeItem(SYNC_KEY); } catch {} } };
let pushTimer = null;
let syncBusy = false;
let syncError = '';
let backupBusy = false;

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha256hex = async (text) => hex(await crypto.subtle.digest('SHA-256', utf8.encode(text)));
// base64 por trozos (los datos pueden ser grandes para String.fromCharCode(...bytes))
const toB64 = (buf) => {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromB64 = (str) => Uint8Array.from(atob(str), (ch) => ch.charCodeAt(0));

async function deriveAccount(username, password) {
  const u = username.trim().toLowerCase();
  const base = await crypto.subtle.importKey('raw', utf8.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = (salt) => crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: utf8.encode(salt), iterations: PBKDF2_ITERATIONS }, base, 256);
  // Dos claves independientes: una para identificarse y otra (que nunca sale de aquí) para cifrar.
  const [auth, key] = await Promise.all([bits(`nominas-auth:${u}`), bits(`nominas-enc:${u}`)]);
  return { username: u, user: await sha256hex(`nominas-user:${u}`), auth: hex(auth), key: toB64(key) };
}

const aesKey = () => crypto.subtle.importKey('raw', fromB64(sync.key), 'AES-GCM', false, ['encrypt', 'decrypt']);
async function encryptBytes(bytes) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(), bytes);
  return `${toB64(iv)}.${toB64(ct)}`;
}
async function decryptBytes(blob) {
  const [iv, ct] = blob.split('.');
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, await aesKey(), fromB64(ct));
}
const encryptData = (obj) => encryptBytes(utf8.encode(JSON.stringify(obj)));
const decryptData = async (blob) => JSON.parse(new TextDecoder().decode(await decryptBytes(blob)));

async function syncCall(action, extra = {}, account = sync) {
  const body = JSON.stringify({ action, user: account.user, auth: account.auth, ...extra });
  const res = await fetch(SYNC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    // Al salir de la app, que la subida termine aunque se cierre (Safari lo limita a 64 KB).
    keepalive: document.hidden && body.length < 60000,
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(out.error || `http ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return out;
}

const syncErrorText = (err) => ({
  auth: 'Usuario o contraseña incorrectos.',
  exists: 'Ese nombre de usuario ya existe. Elige otro o entra con tu cuenta.',
  'too-many': 'Demasiados intentos. Espera 15 minutos.',
  invite: 'La clave de registro no es correcta.',
  'not-configured': 'Falta conectar la base de datos en Vercel (Storage → Upstash Redis).',
}[err.message] || 'No se pudo conectar con la nube. Se reintentará.');

const hasAnyData = () => data.profiles.some((p) => p.slips.some((s) => !s.demo) || p.certs.length || p.decls.length);
// Archivos a los que apuntan los datos (nóminas y certificados)
const fileRefs = () => data.profiles.flatMap((p) => [...p.slips, ...p.certs, ...p.decls]).map((x) => x.file).filter(Boolean);

function applyRemote(obj) {
  data = normData(obj);
  save(STORAGE_KEY, data);
  undoStack.length = 0; // los cambios llegados de otro dispositivo no se deshacen desde aquí
  updateUndoBtn();
  if (!validView(viewId)) viewId = data.profiles[0].id;
  if (screen.startsWith('slip:') && !findSlip(screen.slice(5))) screen = 'payslips';
  render();
}

// Marca cambios locales para subir (se agrupan unos segundos).
function markDirty() {
  if (!sync) return;
  sync.dirty = true;
  saveSync();
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => syncNow(), 1500);
}

// PDF: se suben los que falten en la nube y se bajan los que falten en este dispositivo.
async function syncFiles() {
  const refs = fileRefs();
  if (!refs.length) return;
  const remote = new Set((await syncCall('file-list')).ids);
  for (const f of refs) {
    const local = await files.get(f.id).catch(() => null);
    if (local && !remote.has(f.id)) {
      await syncCall('file-put', { id: f.id, blob: await encryptBytes(await local.arrayBuffer()) });
    } else if (!local && remote.has(f.id)) {
      const { blob } = await syncCall('file-get', { id: f.id });
      await files.put(f.id, new Blob([await decryptBytes(blob)], { type: f.type || 'application/pdf' }));
    }
  }
}

// Descarga cambios y sube los locales. Devuelve true si todo fue bien.
async function syncNow({ interactive = false } = {}) {
  if (!sync || syncBusy) return false;
  syncBusy = true;
  clearTimeout(pushTimer);
  try {
    const remote = await syncCall('pull');
    if (remote.rev > sync.rev && remote.blob) {
      if (sync.dirty) {
        // Cambios en los dos lados: se pregunta qué versión conservar.
        const keepCloud = await chooseSheet(
          'Cambios en dos dispositivos',
          'Hay cambios en la nube hechos desde otro dispositivo y también cambios en este que aún no se habían subido. ¿Qué versión quieres conservar?',
          [{ label: 'Los de la nube', value: true }, { label: 'Los de este dispositivo', value: false }],
        );
        if (keepCloud) {
          applyRemote(await decryptData(remote.blob));
          sync.dirty = false;
        }
      } else {
        applyRemote(await decryptData(remote.blob));
      }
      sync.rev = remote.rev;
    }
    if (sync.dirty) {
      const blob = await encryptData(data);
      try {
        const out = await syncCall('push', { blob, baseRev: sync.rev });
        sync.rev = out.rev;
        sync.dirty = false;
      } catch (err) {
        if (err.status !== 409) throw err;
        syncBusy = false;
        return syncNow({ interactive }); // alguien subió justo antes: se vuelve a comparar
      }
    }
    await syncFiles();
    sync.at = Date.now();
    syncError = '';
    saveSync();
    setTimeout(weeklyBackup, 0);
    if (link) setTimeout(() => refreshLink(), 0); // datos de UnderCTRL al día
    return true;
  } catch (err) {
    console.warn(err);
    syncError = syncErrorText(err);
    if (interactive) showToast(syncError, { warn: true });
    return false;
  } finally {
    syncBusy = false;
  }
}

// Copia de seguridad semanal de los datos (el servidor guarda las 12 últimas), cifrada igual.
async function weeklyBackup() {
  if (!sync || backupBusy || Date.now() - (sync.backupAt || 0) < BACKUP_CHECK_MS) return;
  backupBusy = true;
  try {
    const out = await syncCall('backup', { blob: await encryptData(data) });
    sync.backupAt = out.at;
    saveSync();
  } catch (err) {
    console.warn('copia de seguridad', err);
  } finally {
    backupBusy = false;
  }
}

async function pullFromCloud() {
  if (!sync) return false;
  for (let i = 0; syncBusy && i < 50; i++) await new Promise((r) => setTimeout(r, 100));
  syncBusy = true;
  clearTimeout(pushTimer);
  try {
    const remote = await syncCall('pull');
    if (remote.blob) applyRemote(await decryptData(remote.blob));
    sync.rev = remote.rev;
    sync.dirty = false;
    await syncFiles();
    sync.at = Date.now();
    syncError = '';
    saveSync();
    return true;
  } catch (err) {
    console.warn(err);
    syncError = syncErrorText(err);
    showToast(syncError, { warn: true });
    return false;
  } finally {
    syncBusy = false;
  }
}

function syncStatusText() {
  if (!sync) return 'Desactivada';
  if (syncError) return syncError;
  if (sync.dirty) return 'Cambios pendientes de subir';
  if (!sync.at) return 'Pendiente';
  const mins = Math.round((Date.now() - sync.at) / 60000);
  return `Al día · ${mins < 1 ? 'hace un momento' : mins < 60 ? `hace ${mins} min` : new Date(sync.at).toLocaleString(LOCALE, { dateStyle: 'short', timeStyle: 'short' })}`;
}

// Panel con dos o más opciones; resuelve con el `value` elegido.
function chooseSheet(title, text, options) {
  return new Promise((resolve) => {
    const back = document.createElement('div');
    back.className = 'sheet-backdrop';
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <h2 class="sheet-title">${esc(title)}</h2>
        <p class="muted">${esc(text)}</p>
        <div class="choice-list">${options.map((o, i) => `<button class="text-btn ${i === 0 ? 'done-btn' : ''}" data-i="${i}" type="button">${esc(o.label)}</button>`).join('')}</div>
      </div>`;
    back.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => {
      back.remove();
      resolve(options[b.dataset.i].value);
    }));
    document.body.append(back);
  });
}

// Pantalla de la cuenta: crear, entrar o ver el estado.
function openSyncSheet() {
  const back = newSheet();

  const renderConnected = () => {
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Sincronización en la nube">
        <h2 class="sheet-title">Sincronización en la nube</h2>
        <p>Conectado como <b>${esc(sync.username)}</b></p>
        <p class="muted small s-status">${esc(syncStatusText())}</p>
        <p class="muted small">Las nóminas, los certificados y sus PDF se cifran en este dispositivo antes de subirse. Entra con el mismo usuario y contraseña en tu otro iPhone, iPad u ordenador para verlos.</p>
        <div class="choice-list">
          <button class="text-btn done-btn s-now" type="button">${icon('refresh', 16)} Sincronizar ahora</button>
          <button class="text-btn s-pull" type="button">Traer los datos de la nube</button>
          <button class="text-btn s-logout" type="button">Desconectar este dispositivo</button>
          <button class="text-btn s-close" type="button">Cerrar</button>
        </div>
      </div>`;
    back.querySelector('.s-close').addEventListener('click', closeSheet);
    back.querySelector('.s-now').addEventListener('click', async () => {
      back.querySelector('.s-status').textContent = 'Sincronizando…';
      await syncNow({ interactive: true });
      back.querySelector('.s-status').textContent = syncStatusText();
    });
    back.querySelector('.s-pull').addEventListener('click', async () => {
      if (!confirm('Se sustituirán los datos de este dispositivo por los guardados en la nube (los de tus otros dispositivos). Lo que no se haya subido desde aquí se perderá. ¿Continuar?')) return;
      back.querySelector('.s-status').textContent = 'Descargando…';
      const ok = await pullFromCloud();
      back.querySelector('.s-status').textContent = syncStatusText();
      if (ok) showToast('Datos traídos de la nube.');
    });
    back.querySelector('.s-logout').addEventListener('click', () => {
      if (!confirm('¿Desconectar este dispositivo? Los datos se quedan en él, pero dejarán de sincronizarse.')) return;
      sync = null;
      saveSync();
      closeSheet();
      showToast('Sincronización desactivada en este dispositivo.');
    });
  };

  const renderForm = (mode = hasAnyData() ? 'create' : 'login') => {
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Sincronización en la nube">
        <h2 class="sheet-title">Sincronización en la nube</h2>
        <p class="muted small">Tus datos se cifran en este dispositivo con tu contraseña antes de subirse: nadie más puede leerlos, ni siquiera el servidor. <b>Si olvidas la contraseña no se pueden recuperar.</b></p>
        <div class="seg s-mode" role="group" aria-label="Cuenta">
          <button type="button" data-mode="create">Crear cuenta</button><button type="button" data-mode="login">Ya tengo cuenta</button>
        </div>
        <label class="field"><span>Usuario</span><input class="s-user" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="40"></label>
        <label class="field"><span>Contraseña</span><input class="s-pass" type="password" autocomplete="${mode === 'create' ? 'new-password' : 'current-password'}" maxlength="128"></label>
        ${mode === 'create' ? `<label class="field"><span>Repite la contraseña</span><input class="s-pass2" type="password" autocomplete="new-password" maxlength="128"></label>
        <label class="field"><span>Clave de registro</span><input class="s-invite" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="64" placeholder="Clave administrador"></label>` : ''}
        <p class="s-error error" role="alert"></p>
        <div class="body-actions">
          <button class="text-btn s-cancel" type="button">Cancelar</button>
          <button class="text-btn done-btn s-go" type="button">${mode === 'create' ? 'Crear cuenta' : 'Entrar'}</button>
        </div>
      </div>`;
    const q = (sel) => back.querySelector(sel);
    back.querySelectorAll('[data-mode]').forEach((b) => {
      b.classList.toggle('on', b.dataset.mode === mode);
      b.addEventListener('click', () => renderForm(b.dataset.mode));
    });
    q('.s-cancel').addEventListener('click', closeSheet);
    q('.s-user').focus();

    q('.s-go').addEventListener('click', async () => {
      const err = q('.s-error');
      const username = q('.s-user').value.trim();
      const password = q('.s-pass').value;
      if (username.length < 3) return void (err.textContent = 'El usuario debe tener al menos 3 caracteres.');
      if (password.length < 8) return void (err.textContent = 'La contraseña debe tener al menos 8 caracteres.');
      if (mode === 'create' && password !== q('.s-pass2').value) return void (err.textContent = 'Las contraseñas no coinciden.');
      if (mode === 'create' && !q('.s-invite').value.trim()) return void (err.textContent = 'Introduce la clave de registro.');

      const btn = q('.s-go');
      btn.disabled = true;
      btn.textContent = 'Un momento…';
      err.textContent = '';
      try {
        const account = await deriveAccount(username, password);
        if (mode === 'create') {
          await syncCall('register', { invite: q('.s-invite').value.trim() }, account);
          sync = { ...account, rev: 0, dirty: true, at: null };
          saveSync();
          await syncNow({ interactive: true });
          showToast('Cuenta creada. Tus nóminas ya están en la nube, cifradas.');
        } else {
          const remote = await syncCall('pull', {}, account);
          sync = { ...account, rev: 0, dirty: false, at: null };
          if (remote.blob) {
            const cloud = await decryptData(remote.blob);
            const useCloud = !hasAnyData() || await chooseSheet(
              'Este dispositivo ya tiene datos',
              '¿Qué datos quieres conservar? Los otros se sustituirán.',
              [{ label: 'Los de la nube', value: true }, { label: 'Los de este dispositivo', value: false }],
            );
            if (useCloud) applyRemote(cloud);
            sync.rev = remote.rev;
            sync.dirty = !useCloud;
          } else {
            sync.dirty = true; // cuenta vacía: se suben los datos de aquí
          }
          saveSync();
          await syncNow({ interactive: true });
          showToast('Dispositivo conectado a tu cuenta.');
        }
        closeSheet();
      } catch (e) {
        console.warn(e);
        if (mode === 'login') sync = load(SYNC_KEY, null);
        err.textContent = syncErrorText(e);
        btn.disabled = false;
        btn.textContent = mode === 'create' ? 'Crear cuenta' : 'Entrar';
      }
    });
  };

  if (sync) renderConnected();
  else renderForm();
}

// ---------- Vínculo con UnderCTRL ----------
// PayCTRL lee los datos de UnderCTRL (planes de pensiones, acciones vendidas, dividendos, fondos,
// crypto y la nómina prevista en sus proyecciones) para el simulador de la Renta. Hace falta la
// nube activada en las dos apps con el mismo usuario; la contraseña de UnderCTRL se pide una vez
// para derivar aquí sus claves (nunca se guarda). Las personas se emparejan por su nombre.
const LINK_KEY = 'nominas:link';
const LINK_DATA_KEY = 'nominas:linkData';
let link = load(LINK_KEY, null);         // { username, user, auth, key }
let linkData = load(LINK_DATA_KEY, null); // { at, people: { nombre normalizado: extracto } }
let linkError = '';
let linkBusy = false;
const normName = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

async function derivePeerAccount(username, password) {
  const u = username.trim().toLowerCase();
  const base = await crypto.subtle.importKey('raw', utf8.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = (salt) => crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: utf8.encode(salt), iterations: PBKDF2_ITERATIONS }, base, 256);
  const [auth, key] = await Promise.all([bits(`finanzas-auth:${u}`), bits(`finanzas-enc:${u}`)]);
  return { username: u, user: await sha256hex(`finanzas-user:${u}`), auth: hex(auth), key: toB64(key) };
}
async function decryptWith(keyB64, blob) {
  const k = await crypto.subtle.importKey('raw', fromB64(keyB64), 'AES-GCM', false, ['decrypt']);
  const [iv, ct] = blob.split('.');
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, k, fromB64(ct))));
}
const linkErrorText = (err) => ({
  'peer-missing': 'No se encuentra tu cuenta de UnderCTRL en la nube. Comprueba que el usuario es el mismo y que las dos apps usan la misma base de datos en Vercel.',
  'peer-auth': 'La contraseña de UnderCTRL no es correcta.',
  'too-many': 'Demasiados intentos. Espera 15 minutos.',
}[err.message] || syncErrorText(err));

// Solo lo que necesita el simulador, por persona.
function extractFinance(fin) {
  const people = {};
  for (const p of fin?.profiles ?? []) {
    const c = p.cats ?? {};
    const movs = (i) => (i.movements ?? []).map((m) => ({ type: m.type, date: m.date || '', amount: Number(m.amount) || 0, company: Number(m.company) || 0 }));
    const nomina = {};
    for (const proj of c.projections ?? []) {
      for (const row of proj.income ?? []) {
        if (!/n[oó]mina|sueldo|salario/i.test(row.name || '')) continue;
        Object.entries(row.v ?? {}).forEach(([m, v]) => {
          const mi = Number(m);
          const ym = `${(Number(proj.startYear) || 0) + Math.floor(mi / 12)}-${String((mi % 12) + 1).padStart(2, '0')}`;
          nomina[ym] = round2((nomina[ym] || 0) + (Number(v) || 0));
        });
      }
    }
    people[normName(p.name)] = {
      name: p.name,
      pensions: (c.pensions ?? []).map((i) => ({ id: i.id, name: i.name, planType: i.planType === 'company' ? 'company' : 'personal', movements: movs(i) })),
      sold: (c.stocks ?? []).filter((i) => i.sellDate || i.sellPrice).map((i) => ({
        id: i.id, name: i.name || i.fullName || i.ticker, qty: Number(i.qty) || 0, currency: i.currency || 'EUR',
        buyDate: i.buyDate || '', buyPrice: Number(i.buyPrice) || 0, fiscalPrice: Number(i.fiscalPrice) || 0,
        sellDate: i.sellDate || '', sellPrice: Number(i.sellPrice) || 0, buyFx: Number(i.buyFx) || 0, sellFx: Number(i.sellFx) || 0,
      })),
      // Bruto y retenciones (% en el país de origen y en España, UnderCTRL ≥ 1.34.0)
      dividends: (p.dividends ?? []).map((d) => {
        const total = round2((Number(d.qty) || 0) * (Number(d.perShare) || 0));
        return { name: d.name || d.ticker, date: d.date || '', total,
          origin: round2((total * (Number(d.whOrigin) || 0)) / 100), local: round2((total * (Number(d.whLocal) || 0)) / 100) };
      }),
      funds: (c.funds ?? []).map((i) => ({ id: i.id, name: i.name, amount: Number(i.amount) || 0, movements: movs(i) })),
      crypto: (c.crypto ?? []).map((i) => ({ id: i.id, name: i.name || i.fullName, amount: Number(i.amount) || 0, movements: movs(i) })),
      nomina,
    };
  }
  return people;
}

async function refreshLink({ interactive = false } = {}) {
  if (!sync || !link || linkBusy) return false;
  linkBusy = true;
  try {
    const out = await syncCall('peer-pull', { peer: { user: link.user, auth: link.auth } });
    linkData = { at: Date.now(), people: out.blob ? extractFinance(await decryptWith(link.key, out.blob)) : {} };
    save(LINK_DATA_KEY, linkData);
    linkError = '';
    if (unlocked && screen === 'sim') render();
    return true;
  } catch (err) {
    console.warn(err);
    linkError = linkErrorText(err);
    if (interactive) showToast(linkError, { warn: true });
    return false;
  } finally {
    linkBusy = false;
  }
}
const finPerson = (p) => linkData?.people?.[normName(p.name)] ?? null;

function openLinkSheet() {
  const back = newSheet();
  if (!sync) {
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Vincular con UnderCTRL">
        <h2 class="sheet-title">Vincular con UnderCTRL</h2>
        <p class="muted small">Primero activa la <b>sincronización en la nube</b> (menú ⋯) con el mismo usuario que usas en UnderCTRL.</p>
        <div class="body-actions"><span></span><button class="text-btn done-btn l-sync" type="button">Ir a la nube</button></div>
      </div>`;
    back.querySelector('.l-sync').addEventListener('click', openSyncSheet);
    return;
  }
  const names = Object.values(linkData?.people ?? {}).map((x) => x.name);
  back.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Vincular con UnderCTRL">
      <h2 class="sheet-title">Vincular con UnderCTRL</h2>
      ${link ? `
      <p>Vinculado como <b>${esc(link.username)}</b></p>
      <p class="muted small">${linkError ? esc(linkError) : linkData?.at ? `Datos de UnderCTRL del ${new Date(linkData.at).toLocaleString(LOCALE, { dateStyle: 'short', timeStyle: 'short' })}` : 'Pendiente'}</p>
      ${names.length ? `<p class="muted small">Personas en UnderCTRL: ${names.map(esc).join(', ')}. Se emparejan por el nombre con las de PayCTRL.</p>` : ''}
      <div class="choice-list">
        <button class="text-btn done-btn l-now" type="button">${icon('refresh', 16)} Actualizar ahora</button>
        <button class="text-btn l-off" type="button">Desvincular</button>
        <button class="text-btn l-close" type="button">Cerrar</button>
      </div>` : `
      <p class="muted small">El simulador de la Renta leerá de UnderCTRL tus planes de pensiones, acciones vendidas, dividendos, fondos y la nómina prevista en tus proyecciones. Usa la cuenta de la nube <b>${esc(sync.username)}</b>: introduce la contraseña de UnderCTRL de ese mismo usuario (no se guarda).</p>
      <label class="field"><span>Contraseña de UnderCTRL</span><input class="l-pass" type="password" autocomplete="current-password" maxlength="128"></label>
      <p class="error l-err" role="alert"></p>
      <div class="body-actions">
        <button class="text-btn l-cancel" type="button">Cancelar</button>
        <button class="text-btn done-btn l-go" type="button">Vincular</button>
      </div>`}
    </div>`;
  const q = (sel) => back.querySelector(sel);
  q('.l-close')?.addEventListener('click', closeSheet);
  q('.l-cancel')?.addEventListener('click', closeSheet);
  q('.l-now')?.addEventListener('click', async () => { await refreshLink({ interactive: true }); openLinkSheet(); });
  q('.l-off')?.addEventListener('click', () => {
    link = null; linkData = null; linkError = '';
    try { localStorage.removeItem(LINK_KEY); localStorage.removeItem(LINK_DATA_KEY); } catch {}
    closeSheet(); render();
    showToast('Desvinculado de UnderCTRL.');
  });
  q('.l-go')?.addEventListener('click', async () => {
    const pass = q('.l-pass').value;
    if (!pass) return void (q('.l-err').textContent = 'Introduce la contraseña.');
    const btn = q('.l-go');
    btn.disabled = true; btn.textContent = 'Un momento…';
    link = await derivePeerAccount(sync.username, pass);
    if (await refreshLink()) {
      save(LINK_KEY, link);
      closeSheet(); render();
      showToast('Vinculado con UnderCTRL.');
    } else {
      q('.l-err').textContent = linkError;
      link = load(LINK_KEY, null);
      btn.disabled = false; btn.textContent = 'Vincular';
    }
  });
  q('.l-pass')?.focus();
}

function openInfoSheet() {
  closeSheet();
  const back = document.createElement('div');
  back.className = 'sheet-backdrop center';
  back.innerHTML = `
    <div class="sheet info-sheet" role="dialog" aria-modal="true" aria-label="Información">
      <span class="install-logo">${logoSVG(56)}</span>
      <h2 class="sheet-title">PayCTRL</h2>
      <p class="small muted">Versión ${APP_VERSION} · by OmT Finance</p>
      <p class="small">Guarda tus nóminas con su PDF y entiende cada línea: bruto, retenciones, Seguridad Social y neto. También lee el certificado de retenciones y la declaración de la Renta.</p>
      <p class="small muted">Tus nóminas se guardan en este dispositivo. Con la sincronización en la nube activada, se cifran en tu dispositivo antes de subirse.</p>
      <div class="info-actions"><button type="button" class="done-btn" data-close>Cerrar</button></div>
    </div>`;
  document.body.append(back);
  back.addEventListener('click', (e) => { if (e.target === back) closeSheet(); });
  back.querySelector('[data-close]').addEventListener('click', closeSheet);
}

// ---------- Opciones de visualización ----------
const WALLS = {
  jade: { name: 'Jade', c: ['13 148 136', '16 185 129', '34 211 238', '101 163 13'] },
  ocean: { name: 'Océano', c: ['8 145 178', '37 99 235', '20 184 166', '79 70 229'] },
  forest: { name: 'Bosque', c: ['22 163 74', '101 163 13', '13 148 136', '180 130 20'] },
  sunset: { name: 'Atardecer', c: ['234 88 12', '190 24 93', '147 51 234', '217 119 6'] },
};
const lightQuery = matchMedia('(prefers-color-scheme: light)');
let display = { theme: 'auto', wall: 'jade', ...load(DISPLAY_KEY, {}) };
function applyDisplay() {
  const light = display.theme === 'light' || (display.theme === 'auto' && lightQuery.matches);
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  document.documentElement.dataset.wall = WALLS[display.wall] ? display.wall : 'jade';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f0f8f5' : '#07120f');
}
lightQuery.addEventListener?.('change', () => { if (display.theme === 'auto') applyDisplay(); });
function wallPreview(key) {
  const [c1, c2, c3, c4] = WALLS[key].c;
  const light = document.documentElement.dataset.theme === 'light';
  const a = light ? 0.3 : 0.45;
  const base = light ? '#f0f8f5' : '#07120f';
  return `radial-gradient(70% 60% at 15% 10%, rgb(${c1} / ${a}), transparent 70%), radial-gradient(60% 55% at 90% 25%, rgb(${c2} / ${a * 0.8}), transparent 72%),
    radial-gradient(70% 60% at 75% 95%, rgb(${c3} / ${a * 0.85}), transparent 70%), radial-gradient(60% 55% at 5% 85%, rgb(${c4} / ${a * 0.8}), transparent 72%), ${base}`;
}
function openDisplaySheet() {
  const back = newSheet();
  const draw = () => {
    back.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Opciones de visualización">
        <h2 class="sheet-title">Opciones de visualización</h2>
        <p class="opt-label">Modo</p>
        <div class="seg full" role="group" aria-label="Modo">
          ${[['dark', 'Oscuro'], ['light', 'Claro'], ['auto', 'Automático']].map(([v, l]) =>
            `<button type="button" data-theme-opt="${v}" class="${display.theme === v ? 'on' : ''}">${l}</button>`).join('')}
        </div>
        <p class="muted small">${display.theme === 'auto' ? 'Sigue el modo claro u oscuro del sistema.' : '&nbsp;'}</p>
        <p class="opt-label">Fondo</p>
        <div class="walls">
          ${Object.entries(WALLS).map(([k, w]) =>
            `<button type="button" class="wall ${display.wall === k ? 'on' : ''}" data-wall-opt="${k}" style="background:${wallPreview(k)}" aria-pressed="${display.wall === k}">${w.name}</button>`).join('')}
        </div>
        <div class="body-actions"><span></span><button class="text-btn done-btn d-close" type="button">Listo</button></div>
      </div>`;
    back.querySelectorAll('[data-theme-opt]').forEach((b) => b.addEventListener('click', () => {
      display.theme = b.dataset.themeOpt; save(DISPLAY_KEY, display); applyDisplay(); draw();
    }));
    back.querySelectorAll('[data-wall-opt]').forEach((b) => b.addEventListener('click', () => {
      display.wall = b.dataset.wallOpt; save(DISPLAY_KEY, display); applyDisplay(); draw();
    }));
    back.querySelector('.d-close').addEventListener('click', closeSheet);
  };
  draw();
}

// ---------- Avisos ----------
let toastTimer = 0;
function showToast(msg, { warn = false, action = null } = {}) {
  const t = $('toast');
  t.replaceChildren(document.createTextNode(msg));
  if (action) {
    const b = document.createElement('button');
    b.className = 'toast-action';
    b.textContent = action.label;
    b.addEventListener('click', () => { t.hidden = true; action.run(); });
    t.append(b);
  }
  t.classList.toggle('warn', warn);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, action ? 15000 : warn ? 9000 : 4000);
}

// ---------- Privacidad ----------
function setPrivate(on) {
  document.body.classList.toggle('private', on);
  const label = on ? 'Mostrar importes' : 'Ocultar importes';
  $('toggle-privacy').setAttribute('aria-label', label);
  $('toggle-privacy').title = label;
  save(PRIVACY_KEY, on);
  if (unlocked) render();
}

// ---------- Inicio ----------
$('back-btn').addEventListener('click', back);
$('toggle-privacy').addEventListener('click', () => setPrivate(!isPrivate()));
$('undo-btn').addEventListener('click', undo);
$('menu-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  if ($('menu').hidden) openMenu();
  else closeMenu();
});
['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) =>
  document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('click', (e) => { if (!e.target.closest('#menu')) closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMenu(); closeSheet(); closeViewer(); } });

// Difuminado del contenido bajo la barra superior (igual que en UnderCTRL).
const FADE_PX = 48;
let fadeFrame = 0;
function updateFade() {
  fadeFrame = 0;
  const bar = document.querySelector('.topbar');
  const view = $('view');
  if (!bar || document.body.classList.contains('locked')) {
    view.style.removeProperty('--fade-a');
    view.style.removeProperty('--fade-b');
    return;
  }
  const settle = (FADE_PX * (20 - Math.min(window.scrollY, 20))) / 20;
  const viewTop = view.getBoundingClientRect().top;
  const a = bar.getBoundingClientRect().bottom - viewTop - 14 - settle;
  view.style.setProperty('--fade-a', `${Math.round(a)}px`);
  const pbar = $('profilebar');
  if (pbar.hidden) view.style.removeProperty('--fade-b');
  else view.style.setProperty('--fade-b', `${Math.round(pbar.getBoundingClientRect().top - viewTop)}px`);
}
const scheduleFade = () => { if (!fadeFrame) fadeFrame = requestAnimationFrame(updateFade); };
window.addEventListener('scroll', () => { closeMenu(); scheduleFade(); }, { passive: true });
window.addEventListener('resize', scheduleFade, { passive: true });

const vv = window.visualViewport;
function fitToKeyboard() {
  if (!vv) return;
  const root = document.documentElement.style;
  root.setProperty('--vv-top', `${Math.round(vv.offsetTop)}px`);
  root.setProperty('--vv-h', `${Math.round(vv.height)}px`);
  document.body.classList.toggle('kb-open', window.innerHeight - vv.height > 120);
}
if (vv) {
  vv.addEventListener('resize', fitToKeyboard);
  vv.addEventListener('scroll', fitToKeyboard);
  fitToKeyboard();
}

applyDisplay();
buildTabbar();
updateUndoBtn();
setPrivate(load(PRIVACY_KEY, false));
go('lock');
// La espera cuenta desde que la animación del logo empieza de verdad (al pintarse la pantalla, que en
// un arranque lento puede ser tarde), así la transición siempre llega con el destello ya apagado.
// Si la animación no llega a arrancar (pestaña oculta…), se entra igualmente un poco después.
if (effectiveLevel() === 'none') {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ring = $('view').querySelector('.lockscreen .lg-ring');
  let started = false;
  const enter = () => { if (autoEntry) autoEnter(); };
  ring?.addEventListener('animationstart', () => { started = true; setTimeout(enter, reduced ? 1200 : SPLASH_HOLD_MS - 50); }, { once: true });
  setTimeout(() => { if (!started) enter(); }, reduced ? 1200 : SPLASH_HOLD_MS + 1500);
} else autoEntry = false;
// Con la nube activada: sincroniza al abrir y luego cada 3 minutos (solo con la app a la vista).
if (sync) syncNow();
setInterval(() => { if (sync && !document.hidden) syncNow(); }, SYNC_EVERY_MS);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
