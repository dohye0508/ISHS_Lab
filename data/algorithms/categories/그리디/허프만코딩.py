'''
허프만 코딩 (Huffman Coding) / 카드 정렬 최적화 - 우선순위 큐(Greedy)
여러 데이터가 있을 때 항상 가장 작은 두 묶음을 선택해서 합치는 과정을 통해 최종 합을 최소화하는 알고리즘.
최소 힙(Min Heap) 자료구조를 응용한 필수 그리디 기법입니다. (EX: 백준 '카드 정렬하기')
힙에 묶음이 1개 남을 때까지 가장 작은 두 묶음을 꺼내서 더하며 합친 비용은 전체 비용에 누적됨.
이후 합친 묶음을 다시 힙에 넣습니다.

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
import heapq

n = int(sys.stdin.readline())
heap = []

for _ in range(n):
    heapq.heappush(heap, int(sys.stdin.readline()))

result = 0

while len(heap) > 1:
    first = heapq.heappop(heap)
    second = heapq.heappop(heap)
    
    sum_value = first + second
    result += sum_value
    
    heapq.heappush(heap, sum_value)

print(result)
