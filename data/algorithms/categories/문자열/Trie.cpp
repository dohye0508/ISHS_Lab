/*
[문제 제목]: 트라이 (Trie)
- 백준 난이도: 골드 V
- 문제 설명: 문자열을 효율적으로 저장하고 탐색하기 위한 트리 형태의 자료구조입니다. 각 노드는 문자를 키로 가지며, 공통 접두사를 공유하는 문자열들을 계층적으로 관리합니다.
- 시간 복잡도: 삽입/탐색 O(L) (L은 문자열의 길이)

[입력 예시]
5 3
apple
apply
ant
banana
band
apple
app
cat

[출력 예시]
True
False
False
*/

#include <iostream>
#include <vector>
#include <string>
#include <map>

using namespace std;

struct TrieNode {
    map<char, int> children;
    bool is_end = false;
};

struct Trie {
    vector<TrieNode> nodes;

    Trie() { nodes.push_back(TrieNode()); } // index 0 = root

    void insert(const string& word) {
        int node = 0;
        for (char c : word) {
            if (nodes[node].children.find(c) == nodes[node].children.end()) {
                nodes[node].children[c] = nodes.size();
                nodes.push_back(TrieNode());
            }
            node = nodes[node].children[c];
        }
        nodes[node].is_end = true;
    }

    bool search(const string& word) {
        int node = 0;
        for (char c : word) {
            auto it = nodes[node].children.find(c);
            if (it == nodes[node].children.end()) return false;
            node = it->second;
        }
        return nodes[node].is_end;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, m;
    cin >> n >> m;
    vector<string> words(n), queries(m);
    for (int i = 0; i < n; i++) cin >> words[i];
    for (int i = 0; i < m; i++) cin >> queries[i];

    // 문제 해결 로직
    Trie trie;
    for (const string& word : words) trie.insert(word);

    // 결과 출력
    for (const string& query : queries) {
        cout << (trie.search(query) ? "True" : "False") << "\n";
    }

    return 0;
}
