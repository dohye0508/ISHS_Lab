'''
Lower Bound & Upper Bound (이분 탐색)
정렬된 배열에서 특정 값 이상이 처음 나오는 위치(Lower Bound)와, 특정 값을 초과하는 값이 처음 나오는 위치(Upper Bound)를 찾는 알고리즘입니다.
특정 범위 내에 속하는 원소의 개수를 빠르게 O(log N) 시간에 구할 때 주로 사용합니다.

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
import bisect

n, target = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))

def get_lower_bound(array, value):
    start = 0
    end = len(array)
    while start < end:
        mid = (start + end) // 2
        if array[mid] >= value:
            end = mid
        else:
            start = mid + 1
    return start

def get_upper_bound(array, value):
    start = 0
    end = len(array)
    while start < end:
        mid = (start + end) // 2
        if array[mid] > value:
            end = mid
        else:
            start = mid + 1
    return start

lower = get_lower_bound(arr, target)
upper = get_upper_bound(arr, target)
count = upper - lower

print(lower)
print(upper)
print(count)
