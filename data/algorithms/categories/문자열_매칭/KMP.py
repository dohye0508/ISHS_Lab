'''
[문제 제목]: KMP (Knuth-Morris-Pratt) 알고리즘
- 문제 설명: 문자열 내에서 특정 패턴을 효율적으로 찾는 알고리즘입니다. '실패 함수(Failure Function)'를 통해 패턴 내의 접두사와 접미사가 일치하는 최대 길이를 미리 계산하여 매칭 실패 시 불필요한 비교를 건너뜁니다.
- 시간 복잡도: O(N+M)

[입력 예시]
ababacaba
abacaba

[출력 예시]
1
3
'''
import sys
input = sys.stdin.readline

# 데이터 입력
text = input().strip()
pattern = input().strip()

# 문제 해결 로직
result = []
if text and pattern:
    m = len(pattern)
    pi = [0] * m
    j = 0
    
    for i in range(1, m):
        while j > 0 and pattern[i] != pattern[j]:
            j = pi[j-1]
        if pattern[i] == pattern[j]:
            j += 1
            pi[i] = j

    n = len(text)
    j = 0
    
    for i in range(n):
        while j > 0 and text[i] != pattern[j]:
            j = pi[j-1]
        if text[i] == pattern[j]:
            if j == m - 1:
                result.append(i - m + 2)
                j = pi[j]
            else:
                j += 1

# 결과 출력
if text and pattern:
    print(len(result))
    for res in result:
        print(res)
