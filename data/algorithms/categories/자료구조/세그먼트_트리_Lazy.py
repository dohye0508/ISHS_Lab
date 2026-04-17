'''
[문제 제목]: 느리게 갱신되는 세그먼트 트리 (Segment Tree with Lazy Propagation)
- 문제 설명: 구간 업데이트와 구간 쿼리를 모두 O(log N)에 처리하는 자료구조입니다. 업데이트가 필요한 노드에 표시(Lazy)만 해두고, 나중에 해당 노드를 방문할 때 실제로 갱신을 전파하여 효율성을 높입니다.
- 시간 복잡도: 초기화 O(N), 구간 업데이트 및 쿼리 O(log N)

[입력 예시]
5 2 2
1 2 3 4 5
1 3 4 6
2 2 5
1 1 5 2
2 3 5

[출력 예시]
26
22
'''
import sys
input = sys.stdin.readline

# 데이터 입력
n, m, k = map(int, input().split())
arr = list(map(int, input().split()))
tree = [0] * (4 * n)
lazy = [0] * (4 * n)

# 문제 해결 로직
def init(node, start, end):
    if start == end:
        tree[node] = arr[start]
        return tree[node]
    tree[node] = init(node*2, start, (start+end)//2) + init(node*2+1, (start+end)//2+1, end)
    return tree[node]

def update_lazy(node, start, end):
    if lazy[node] != 0:
        tree[node] += (end-start+1) * lazy[node]
        if start != end:
            lazy[node*2] += lazy[node]
            lazy[node*2+1] += lazy[node]
        lazy[node] = 0

def update_range(node, start, end, left, right, diff):
    update_lazy(node, start, end)
    if left > end or right < start:
        return
    if left <= start and end <= right:
        tree[node] += (end-start+1) * diff
        if start != end:
            lazy[node*2] += diff
            lazy[node*2+1] += diff
        return
    update_range(node*2, start, (start+end)//2, left, right, diff)
    update_range(node*2+1, (start+end)//2+1, end, left, right, diff)
    tree[node] = tree[node*2] + tree[node*2+1]

def query(node, start, end, left, right):
    update_lazy(node, start, end)
    if left > end or right < start:
        return 0
    if left <= start and end <= right:
        return tree[node]
    return query(node*2, start, (start+end)//2, left, right) + query(node*2+1, (start+end)//2+1, end, left, right)

init(1, 0, n-1)

# 결과 출력
for _ in range(m + k):
    query_line = list(map(int, input().split()))
    if query_line[0] == 1:
        _, l, r, diff = query_line
        update_range(1, 0, n-1, l-1, r-1, diff)
    else:
        _, l, r = query_line
        print(query(1, 0, n-1, l-1, r-1))
