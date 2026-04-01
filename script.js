/* ── CONFIG ──────────────────────────────────────── */
const API = 'http://localhost:8080';

const UNITS = {
  LengthUnit: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WeightUnit: ['KILOGRAM', 'GRAM', 'POUND', 'MILIGRAM', 'TONNE'],
  TemperatureUnit: ['CELSIUS', 'FAHRENHEIT'],
  VolumeUnit: ['LITRE', 'MILLILITRE', 'GALLON'],
};
const LABELS = {
  FEET: 'Feet', INCHES: 'Inches', YARDS: 'Yards', CENTIMETERS: 'Centimeters',
  KILOGRAM: 'Kilogram', GRAM: 'Gram', POUND: 'Pound', MILIGRAM: 'Milligram', TONNE: 'Tonne',
  CELSIUS: 'Celsius', FAHRENHEIT: 'Fahrenheit',
  LITRE: 'Litre', MILLILITRE: 'Millilitre', GALLON: 'Gallon',
};

const OP_SYMBOLS = {
  compare: '≈',
  convert: '⇄',
  add: '+',
  'add-with-target-unit': '+→',
  subtract: '−',
  'subtract-with-target-unit': '−→',
  divide: '÷',
};

/* ── STATE ───────────────────────────────────────── */
let token = localStorage.getItem('qm_token') || null;
let email = localStorage.getItem('qm_email') || '';
let curType = 'LengthUnit';
let curAct = 'compare';
let curArith = 'add';
let hist = JSON.parse(localStorage.getItem('qm_hist') || '[]');

/* ── OAUTH2 - GOOGLE ─────────────────────────────── */
function doGoogleLogin() {
  // Redirects to Spring Security's OAuth2 endpoint
  // Backend will handle Google flow and redirect back with ?token=xxx
  window.location.href = `${API}/oauth2/authorization/google`;
}

function handleOAuthCallback() {
  try {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('token');
    const oauthEmail = params.get('email') || 'Google User';

    if (oauthToken) {
      console.log("✅ OAuth Token Found:", oauthToken);

      token = oauthToken;
      email = oauthEmail;

      localStorage.setItem('qm_token', token);
      localStorage.setItem('qm_email', email);

      // CLEAN URL (IMPORTANT)
      window.history.replaceState({}, document.title, window.location.pathname);

      showMain();
      toast('Signed in with Google ✓', 'ok');
    }
  } catch (err) {
    console.error("❌ OAuth Error:", err);
  }
}

/* ── INIT ────────────────────────────────────────── */
// window.addEventListener('DOMContentLoaded', () => {
//   handleOAuthCallback();

//   setTimeout(() => {
//     token ? showMain() : showAuth();
//   }, 50);
//   fillDropdowns();
//   renderHist();

//   // Keyboard shortcuts
//   ['lEmail', 'lPass', 'sEmail', 'sPass'].forEach(id => {
//     const el = document.getElementById(id);
//     if (!el) return;
//     el.addEventListener('keydown', e => {
//       if (e.key !== 'Enter') return;
//       id.startsWith('l') ? doLogin() : doSignup();
//     });
//   });

//   // Animate tab ink on load
//   updateTabInk('login');
// });

window.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 App Loaded");

  handleOAuthCallback();

  setTimeout(() => {
    console.log("Token:", token);
    token ? showMain() : showAuth();
  }, 50);

  fillDropdowns();
  renderHist();
});

/* ── AUTH TABS ───────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) =>
    t.classList.toggle('active', i === (tab === 'login' ? 0 : 1)));
  document.getElementById('loginForm').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? '' : 'none';
  updateTabInk(tab);
}

function updateTabInk(tab) {
  const ink = document.getElementById('tabInk');
  if (!ink) return;
  ink.classList.toggle('right', tab === 'signup');
}

/* ── LOGIN ───────────────────────────────────────── */
async function doLogin() {
  const e = document.getElementById('lEmail').value.trim();
  const p = document.getElementById('lPass').value;

  if (!e || !p) return showErr('lErr', 'Please fill all fields.');

  setBtnLoad('btnLogin', true, '<span>Sign In</span><span class="btn-arrow">→</span>');

  try {
    const res = await apiPost(`${API}/auth/login`, { email: e, password: p });

    console.log("✅ LOGIN RESPONSE:", res);   // 👈 ADD THIS LINE

    token = res.token;
    email = e;

    localStorage.setItem('qm_token', token);
    localStorage.setItem('qm_email', email);

    showMain();
    toast('Signed in ✓', 'ok');

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);   // 👈 ADD THIS ALSO
    showErr('lErr', err.message || 'Login failed. Check credentials.');
  } finally {
    setBtnLoad('btnLogin', false, '<span>Sign In</span><span class="btn-arrow">→</span>');
  }
}

/* ── SIGNUP ──────────────────────────────────────── */
async function doSignup() {
  const e = document.getElementById('sEmail').value.trim();
  const p = document.getElementById('sPass').value;
  if (!e || !p) return showErr('sErr', 'Please fill all fields.');
  if (p.length < 8) return showErr('sErr', 'Password must be at least 8 characters.');
  setBtnLoad('btnSignup', true, '<span>Create Account</span><span class="btn-arrow">→</span>');
  try {
    // AUTH PATH: /auth/signup (matches AuthController @RequestMapping("/auth"))
    const res = await apiPost(`${API}/auth/signup`, { email: e, password: p });
    if (res.token) {
      token = res.token; email = e;
      localStorage.setItem('qm_token', token);
      localStorage.setItem('qm_email', email);
      showMain(); toast('Account created ✓', 'ok');
    } else {
      toast('Account created! Please log in.', 'ok');
      switchTab('login');
    }
  } catch (err) {
    showErr('sErr', err.message || 'Signup failed.');
  } finally {
    setBtnLoad('btnSignup', false, '<span>Create Account</span><span class="btn-arrow">→</span>');
  }
}

/* ── LOGOUT ──────────────────────────────────────── */
function doLogout() {
  token = null; email = '';
  localStorage.removeItem('qm_token');
  localStorage.removeItem('qm_email');
  showAuth();
  document.getElementById('lEmail').value = '';
  document.getElementById('lPass').value = '';
  toast('Logged out', 'ok');
}

/* ── PAGE SWITCH ─────────────────────────────────── */
// function showAuth() {
//   document.getElementById('authPage').classList.remove('hidden');
//   document.getElementById('mainPage').classList.remove('show');
// }
function showAuth() {
  const auth = document.getElementById('authPage');
  const main = document.getElementById('mainPage');

  if (auth) auth.style.display = 'flex';
  if (main) main.style.display = 'none';
}
// function showMain() {
//   const auth = document.getElementById('authPage');
//   const main = document.getElementById('mainPage');
//   const nav = document.getElementById('navEmail');

//   if (!auth || !main || !nav) {
//     console.error("❌ DOM elements missing");
//     return;
//   }

//   auth.classList.add('hidden');
//   main.classList.add('show');
//   nav.textContent = email || 'User';
// }
function showMain() {
  const auth = document.getElementById('authPage');
  const main = document.getElementById('mainPage');
  const nav = document.getElementById('navEmail');

  if (!auth || !main || !nav) {
    console.error("❌ DOM elements missing");
    return;
  }

  auth.style.display = 'none';
  main.style.display = 'flex';
  nav.textContent = email || 'User';
}

function fillDropdowns() {
  const units = UNITS[curType] || [];

  ['unit1', 'unit2', 'targetUnit'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) {
      console.warn("⚠ Missing element:", id);
      return;
    }
    sel.innerHTML = units.map(u => `<option value="${u}">${LABELS[u] || u}</option>`).join('');
  });
}

/* ── TYPE PICKER ─────────────────────────────────── */
function pickType(card, type) {
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  curType = type;
  fillDropdowns();
  hideResult();
}

/* ── ACTION PICKER ───────────────────────────────── */
function pickAction(btn, act) {
  document.querySelectorAll('#mainTabs .op-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  curAct = act;
  document.getElementById('arithSub').style.display = act === 'arithmetic' ? '' : 'none';
  document.getElementById('targetRow').style.display = 'none';
  document.getElementById('lbl2').textContent = act === 'convert' ? 'Target Unit' : 'Value B';

  // Update divider symbol
  const sym = act === 'convert' ? '⇄' : act === 'compare' ? '≈' : '∑';
  document.getElementById('opSymbol').textContent = sym;

  if (act === 'arithmetic') {
    const firstPill = document.querySelector('#arithTabs .arith-pill');
    if (firstPill) pickArith(firstPill, 'add');
  }
  hideResult();
}

/* ── ARITH PICKER ────────────────────────────────── */
function pickArith(btn, op) {
  document.querySelectorAll('#arithTabs .arith-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  curArith = op;
  document.getElementById('targetRow').style.display = op.includes('with-target') ? '' : 'none';
  const symbols = { add: '+', 'add-with-target-unit': '+', subtract: '−', 'subtract-with-target-unit': '−', divide: '÷' };
  document.getElementById('opSymbol').textContent = symbols[op] || '∑';
  hideResult();
}

/* ── DROPDOWNS ───────────────────────────────────── */
function fillDropdowns() {
  const units = UNITS[curType] || [];
  ['unit1', 'unit2', 'targetUnit'].forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = units.map(u => `<option value="${u}">${LABELS[u] || u}</option>`).join('');
  });
  const u2 = document.getElementById('unit2');
  if (u2.options.length > 1) u2.selectedIndex = 1;
  const tu = document.getElementById('targetUnit');
  if (tu.options.length > 1) tu.selectedIndex = 1;
}

/* ── RUN OPERATION ───────────────────────────────── */
async function runOp() {
  const v1 = parseFloat(document.getElementById('val1').value);
  const v2 = parseFloat(document.getElementById('val2').value);
  const u1 = document.getElementById('unit1').value;
  const u2 = document.getElementById('unit2').value;

  if (isNaN(v1) || isNaN(v2)) {
    toast('Please enter both values.', 'err');
    return;
  }

  const thisQ = { value: v1, unit: u1, measurementType: curType };
  const thatQ = { value: v2, unit: u2, measurementType: curType };

  let endpoint;
  if (curAct === 'compare') {
    endpoint = 'compare';
  } else if (curAct === 'convert') {
    endpoint = 'convert';
  } else if (curAct === 'arithmetic') {
    if (curArith === 'add-with-target-unit') {
      endpoint = 'add-with-target-unit';
    } else if (curArith === 'subtract-with-target-unit') {
      endpoint = 'subtract-with-target-unit';
    } else {
      endpoint = curArith;
    }
  }

  const body = { thisQuantityDTO: thisQ, thatQuantityDTO: thatQ };

  if (['add-with-target-unit', 'subtract-with-target-unit'].includes(endpoint)) {
    const tu = document.getElementById('targetUnit').value;
    body.targetQuantityDTO = { value: 0.0, unit: tu, measurementType: curType };
  }

  const btn = document.getElementById('btnRun');
  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span><span class="btn-run-text">Running…</span>';

  try {
    // QUANTITY PATH: /api/v1/quantities/{endpoint} (matches QuantityMeasurementController)
    const url = `${API}/api/v1/quantities/${endpoint}`;
    console.log('🔗 Calling:', url, '\n📦 Body:', JSON.stringify(body, null, 2));

    const res = await apiPostAuth(url, body);
    console.log('✅ Result:', res);

    displayResult(res, res.error, endpoint);
    pushHist(endpoint, res, !!res.error);
    toast('Operation complete ✓', 'ok');
  } catch (err) {
    console.error('❌ Error:', err);
    displayResult({ errorMessage: err.message, error: true }, true, endpoint);
    pushHist(endpoint, { errorMessage: err.message }, true);
    toast('Failed: ' + err.message, 'err');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-run-text">Run Operation</span><span class="btn-run-icon">▶</span>';
  }
}

/* ── RESULT ──────────────────────────────────────── */
function displayResult(data, isErr, endpoint) {
  const box = document.getElementById('resultBox');
  box.className = 'result-box show ' + (isErr || data.error ? 'err' : 'ok');

  let displayValue = '';
  let displayUnit = '';

  if (isErr || data.error) {
    displayValue = data.errorMessage || 'Unknown error';
  } else {
    if (data.resultValue === true || data.resultValue === false) {
      displayValue = data.resultValue ? '✅ EQUAL' : '❌ NOT EQUAL';
    } else if (data.resultString) {
      displayValue = data.resultString === 'Equal' ? '✅ EQUAL' : '❌ NOT EQUAL';
    } else if (typeof data.resultValue === 'number') {
      displayValue = +data.resultValue.toFixed(6);
    } else {
      displayValue = data.resultValue !== undefined ? data.resultValue : (data.value ?? '—');
    }
    displayUnit = data.resultUnit || data.unit || '';
  }

  document.getElementById('resVal').textContent = displayValue;
  document.getElementById('resUnit').textContent = displayUnit ? `Unit: ${displayUnit}` : '';

  // Show op label
  const opEl = document.getElementById('resultOp');
  if (opEl && endpoint) {
    opEl.textContent = endpoint.toUpperCase().replace(/-/g, ' ');
  }
}

function hideResult() {
  document.getElementById('resultBox').className = 'result-box';
}

/* ── HISTORY ─────────────────────────────────────── */
function pushHist(op, data, isErr) {
  hist.unshift({
    op,
    isErr,
    type: curType,
    val: isErr
      ? data.errorMessage
      : (data.resultString
        ? (data.resultString === 'Equal' ? '✅ EQUAL' : '❌ NOT EQUAL')
        : (data.resultValue !== undefined ? (+data.resultValue.toFixed ? +data.resultValue.toFixed(6) : data.resultValue) : (data.value ?? '?'))),
    unit: data.resultUnit || data.unit || '',
    time: new Date().toLocaleTimeString(),
  });
  if (hist.length > 100) hist.pop();
  localStorage.setItem('qm_hist', JSON.stringify(hist));
  renderHist();
}

function renderHist(filter = 'all') {
  const list = document.getElementById('histList');
  let items = hist;
  if (filter === 'error') items = hist.filter(h => h.isErr);
  else if (filter !== 'all') items = hist.filter(h => h.op.startsWith(filter));

  if (!items.length) {
    list.innerHTML = `<div class="hist-empty">
      <div class="hist-empty-icon">◈</div>
      <div>No records here.</div>
    </div>`;
    return;
  }
  list.innerHTML = items.map(h => `
    <div class="h-item ${h.isErr ? 'err' : ''}">
      <div class="h-op">${h.op.replace(/-/g, ' ')} · ${h.type.replace('Unit', '')}</div>
      <div class="h-val">${h.isErr ? '⚠ Error' : h.val + (h.unit ? ' ' + h.unit : '')}</div>
      <div class="h-time">${h.time}</div>
    </div>
  `).join('');
}

function filterHist(chip, f) {
  document.querySelectorAll('.hchip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  renderHist(f);
}

function clearHist() {
  hist = [];
  localStorage.removeItem('qm_hist');
  renderHist();
  toast('History cleared', 'ok');
}

/* ── AJAX ────────────────────────────────────────── */
async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { message: text }; }
  if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
  return data;
}

async function apiPostAuth(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { message: text }; }
  if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
  return data;
}

/* ── UI HELPERS ──────────────────────────────────── */
function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

function setBtnLoad(id, loading, label) {
  const btn = document.getElementById(id);
  btn.disabled = loading;
  btn.innerHTML = loading ? '<span class="spin"></span>Please wait…' : label;
}

let toastT;
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(toastT);
  toastT = setTimeout(() => el.className = '', 3000);
}