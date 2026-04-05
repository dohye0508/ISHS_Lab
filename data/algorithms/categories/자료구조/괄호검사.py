'''
스택 활용: 괄호 검사 (Valid Parentheses)
문자열에 포함된 괄호 '()', '{}', '[]' 등의 짝이 올바르게 맞는지 쌍을 검사하는 알고리즘.
여는 괄호는 스택에 넣고, 닫는 괄호가 나오면 스택의 Top과 짝이 맞는지 확인하며 Pop합니다.

[입력 예시]
5 3
1 2
2 3
3 4
4 5

[출력 예시]
1
2
3 4 5
'''
import sys

s = sys.stdin.readline().strip()
stack = []
is_valid = True

pair = {')': '(', '}': '{', ']': '['}

for char in s:
    if char in "({[":
        stack.append(char)
    elif char in ")}]":
        if not stack:
            is_valid = False
            break
        top = stack.pop()
        if pair[char] != top:
            is_valid = False
            break

if stack:
    is_valid = False

if is_valid:
    print("YES")
else:
    print("NO")
