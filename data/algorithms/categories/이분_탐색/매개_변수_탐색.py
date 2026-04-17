'''
[문제 제목]: 매개 변수 탐색 (Parametric Search)
- 문제 설명: "최적화 문제"를 "예/아니오로 대답 가능한 결정 문제"로 바꾸어 이분 탐색하는 기법입니다.
- 시간 복잡도: O(N log(MaxHeight))

[입력 예시]
4 11
8 0 2 4 10

[출력 예시]
3
'''
import sys
input = sys.stdin.read

# 데이터 입력
input_data = input().split()
if input_data:
    n, target = map(int, input_data[:2])
    arr = list(map(int, input_data[2:]))

    # 문제 해결 로직
    def check(height):
        total = 0
        for x in arr:
            if x > height:
                total += (x - height)
        return total >= target

    start, end = 0, max(arr)
    result = 0

    while start <= end:
        mid = (start + end) // 2
        if check(mid):
            result = mid
            start = mid + 1
        else:
            end = mid - 1

    # 결과 출력
    print(result)
