'''
팰린드롬 (Palindrome) 판별 DP
어떤 문자열의 부분 문자열이 팰린드롬(앞으로 읽어도, 뒤로 읽어도 같은 문자열)인지 미리 계산해두어 여러 쿼리를 O(1)에 처리하는 2차원 DP 알고리즘입니다.

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

n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))

dp = [[0] * n for _ in range(n)]

for i in range(n):
    dp[i][i] = 1

for i in range(n - 1):
    if arr[i] == arr[i + 1]:
        dp[i][i + 1] = 1

for length in range(3, n + 1):
    for start in range(n - length + 1):
        end = start + length - 1
        if arr[start] == arr[end] and dp[start + 1][end - 1] == 1:
            dp[start][end] = 1

m = int(sys.stdin.readline())
for _ in range(m):
    s, e = map(int, sys.stdin.readline().split())
    print(dp[s - 1][e - 1])
