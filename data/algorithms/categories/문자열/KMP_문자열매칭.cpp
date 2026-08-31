/*
KMP 문자열 매칭 알고리즘

[작동 원리]
긴 본문 문자열 속에서 특정 패턴 문자열을 빠르게 찾는 알고리즘입니다.
불일치가 발생했을 때 처음부터 다시 비교를 시작하는 단순 O(N*M)의 비효율을 막기 위해, 접두사와 접미사의 일치 길이를 저장한 LPS(Longest Prefix Suffix) 배열을 미리 전처리합니다.
본문과 패턴을 비교하다 틀릴 경우, 패턴 내에서 중복되는 부분을 건너뛰고 비교를 이어나갑니다.

[시간 복잡도]
O(N + M) (N: 본문 길이, M: 패턴 길이)

[입력 예시]
ABC ABCDAB ABCDABCDABDE
ABCDABD

[출력 예시]
1
16
*/
#include <bits/stdc++.h>
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
    int t_len = text.size();
    int p_len = pattern.size();

    vector<int> lps(p_len, 0);
    int match_idx = 0;

    for (int i = 1; i < p_len; i++) {
        while (match_idx > 0 && pattern[i] != pattern[match_idx]) {
            match_idx = lps[match_idx - 1];
        }
        if (pattern[i] == pattern[match_idx]) {
            match_idx++;
            lps[i] = match_idx;
        }
    }

    vector<int> matches;
    match_idx = 0;

    for (int i = 0; i < t_len; i++) {
        while (match_idx > 0 && text[i] != pattern[match_idx]) {
            match_idx = lps[match_idx - 1];
        }
        if (text[i] == pattern[match_idx]) {
            if (match_idx == p_len - 1) {
                matches.push_back(i - p_len + 2);
                match_idx = lps[match_idx];
            } else {
                match_idx++;
            }
        }
    }

    // 결과 출력
    cout << matches.size() << "\n";
    for (int m : matches) cout << m << ' ';

    return 0;
}
