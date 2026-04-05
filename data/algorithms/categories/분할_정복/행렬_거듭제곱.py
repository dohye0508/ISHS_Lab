'''
분할 정복 (Divide and Conquer) - 행렬 거듭제곱
행렬 A의 n제곱(A^n)을 O(log n) 시간에 구하는 알고리즘입니다.
지수가 홀수인 경우와 짝수인 경우를 나누어 재귀적으로 계산합니다.

[입력 예시]
2 5
1 2
3 4
1000

[출력 예시]
1 2
3 4
3751 0
'''
import sys

def matrix_mul(A, B, mod):
    size = len(A)
    # n x n 행렬 곱셈 결과 생성
    result = [[0] * size for _ in range(size)]
    for i in range(size):
        for j in range(size):
            for k in range(size):
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod
    return result

def matrix_pow(A, n, mod):
    if n == 1:
        return A
    
    # 1. 반으로 나누어 계산
    half = matrix_pow(A, n // 2, mod)
    
    # 2. 짝수 지수: (A^(n/2))^2
    if n % 2 == 0:
        return matrix_mul(half, half, mod)
    # 3. 홀수 지수: (A^(n/2))^2 * A
    else:
        return matrix_mul(matrix_mul(half, half, mod), A, mod)

if __name__ == "__main__":
    # N x N 행렬, B승, M으로 나눈 나머지
    # N B
    input_data = sys.stdin.read().split()
    if input_data:
        N, B = int(input_data[0]), int(input_data[1])
        # N x N 행렬 입력
        matrix = []
        for i in range(N):
            row = list(map(int, input_data[2 + i*N : 2 + (i+1)*N]))
            matrix.append(row)
        
        # 행렬 B제곱 계산
        result = matrix_pow(matrix, B, 1000) # 예시용 모듈러 1000
        
        for row in result:
            print(*(row))
