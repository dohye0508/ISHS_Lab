'''
[문제 제목]: 부분집합의 합 (Subset Sum)
- 문제 설명: 주어진 집합(N개의 원소) 중 원소들의 합이 특정 목표(S)가 되는 모든 부분집합의 개수를 구합니다.
- 시간 복잡도: O(2^N)

[입력 예시]
5 0
-7 -3 -2 5 8

[출력 예시]
1
'''
import sys
input = sys.stdin.read

# 데이터 입력
input_data = input().split()
if input_data:
    n, target_s = map(int, input_data[:2])
    arr = list(map(int, input_data[2:]))
    ans = 0

    # 문제 해결 로직
    def backtrack(idx, current_sum):
        global ans
        if idx == n:
            if current_sum == target_s:
                ans += 1
            return
        backtrack(idx + 1, current_sum + arr[idx])
        backtrack(idx + 1, current_sum)

    backtrack(0, 0)
    if target_s == 0:
        ans -= 1

    # 결과 출력
    print(ans)
