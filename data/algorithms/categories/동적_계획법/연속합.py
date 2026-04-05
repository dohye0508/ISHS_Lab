'''
연속 합 (Maximum Subarray Sum)

[작동 원리]
배열 안에서 연속된 몇 개의 수를 선택해 구할 수 있는 가장 큰 부분합을 구하는 카다네(Kadane's) 알고리즘 방식의 기초 DP입니다.
`DP[i]`는 i번째 원소를 마지막으로 하는 연속 합의 최댓값입니다.
i번째 원소를 새롭게 시작할지, 혹은 이전까지의 연속 합(DP[i-1])에 이어서 더할지를 결정합니다.
점화식: `DP[i] = max(Array[i], DP[i-1] + Array[i])`

[시간 복잡도]
O(N) (N은 배열의 길이)

[입력 예시]
10
10 -4 3 1 5 6 -35 12 21 -1

[출력 예시]
33
'''
import sys

n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))

dp = [0] * n
dp[0] = arr[0]

for i in range(1, n):
    dp[i] = max(arr[i], dp[i-1] + arr[i])

print(max(dp))
