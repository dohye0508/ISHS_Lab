/*
회의실 배정 (Activity Selection / Greedy)
시작 시간과 끝나는 시간이 정해진 N개의 회의가 주어질 때, 겹치지 않게 하면서 가장 많은 회의를 할 수 있는 개수를 구하는 알고리즘.
그리디 알고리즘의 대표적인 예시로, '끝나는 시간'을 기준으로 오름차순 정렬하는 것이 핵심입니다.

[입력 예시]
11
1 4
3 5
0 6
5 7
3 8
5 9
6 10
8 11
8 12
2 13
12 14

[출력 예시]
4
*/
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    vector<pair<int, int>> meetings(n); // (end, start) - 끝나는 시간 기준 정렬을 위해 순서를 바꿔 저장
    for (int i = 0; i < n; i++) {
        int start, end;
        cin >> start >> end;
        meetings[i] = {end, start};
    }

    // 문제 해결 로직
    sort(meetings.begin(), meetings.end());

    int count = 0;
    int current_end_time = 0;
    for (auto& meeting : meetings) {
        int end = meeting.first;
        int start = meeting.second;
        if (start >= current_end_time) {
            current_end_time = end;
            count++;
        }
    }

    // 결과 출력
    cout << count << "\n";

    return 0;
}
