'''
계단 오르기 (Climbing Stairs)

[작동 원리]
n개의 계단을 오르는데, 한 번에 1계단 또는 2계단씩 오를 수 있으며 연속된 세 개의 계단을 모두 밟을 수는 없는 조건일 때, 얻을 수 있는 총 점수의 최댓값을 구하는 매우 유명한 기초 DP입니다.
마지막 i번째 계단을 밟는 방법은 두 가지입니다:
1. i-3번째 계단 -> i-1번째 계단 -> i번째 계단 (연속 2칸 밟기)
2. i-2번째 계단 -> i번째 계단 (2칸 건너뛰기)
따라서 점화식은 `DP[i] = max(DP[i-3] + score[i-1] + score[i], DP[i-2] + score[i])`가 됩니다.
배열의 초기값만 잘 설정해 주면 O(N)으로 빠르게 계산할 수 있습니다.

[시간 복잡도]
O(N) (N은 계단의 개수)

[입력 예시]
6
10
20
15
25
10
20

[출력 예시]
75
'''
import sys

n = int(sys.stdin.readline())
if n == 0:
    print(0)
    sys.exit()
    
stairs = [0] * 301
for i in range(1, n + 1):
    stairs[i] = int(sys.stdin.readline())

dp = [0] * 301
if n >= 1:
    dp[1] = stairs[1]
if n >= 2:
    dp[2] = stairs[1] + stairs[2]
if n >= 3:
    dp[3] = max(stairs[1] + stairs[3], stairs[2] + stairs[3])

for i in range(4, n + 1):
    dp[i] = max(dp[i - 2] + stairs[i], dp[i - 3] + stairs[i - 1] + stairs[i])

print(dp[n] if n > 0 else 0)
