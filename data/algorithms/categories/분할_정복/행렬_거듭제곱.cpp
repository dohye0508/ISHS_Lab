/*
분할 정복 (Divide and Conquer) - 행렬 거듭제곱
- 백준 난이도: 골드 IV
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
*/

#include <iostream>
#include <vector>

using namespace std;

typedef vector<vector<long long>> Matrix;

Matrix matrix_mul(const Matrix& A, const Matrix& B, long long mod) {
    int size = A.size();
    // n x n 행렬 곱셈 결과 생성
    Matrix result(size, vector<long long>(size, 0));
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            for (int k = 0; k < size; k++) {
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod;
            }
        }
    }
    return result;
}

Matrix matrix_pow(const Matrix& A, long long n, long long mod) {
    if (n == 1) {
        return A;
    }

    // 1. 반으로 나누어 계산
    Matrix half = matrix_pow(A, n / 2, mod);

    // 2. 짝수 지수: (A^(n/2))^2
    if (n % 2 == 0) {
        return matrix_mul(half, half, mod);
    }
    // 3. 홀수 지수: (A^(n/2))^2 * A
    else {
        return matrix_mul(matrix_mul(half, half, mod), A, mod);
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    // N x N 행렬, B승, M으로 나눈 나머지
    // N B
    int N;
    long long B;
    cin >> N >> B;
    // N x N 행렬 입력
    Matrix matrix(N, vector<long long>(N));
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            cin >> matrix[i][j];
        }
    }

    // 문제 해결 로직
    // 행렬 B제곱 계산
    Matrix result = matrix_pow(matrix, B, 1000); // 예시용 모듈러 1000

    // 결과 출력
    for (const auto& r : result) {
        for (size_t j = 0; j < r.size(); j++) {
            cout << r[j];
            if (j + 1 < r.size()) cout << ' ';
        }
        cout << "\n";
    }

    return 0;
}
