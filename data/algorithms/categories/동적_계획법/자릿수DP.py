'''
자릿수 DP (Digit DP)
특정 범위 [A, B] 내에 존재하는 숫자 중에서 길이나 각 자릿수가 만족해야 하는 특정 조건을 충족하는 숫자의 개수 등을 구할 때 사용하는 패턴.
자릿수 DP는 각 문제의 조건(예: 특정 숫자가 몇 번 들어가는지 등)에 따라 memoization 배열(dp) 설정이 달라집니다.
보통 dp[idx][limit_status] 등 형태를 사용하며, -1은 아직 방문 안 함을 의미합니다.
상한선(limit)이 걸려있으면 해당 자리수만큼만, 아니면 0~9까지(진법에 따라) 지정하여 재귀 탐색합니다.
is_limit은 현재 재귀가 상한선과 동일한 숫자를 뽑았는지 전달합니다.
최종적으로 B까지의 결과에서 A-1까지의 결과를 빼면 구간 [A, B]에 해당하는 결과값을 얻을 수 있습니다.

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

a, b = sys.stdin.readline().split()

def solve(num_str):
    length = len(num_str)
    dp = [[-1] * 2 for _ in range(length)]
    
    def dfs(idx, limit):
        if idx == length:
            return 1
            
        if dp[idx][limit] != -1:
            return dp[idx][limit]
            
        up = int(num_str[idx]) if limit else 9
        ans = 0
        
        for i in range(up + 1):
            is_limit = limit and (i == up)
            ans += dfs(idx + 1, is_limit)
            
        dp[idx][limit] = ans
        return ans

    return dfs(0, True)

val_b = solve(b)
val_a = solve(str(int(a) - 1)) if int(a) > 0 else 0

print(val_b - val_a)
