'''
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
'''
import sys

class TrieNode:
    def __init__(self):
        # 자식 노드들을 딕셔너리나 고정 배열로 저장
        self.children = {}
        # 해당 노드에서 끝나는 문자열이 있는지 여부
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

if __name__ == "__main__":
    trie = Trie()
    input_data = sys.stdin.read().split()
    if input_data:
        n = int(input_data[0])
        # n개의 단어 삽입
        for i in range(1, n + 1):
            trie.insert(input_data[i])
        
        # 마지막 단어 매칭 확인
        search_word = input_data[n + 1]
        print(1 if trie.search(search_word) else 0)
