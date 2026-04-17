'''
[문제 제목]: 트라이 (Trie)
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
'''
import sys
input = sys.stdin.readline

# 데이터 입력
n, m = map(int, input().split())
words = [input().strip() for _ in range(n)]
queries = [input().strip() for _ in range(m)]

# 문제 해결 로직
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

trie = Trie()
for word in words:
    trie.insert(word)

# 결과 출력
for query in queries:
    print(trie.search(query))
