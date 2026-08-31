/*
병합 정렬 (Merge Sort)
분할 정정(Divide and Conquer) 방식을 사용하는 정교하고 안정적인 정렬 알고리즘입니다.
전체 성분을 절반으로 나누고, 다시 합치는 과정에서 정렬을 수행하며 O(N log N)의 시간 복잡도를 가집니다.

[입력 예시]
8
1 20 5 15 2 10 3 8

[출력 예시]
1 2 3 5 8 10 15 20
*/
#include <bits/stdc++.h>
using namespace std;

vector<int> merge(vector<int>& left, vector<int>& right) {
    vector<int> result;
    int i = 0, j = 0;

    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] < right[j]) {
            result.push_back(left[i]);
            i++;
        } else {
            result.push_back(right[j]);
            j++;
        }
    }

    // 남은 요소들 추가
    while (i < (int)left.size()) result.push_back(left[i++]);
    while (j < (int)right.size()) result.push_back(right[j++]);
    return result;
}

vector<int> mergeSort(vector<int> arr) {
    if (arr.size() <= 1) return arr;

    // 1. 분할 (Divide)
    int mid = (int)arr.size() / 2;
    vector<int> leftHalf(arr.begin(), arr.begin() + mid);
    vector<int> rightHalf(arr.begin() + mid, arr.end());
    vector<int> left = mergeSort(leftHalf);
    vector<int> right = mergeSort(rightHalf);

    // 2. 정복 및 합치기 (Conquer & Merge)
    return merge(left, right);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 데이터 입력
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // 문제 해결 로직
    vector<int> sortedNums = mergeSort(nums);

    // 결과 출력
    for (int i = 0; i < (int)sortedNums.size(); i++) {
        cout << sortedNums[i];
        if (i != (int)sortedNums.size() - 1) cout << " ";
    }
    cout << "\n";

    return 0;
}
