/*
[문제 제목]: 비트마스킹 (Bitmasking) 기초
- 문제 설명: 정수(Int)의 각 비트를 하나의 불리언(True/False) 플래그로 활용하여 집합 연산을 수행하는 기법입니다. 메모리 사용량이 적고 연산 속도가 매우 빠릅니다.
- 시간 복잡도: 각 연산 O(1)

[입력 예시]
10
add 1
add 2
check 1
remove 1
check 1

[출력 예시]
1
0
*/
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    int S = 0;

    // 문제 해결 로직
    // 결과 출력
    for (int i = 0; i < n; i++) {
        string cmd;
        if (!(cin >> cmd)) break;

        if (cmd == "add") {
            int x;
            cin >> x;
            S |= (1 << x);
        } else if (cmd == "remove") {
            int x;
            cin >> x;
            S &= ~(1 << x);
        } else if (cmd == "check") {
            int x;
            cin >> x;
            if (S & (1 << x)) {
                cout << 1 << "\n";
            } else {
                cout << 0 << "\n";
            }
        } else if (cmd == "toggle") {
            int x;
            cin >> x;
            S ^= (1 << x);
        } else if (cmd == "all") {
            S = (1 << 21) - 1;
        } else if (cmd == "empty") {
            S = 0;
        }
    }

    return 0;
}
