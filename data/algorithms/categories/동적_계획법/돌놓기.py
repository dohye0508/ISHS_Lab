'''
돌 놓기 (Pebble Placing)

[작동 원리]
3 x N 크기의 테이블에 돌을 놓는 문제입니다. 단, 가로나 세로로 인접한 두 칸에는 동시에 돌을 놓을 수 없습니다.
각 열에 돌을 놓을 수 있는 패턴은 다음 4가지로 압축됩니다.
- 패턴 0: 아무 곳에도 돌을 놓지 않음
- 패턴 1: 1행에만 돌을 놓음
- 패턴 2: 2행에만 돌을 놓음
- 패턴 3: 3행에만 돌을 놓음
- 패턴 4: 1행과 3행에 돌을 놓음
여기서 i번째 열에 패턴 p로 돌을 놓았을 때의 최대 점수를 DP[i][p]라고 정의합니다.
이전 열(i-1)의 패턴과 현재 열(i)의 패턴이 양립 가능한지(호환되는지) 확인한 후, 호환되는 패턴 조합 중 최대값을 계속 누적해 나가는 동적 계획법(Dynamic Programming)을 사용합니다.

[시간 복잡도]
상태 공간이 4개로 고정되어 있으므로, 4 * 4 * N 번의 연산이 수행됩니다. 따라서 O(N)의 시간 복잡도를 가집니다.

[입력 예시]
3
1 2 3
4 5 6
7 8 9

[출력 예시]
28
'''
import sys

def solve():
    input = sys.stdin.read
    data = input().split()
    if not data:
        return
    
    N = int(data[0])
    
    # 3xN 테이블 점수 입력
    board = []
    idx = 1
    for _ in range(3):
        board.append([int(x) for x in data[idx:idx+N]])
        idx += N
        
    # 패턴 4가지에 대한 각 열의 점수 계산 함수
    # 패턴 0: 돌 놓지 않음
    # 패턴 1: 1행 (인덱스 0)
    # 패턴 2: 2행 (인덱스 1)
    # 패턴 3: 3행 (인덱스 2)
    # 패턴 4: 1, 3행 (인덱스 0, 2)
    def get_score(col, pattern):
        if pattern == 0: return 0
        if pattern == 1: return board[0][col]
        if pattern == 2: return board[1][col]
        if pattern == 3: return board[2][col]
        if pattern == 4: return board[0][col] + board[2][col]
        return 0
        
    # 양립 가능한(인접하지 않은) 패턴인지 확인
    def is_compatible(p1, p2):
        if p1 == 0 or p2 == 0: return True
        if p1 == 1 and (p2 == 2 or p2 == 3 or p2 == 4): return True
        if p1 == 2 and (p2 == 1 or p2 == 3): return True
        if p1 == 3 and (p2 == 1 or p2 == 2 or p2 == 4): return True
        if p1 == 4 and (p2 == 2): return True
        return False
        
    dp = [[0] * 5 for _ in range(N)]
    
    # 첫 번째 열 초기화
    for p in range(5):
        dp[0][p] = get_score(0, p)
        
    # DP 채우기
    for i in range(1, N):
        for pt_curr in range(5):
            max_prev = -float('inf')
            for pt_prev in range(5):
                if is_compatible(pt_prev, pt_curr):
                    max_prev = max(max_prev, dp[i-1][pt_prev])
            dp[i][pt_curr] = max_prev + get_score(i, pt_curr)
            
    print(max(dp[N-1]))

if __name__ == '__main__':
    solve()
