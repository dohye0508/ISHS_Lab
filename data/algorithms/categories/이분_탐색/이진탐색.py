'''
이진 탐색 (Binary Search)
정렬된 배열 내에서 찾아야 할 값을 반으로 나누어가며 탐색하는 알고리즘.
시간 복잡도: O(log N)

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

def binary_search(array, target, start, end):
    while start <= end:
        mid = (start + end) // 2
        if array[mid] == target:
            return mid
        elif array[mid] > target:
            end = mid - 1
        else:
            start = mid + 1
    return None

n, target = map(int, sys.stdin.readline().split())
array = list(map(int, sys.stdin.readline().split()))

result = binary_search(array, target, 0, n - 1)
if result == None:
    print("Not Found")
else:
    print(result + 1)
