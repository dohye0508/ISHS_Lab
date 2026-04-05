'''
부분 배낭 문제 (Fractional Knapsack / 무도회장) - 그리디
물건을 쪼갤 수 있는(Fractional) 조건의 배낭 문제.
가성비(단위 무게당 가치)가 높은 순서대로 내림차순 정렬하여 담고,
물건이 전부 들어가지 않으면 배낭의 남은 하중만큼 물건을 쪼개서 넣습니다.

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

n, capacity = map(int, sys.stdin.readline().split())
items = []

for _ in range(n):
    w, v = map(int, sys.stdin.readline().split())
    items.append((w, v, v / w)) 

items.sort(key=lambda x: x[2], reverse=True)

total_value = 0.0

for w, v, ratio in items:
    if capacity >= w:
        capacity -= w
        total_value += v
    else:
        total_value += capacity * ratio
        break

print(f"{total_value:.2f}")
