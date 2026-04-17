'''
[문제 제목]: 비트마스킹 (Bitmasking) 기초
- 문제 설명: 정수(Int)의 각 비트를 하나의 불리언(True/False) 플래그로 활용하여 집합 연산을 수행하는 기법입니다. 메모리 사용량이 적고 연산 속도가 매우 빠릅니다.
- 시간 복잡도: 각 연산 O(1)

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
input = sys.stdin.readline

# 데이터 입력
n = int(input())
S = 0

# 문제 해결 로직 및 결과 출력
for _ in range(n):
    line = input().split()
    if not line: break
    cmd = line[0]
    
    if cmd == "add":
        x = int(line[1])
        S |= (1 << x)
    elif cmd == "remove":
        x = int(line[1])
        S &= ~(1 << x)
    elif cmd == "check":
        x = int(line[1])
        if (S & (1 << x)):
            print(1)
        else:
            print(0)
    elif cmd == "toggle":
        x = int(line[1])
        S ^= (1 << x)
    elif cmd == "all":
        S = (1 << 21) - 1
    elif cmd == "empty":
        S = 0
