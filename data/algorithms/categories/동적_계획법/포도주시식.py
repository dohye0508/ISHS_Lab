'''
포도주 시식 (Wine Tasting)

[작동 원리]
포도주 잔이 일렬로 놓여 있을 때, 연속으로 3잔을 마시지 않으면서 가장 많은 양의 포도주를 마시는 문제입니다.
계단 오르기와 비슷해 보이지만, '마지막 잔을 마시지 않아도 된다'는 점이 다릅니다.
현재 잔(i)을 고려할 때 세 가지 경우가 있습니다:
1. 이번 포도주를 마시지 않는 경우: DP[i-1]
2. 이번 포도주와 이전 포도주(i-1)를 마시는 경우 (이때 i-2는 마실 수 없음): DP[i-3] + wine[i-1] + wine[i]
3. 이번 포도주만 마시고 이전 포도주(i-1)를 마시지 않는 경우: DP[i-2] + wine[i]
점화식은 `DP[i] = max(DP[i-1], DP[i-3] + wine[i-1] + wine[i], DP[i-2] + wine[i])` 입니다.

[시간 복잡도]
O(N) (N은 포도주 잔의 개수)

[입력 예시]
6
6
10
13
9
8
1

[출력 예시]
33
'''
import sys

n = int(sys.stdin.readline())
wine = [0] * 10001
for i in range(1, n + 1):
    wine[i] = int(sys.stdin.readline())

dp = [0] * 10001

if n >= 1:
    dp[1] = wine[1]
if n >= 2:
    dp[2] = wine[1] + wine[2]

for i in range(3, n + 1):
    dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])

print(dp[n])
