// Map de Presets carregados do JSON de referência
let presetsData = {
  "00 - Neutral": { A: 10, B: 7, C: 4, D: 8, E: 10 },
  "01 - Bahrain, Sakhir": { A: 9, B: 5, C: 2, D: 8, E: 0 },
  "02 - Saudi Arabia, Jeddah": { A: 14, B: 4, C: 0, D: 16, E: 0 },
  "03 - Australia, Melbourne": { A: 17, B: 8, C: 3, D: 10, E: 14 },
  "04 - Japan, Suzuka": { A: 14, B: 8, C: 4, D: 15, E: 0 },
  "05 - China, Shanghai": { A: 6, B: 5, C: 7, D: 2, E: 16 },
  "06 - USA, Miami": { A: 15, B: 9, C: 6, D: 16, E: 7 },
  "07 - Italy, Imola": { A: 13, B: 8, C: 5, D: 16, E: 0 },
  "08 - Monaco, Monte Carlo": { A: 20, B: 14, C: 1, D: 13, E: 13 },
  "09 - Canada, Montreal": { A: 7, B: 6, C: 7, D: 9, E: 16 },
  "10 - Spain, Barcelona": { A: 17, B: 10, C: 2, D: 11, E: 16 },
  "11 - Austria, Spielberg": { A: 10, B: 8, C: 8, D: 8, E: 16 },
  "12 - Great Britain, Silverstone": { A: 12, B: 5, C: 0, D: 11, E: 7 },
  "13 - Hungary, Budapest": { A: 19, B: 12, C: 7, D: 10, E: 15 },
  "14 - Belgium, Spa Francorchamps": { A: 6, B: 1, C: 5, D: 14, E: 12 },
  "15 - Netherlands, Zandvoort": { A: 19, B: 9, C: 3, D: 9, E: 18 },
  "16 - Italy, Monza": { A: 2, B: 0, C: 8, D: 6, E: 18 },
  "17 - Azerbaijan, Baku": { A: 3, B: 3, C: 6, D: 5, E: 17 },
  "18 - Singapore, Marina Bay": { A: 16, B: 13, C: 1, D: 1, E: 20 },
  "19 - USA, Austin": { A: 16, B: 8, C: 7, D: 15, E: 5 },
  "20 - Mexico, Mexico City": { A: 13, B: 8, C: 7, D: 15, E: 7 },
  "21 - Brazil, Sao Paulo": { A: 14, B: 8, C: 7, D: 14, E: 11 },
  "22 - USA, Las Vegas": { A: 0, B: 3, C: 8, D: 6, E: 11 },
  "23 - Qatar, Lusail": { A: 16, B: 8, C: 2, D: 13, E: 18 },
  "24 - Abu Dhabi, Yas Marina": { A: 10, B: 7, C: 6, D: 12, E: 19 }
};

// --- Mapeamento das Etiquetas ---
const etichette = {
  A: ["0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0", "9.5", "10.0"],
  B: ["9.0", "9.5", "10.0", "10.5", "11.0", "11.5", "12.0", "12.5", "13.0", "13.5", "14.0", "14.5", "15.0", "15.5", "16.0"],
  C: ["9:1", "8:2", "7:3", "6:4", "5:5", "4:6", "3:7", "2:8", "1:9"],
  D: ["-2.70°", "-2.75°", "-2.80°", "-2.85°", "-2.90°", "-2.95°", "-3.00°", "-3.05°", "-3.10°", "-3.15°", "-3.20°", "-3.25°", "-3.30°", "-3.35°", "-3.40°", "-3.45°", "-3.50°"],
  E: ["0.00°", "0.05°", "0.10°", "0.15°", "0.20°", "0.25°", "0.30°", "0.35°", "0.40°", "0.45°", "0.50°", "0.55°", "0.60°", "0.65°", "0.70°", "0.75°", "0.80°", "0.85°", "0.90°", "0.95°", "1.00°"]
};

const judgments = [
  { code: "u", text: "Desconhecido" },
  { code: "o", text: "Ideal" },
  { code: "g", text: "Ótimo" },
  { code: "d", text: "Bom" },
  { code: "p", text: "Ruim +" },
  { code: "m", text: "Ruim -" }
];

const initial_intervals = [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]];

let p1 = { 
  matriz: [], 
  interv: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]], 
  prevInterv: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]],
  suggestedComb: [0, 0, 0, 0, 0],
  fbState: { A: "u", B: "u", C: "u", D: "u", E: "u" }, 
  iter: 0 
};

let p2 = { 
  matriz: [], 
  interv: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]], 
  prevInterv: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]],
  suggestedComb: [0, 0, 0, 0, 0],
  fbState: { A: "u", B: "u", C: "u", D: "u", E: "u" }, 
  iter: 0 
};

document.addEventListener('DOMContentLoaded', () => {
  p1.matriz = generaCombinazioni();
  p2.matriz = generaCombinazioni();
  carregarPresetsExternos();
  configurarEventos();
});

// Carrega o JSON caso ele esteja presente na pasta do projeto
async function carregarPresetsExternos() {
  try {
    const res = await fetch('presets.json');
    if (res.ok) {
      const data = await res.json();
      presetsData = {};
      data.forEach(item => {
        presetsData[item.name] = { A: item.A, B: item.B, C: item.C, D: item.D, E: item.E };
      });
    }
  } catch (e) {
    console.log("Usando presets locais sincronizados.");
  }
  carregarPresetSelect();
  atualizarTudo();
}

function calcolaSecondarie(A, B, C, D, E) {
  let a = 0.5 + A * (2 / 100) + B * (-1 / 35) + C * (-1 / 80) + D * (1 / 160);
  let b = 0.45 + A * (-1 / 100) + B * (1 / 70) + C * (3 / 160) + D * (-1 / 64) + E * (1 / 100);
  let c = 0.2 + A * (3 / 200) + B * (1 / 56) + C * (-3 / 160) + D * (1 / 64) + E * (-1 / 400);
  let d = 0.25 + A * (-3 / 400) + B * (1 / 56) + C * (1 / 16) + D * (-1 / 160);
  let e = 1 + A * (-1 / 200) + B * (-9 / 140);
  return [a, b, c, d, e];
}

function generaCombinazioni() {
  let matriz = [];
  for (let A = 0; A <= 20; A++) {
    for (let B = 0; B <= 14; B++) {
      for (let C = 0; C <= 8; C++) {
        for (let D = 0; D <= 16; D++) {
          for (let E = 0; E <= 20; E++) {
            let [a, b, c, d, e] = calcolaSecondarie(A, B, C, D, E);
            matriz.push([A, B, C, D, E, a, b, c, d, e]);
          }
        }
      }
    }
  }
  return matriz;
}

function calcolaIntersezione(curr, novo) {
  let min = Math.max(curr[0], novo[0]);
  let max = Math.min(curr[1], novo[1]);
  if (min > max) return null;
  return [min, max];
}

function aggiornaIntervalli(val, fb, intervCorrente, tuning_o = 0.006964, tuning_g = 0.04, tuning_d = 0.1, tuning_p = 0.1, tuning_m = 0.1) {
  let novoIntervallo;

  if (fb === "o") {
    novoIntervallo = [val - tuning_o, val + tuning_o];
  } else if (fb === "g") {
    novoIntervallo = [val - tuning_g, val + tuning_g];
    let inter = calcolaIntersezione(intervCorrente, novoIntervallo);
    if (!inter) return null;
    let [inter_min, inter_max] = inter;
    let exclusion_min = val - tuning_o;
    let exclusion_max = val + tuning_o;

    if (inter_min >= exclusion_min && inter_min <= exclusion_max) {
      novoIntervallo = [exclusion_max, val + tuning_g];
    } else if (inter_max >= exclusion_min && inter_max <= exclusion_max) {
      novoIntervallo = [val - tuning_g, exclusion_min];
    }
  } else if (fb === "d") {
    novoIntervallo = [val - tuning_d, val + tuning_d];
    let inter = calcolaIntersezione(intervCorrente, novoIntervallo);
    if (!inter) return null;
    let [inter_min, inter_max] = inter;
    let exclusion_min = val - tuning_g;
    let exclusion_max = val + tuning_g;

    if (inter_min >= exclusion_min && inter_min <= exclusion_max) {
      novoIntervallo = [exclusion_max, val + tuning_d];
    } else if (inter_max >= exclusion_min && inter_max <= exclusion_max) {
      novoIntervallo = [val - tuning_d, exclusion_min];
    }
  } else if (fb === "p") {
    novoIntervallo = [val + tuning_p, 1];
  } else if (fb === "m") {
    novoIntervallo = [0, val - tuning_m];
  } else if (fb === "u") {
    return intervCorrente;
  }

  return calcolaIntersezione(intervCorrente, novoIntervallo);
}

function carregarPresetSelect() {
  const select = document.getElementById('preset-select');
  if (!select) return;
  select.innerHTML = '';
  Object.keys(presetsData).forEach(pista => {
    const opt = document.createElement('option');
    opt.value = pista;
    opt.textContent = pista;
    select.appendChild(opt);
  });
}

function configurarEventos() {
  const presetSelect = document.getElementById('preset-select');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => carregarPreset(e.target.value));
  }

  const nextBtn = document.getElementById('next-button');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const keys = Object.keys(presetsData);
      let idx = (keys.indexOf(presetSelect.value) + 1) % keys.length;
      presetSelect.value = keys[idx];
      carregarPreset(keys[idx]);
    });
  }

  ['', '_2'].forEach(suf => {
    const pObj = suf === '' ? p1 : p2;

    ['A', 'B', 'C', 'D', 'E'].forEach(v => {
      const slider = document.getElementById(`slider-${v}${suf}`);
      if (slider) {
        slider.addEventListener('input', () => atualizarValoresEMarkers(suf));
      }

      const btn = document.getElementById(`btn-fb-${v}${suf}`) || document.getElementById(`button-${v.toLowerCase()}${suf}`);
      if (btn) {
        btn.addEventListener('click', () => {
          let currIdx = judgments.findIndex(j => j.code === pObj.fbState[v]);
          let nextIdx = (currIdx + 1) % judgments.length;
          pObj.fbState[v] = judgments[nextIdx].code;
          btn.textContent = judgments[nextIdx].text;
          btn.className = `judgment-button ${judgments[nextIdx].code}`;
          btn.setAttribute('data-judgment', judgments[nextIdx].code);
        });
      }
    });
  });

  const calc1 = document.getElementById('calculate-button');
  const calc2 = document.getElementById('calculate-button_2');
  if (calc1) calc1.addEventListener('click', () => processarCalculo(p1, '', 'result-p1', 'messages'));
  if (calc2) calc2.addEventListener('click', () => processarCalculo(p2, '_2', 'result-p2', 'messages_2'));

  const rst1 = document.getElementById('reset-button');
  const rst2 = document.getElementById('reset-button_2');
  if (rst1) rst1.addEventListener('click', () => resetarPiloto(p1, '', 'messages'));
  if (rst2) rst2.addEventListener('click', () => resetarPiloto(p2, '_2', 'messages_2'));
}

function carregarPreset(nome) {
  const p = presetsData[nome];
  if (!p) return;

  ['', '_2'].forEach(suf => {
    ['A', 'B', 'C', 'D', 'E'].forEach(v => {
      const slider = document.getElementById(`slider-${v}${suf}`);
      if (slider) slider.value = p[v];
    });
  });

  resetarPiloto(p1, '', 'messages');
  resetarPiloto(p2, '_2', 'messages_2');
}

function atualizarValoresEMarkers(suf) {
  const A = parseInt(document.getElementById(`slider-A${suf}`).value);
  const B = parseInt(document.getElementById(`slider-B${suf}`).value);
  const C = parseInt(document.getElementById(`slider-C${suf}`).value);
  const D = parseInt(document.getElementById(`slider-D${suf}`).value);
  const E = parseInt(document.getElementById(`slider-E${suf}`).value);

  const valA = document.getElementById(`val-A${suf}`) || document.getElementById(`value-A${suf}`);
  const valB = document.getElementById(`val-B${suf}`) || document.getElementById(`value-B${suf}`);
  const valC = document.getElementById(`val-C${suf}`) || document.getElementById(`value-C${suf}`);
  const valD = document.getElementById(`val-D${suf}`) || document.getElementById(`value-D${suf}`);
  const valE = document.getElementById(`val-E${suf}`) || document.getElementById(`value-E${suf}`);

  if (valA) valA.textContent = etichette.A[A];
  if (valB) valB.textContent = etichette.B[B];
  if (valC) valC.textContent = etichette.C[C];
  if (valD) valD.textContent = etichette.D[D];
  if (valE) valE.textContent = etichette.E[E];

  const sec = calcolaSecondarie(A, B, C, D, E);
  ['a', 'b', 'c', 'd', 'e'].forEach((v, idx) => {
    const marker = document.getElementById(`marker-${v.toUpperCase()}${suf}`) || document.getElementById(`current-marker-${v}${suf}`);
    if (marker) {
      marker.style.left = `${sec[idx] * 99.5}%`;
    }
  });
}

function atualizarBarrasEIntervios(pObj, suf) {
  ['a', 'b', 'c', 'd', 'e'].forEach((v, idx) => {
    const bar = document.getElementById(`bar-${v.toUpperCase()}${suf}`) || document.getElementById(`interval-bar-${v}${suf}`);
    const barPrev = document.getElementById(`interval-bar-previous-${v}${suf}`);

    if (bar) {
      let range = pObj.interv[idx][1] - pObj.interv[idx][0];
      let left = pObj.interv[idx][0];
      bar.style.width = `${range * 100}%`;
      bar.style.marginLeft = `${left * 100}%`;
    }

    if (barPrev && pObj.prevInterv) {
      let prevRange = pObj.prevInterv[idx][1] - pObj.prevInterv[idx][0];
      let prevLeft = pObj.prevInterv[idx][0];
      barPrev.style.width = `${prevRange * 100}%`;
      barPrev.style.marginLeft = `${prevLeft * 100}%`;
    }

    const sugMarker = document.getElementById(`suggested-marker-${v}${suf}`);
    if (sugMarker && pObj.matriz.length > 0) {
      const sugValue = pObj.suggestedComb[idx + 5];
      sugMarker.style.left = `${sugValue * 99.5}%`;
    }
  });
}

function processarCalculo(pObj, suf, resultId, msgId) {
  const A = parseInt(document.getElementById(`slider-A${suf}`).value);
  const B = parseInt(document.getElementById(`slider-B${suf}`).value);
  const C = parseInt(document.getElementById(`slider-C${suf}`).value);
  const D = parseInt(document.getElementById(`slider-D${suf}`).value);
  const E = parseInt(document.getElementById(`slider-E${suf}`).value);

  const sec = calcolaSecondarie(A, B, C, D, E);
  let newIntervals = [];
  let isAnyNotOptOrUnk = false;

  const vars = ['A', 'B', 'C', 'D', 'E'];
  for (let i = 0; i < 5; i++) {
    let fb = pObj.fbState[vars[i]];
    if (fb !== 'o' && fb !== 'u') isAnyNotOptOrUnk = true;

    let res = aggiornaIntervalli(sec[i], fb, pObj.interv[i]);
    if (!res) {
      const out = document.getElementById(resultId) || document.getElementById(msgId);
      if (out) out.textContent = "Erro! Interseção inválida. Tente novamente.";
      return;
    }
    newIntervals.push(res);
  }

  pObj.prevInterv = pObj.interv.map(inter => [...inter]);
  pObj.interv = newIntervals;

  if (isAnyNotOptOrUnk) {
    pObj.matriz = pObj.matriz.filter(comb => {
      return comb[0] !== A || comb[1] !== B || comb[2] !== C || comb[3] !== D || comb[4] !== E;
    });
  }

  pObj.matriz = pObj.matriz.filter(r => 
    r[5] >= pObj.interv[0][0] && r[5] <= pObj.interv[0][1] &&
    r[6] >= pObj.interv[1][0] && r[6] <= pObj.interv[1][1] &&
    r[7] >= pObj.interv[2][0] && r[7] <= pObj.interv[2][1] &&
    r[8] >= pObj.interv[3][0] && r[8] <= pObj.interv[3][1] &&
    r[9] >= pObj.interv[4][0] && r[9] <= pObj.interv[4][1]
  );

  pObj.iter++;

  if (pObj.matriz.length > 0) {
    pObj.suggestedComb = pObj.matriz[0];
    document.getElementById(`slider-A${suf}`).value = pObj.suggestedComb[0];
    document.getElementById(`slider-B${suf}`).value = pObj.suggestedComb[1];
    document.getElementById(`slider-C${suf}`).value = pObj.suggestedComb[2];
    document.getElementById(`slider-D${suf}`).value = pObj.suggestedComb[3];
    document.getElementById(`slider-E${suf}`).value = pObj.suggestedComb[4];
  } else {
    pObj.suggestedComb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  atualizarValoresEMarkers(suf);
  atualizarBarrasEIntervios(pObj, suf);

  const out = document.getElementById(resultId) || document.getElementById(msgId);
  if (out) {
    if (pObj.matriz.length === 1) {
      out.textContent = `Iteração ${pObj.iter}, 1 combinação restante. A solução foi encontrada.`;
    } else if (pObj.matriz.length > 0) {
      out.textContent = `Iteração ${pObj.iter}, ${pObj.matriz.length} combinações restantes.`;
    } else {
      out.textContent = "Nenhuma combinação encontrada que atenda aos critérios.";
    }
  }

  vars.forEach(v => {
    pObj.fbState[v] = "u";
    const btn = document.getElementById(`btn-fb-${v}${suf}`) || document.getElementById(`button-${v.toLowerCase()}${suf}`);
    if (btn) {
      btn.textContent = "Desconhecido";
      btn.className = "judgment-button u";
      btn.setAttribute('data-judgment', 'u');
    }
  });
}

function resetarPiloto(pObj, suf, msgId) {
  ['A', 'B', 'C', 'D', 'E'].forEach(v => {
    const slider = document.getElementById(`slider-${v}${suf}`);
    if (slider) slider.value = 0;

    pObj.fbState[v] = "u";
    const btn = document.getElementById(`btn-fb-${v}${suf}`) || document.getElementById(`button-${v.toLowerCase()}${suf}`);
    if (btn) {
      btn.textContent = "Desconhecido";
      btn.className = "judgment-button u";
      btn.setAttribute('data-judgment', 'u');
    }
  });

  pObj.interv = initial_intervals.map(i => [...i]);
  pObj.prevInterv = initial_intervals.map(i => [...i]);
  pObj.iter = 0;
  pObj.matriz = generaCombinazioni();

  const presetSelect = document.getElementById('preset-select');
  if (presetSelect && presetSelect.value) {
    const p = presetsData[presetSelect.value];
    if (p) {
      ['A', 'B', 'C', 'D', 'E'].forEach(v => {
        const slider = document.getElementById(`slider-${v}${suf}`);
        if (slider) slider.value = p[v];
      });
    }
  }

  atualizarValoresEMarkers(suf);
  atualizarBarrasEIntervios(pObj, suf);

  const out = document.getElementById(`result-p${suf === '' ? '1' : '2'}`) || document.getElementById(msgId);
  if (out) out.textContent = "Reset realizado.";
}

function atualizarTudo() {
  const sel = document.getElementById('preset-select');
  if (sel && sel.value) {
    carregarPreset(sel.value);
  }
}