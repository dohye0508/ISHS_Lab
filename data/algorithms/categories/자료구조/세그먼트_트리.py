'''
세그먼트 트리 (Segment Tree)

[작동 원리]
어떤 배열에서 '특정 구간의 데이터 합/최솟값/최댓값' 등을 구하는 쿼리가 매우 잦고, 동시에 '배열의 특정 요소 값이 변경'되는 업데이트 쿼리 또한 잦을 때 사용하는 고급 자료구조입니다.
루트 노드가 전체 구간을 담당하고 자식 노드들이 반씩 구간을 나누어 가지는 이진 트리 형태입니다.
단순 배열로 하면 합을 구하는 데 O(N), 요소를 바꾸는 데 O(1)이 걸리지만, 세그먼트 트리를 사용하면 합치기와 변경 모두 빠르게 수행할 수 있습니다.

[시간 복잡도]
트리 초기화 O(N), 쿼리당 O(log N), 업데이트 O(log N)

[입력 예시]
5 2 2
1
2
3
4
5
1 3 6
2 2 5
1 5 2
2 3 5

[출력 예시]
17
12
'''
import sys

class SegTree:
    def __init__(self, data, n):
        self.n = n
        self.tree = [0] * (2 * self.n)
        for i in range(self.n):
            self.tree[self.n + i] = data[i]
        for i in range(self.n - 1, 0, -1):
            self.tree[i] = self.tree[i * 2] + self.tree[i * 2 + 1]

    def update(self, i, val):
        i += self.n
        self.tree[i] = val
        while i > 1:
            if i % 2 == 0:
                self.tree[i // 2] = self.tree[i] + self.tree[i + 1]
            else:
                self.tree[i // 2] = self.tree[i - 1] + self.tree[i]
            i //= 1

    def query(self, l, r):
        res = 0
        l += self.n
        r += self.n
        while l < r:
            if l % 2 == 1:
                res += self.tree[l]
                l += 1
            if r % 2 == 1:
                r -= 1
                res += self.tree[r]
            l //= 2
            r //= 2
        return res

input_data = sys.stdin.read().split()
if input_data:
    n = int(input_data[0])
    arr = list(map(int, input_data[1:n+1]))
    st = SegTree(arr, n)
