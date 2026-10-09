/* ---------- 상태 ---------- */
var T = window.KH_TRACKS || [];
var GROUPS = window.KH_GROUPS || {};
var DIR = window.KH_AUDIO_DIR || "korean_history_data/audio/";
var $ = function (id) { return document.getElementById(id); };
var audio = $("audio"), seek = $("seek");
var cur = -1, seeking = false;
var store = {
  get: function (k) { try { return localStorage.getItem("ishslab-kh-" + k); } catch (e) { return null; } },
  set: function (k, v) { try { localStorage.setItem("ishslab-kh-" + k, v); } catch (e) {} }
};
function fmt(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

/* ---------- 목록 ---------- */
var list = $("list"), els = [];
T.forEach(function (t, i) {
  if (GROUPS[i]) { var g = document.createElement("div"); g.className = "group"; g.textContent = GROUPS[i]; list.appendChild(g); }
  var el = document.createElement("div");
  el.className = "track"; el.tabIndex = 0; el.setAttribute("role", "button");
  var num = document.createElement("div"); num.className = "num"; num.textContent = t[1] ? t[1].replace("강", "") : "·";
  var name = document.createElement("div"); name.className = "name";
  if (t[1] && t[1] !== "부록") { var sm = document.createElement("small"); sm.textContent = t[1]; name.appendChild(sm); }
  name.appendChild(document.createTextNode(t[2]));
  var eq = document.createElement("div"); eq.className = "eq"; eq.innerHTML = "<i></i><i></i><i></i>";
  var dur = document.createElement("div"); dur.className = "dur"; dur.textContent = fmt(t[3]);
  [num, name, eq, dur].forEach(function (c) { el.appendChild(c); });
  var act = function () { cur === i ? toggle() : load(i, true); };
  el.addEventListener("click", act);
  el.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); act(); } });
  list.appendChild(el); els.push(el);
});
var total = T.reduce(function (a, t) { return a + t[3]; }, 0);
$("chipCount").textContent = T.length + "개 트랙";
$("chipTime").textContent = "총 " + Math.round(total / 60) + "분";

/* ---------- 재생 ---------- */
var ICON_PLAY = '<path d="M8 5v14l11-7z"/>', ICON_PAUSE = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
function setPlaying(p) {
  $("playIcon").innerHTML = p ? ICON_PAUSE : ICON_PLAY;
  els.forEach(function (e, k) { e.classList.toggle("playing", p && k === cur); });
}
function load(i, play) {
  if (i < 0 || i >= T.length) return;
  cur = i;
  audio.src = DIR + T[i][0];
  audio.playbackRate = parseFloat($("speed").value);
  els.forEach(function (e, k) { e.classList.toggle("on", k === i); });
  $("now").textContent = (T[i][1] ? T[i][1] + " · " : "") + T[i][2];
  $("tot").textContent = fmt(T[i][3]); $("cur").textContent = "0:00"; seek.value = 0; seek.style.setProperty("--p", "0%");
  store.set("last", i);
  $("startLbl").textContent = "이어서 듣기";
  els[i].scrollIntoView({ block: "center", behavior: "smooth" });
  if (play) audio.play().catch(function () {});
}
function toggle() { if (cur < 0) return load(0, true); audio.paused ? audio.play() : audio.pause(); }

audio.addEventListener("play", function () { setPlaying(true); });
audio.addEventListener("pause", function () { setPlaying(false); });
audio.addEventListener("loadedmetadata", function () { $("tot").textContent = fmt(audio.duration); audio.playbackRate = parseFloat($("speed").value); });
audio.addEventListener("timeupdate", function () {
  if (!audio.duration) return;
  var p = audio.currentTime / audio.duration * 1000;
  if (!seeking) { seek.value = p; seek.style.setProperty("--p", (p / 10) + "%"); }
  $("cur").textContent = fmt(audio.currentTime);
});
audio.addEventListener("ended", function () {
  if ($("auto").checked && cur + 1 < T.length) load(cur + 1, true); else setPlaying(false);
});

seek.addEventListener("input", function () { seeking = true; seek.style.setProperty("--p", (seek.value / 10) + "%"); $("cur").textContent = fmt(audio.duration * seek.value / 1000); });
seek.addEventListener("change", function () { if (audio.duration) audio.currentTime = audio.duration * seek.value / 1000; seeking = false; });

$("play").onclick = toggle;
$("prev").onclick = function () { if (audio.currentTime > 3) audio.currentTime = 0; else load(Math.max(0, cur - 1), !audio.paused); };
$("next").onclick = function () { load(Math.min(T.length - 1, cur + 1), !audio.paused || cur < 0); };
$("startBtn").onclick = function () { cur < 0 ? load(0, true) : toggle(); };

$("auto").checked = store.get("auto") !== "0";
$("auto").onchange = function (e) { store.set("auto", e.target.checked ? "1" : "0"); };
var sp = store.get("speed"); if (sp) $("speed").value = sp;
$("speed").onchange = function (e) { audio.playbackRate = parseFloat(e.target.value); store.set("speed", e.target.value); };

document.addEventListener("keydown", function (e) {
  var tg = e.target.tagName;
  if (tg === "SELECT" || tg === "BUTTON" || (tg === "INPUT" && e.target.type !== "range") || e.target.classList.contains("track")) return;
  if (e.code === "Space") { e.preventDefault(); toggle(); }
  else if (e.code === "ArrowRight" && e.shiftKey) $("next").click();
  else if (e.code === "ArrowLeft" && e.shiftKey) $("prev").click();
  else if (e.code === "ArrowRight") audio.currentTime += 10;
  else if (e.code === "ArrowLeft") audio.currentTime -= 10;
});

$("theme-toggle").addEventListener("click", function () {
  var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch (e) {}
});

var last = parseInt(store.get("last"), 10);
if (!isNaN(last) && last >= 0 && last < T.length) { load(last, false); window.scrollTo(0, 0); }
