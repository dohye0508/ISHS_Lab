/*
세그먼트 트리 (Segment Tree)
- 백준 난이도: 골드 I

[작동 원리]
어떤 배열에서 '특정 구간의 데이터 합/최솟값/최댓값' 등을 구하는 쿼리가 매우 잦고, 동시에 '배열의 특정 요소 값이 변경'되는 업데이트 쿼리 또한 잦을 때 사용하는 고급 자료구조입니다.
루트 노드가 전체 구간을 담당하고 자식 노드들이 반씩 구간을 나누어 가지는 이진 트리 형태입니다.
단순 배열로 하면 합을 구하는 데 O(N), 요소를 바꾸는 데 O(1)이 걸리지만, 세그먼트 트리를 사용하면 합치기와 변경 모두 빠르게 수행할 수 있습니다.

[시간 복잡도]
트리 초기화 O(N), 쿼리당 O(log N), 업데이트 O(log N)

[입력 예시]
5 2 2
1
2
3
4
5
1 3 6
2 2 5
1 5 2
2 3 5

[출력 예시]
17
12
*/

#include <iostream>
#include <vector>

using namespace std;

int segN;
vector<long long> tree;

void build(vector<long long>& data) {
    for (int i = 0; i < segN; i++) tree[segN + i] = data[i];
    for (int i = segN - 1; i >= 1; i--) tree[i] = tree[i * 2] + tree[i * 2 + 1];
}

void update(int i, long long val) {
    i += segN;
    tree[i] = val;
    while (i > 1) {
        if (i % 2 == 0) tree[i / 2] = tree[i] + tree[i + 1];
        else tree[i / 2] = tree[i - 1] + tree[i];
        i /= 2;
    }
}

long long query(int l, int r) {
    long long res = 0;
    l += segN;
    r += segN;
    while (l < r) {
        if (l % 2 == 1) { res += tree[l]; l++; }
        if (r % 2 == 1) { r--; res += tree[r]; }
        l /= 2;
        r /= 2;
    }
    return res;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m, k;
    cin >> n >> m >> k;
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // 문제 해결 로직
    segN = n;
    tree.assign(2 * segN, 0);
    build(arr);

    // 결과 출력
    for (int q = 0; q < m + k; q++) {
        int type;
        cin >> type;
        if (type == 1) {
            int idx;
            long long val;
            cin >> idx >> val;
            update(idx - 1, val);
        } else {
            int l, r;
            cin >> l >> r;
            cout << query(l - 1, r) << "\n";
        }
    }

    return 0;
}
