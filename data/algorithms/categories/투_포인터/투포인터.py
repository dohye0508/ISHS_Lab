'''
투 포인터 (Two Pointers)
주로 정렬되어 있거나 연속된 특정 구간을 처리할 때 사용하는 테크닉입니다. 두 개의 포인터를 조작하여 원하는 결과를 얻습니다.
리스트에서 2개의 점(위치)을 이용해 특정 조건을 만족하는 구간을 구합니다.
시간 복잡도: O(N)

[입력 예시]
5 5
1 2 3 2 5

[출력 예시]
3
'''
import sys

n, m = map(int, sys.stdin.readline().split())
data = list(map(int, sys.stdin.readline().split()))

count = 0
interval_sum = 0
end = 0

for start in range(n):
    while interval_sum < m and end < n:
        interval_sum += data[end]
        end += 1
    
    if interval_sum == m:
        count += 1
    
    interval_sum -= data[start]

print(count)
