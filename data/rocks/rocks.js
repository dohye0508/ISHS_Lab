// 암석 데이터. 사진을 더 넣으려면 images 배열에 경로만 추가하면 된다.
const GROUPS = {
  hole:    { title: '구멍 숭숭 · 유리질',          tone: 'red' },
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
    aliases: ['obsidian', '흑요암'], confuse: ['silica-glass', 'basalt', 'chert'] },

  // 알갱이가 다 보이는 점박이
  { id: 'granite', name: '화강암', en: 'Granite', type: '화성암', group: 'coarse',
    feature: '흰 바탕 + 검은 점',
    detail: '규장질 심성암. 결정이 크고 고르며, 밝은 석영·장석이 대부분이고 검은 흑운모가 점처럼 박혀 있다.',
    aliases: ['granite'], confuse: ['diorite', 'gabbro', 'granodiorite', 'syenite'] },
  { id: 'diorite', name: '섬록암', en: 'Diorite', type: '화성암', group: 'coarse',
    feature: '흰색 · 검은색 반반',
    detail: '중간질 심성암. 밝은 광물과 어두운 광물이 비슷한 양으로 섞여 소금·후추 같은 무늬가 난다.',
    aliases: ['diorite'], confuse: ['granite', 'gabbro', 'quartz-diorite', 'andesite'] },
  { id: 'gabbro', name: '반려암', en: 'Gabbro', type: '화성암', group: 'coarse',
    feature: '거의 검은 점박이',
    detail: '고철질 심성암. 결정이 눈에 보일 만큼 크지만 대부분 어두운 광물이라 전체적으로 거무스름하다.',
    aliases: ['gabbro'], confuse: ['diorite', 'basalt', 'ultramafic'] },

  // 알갱이가 안 보이는 고운 돌
  { id: 'rhyolite', name: '유문암', en: 'Rhyolite', type: '화성암', group: 'fine',
    feature: '분홍빛',
    detail: '규장질 화산암. 알갱이가 거의 안 보이고 밝은 분홍·연회색을 띤다. 흐른 자국(유상 구조)이 보이기도 한다.',
    aliases: ['rhyolite'], confuse: ['andesite', 'felsite', 'granite', 'tuff'] },
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
    aliases: ['breccia'], confuse: ['conglomerate', 'volcanic-breccia', 'tuff'] },
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
    aliases: ['limestone'], confuse: ['marble', 'dolostone', 'tuff', 'quartzite'] },
  { id: 'marble', name: '대리암', en: 'Marble', type: '변성암', group: 'light',
    feature: '하얀 결정, 염산 거품',
    detail: '석회암이 변성되어 방해석이 재결정된 암석. 반짝이는 결정이 보이고 묽은 염산에 거품이 난다.',
    aliases: ['marble'], confuse: ['quartzite', 'limestone'] },
  { id: 'quartzite', name: '규암', en: 'Quartzite', type: '변성암', group: 'light',
    feature: '설탕 같은 결정, 거품 없음',
    detail: '사암이 변성되어 석영이 서로 맞물린 암석. 설탕 덩어리 같고 매우 단단하며 염산에 반응하지 않는다.',
    aliases: ['quartzite', '석영암'], confuse: ['marble', 'sandstone', 'chert'] },
  // ---- 순서도에만 있던 암석 (수업 사진 밖, Wikimedia Commons 사진) ----
  { id: 'pegmatite', name: '페그마타이트', en: 'Pegmatite', type: '화성암', group: 'coarse', extra: true,
    feature: '결정이 아주 큼 (1~2cm 이상)',
    detail: '마그마가 식는 마지막 단계에 물이 많은 잔류 용액에서 결정이 매우 크게 자란 화성암. 손가락만 한 장석·석영·운모 결정이 보인다.',
    aliases: ['pegmatite', '거정질 화강암', '거정 화강암'], confuse: ['granite', 'porphyry', 'syenite'] },
  { id: 'porphyry', name: '반암', en: 'Porphyry', type: '화성암', group: 'coarse', extra: true,
    feature: '고운 바탕에 큰 결정이 박힘 (반상 조직)',
    detail: '먼저 천천히 자란 큰 결정(반정)이, 나중에 빨리 식은 고운 바탕(석기)에 박혀 있는 반상 조직의 화성암. 반심성암에서 흔하다.',
    aliases: ['porphyry', '반상암'], confuse: ['andesite', 'pegmatite', 'rhyolite'] },
  { id: 'syenite', name: '섬장암', en: 'Syenite', type: '화성암', group: 'coarse', extra: true,
    feature: '장석이 대부분, 석영은 거의 없음',
    detail: '화강암처럼 밝고 결정이 크지만 석영이 거의 없고 장석이 대부분인 심성암. 밝은 광물 + 장석 2종류인데 석영이 안 보이면 섬장암이다.',
    aliases: ['syenite'], confuse: ['granite', 'granodiorite', 'diorite'] },
  { id: 'granodiorite', name: '화강섬록암', en: 'Granodiorite', type: '화성암', group: 'coarse', extra: true,
    feature: '밝은 광물이 더 많음 + 장석 1종류',
    detail: '화강암과 섬록암의 중간. 밝은 광물이 더 많지만 화강암보다 검은 점이 촘촘하고, 장석은 주로 사장석 한 종류다.',
    aliases: ['granodiorite'], confuse: ['granite', 'diorite', 'quartz-diorite'] },
  { id: 'quartz-diorite', name: '석영 섬록암', en: 'Quartz diorite', type: '화성암', group: 'coarse', extra: true,
    feature: '흑백 반반 + 석영이 조금 (5% 미만) 보임',
    detail: '섬록암처럼 밝은 광물과 어두운 광물의 양이 비슷하지만, 투명한 석영 알갱이가 약간 보이는 심성암.',
    aliases: ['quartz diorite', '석영섬록암', 'tonalite'], confuse: ['diorite', 'granodiorite', 'gabbro'] },
  { id: 'ultramafic', name: '초고철질암', en: 'Ultramafic rock', type: '화성암', group: 'coarse', extra: true,
    feature: '모두 어두운 광물 (감람석·휘석), 녹색~검은색',
    detail: '석영·장석 같은 밝은 광물이 거의 없고 감람석·휘석 같은 고철질 광물로만 된 암석. 감람암·듀나이트가 대표적이다. 사진은 듀나이트.',
    aliases: ['ultramafic', 'ultramafic rock', '초염기성암', '감람암', '듀나이트', 'peridotite', 'dunite'], confuse: ['gabbro', 'serpentinite', 'basalt'] },
  { id: 'silica-glass', name: '석영 유리', en: 'Silica glass', type: '화성암', group: 'hole', extra: true,
    feature: '밝은 색의 천연 유리',
    detail: '거의 순수한 이산화규소(SiO₂)로 된 밝은 색 유리질 암석. 사진은 리비아 사막 유리. 같은 유리질인 흑요석과는 색(밝음/어두움)으로 구별한다.',
    aliases: ['silica glass', 'quartz glass', '석영유리', '천연 유리'], confuse: ['obsidian', 'quartzite', 'chert'] },
  { id: 'felsite', name: '규장석', en: 'Felsite', type: '화성암', group: 'fine', extra: true,
    feature: '알갱이가 안 보이는 밝은 색 화성암',
    detail: '석영·장석이 많은 규장질 마그마가 빨리 식어 결정이 보이지 않는 밝은 세립질 화성암을 통틀어 부르는 말. 순서도에서 회색은 안산암, 어두우면 현무암이다.',
    aliases: ['felsite', '규장암'], confuse: ['rhyolite', 'andesite', 'chert'] },
  { id: 'volcanic-breccia', name: '화산 각력암', en: 'Volcanic breccia', type: '퇴적암', group: 'clastic', extra: true,
    feature: '각진 화산 암편 + 유리질 알갱이',
    detail: '화산 폭발로 튀어나온 2mm보다 큰 각진 암석 조각이 화산재와 함께 굳은 화산 쇄설암. 조각이 화산에서 왔다는 점이 일반 각력암과 다르다.',
    aliases: ['volcanic breccia', '화산각력암'], confuse: ['breccia', 'tuff', 'conglomerate'] },
  { id: 'dolostone', name: '백운석', en: 'Dolostone', type: '퇴적암', group: 'light', extra: true,
    feature: '덩어리는 염산에 느리게, 가루는 잘 반응',
    detail: '돌로마이트(백운석) 광물로 된 탄산염 퇴적암(백운암). 석회암과 닮았지만 묽은 염산에 덩어리는 거품이 약하고, 긁어낸 가루는 잘 반응한다.',
    aliases: ['dolostone', 'dolomite', '백운암', '돌로마이트'], confuse: ['limestone', 'marble', 'sandstone'] },
  { id: 'serpentinite', name: '사문암', en: 'Serpentinite', type: '변성암', group: 'fine', extra: true,
    feature: '녹색~검은색 얼룩, 매끈한 느낌',
    detail: '감람암 같은 초고철질암이 물과 반응해 사문석으로 바뀐 변성암. 녹색과 검은색이 얼룩덜룩하고 뱀 껍질처럼 매끈하다.',
    aliases: ['serpentinite', 'serpentine', '사문석'], confuse: ['ultramafic', 'talc', 'hornfels'] },
  { id: 'talc', name: '활석', en: 'Talc (soapstone)', type: '변성암', group: 'light', extra: true,
    feature: '밝은 색 + 기름기·비누 같은 촉감',
    detail: '활석 광물이 대부분인 변성암(곱돌·동석). 손톱으로 긁힐 만큼 매우 무르고 만지면 미끌미끌하다.',
    aliases: ['talc', 'soapstone', '곱돌', '동석', '활석편암'], confuse: ['marble', 'serpentinite', 'dolostone'] },
];

// 추가 암석 사진 출처 (Wikimedia Commons). 파일명 -> 저작자·라이선스·원본 페이지
const PHOTO_CREDITS = {
  "assets/images/rocks/volcanic-breccia-1.jpg": {
    "by": "GeoDIL (Darla Sondrol)",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:Volcanic_breccia_(GeoDIL_number_-_469).jpg"
  },
  "assets/images/rocks/volcanic-breccia-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Wyomingitic_volcanic_breccia_(Lower_Pleistocene,_2.19-2.56_Ma;_Boar%27s_Tusk,_Leucite_Hills,_Wyoming,_USA)_19_(48943830203).jpg"
  },
  "assets/images/rocks/pegmatite-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Graphic_granite_(Ruggles_Pegmatite,_Devonian;_Ruggles_Pegmatite_Mine,_New_Hampshire,_USA)_(8291627446).jpg"
  },
  "assets/images/rocks/pegmatite-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Uraninite_in_pegmatite_(Ingelsbo_Pegmatite;_Ingelsbo,_Sweden)_1_(26901187545).jpg"
  },
  "assets/images/rocks/porphyry-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Porphyritic_rhyodacite_(O%27Leary_Porphyry,_Middle_Pleistocene;_O%27Leary_Peak,_Arizona,_USA)_(27745649518).jpg"
  },
  "assets/images/rocks/porphyry-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Imperial_Porphyry_-_porphyritic_metadacite_to_porphyritic_meta-andesite_(Dokhan_Volcanics,_Neoproterozoic,_~593-602_Ma;_Mons_Porphyrites,_Red_Sea_Mountains,_Egypt)_4_(29980457784).jpg"
  },
  "assets/images/rocks/syenite-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Syenite_(Cuttingsville_Complex,_mid-Cretaceous,_97_Ma;_southwest_of_Cuttingsville,_southern_Vermont,_USA)_(16563008099).jpg"
  },
  "assets/images/rocks/granodiorite-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Granodiorite_(Giant_Forest_Granodiorite,_mid-Cretaceous,_97-102_Ma;_Moro_Rock,_Sequoia_National_Park,_California,_USA)_2_(16799561295).jpg"
  },
  "assets/images/rocks/granodiorite-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Granodiorite_(Giant_Forest_Granodiorite,_mid-Cretaceous,_97-102_Ma;_Moro_Rock,_Sequoia_National_Park,_California,_USA)_8_(16611992558).jpg"
  },
  "assets/images/rocks/quartz-diorite-1.jpg": {
    "by": "GeoDIL (Joseph H. Hartman)",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:Bonsall_Tonalite_(quartz_diorite)_(GeoDIL_number_-_34).jpg"
  },
  "assets/images/rocks/quartz-diorite-2.jpg": {
    "by": "USGS",
    "license": "Public domain",
    "url": "https://commons.wikimedia.org/wiki/File:Kuartzo_diorita.jpg"
  },
  "assets/images/rocks/ultramafic-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Chromitic_dunite_(Stillwater_Complex,_Neoarchean,_2.71_Ga;_Beartooth_Mountains,_Montana,_USA)_4.jpg"
  },
  "assets/images/rocks/silica-glass-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Libyan_Desert_Glass_(Oligocene,_28.5_Ma;_Libyan_Desert,_Egypt)_10.jpg"
  },
  "assets/images/rocks/silica-glass-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Libyan_Desert_Glass_(Oligocene,_28.5_Ma;_Libyan_Desert,_Egypt)_9.jpg"
  },
  "assets/images/rocks/felsite-1.jpg": {
    "by": "Amcyrus2012",
    "license": "CC BY-SA 4.0",
    "url": "https://commons.wikimedia.org/wiki/File:Rhyolite_Colorado.JPG"
  },
  "assets/images/rocks/dolostone-1.jpg": {
    "by": "GeoDIL (Nessa Eull)",
    "license": "CC0",
    "url": "https://commons.wikimedia.org/wiki/File:Potosi_Dolomite_(GeoDIL_number_-_495).jpg"
  },
  "assets/images/rocks/serpentinite-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Magnetitic_serpentinite_(Red_Lodge_Chromite_District,_Precambrian;_Rock_Creek_Canyon,_Beartooth_Mountains,_Montana,_USA)_2.jpg"
  },
  "assets/images/rocks/serpentinite-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Serpentinite_(New_Idria_Serpentinite,_Middle_Miocene,_~14_Ma;_Green_Fire_Mine,_California,_USA)_5.jpg"
  },
  "assets/images/rocks/talc-1.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Steatite_(soapstone)_(Early_Cretaceous;_quarry_apparently_on_Elliott_Creek_Ridge,_Oregon,_USA)_(16712622489).jpg"
  },
  "assets/images/rocks/talc-2.jpg": {
    "by": "James St. John",
    "license": "CC BY 2.0",
    "url": "https://commons.wikimedia.org/wiki/File:Talc_Schist_9.jpg"
  }
};

ROCKS.forEach(r => {
    if (!r.images) r.images = Object.keys(PHOTO_CREDITS).filter(f => f.startsWith(`assets/images/rocks/${r.id}-`)).sort();
    if (!r.images.length) r.images = [`assets/images/rocks/${r.id}-1.jpg`];
});

const CREDIT = '사진: Wikimedia Commons — GeoDIL(CC0), USGS(퍼블릭 도메인), James St. John(CC BY 2.0), Amcyrus2012(규장석, CC BY-SA 4.0). 추가 암석의 사진별 출처는 도감 카드에 적혀 있습니다.';

// 암석 분류 순서도 (실험지 「탐구 과정」 ①~㉓). 판별 도우미와 순서도 게임이 함께 쓴다.
// 각 답(a)의 t는 "특징" 문장, to는 다음 질문 번호, leaf는 결론 암석 이름.
const FLOW = {
  1:  { q: '결정·알갱이가 구별되는가?', a: [
        { t: '결정·알갱이가 구별된다', to: 2 },
        { t: '결정·알갱이가 구별되지 않는다', to: 13 } ] },
  2:  { q: '결정이 서로 맞물려 있는가?', a: [
        { t: '결정이 서로 맞물려 있다', to: 6 },
        { t: '결정이 맞물려 있지 않다 (퇴적암)', to: 3 } ] },
  3:  { q: '알갱이가 대부분 둥근가?', a: [
        { t: '알갱이가 대부분 둥글다', to: 4 },
        { t: '알갱이가 대부분 각졌다', to: 5 } ] },
  4:  { q: '알갱이 크기가 2mm 미만인가?', a: [
        { t: '알갱이가 2mm 미만이다 (모래 크기)', leaf: '사암' },
        { t: '알갱이가 2mm 이상이다 (자갈, 섞임)', leaf: '역암' } ] },
  5:  { q: '화산 쇄설물 + 유리질 알갱이인가?', a: [
        { t: '화산 쇄설물과 유리질 알갱이가 있다', leaf: '화산 각력암' },
        { t: '화산 쇄설물이 아니고 2mm보다 굵다', leaf: '각력암' } ] },
  6:  { q: '묽은 염산과 반응하는가?', a: [
        { t: '묽은 염산과 반응한다', leaf: '대리암' },
        { t: '묽은 염산과 반응하지 않는다', to: 7 } ] },
  7:  { q: '광물 층(줄무늬)이 뚜렷한가?', a: [
        { t: '광물 층(줄무늬)이 뚜렷하다', to: 12 },
        { t: '광물 층(줄무늬)이 뚜렷하지 않다', to: 8 } ] },
  8:  { q: '결정 크기는?', a: [
        { t: '결정이 매우 크다 (1~2cm 이상)', leaf: '페그마타이트' },
        { t: '큰 결정이 박혀 있다', leaf: '반암' },
        { t: '결정 크기가 비슷하다', to: 9 } ] },
  9:  { q: '밝은 광물과 어두운 광물 비율은?', a: [
        { t: '대부분 밝은 광물 + 장석 2종류', to: 10 },
        { t: '밝은 광물이 더 많음 + 장석 1종류', leaf: '화강섬록암' },
        { t: '밝은 광물과 어두운 광물의 양이 비슷하다', to: 11 },
        { t: '대부분 어두운 광물이다', leaf: '반려암' },
        { t: '모두 어두운 광물이다', leaf: '초고철질암' } ] },
  10: { q: '석영이 장석과 비슷한가?', a: [
        { t: '석영의 양이 장석과 비슷하다', leaf: '화강암' },
        { t: '석영이 거의 없다', leaf: '섬장암' } ] },
  11: { q: '석영이 눈에 보이는가?', a: [
        { t: '석영이 눈에 보인다 (5% 미만)', leaf: '석영 섬록암' },
        { t: '석영이 보이지 않는다', leaf: '섬록암' } ] },
  12: { q: '쪼개지는 모양은?', a: [
        { t: '석영 결정이 알갱이를 가로질러 깨진다', leaf: '규암' },
        { t: '운모를 포함하고 층을 따라 쉽게 쪼개진다', leaf: '편암' },
        { t: '굵고 밝고 어두운 줄무늬, 잘 안 쪼개진다', leaf: '편마암' } ] },
  13: { q: '유리질인가?', a: [
        { t: '유리질이다', to: 14 },
        { t: '유리질이 아니다', to: 15 } ] },
  14: { q: '전체 색이 밝은가?', a: [
        { t: '유리질이고 전체 색이 밝다', leaf: '석영 유리' },
        { t: '유리질이고 전체 색이 어둡다', leaf: '흑요석' } ] },
  15: { q: '칼날을 긁을 만큼 단단한가?', a: [
        { t: '칼날을 긁을 만큼 단단하다', to: 16 },
        { t: '칼날에 긁힐 만큼 무르다', to: 19 } ] },
  16: { q: '매끄럽고 알갱이가 없는가?', a: [
        { t: '매끄럽고 알갱이가 없다', leaf: '처트' },
        { t: '알갱이가 있다', to: 17 } ] },
  17: { q: '층을 이루는가?', a: [
        { t: '층을 이룬다', leaf: '응회암' },
        { t: '층을 이루지 않는다', to: 18 } ] },
  18: { q: '전체 색은?', a: [
        { t: '전체 색이 밝다', leaf: '규장석' },
        { t: '전체 색이 중간(회색)이다', leaf: '안산암' },
        { t: '전체 색이 어둡다', leaf: '현무암' } ] },
  19: { q: '묽은 염산과 반응하는가?', a: [
        { t: '묽은 염산과 반응한다', to: 20 },
        { t: '묽은 염산과 반응하지 않는다', to: 21 } ] },
  20: { q: '반응이 매우 왕성한가?', a: [
        { t: '반응이 매우 왕성하다', leaf: '석회암' },
        { t: '덩어리는 느리고 가루는 잘 반응한다', leaf: '백운석' } ] },
  21: { q: '층이 보이는가?', a: [
        { t: '층이 보인다', to: 22 },
        { t: '층이 보이지 않는다', to: 23 } ] },
  22: { q: '쪼개짐과 촉감은?', a: [
        { t: '표면이 거칠고 가볍다', leaf: '응회암' },
        { t: '쉽게 쪼개지지 않는다', leaf: '셰일' },
        { t: '매끄러운 한 장으로 쉽게 쪼개진다', leaf: '점판암' } ] },
  23: { q: '색과 촉감은?', a: [
        { t: '녹색~검은색 얼룩이 있다', leaf: '사문암' },
        { t: '밝은 색이고 기름기 느낌이 난다', leaf: '활석' } ] },
};

// 순서도의 결론 암석. id가 있으면 위 ROCKS의 사진·설명을 쓴다.
const FLOW_LEAVES = {
  '사암': { type: '퇴적암', id: 'sandstone' }, '역암': { type: '퇴적암', id: 'conglomerate' },
  '화산 각력암': { type: '퇴적암', id: 'volcanic-breccia' }, '각력암': { type: '퇴적암', id: 'breccia' },
  '대리암': { type: '변성암', id: 'marble' }, '규암': { type: '변성암', id: 'quartzite' },
  '편암': { type: '변성암', id: 'schist' }, '편마암': { type: '변성암', id: 'gneiss' },
  '페그마타이트': { type: '화성암', id: 'pegmatite' }, '반암': { type: '화성암', id: 'porphyry' },
  '화강암': { type: '화성암', id: 'granite' }, '섬장암': { type: '화성암', id: 'syenite' },
  '화강섬록암': { type: '화성암', id: 'granodiorite' }, '석영 섬록암': { type: '화성암', id: 'quartz-diorite' },
  '섬록암': { type: '화성암', id: 'diorite' }, '반려암': { type: '화성암', id: 'gabbro' },
  '초고철질암': { type: '화성암', id: 'ultramafic' }, '석영 유리': { type: '화성암', id: 'silica-glass' },
  '흑요석': { type: '화성암', id: 'obsidian' }, '처트': { type: '퇴적암', id: 'chert' },
  '응회암': { type: '퇴적암', id: 'tuff' }, '규장석': { type: '화성암', id: 'felsite' },
  '안산암': { type: '화성암', id: 'andesite' }, '현무암': { type: '화성암', id: 'basalt' },
  '석회암': { type: '퇴적암', id: 'limestone' }, '백운석': { type: '퇴적암', id: 'dolostone' },
  '셰일': { type: '퇴적암', id: 'shale' }, '점판암': { type: '변성암', id: 'slate' },
  '사문암': { type: '변성암', id: 'serpentinite' }, '활석': { type: '변성암', id: 'talc' },
};
