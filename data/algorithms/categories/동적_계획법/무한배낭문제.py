'''
무한 배낭 문제 (Unbounded Knapsack Problem)
각 물건의 개수 제한이 무한대일 때, 버틸 수 있는 무게 내에서 가치의 최댓값을 구하는 알고리즘.
0/1 1차원 배낭과 유사하지만, 중복을 허용해야 하므로 무게를 앞에서부터(정방향) 탐색합니다.

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

dp = [0] * (k + 1)

for _ in range(n):
    w, v = map(int, sys.stdin.readline().split())
    for j in range(w, k + 1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[k])
