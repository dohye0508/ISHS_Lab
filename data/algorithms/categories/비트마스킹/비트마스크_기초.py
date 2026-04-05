'''
비트마스킹 (Bitmasking) 기초
정수(Int)의 각 비트를 하나의 불리언(True/False) 플래그로 활용하여 집합 연산을 수행하는 기법입니다.
메모리 사용량이 적고 연산 속도가 매우 빠릅니다.

[입력 예시]
10
add 1
add 2
check 1
remove 1
check 1

[출력 예시]
1
0
'''
import sys

def solve():
    # S: 공집합 (0)
    S = 0
    
    n = int(sys.stdin.readline())
    for _ in range(n):
        line = sys.stdin.readline().split()
        cmd = line[0]
        
        if cmd == "add":
            x = int(line[1])
            # x번째 비트를 1로 키기: S | (1 << x)
            S |= (1 << x)
        elif cmd == "remove":
            x = int(line[1])
            # x번째 비트를 0으로 끄기: S & ~(1 << x)
            S &= ~(1 << x)
        elif cmd == "check":
            x = int(line[1])
            # x번째 비트가 1인지 확인: (S >> x) & 1
            if (S & (1 << x)):
                print(1)
            else:
                print(0)
        elif cmd == "toggle":
            x = int(line[1])
            # x번째 비트를 반전: S ^ (1 << x)
            S ^= (1 << x)
        elif cmd == "all":
            # 1~20번째 비트를 모두 1로: (1 << 21) - 1
            S = (1 << 21) - 1
        elif cmd == "empty":
            S = 0

if __name__ == "__main__":
    solve()
