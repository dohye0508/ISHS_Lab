'''
KMP 문자열 매칭 알고리즘

[작동 원리]
긴 본문 문자열 속에서 특정 패턴 문자열을 빠르게 찾는 알고리즘입니다.
불일치가 발생했을 때 처음부터 다시 비교를 시작하는 단순 O(N*M)의 비효율을 막기 위해, 접두사와 접미사의 일치 길이를 저장한 LPS(Longest Prefix Suffix) 배열을 미리 전처리합니다.
본문과 패턴을 비교하다 틀릴 경우, 패턴 내에서 중복되는 부분을 건너뛰고 비교를 이어나갑니다.

[시간 복잡도]
O(N + M) (N: 본문 길이, M: 패턴 길이)

[입력 예시]
ABC ABCDAB ABCDABCDABDE
ABCDABD

[출력 예시]
1
16
'''
import sys

text = sys.stdin.readline().strip()
pattern = sys.stdin.readline().strip()

t_len = len(text)
p_len = len(pattern)

lps = [0] * p_len
match_idx = 0

for i in range(1, p_len):
    while match_idx > 0 and pattern[i] != pattern[match_idx]:
        match_idx = lps[match_idx - 1]
    if pattern[i] == pattern[match_idx]:
        match_idx += 1
        lps[i] = match_idx

matches = []
match_idx = 0

for i in range(t_len):
    while match_idx > 0 and text[i] != pattern[match_idx]:
        match_idx = lps[match_idx - 1]
    if text[i] == pattern[match_idx]:
        if match_idx == p_len - 1:
            matches.append(i - p_len + 2)
            match_idx = lps[match_idx]
        else:
            match_idx += 1

print(len(matches))
for m in matches:
    print(m, end=' ')
