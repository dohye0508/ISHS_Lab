// Actual Advanced Math page, locally served with mock auth/history. No production requests.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'tmp/orthogonal_review');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname.startsWith('/api/')){
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify(url.pathname.includes('user_system')?{logged_in:true,user:{nickname:'검증 계정'}}:{status:'success',records:[],leaderboard:{rows:[],current:null},attempt:{id:1,token:'a'.repeat(64)}}));return;
    }
    const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;res.end();return;}
    let content=fs.readFileSync(file);
    if(file.endsWith('.php'))content=Buffer.from(content.toString().replace(/^<\?php[\s\S]*?\?>/,''));
    res.setHeader('Content-Type',({'.js':'application/javascript','.php':'text/html; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.end(content);
});
(async()=>{
    await new Promise(r=>server.listen(0,'127.0.0.1',r));
    const browser=await chromium.launch({channel:'msedge',headless:true});
    try{
        const page=await browser.newPage({viewport:{width:1280,height:960}});page.setDefaultTimeout(30000);
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}/adv_math.php`,{waitUntil:'networkidle',timeout:60000});
        if(!process.argv.includes('--layout-only'))await page.waitForFunction(()=>isGraderReady,{},{timeout:150000});
        assert.equal(await page.evaluate(()=>algebraCollections.length),12);
        assert.equal(await page.evaluate(()=>proofTheorems[9].theorems.length),36);
        await page.evaluate(()=>{switchModalSubject('algebra');openCollectionModal();});
        await page.screenshot({path:path.join(out,'collections-desktop.png'),fullPage:true});
        console.log('PASS: actual page loaded 12 algebra collections and 10 proof chapters.');
        const results=process.argv.includes('--layout-only')?[]:await page.evaluate(async()=>{
            const output=[];
            for(const set of algebraCollections.filter(c=>c.id.startsWith('alg_orth_')))for(const p of set.problems){
                const equivalent=p.solution.includes('pmatrix')?p.solution.replaceAll('pmatrix','bmatrix'):'('+p.solution+')+0';
                const result=await gradeProblem(equivalent,p.solution,false,30000,true);
                if(result!=='CORRECT')output.push({id:p.id,result});
            }
            return output;
        });
        assert.deepEqual(results,[]);
        if(!process.argv.includes('--layout-only'))console.log('PASS: 30 equivalent answers accepted by actual browser grader.');
        await page.setViewportSize({width:390,height:844});
        await page.evaluate(()=>startProofChapter(9));
        await page.waitForFunction(()=>getComputedStyle(document.getElementById('collection-modal')).visibility==='hidden');
        for(let i=0;i<36;i++){
            await page.evaluate(async i=>{proofState.index=i;loadCurrentProofTheorem();toggleProofExplanation();await MathJax.typesetPromise();},i);
            assert.equal(await page.locator('mjx-merror,[data-mjx-error]').count(),0,`Proof ${i+1}`);
            const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
            if(overflow)await page.screenshot({path:path.join(out,'overflow.png'),fullPage:true});
            assert(!overflow,`Proof ${i+1}: mobile overflow; inspect tmp/orthogonal_review/overflow.png`);
            if(i===28)await page.screenshot({path:path.join(out,'proof-gs-mobile.png'),fullPage:true});
        }
        console.log('PASS: all 36 proof statements and full explanations rendered on mobile.');
        await page.evaluate(()=>{document.getElementById('proof-view').style.display='none';document.getElementById('landing-view').style.display='none';});
        const count=await page.evaluate(async()=>{
            const qa=document.createElement('main');qa.id='qa';qa.style.cssText='width:100%;max-width:1000px;margin:auto;padding:12px;box-sizing:border-box';
            for(const set of algebraCollections.filter(c=>c.id.startsWith('alg_orth_')))for(const p of set.problems){
                const article=document.createElement('article');article.id=p.id;article.style.cssText='padding:18px;border:1px solid #ddd;margin-bottom:24px;overflow-x:auto;background:var(--surface,#fff)';
                article.innerHTML=`<h2>${escapeHtmlText(p.title)}</h2>${buildProblemHtml(p.latex)}<details open class="problem-explanation"><summary>풀이</summary>${buildProblemHtml(p.explanation)}<p>정답: \\( ${p.solution} \\)</p></details>`;qa.append(article);
            }
            document.body.append(qa);await MathJax.typesetPromise([qa]);return qa.querySelectorAll('mjx-container').length;
        });
        assert.equal(await page.locator('mjx-merror,[data-mjx-error]').count(),0);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        await page.locator('#alg_orth_v1_gs_inverse').screenshot({path:path.join(out,'algebra-mobile.png')});
        await page.setViewportSize({width:1280,height:960});
        await page.locator('#alg_orth_v1_four_projection').screenshot({path:path.join(out,'algebra-desktop.png')});
        assert(count>300);assert.deepEqual(errors,[]);
        assert(!fs.readFileSync(path.join(root,'modules.php'),'utf8').includes("enterModule('physics.php')"));
        console.log(`PASS: 30 algebra statements/solutions (${count} math blocks), mobile layout, no browser exceptions, physics launcher absent.`);
    }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
