'''
KMP (Knuth-Morris-Pratt) 알고리즘
문자열 내에서 특정 패턴을 효율적으로 찾는 알고리즘입니다.

[작동 원리]
- 매칭이 실패했을 때, 이전에 이미 일치했던 정보를 활용해 불필요한 비교를 건너뜁니다.
- '실패 함수(Failure Function)'를 통해 패턴 내의 접두사와 접미사가 일치하는 최대 길이를 미리 계산합니다.

[입력 예시]
ababacaba     <- (전체 본문 문자열 T)
abacaba       <- (찾고 싶은 패턴 문자열 P)

[출력 예시]
1             <- (패턴이 발견된 위치들의 개수)
3             <- (발견된 각 위치의 시작 인덱스)
'''
import sys

# 입력 받기
text = sys.stdin.readline().strip()
pattern = sys.stdin.readline().strip()

if text and pattern:
    # 1. 실패 함수(pi 배열) 계산
    m = len(pattern)
    pi = [0] * m
    j = 0
    for i in range(1, m):
        while j > 0 and pattern[i] != pattern[j]:
            j = pi[j-1]
        if pattern[i] == pattern[j]:
            j += 1
            pi[i] = j

    # 2. 본문 검색 및 위치 저장
    n = len(text)
    result = []
    j = 0
    for i in range(n):
        while j > 0 and text[i] != pattern[j]:
            j = pi[j-1]
        if text[i] == pattern[j]:
            if j == m - 1:
                # 패턴 일치 완료! 위치 저장 (1-indexing)
                result.append(i - m + 2)
                j = pi[j]
            else:
                j += 1

    print(len(result))
    for res in result:
        print(res)
