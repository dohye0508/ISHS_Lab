'''
[문제 제목]
문제에 대한 설명을 여기에 적으세요.
시간 복잡도: O(N)

[입력 예시]
5
1 2 3 4 5

[출력 예시]
15
'''
import sys

# 입출력 속도 향상을 위한 설정
input = sys.stdin.readline

def solve():
    # 데이터를 입력받는 부분
    try:
        n = int(input())
        arr = list(map(int, input().split()))
        
        # 문제 해결 로직
        result = sum(arr)
        
        # 결과 출력
        print(result)
    except EOFError:
        pass

if __name__ == "__main__":
    # 재귀 깊이 제한 설정 (필요시)
    # sys.setrecursionlimit(10**6)
    solve()
