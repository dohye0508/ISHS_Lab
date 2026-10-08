// Run: node scripts/check_change_of_basis.cjs
// Independent small-matrix checks for the convention used in the chapter and PDF examples.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const sandbox = { window: { proofTheorems: [] } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data/math/proof_change_of_basis.js'), 'utf8'), sandbox);
const proofs = sandbox.window.proofTheorems[0].theorems;
assert(proofs[10].statement.includes("(A')^{-1}A"));
assert(proofs[8].statement.includes('P_{B\\to B\'\'}=P_{B\'\\to B\'\'}P_{B\\to B\'}'));
assert(proofs[18].statement.includes('P_{B\\to B\'}=I-cE_{ij}'));
const multiply = (a, b) => a.map(row => b[0].map((_, j) => row.reduce((s, x, k) => s + x * b[k][j], 0)));
const det = a => a[0][0] * a[1][1] - a[0][1] * a[1][0];
const inverse = a => {
    const d = det(a);
    assert.notEqual(d, 0);
    return [[a[1][1] / d, -a[0][1] / d], [-a[1][0] / d, a[0][0] / d]];
};
const same = (a, b) => {
    assert.equal(a.length, b.length);
    a.forEach((row, i) => row.forEach((x, j) => assert(Math.abs(x - b[i][j]) < 1e-10)));
};
const I = [[1, 0], [0, 1]];
const A = I;
const Ap = [[1, 2], [1, 1]]; // PDF p. 7: new basis (1,1), (2,1).
const P = multiply(inverse(Ap), A);
same(P, [[-1, 2], [1, -1]]);
same(multiply(P, [[3], [5]]), [[7], [-2]]);
same(multiply(Ap, [[7], [-2]]), [[3], [5]]);
same(multiply(inverse(P), P), I);
const App = [[2, 1], [1, 1]];
same(multiply(multiply(inverse(App), Ap), P), multiply(inverse(App), A));
// Row reduction of [new | old], performed without using the transition formula.
const augmented = Ap.map((row, i) => [...row, ...A[i]]);
for (let j = 0; j < 2; j++) {
    if (!augmented[j][j]) [augmented[j], augmented[1 - j]] = [augmented[1 - j], augmented[j]];
    const pivot = augmented[j][j];
    augmented[j] = augmented[j].map(x => x / pivot);
    for (let i = 0; i < 2; i++) if (i !== j) {
        const scale = augmented[i][j];
        augmented[i] = augmented[i].map((x, k) => x - scale * augmented[j][k]);
    }
}
same(augmented.map(row => row.slice(0, 2)), I);
same(augmented.map(row => row.slice(2)), P);
// Scaling, swapping, adding another basis vector: direction and sign matter.
same(inverse([[2, 0], [0, -3]]), [[0.5, 0], [0, -1 / 3]]);
const swap = [[0, 1], [1, 0]];
same(multiply(swap, swap), I);
same(inverse([[1, 4], [0, 1]]), [[1, -4], [0, 1]]);
assert(Math.abs(det(P) - det(A) / det(Ap)) < 1e-10);
// All vectors of a basis determine a transition, but one vector need not.
same(multiply(I, [[1], [0]]), multiply([[1, 0], [0, 0.5]], [[1], [0]]));
assert.notEqual(I[1][1], 0.5);
console.log('PASS: textbook coordinate example, transition directions, composition, augmented row reduction, basis scaling/swap/replacement, determinant ratio.');
