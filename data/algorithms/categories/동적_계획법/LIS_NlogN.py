'''
최장 증가 부분 수열 (LIS) - O(N log N) 이분 탐색 활용
단순 DP O(N^2)로 풀 수 없는 배열의 길이가 매우 긴 경우, 이분 탐색을 결합하여 시간 복잡도를 O(N log N)으로 단축시키는 알고리즘입니다.

[입력 예시]
6
10 20 10 30 20 50

[출력 예시]
4
'''
import sys
import bisect

n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))

dp = [arr[0]]

for i in range(1, n):
    if arr[i] > dp[-1]:
        dp.append(arr[i])
    else:
        idx = bisect.bisect_left(dp, arr[i])
        dp[idx] = arr[i]

print(len(dp))
