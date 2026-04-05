'''
최장 증가 부분 수열 (LIS, Longest Increasing Subsequence)
어떤 수열이 주어졌을 때, 원소가 점진적으로 커지는 가장 긴 부분 수열의 길이를 구하는 알고리즘.
전봇대 전선 겹치지 않게 연결하기, 아이들을 키 순서대로 배치할 때 제외할 최소 인원 수 찾기 등에서 사용.

[입력 예시]
6
10 20 10 30 20 50

[출력 예시]
4
'''
import sys

n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))

dp = [1] * n

for i in range(1, n):
    for j in range(i):
        if arr[j] < arr[i]:
            dp[i] = max(dp[i], dp[j] + 1)

print(max(dp))
