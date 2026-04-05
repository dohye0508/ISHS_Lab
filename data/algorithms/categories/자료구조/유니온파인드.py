'''
분리 집합 / 유니온 파인드 (Disjoint Set / Union-Find)

[작동 원리]
서로 중복되지 않는 부분 집합들을 표현할 때 사용하는 자료구조로, 노드들이 같은 집합에 속해 있는지를 확인하거나 두 집합을 하나로 합치는 연산을 수행합니다.
- `Find`: 해당 노드의 최상위 부모(루트) 노드를 찾으며 이 과정에서 경로 압축(Path Compression)을 통해 트리의 높이를 평평하게 만듭니다.
- `Union`: 두 노드의 트리를 하나로 연결하며, 랭크나 크기 최적화를 통해 작은 트리를 큰 트리에 붙입니다.

[시간 복잡도]
실질적으로 O(1) (엄밀히는 아커만 함수의 역함수 알파(N))

[입력 예시]
7 4
0 1 3
1 1 7
0 7 6
1 7 1

[출력 예시]
NO
YES
'''
import sys

def find_parent(parent, x):
    if parent[x] != x:
        parent[x] = find_parent(parent, parent[x])
    return parent[x]

def union_parent(parent, a, b):
    a = find_parent(parent, a)
    b = find_parent(parent, b)
    if a < b:
        parent[b] = a
    else:
        parent[a] = b

v, e = map(int, sys.stdin.readline().split())
parent = [0] * (v + 1)

for i in range(1, v + 1):
    parent[i] = i

cycle = False
for _ in range(e):
    a, b = map(int, sys.stdin.readline().split())
    if find_parent(parent, a) == find_parent(parent, b):
        cycle = True
        break
    else:
        union_parent(parent, a, b)

if cycle:
    print("Cycle Exists")
else:
    print("No Cycle")
