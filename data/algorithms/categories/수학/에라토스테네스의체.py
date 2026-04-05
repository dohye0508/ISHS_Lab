'''
에라토스테네스의 체 (Sieve of Eratosthenes)

[작동 원리]
대량의 숫자 범위 내에서 소수(Prime Number)를 한꺼번에 구하고자 할 때 사용하는 고속 알고리즘입니다.
마치 체로 치듯이 합성수를 걸러낸다는 의미가 있습니다.
2부터 시작해 특정 수의 배수들을 전부 지우는 방식으로 진행되며, 어떤 수 N까지 소수를 판별할 때는 N의 제곱근까지만 판별해도 충분하다는 수학적 정리를 이용하여 최적화합니다.

[시간 복잡도]
O(N log(log N))

[입력 예시]
3 16

[출력 예시]
3
5
7
11
13
'''
import sys
import math

n = int(sys.stdin.readline())

primes = [True] * (n + 1)
primes[0] = False
primes[1] = False

for i in range(2, int(math.sqrt(n)) + 1):
    if primes[i]:
        j = 2
        while i * j <= n:
            primes[i * j] = False
            j += 1

result = [i for i in range(2, n + 1) if primes[i]]

print(len(result))
for p in result:
    print(p, end=' ')
