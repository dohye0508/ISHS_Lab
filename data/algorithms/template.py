'''
[문제 제목]: (문제 제목을 적어주세요)
- 문제 설명: (해결을 위한 핵심 아이디어 설명을 적어주세요)
- 시간 복잡도: O(N)

[입력 예시]
5
1 2 3 4 5

[출력 예시]
15
'''
import sys
input = sys.stdin.readline

# 데이터 입력
n = int(input())
arr = list(map(int, input().split()))

# 문제 해결 로직
result = sum(arr)

# 결과 출력
print(result)
