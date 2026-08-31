/*
이진 탐색 (Binary Search)
정렬된 배열 내에서 찾아야 할 값을 반으로 나누어가며 탐색하는 알고리즘.
시간 복잡도: O(log N)

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
#include <bits/stdc++.h>
using namespace std;

int binarySearch(vector<int>& array, int target, int start, int end) {
    while (start <= end) {
        int mid = (start + end) / 2;
        if (array[mid] == target) return mid;
        else if (array[mid] > target) end = mid - 1;
        else start = mid + 1;
    }
    return -1;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n, target;
    cin >> n >> target;
    vector<int> array(n);
    for (int i = 0; i < n; i++) cin >> array[i];

    // 문제 해결 로직
    int result = binarySearch(array, target, 0, n - 1);

    // 결과 출력
    if (result == -1) cout << "Not Found" << "\n";
    else cout << result + 1 << "\n";

    return 0;
}
