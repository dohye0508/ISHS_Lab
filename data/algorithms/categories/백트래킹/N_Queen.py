'''
N-Queen 문제 (N-Queen Problem)
N x N 크기의 체스판 위에 N개의 퀸을 서로 공격할 수 없게 놓는 모든 방법을 찾는 백트래킹 문제입니다.

[작동 원리: 백트래킹]
- 1행부터 N행까지 순차적으로 퀸을 놓습니다.
- 현재 행에 퀸을 놓을 때, 기존에 놓인 퀸들(행, 열, 대각선)과 부딪히지 않는지(Promising) 확인합니다.
- 부딪히면 이전 행으로 돌아가(Backtrack) 다른 자리를 찾습니다.

[입력 예시]
8                 <- (체스판의 크기 및 퀸의 수 N)

[출력 예시]
92                <- (서로 공격할 수 없게 배치하는 경우의 수)
'''
import sys

n_input = sys.stdin.read().strip()
if n_input:
    n = int(n_input)
    row = [0] * n  # index=행, value=열
    ans = 0

    def is_promising(x):
        for i in range(x):
            # 열이 겹치거나 대각선에 있는지 확인
            if row[x] == row[i] or abs(row[x] - row[i]) == abs(x - i):
                return False
        return True

    def n_queens(x):
        global ans
        if x == n:
            ans += 1
            return
        
        for i in range(n):
            row[x] = i
            if is_promising(x):
                n_queens(x + 1)

    n_queens(0)
    print(ans)
