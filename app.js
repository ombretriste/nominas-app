'use strict';

// ---------- Configuración ----------
// Versión de la app (se ve en la pantalla de inicio). Arreglos y ajustes: 1.0.x; novedades: 1.x.0.
const APP_VERSION = '0.2.0';
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
  summary: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  payslips: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.5 12.5h7M8.5 16h4.5"/>',
  concepts: '<path d="M4 6.5h16M4 12h16M4 17.5h10"/><circle cx="18.5" cy="17.5" r="2"/>',
  evolution: '<path d="M4.5 20v-5M9.5 20v-8M14.5 20v-5.5M19.5 20V9"/><path d="M4.5 11l5-4.5 5 3 5-5"/>',
  documents: '<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  renta: '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
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
  { key: 'documents', label: 'Documentos', color: '#a3e635' },
];
const screenByKey = Object.fromEntries(SCREENS.map((s) => [s.key, s]));
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
  };
}
// Concepto de una nómina. type: 'dev' (abono), 'ded' (descuento), 'info' (solo base de cotización
// o pago en especie: no se cobra) o 'emp' (aportación de la empresa). cat (descuentos): irpf, ss u other.
function normConcept(k) {
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
const ACRONYMS = ['IRPF', 'PP', 'ESOP', 'AT', 'S.S.', 'TR'];
function prettyName(s) {
  s = s.replace(/\s+/g, ' ').trim();
  if (/[a-zá-ú]/.test(s)) return s; // ya viene en minúsculas y mayúsculas
  const out = s.toLowerCase().replace(/^./, (c) => c.toUpperCase());
  return out.split(' ').map((w) => ACRONYMS.find((a) => a.toLowerCase() === w) ?? w).join(' ');
}
const NUM_RE = /^\d{1,3}(?:\.\d{3})*,\d{2}-?$/;
const pdfNum = (s) => { const n = parseAmount(s.replace(/-$/, '')); return s.endsWith('-') ? -n : n; };
const MONTH_RE = new RegExp(`\\b(${MONTHS.join('|')})\\b`, 'i');

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
      abono: colOf(head(/^ABONOS$/)), base: colOf(head(/^INCIDE/)),
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
      const m = line.match(/^(?:([A-D]\d?)\s+)?(\/?[0-9A-Z]{3,4})\s+(.+?)\s+(\d{2}\/\d{4})(?:\s|$)/);
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
      else { type = code === '/399' ? 'emp' : 'info'; amount = last; }
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
  // Periodo: «Enero (01.01.2026 a 31.01.2026)» o «Extra Julio 2026»
  let year, month, kind = 'monthly';
  const extra = text.match(new RegExp(`Extra\\s+(${MONTHS.join('|')})\\s+(\\d{4})`, 'i'));
  const period = text.match(new RegExp(`(${MONTHS.join('|')})\\s*\\(\\d{2}\\.(\\d{2})\\.(\\d{4})`, 'i'));
  if (extra) { kind = 'extra'; month = MONTHS.indexOf(extra[1].toLowerCase()) + 1; year = Number(extra[2]); }
  else if (period) { month = Number(period[2]); year = Number(period[3]); }
  else {
    const mm = text.match(MONTH_RE);
    month = mm ? MONTHS.indexOf(mm[1].toLowerCase()) + 1 : null;
    year = Number(text.match(/\b(20\d{2})\b/)?.[1]) || null;
  }
  const liq = text.match(/L[ÍI]QUIDO A PERCIBIR[ .…]*€\s*(\d{1,3}(?:\.\d{3})*,\d{2})/i);
  const company = text.match(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ][\wÁÉÍÓÚÑáéíóúñ&.\- ]{0,60}?,?\s+S\.(?:A|L)\.(?:U\.)?)/)?.[1]?.trim() || '';
  return {
    year, month, kind, company,
    liquid: liq ? parseAmount(liq[1]) : 0, // sin cifra (p. ej. abril con acciones): líquido 0
    irpfPct: concepts.find((k) => k.cat === 'irpf')?.qty ?? null,
    concepts,
  };
}
function normData(d) {
  const profiles = Array.isArray(d?.profiles) && d.profiles.length ? d.profiles : [{ name: 'Yo' }];
  return {
    profiles: profiles.map((p, i) => ({
      id: p.id || uid(),
      name: p.name || `Persona ${i + 1}`,
      color: p.color || PROFILE_COLORS[i % PROFILE_COLORS.length],
      slips: (p.slips || []).map(normSlip),
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
  const ys = new Set(allSlips(profiles).map((s) => s.year));
  ys.add(new Date().getFullYear());
  return [...ys].sort((a, b) => b - a);
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
  if (!unlocked) return;
  if (document.hidden) session.mark();
  else if (session.get() || effectiveLevel() === 'none') session.mark();
  else lockApp();
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
  navScrollY = window.scrollY;
  navDir = dir;
  screen = next;
  closeMenu();
  window.scrollTo(0, 0);
  render();
}
// Volver un nivel: nómina → Nóminas → Resumen.
function back() {
  go(screen.startsWith('slip:') ? 'payslips' : 'summary', 'back');
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
  const tabKey = slip ? 'payslips' : screen;
  $('tabbar').querySelectorAll('.tab').forEach((b) => b.toggleAttribute('aria-current', b.dataset.tab === tabKey));

  const el = locked ? renderLock()
    : screen === 'summary' ? renderSummary()
    : slip ? renderSlip(slip.s, slip.p)
    : screen === 'payslips' ? renderPayslips()
    : screen === 'concepts' ? renderConcepts()
    : screen === 'renta' ? renderRenta()
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
  { label: 'Administrar perfiles', icon: 'users', run: () => openProfilesSheet() },
  { label: 'Opciones de visualización', icon: 'palette', run: () => openDisplaySheet() },
  { label: 'Importar/exportar copia', icon: 'swap', run: () => openBackupSheet() },
  { label: 'Nivel de seguridad', icon: 'shield', run: () => openSecuritySheet() },
  { label: 'Bloquear', icon: 'lock', run: () => lockApp() },
];
function openPopover(anchor, items) {
  const menu = $('menu');
  menu.innerHTML = items.map((m, i) =>
    `<button class="menu-item ${m.danger ? 'danger' : ''}" role="menuitem" data-i="${i}">${icon(m.icon, 20)}<span>${m.label}</span></button>`).join('');
  menu.querySelectorAll('.menu-item').forEach((b) => b.addEventListener('click', () => {
    closeMenu();
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
      <circle cx="60" cy="60" r="52" stroke="url(#omt-g)" stroke-width="1.2"/>
      <circle cx="60" cy="60" r="42" stroke="url(#omt-g)" stroke-width=".8" stroke-dasharray="2 5" opacity=".6"/>
      <path d="M44 33 H68 L78 43 V87 H44 Z" stroke="url(#omt-g)" stroke-width="1.6"/>
      <path d="M68 33 V43 H78" stroke="url(#omt-g)" stroke-width="1.6"/>
      <path d="M51 54 H71 M51 62 H71 M51 70 H63" stroke="url(#omt-g)" stroke-width="1.6"/>
      <circle cx="51" cy="79" r="2.2" fill="#22d3ee" stroke="none"/>
      <circle cx="58" cy="79" r="2.2" fill="#34d399" stroke="none"/>
    </svg>`;
}

function renderLock() {
  const el = document.createElement('div');
  el.className = 'lockscreen';
  const level = effectiveLevel();
  const glyph = level === 'none' ? ENTER_GLYPH
    : level === 'pin' ? KEYPAD_GLYPH
    : isIPhone ? FACE_GLYPH : (isAndroid || isIPad || !isWindows) ? FINGER_GLYPH : LOCK_GLYPH;
  const label = level === 'none' ? 'Entrar' : level === 'pin' ? 'Entrar con código' : `Entrar con ${BIO}`;
  el.innerHTML = `
    <div class="ls-top">
      ${logoSVG()}
      <div class="brand-mark"><span class="bm-omt">Pay<b>CTRL</b></span><span class="bm-by">by OmT Finance</span></div>
    </div>
    <div class="ls-bottom">
      <button class="ls-unlock" type="button" aria-label="${esc(label)}">
        <svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph}</svg>
      </button>
      <p class="ls-label">${esc(label)}</p>
    </div>
    <p class="ls-version">Versión ${APP_VERSION}</p>`;
  const btn = el.querySelector('.ls-unlock');
  btn.addEventListener('click', async () => {
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
function yearSelector() {
  const ys = yearsWithData().slice(0, 4);
  if (!ys.includes(selYear)) selYear = ys[0];
  return `<div class="seg full year-seg" role="group" aria-label="Año">${ys.map((y) =>
    `<button type="button" data-year="${y}" class="${y === selYear ? 'on' : ''}">${y}</button>`).join('')}</div>`;
}
function bindYearSelector(el) {
  el.querySelectorAll('[data-year]').forEach((b) => b.addEventListener('click', () => {
    selYear = Number(b.dataset.year);
    render();
  }));
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
  const docs = allSlips(profiles).filter((s) => s.file).length;
  const blockValue = {
    payslips: money(t.net),
    concepts: '',
    renta: '',
    evolution: '',
    documents: `<span class="muted">${docs}</span>`,
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
  '0096': { name: 'Antigüedad de la paga extra' },
  '2770': { name: 'Ajuste por incremento del seguro de vida' },
  '2193': { name: 'Importe a cuenta' },
  '2142': { name: 'Complemento por resultado' },
  '214D': { name: 'Complemento por resultado (paga de Navidad)' },
  '214J': { name: 'Complemento por resultado (paga de julio)' },
  '0414': { name: 'Gratificación de julio (paga extra)' },
  '5516': { name: 'Horas de conflicto laboral' },
  '5599': { name: 'Horas de conflicto laboral (no cotizan)' },
  '0500': { name: 'Descuento de horas de falta en la paga extra' },
  '3170': { name: 'Reparto de beneficios' },
  // Descuentos
  '/398': { name: 'Cotización a la Seguridad Social' },
  '/401': { name: 'Retención de IRPF' },
  '2350': { name: 'Aportación al plan de pensiones (tuya)', renta: 'ppEmp' },
  '2907': { name: 'Cuota sindical', renta: 'union' },
  '3760': { name: 'Compra de acciones (ESOP)' },
  '3917': { name: 'Descuento Grupo de Empresa' },
  '/561': { name: 'Crédito (saldo que pasa al mes siguiente)' },
  '/563': { name: 'Pendiente del mes anterior' },
  // Solo base de cotización / en especie
  '/34C': { name: 'Prorrata de pagas extra' },
  '234C': { name: 'Prorrata del reparto de beneficios' },
  '5220': { name: 'Comedor', especie: true },
  '2310': { name: 'Seguro de accidentes y RC', especie: true },
  '2772': { name: 'Seguro de vida', especie: true },
  '3310': { name: 'Acciones', especie: true },
  '3352': { name: 'Aportación de la empresa al plan de pensiones', especie: true, renta: 'ppCo' },
  '3354': { name: 'Reparto lineal' },
  '777E': { name: 'Seguro médico de empresa', especie: true },
  '778E': { name: 'Seguro médico (base de Seguridad Social)' },
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
  const check = s.liquid != null && has
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
    <section class="group"><h2>Conceptos</h2><div class="list ts-list"><p class="empty muted small">Sin desglose: sube el PDF de la nómina y se leerán sus conceptos.</p></div></section>`}
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
  el.querySelector('[data-file]')?.addEventListener('click', () => openFile(s));
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
  const done = [], skipped = [], manual = [];
  showToast(`Leyendo ${list.length === 1 ? 'la nómina' : `${list.length} nóminas`}…`);
  const parsed = [];
  for (const f of list) {
    let r = null;
    if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) {
      try { r = await readPayslipPdf(f); } catch (e) { console.warn(e); }
    }
    if (!r || !r.year || !r.month) { manual.push(f); continue; }
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
    skipped.length ? `ya estaban: ${skipped.join(', ')}` : '',
  ].filter(Boolean).join(' · ');
  if (msg) showToast(msg, { warn: !done.length });
  if (manual.length === 1) {
    openSlipSheet(null, owner, manual[0]);
  } else if (manual.length > 1) {
    showToast(`${manual.length} archivos no se pudieron leer: ${manual.map((f) => f.name).join(', ')}. Súbelos de uno en uno para meterlos a mano.`, { warn: true });
  }
  if (done.length === 1 && !manual.length) go(`slip:${done[0].id}`, 'forward');
  else if (done.length) go('payslips', screen === 'payslips' ? null : 'forward');
}

// Ventana para subir (elegir PDF) o editar a mano una nómina.
function openSlipSheet(existing = null, owner = currentProfile(), pendingFile = null) {
  if (!owner) return;
  const now = new Date();
  const s = existing ? { ...existing } : normSlip({ year: now.getFullYear(), month: now.getMonth() + 1 });
  let pickedFile = pendingFile;
  const back = newSheet();
  back.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${existing ? 'Editar nómina' : 'Subir nóminas'}">
      <h2 class="sheet-title">${existing ? 'Editar nómina' : pendingFile ? 'Nómina a mano' : 'Subir nóminas'}</h2>
      ${existing || pendingFile ? '' : `
      <label class="add-btn file-pick main-pick">${icon('upload', 18)} <span>Elegir PDF de nóminas</span>
        <input type="file" class="multi-pick" accept="application/pdf,image/*" multiple hidden>
      </label>
      <p class="muted small">Puedes elegir varias a la vez: se leen solas (mes, paga extra, empresa y todos los conceptos). Si alguna no se puede leer, podrás meterla a mano.</p>
      <p class="opt-label">O a mano</p>`}
      ${pendingFile ? `<p class="muted small">No se ha podido leer «${esc(pendingFile.name)}». Rellena los importes y se guardará con el archivo.</p>` : ''}
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
  q('.f-cancel').addEventListener('click', closeSheet);
  q('.f-save').addEventListener('click', async () => {
    const year = Number(q('.f-year').value);
    if (!(year >= 1990 && year <= 2100)) return void (q('.f-err').textContent = 'Revisa el año.');
    s.year = year;
    s.month = Number(q('.f-month').value);
    s.company = q('.f-company').value.trim();
    if (!s.concepts.length) {
      s.gross = val('.f-gross'); s.irpf = val('.f-irpf'); s.ss = val('.f-ss'); s.other = val('.f-other');
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
  });
}

// ---------- Visor del documento ----------
let viewerUrl = null;
async function openFile(s) {
  let blob = null;
  try { blob = await files.get(s.file.id); } catch {}
  if (!blob) return showToast('El archivo no está en este dispositivo.', { warn: true });
  closeViewer();
  viewerUrl = URL.createObjectURL(blob);
  const isImg = (s.file.type || blob.type).startsWith('image/');
  const v = document.createElement('div');
  v.className = 'sheet-backdrop doc-viewer';
  v.innerHTML = `
    <div class="sheet doc-sheet" role="dialog" aria-modal="true" aria-label="${esc(s.file.name)}">
      <div class="doc-head">
        <h2 class="sheet-title">${esc(slipTitle(s))}</h2>
        <button class="icon-btn doc-close" type="button" aria-label="Cerrar">${icon('plus', 20).replace('M12 5v14M5 12h14', 'M6 6l12 12M18 6L6 18')}</button>
      </div>
      <div class="doc-body">${isImg ? `<img src="${viewerUrl}" alt="${esc(s.file.name)}">` : `<iframe src="${viewerUrl}" title="${esc(s.file.name)}"></iframe>`}</div>
      <div class="body-actions">
        <a class="text-btn" href="${viewerUrl}" download="${esc(s.file.name)}">Descargar</a>
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
function rentaData(slips) {
  const ks = yearConcepts(slips);
  const by = (fn) => sumBy(ks.filter(fn), (k) => k.amount);
  const t = aggregate(slips);
  const year = slips[0]?.year;
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
  };
}
function renderRenta() {
  const slips = slipsOfYear(selYear, viewProfiles());
  const r = rentaData(slips);
  const row = (label, v, note = '', neg = false) => `
    <div class="cat-row"><span class="cat-name">${label}${note ? `<small class="muted">${note}</small>` : ''}</span><span class="amount ${neg && v ? 'neg' : ''}">${money(neg ? -v : v)}</span></div>`;
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero">
      <p class="label">Rendimientos del trabajo ${selYear}</p>
      <p class="net amount">${money(r.gross + r.especie + r.ppCo)}</p>
      <p class="muted small">Dinerarios + en especie + aportación de la empresa al plan, según tus nóminas.</p>
    </section>
    <section class="summary">
      <div class="pill"><span class="label">Retenciones IRPF</span><span class="amount neg">${money(-r.irpf)}</span></div>
      <div class="pill"><span class="label">Seguridad Social</span><span class="amount neg">${money(-r.ss)}</span></div>
    </section>
    ${yearSelector()}
    <section class="group"><h2>Ingresos</h2><div class="list ts-list">
      ${row('Retribuciones dinerarias', r.gross, 'Todos los abonos de las nóminas')}
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
    <p class="muted small amort-note">Referencia calculada con tus nóminas. Compárala con el certificado de retenciones de la empresa antes de presentar la declaración.</p>`;
  bindYearSelector(el);
  return el;
}

// ---------- Evolución ----------
// Neto de cada mes (el gráfico) y la tabla por años con su variación sobre el anterior.
function monthSeries(profiles) {
  const m = new Map();
  allSlips(profiles).forEach((s) => {
    const k = `${s.year}-${String(s.month).padStart(2, '0')}`;
    m.set(k, (m.get(k) || 0) + slipTotals(s).net);
  });
  return [...m].sort((a, b) => a[0].localeCompare(b[0])).map(([month, net]) => ({ month, net: round2(net) }));
}
function evolutionChart(series) {
  if (series.length < 2) return '<p class="muted small hist-empty">El gráfico aparecerá cuando haya al menos dos meses.</p>';
  const W = 320, H = 130, P = 6;
  const vals = series.map((s) => s.net);
  let min = Math.min(0, ...vals), max = Math.max(...vals);
  if (min === max) max += 1;
  const idx = (m) => Number(m.slice(0, 4)) * 12 + Number(m.slice(5, 7));
  const t0 = idx(series[0].month);
  const span = Math.max(1, idx(series.at(-1).month) - t0);
  const x = (i) => P + ((idx(series[i].month) - t0) * (W - 2 * P)) / span;
  const y = (v) => P + (H - 2 * P) * (1 - (v - min) / (max - min));
  const pts = series.map((s, i) => `${x(i).toFixed(1)},${y(s.net).toFixed(1)}`).join(' ');
  const area = `${P},${H - P} ${pts} ${W - P},${H - P}`;
  const label = (m) => `${MONTHS_SHORT[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`;
  return `
    <svg class="hist-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="Evolución del neto mensual">
      <defs>
        <linearGradient id="hist-line" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".55" stop-color="#34d399"/><stop offset="1" stop-color="#bef264"/></linearGradient>
        <linearGradient id="hist-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#34d399" stop-opacity=".28"/><stop offset="1" stop-color="#34d399" stop-opacity="0"/></linearGradient>
      </defs>
      <polygon points="${area}" fill="url(#hist-fill)"/>
      <polyline points="${pts}" fill="none" stroke="url(#hist-line)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
    <div class="hist-axis"><span class="muted small">${label(series[0].month)}</span><span class="muted small">${label(series.at(-1).month)}</span></div>`;
}
function renderEvolution() {
  const profiles = viewProfiles();
  const series = monthSeries(profiles);
  const years = yearsWithData(profiles).filter((y) => slipsOfYear(y, profiles).length);
  const byYear = years.map((y) => ({ y, ...aggregate(slipsOfYear(y, profiles)) }));
  const cur = byYear[0];
  // El año en curso se compara con los mismos meses del anterior (enero → último mes con nómina).
  const lastM = cur ? Math.max(...slipsOfYear(cur.y, profiles).map((s) => s.month)) : 12;
  const prev = byYear[1] && byYear[1].y === cur.y - 1
    ? aggregate(slipsOfYear(cur.y - 1, profiles).filter((s) => s.month <= lastM)) : null;
  const period = lastM < 12 ? `ene–${MONTHS_SHORT[lastM - 1]} ${cur.y - 1}` : String(cur?.y - 1);
  const diffCls = (v) => (isPrivate() || !v ? '' : v > 0 ? 'pos' : 'neg');
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero compact">
      <p class="label">Neto ${cur ? cur.y : new Date().getFullYear()}</p>
      <p class="net amount">${money(cur?.net)}</p>
    </section>
    <section class="summary hist-pills">
      <div class="pill"><span class="label">Neto vs. ${prev ? period : 'año anterior'}</span><span class="amount ${prev ? diffCls(cur.net - prev.net) : ''}">${prev ? money(cur.net - prev.net, true) : '—'}</span></div>
      <div class="pill"><span class="label">Bruto vs. ${prev ? period : 'año anterior'}</span><span class="amount ${prev ? diffCls(cur.gross - prev.gross) : ''}">${prev ? money(cur.gross - prev.gross, true) : '—'}</span></div>
    </section>
    <section class="group hist-chart-wrap"><div class="list hist-chart-box">${evolutionChart(series)}</div></section>
    <section class="group">
      <h2>Por años</h2>
      <ul class="movs amort hist-list">
        <li class="mv-year open"><div class="amort-rows">
          <div class="amort-cols evo-cols"><span>Año</span><span>Bruto</span><span>IRPF</span><span>Neto</span><span>Variación</span></div>
          ${byYear.map((r, i) => {
            // Año sin terminar: variación frente a los mismos meses del anterior.
            const lm = Math.max(...slipsOfYear(r.y, profiles).map((x) => x.month));
            const base = byYear[i + 1]?.y === r.y - 1 ? aggregate(slipsOfYear(r.y - 1, profiles).filter((x) => x.month <= lm)) : null;
            const d = base ? r.net - base.net : null;
            return `<div class="amort-row evo-cols"><span>${r.y}</span><span>${numStr2(r.gross)}</span><span>${numStr2(r.irpf)}</span><span>${numStr2(r.net)}</span><span class="${d == null ? '' : diffCls(d)}">${d == null ? '—' : (d > 0 ? '+' : '') + numStr2(d)}</span></div>`;
          }).join('') || '<div class="amort-row"><span class="muted">Sin datos</span></div>'}
        </div></li>
      </ul>
    </section>`;
  return el;
}

// ---------- Documentos ----------
function renderDocuments() {
  const slips = sortSlips(allSlips(viewProfiles()).filter((s) => s.file));
  const total = slips.reduce((a, s) => a + s.file.size, 0);
  const el = document.createElement('div');
  el.innerHTML = `
    <section class="hero compact">
      <p class="label">Documentos guardados</p>
      <p class="net">${slips.length}</p>
      <p class="muted small">${slips.length ? `${sizeText(total)} en este dispositivo` : 'Los PDF que adjuntes a cada nómina aparecerán aquí.'}</p>
    </section>
    <section class="group">
      <div class="blocks">${slips.map((s) => `
        <button class="block" type="button" data-doc="${s.id}" style="--block-color:#a3e635">
          <span class="cat-icon" style="color:#a3e635">${icon('payslips')}</span>
          <span class="cat-text"><span class="cat-name">${esc(slipTitle(s))}${s.kind !== 'monthly' ? ` · ${KINDS[s.kind]}` : ''}</span><span class="muted small">${esc(s.file.name)} · ${sizeText(s.file.size)}</span></span>
          <span class="chev">${icon('chevron', 16)}</span>
        </button>`).join('') || '<p class="empty muted">No hay documentos.</p>'}</div>
    </section>`;
  el.querySelectorAll('[data-doc]').forEach((b) => b.addEventListener('click', () => openFile(findSlip(b.dataset.doc).s)));
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
  for (const s of data.profiles.flatMap((p) => p.slips).filter((x) => x.file)) {
    const blob = await files.get(s.file.id).catch(() => null);
    if (blob) out.files[s.file.id] = { type: blob.type, b64: await blobToB64(blob) };
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
