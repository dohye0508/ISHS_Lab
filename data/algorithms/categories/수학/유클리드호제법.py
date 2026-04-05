'''
유클리드 호제법 (Euclidean Algorithm)

[작동 원리]
두 정수의 최대공약수(GCD)를 로그 시간 내에 빠르게 구하는 고전적인 수학 알고리즘입니다.
`A`를 `B`로 나눈 나머지를 `R`이라고 할 때, `A`와 `B`의 최대공약수는 `B`와 `R`의 최대공약수와 동일하다는 원리를 이용합니다.
재귀나 반복문을 통해 나머지가 0이 될 때까지 `A = B`, `B = R`로 값을 넘겨주면서 몫을 계산합니다.
최소공배수(LCM)는 두 수의 곱을 이 GCD로 나누어 구합니다.

[시간 복잡도]
O(log(min(A, B)))

[입력 예시]
24 18

[출력 예시]
6
72
'''
import sys

def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def lcm(a, b, g):
    return (a * b) // g

a, b = map(int, sys.stdin.readline().split())

g = gcd(a, b)
l = lcm(a, b, g)

print(g)
print(l)
