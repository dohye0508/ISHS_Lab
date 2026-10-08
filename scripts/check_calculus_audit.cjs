// node scripts/check_calculus_audit.cjs | python scripts/check_calculus_audit.py
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const c = vm.createContext({window: {}});
const read = name => fs.readFileSync(name, 'utf8');
vm.runInContext(read('data/math/adv_collections_final.js'), c);
const base = c.window.generatedCollections.filter(v => /adv_col1b|adv_col3/.test(v.id));
assert.equal(base.flatMap(v => v.problems).length, 70);
assert(!JSON.stringify(base).match(/현수선|catenary/i));
vm.runInContext(read('data/math/inverse_hyperbolic_collections.js'), c);
assert(!JSON.stringify(c.window.generatedCollections).match(/현수선|catenary/i));
vm.runInContext(read('scripts/grader.js'), c);
process.stdout.write(JSON.stringify({base, pythonGrader: vm.runInContext('pythonGraderCode', c)}));
