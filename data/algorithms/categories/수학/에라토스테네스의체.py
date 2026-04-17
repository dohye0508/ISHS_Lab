'''
[문제 제목]: 에라토스테네스의 체 (Sieve of Eratosthenes)
- 문제 설명: 특정 범위 내의 모든 소수를 효율적으로 찾는 알고리즘입니다. 2부터 시작하여 각 수의 배수를 지워나가는 방식으로 소수를 판별합니다.
- 시간 복잡도: O(N log(log N))

[입력 예시]
16

[출력 예시]
3 5 7 11 13
'''
import sys
import math
input = sys.stdin.readline

# 데이터 입력
line = input()
if line:
    n = int(line)

    # 문제 해결 로직
    primes = [True] * (n + 1)
    primes[0] = primes[1] = False
    for i in range(2, int(math.sqrt(n)) + 1):
        if primes[i]:
            for j in range(i * i, n + 1, i):
                primes[j] = False
    result = [i for i in range(2, n + 1) if primes[i]]

    # 결과 출력
    print(*(result))
