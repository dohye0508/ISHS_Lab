// 암석 데이터. 사진을 더 넣으려면 images 배열에 경로만 추가하면 된다.
const GROUPS = {
  hole:    { title: '구멍 숭숭 · 까만 유리',        tone: 'red' },
  coarse:  { title: '알갱이가 다 보이는 점박이',     tone: 'yellow' },
  fine:    { title: '알갱이가 안 보이는 고운 돌',    tone: 'green' },
  clastic: { title: '자갈 · 조각 · 모래가 박혀 있음', tone: 'blue' },
  layered: { title: '줄무늬 · 층이 있음',           tone: 'purple' },
  light:   { title: '하얗거나 밝은 회색 (염산으로 확인)', tone: 'gray' },
};

const TYPES = ['화성암', '퇴적암', '변성암'];

const ROCKS = [
  // 구멍 숭숭 · 까만 유리
  { id: 'pumice', name: '부석', en: 'Pumice', type: '화성암', group: 'hole',
    feature: '하얗고 구멍 숭숭 · 가벼움',
    detail: '규장질 용암이 빠르게 식으며 가스가 빠져나가 생긴 구멍(기공)이 아주 많다. 물에 뜰 만큼 가볍다.',
    aliases: ['경석', 'pumice'], confuse: ['scoria', 'basalt', 'tuff'] },
  { id: 'scoria', name: '스코리아', en: 'Scoria', type: '화성암', group: 'hole',
    feature: '검붉고 구멍 숭숭',
    detail: '현무암질 용암에서 생긴 다공질 암석. 검붉거나 검은색이고 구멍이 크고 많다. 부석보다 무겁다.',
    aliases: ['scoria', '송이', '화산송이', '암재'], confuse: ['basalt', 'pumice'] },
  { id: 'basalt', name: '현무암', en: 'Basalt', type: '화성암', group: 'hole',
    feature: '검은 회색 + 구멍',
    detail: '고철질 화산암. 알갱이가 보이지 않는 세립질이고 어두운 회색~검은색. 구멍이 있을 수도 없을 수도 있다.',
    aliases: ['basalt'], confuse: ['scoria', 'andesite', 'gabbro'] },
  { id: 'obsidian', name: '흑요석', en: 'Obsidian', type: '화성암', group: 'hole',
    feature: '까만 유리',
    detail: '용암이 결정이 생길 틈도 없이 급랭해 만들어진 화산 유리. 유리처럼 반짝이고 조개껍데기 모양(패각상)으로 깨진다.',
    aliases: ['obsidian', '흑요암'], confuse: ['basalt', 'chert'] },

  // 알갱이가 다 보이는 점박이
  { id: 'granite', name: '화강암', en: 'Granite', type: '화성암', group: 'coarse',
    feature: '흰 바탕 + 검은 점',
    detail: '규장질 심성암. 결정이 크고 고르며, 밝은 석영·장석이 대부분이고 검은 흑운모가 점처럼 박혀 있다.',
    aliases: ['granite'], confuse: ['diorite', 'gabbro', 'gneiss'] },
  { id: 'diorite', name: '섬록암', en: 'Diorite', type: '화성암', group: 'coarse',
    feature: '흰색 · 검은색 반반',
    detail: '중간질 심성암. 밝은 광물과 어두운 광물이 비슷한 양으로 섞여 소금·후추 같은 무늬가 난다.',
    aliases: ['diorite'], confuse: ['granite', 'gabbro', 'andesite'] },
  { id: 'gabbro', name: '반려암', en: 'Gabbro', type: '화성암', group: 'coarse',
    feature: '거의 검은 점박이',
    detail: '고철질 심성암. 결정이 눈에 보일 만큼 크지만 대부분 어두운 광물이라 전체적으로 거무스름하다.',
    aliases: ['gabbro'], confuse: ['diorite', 'basalt'] },

  // 알갱이가 안 보이는 고운 돌
  { id: 'rhyolite', name: '유문암', en: 'Rhyolite', type: '화성암', group: 'fine',
    feature: '분홍빛',
    detail: '규장질 화산암. 알갱이가 거의 안 보이고 밝은 분홍·연회색을 띤다. 흐른 자국(유상 구조)이 보이기도 한다.',
    aliases: ['rhyolite'], confuse: ['andesite', 'granite', 'tuff'] },
  { id: 'andesite', name: '안산암', en: 'Andesite', type: '화성암', group: 'fine',
    feature: '회색 + 작은 흰 점',
    detail: '중간질 화산암. 회색 바탕에 작은 흰 장석 결정(반정)이 점점이 박혀 있다.',
    aliases: ['andesite'], confuse: ['basalt', 'rhyolite', 'diorite'] },
  { id: 'chert', name: '처트', en: 'Chert', type: '퇴적암', group: 'fine',
    feature: '매끈한 도자기 느낌',
    detail: '아주 작은 석영 결정으로 된 화학적·유기적 퇴적암. 매끈하고 매우 단단하며 날카롭게(패각상) 깨진다.',
    aliases: ['chert', '규질암'], confuse: ['hornfels', 'quartzite', 'obsidian'] },
  { id: 'hornfels', name: '혼펠스', en: 'Hornfels', type: '변성암', group: 'fine',
    feature: '짙은 색, 아주 단단',
    detail: '마그마 근처에서 열을 받은 접촉 변성암. 치밀하고 아주 단단하며 줄무늬(엽리)가 없다.',
    aliases: ['hornfels'], confuse: ['chert', 'basalt', 'slate'] },

  // 자갈 · 조각 · 모래가 박혀 있음
  { id: 'conglomerate', name: '역암', en: 'Conglomerate', type: '퇴적암', group: 'clastic',
    feature: '둥근 자갈',
    detail: '지름 2mm 이상의 둥근 자갈이 모래·진흙과 함께 굳은 쇄설성 퇴적암.',
    aliases: ['conglomerate'], confuse: ['breccia', 'sandstone'] },
  { id: 'breccia', name: '각력암', en: 'Breccia', type: '퇴적암', group: 'clastic',
    feature: '각진 조각',
    detail: '지름 2mm 이상의 모난(각진) 조각들이 굳은 쇄설성 퇴적암. 멀리 운반되지 않아 모서리가 살아 있다.',
    aliases: ['breccia'], confuse: ['conglomerate', 'tuff'] },
  { id: 'sandstone', name: '사암', en: 'Sandstone', type: '퇴적암', group: 'clastic',
    feature: '모래 알갱이, 까칠까칠',
    detail: '0.063~2mm 모래 알갱이가 굳은 퇴적암. 만지면 사포처럼 까칠하다.',
    aliases: ['sandstone'], confuse: ['quartzite', 'conglomerate', 'tuff'] },
  { id: 'tuff', name: '응회암', en: 'Tuff', type: '퇴적암', group: 'clastic',
    feature: '연한 회색, 푸석푸석',
    detail: '화산재(지름 2mm 이하)가 쌓여 굳은 암석. 가볍고 푸석하며, 작은 암편이 섞여 보이기도 한다.',
    aliases: ['tuff'], confuse: ['sandstone', 'pumice', 'limestone'] },

  // 줄무늬 · 층이 있음
  { id: 'shale', name: '셰일', en: 'Shale', type: '퇴적암', group: 'layered',
    feature: '회색, 얇은 층',
    detail: '0.063mm 이하 진흙이 굳은 퇴적암. 층리를 따라 얇게 쪼개지고 비교적 무르다.',
    aliases: ['shale', '혈암'], confuse: ['slate', 'hornfels'] },
  { id: 'slate', name: '점판암', en: 'Slate', type: '변성암', group: 'layered',
    feature: '검푸른 평평한 판',
    detail: '셰일이 약하게 변성된 암석. 셰일보다 단단하고 평평한 판 모양으로 쪼개진다(벽개).',
    aliases: ['slate'], confuse: ['shale', 'schist', 'hornfels'] },
  { id: 'schist', name: '편암', en: 'Schist', type: '변성암', group: 'layered',
    feature: '은빛 반짝반짝',
    detail: '운모가 나란히 배열된 편리가 발달한 변성암. 은빛으로 반짝이고, 석류석 같은 붉은 알갱이가 박히기도 한다.',
    aliases: ['schist'], confuse: ['gneiss', 'slate'] },
  { id: 'gneiss', name: '편마암', en: 'Gneiss', type: '변성암', group: 'layered',
    feature: '흑백 줄무늬',
    detail: '고온·고압에서 밝은 광물과 어두운 광물이 띠 모양으로 분리된 편마 구조가 나타나는 변성암.',
    aliases: ['gneiss'], confuse: ['schist', 'granite'] },

  // 하얗거나 밝은 회색
  { id: 'limestone', name: '석회암', en: 'Limestone', type: '퇴적암', group: 'light',
    feature: '흐린 회색, 염산 거품',
    detail: '탄산칼슘이 침전되거나 생물 껍데기가 쌓인 퇴적암. 묽은 염산에 거품이 나고 화석이 보이기도 한다.',
    aliases: ['limestone'], confuse: ['marble', 'tuff', 'quartzite'] },
  { id: 'marble', name: '대리암', en: 'Marble', type: '변성암', group: 'light',
    feature: '하얀 결정, 염산 거품',
    detail: '석회암이 변성되어 방해석이 재결정된 암석. 반짝이는 결정이 보이고 묽은 염산에 거품이 난다.',
    aliases: ['marble'], confuse: ['quartzite', 'limestone'] },
  { id: 'quartzite', name: '규암', en: 'Quartzite', type: '변성암', group: 'light',
    feature: '설탕 같은 결정, 거품 없음',
    detail: '사암이 변성되어 석영이 서로 맞물린 암석. 설탕 덩어리 같고 매우 단단하며 염산에 반응하지 않는다.',
    aliases: ['quartzite', '석영암'], confuse: ['marble', 'sandstone', 'chert'] },
];

ROCKS.forEach(r => { if (!r.images) r.images = [`assets/images/rocks/${r.id}-1.jpg`]; });

const CREDIT = '사진: Wikimedia Commons — GeoDIL(CC0), USGS(퍼블릭 도메인), James St. John(현무암·안산암·석회암·응회암·편암·편마암, CC BY 2.0)';
