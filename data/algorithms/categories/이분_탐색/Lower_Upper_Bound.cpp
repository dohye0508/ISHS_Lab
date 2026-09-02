/*
Lower Bound & Upper Bound (이분 탐색)
- 백준 난이도: 실버 II
정렬된 배열에서 특정 값 이상이 처음 나오는 위치(Lower Bound)와, 특정 값을 초과하는 값이 처음 나오는 위치(Upper Bound)를 찾는 알고리즘입니다.
특정 범위 내에 속하는 원소의 개수를 빠르게 O(log N) 시간에 구할 때 주로 사용합니다.

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
#include <vector>

using namespace std;

int getLowerBound(vector<int>& arr, int value) {
    int start = 0, end = (int)arr.size();
    while (start < end) {
        int mid = (start + end) / 2;
        if (arr[mid] >= value) end = mid;
        else start = mid + 1;
    }
    return start;
}

int getUpperBound(vector<int>& arr, int value) {
    int start = 0, end = (int)arr.size();
    while (start < end) {
        int mid = (start + end) / 2;
        if (arr[mid] > value) end = mid;
        else start = mid + 1;
    }
    return start;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, target;
    cin >> n >> target;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];

    // 문제 해결 로직
    int lower = getLowerBound(arr, target);
    int upper = getUpperBound(arr, target);
    int count = upper - lower;

    // 결과 출력
    cout << lower << "\n";
    cout << upper << "\n";
    cout << count << "\n";

    return 0;
}
