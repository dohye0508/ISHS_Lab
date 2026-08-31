/*
펜윅 트리 (Fenwick Tree / Binary Indexed Tree - BIT)
구간 합(Prefix Sum)을 빠르게 구하고, 값을 수시로 업데이트해야 할 때 사용하는 자료구조입니다.
세그먼트 트리보다 메모리 사용량이 적고 구현이 간편한 특징이 있습니다.

[입력 예시]
8
1 2 3 4 5 6 7 8
3 5

[출력 예시]
12
*/
#include <bits/stdc++.h>
using namespace std;

int n;
vector<long long> tree;

// 1. 원소 업데이트 함수
void update(int i, long long diff) {
    while (i <= n) {
        tree[i] += diff;
        // 가장 낮은 비트(LSB)만큼 더하는 과정
        i += (i & -i);
    }
}

// 2. 1부터 i까지의 합 구하기
long long query(int i) {
    long long s = 0;
    while (i > 0) {
        s += tree[i];
        i -= (i & -i);
    }
    return s;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    cin >> n;
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    int l, r;
    cin >> l >> r;
    tree.assign(n + 1, 0);

    // 문제 해결 로직
    for (int i = 0; i < n; i++) update(i + 1, arr[i]);

    // 결과 출력
    cout << query(r) - query(l - 1) << "\n";

    return 0;
}
