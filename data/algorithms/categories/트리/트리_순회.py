'''
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
'''
import sys

n = int(sys.stdin.readline())
tree = {}

for _ in range(n):
    node, left, right = sys.stdin.readline().split()
    tree[node] = (left, right)

def preorder(node):
    if node == '.':
        return
    print(node, end='')
    preorder(tree[node][0])
    preorder(tree[node][1])

def inorder(node):
    if node == '.':
        return
    inorder(tree[node][0])
    print(node, end='')
    inorder(tree[node][1])

def postorder(node):
    if node == '.':
        return
    postorder(tree[node][0])
    postorder(tree[node][1])
    print(node, end='')

preorder('A')
print()
inorder('A')
print()
postorder('A')
print()
