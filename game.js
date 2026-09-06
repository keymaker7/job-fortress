(() => {
  const W = 1280;
  const H = 720;
  const GRAVITY = 520;
  const WIND_ACCEL = 42;
  const MOVE_PX = 68;
  const MOVE_SPEED = 0.072;
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const hud = document.getElementById("hud");
  const hudWind = document.getElementById("hud-wind");
  const hudTurn = document.getElementById("hud-turn");
  const hudAngle = document.getElementById("hud-angle");
  const hudPower = document.getElementById("hud-power");
  const hudPowerNum = document.getElementById("hud-power-num");
  const hudEnergy = document.getElementById("hud-energy");
  const hudEnergyNum = document.getElementById("hud-energy-num");
  const hudMove = document.getElementById("hud-move");
  const hudMoveNum = document.getElementById("hud-move-num");
  const hudHelp = document.getElementById("hud-help");
  const angleDial = document.getElementById("angle-dial");
  const minimap = document.getElementById("minimap");
  const toastEl = document.getElementById("toast");
  const bannerEl = document.getElementById("banner");
  const screenTitle = document.getElementById("screen-title");
  const screenSelect = document.getElementById("screen-select");
  const screenResult = document.getElementById("screen-result");
  const screenHowto = document.getElementById("screen-howto");
  const charGrid = document.getElementById("char-grid");
  const selectWho = document.getElementById("select-who");
  const resultTitle = document.getElementById("result-title");
  const resultLine = document.getElementById("result-line");
  const resultEyebrow = document.getElementById("result-eyebrow");
  const resultMeta = document.getElementById("result-meta");
  const resultArt = document.getElementById("result-art");
  const soundBtn = document.getElementById("btn-sound");

  const CHARACTERS = [
    {
      id: "clerk", name: "김결재", job: "야근 직장인", weapon: "서류뭉치",
      blurb: "결재 안 올린 사람 머리 위로 서류가 비처럼 내립니다.",
      stats: "균형 · 중간 폭발", emoji: "📄", color: "#3d4f78", accent: "#ffd36a",
      hair: "#2b2430", skin: "#ffd3b0",
      speed: 13.4, gravity: 1, wind: 0.85, damage: 23, splash: 40, crater: 42, special: "papers",
      quotes: { idle: "이 결재… 오늘 안에 안 되면 큰일 나는데요.", fire: "긴급 결재입니다!!", hit: "읽음 확인 부탁드립니다.", win: "이겼습니다. 야근비는 없나요?" },
    },
    {
      id: "slacker", name: "나백수", job: "백수", weapon: "슬리퍼",
      blurb: "가볍고 빨라서 바람에 잘 흔들립니다. 한 번은 튕깁니다.",
      stats: "빠름 · 한 번 튕김", emoji: "🩴", color: "#e39a4d", accent: "#8a4d2a",
      hair: "#6b3a1c", skin: "#ffd3b0",
      speed: 15.2, gravity: 0.88, wind: 1.25, damage: 18, splash: 28, crater: 34, special: "bounce",
      quotes: { idle: "아, 오늘도 할 거 없네.", fire: "거기 서! 슬리퍼 맛 좀 볼래?", hit: "우리 엄마 슬리퍼야.", win: "이겼다… 근데 내일 뭐하지." },
    },
    {
      id: "tycoon", name: "황금고", job: "재벌 2세", weapon: "금괴",
      blurb: "무거워서 빨리 떨어지지만, 맞으면 지갑이 아니라 체력이 털립니다.",
      stats: "무거움 · 고데미지", emoji: "🥇", color: "#ffd24a", accent: "#3a2a22",
      hair: "#1d1612", skin: "#ffd3b0",
      speed: 11.4, gravity: 1.38, wind: 0.28, damage: 33, splash: 22, crater: 56, special: "heavy",
      quotes: { idle: "돈으로 안 되는 게 있나?", fire: "이거 순금이야. 받아.", hit: "시세가 올랐거든.", win: "역시 자본주의." },
    },
    {
      id: "influencer", name: "송팔로워", job: "인플루언서", weapon: "링라이트",
      blurb: "빛은 넓게 퍼집니다. 직격보다 근처 폭발이 더 무서워요.",
      stats: "넓은 폭발", emoji: "💡", color: "#ff7eb3", accent: "#fff1c9",
      hair: "#5a2040", skin: "#ffd3b0",
      speed: 12.6, gravity: 0.96, wind: 0.95, damage: 16, splash: 62, crater: 50, special: "splash",
      quotes: { idle: "이거 라이브 켜도 돼?", fire: "좋아요 눌러!", hit: "알고리즘이 너를 골랐어.", win: "구독과 좋아요 부탁드려요." },
    },
    {
      id: "applicant", name: "박취준", job: "취준생", weapon: "자소서 비행기",
      blurb: "종이라 멀리 미끄러집니다. 원거리 저격용.",
      stats: "활강 · 장거리", emoji: "✈️", color: "#4d7cc4", accent: "#e8f1ff",
      hair: "#2a3344", skin: "#ffd3b0",
      speed: 14.8, gravity: 0.62, wind: 0.62, damage: 20, splash: 26, crater: 30, special: "glide",
      quotes: { idle: "자기소개서 47번째 수정본…", fire: "서류 접수합니다!", hit: "최종 합격 통보.", win: "면접은… 다음에요." },
    },
    {
      id: "barista", name: "차아아", job: "카페 알바", weapon: "아이스아메리카노",
      blurb: "맞으면 손이 얼어서 다음 턴 힘이 약해집니다.",
      stats: "범위 · 얼림", emoji: "☕", color: "#8b5a3c", accent: "#cfe8ff",
      hair: "#3b2418", skin: "#ffd3b0",
      speed: 13.2, gravity: 1, wind: 0.9, damage: 19, splash: 44, crater: 38, special: "freeze",
      quotes: { idle: "아이스 아메리카노 맞죠? …또요?", fire: "샷 추가입니다.", hit: "뜨거워요… 아니 차갑네요.", win: "스탬프 10개요. 무료 음료는 없습니다." },
    },
  ];

  const audio = {
    ctx: null,
    muted: false,
    unlock() {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
    },
    tone(freq, dur, type = "square", vol = 0.05) {
      if (this.muted || !this.ctx) return;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start();
      o.stop(this.ctx.currentTime + dur);
    },
    ui() { this.tone(620, 0.07, "triangle", 0.04); },
    throw() { this.tone(220, 0.12, "square", 0.06); this.tone(440, 0.08, "triangle", 0.04); },
    bounce() { this.tone(300, 0.09, "square", 0.05); },
    boom() { this.tone(90, 0.22, "sawtooth", 0.06); this.tone(180, 0.12, "square", 0.04); },
    hit() { this.tone(160, 0.1, "square", 0.05); },
    win() { this.tone(523, 0.12); setTimeout(() => this.tone(659, 0.12), 90); setTimeout(() => this.tone(784, 0.18), 180); },
    turn() { this.tone(392, 0.08, "triangle", 0.04); },
  };

  const state = {
    scene: "title",
    mode: "cpu",
    pickStep: 0,
    picks: [null, null],
    players: [],
    demo: [],
    ground: null,
    wind: 0,
    windHold: 0,
    turn: 0,
    phase: "aim",
    angle: 45,
    power: 50,
    charging: false,
    chargeDir: 1,
    shot: null,
    fx: [],
    floaters: [],
    shake: 0,
    camX: 0,
    camY: 0,
    frozen: [0, 0],
    aiTimer: 0,
    aiTarget: null,
    time: 0,
    keys: new Set(),
    shots: 0,
    hits: 0,
  };

  let toastTimer = 0;
  let bannerTimer = 0;

  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fitCanvas();
  window.addEventListener("resize", fitCanvas);

  function popEl(el, text) {
    el.textContent = text;
    el.classList.remove("hidden", "pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }
  function showToast(text, ms = 1700) { popEl(toastEl, text); toastTimer = ms; }
  function showBanner(text, ms = 1100) { popEl(bannerEl, text); bannerTimer = ms; }
  function hideOverlays(dt) {
    if (toastTimer > 0) { toastTimer -= dt; if (toastTimer <= 0) toastEl.classList.add("hidden"); }
    if (bannerTimer > 0) { bannerTimer -= dt; if (bannerTimer <= 0) bannerEl.classList.add("hidden"); }
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeGround() {
    const g = new Float32Array(W);
    const style = Math.floor(Math.random() * 3);
    for (let x = 0; x < W; x++) {
      const t = x / W;
      let y;
      if (style === 0) {
        y = H - 190 - Math.sin(t * Math.PI) * 150 - Math.sin(t * 8) * 28;
      } else if (style === 1) {
        y = H - 250 - Math.sin(t * Math.PI * 2.2) * 90 - Math.sin(t * 11) * 22 + Math.exp(-(((t - 0.5) * 6) ** 2)) * 80;
      } else {
        y = H - 220 - Math.sin(t * Math.PI * 3) * 70 + (t < 0.22 || t > 0.78 ? -40 : 40);
      }
      g[x] = clamp(y, 260, H - 72);
    }
    for (let k = 0; k < 5; k++) {
      const tmp = new Float32Array(W);
      for (let x = 0; x < W; x++) {
        const l = g[Math.max(0, x - 1)];
        const r = g[Math.min(W - 1, x + 1)];
        tmp[x] = (l + g[x] * 2 + r) / 4;
      }
      g.set(tmp);
    }
    return g;
  }

  function groundY(x) { return state.ground[clamp(Math.round(x), 0, W - 1)]; }

  function carve(cx, cy, r) {
    const left = Math.max(0, Math.floor(cx - r));
    const right = Math.min(W - 1, Math.ceil(cx + r));
    for (let x = left; x <= right; x++) {
      const inside = r * r - (x - cx) * (x - cx);
      if (inside < 0) continue;
      const bottom = cy + Math.sqrt(inside);
      if (state.ground[x] < bottom) state.ground[x] = clamp(bottom, 90, H - 36);
    }
  }

  function seatPlayer(p) {
    p.x = clamp(p.x, 40, W - 40);
    p.y = groundY(p.x) - 2;
  }

  function flattestX(from, to) {
    let best = Math.round((from + to) / 2);
    let bestFlat = 9999;
    for (let x = Math.min(from, to); x <= Math.max(from, to); x += 4) {
      const flat = Math.abs(groundY(x - 18) - groundY(x + 18));
      if (flat < bestFlat) { bestFlat = flat; best = x; }
    }
    return best;
  }

  function createPlayer(slot, char, x) {
    return { slot, char, x, y: 0, hp: 100, move: 100, facing: slot === 0 ? 1 : -1, hurt: 0, alive: true };
  }

  function ensureWorld() {
    if (!state.ground) state.ground = makeGround();
    if (state.demo.length === 0) {
      state.demo = [
        createPlayer(0, CHARACTERS[0], flattestX(130, 210)),
        createPlayer(1, CHARACTERS[2], flattestX(W - 220, W - 130)),
      ];
      state.demo.forEach(seatPlayer);
    }
  }

  function startMatch() {
    state.ground = makeGround();
    state.players = [
      createPlayer(0, CHARACTERS.find((c) => c.id === state.picks[0]), flattestX(90, 220)),
      createPlayer(1, CHARACTERS.find((c) => c.id === state.picks[1]), flattestX(W - 220, W - 90)),
    ];
    state.players.forEach(seatPlayer);
    state.turn = 0;
    state.phase = "aim";
    rollWind();
    state.shot = null;
    state.fx = [];
    state.floaters = [];
    state.frozen = [0, 0];
    state.charging = false;
    state.shots = 0;
    state.hits = 0;
    state.camX = 0;
    state.camY = 0;
    resetAim();
    state.scene = "battle";
    hideAllScreens();
    hud.classList.remove("hidden");
    showBanner(`${current().char.emoji} 시작!`);
    showToast(current().char.quotes.idle, 1900);
    audio.turn();
    updateHud();
  }

  function hideAllScreens() {
    [screenTitle, screenSelect, screenResult, screenHowto].forEach((el) => el.classList.add("hidden"));
  }

  function current() { return state.players[state.turn]; }
  function enemyOf(p) { return state.players[1 - p.slot]; }

  function resetAim() {
    const p = current();
    state.angle = p.facing === 1 ? 48 : 132;
    state.power = 0;
    state.chargeDir = 1;
    p.move = 100;
    if (state.frozen[p.slot] > 0) showToast("손이 꽁꽁. 힘이 잘 안 들어가요…");
  }

  function windFeel() {
    const n = Math.abs(state.wind);
    return n >= 6 ? "강풍" : n >= 3 ? "살랑" : "미풍";
  }

  function windText() {
    return `${state.wind < 0 ? "←" : "→"} ${windFeel()} ${Math.abs(state.wind)}`;
  }

  function rollWind() {
    let next = Math.round(rand(-7, 7));
    if (!next) next = Math.random() < 0.5 ? -2 : 2;
    state.wind = next;
    state.windHold = 2;
  }

  let hudStamp = "";
  function updateHud() {
    if (!state.players[0]) return;
    const who = current();
    const cpuTurn = state.mode === "cpu" && who.slot === 1;
    const stamp = `${state.wind}|${state.turn}|${who.char.id}|${cpuTurn}`;
    if (stamp !== hudStamp) {
      hudStamp = stamp;
      const n = Math.abs(state.wind);
      const spin = n >= 6 ? "fast" : n >= 3 ? "" : "slow";
      hudWind.innerHTML = `<span class="fan${state.wind < 0 ? " left" : ""}"><i class="prop spin ${spin}"></i></span><span>${windText()}</span>`;
      hudTurn.textContent = cpuTurn ? `컴퓨터 ${who.char.name}` : `${who.slot + 1}P ${who.char.name}`;
      hudHelp.textContent = cpuTurn
        ? "컴퓨터가 천천히 조준하는 중…"
        : "↑↓ 각도 · ←→ 조금 이동 · 스페이스를 누르면 힘이 차고, 떼면 날아갑니다";
    }
    hudAngle.textContent = `${Math.round(displayAngle())}°`;
    const frozen = state.frozen[who.slot] > 0;
    const shown = state.charging || state.phase === "fly" ? Math.round(state.power * (frozen ? 0.72 : 1)) : 0;
    hudPower.style.width = `${state.charging ? state.power : 0}%`;
    hudPowerNum.textContent = frozen && state.charging ? `${shown} 🧊` : `${shown}`;
    hudEnergy.style.width = `${clamp(who.hp, 0, 100)}%`;
    hudEnergyNum.textContent = `${Math.round(who.hp)}`;
    hudMove.style.width = `${clamp(who.move ?? 0, 0, 100)}%`;
    hudMoveNum.textContent = `${Math.round(who.move ?? 0)}`;
    drawAngleDial();
    drawMinimap();
  }

  function displayAngle() {
    return current().facing === 1 ? state.angle : 180 - state.angle;
  }

  function nudgeAngle(dir) {
    if (state.scene !== "battle" || state.phase !== "aim") return;
    if (state.mode === "cpu" && current().slot === 1) return;
    state.angle = clamp(state.angle + dir * (current().facing === 1 ? 1 : -1), 8, 172);
    updateHud();
    audio.ui();
  }

  function launchSpeed(char, power) {
    return (260 + char.speed * 44) * (clamp(power, 8, 100) / 100);
  }

  function muzzleOf(p, angle) {
    const rad = (angle * Math.PI) / 180;
    return { x: p.x + Math.cos(rad) * 36, y: p.y - 56 };
  }

  function stepBall(ball, dtSec, char) {
    ball.vy += GRAVITY * char.gravity * dtSec;
    ball.vx += state.wind * WIND_ACCEL * char.wind * dtSec;
    ball.x += ball.vx * dtSec;
    ball.y += ball.vy * dtSec;
  }

  function fire() {
    if (state.phase !== "aim") return;
    if (state.power < 8) return;
    const p = current();
    const frozen = state.frozen[p.slot] > 0;
    const power = clamp(state.power * (frozen ? 0.72 : 1), 8, 100);
    const rad = (state.angle * Math.PI) / 180;
    const spd = launchSpeed(p.char, power);
    const m = muzzleOf(p, state.angle);
    state.shot = {
      x: m.x,
      y: m.y,
      vx: Math.cos(rad) * spd,
      vy: -Math.sin(rad) * spd,
      owner: p.slot,
      char: p.char,
      bounced: false,
      trail: [],
    };
    state.phase = "fly";
    state.charging = false;
    state.shots += 1;
    if (frozen) state.frozen[p.slot] -= 1;
    showToast(p.char.quotes.fire);
    spawnFx(p.x, p.y - 48, p.char.accent, 10, 1.6);
    audio.throw();
    updateHud();
  }

  function spawnFx(x, y, color, n, size, kind = "dot") {
    for (let i = 0; i < n; i++) {
      state.fx.push({
        x, y,
        vx: rand(-2.8, 2.8),
        vy: rand(-4.2, -0.4),
        life: rand(260, 640),
        color, size: rand(size * 0.6, size * 1.8),
        kind,
        rot: rand(0, 6),
        text: "",
      });
    }
  }

  function addFloater(x, y, text, color) {
    state.floaters.push({ x, y, text, color, life: 1000 });
  }

  function explode(x, y, shot) {
    const c = shot.char;
    carve(x, y, c.crater);
    const kind = { papers: "paper", bounce: "dust", heavy: "coin", splash: "ring", glide: "paper", freeze: "ice" }[c.special] || "dot";
    spawnFx(x, y, c.accent, 18, 2.6, kind);
    spawnFx(x, y, "#fff8ef", 10, 1.6, "dot");
    state.shake = c.special === "heavy" ? 16 : 9;
    showBanner(`${c.emoji} ${hitBanner(c)}`);
    audio.boom();

    let anyone = false;
    for (const p of state.players) {
      if (!p.alive) continue;
      const dist = Math.hypot(p.x - x, p.y - 30 - y);
      if (dist < c.splash + 18) {
        const falloff = 1 - dist / (c.splash + 18);
        let dmg = Math.round(c.damage * (0.55 + falloff * 0.7));
        if (dist < 24) dmg = Math.round(c.damage * 1.18);
        p.hp = clamp(p.hp - dmg, 0, 100);
        p.hurt = 360;
        addFloater(p.x, p.y - 150, `-${dmg}`, "#e85d4c");
        anyone = true;
        audio.hit();
        if (c.special === "freeze" && p.slot !== shot.owner) {
          state.frozen[p.slot] = 1;
          addFloater(p.x, p.y - 108, "꽁꽁", "#7ec8ff");
        }
        if (p.hp <= 0) p.alive = false;
      }
    }
    if (anyone) state.hits += 1;
    state.players.forEach(seatPlayer);
    showToast(c.quotes.hit, 1400);
  }

  function hitBanner(c) {
    return { papers: "서류 비!", bounce: "슬리퍼 탁!", heavy: "금괴 쿵!", splash: "찰칵!", glide: "최종 합격!", freeze: "샷 추가!" }[c.special] || "명중!";
  }

  function maybeEnd() {
    const dead = state.players.filter((p) => !p.alive);
    if (!dead.length) return false;
    finish(state.players.find((p) => p.alive) || state.players[state.turn], dead.length === 2);
    return true;
  }

  function finish(winner, draw) {
    state.scene = "result";
    state.phase = "done";
    hud.classList.add("hidden");
    screenResult.classList.remove("hidden");
    audio.win();
    const g = resultArt.getContext("2d");
    g.clearRect(0, 0, 180, 160);
    if (!draw) {
      g.save();
      g.translate(90, 150);
      g.scale(1.6, 1.6);
      drawPerson({ ...winner, x: 0, y: 0, facing: 1, hurt: 0, alive: true, nameLabel: false }, g);
      g.restore();
      const cpuWin = state.mode === "cpu" && winner.slot === 1;
      resultEyebrow.textContent = cpuWin ? "컴퓨터 승리" : `${winner.slot + 1}P 승리`;
      resultTitle.textContent = `${winner.char.name} 승!`;
      resultLine.textContent = winner.char.quotes.win;
    } else {
      resultEyebrow.textContent = "동시 아웃";
      resultTitle.textContent = "둘 다 실업";
      resultLine.textContent = "내일 다시 출근하세요.";
    }
    resultMeta.textContent = `던진 횟수 ${state.shots} · 맞힌 횟수 ${state.hits}`;
  }

  function nextTurn() {
    if (maybeEnd()) return;
    state.turn = 1 - state.turn;
    if (!current().alive) { finish(enemyOf(current()), false); return; }
    state.phase = "aim";
    state.windHold -= 1;
    const windChanged = state.windHold <= 0;
    if (windChanged) rollWind();
    resetAim();
    state.aiTimer = 3200;
    state.aiTarget = null;
    showBanner(`${current().char.emoji} ${current().char.name} 차례`);
    showToast(windChanged ? `바람이 바뀌었어요 ${windText()}` : current().char.quotes.idle, 1600);
    audio.turn();
    updateHud();
  }

  function stepShot(dt) {
    const s = state.shot;
    if (!s) return;
    const steps = 4;
    const t = dt / 1000 / steps;
    for (let i = 0; i < steps; i++) {
      stepBall(s, t, s.char);
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 10) s.trail.shift();
      state.camX = lerp(state.camX, clamp((s.x - W / 2) * 0.18, -40, 40), 0.12);
      state.camY = lerp(state.camY, clamp((s.y - 320) * 0.08, -24, 24), 0.12);

      if (s.x < 4 || s.x > W - 4 || s.y > H + 40) {
        state.shot = null;
        state.camX = state.camY = 0;
        nextTurn();
        return;
      }
      const gy = groundY(s.x);
      if (s.y >= gy) {
        if (s.char.special === "bounce" && !s.bounced && s.vy > 0) {
          s.bounced = true;
          s.y = gy - 3;
          s.vy *= -0.55;
          s.vx *= 0.82;
          spawnFx(s.x, s.y, "#c9843a", 8, 1.5, "dust");
          showToast("슬리퍼가 한 번 튕겼다!");
          audio.bounce();
          continue;
        }
        explode(s.x, gy, s);
        state.shot = null;
        state.camX = state.camY = 0;
        nextTurn();
        return;
      }
      for (const p of state.players) {
        if (!p.alive) continue;
        if (p.slot === s.owner && s.trail.length < 6) continue;
        if (Math.abs(s.x - p.x) < 30 && s.y < p.y + 4 && s.y > p.y - 82) {
          explode(s.x, s.y, s);
          state.shot = null;
          state.camX = state.camY = 0;
          nextTurn();
          return;
        }
      }
    }
  }

  function predictLand(char, x0, y0, angle, power) {
    const rad = (angle * Math.PI) / 180;
    const spd = launchSpeed(char, power);
    const ball = { x: x0, y: y0, vx: Math.cos(rad) * spd, vy: -Math.sin(rad) * spd };
    for (let i = 0; i < 240; i++) {
      stepBall(ball, 1 / 60, char);
      if (ball.x < 2 || ball.x > W - 2 || ball.y > H + 20) return ball;
      if (ball.y >= groundY(ball.x)) return ball;
    }
    return ball;
  }

  function planAi() {
    const me = current();
    const foe = enemyOf(me);
    const m = muzzleOf(me, me.facing === 1 ? 48 : 132);
    let best = { angle: me.facing === 1 ? 48 : 132, power: 60, score: 1e9 };
    for (let a = 28; a <= 78; a += 4) {
      const angle = me.facing === 1 ? a : 180 - a;
      for (let power = 32; power <= 96; power += 8) {
        const land = predictLand(me.char, m.x, m.y, angle, power);
        const score = Math.hypot(land.x - foe.x, land.y - (foe.y - 30));
        if (score < best.score) best = { angle, power, score };
      }
    }
    state.aiTarget = {
      angle: clamp(best.angle + rand(-2.5, 2.5), 12, 168),
      power: clamp(best.power + rand(-5, 5), 20, 98),
    };
  }

  function stepAi(dt) {
    if (state.mode !== "cpu" || current().slot !== 1 || state.phase !== "aim") return;
    state.aiTimer -= dt;
    if (!state.aiTarget) planAi();
    if (state.aiTimer > 2400) {
      updateHud();
      return;
    }
    state.angle = lerp(state.angle, state.aiTarget.angle, 0.016);
    if (state.aiTimer > 1500) {
      updateHud();
      return;
    }
    if (!state.charging) {
      state.charging = true;
      state.chargeDir = 1;
      state.power = 0;
    }
    if (state.power < state.aiTarget.power - 2 && state.chargeDir === 1) {
      updateHud();
      return;
    }
    state.power = state.aiTarget.power;
    if (state.aiTimer > 380) {
      updateHud();
      return;
    }
    fire();
  }

  function stepMove(dt) {
    if (!canControl() || state.charging) return;
    const p = current();
    if (p.move <= 0) return;
    let dir = 0;
    if (state.keys.has("ArrowLeft") || state.keys.has("KeyA")) dir -= 1;
    if (state.keys.has("ArrowRight") || state.keys.has("KeyD")) dir += 1;
    if (!dir) return;
    const step = MOVE_SPEED * dt;
    const cost = (step / MOVE_PX) * 100;
    const foe = enemyOf(p);
    let nx = clamp(p.x + dir * step, 40, W - 40);
    if (Math.abs(nx - foe.x) < 64) nx = foe.x + Math.sign(p.x - foe.x || -dir) * 64;
    p.x = nx;
    const newFace = p.x < foe.x ? 1 : -1;
    if (newFace !== p.facing) {
      p.facing = newFace;
      state.angle = clamp(180 - state.angle, 8, 172);
    }
    seatPlayer(p);
    p.move = clamp(p.move - cost, 0, 100);
  }

  function stepCharge(dt) {
    if (!state.charging || state.phase !== "aim") return;
    state.power += state.chargeDir * dt * 0.085;
    if (state.power >= 100) { state.power = 100; state.chargeDir = -1; }
    else if (state.power <= 0) { state.power = 0; state.chargeDir = 1; }
    updateHud();
  }

  function stepFx(dt) {
    state.fx = state.fx.filter((p) => {
      p.life -= dt;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += 0.12;
      return p.life > 0;
    });
    state.floaters = state.floaters.filter((f) => {
      f.life -= dt;
      f.y -= 0.28;
      return f.life > 0;
    });
    if (state.shake > 0) state.shake *= 0.86;
    if (state.phase !== "fly") {
      state.camX *= 0.86;
      state.camY *= 0.86;
    }
    for (const p of state.players) if (p.hurt > 0) p.hurt -= dt;
  }

  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
  }

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#6fb7ff");
    g.addColorStop(0.4, "#ffb7d2");
    g.addColorStop(0.75, "#ffd27a");
    g.addColorStop(1, "#ffe9b0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#fff3a8";
    ctx.beginPath();
    ctx.arc(1090, 86, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.arc(1074, 76, 14, 0, Math.PI * 2);
    ctx.fill();

    const drift = (state.time / 35) % 240;
    const clouds = [[90 + drift * 0.12, 88, 1.15], [460 - drift * 0.07, 126, 0.9], [780 + drift * 0.09, 68, 1.3]];
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    for (const [x, y, s] of clouds) {
      ctx.beginPath();
      ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
      ctx.arc(x + 20 * s, y - 7 * s, 21 * s, 0, Math.PI * 2);
      ctx.arc(x + 40 * s, y, 15 * s, 0, Math.PI * 2);
      ctx.fill();
    }

    const hues = ["#ffb4d6", "#ffd36a", "#b8e3ff", "#c9b6ff"];
    let x = -16;
    for (let i = 0; i < 20; i++) {
      const bw = 64 + ((i * 23) % 34);
      const bh = 78 + ((i * 41) % 96);
      ctx.fillStyle = "rgba(86, 64, 110, 0.2)";
      ctx.beginPath();
      ctx.roundRect(x, H - 214 - bh, bw, bh + 214, 16);
      ctx.fill();
      ctx.fillStyle = hues[i % hues.length];
      ctx.globalAlpha = 0.38;
      for (let wy = 0; wy < 5; wy++) {
        rr(ctx, x + 12, H - 200 - bh + 16 + wy * 17, 9, 7, 2);
        rr(ctx, x + 28, H - 200 - bh + 16 + wy * 17, 9, 7, 2);
      }
      ctx.globalAlpha = 1;
      x += bw - 10;
    }
  }

  function drawGround() {
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, state.ground[0]);
    for (let x = 1; x < W; x++) ctx.lineTo(x, state.ground[x]);
    ctx.lineTo(W, H);
    ctx.closePath();
    const dirt = ctx.createLinearGradient(0, 280, 0, H);
    dirt.addColorStop(0, "#8ee08a");
    dirt.addColorStop(0.1, "#f0c27a");
    dirt.addColorStop(1, "#c67a3e");
    ctx.fillStyle = dirt;
    ctx.fill();
    ctx.strokeStyle = "#57c464";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(0, state.ground[0]);
    for (let x = 1; x < W; x += 2) ctx.lineTo(x, state.ground[x]);
    ctx.stroke();

    const petals = ["#ff8fb7", "#ffd36a", "#fff", "#9fd6ff"];
    for (let x = 18; x < W; x += 38) {
      const gy = state.ground[x];
      ctx.fillStyle = "#3fa34a";
      ctx.fillRect(x, gy - 9, 3, 9);
      ctx.fillStyle = petals[(x / 38) % 4];
      ctx.beginPath();
      ctx.arc(x + 1, gy - 12, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPerson(p, g = ctx) {
    const c = p.char;
    const t = state.time;
    const idle = p.nameLabel === false ? 0 : Math.sin(t / 170 + (p.slot || 0)) * 2.4;
    const charge = state.charging && state.scene === "battle" && p === current() && p.nameLabel !== false ? 1 : 0;
    const x = p.x + (p.hurt > 0 ? Math.sin(t / 26) * 4 : 0);
    const y = p.y + (p.hurt > 0 ? 0 : idle) + charge * 3;
    const face = p.facing;
    const blink = Math.floor(t / 160 + (p.slot || 0) * 3) % 22 === 0;
    g.save();
    g.translate(x, y);
    g.scale(face * 1.85, 1.85 * (charge ? 0.94 : 1));

    g.fillStyle = "rgba(58,42,34,0.16)";
    g.beginPath();
    g.ellipse(0, 6, 16, 5, 0, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = "#3a2a22";
    rr(g, -11, -9, 8, 13, 4);
    rr(g, 3, -9, 8, 13, 4);

    g.fillStyle = c.color;
    rr(g, -14, -34, 28, 26, 11);
    g.fillStyle = c.accent;
    rr(g, -3, -33, 6, 12, 3);

    if (c.id === "clerk") {
      g.fillStyle = "#fff8ef";
      rr(g, 10, -28, 11, 13, 3);
      g.fillStyle = "#ffd36a";
      g.fillRect(12, -24, 7, 2);
    } else if (c.id === "slacker") {
      g.fillStyle = "#ffd3b0";
      rr(g, -18, -5, 11, 5, 3);
    } else if (c.id === "tycoon") {
      g.fillStyle = "#ffd24a";
      g.beginPath();
      g.arc(12, -24, 5.5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#3a2a22";
      g.lineWidth = 1.6;
      g.stroke();
    } else if (c.id === "applicant") {
      g.fillStyle = "#fff";
      rr(g, -21, -29, 11, 14, 3);
    } else if (c.id === "barista") {
      g.fillStyle = "#fff8ef";
      rr(g, -15, -34, 30, 8, 4);
      g.fillStyle = "#cfe8ff";
      rr(g, 11, -26, 8, 13, 3);
    } else if (c.id === "influencer") {
      g.fillStyle = "#3a2a22";
      rr(g, 9, -28, 8, 12, 3);
    }

    g.fillStyle = c.skin;
    g.beginPath();
    g.arc(0, -48, 16, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#3a2a22";
    g.lineWidth = 2;
    g.stroke();

    g.fillStyle = c.hair;
    if (c.id === "influencer") {
      g.beginPath();
      g.ellipse(-10, -50, 7, 14, 0.4, 0, Math.PI * 2);
      g.fill();
    }
    g.beginPath();
    g.arc(0, -54, 16, Math.PI, 0);
    g.fill();
    if (c.id === "clerk") rr(g, -16, -62, 32, 8, 4);
    if (c.id === "applicant") rr(g, -16, -63, 32, 8, 4);
    if (c.id === "tycoon") rr(g, -16, -56, 32, 6, 3);
    if (c.id === "slacker") {
      g.beginPath();
      g.arc(-8, -62, 6, 0, Math.PI * 2);
      g.arc(6, -64, 5, 0, Math.PI * 2);
      g.fill();
    }
    if (c.id === "barista") {
      g.fillStyle = "#fff8ef";
      rr(g, -14, -66, 28, 10, 5);
      g.fillStyle = c.color;
      rr(g, -14, -60, 28, 5, 2);
    }

    if (c.id === "influencer") {
      g.strokeStyle = "#fff6c8";
      g.lineWidth = 3.4;
      g.beginPath();
      g.arc(0, -48, 20, 0, Math.PI * 2);
      g.stroke();
    }

    g.fillStyle = "#ff8aa0";
    g.beginPath();
    g.arc(-8.5, -45, 2.5, 0, Math.PI * 2);
    g.arc(8.5, -45, 2.5, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = "#3a2a22";
    if (p.hurt > 0) {
      g.font = "8px Jua, sans-serif";
      g.fillText("x", -8, -47);
      g.fillText("x", 3, -47);
    } else if (blink || !p.alive) {
      g.lineWidth = 1.8;
      g.beginPath();
      g.moveTo(-8, -49);
      g.lineTo(-3, -49);
      g.moveTo(3, -49);
      g.lineTo(8, -49);
      g.stroke();
    } else {
      g.beginPath();
      g.ellipse(-5.5, -49, 2.2, 2.8, 0, 0, Math.PI * 2);
      g.ellipse(5.5, -49, 2.2, 2.8, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(-4.7, -50, 0.8, 0, Math.PI * 2);
      g.arc(6.3, -50, 0.8, 0, Math.PI * 2);
      g.fill();
    }

    g.strokeStyle = "#3a2a22";
    g.lineWidth = 1.7;
    g.beginPath();
    if (!p.alive) {
      g.arc(0, -41, 3, 0.2, Math.PI - 0.2, true);
    } else {
      g.arc(0, -41.5, 3.5, 0.15, Math.PI - 0.15);
    }
    g.stroke();

    if (!p.alive) {
      g.fillStyle = "rgba(58,42,34,0.28)";
      rr(g, -18, -70, 36, 76, 12);
    }
    g.restore();

    if (p.nameLabel !== false) {
      g.save();
      g.font = "20px Jua, sans-serif";
      g.textAlign = "center";
      const label = `${c.emoji} ${c.name}`;
      const tw = Math.max(84, g.measureText(label).width + 18);
      const top = y - 124;
      g.fillStyle = "#fff8ef";
      g.strokeStyle = "#3a2a22";
      g.lineWidth = 3;
      g.beginPath();
      g.roundRect(x - tw / 2, top, tw, 24, 12);
      g.fill();
      g.stroke();
      g.fillStyle = "#3a2a22";
      g.fillText(label, x, top + 18);

      const bw = Math.max(64, tw - 6);
      const bh = 10;
      const bx = x - bw / 2;
      const by = top + 28;
      g.fillStyle = "#3a2a22";
      g.beginPath();
      g.roundRect(bx, by, bw, bh, 5);
      g.fill();
      const ratio = clamp(p.hp, 0, 100) / 100;
      if (ratio > 0) {
        g.fillStyle = p.hp > 50 ? "#5adf7a" : p.hp > 25 ? "#ffd36a" : "#ff7a6e";
        g.beginPath();
        g.roundRect(bx + 1.5, by + 1.5, Math.max(3, (bw - 3) * ratio), bh - 3, 4);
        g.fill();
      }
      g.restore();
    }
  }

  function drawAim(p) {
    if (state.phase !== "aim") return;
    const rad = (state.angle * Math.PI) / 180;
    const m = muzzleOf(p, state.angle);
    ctx.save();
    for (let i = 0; i < 5; i++) {
      const d = 16 + i * 12;
      const x = m.x + Math.cos(rad) * d;
      const y = m.y - Math.sin(rad) * d;
      const s = 5.1 - i * 0.4;
      ctx.globalAlpha = 1 - i * 0.14;
      ctx.fillStyle = "#ffd36a";
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s * 0.85, y);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x - s * 0.85, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#3a2a22";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawShot() {
    const s = state.shot;
    if (!s) return;
    s.trail.forEach((p, i) => {
      ctx.globalAlpha = i / s.trail.length;
      ctx.fillStyle = "#fff8ef";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(Math.atan2(s.vy, s.vx));
    ctx.strokeStyle = "#3a2a22";
    ctx.lineWidth = 2;
    const id = s.char.id;
    if (id === "clerk") {
      ctx.fillStyle = "#fff8ef";
      ctx.beginPath(); ctx.roundRect(-10, -8, 20, 16, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffd36a"; ctx.fillRect(-6, -3, 12, 2);
    } else if (id === "slacker") {
      ctx.fillStyle = "#ffb56b";
      ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (id === "tycoon") {
      ctx.fillStyle = "#ffd24a";
      ctx.beginPath(); ctx.roundRect(-12, -8, 24, 16, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#3a2a22"; ctx.font = "13px Jua, sans-serif"; ctx.fillText("금", -7, 5);
    } else if (id === "influencer") {
      ctx.strokeStyle = "#fff1c9"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.stroke();
    } else if (id === "applicant") {
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.moveTo(-13, 6); ctx.lineTo(15, 0); ctx.lineTo(-11, -7); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#4d7cc4"; ctx.stroke();
    } else {
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.roundRect(-8, -10, 16, 20, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#cfe8ff"; ctx.fillRect(-6, -6, 12, 8);
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ff4d4d";
    ctx.strokeStyle = "#3a2a22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 28);
    ctx.lineTo(s.x + 8, s.y - 16);
    ctx.lineTo(s.x - 8, s.y - 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawFx() {
    for (const p of state.fx) {
      ctx.save();
      ctx.globalAlpha = clamp(p.life / 420, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.kind === "paper") {
        ctx.fillStyle = "#fff8ef";
        ctx.fillRect(-4, -3, 8, 6);
        ctx.strokeStyle = "#3a2a22";
        ctx.strokeRect(-4, -3, 8, 6);
      } else if (p.kind === "coin") {
        ctx.fillStyle = "#ffd24a";
        ctx.beginPath(); ctx.arc(0, 0, p.size + 1, 0, Math.PI * 2); ctx.fill();
      } else if (p.kind === "ice") {
        ctx.fillStyle = "#bfe9ff";
        ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(4, 4); ctx.lineTo(-4, 4); ctx.fill();
      } else if (p.kind === "ring") {
        ctx.strokeStyle = "#fff1c9";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, p.size + 3, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.font = "24px Jua, sans-serif";
    ctx.textAlign = "center";
    for (const f of state.floaters) {
      ctx.globalAlpha = clamp(f.life / 500, 0, 1);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  function drawTurnArrow(p) {
    if (state.scene !== "battle") return;
    const bob = Math.sin(state.time / 140) * 4;
    ctx.save();
    ctx.translate(p.x, p.y - 150 + bob);
    ctx.fillStyle = "#ff4d4d";
    ctx.strokeStyle = "#3a2a22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(10, 0);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawAngleDial() {
    if (!angleDial) return;
    const g = angleDial.getContext("2d");
    const s = 112;
    g.clearRect(0, 0, s, s);
    g.save();
    g.translate(56, 56);
    g.fillStyle = "#7ec8ff";
    g.beginPath();
    g.arc(0, 0, 48, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#3a2a22";
    g.lineWidth = 4;
    g.stroke();
    g.strokeStyle = "rgba(58,42,34,0.25)";
    g.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.beginPath();
      g.moveTo(Math.cos(a) * 34, Math.sin(a) * 34);
      g.lineTo(Math.cos(a) * 44, Math.sin(a) * 44);
      g.stroke();
    }
    const ang = (state.angle * Math.PI) / 180;
    g.strokeStyle = "#ff4d4d";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(Math.cos(ang) * 36, -Math.sin(ang) * 36);
    g.stroke();
    g.fillStyle = "#3a2a22";
    g.beginPath();
    g.arc(0, 0, 5, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  function drawMinimap() {
    if (!minimap || !state.ground || !state.players.length) return;
    const g = minimap.getContext("2d");
    const mw = 200;
    const mh = 78;
    g.clearRect(0, 0, mw, mh);
    g.fillStyle = "#bfe4ff";
    g.fillRect(0, 0, mw, mh);
    g.beginPath();
    g.moveTo(0, mh);
    for (let x = 0; x < mw; x++) {
      const gx = Math.round((x / mw) * (W - 1));
      g.lineTo(x, (state.ground[gx] / H) * mh);
    }
    g.lineTo(mw, mh);
    g.closePath();
    g.fillStyle = "#8b5a2b";
    g.fill();
    for (const p of state.players) {
      g.fillStyle = p.slot === state.turn ? "#ff4d4d" : "#fff8ef";
      g.beginPath();
      g.arc((p.x / W) * mw, (p.y / H) * mh, 4, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#3a2a22";
      g.stroke();
    }
  }

  function drawWorld(people) {
    const sx = (state.shake > 0.4 ? rand(-state.shake, state.shake) : 0) - state.camX;
    const sy = (state.shake > 0.4 ? rand(-state.shake, state.shake) : 0) - state.camY;
    ctx.save();
    ctx.translate(sx, sy);
    drawSky();
    drawGround();
    for (const p of people) {
      drawPerson(p);
      if (state.scene === "battle" && p === current()) {
        drawTurnArrow(p);
        drawAim(p);
      }
    }
    drawShot();
    drawFx();
    ctx.restore();
  }

  function drawPortrait(target, char) {
    const c = target.getContext("2d");
    c.clearRect(0, 0, target.width, target.height);
    c.save();
    c.translate(target.width / 2, target.height - 8);
    c.scale(1.05, 1.05);
    drawPerson({ x: 0, y: 0, facing: 1, hurt: 0, alive: true, slot: 0, char, nameLabel: false }, c);
    c.restore();
  }

  function renderSelect() {
    charGrid.innerHTML = "";
    CHARACTERS.forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "char-card";
      btn.innerHTML = `<div class="char-art"><canvas width="88" height="108"></canvas><span class="sticker">${ch.emoji}</span></div>
        <div class="char-meta"><strong>${ch.name}</strong><em>${ch.job} · ${ch.weapon}</em><p>${ch.blurb}</p><span class="chip">${ch.stats}</span></div>`;
      drawPortrait(btn.querySelector("canvas"), ch);
      btn.addEventListener("click", () => { audio.ui(); pickCharacter(ch.id); });
      charGrid.appendChild(btn);
    });
  }

  function pickCharacter(id) {
    state.picks[state.pickStep] = id;
    if (state.pickStep === 0) {
      state.pickStep = 1;
      if (state.mode === "cpu") {
        const others = CHARACTERS.filter((c) => c.id !== id);
        state.picks[1] = others[Math.floor(Math.random() * others.length)].id;
        startMatch();
        return;
      }
      selectWho.textContent = "2P는 누구로 할래?";
      showToast("맞은편 직업을 골라요!");
      return;
    }
    startMatch();
  }

  function openSelect(mode) {
    audio.unlock();
    audio.ui();
    state.mode = mode;
    state.pickStep = 0;
    state.picks = [null, null];
    hideAllScreens();
    screenSelect.classList.remove("hidden");
    selectWho.textContent = "1P는 누구로 할래?";
    renderSelect();
  }

  function goHome() {
    audio.ui();
    state.scene = "title";
    hud.classList.add("hidden");
    hideAllScreens();
    screenTitle.classList.remove("hidden");
    toastEl.classList.add("hidden");
    bannerEl.classList.add("hidden");
    state.demo = [];
    state.ground = makeGround();
    ensureWorld();
  }

  function canvasPoint(ev) {
    const r = canvas.getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * W, y: ((ev.clientY - r.top) / r.height) * H };
  }

  function aimFromPointer(ev) {
    if (state.scene !== "battle" || state.phase !== "aim") return;
    if (state.mode === "cpu" && current().slot === 1) return;
    const p = current();
    const pt = canvasPoint(ev);
    state.angle = clamp((Math.atan2(p.y - 54 - pt.y, pt.x - p.x) * 180) / Math.PI, 8, 172);
    updateHud();
  }

  function canControl() {
    return state.scene === "battle" && state.phase === "aim" && !(state.mode === "cpu" && current().slot === 1);
  }

  window.addEventListener("pointerdown", () => audio.unlock(), { once: true });

  window.addEventListener("keydown", (e) => {
    if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
    state.keys.add(e.code);
    if (e.code === "Space" && canControl() && !state.charging) {
      state.charging = true;
      state.chargeDir = 1;
      state.power = 0;
    }
  });
  window.addEventListener("keyup", (e) => {
    state.keys.delete(e.code);
    if (e.code === "Space" && state.charging) fire();
  });

  canvas.addEventListener("pointerdown", (e) => {
    if (!canControl()) return;
    aimFromPointer(e);
    state.charging = true;
    state.chargeDir = 1;
    state.power = 0;
  });
  canvas.addEventListener("pointermove", (e) => { if (state.charging) aimFromPointer(e); });
  canvas.addEventListener("pointerup", () => { if (state.charging) fire(); });

  const fireBtn = document.getElementById("btn-fire");
  fireBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (!canControl()) return;
    state.charging = true;
    state.chargeDir = 1;
    state.power = 0;
  });
  fireBtn.addEventListener("pointerup", () => { if (state.charging) fire(); });

  document.getElementById("btn-ang-down").addEventListener("click", () => nudgeAngle(-3));
  document.getElementById("btn-ang-up").addEventListener("click", () => nudgeAngle(3));
  document.querySelectorAll("[data-mode]").forEach((btn) => btn.addEventListener("click", () => openSelect(btn.dataset.mode)));
  document.getElementById("btn-again").addEventListener("click", () => openSelect(state.mode));
  document.getElementById("btn-home").addEventListener("click", goHome);
  document.getElementById("btn-howto").addEventListener("click", () => {
    audio.ui();
    hideAllScreens();
    screenHowto.classList.remove("hidden");
  });
  document.getElementById("btn-howto-close").addEventListener("click", () => {
    audio.ui();
    hideAllScreens();
    screenTitle.classList.remove("hidden");
  });
  soundBtn.addEventListener("click", () => {
    audio.unlock();
    audio.muted = !audio.muted;
    soundBtn.textContent = audio.muted ? "🔇" : "🔊";
    if (!audio.muted) audio.ui();
  });

  let last = performance.now();
  function loop(now) {
    const dt = clamp(now - last, 8, 34);
    last = now;
    state.time = now;
    hideOverlays(dt);
    ensureWorld();

    if (state.scene !== "battle") {
      drawWorld(state.demo);
    } else {
      if (state.phase === "aim") {
        if (canControl()) {
          const face = current().facing;
          if (state.keys.has("ArrowUp") || state.keys.has("KeyW")) state.angle = clamp(state.angle + 0.11 * dt * face, 8, 172);
          if (state.keys.has("ArrowDown") || state.keys.has("KeyS")) state.angle = clamp(state.angle - 0.11 * dt * face, 8, 172);
        }
        stepMove(dt);
        stepCharge(dt);
        stepAi(dt);
        if (canControl()) updateHud();
      } else if (state.phase === "fly") {
        stepShot(dt);
      }
      stepFx(dt);
      drawWorld(state.players);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
