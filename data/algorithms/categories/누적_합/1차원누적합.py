'''
1차원 배열 누적 합 (Prefix Sum)
배열의 특정 구간 합을 구할 때 매번 반복문을 돌지 않고 O(1)의 속도로 빠르게 합을 구할 수 있도록 초기값을 미리 누적해두는 알고리즘.

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

n, m = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))

prefix_sum = [0] * (n + 1)

for i in range(n):
    prefix_sum[i + 1] = prefix_sum[i] + arr[i]

for _ in range(m):
    a, b = map(int, sys.stdin.readline().split())
    result = prefix_sum[b] - prefix_sum[a - 1]
    print(result)
