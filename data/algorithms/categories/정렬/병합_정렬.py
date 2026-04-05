'''
병합 정렬 (Merge Sort)
분할 정정(Divide and Conquer) 방식을 사용하는 정교하고 안정적인 정렬 알고리즘입니다.
전체 성분을 절반으로 나누고, 다시 합치는 과정에서 정렬을 수행하며 O(N log N)의 시간 복잡도를 가집니다.

[입력 예시]
8
1 20 5 15 2 10 3 8

[출력 예시]
1 2 3 5 8 10 15 20
'''
import sys

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # 1. 분할 (Divide)
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # 2. 정복 및 합치기 (Conquer & Merge)
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            
    # 남은 요소들 추가
    result.extend(left[i:])
    result.extend(right[j:])
    return result

if __name__ == "__main__":
    line = sys.stdin.read().split()
    if line:
        n = int(line[0])
        nums = list(map(int, line[1:]))
        sorted_nums = merge_sort(nums)
        print(*(sorted_nums))
