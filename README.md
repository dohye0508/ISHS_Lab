# ISHS_Lab 🧪
> **Integrated Academic Platform**  
> *수학, 알고리즘, 언어를 아우르는 통합 학습 환경*

![Status](https://img.shields.io/badge/Status-Active-success) ![Version](https://img.shields.io/badge/Version-2.6.0_Integb-blue) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🏛️ 프로젝트 개요

**ISHS_Lab**은 사용자 경험(UX)과 학습 효율성에 초점을 맞춘 웹 기반 통합 학술 플랫폼입니다. 수학적 연산, 알고리즘 라이브러리, 어휘 관리 환경을 하나의 통합된 인터페이스로 제공합니다.

---

## 💎 핵심 모듈

### 1. 📐 Integral Studio
**Python SymPy** 엔진 기반의 부정적분 문제 생성 및 검증 시스템입니다.
- **Dynamic Generation**: 실시간으로 다양한 난이도의 부정적분 문제를 생성합니다.
- **Strict Grading**: 적분상수(C) 및 수학적 동치성을 정밀하게 검증합니다.

### 2. 💻 Coding Test Studio
파이썬 핵심 알고리즘 라이브러리 및 연습 환경입니다.
- **Algorithm Archive**: 14개 이상의 주요 알고리즘 카테고리(그래프, DP, 그리디 등)별 표준 코드를 제공합니다.
- **Sync System**: `scripts/sync_algorithms.py`를 통해 로컬의 알고리즘 파일을 웹 뷰어에 즉시 반영합니다.

### 3. 📝 Vocabulary Studio
체계적인 어휘 암기 및 관리를 위한 학습 도구입니다.
- **Customized Cards**: 나만의 단어장을 만들고 테스트할 수 있습니다.

---

## 🛠 프로젝트 구조

```text
ISHS_Lab/
├── index.php             # 메인 포털 (Home)
├── coding_test.php       # 알고리즘 뷰어
├── integral.php          # 적분 연습 모듈
├── vocabulary.php        # 어휘 관리 모듈
├── data/
│   ├── algorithms/       # 알고리즘 코드 및 데이터
│   ├── math/             # 수학 문제 데이터
│   └── english/          # 어휘 데이터
├── scripts/
│   ├── sync_algorithms.py# 알고리즘 데이터 동기화 도구
│   └── logic.js          # 모듈별 프론트엔드 로직
└── assets/               # 이미지, CSS 등 정적 자산
```

---

## 🔌 설치 및 실행

1. **환경 요구사항**: PHP 7.0+ (Dothome 등 Apache 환경 최적화), Python 3.7+
2. **데이터 동기화**: 새로운 알고리즘 추가 후 아래 명령을 실행하세요.
   ```bash
   python scripts/sync_algorithms.py
   ```

---

## 📜 라이선스

- **Developer**: Dohye Lee
- **Copyright**: © 2026 ISHS_Lab. All Rights Reserved.
- **License**: MIT License
