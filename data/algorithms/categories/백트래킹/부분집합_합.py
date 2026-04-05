'''
부분집합의 합 (Subset Sum)
주어진 집합(N개의 원소) 중 원소들의 합이 특정 목표(S)가 되는 모든 부분집합을 구하는 문제입니다.

[작동 원리: 결정 트리]
- 각 원소에 대해 "포함한다" 또는 "포함하지 않는다"라는 두 가지 선택을 하며 탐색합니다.
- 목표 합(S)에 도달하면 결과를 저장하고, 더 이상 탐색해도 목표를 넘어서면 가지치기(Pruning)를 수행합니다.

[입력 예시]
5 0               <- (원소의 수 N, 목표 합 S)
-7 -3 -2 5 8      <- (집합의 원소들)

[출력 예시]
1                 <- (합이 S가 되는 부분집합의 개수)
'''
import sys

# 입력 받기
input_data = sys.stdin.read().split()
if input_data:
    n, target_s = map(int, input_data[:2])
    arr = list(map(int, input_data[2:]))

    ans = 0

    def backtrack(idx, current_sum):
        global ans
        # 모든 원소를 다 확인했을 때
        if idx == n:
            if current_sum == target_s:
                ans += 1
            return

        # 1. 현재 원소를 포함하는 경우
        backtrack(idx + 1, current_sum + arr[idx])
        
        # 2. 현재 원소를 포함하지 않는 경우
        backtrack(idx + 1, current_sum)

    # 1세대: idx, sum
    backtrack(0, 0)

    # 공집합(sum=0)이 목표이더라도 공집합은 제외해야 함 (보통 부분집합 문제 기준)
    if target_s == 0:
        ans -= 1

    print(ans)
