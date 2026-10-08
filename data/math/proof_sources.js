// Load after proof_orthogonal.js. 참고자료/대수 PDF에 정리·성질로 직접 실린 증명을 표시한다.
// 키는 proof_levels.js와 같은 안정 키(번호가 바뀌어도 유지)를 쓴다.
(function () {
    const units = {
        2: '2. 역행렬', 3: '3. 행렬식(여러 가지 행렬)', 5: '5. 행렬식의 성질',
        4: '4. 행렬식의 계산', 6: '6. 벡터공간과 부분공간, 생성',
        7: '7. 일차독립과 일차종속, 기저, 좌표', 8: '8. 차원', 9: '9. 기저의 변경',
        10: '10. 내적, 정사영, 정규직교기저'
    };
    const sources = {
        'original:2.1': [2, '정리 1.2.1'],
        'original:2.2': [2, '정리 1.2.2'],
        'original:2.3': [2, '역행렬의 성질 ②'],
        'original:2.4': [2, '정리 1.2.4'],
        'original:2.5': [2, '정리 1.2.5'],
        'original:2.6': [2, '정리 1.2.3'],
        'original:2.7': [2, '정리 1.2.3'],
        'original:3.1': [3, '정리 1.3.1 (b)'],
        'original:3.2': [3, '정리 1.3.1 (b)'],
        'original:3.3': [3, '정리 1.3.1 (d)'],
        'original:3.4': [3, '정리 1.3.4'],
        'original:3.6': [3, '정리 1.3.2'],
        'original:3.7': [3, '정리 1.3.3'],
        'original:4.1': [4, '정리 1.4.2'],
        'original:4.2': [4, '정리 1.4.3'],
        'original:4.4': [5, '성질 2'],
        'original:4.5': [4, '정리 1.4.1'],
        'original:5.1': [5, '성질 3'],
        'original:5.2': [5, '정리 1.5.4'],
        'original:5.3': [5, '정리 1.5.5'],
        'original:5.6': [5, '보조정리 1.5.3'],
        'original:6.1': [6, '정리 2.1.1'],
        'original:6.2': [6, '정리 2.1.2'],
        'original:6.3': [6, '정리 2.1.3'],
        'original:6.4': [6, '정리 2.1.4'],
        'original:7.1': [7, '정리 2.2.1'],
        'original:7.2': [7, '정리 2.2.2'],
        'original:8.1': [8, '정리 2.3.1'],
        'original:8.2': [8, '정리 2.3.2'],
        'original:8.3': [8, '정리 2.3.3'],
        'original:8.4': [8, '정리 2.3.4'],
        'original:8.5': [8, '정리 2.3.5'],
        'original:8.6': [8, '정리 2.3.6'],
        'basis-1': [7, '좌표의 성질'],
        'basis-7': [9, '정리 2.4.1'],
        'basis-10': [9, '정리 2.4.2'],
        'basis-12': [9, '전이행렬 계산절차'],
        'orthogonal-v1-1': [10, '내적의 성질 1'],
        'orthogonal-v1-4': [10, '예제 2 코시–슈바르츠 부등식'],
        'orthogonal-v1-6': [10, '내적의 성질 2'],
        'orthogonal-v1-29': [10, '그람–슈미트 직교화 과정']
    };
    window.proofTheorems.forEach(chapter => chapter.theorems.forEach(theorem => {
        const key = theorem.sourceNum !== undefined ? 'source:' + theorem.sourceNum :
            theorem.supplementId || theorem.advancedId || theorem.basisId || theorem.orthogonalId || 'original:' + theorem.num;
        const source = sources[key];
        if (source) theorem.referenceSource = { unit: units[source[0]], label: source[1] };
    }));
})();
