'''
파라메트릭 서치 (Parametric Search) - 이분 탐색 응용
최적화 문제(예: "조건을 만족하는 가장 큰 값을 구하시오")를 결정 문제(예: "이 값이 조건을 만족하는가?")로 바꾸어 이분 탐색을 통해 해결하는 알고리즘입니다.
주로 길이나 무게 등의 최댓값/최솟값을 구할 때 많이 쓰입니다. (예: 나무 자르기, 랜선 자르기)

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

n, m = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))

start = 0
end = max(arr)

result = 0

while start <= end:
    mid = (start + end) // 2
    
    total = 0
    for x in arr:
        if x > mid:
            total += x - mid
            
    if total < m:
        end = mid - 1
    else:
        result = mid
        start = mid + 1

print(result)
