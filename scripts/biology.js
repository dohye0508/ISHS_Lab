/* ---------- 상태 ---------- */
var DECKS = window.BIO_DECKS || [];
var deckIdx = 0, topicSel = "전체", secSel = "전체", mode = "all", shuffle = false;
var marks = {}, order = [], pos = 0, flipped = false;
var $ = function (id) { return document.getElementById(id); };
function cur() { return DECKS[deckIdx]; }
function key() { return "ishslab-bio-" + cur().id; }
function load() { marks = {}; try { marks = JSON.parse(localStorage.getItem(key()) || "{}") || {}; } catch (e) {} }
function save() { try { localStorage.setItem(key(), JSON.stringify(marks)); } catch (e) {} }
function secOf(topic) { var S = cur().sections; for (var s in S) if (S[s].indexOf(topic) > -1) return s; return ""; }

/* ---------- 글 렌더 (수식, 선택지 줄 정리) ---------- */
function setText(el, text) {
  var parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/);
  parts.forEach(function (p) {
    if (!p) return;
    var disp = p.indexOf("$$") === 0;
    if (p.charAt(0) === "$" && p.length > 2) {
      var tex = disp ? p.slice(2, -2) : p.slice(1, -1);
      var span = document.createElement("span");
      try { window.katex.render(tex, span, { output: "mathml", throwOnError: false, displayMode: disp }); }
      catch (e) { span.textContent = tex; }
      if (disp) { span.style.display = "block"; span.style.margin = "6px 0"; }
      el.appendChild(span);
    } else { el.appendChild(document.createTextNode(p)); }
  });
}
var MARK = /^([①-⑩]|[ㄱ-ㅅ]\.|\(\d+\)|\([가-라A-Z]\)|[A-E][:.]|[㉠㉡])\s+(\S.*)$/;
function rich(host, text) {
  text.split("\n").forEach(function (line) {
    if (!line.trim()) return;
    var m = line.match(MARK);
    if (m) {
      var row = document.createElement("div"); row.className = "li";
      var mk = document.createElement("span"); mk.className = "mk"; mk.textContent = m[1];
      var tx = document.createElement("span"); setText(tx, m[2]);
      row.appendChild(mk); row.appendChild(tx); host.appendChild(row);
    } else {
      var p = document.createElement("p"); p.className = "p"; setText(p, line); host.appendChild(p);
    }
  });
}

/* ---------- 덱 구성 ---------- */
function build() {
  var d = cur(), list = [];
  d.cards.forEach(function (c, i) {
    var n = i + 1;
    if (secSel !== "전체" && secOf(c[0]) !== secSel) return;
    if (topicSel !== "전체" && c[0] !== topicSel) return;
    if (mode === "unsure" && marks[n] !== 2) return;
    if (mode === "new" && marks[n]) return;
    list.push(n);
  });
  if (shuffle) for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = list[i]; list[i] = list[j]; list[j] = t; }
  order = list;
  if (pos >= order.length) pos = Math.max(0, order.length - 1);
}

function tab(label, on, fn) {
  var b = document.createElement("button");
  b.type = "button"; b.className = "tab"; b.textContent = label; b.setAttribute("aria-pressed", on ? "true" : "false");
  b.addEventListener("click", fn); return b;
}
function renderTabs() {
  var t = $("teachers"); t.textContent = "";
  DECKS.forEach(function (d, i) {
    t.appendChild(tab(d.teacher, i === deckIdx, function () { deckIdx = i; secSel = "전체"; topicSel = "전체"; mode = "all"; pos = 0; load(); refresh(); }));
  });
  var tp = $("topics"); tp.textContent = "";
  var S = cur().sections;
  tp.appendChild(tab("전체", secSel === "전체", function () { secSel = "전체"; topicSel = "전체"; pos = 0; refresh(); }));
  Object.keys(S).forEach(function (s) {
    tp.appendChild(tab(s, secSel === s && topicSel === "전체", function () { secSel = s; topicSel = "전체"; pos = 0; refresh(); }));
  });
  if (secSel !== "전체") {
    S[secSel].forEach(function (x) {
      var b = tab("· " + x, topicSel === x, function () { topicSel = x; pos = 0; refresh(); });
      tp.appendChild(b);
    });
  }
}

/* ---------- 카드 ---------- */
function renderCard() {
  var stage = $("stage"); stage.textContent = "";
  var dis = !order.length;
  ["bFlip", "bPrev", "bNext", "bKnown", "bUnsure"].forEach(function (id) { $(id).disabled = dis; });
  if (dis) {
    var e = document.createElement("div"); e.className = "bio-empty";
    e.textContent = mode === "unsure" ? "헷갈려요로 표시한 카드가 아직 없습니다." : mode === "new" ? "안 본 카드가 없습니다. 모두 확인했어요." : "표시할 카드가 없습니다.";
    stage.appendChild(e); return;
  }
  var n = order[pos], c = cur().cards[n - 1], s = marks[n] || 0;
  var q = c[1], tagTxt = "";
  var tm = q.match(/^\((그림|표|그래프)[^)]*\)\s*/);
  if (tm) { tagTxt = tm[1] + " 문제"; q = q.slice(tm[0].length); }

  var card = document.createElement("div");
  card.className = "card" + (flipped ? " flipped" : "");
  card.tabIndex = 0; card.setAttribute("role", "button");
  card.setAttribute("aria-label", n + "번 카드. 눌러서 앞뒤 뒤집기");

  function face(rear) {
    var f = document.createElement("div"); f.className = "face" + (rear ? " rear" : "");
    f.setAttribute("aria-hidden", rear === flipped ? "false" : "true");
    var h = document.createElement("div"); h.className = "fhead";
    var no = document.createElement("span"); no.className = "no"; no.textContent = "No. " + String(n).padStart(3, "0");
    var bd = document.createElement("span"); bd.className = "badge s" + s; no.appendChild(bd);
    var wh = document.createElement("span"); wh.className = "where"; wh.textContent = c[0];
    if (tagTxt) { var tg = document.createElement("span"); tg.className = "tag"; tg.textContent = tagTxt; wh.appendChild(tg); }
    h.appendChild(no); h.appendChild(wh); f.appendChild(h);
    var body = document.createElement("div"); body.className = "body";
    if (rear) {
      var l = document.createElement("div"); l.className = "alabel"; l.textContent = "ANSWER"; body.appendChild(l);
      rich(body, c[2]);
    } else { rich(body, q); }
    f.appendChild(body);
    return f;
  }
  card.appendChild(face(false)); card.appendChild(face(true));
  stage.appendChild(card);
  bindCard(card);
}

function renderMeta() {
  var total = order.length;
  $("pos").textContent = total ? pos + 1 : 0;
  $("total").textContent = "/ " + total;
  var k = 0, u = 0;
  order.forEach(function (n) { if (marks[n] === 1) k++; else if (marks[n] === 2) u++; });
  $("statTxt").textContent = "외웠어요 " + k + " · 헷갈려요 " + u;
  $("bar").style.width = total ? (k / total * 100) + "%" : "0";
  if (total) {
    var s = marks[order[pos]] || 0;
    $("bKnown").setAttribute("aria-pressed", s === 1 ? "true" : "false");
    $("bUnsure").setAttribute("aria-pressed", s === 2 ? "true" : "false");
  }
  $("bFlip").textContent = flipped ? "문제 보기" : "정답 보기";
  Array.prototype.forEach.call($("modeSeg").children, function (b) { b.setAttribute("aria-pressed", b.dataset.m === mode ? "true" : "false"); });
  $("shuf").setAttribute("aria-pressed", shuffle ? "true" : "false");
}
function refresh(keep) {
  if (!keep) { build(); flipped = false; }
  renderTabs(); renderCard(); renderMeta();
  try { localStorage.setItem("ishslab-bio-last", JSON.stringify({ d: cur().id, n: order[pos] || 1 })); } catch (e) {}
}

/* ---------- 동작 ---------- */
function flip() {
  if (!order.length) return;
  flipped = !flipped;
  var c = document.querySelector(".card"); if (c) c.classList.toggle("flipped", flipped);
  var fs = document.querySelectorAll(".face");
  if (fs.length === 2) { fs[0].setAttribute("aria-hidden", flipped ? "true" : "false"); fs[1].setAttribute("aria-hidden", flipped ? "false" : "true"); }
  renderMeta();
}
function go(d) { if (!order.length) return; pos = (pos + d + order.length) % order.length; flipped = false; refresh(true); }
function mark(v) {
  if (!order.length) return;
  var n = order[pos];
  if (marks[n] === v) delete marks[n]; else marks[n] = v;
  save();
  if (mode === "all") { if (marks[n] && order.length > 1) go(1); else refresh(true); }
  else { var keepShuffle = shuffle; shuffle = false; build(); shuffle = keepShuffle; flipped = false; refresh(true); }
}
function bindCard(card) {
  var sx = 0, sy = 0, moved = false, down = false;
  card.addEventListener("pointerdown", function (e) { down = true; moved = false; sx = e.clientX; sy = e.clientY; });
  card.addEventListener("pointermove", function (e) { if (down && Math.abs(e.clientX - sx) > 12) moved = true; });
  card.addEventListener("pointerup", function (e) {
    if (!down) return; down = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    else if (!moved) flip();
  });
  card.addEventListener("pointercancel", function () { down = false; });
  card.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); flip(); } });
}
document.addEventListener("keydown", function (e) {
  if (!$("drawer").hidden) { if (e.key === "Escape") closeGrid(); return; }
  var tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT") return;
  if (e.key === "ArrowRight") go(1);
  else if (e.key === "ArrowLeft") go(-1);
  else if (e.key === " " && tag !== "BUTTON") { e.preventDefault(); flip(); }
  else if (e.key === "1") mark(1);
  else if (e.key === "2") mark(2);
});

/* ---------- 목록 ---------- */
function openGrid() {
  var g = $("grid"); g.textContent = "";
  var inOrder = {}; order.forEach(function (n) { inOrder[n] = true; });
  var now = order[pos];
  cur().cards.forEach(function (c, i) {
    var n = i + 1, b = document.createElement("button");
    b.type = "button"; b.textContent = n;
    b.className = "cell" + (marks[n] ? " s" + marks[n] : "") + (n === now ? " cur" : "") + (inOrder[n] ? "" : " off");
    b.addEventListener("click", function () { jumpTo(n); });
    g.appendChild(b);
  });
  $("drawer").hidden = false;
  var cc = g.querySelector(".cur"); if (cc) cc.scrollIntoView({ block: "center" });
}
function closeGrid() { $("drawer").hidden = true; }
function jumpTo(n) {
  if (n < 1 || n > cur().cards.length) return;
  var i = order.indexOf(n);
  if (i < 0) { secSel = "전체"; topicSel = "전체"; mode = "all"; shuffle = false; build(); i = order.indexOf(n); }
  pos = i; flipped = false; closeGrid(); refresh(true);
}

$("openGrid").addEventListener("click", openGrid);
$("closeGrid").addEventListener("click", closeGrid);
$("drawer").addEventListener("click", function (e) { if (e.target === $("drawer")) closeGrid(); });
$("jumpForm").addEventListener("submit", function (e) { e.preventDefault(); var v = parseInt($("jumpIn").value, 10); if (v) jumpTo(v); });
$("bPrev").addEventListener("click", function () { go(-1); });
$("bNext").addEventListener("click", function () { go(1); });
$("bFlip").addEventListener("click", flip);
$("bKnown").addEventListener("click", function () { mark(1); });
$("bUnsure").addEventListener("click", function () { mark(2); });
$("modeSeg").addEventListener("click", function (e) { var m = e.target.dataset && e.target.dataset.m; if (m) { mode = m; pos = 0; refresh(); openGrid(); } });
$("shuf").addEventListener("click", function () { shuffle = !shuffle; pos = 0; refresh(); openGrid(); });
$("reset").addEventListener("click", function () {
  var b = $("reset");
  if (b.dataset.armed === "1") { marks = {}; save(); b.dataset.armed = ""; b.textContent = "이 선생님 기록 지우기"; pos = 0; refresh(); openGrid(); }
  else { b.dataset.armed = "1"; b.textContent = "한 번 더 누르면 지워집니다"; setTimeout(function () { b.dataset.armed = ""; b.textContent = "이 선생님 기록 지우기"; }, 3000); }
});
$("theme-toggle").addEventListener("click", function () {
  var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch (e) {}
});

/* ---------- 시작 ---------- */
(function () {
  if (!DECKS.length) { $("stage").textContent = "biology_data 폴더의 카드 파일을 찾지 못했습니다."; return; }
  try {
    var last = JSON.parse(localStorage.getItem("ishslab-bio-last") || "null");
    if (last) DECKS.forEach(function (d, i) { if (d.id === last.d) deckIdx = i; });
    load(); build();
    if (last && last.d === cur().id) { var i = order.indexOf(last.n); if (i > -1) pos = i; }
  } catch (e) { load(); build(); }
  refresh(true);
})();
