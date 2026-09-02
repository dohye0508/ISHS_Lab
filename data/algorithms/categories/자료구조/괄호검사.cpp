/*
스택 활용: 괄호 검사 (Valid Parentheses)
- 백준 난이도: 실버 IV
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
*/

#include <iostream>
#include <string>
#include <stack>
#include <map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    string s;
    getline(cin, s);

    // 문제 해결 로직
    stack<char> st;
    bool isValid = true;
    map<char, char> pairMap = {{')', '('}, {'}', '{'}, {']', '['}};

    for (char ch : s) {
        if (ch == '(' || ch == '{' || ch == '[') {
            st.push(ch);
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (st.empty()) {
                isValid = false;
                break;
            }
            char top = st.top();
            st.pop();
            if (pairMap[ch] != top) {
                isValid = false;
                break;
            }
        }
    }

    if (!st.empty()) isValid = false;

    // 결과 출력
    cout << (isValid ? "YES" : "NO") << "\n";

    return 0;
}
