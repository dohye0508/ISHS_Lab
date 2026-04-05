'''
백트래킹 (Backtracking) - 순열
재귀를 통해 조건을 만족하는 모든 조합을 찾는 알고리즘입니다. (순서가 있는 나열)
N개의 숫자 중 M개를 고르는 모든 경우의 수를 반환합니다.

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

def dfs(depth, n, m, arr, visited, result):
    if depth == m:
        print(' '.join(map(str, result)))
        return

    for i in range(n):
        if not visited[i]:
            visited[i] = True
            result.append(arr[i])
            dfs(depth + 1, n, m, arr, visited, result)
            result.pop()
            visited[i] = False

n, m = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
visited = [False] * n
result = []

dfs(0, n, m, arr, visited, result)
