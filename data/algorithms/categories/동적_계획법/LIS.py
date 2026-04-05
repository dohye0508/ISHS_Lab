'''
최장 증가 부분 수열 (LIS, Longest Increasing Subsequence)
어떠한 수열이 주어졌을 때, 그 부분 수열 중 원소가 오름차순으로 유지되는 가장 긴 수열의 길이를 찾는 알고리즘입니다.

[실전 활용처]
- 전깃줄 문제: 두 전봇대 사이의 전선이 서로 교차하지 않게 설치하기 위해 제거해야 할 최소 전선 수 찾기.
- 상자 쌓기: 크기가 다른 상자들을 가장 높게 쌓는 방법 찾기.

[입력 예시]
6                 <- (수열의 크기 N)
10 20 10 30 20 50 <- (수열의 각 원소들)

[출력 예시]
4                 <- (최장 증가 부분 수열의 길이)
'''
import sys

# 입력 받기
input_data = sys.stdin.read().split()
if input_data:
    n = int(input_data[0])
    arr = list(map(int, input_data[1:]))

    # DP 테이블 초기화 (최소 길이는 자기 자신만 포함한 1)
    dp = [1] * n

    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                # i번째 이전 원소들(j) 중 i보다 작으면 LIS 연장 가능
                dp[i] = max(dp[i], dp[j] + 1)

    print(max(dp))
