/*
[문제 제목]: 느리게 갱신되는 세그먼트 트리 (Segment Tree with Lazy Propagation)
- 문제 설명: 구간 업데이트와 구간 쿼리를 모두 O(log N)에 처리하는 자료구조입니다. 업데이트가 필요한 노드에 표시(Lazy)만 해두고, 나중에 해당 노드를 방문할 때 실제로 갱신을 전파하여 효율성을 높입니다.
- 시간 복잡도: 초기화 O(N), 구간 업데이트 및 쿼리 O(log N)

[입력 예시]
5 2 2
1 2 3 4 5
1 3 4 6
2 2 5
1 1 5 2
2 3 5

[출력 예시]
26
22
*/
#include <bits/stdc++.h>
using namespace std;

int n;
vector<long long> tree, lazy;

void init(int node, int start, int end, vector<long long>& arr) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    init(node * 2, start, mid, arr);
    init(node * 2 + 1, mid + 1, end, arr);
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

void updateLazy(int node, int start, int end) {
    if (lazy[node] != 0) {
        tree[node] += (long long)(end - start + 1) * lazy[node];
        if (start != end) {
            lazy[node * 2] += lazy[node];
            lazy[node * 2 + 1] += lazy[node];
        }
        lazy[node] = 0;
    }
}

void updateRange(int node, int start, int end, int left, int right, long long diff) {
    updateLazy(node, start, end);
    if (left > end || right < start) return;
    if (left <= start && end <= right) {
        tree[node] += (long long)(end - start + 1) * diff;
        if (start != end) {
            lazy[node * 2] += diff;
            lazy[node * 2 + 1] += diff;
        }
        return;
    }
    int mid = (start + end) / 2;
    updateRange(node * 2, start, mid, left, right, diff);
    updateRange(node * 2 + 1, mid + 1, end, left, right, diff);
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

long long query(int node, int start, int end, int left, int right) {
    updateLazy(node, start, end);
    if (left > end || right < start) return 0;
    if (left <= start && end <= right) return tree[node];
    int mid = (start + end) / 2;
    return query(node * 2, start, mid, left, right) + query(node * 2 + 1, mid + 1, end, left, right);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int m, k;
    cin >> n >> m >> k;
    vector<long long> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    tree.assign(4 * n, 0);
    lazy.assign(4 * n, 0);

    // 문제 해결 로직
    init(1, 0, n - 1, arr);

    // 결과 출력
    for (int q = 0; q < m + k; q++) {
        int type;
        cin >> type;
        if (type == 1) {
            int l, r;
            long long diff;
            cin >> l >> r >> diff;
            updateRange(1, 0, n - 1, l - 1, r - 1, diff);
        } else {
            int l, r;
            cin >> l >> r;
            cout << query(1, 0, n - 1, l - 1, r - 1) << "\n";
        }
    }

    return 0;
}
