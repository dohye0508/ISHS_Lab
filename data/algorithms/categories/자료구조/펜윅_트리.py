'''
펜윅 트리 (Fenwick Tree / Binary Indexed Tree - BIT)
구간 합(Prefix Sum)을 빠르게 구하고, 값을 수시로 업데이트해야 할 때 사용하는 자료구조입니다.
세그먼트 트리보다 메모리 사용량이 적고 구현이 간편한 특징이 있습니다.

[입력 예시]
8
1 2 3 4 5 6 7 8
3 5

[출력 예시]
12
'''
import sys

def solve():
    input = sys.stdin.read().split()
    if not input: return
    n = int(input[0])
    arr = list(map(int, input[1:n+1]))
    l, r = map(int, input[n+1:n+3])

    tree = [0] * (n + 1)

    # 1. 원소 업데이트 함수
    def update(i, diff):
        while i <= n:
            tree[i] += diff
            # i += (i & -i)  # 비트 연산 방식
            # 가독성을 높이기 위해 비트 연산의 의미인 '가장 낮은 비트(LSB)'만큼 더하는 과정
            i += (i & -i) 
            
    # 2. 1부터 i까지의 합 구하기
    def query(i):
        s = 0
        while i > 0:
            s += tree[i]
            i -= (i & -i)
        return s

    # 초기화
    for i in range(n):
        update(i + 1, arr[i])

    # [l, r] 구간 합 출력 (1-indexing 기준)
    print(query(r) - query(l - 1))

if __name__ == "__main__":
    solve()
