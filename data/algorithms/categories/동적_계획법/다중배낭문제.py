'''
다중 배낭 문제 (Bounded Knapsack Problem)
각 물건의 개수가 정해져 있을 때, 가치의 최댓값을 구하는 알고리즘입니다.
단순히 물건 개수만큼 반복하면 시간 초과가 날 수 있으므로, 물건의 개수를 이진수(1, 2, 4...) 단위로 쪼개어
여러 개의 0/1 배낭 문제로 변환하여 O(N * K * log(C)) 시간에 푸는 기법입니다.

[입력 예시]
5 3
1 2
2 3
3 4
4 5

[출력 예시]
1
2
3 4 5
'''
import sys

n, k = map(int, sys.stdin.readline().split())
items = []

for _ in range(n):
    w, v, c = map(int, sys.stdin.readline().split())
    count = 1
    while c > 0:
        take = min(count, c)
        items.append((w * take, v * take))
        c -= take
        count *= 2

dp = [0] * (k + 1)

for w, v in items:
    for j in range(k, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[k])
