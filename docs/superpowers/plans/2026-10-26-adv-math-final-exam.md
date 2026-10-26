# Advanced Math Studio 중간/기말 분리 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 문제집 창을 중간고사/기말고사로 나누고, 기말(급수 50 · 미분방정식 10 · 실전 모의 10문항)을 판정·구간·∞ 답을 받는 별도 채점과 함께 추가한다.

**Architecture:** `adv_math.php` 한 페이지 안에서 시험 탭 → 과목 탭 2단 구조로 바꾼다. 기말 기능은 순수 채점 모듈 `scripts/adv_final_grading.js`와 화면 모듈 `scripts/adv_final.js`에 두고, `logic.js`·`grader.js`의 전역 함수(`gradeProblem`, `loadCurrentProblem`, `updateNavButtons`)를 기말 세션에서만 감싼다. 기말 문제는 `window.finalCollections`에 따로 모은다.

**Tech Stack:** PHP 페이지(정적 HTML/JS), MathLive, MathJax 3, Pyodide + SymPy 채점기, Node 22(`node:vm`, `node:assert`) 검사, Python SymPy 1.14 + mpmath 검증, Playwright(msedge) 브라우저 검사.

**Spec:** `docs/superpowers/specs/2026-10-26-adv-math-final-exam-design.md`

## Global Constraints

- `scripts/grader.js`, `scripts/logic.js`, `sql/`, `api/`는 수정하지 않는다.
- 기존 스크립트 태그의 `?v=` 값은 바꾸지 않는다(기존 검사 스크립트가 문자열로 확인한다). 새 태그만 추가한다.
- `adv_math.php`의 다음 주석·함수 시작 줄은 그대로 두고 순서도 유지한다. 기존 검사 스크립트가 이 문자열 사이를 잘라 실행한다: `        function escapeHtmlText`, `        // Override logic.js's renderMath`, `        function normalizeLatex`, `        // 문장형`, `        function buildProblemHtml`, `        function renderResult(res)`, `        function readHistory`, `        function buildProofChapterCard`, `        const proofState =`, `        window.addEventListener('DOMContentLoaded'`, `        async function startAlgebraGame`, `        // Single "Get Started"`.
- 위 구간 안에 넣는 코드는 그 구간만 따로 실행해도 오류가 나지 않아야 한다(`window.finalGrading`이 없을 수 있으므로 반드시 존재 확인).
- 기말 데이터 id: 문제집 `fin_{ser|ode|mock}_{두자리}_v1`, 문항 `{문제집id}_{영문 소문자·밑줄 키}`.
- 기말 정답 형식: 식·값은 LaTeX 그대로, 판정 `verdict:절대수렴|조건수렴|수렴|발산`, 구간 `interval:[a,b)` 꼴, 무한대 `\infty`.
- 기말 `tools`: `'verdict' | 'interval' | 'value' | 'expr'`.
- 함수 답의 독립변수는 `x`. 미분방정식은 초깃값 문제만.
- 문제집당 레벨 구성: 5문항 세트는 `[2,3,3,4,5]`, 모의는 2–5 혼합.
- 교과서 쪽 범위: 급수 98–155, 미분방정식 156–191, 모의 98–191.
- 교과서 예제·문제를 그대로 옮기지 않는다. 교과서 유형을 따르되 수치·구성은 새로 만든다.
- 기존 "역삼각함수 심화 7 · 급수와 국소 구조"의 arcsin 매클로린 계수 유형은 쓰지 않는다.
- localStorage 키: `adv_last_exam`(`'midterm'|'final'`), `adv_final_selected`(문제집 id). 모든 읽기·쓰기는 try/catch.
- git 커밋 메시지에 `Co-Authored-By` 줄을 넣지 않는다.
- 사용자에게 보이는 문구는 한국어.

## Review Focus

1. **MathLive가 만든 구간 표기** — 템플릿 버튼으로 `[−1, 1)`을 입력하면 `\left\lbrack -1,1\right)` 같은 값이 나올 수 있다. 정답으로 처리돼야 한다. → Task 1 정규화 테스트, Task 4 브라우저에서 실제 버튼 입력.
2. **기말을 푼 뒤 중간으로 돌아가기** — 홈 버튼 → 중간 문제집 시작 시 `state.exam`이 `'midterm'`으로 돌아가, 중간 `발산` 문제에서 "포기"가 예전처럼 정답이고 포기 버튼도 다시 보여야 한다. → Task 4 브라우저 테스트.
3. **판정 답을 손으로 입력** — `절대 수렴`, `\text{ 조건수렴 }`처럼 공백이 섞여도 정답, `절대수렴함`·`수렴함`은 오답. → Task 1 테스트.
4. **저장된 선택이 사라졌거나 저장소가 막힘** — `adv_final_selected`가 없는 id(버전 변경)이거나 localStorage 접근이 예외를 던져도 기본 화면(기말 → 급수 탭)이 떠야 한다. → Task 3 테스트.
5. **모바일 폭(390px)** — 시험 탭·과목 탭·기말 도구 줄이 가로로 넘치지 않아야 한다. → Task 3·4 브라우저 테스트.

---

## 시작 전 (Task 0): 작업 위치와 기준선

**Files:** 없음 (확인만)

- [ ] **Step 1: 사용자에게 미커밋 변경 처리 방법 확인**

`adv_math.php`, `scripts/logic.js`, `scripts/grader.js`, `README.md` 등에 사용자의 미커밋 변경이 있다(`git diff --stat`로 383줄 추가). 워크트리를 새로 만들면 이 변경이 빠지므로 **현재 폴더에서** 작업한다. 사용자에게 (a) 기존 변경을 먼저 커밋할지, (b) 이 작업의 커밋을 할지 묻고 답에 따른다. 커밋을 한다면 먼저 `git switch -c feat/final-exam`.

- [ ] **Step 2: 기존 검사 기준선 기록**

Run (각각):
```bash
node scripts/check_lesson_calculus.cjs python
node scripts/check_inverse_hyperbolic.cjs python
node scripts/check_polar.cjs python
node scripts/check_algebra.cjs python
node scripts/check_proof_explanations.cjs
node scripts/check_orthogonal_browser.cjs --layout-only
```
각 명령의 마지막 PASS/FAIL 줄을 `tmp/final_review/baseline.txt`에 적어 둔다. 이미 실패하는 검사가 있으면 그 상태가 기준선이다(이 작업으로 고치지 않는다).

---

### Task 1: 기말 채점 모듈

**Files:**
- Create: `scripts/adv_final_grading.js`
- Test: `scripts/check_final_grading.cjs`

**Interfaces:**
- Produces: `window.finalGrading` 객체
  - `answerKind(solTex: string) -> 'verdict' | 'interval' | 'infinity' | 'plain'`
  - `normalizeVerdict(tex: string) -> string` — `\text{}`·`\mathrm{}` 껍질, 공백, `\,`, `\;`, `~` 제거
  - `parseInterval(tex: string) -> {left: '['|'(', a: string, b: string, right: ']'|')'} | null` — `\left`, `\right`, `\mleft`, `\mright`, `\lbrack`→`[`, `\rbrack`→`]`, `\lparen`→`(`, `\rparen`→`)`, `\lbrace`/`\rbrace` 거부, 공백 제거 후 최상위 쉼표 하나로 나눔
  - `isInfinity(tex: string, sign: 1 | -1) -> boolean` — `\infty`, `+\infty`, `∞`, `\infinity`(MathLive)와 음수형
  - `gradeFinal(userTex: string, solTex: string, baseGrade: (u: string, s: string) => Promise<string>) -> Promise<string>` — 반환값은 `"CORRECT"`, `"INCORRECT"`, `"EMPTY INPUT"` 또는 `baseGrade`의 결과
  - `displaySolution(solTex: string) -> string` — `verdict:X` → `\text{X}`, `interval:I` → `I`, 그 외 그대로

규칙 (spec §7):
- 빈 입력 → `"EMPTY INPUT"`.
- `verdict:수렴` → 사용자 판정이 `수렴` 또는 `절대수렴`이면 정답. 나머지 판정은 정확히 같은 말만.
- `interval:` → 괄호 종류 둘 다 같고, 각 끝점이 무한대면 `isInfinity`로, 아니면 `baseGrade(u, s) === "CORRECT"`.
- `\infty` → `isInfinity(user, 1)`.
- `plain` → `baseGrade(userTex, solTex)`.
- 판정·구간·무한대 정답에 대해서는 `baseGrade`를 끝점 비교 외에 호출하지 않는다("포기"가 Pyodide로 넘어가지 않게).

- [ ] **Step 1: 실패하는 테스트 작성** (`scripts/check_final_grading.cjs`)

`vm` 컨텍스트에 `window = {}`를 만들고 `scripts/adv_final_grading.js`를 실행한다. `baseGrade`는 스텁 `(u, s) => Promise.resolve(u.replace(/\s/g,'') === s.replace(/\s/g,'') ? 'CORRECT' : 'INCORRECT')`.

```js
const g = ctx.window.finalGrading;
const cases = [
  // [user, solution, expected]
  ['\\text{절대수렴}', 'verdict:절대수렴', 'CORRECT'],
  ['절대 수렴', 'verdict:절대수렴', 'CORRECT'],
  ['\\text{ 조건수렴 }', 'verdict:조건수렴', 'CORRECT'],
  ['\\text{절대수렴}', 'verdict:수렴', 'CORRECT'],
  ['\\text{수렴}', 'verdict:절대수렴', 'INCORRECT'],
  ['\\text{조건수렴}', 'verdict:수렴', 'INCORRECT'],
  ['절대수렴함', 'verdict:절대수렴', 'INCORRECT'],
  ['포기 ', 'verdict:발산', 'INCORRECT'],
  ['', 'verdict:발산', 'EMPTY INPUT'],
  ['[-1,1)', 'interval:[-1,1)', 'CORRECT'],
  ['\\left\\lbrack -1,1\\right)', 'interval:[-1,1)', 'CORRECT'],
  ['\\mleft[-1,1\\mright)', 'interval:[-1,1)', 'CORRECT'],
  ['(-1,1)', 'interval:[-1,1)', 'INCORRECT'],
  ['[-1,1]', 'interval:[-1,1)', 'INCORRECT'],
  ['(-\\infty,\\infty)', 'interval:(-\\infty,\\infty)', 'CORRECT'],
  ['(-\\infty,2)', 'interval:(-\\infty,\\infty)', 'INCORRECT'],
  ['-1\\le x<1', 'interval:[-1,1)', 'INCORRECT'],
  ['\\infty', '\\infty', 'CORRECT'],
  ['+\\infty', '\\infty', 'CORRECT'],
  ['∞', '\\infty', 'CORRECT'],
  ['-\\infty', '\\infty', 'INCORRECT'],
  ['포기', '\\infty', 'INCORRECT'],
  ['\\frac{1}{6}', '\\frac{1}{6}', 'CORRECT'],
];
for (const [u, s, want] of cases) assert.equal(await g.gradeFinal(u, s, stub), want, `${u} vs ${s}`);
let calls = 0; await g.gradeFinal('포기', 'verdict:발산', () => { calls++; return Promise.resolve('CORRECT'); });
assert.equal(calls, 0);
assert.equal(g.displaySolution('verdict:조건수렴'), '\\text{조건수렴}');
assert.equal(g.displaySolution('interval:[-1,1)'), '[-1,1)');
assert.equal(g.displaySolution('\\frac{1}{6}'), '\\frac{1}{6}');
console.log('PASS: final grading rules');
```

- [ ] **Step 2: 실패 확인**

Run: `node scripts/check_final_grading.cjs`
Expected: FAIL (`ENOENT` 또는 `finalGrading` undefined)

- [ ] **Step 3: `scripts/adv_final_grading.js` 구현**

IIFE로 감싸 `window.finalGrading = { answerKind, normalizeVerdict, parseInterval, isInfinity, gradeFinal, displaySolution }`만 노출한다. DOM·`state`를 참조하지 않는다.

- [ ] **Step 4: 통과 확인**

Run: `node scripts/check_final_grading.cjs`
Expected: `PASS: final grading rules`

- [ ] **Step 5: 커밋** (Task 0에서 커밋하기로 한 경우)

```bash
git add scripts/adv_final_grading.js scripts/check_final_grading.cjs
git commit -m "feat(adv-math): add final-exam answer grading rules"
```

---

### Task 2: 기말 데이터 형식, 검증 도구, 미분방정식 1세트

**Files:**
- Create: `data/math/final/ode.js`
- Create: `scripts/check_final.cjs`
- Create: `scripts/check_final.py`

**Interfaces:**
- Consumes: Task 1 `finalGrading.answerKind`, `parseInterval`
- Produces:
  - 데이터 파일 공통 패턴: `window.finalCollections = window.finalCollections || []; window.finalCollections.push({ id, unit, name, description, problems })`. 문항 `{ id, template: id, level, title, latex, solution, explanation, answerMode: 'exact', page, tools }`. 문장·해설은 `lesson_calculus_collections.js`의 `tex()` 헬퍼(`$수식$`과 한국어 → `\text{}`)와 같은 파일 내 헬퍼로 만든다.
  - `node scripts/check_final.cjs [--structure-only] [--complete] [--payload] [python경로]`
  - `scripts/check_final.py`: stdin JSON `{problems: [...], pythonGrader: string}`을 `sys.stdin.buffer.read().decode('utf-8')`로 읽는다.
  - 이후 데이터 Task는 `check_final.py`의 `TARGETS` 딕셔너리에 문항 id별 항목만 추가한다.

**`check_final.cjs` 구조 검사** (spec §10, 위반 시 문항 id를 포함해 assert 실패):
- `data/math/final/*.js`를 `ode.js`, `series.js`, `mock.js` 순서로, 존재하는 것만 실행
- 문제집·문항 id 중복 없음, 접두어가 `unit`과 일치(`fin_ser_`↔`series`, `fin_ode_`↔`ode`, `fin_mock_`↔`mock`), 문항 id가 문제집 id로 시작
- 세트 크기: series·ode 5, mock 10. 5문항 세트의 정렬된 레벨이 `[2,3,3,4,5]`
- `tools` 유효, 정답 형식과 일치: `interval:` ⇔ `tools==='interval'`, `verdict:(절대수렴|조건수렴|수렴)` ⇒ `tools==='verdict'`, `verdict:발산` ⇒ `tools ∈ {verdict, value}`, `tools==='expr'` ⇒ 정답에 `x` 포함
- `interval:` 정답은 `finalGrading.parseInterval`로 해석 가능
- `latex`·`explanation`: `$` 없음, 중괄호 짝, 한국어 `\text{}` 포함, `buildProblemHtml()` 결과에 한국어 `\text{`가 남지 않음 (`adv_math.php`에서 `escapeHtmlText`~`renderMath` 구간을 잘라 실행 — `check_lesson_calculus.cjs`와 같은 방식)
- `page` 정수이고 단원 범위 안
- `--complete`: series 10세트, ode 2세트, mock 1세트. mock은 `page<=155` 8문항 + `page>=156` 2문항
- `--payload`: JSON 출력 후 종료. 그 밖에는 `python`(또는 인자)으로 `check_final.py`를 `spawnSync`(utf8)로 실행

**`check_final.py` 검증:** `TARGETS[id] = (kind, target)`

| kind | target | 확인 |
|---|---|---|
| `value` | SymPy 식 또는 mpmath 값 | 파싱한 정답과 차이 < 1e-20 (`mp.dps=30`) |
| `infinity` | `None` | 정답이 `\infty` |
| `expr` | `f(x)` 파이썬 함수(mpmath) + 확인할 x 목록 | 각 점에서 차이 < 1e-20 |
| `ode` | `(lhs_minus_rhs(y, x), x0, y0)` | `y=정답`을 대입해 `simplify(...)==0`, `y(x0)==y0` |
| `verdict` | 판정 함수가 돌려주는 문자열 | `solution == 'verdict:' + 결과`. 판정 함수는 `Sum(...).is_convergent()`를 쓰고, SymPy가 못 하면 해설의 비교 대상과의 비 극한(`limit`)으로 판단 |
| `interval` | `(left, a, b, right)` | 괄호 일치, 끝점 값 일치 (`oo`/`-oo` 포함) |

공통: `value`·`expr`·`ode` 정답은 실제 채점기로 `grade(sol, sol, False, True) == 'CORRECT'`, `grade('('+sol+')+1', sol, False, True) != 'CORRECT'`. `interval`의 유한 끝점은 `grade(ep, ep, False, True) == 'CORRECT'`. `TARGETS` 키 집합과 payload 문항 id 집합이 같아야 한다.

**미분방정식 1세트** `fin_ode_01_v1` · `미분방정식 1 · 풀이` · description `방향장, 오일러, 변수분리형, 선형, 베르누이 · 교과서 p.159–177`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `euler_two_steps` | 2 | value | 간단한 $y'=f(x,y)$에 간격 $h$로 오일러 방법 2단계를 적용한 근삿값 (정확한 분수) | 167 |
| `separable_ivp` | 3 | expr | 변수분리형 초깃값 문제의 해 $y(x)$ | 172 |
| `separable_equilibrium` | 3 | value | $y'=y(a-y)$ 꼴 초깃값 문제에서 특정 $x$의 값이나 $x\to\infty$ 극한 (상수해·방향장 해석 포함) | 171 |
| `linear_integrating_factor` | 4 | expr | 적분인자가 필요한 선형미분방정식 초깃값 문제의 해 | 175 |
| `bernoulli_ivp` | 5 | expr | $u=y^{1-n}$ 치환이 필요한 베르누이 초깃값 문제의 해 | 177 |

- [ ] **Step 1: `check_final.cjs` 작성 → 데이터가 없을 때 실패 확인**

Run: `node scripts/check_final.cjs --structure-only`
Expected: FAIL (`finalCollections`가 비어 있음: "no final collections")

- [ ] **Step 2: `data/math/final/ode.js`에 1세트 작성**

- [ ] **Step 3: 구조 검사 통과**

Run: `node scripts/check_final.cjs --structure-only`
Expected: `PASS: structure (1 collections, 5 problems)`

- [ ] **Step 4: `check_final.py` 작성, 5문항 `TARGETS` 추가, 실행**

Run: `node scripts/check_final.cjs python`
Expected: `PASS: 5 final answers verified and graded`

- [ ] **Step 5: 일부러 틀린 값으로 검사가 잡는지 확인**

`bernoulli_ivp` 정답의 계수 하나를 임시로 바꿔 실행 → 그 id로 FAIL. 원래대로 되돌리고 다시 PASS 확인.

- [ ] **Step 6: 커밋**

```bash
git add data/math/final/ode.js scripts/check_final.cjs scripts/check_final.py
git commit -m "feat(adv-math): add final-exam data checks and ODE set 1"
```

---

### Task 3: 시험 탭과 기말 과목 탭, 시작 카드

**Files:**
- Modify: `adv_math.php` (스타일 블록의 `.subject-tabs` 근처, 문제집 창 `:390-438`, 시작 카드 `:335-361`, 인라인 스크립트의 `switchModalSubject` `:776-787`, `returnToCollections` `:829-835`, `DOMContentLoaded` 그리드 구성 `:896-935`, `selectAlgebraCollection` `:943-950`, 스크립트 태그 `:535-554`)
- Create: `scripts/adv_final.js`
- Create: `scripts/check_final_browser.cjs`

**Interfaces:**
- Consumes: `window.finalCollections` (Task 2), `buildCollectionCard(col, onClick)` (`adv_math.php`), `closeCollectionModal()` (`logic.js`)
- Produces (전역):
  - `adv_math.php`: `EXAM_OF: {trig, hyp, polar, apps, algebra, proof: 'midterm', series, ode, mock: 'final'}`, `switchExam(exam: 'midterm'|'final')`, `applyExamToLanding(exam)`, `selectMidtermCollection(id)` (기존 미적분 카드 onClick 대체: `selectedSubject='calc'`, `selectCollection(id)`, 라벨 `중간 · {name}`, `applyExamToLanding('midterm')`, `adv_last_exam='midterm'` 저장). `selectAlgebraCollection`도 같은 라벨·저장 처리.
  - `scripts/adv_final.js`: `renderFinalGrids()`, `selectFinalCollection(id: string)` (`selectedSubject='final'`, 숨은 입력 `#sel-collection-value-final`, 라벨 `기말 · {name}`, 선택 표시, 저장, `applyExamToLanding('final')`, 창 닫기), `restoreLastSelection()`, `readStore(key)`, `writeStore(key, value)` (try/catch)

**화면 (spec §5.1–5.2):**
- `.subject-tabs` 위에 `<div class="exam-tabs">` + `#exam-tab-midterm`(중간고사), `#exam-tab-final`(기말고사). 기존 6개 과목 탭에 `data-exam="midterm"`, 새 탭 `#subject-tab-series`(급수) `#subject-tab-ode`(미분방정식) `#subject-tab-mock`(실전 모의)에 `data-exam="final"`.
- 새 섹션 `#modal-section-series|ode|mock`, 그리드 `#collection-grid-series|ode|mock`, 제목 `▶ 급수 · 교과서 III단원 (p.98–155)`, `▶ 미분방정식 · 교과서 IV단원 (p.156–191)`, `▶ 실전 모의 · 급수 8 + 미분방정식 2`.
- `.exam-tab`: `.subject-tab`과 같은 색·테두리·`border-radius`, `font-size: 1.02rem`, `font-weight: 800`. 590px 이하에서 두 버튼 `flex: 1 1 0`.
- `switchModalSubject(subject)`: 기존 동작 + 시험 탭 active 토글, 다른 시험의 과목 탭 `hidden`, 시험별 마지막 과목(`lastTabByExam`) 갱신. `switchExam(exam)` → `switchModalSubject(lastTabByExam[exam])`. 기본 `lastTabByExam = {midterm: 'trig', final: 'series'}`.
- 시작 카드: 기존 `<ul class="rules-list">`에 `id="rules-midterm"`, 새 `<ul class="rules-list hidden" id="rules-final">`(spec §5.2의 네 문장). `.option-section`에 `id="options-midterm"`. `applyExamToLanding(exam)`이 둘을 토글한다.
- 숨은 입력 `<input type="hidden" id="sel-collection-value-final" value="">`.
- 스크립트 태그: `data/math/final/ode.js`(그리고 이후 `series.js`, `mock.js`)를 `proof_sources.js` 다음에, `scripts/adv_final_grading.js`와 `scripts/adv_final.js`를 `scripts/logic.js` 다음에. 새 태그 버전은 `?v=20261026_final`.
- 인라인 `DOMContentLoaded`(그리드 구성) 끝에서 `renderFinalGrids()` 다음 `restoreLastSelection()` 호출.
- `restoreLastSelection()`: `adv_last_exam`이 `'final'`이고 `adv_final_selected`가 `finalCollections`에 있으면 그 문제집을 선택 상태로 만든다(창은 열지 않음). `'midterm'`이면 현재 선택된 중간 문제집 라벨에 `중간 · `을 붙이고 `applyExamToLanding('midterm')`. 저장값이 없거나 무효하거나 저장소 예외면 `applyExamToLanding('final')`, `lastModalTab='series'`.
- `returnToCollections()`는 바꾸지 않는다(`lastModalTab`을 열면 시험 탭도 같이 맞춰짐).

- [ ] **Step 1: 실패하는 브라우저 테스트 작성** (`scripts/check_final_browser.cjs`)

서버·Playwright 준비는 `scripts/check_orthogonal_browser.cjs`와 같다(모의 `/api/` 응답, PHP 머리 제거, `channel: 'msedge'`, 스크린샷 `tmp/final_review/`). `--layout-only`면 채점기 준비를 기다리지 않는다. 이 Task의 검사:

```js
await page.evaluate(() => localStorage.clear()); await page.reload({waitUntil: 'networkidle'});
await page.evaluate(() => openCollectionModal());
assert(await page.locator('#exam-tab-final.active').isVisible());
assert(await page.locator('#subject-tab-series.active').isVisible());
assert(await page.locator('#subject-tab-trig').isHidden());
await page.click('#exam-tab-midterm');
assert(await page.locator('#subject-tab-trig.active').isVisible());
assert.equal(await page.locator('.subject-tab[data-exam="midterm"]:visible').count(), 6);
assert(await page.locator('#subject-tab-series').isHidden());
await page.click('#exam-tab-final'); await page.click('#subject-tab-ode');
await page.click('#collection-grid-ode .collection-card[data-id="fin_ode_01_v1"]');
assert.equal(await page.textContent('#current-collection-name'), '기말 · 미분방정식 1 · 풀이');
assert(await page.locator('#rules-final').isVisible()); assert(await page.locator('#options-midterm').isHidden());
await page.reload({waitUntil: 'networkidle'});
assert.equal(await page.textContent('#current-collection-name'), '기말 · 미분방정식 1 · 풀이');
// 무효한 저장값
await page.evaluate(() => { localStorage.setItem('adv_last_exam', 'final'); localStorage.setItem('adv_final_selected', 'fin_ser_99_v0'); });
await page.reload({waitUntil: 'networkidle'});
await page.evaluate(() => openCollectionModal());
assert(await page.locator('#subject-tab-series.active').isVisible());
// 저장소 예외: 기존 테마 코드는 try/catch가 없으므로 기말 키(adv_*)만 막는다
await page.addInitScript(() => {
  for (const name of ['getItem', 'setItem']) {
    const orig = Storage.prototype[name];
    Storage.prototype[name] = function (k, ...rest) { if (String(k).startsWith('adv_')) throw new Error('blocked'); return orig.call(this, k, ...rest); };
  }
});
await page.reload({waitUntil: 'networkidle'});
assert.deepEqual(errors, []);
assert(await page.locator('#rules-final').isVisible());
await page.evaluate(() => selectFinalCollection('fin_ode_01_v1'));
assert.deepEqual(errors, []);
// 모바일
await page.setViewportSize({width: 390, height: 844});
await page.evaluate(() => openCollectionModal());
assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
console.log('PASS: exam tabs, final tabs, landing guide, selection restore');
```

- [ ] **Step 2: 실패 확인**

Run: `node scripts/check_final_browser.cjs --layout-only`
Expected: FAIL (`#exam-tab-final` 없음)

- [ ] **Step 3: `adv_math.php`와 `scripts/adv_final.js` 구현** (위 화면 항목대로)

- [ ] **Step 4: 통과 확인**

Run: `node scripts/check_final_browser.cjs --layout-only`
Expected: `PASS: exam tabs, final tabs, landing guide, selection restore`

- [ ] **Step 5: 기존 검사가 기준선과 같은지 확인**

Task 0 Step 2의 명령을 다시 실행해 `tmp/final_review/baseline.txt`와 같은지 확인.

- [ ] **Step 6: 라이트/다크 스크린샷 육안 확인**

`tmp/final_review/`의 문제집 창 스크린샷(데스크톱·모바일, `data-theme` light/dark)을 열어 시험 탭이 과목 탭과 같은 계열로 보이는지 확인. `check_final_browser.cjs`가 네 장을 저장하게 한다.

- [ ] **Step 7: 커밋**

```bash
git add adv_math.php scripts/adv_final.js scripts/check_final_browser.cjs
git commit -m "feat(adv-math): split collection picker into midterm and final exams"
```

---

### Task 4: 기말 풀이 세션 (시작, 입력 도구, 채점, 결과)

**Files:**
- Modify: `scripts/adv_final.js`
- Modify: `adv_math.php` (퀴즈 영역 `#algebra-matrix-tools` 다음, `renderResult` `:708-749`, `startSelectedGame` `:1019-1026`)
- Modify: `scripts/check_final_browser.cjs`

**Interfaces:**
- Consumes: Task 1 `finalGrading.gradeFinal`, `displaySolution`; Task 3 `selectFinalCollection`; `logic.js`의 `state`, `saveAnswer()`, `updateHeader()`, `loadCurrentProblem()`, `updateNavButtons()`; `grader.js`의 `gradeProblem`
- Produces:
  - `startFinalGame() -> Promise<void>`: `startAlgebraGame`과 같은 흐름. `#sel-collection-value-final`의 문제집을 찾고, 없으면 `alert("문제집을 선택해주세요.")`. `studyScores.startAttempt`, `polar-session` 클래스 제거, `state.strictC=false`, `state.subject='final'`, `state.exam='final'`, 슬로건(`unit==='ode'` → `Solve the flow`, 그 외 `Converge with confidence`), `state.problems`에 `id, level, title, latex: normalizeLatex(p.latex), solution, explanation, answerMode, page, tools, userAnswer: ""`.
  - `renderFinalTools(tools: string | undefined)`: `#final-answer-tools`에 spec §5.3 버튼을 만든다. 판정 버튼은 입력칸 값을 `\text{판정}`으로 바꾸고 `saveAnswer()` 후 입력칸에 포커스. 구간 템플릿은 `insertMatrixTemplate`처럼 `executeCommand(['insert', '[#0,#0)', ...])`. `∞` 버튼은 `\infty` 삽입. 기말이 아니거나 `expr`이면 숨김. 버튼에는 테스트용 속성을 단다: 판정 `data-verdict="절대수렴"` 등, 템플릿 `data-template="[a,b]" | "[a,b)" | "(a,b]" | "(a,b)"`, 무한대 `data-insert="infty"`.
  - 설치되는 래퍼(로드 시 1회): `gradeProblem` — `state.exam==='final'`이면 `finalGrading.gradeFinal(u, s, (uu, ss) => 원래(uu, ss, false, timeout, true))`, 아니면 원래 함수 그대로. `loadCurrentProblem` — 원래 호출 후 `renderFinalTools(state.exam==='final' ? 현재문항.tools : undefined)`. `updateNavButtons` — 원래 호출 후 기말이면 `#btn-giveup` 숨김.
  - `adv_math.php` `startSelectedGame()`: `selectedSubject==='final'`이면 `startFinalGame()`. 그 외 분기 시작 전에 `state.exam='midterm'`.
  - `adv_math.php` `renderResult`: 정답 칸 = `state.exam==='final' && window.finalGrading ? finalGrading.displaySolution(p.solution) : p.solution + cLabel`. 해설 요약 = 기존 문구 + (`p.page`가 있으면 ` · 교과서 p.${p.page}`).
  - 퀴즈 영역에 `<div id="final-answer-tools" class="hidden" style="display:flex; gap:8px; margin: 10px 0; flex-wrap:wrap;"></div>` (행렬 도구와 같은 스타일).

- [ ] **Step 1: 브라우저 테스트 확장 (실패 확인용)**

채점기 준비(`isGraderReady`)를 기다린 뒤:

```js
// 모든 기말 문항: 정답 입력은 정답, 대표 오답은 오답 (실제 Pyodide 채점)
const bad = await page.evaluate(async () => {
  state.exam = 'final'; const out = [];
  for (const c of finalCollections) for (const p of c.problems) {
    const kind = finalGrading.answerKind(p.solution);
    const right = kind === 'verdict' ? '\\text{' + p.solution.slice(8) + '}' : kind === 'interval' ? p.solution.slice(9) : p.solution;
    const wrong = kind === 'verdict' ? '포기 ' : kind === 'interval' ? right.replace(/^[\[(]/, m => m === '[' ? '(' : '[') : '(' + p.solution + ')+1';
    if (await gradeProblem(right, p.solution, false, 30000, true) !== 'CORRECT') out.push(p.id + ' right');
    if (await gradeProblem(wrong, p.solution, false, 30000, true) === 'CORRECT') out.push(p.id + ' wrong');
  }
  return out;
});
assert.deepEqual(bad, []);
// 실제 흐름: fin_ode_01_v1 시작 → 정답 입력 → 제출
await page.evaluate(() => { selectFinalCollection('fin_ode_01_v1'); });
await page.evaluate(() => startSelectedGame());
await page.waitForSelector('#app-view', {state: 'visible'});
assert(await page.locator('#btn-giveup').isHidden());
for (let i = 0; i < 5; i++) { /* 문항별: tools가 verdict면 해당 버튼 클릭, interval이면 템플릿 버튼 클릭 후 끝점 입력, 그 외 field.value = 정답; Next */ }
await page.evaluate(() => finishTest());
await page.waitForSelector('#result-view', {state: 'visible'});
assert.equal(await page.textContent('#score-area'), 'Score: 5 / 5');
assert(!(await page.textContent('#detail-list')).includes('verdict:'));
assert((await page.textContent('#detail-list')).includes('교과서 p.'));
// 구간 템플릿 실제 입력 값 확인 (Review Focus 1)
const tpl = await page.evaluate(async () => { renderFinalTools('interval'); document.querySelector('#final-answer-tools [data-template="[a,b)"]').click(); const f = document.getElementById('math-input'); f.value = f.value.replace(/\\placeholder\{\}/, '-1').replace(/\\placeholder\{\}/, '1'); return [f.value, await gradeProblem(f.value, 'interval:[-1,1)', false, 30000, true)]; });
assert.equal(tpl[1], 'CORRECT', tpl[0]);
// 중간으로 복귀 (Review Focus 2)
await page.evaluate(() => { returnToCollections(); selectMidtermCollection(generatedCollections[0].id); startSelectedGame(); });
await page.waitForSelector('#app-view', {state: 'visible'});
assert.equal(await page.evaluate(() => state.exam), 'midterm');
assert.equal(await page.evaluate(() => gradeProblem('포기', '발산', false, 30000, false)), 'CORRECT');
assert(await page.locator('#final-answer-tools').isHidden());
// 모바일 풀이 화면
await page.setViewportSize({width: 390, height: 844});
assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
console.log('PASS: final session grading, tools, results, and midterm return');
```

Run: `node scripts/check_final_browser.cjs`
Expected: FAIL (`startFinalGame`/`#final-answer-tools` 없음)

- [ ] **Step 2: `scripts/adv_final.js`와 `adv_math.php` 구현** (위 Interfaces대로)

- [ ] **Step 3: 통과 확인**

Run: `node scripts/check_final_browser.cjs`
Expected: Task 3 PASS 줄 + `PASS: final session grading, tools, results, and midterm return`

- [ ] **Step 4: 기존 검사 기준선 비교** (Task 0 Step 2 명령 재실행, 기준선과 같음)

- [ ] **Step 5: 커밋**

```bash
git add adv_math.php scripts/adv_final.js scripts/check_final_browser.cjs
git commit -m "feat(adv-math): run final-exam sessions with verdict and interval answers"
```

---

### Task 5: 미분방정식 2세트 (활용)

**Files:** Modify `data/math/final/ode.js`, `scripts/check_final.py`

`fin_ode_02_v1` · `미분방정식 2 · 활용` · description `지수증가·감소, 냉각, 토리첼리, 낙하, 로지스틱 · 교과서 p.180–190`. 모두 `tools: 'value'`, 시간·온도·양 같은 숫자 하나를 묻는다.

| 키 | Lv | 묻는 것 | page |
|---|---|---|---|
| `exponential_growth` | 2 | 두 시점 관측값으로 다른 시점의 개체 수 | 181 |
| `newton_cooling` | 3 | 두 관측 온도로 특정 온도에 도달하는 시각 | 183 |
| `torricelli_tank` | 3 | 원기둥 탱크가 다 비는 시각 | 184 |
| `stokes_fall` | 4 | 공기 저항이 속도에 비례할 때 특정 시각의 속도 또는 종단속도 | 185 |
| `logistic_population` | 5 | 로지스틱 초깃값 문제에서 특정 개체 수에 도달하는 시각 | 190 |

- [ ] **Step 1: `TARGETS`에 5개 항목 먼저 추가 → 실패 확인**

Run: `node scripts/check_final.cjs python`
Expected: FAIL ("TARGETS keys != problem ids")

- [ ] **Step 2: 5문항 작성**

- [ ] **Step 3: 통과 확인**

Run: `node scripts/check_final.cjs python` → `PASS: 10 final answers verified and graded`
Run: `node scripts/check_final_browser.cjs` → 두 PASS 줄

- [ ] **Step 4: 커밋** — `git commit -m "feat(adv-math): add final-exam ODE applications set"`

---

### Task 6–10: 급수 10세트

각 Task는 Task 5와 같은 단계(TARGETS 먼저 → 실패 → 작성 → `check_final.cjs python` + `check_final_browser.cjs` 통과 → 커밋)로 두 세트씩 진행한다. 파일은 `data/math/final/series.js`(Task 6에서 생성하고 `adv_math.php`에 `ode.js` 다음 순서로 `?v=20261026_final` 태그 추가), `scripts/check_final.py`. 커밋 메시지는 `feat(adv-math): add final-exam series sets N-M`.

표의 "묻는 것"은 유형이다. 수치는 구현자가 정하되 교과서 예제·문제와 겹치지 않게 하고, 정답과 판정은 `check_final.py`가 확인한다.

**Task 6**

`fin_ser_01_v1` · `급수 1 · 수열의 극한` · `ε–N, 샌드위치, 단조수렴 · 교과서 p.101–105`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `rationalize_limit` | 2 | value | 근호 차의 극한 | 101 |
| `nth_root_squeeze` | 3 | value | $\sqrt[n]{a^n+b^n}$ 꼴 샌드위치 | 103 |
| `e_type_limit` | 3 | value | $(1+a/n)^{bn}$ 꼴 | 102 |
| `monotone_recursive` | 4 | value | 점화식 수열의 단조·유계 → 극한 | 104 |
| `factorial_root` | 5 | value | $\sqrt[n]{n!}/n$ 꼴 극한(∞ 또는 값) | 105 |

`fin_ser_02_v1` · `급수 2 · 급수의 합과 일반항판정법` · `부분합, 망원급수, 등비급수 · 교과서 p.106–107`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `telescoping_partial_fraction` | 2 | value | 부분분수 망원급수의 합 | 106 |
| `geometric_combo` | 3 | value | 두 등비급수 합의 결합 | 106 |
| `nth_term_divergence` | 3 | value | "수렴하면 합, 발산하면 발산" — 일반항이 0으로 가지 않음 (`verdict:발산`) | 107 |
| `factorial_telescoping` | 4 | value | 계승이 섞인 망원급수의 합 | 106 |
| `log_telescoping` | 5 | value | 로그 곱이 망원되는 급수의 합 | 106 |

**Task 7**

`fin_ser_03_v1` · `급수 3 · 적분판정법과 p-급수` · `이상적분과 비교, p의 범위 · 교과서 p.108–111`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `p_series_verdict` | 2 | verdict | p-급수 꼴로 바꾸어 판정 | 110 |
| `integral_test_log` | 3 | verdict | $1/(n\ln n)$ 류 적분판정 | 109 |
| `log_power_range` | 3 | interval | $1/(n(\ln n)^p)$ 수렴하는 $p$의 범위 | 109 |
| `remainder_bound` | 4 | value | 적분으로 나머지 상계 → 필요한 최소 항 수 | 109 |
| `exponent_range` | 5 | interval | 유리식 일반항이 수렴하는 지수의 범위 | 111 |

`fin_ser_04_v1` · `급수 4 · 비교판정법과 극한비교판정법` · `교과서 p.112–115`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `direct_comparison` | 2 | verdict | 등비급수와 직접 비교 | 112 |
| `limit_comparison_sine` | 3 | verdict | $\sin(1/n)$ 류 극한비교 | 113 |
| `limit_comparison_root_diff` | 3 | verdict | 근호 차를 포함한 일반항 | 114 |
| `limit_comparison_cosine` | 4 | verdict | $1-\cos(1/n)$ 류 | 114 |
| `root_minus_one_range` | 5 | interval | $(\sqrt[n]{n}-1)^p$ 꼴 수렴하는 $p$의 범위 | 114 |

**Task 8**

`fin_ser_05_v1` · `급수 5 · 비판정법과 근판정법` · `이웃 항의 비, n제곱근의 극한 · 교과서 p.118–123`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `ratio_polynomial_exponential` | 2 | verdict | 다항식/지수 | 119 |
| `ratio_limit_value` | 3 | value | 계승과 거듭제곱 일반항의 비의 극한값 | 120 |
| `root_test` | 3 | verdict | $(\cdot)^n$ 꼴 근판정 | 121 |
| `ratio_inconclusive` | 4 | verdict | 비판정법 극한이 1이라 다른 방법이 필요한 급수 | 122 |
| `factorial_power_max` | 5 | value | $(n!)^k/(2n)!$ 꼴이 수렴하는 자연수 $k$의 최댓값 | 120 |

`fin_ser_06_v1` · `급수 6 · 절대수렴, 조건수렴, 교대급수` · `교과서 p.116–117, 124–128`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `alternating_root` | 2 | verdict | 조건수렴 교대급수 | 125 |
| `absolute_trig` | 3 | verdict | 삼각함수 부호가 섞인 절대수렴 | 116 |
| `alternating_nonzero_term` | 3 | verdict | 일반항이 0으로 가지 않는 교대급수(발산) | 124 |
| `alternating_error_terms` | 4 | value | 교대급수 오차 한계로 필요한 최소 항 수 | 127 |
| `non_monotone_alternating` | 5 | verdict | 항이 단조감소하지 않아 교대급수판정법을 쓸 수 없는 급수 | 126 |

**Task 9**

`fin_ser_07_v1` · `급수 7 · 수렴반경과 수렴구간` · `교과서 p.131–135`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `radius_basic` | 2 | value | 수렴반경 | 133 |
| `interval_shifted` | 3 | interval | 중심이 이동한 멱급수의 수렴구간(끝점 하나 포함) | 134 |
| `radius_infinite` | 3 | value | 수렴반경이 ∞인 멱급수 | 133 |
| `interval_even_powers` | 4 | interval | 짝수 거듭제곱만 있는 멱급수의 수렴구간 | 134 |
| `radius_factorial_power` | 5 | value | $n!/n^n$ 계수의 수렴반경 | 135 |

`fin_ser_08_v1` · `급수 8 · 멱급수의 기본 성질` · `미분, 적분, 합, 곱 · 교과서 p.136–139`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `differentiate_geometric` | 2 | expr | 등비급수를 미분해 얻는 합 함수 | 136 |
| `integrate_geometric` | 3 | expr | 등비급수를 적분해 얻는 합 함수 | 137 |
| `weighted_sum_value` | 3 | value | $\sum n r^n$ 꼴 수치 급수의 합 | 137 |
| `arctan_series_value` | 4 | value | 역탄젠트 급수로 인식하는 수치 급수의 합 | 138 |
| `square_weighted_sum` | 5 | value | $\sum n^2 r^n$ 꼴 합 | 138 |

**Task 10**

`fin_ser_09_v1` · `급수 9 · 테일러 다항식과 테일러급수` · `계수, 중심 이동, 나머지 · 교과서 p.140–146`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `maclaurin_cubic` | 2 | expr | 지수함수 합성의 3차 매클로린 다항식 | 141 |
| `taylor_shifted_center` | 3 | expr | $x=a$ 중심 2차 테일러 다항식 | 141 |
| `high_derivative_from_series` | 3 | value | 급수 계수로 구하는 고계도함수 값 | 142 |
| `remainder_degree` | 4 | value | 테일러 정리 나머지로 필요한 최소 차수 | 143 |
| `tan_quintic` | 5 | expr | $\tan x$의 5차 매클로린 다항식 | 145 |

`fin_ser_10_v1` · `급수 10 · 테일러급수의 활용` · `극한, 근삿값, 급수의 합 · 교과서 p.147–150`

| 키 | Lv | tools | 묻는 것 | page |
|---|---|---|---|---|
| `limit_sine_cubic` | 2 | value | 사인 급수로 구하는 극한 | 147 |
| `limit_log_cubic` | 3 | value | 로그 급수로 구하는 극한 | 147 |
| `integral_approx` | 3 | value | $e^{-x^2}$ 류 정적분을 급수 앞 몇 항으로 근사 | 148 |
| `recognize_sine_value` | 4 | value | 사인·코사인 급수로 인식하는 수치 급수의 합 | 149 |
| `composite_derivative` | 5 | value | 합성함수 급수 계수로 구하는 고계도함수 값 | 148 |

---

### Task 11: 실전 모의 1세트

**Files:** Create `data/math/final/mock.js`; Modify `adv_math.php`(스크립트 태그 `series.js` 다음), `scripts/check_final.py`

`fin_mock_01_v1` · `실전 모의 1` · `급수 8 · 미분방정식 2 · 시험 비율`. 앞 세트와 다른 새 문항 10개:

| 구분 | 수 | 포함할 유형 |
|---|---|---|
| 급수 | 8 | 판정 2(그중 조건수렴 1), 수렴구간 1, 망원·등비 합 1, 멱급수 합 함수 또는 수치 합 1, 테일러 다항식 1, 테일러 극한 1, 비·근판정 1 |
| 미분방정식 | 2 | 풀이(초깃값 해) 1, 활용(값) 1 |

레벨: 2를 2개, 3을 3개, 4를 3개, 5를 2개.

- [ ] **Step 1: TARGETS 10개 추가 → 실패 확인** (`node scripts/check_final.cjs python`)
- [ ] **Step 2: 10문항 작성**
- [ ] **Step 3: 전체 완성 검사**

Run: `node scripts/check_final.cjs --complete python`
Expected: `PASS: structure (13 collections, 70 problems)` 그리고 `PASS: 70 final answers verified and graded`

- [ ] **Step 4: 커밋** — `git commit -m "feat(adv-math): add final-exam mock set"`

---

### Task 12: 마무리 (회귀, 문서, 업로드 목록)

**Files:** Modify `README.md`, `adv_math.php`(새 태그 버전 확정만)

- [ ] **Step 1: 전체 검사**

Run:
```bash
node scripts/check_final_grading.cjs
node scripts/check_final.cjs --complete python
node scripts/check_final_browser.cjs
```
Expected: 모두 PASS

- [ ] **Step 2: 중간 회귀** — Task 0 Step 2 명령 재실행, `tmp/final_review/baseline.txt`와 같음

- [ ] **Step 3: 직접 둘러보기**

`check_final_browser.cjs`가 저장한 스크린샷(문제집 창·풀이·결과, 데스크톱/모바일, 라이트/다크)을 열어 중간과 같은 디자인인지 확인.

- [ ] **Step 4: README에 "기말고사 문제" 절 추가**

내용: 구조(중간/기말 탭), 문항 구성(급수 50 · 미분방정식 10 · 모의 10), 답 형식(`verdict:`, `interval:`, `\infty`, `tools`), 검증 명령 세 줄, 업로드 파일 목록 — `adv_math.php`, `scripts/adv_final_grading.js`, `scripts/adv_final.js`, `data/math/final/ode.js`, `data/math/final/series.js`, `data/math/final/mock.js`. DB 변경 없음. 검사 스크립트와 참고자료는 로컬 전용.

- [ ] **Step 5: 커밋** — `git commit -m "docs: document final-exam collections and upload list"`
