/*
트리 순회 (Tree Traversal)
이진 트리에서 전위 순회(Preorder), 중위 순회(Inorder), 후위 순회(Postorder)를 구현한 알고리즘입니다.
루트 노드 방문 순서에 따라 이름이 결정되며, 재귀를 통해 깔끔하게 구현됩니다.

[입력 예시]
7
A B C
B D .
C E F
E . .
F . G
D . .
G . .

[출력 예시]
ABDCEFG
DBAECFG
DBEGFCA
*/
#include <bits/stdc++.h>
using namespace std;

map<string, pair<string, string>> tree;

void preorder(const string& node) {
    if (node == ".") return;
    cout << node;
    preorder(tree[node].first);
    preorder(tree[node].second);
}

void inorder(const string& node) {
    if (node == ".") return;
    inorder(tree[node].first);
    cout << node;
    inorder(tree[node].second);
}

void postorder(const string& node) {
    if (node == ".") return;
    postorder(tree[node].first);
    postorder(tree[node].second);
    cout << node;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string node, left, right;
        cin >> node >> left >> right;
        tree[node] = {left, right};
    }

    // 문제 해결 로직
    // (전위/중위/후위 순회 함수가 핵심 로직이며, 아래에서 순회와 동시에 출력합니다)

    // 결과 출력
    preorder("A");
    cout << "\n";
    inorder("A");
    cout << "\n";
    postorder("A");
    cout << "\n";

    return 0;
}
