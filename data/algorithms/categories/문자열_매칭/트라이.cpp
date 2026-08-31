/*
트라이 (Trie / Prefix Tree)
문자열을 효율적으로 저장하고 탐색하기 위한 트리 형태의 자료구조입니다.
자동 완성, 사전 검색 등에서 활용되며, 탐색 시간 복잡도는 문자열의 길이(L)에 비례하는 O(L)입니다.

[입력 예시]
5
apple
apply
ant
banana
band
apple

[출력 예시]
1
*/
#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    // 자식 노드들을 map으로 저장 (Python의 dict에 대응)
    map<char, int> children;
    // 해당 노드에서 끝나는 문자열이 있는지 여부
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
    int n;
    cin >> n;
    vector<string> words(n);
    for (int i = 0; i < n; i++) cin >> words[i];
    string search_word;
    cin >> search_word;

    // 문제 해결 로직
    Trie trie;
    for (const string& word : words) trie.insert(word);
    bool found = trie.search(search_word);

    // 결과 출력
    cout << (found ? 1 : 0) << "\n";

    return 0;
}
