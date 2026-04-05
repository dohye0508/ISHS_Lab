'''
동전 교환 (Coin Change)

[작동 원리]
N가지 종류의 동전이 주어질 때, 이 동전들을 사용하여 목표 금액 K를 만드는 경우의 수(또는 최소 동전 개수)를 구하는 1차원 배낭문제(Knapsack) 유형의 동적 계획법 알고리즘입니다.
이 코드는 금액을 만드는 '최소 동전의 개수'를 구하는 방식입니다.
초기 배열을 충분히 큰 값(예: 10001)으로 세팅한 뒤, 각 동전에 대해 목표 금액까지 순회하며 무제한 배낭 문제(정방향)처럼 배열을 업데이트합니다.
점화식은 `DP[j] = min(DP[j], DP[j - coin] + 1)` 입니다.

[시간 복잡도]
O(N * K) (N은 동전 종류의 개수, K는 목표 금액)

[입력 예시]
3 15
1
5
12

[출력 예시]
3
'''
import sys

n, k = map(int, sys.stdin.readline().split())
coins = []
for _ in range(n):
    coins.append(int(sys.stdin.readline()))

# 최소 개수를 구하기 위해 초기값을 K보다 큰 임의의 값으로 설정
MAX_VAL = 100001
dp = [MAX_VAL] * (k + 1)
dp[0] = 0

for coin in coins:
    for j in range(coin, k + 1):
        dp[j] = min(dp[j], dp[j - coin] + 1)

if dp[k] == MAX_VAL:
    print(-1)
else:
    print(dp[k])
