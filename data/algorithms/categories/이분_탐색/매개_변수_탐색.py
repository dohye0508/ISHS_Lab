'''
매개 변수 탐색 (Parametric Search)
"최적화 문제"를 "예/아니오로 대답 가능한 결정 문제"로 바꾸어 이분 탐색하는 기법입니다.

[쉽게 이해하기: 나무 자르기 비유]
- 문제: "나무 20m를 얻기 위해 절단기 높이를 '최대' 얼마로 설정해야 하는가?" (최적화)
- 변형: "절단기 높이가 H일 때, 20m 이상의 나무를 얻을 수 있는가?" (Yes/No 결정)
- H를 이분 탐색으로 높여가며 'Yes'가 나오는 가장 높은 지점을 찾으면 그것이 정답입니다.

[입력 예시]
4 11          <- (나무의 수 N, 필요한 나무의 길이 M)
8 0 2 4 10    <- (각 나무의 높이들)

[출력 예시]
3             <- (조건을 만족하는 절단기 높이의 최댓값)
'''
import sys

# 입력 받기
input_data = sys.stdin.read().split()
if input_data:
    n, target = map(int, input_data[:2])
    arr = list(map(int, input_data[2:]))

    def check(height):
        # 절단기 높이가 height일 때 얻을 수 있는 나무의 총합 계산
        total = 0
        for x in arr:
            if x > height:
                total += (x - height)
        return total >= target

    # 이분 탐색 범위 설정
    start, end = 0, max(arr)
    result = 0

    while start <= end:
        mid = (start + end) // 2
        
        if check(mid):
            # 조건을 만족하면 더 높은 높이도 가능한지 확인 (start 상향)
            result = mid
            start = mid + 1
        else:
            # 조건을 만족하지 못하면 높이를 낮춰야 함 (end 하향)
            end = mid - 1

    print(result)
