/*
[문제 제목]: 에라토스테네스의 체 (Sieve of Eratosthenes)
- 문제 설명: 특정 범위 내의 모든 소수를 효율적으로 찾는 알고리즘입니다. 2부터 시작하여 각 수의 배수를 지워나가는 방식으로 소수를 판별합니다.
- 시간 복잡도: O(N log(log N))

[입력 예시]
16

[출력 예시]
3 5 7 11 13
*/
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;

    // 문제 해결 로직
    vector<bool> primes(n + 1, true);
    if (n >= 0) primes[0] = false;
    if (n >= 1) primes[1] = false;
    int limit = (int)sqrt((double)n);
    for (int i = 2; i <= limit; i++) {
        if (primes[i]) {
            for (int j = i * i; j <= n; j += i) primes[j] = false;
        }
    }
    vector<int> result;
    for (int i = 2; i <= n; i++) {
        if (primes[i]) result.push_back(i);
    }

    // 결과 출력
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i + 1 < result.size()) cout << ' ';
    }
    cout << "\n";

    return 0;
}
