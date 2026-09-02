/*
[문제 제목]: KMP (Knuth-Morris-Pratt) 알고리즘
- 백준 난이도: 골드 I
- 문제 설명: 문자열 내에서 특정 패턴을 효율적으로 찾는 알고리즘입니다. '실패 함수(Failure Function)'를 통해 패턴 내의 접두사와 접미사가 일치하는 최대 길이를 미리 계산하여 매칭 실패 시 불필요한 비교를 건너뜁니다.
- 시간 복잡도: O(N+M)

[입력 예시]
ababacaba
abacaba

[출력 예시]
1
3
*/

#include <iostream>
#include <vector>
#include <string>

using namespace std;

string strip_str(const string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    string text, pattern;
    getline(cin, text);
    getline(cin, pattern);
    text = strip_str(text);
    pattern = strip_str(pattern);

    // 문제 해결 로직
    vector<int> result;
    if (!text.empty() && !pattern.empty()) {
        int m = pattern.size();
        vector<int> pi(m, 0);
        int j = 0;

        for (int i = 1; i < m; i++) {
            while (j > 0 && pattern[i] != pattern[j]) {
                j = pi[j - 1];
            }
            if (pattern[i] == pattern[j]) {
                j++;
                pi[i] = j;
            }
        }

        int n = text.size();
        j = 0;

        for (int i = 0; i < n; i++) {
            while (j > 0 && text[i] != pattern[j]) {
                j = pi[j - 1];
            }
            if (text[i] == pattern[j]) {
                if (j == m - 1) {
                    result.push_back(i - m + 2);
                    j = pi[j];
                } else {
                    j++;
                }
            }
        }
    }

    // 결과 출력
    if (!text.empty() && !pattern.empty()) {
        cout << result.size() << "\n";
        for (int res : result) cout << res << "\n";
    }

    return 0;
}
