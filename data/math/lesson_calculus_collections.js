// Based on 참고자료/미적분/고미 1차시 문제지.pdf and 고미 2차시 문제지.pdf.
// Preserve the original collections; these are lesson review collections with worked solutions.
(() => {
    const R = String.raw;
    const tex = s => s.split('$').map((v, i) => i % 2 ? v : (v.trim() ? `\\text{${v.trim()}}` : '')).join(' ');
    const q = (id, level, title, statement, solution, explanation) => ({
        id: `lesson_${id}`, template: `lesson_${id}`, level, title,
        latex: tex(statement), solution, explanation: tex(explanation), answerMode: 'exact'
    });
    const collections = [
        { id: 'adv_col1a_lesson1', name: '고미 1차시 · 역삼각함수와 대칭', description: '주값, 합성함수 미분, 치환과 대칭 적분 · 자료 1·2·3·5·6번', problems: [
            q('double', 1, '주값에서 삼각비 복원', R`$\sin(2\arccos(3/5))$ 의 값을 구하시오.`, R`\frac{24}{25}`,
                R`$\theta=\arccos(3/5)$ 로 놓는다. 주값은 $0\le\theta\le\pi$ 이며 코사인이 양수이므로 제1사분면이다. 따라서 $\sin\theta=\sqrt{1-9/25}=4/5$ 이다. 배각 공식에 대입하면 $\sin2\theta=2(4/5)(3/5)=24/25$ 이다. 제곱근 앞 부호는 주값 범위로 결정한다.`),
            q('atan_derivative', 2, '곱의 미분 뒤 소거', R`$f(x)=x\arctan x-\frac12\ln(1+x^2)$ 일 때 $f'(x)$ 를 구하시오.`, R`\arctan x`,
                R`첫 항은 곱이므로 $\arctan x+x/(1+x^2)$ 로 미분한다. 로그 항의 미분은 $-x/(1+x^2)$ 이다. 두 분수항이 서로 없어져 $f'(x)=\arctan x$ 만 남는다. 이 식은 역탄젠트의 부분적분 결과를 거꾸로 확인한 것이기도 하다.`),
            q('atan_composite', 3, '합성식을 먼저 미분하기', R`$f(x)=\arctan\left(\frac{\cos x}{1+\sin x}\right)$ 의 도함수를 구하시오. $1+\sin x\ne0$ 인 점에서만 구한다.`, R`-\frac12`,
                R`$u=\cos x/(1+\sin x)$ 라 두면 몫의 미분으로 $u'=(-\sin x-1)/(1+\sin x)^2=-1/(1+\sin x)$ 이다. 한편 $1+u^2=((1+\sin x)^2+\cos^2x)/(1+\sin x)^2=2/(1+\sin x)$ 이다. 따라서 $f'=u'/(1+u^2)=-1/2$ 이다. 정의역이 여러 구간으로 끊기므로 원래 함수가 실수 전체에서 하나의 직선이라고 결론 내리면 안 된다.`),
            q('exp_substitution', 2, '지수함수를 역탄젠트 적분으로', R`$\int_0^{\ln 2}\frac{e^x}{1+e^{2x}}\,dx$ 의 값을 구하시오.`, R`\arctan 2-\frac{\pi}{4}`,
                R`$t=e^x$ 로 놓으면 $dt=e^x dx$ 이다. 적분구간도 함께 바꾸어 $x=0$ 일 때 $t=1$, $x=\ln2$ 일 때 $t=2$ 를 얻는다. 따라서 적분은 $\int_1^2dt/(1+t^2)=[\arctan t]_1^2=\arctan2-\pi/4$ 이다.`),
            q('symmetry', 4, '두 적분을 더하여 지수항 제거', R`$I=\int_{-1}^1\frac{dx}{(1+x^2)(1+e^x)}$ 의 값을 구하시오.`, R`\frac{\pi}{4}`,
                R`$x=-t$ 로 치환하면 같은 적분이 $I=\int_{-1}^1dt/((1+t^2)(1+e^{-t}))$ 로 표현된다. 두 식을 더한다. $1/(1+e^t)+1/(1+e^{-t})=1$ 이므로 $2I=\int_{-1}^1dt/(1+t^2)=[\arctan t]_{-1}^1=\pi/2$ 이다. 따라서 $I=\pi/4$ 이다. 피적분함수 자체가 짝함수인 것은 아니며, 반사시킨 두 함수를 더한 것이 핵심이다.`)
        ]},
        { id: 'adv_col1b_lesson1', name: '고미 1차시 · 역쌍곡함수와 정의역', description: '로그 표현, 부호 판단, 방정식과 치환 적분 · 자료 1~5번', problems: [
            q('acosh_value', 1, '역쌍곡코사인의 로그 표현', R`$\operatorname{arcosh}2$ 를 자연로그로 나타내시오.`, R`\ln(2+\sqrt{3})`,
                R`$y=\operatorname{arcosh}2$ 라면 $y\ge0$, $(e^y+e^{-y})/2=2$ 이다. $z=e^y\ge1$ 로 놓으면 $z^2-4z+1=0$ 이므로 $z=2\pm\sqrt3$ 이다. $2-\sqrt3<1$ 은 제외하고 $z=2+\sqrt3$ 을 택한다. 따라서 $y=\ln(2+\sqrt3)$ 이다.`),
            q('acosh_sign', 4, '제곱근의 절댓값을 놓치지 않기', R`$f(x)=\operatorname{arcosh}(\sec x)$ 이다. $-\pi/2<x<0$ 에서 $f'(x)$ 를 구하시오.`, R`-\frac{1}{\cos x}`,
                R`역쌍곡코사인의 미분을 쓰면 $f'=\sec x\tan x/\sqrt{\sec^2x-1}$ 이다. 분모는 $\sqrt{\tan^2x}=|\tan x|$ 이지 항상 $\tan x$ 인 것은 아니다. 주어진 구간에서는 $\tan x<0$ 이므로 분모가 $-\tan x$ 가 되어 $f'=-\sec x=-1/\cos x$ 이다. 반대로 $0<x<\pi/2$ 에서는 $f'=\sec x$ 이다.`),
            q('hyp_equation', 3, '공통 역함수 값을 변수로', R`$\operatorname{arsinh}x=\operatorname{arcosh}(2x)$ 를 만족하는 실수 $x$ 를 구하시오.`, R`\frac{1}{\sqrt{3}}`,
                R`우변의 정의역에서 $x\ge1/2$ 이다. 공통 값을 $t$ 라 하면 $\sinh t=x$, $\cosh t=2x$ 이고 $t\ge0$ 이다. 항등식 $\cosh^2t-\sinh^2t=1$ 에서 $4x^2-x^2=1$ 이므로 $x=\pm1/\sqrt3$ 이다. 정의역에 맞는 양수만 남는다. 이 값에서 $t=\operatorname{arsinh}(1/\sqrt3)>0$ 이고 $\cosh t=2/\sqrt3$ 이므로 원래 방정식도 만족한다.`),
            q('hyp_integral', 2, '제곱근 적분의 로그 원시함수', R`$\int_0^4\frac{dx}{\sqrt{x^2+16}}$ 의 값을 구하시오.`, R`\ln(1+\sqrt2)`,
                R`$x=4\sinh t$ 로 놓으면 $dx=4\cosh t\,dt$, $\sqrt{x^2+16}=4\cosh t$ 이므로 피적분식이 $dt$ 로 바뀐다. 하한은 $t=0$, 상한은 $t=\operatorname{arsinh}1$ 이다. 따라서 값은 $\operatorname{arsinh}1=\ln(1+\sqrt2)$ 이다. 로그 원시함수 $\ln(x+\sqrt{x^2+16})$ 의 양 끝값을 빼도 같다.`),
            q('sixth_power', 4, '거듭제곱 치환 뒤 쌍곡함수 치환', R`$\int_{1/2}^{1/\sqrt[3]{2}}\frac{dx}{x\sqrt{1-x^6}}$ 의 값을 구하시오.`, R`\frac13\ln\left(\frac{8+\sqrt{63}}{2+\sqrt3}\right)`,
                R`전 구간에서 $0<x<1$ 이므로 제곱근은 양수다. $u=x^3$ 로 놓으면 $dx/x=du/(3u)$ 이고 양 끝은 $1/8,1/2$ 이다. 이어 $u=1/\cosh t$ 로 치환한다. $t>0$ 에서 $du/(u\sqrt{1-u^2})=-dt$ 이므로 원시함수는 $-\operatorname{arcosh}(1/u)$ 이다. 따라서 적분값은 $(\operatorname{arcosh}8-\operatorname{arcosh}2)/3$ 이고, 로그 공식으로 답을 얻는다. 치환하면서 상한이 작아지는 것과 마이너스 부호를 함께 확인한다.`)
        ]},
        { id: 'adv_col3_lesson1', name: '고미 1차시 · 이상적분', description: '끝점·내부 특이점의 분리, 수렴 판정과 대칭 · 자료 7·8번', problems: [
            q('improper_root', 2, '발산하는 함수도 적분은 수렴할 수 있다', R`$\int_0^1x^{-1/2}\,dx$ 의 값을 구하시오.`, R`2`,
                R`함수가 $x=0$ 에서 정의되지 않으므로 바로 대입하지 않고 $\lim_{\varepsilon\to0^+}\int_\varepsilon^1x^{-1/2}dx$ 로 정의한다. 원시함수는 $2\sqrt x$ 이므로 값은 $\lim_{\varepsilon\to0^+}(2-2\sqrt\varepsilon)=2$ 이다. 유한한 극한이 존재하므로 수렴한다.`),
            q('improper_exp', 3, '무한구간에서 부분적분', R`$\int_0^\infty xe^{-x}\,dx$ 의 값을 구하시오.`, R`1`,
                R`먼저 유한구간 $[0,b]$ 에서 부분적분한다. $u=x$, $dv=e^{-x}dx$ 를 쓰면 $\int_0^bxe^{-x}dx=[-(x+1)e^{-x}]_0^b=1-(b+1)e^{-b}$ 이다. 지수함수가 일차식보다 빠르게 커지므로 $(b+1)e^{-b}\to0$ 이다. 따라서 $b\to\infty$ 의 극한은 1이고 적분은 수렴한다.`),
            q('internal_singularity', 3, '내부 특이점은 양쪽을 따로', R`$\int_0^3\frac{dx}{(\sqrt[3]{x-1})^2}$ 의 값을 구하시오. 세제곱근은 실수 세제곱근이다.`, R`3(1+\sqrt[3]{2})`,
                R`$x=1$ 에서 끊기므로 $\int_0^1+\int_1^3$ 으로 나누고 각각의 수렴을 확인한다. 왼쪽에서 $u=1-x$ 를 쓰면 $\int_0^1u^{-2/3}du=3$ 이다. 오른쪽에서 $v=x-1$ 을 쓰면 $\int_0^2v^{-2/3}dv=3\sqrt[3]2$ 이다. 두 값이 모두 유한하므로 더하여 $3(1+\sqrt[3]2)$ 를 얻는다. 특이점 양쪽을 하나의 극한으로 상쇄시키는 방식은 이상적분의 정의가 아니다.`),
            q('log_endpoint', 3, '로그의 무한대와 적분의 수렴', R`$\int_0^1\ln x\,dx$ 의 값을 구하시오.`, R`-1`,
                R`$\varepsilon>0$ 에서 부분적분하면 $\int_\varepsilon^1\ln x\,dx=[x\ln x-x]_\varepsilon^1=-1-\varepsilon\ln\varepsilon+\varepsilon$ 이다. $\varepsilon=e^{-t}$ 로 놓으면 $\varepsilon\ln\varepsilon=-te^{-t}\to0$ 임을 확인할 수 있다. 따라서 극한은 $-1$ 이다. 함수가 아래로 발산해도 넓이의 절댓값은 유한할 수 있다.`),
            q('reciprocal_symmetry', 5, '수렴부터 확인하는 역수 치환', R`$\int_0^\infty\frac{\ln x}{1+x^2}\,dx$ 의 값을 구하시오.`, R`0`,
                R`먼저 1에서 나눈다. $0<x\le1$ 에서 절댓값은 $-\ln x$ 이하이고 그 적분은 1이다. $x\ge1$ 에서는 $\ln x/x^2$ 이하이며 부분적분으로 그 적분도 1이다. 따라서 양쪽 모두 절대수렴한다. 이제 뒤쪽 적분에 $x=1/t$ 를 대입하면 $\int_1^\infty\ln x/(1+x^2)dx=-\int_0^1\ln t/(1+t^2)dt$ 가 되어 앞쪽과 상쇄된다. 결과는 0이다. 수렴 확인 없이 무한대끼리 뺀 것이 아니다.`)
        ]},
        { id: 'adv_col3_lesson2_volume', name: '고미 2차시 · 회전체의 부피', description: '와셔·원통껍질, 평행이동한 축과 기울어진 축 · 자료 1~3번', problems: [
            q('washer', 2, 'y축 회전에서 가로 단면', R`$y=x^2$ 와 $y=x$ 로 둘러싸인 영역을 $y$ 축 둘레로 회전한 부피를 구하시오.`, R`\frac{\pi}{6}`,
                R`교점은 $x=0,1$ 이다. 높이 $0\le y\le1$ 에서 영역의 왼쪽 경계는 $x=y$, 오른쪽 경계는 $x=\sqrt y$ 이다. 회전 단면은 바깥 반지름 $\sqrt y$, 안쪽 반지름 $y$ 인 와셔다. 따라서 $V=\pi\int_0^1(y-y^2)dy=\pi(1/2-1/3)=\pi/6$ 이다. 세로 원통껍질로 $2\pi\int_0^1x(x-x^2)dx$ 를 써도 같다.`),
            q('sine_shell', 3, '껍질의 반지름이 치환을 돕는다', R`$y=\sin(x^2)$, $x$ 축, $x=\sqrt\pi$ 로 둘러싸인 $0\le x\le\sqrt\pi$ 의 영역을 $y$ 축 둘레로 회전한 부피를 구하시오.`, R`2\pi`,
                R`세로 조각을 회전시키면 반지름 $x$, 높이 $\sin(x^2)$ 인 껍질이 된다. 이 구간에서 높이는 음수가 아니다. $V=2\pi\int_0^{\sqrt\pi}x\sin(x^2)dx$ 에 $u=x^2$, $du=2x\,dx$ 를 적용하면 $V=\pi\int_0^\pi\sin u\,du=2\pi$ 이다.`),
            q('shifted_disk', 3, '축과 곡선 사이 거리가 반지름', R`$y=x^2$ 와 $y=4$ 사이의 영역을 직선 $y=4$ 둘레로 회전한 부피를 구하시오.`, R`\frac{512\pi}{15}`,
                R`교점에서 $x=\pm2$ 이다. 회전축이 위쪽 경계이므로 단면은 구멍 없는 원판이며 반지름은 $4-x^2$ 이다. $V=\pi\int_{-2}^2(4-x^2)^2dx=2\pi\int_0^2(16-8x^2+x^4)dx$ 이다. 계산하면 $2\pi[16x-8x^3/3+x^5/5]_0^2=512\pi/15$ 이다. 반지름을 $x^2$ 로 쓰면 다른 축에 대한 부피가 된다.`),
            q('shifted_shell', 4, '영역 바깥의 수직축', R`$y=e^x$, $y=1$, $x=1$ 로 둘러싸인 영역을 $x=2$ 둘레로 회전한 부피를 구하시오.`, R`4e\pi-9\pi`,
                R`두 곡선의 교점은 $x=0$ 이므로 구간은 $[0,1]$ 이다. 세로 껍질의 반지름은 $2-x$, 높이는 $e^x-1$ 이다. 따라서 $V=2\pi\int_0^1(2-x)(e^x-1)dx$ 이다. $(2-x)e^x$ 의 원시함수는 $(3-x)e^x$ 이므로 첫 부분은 $2e-3$ 이고, $\int_0^1(2-x)dx=3/2$ 이다. 두 값을 빼면 $V=2\pi(2e-9/2)$ 이다.`),
            q('oblique_volume', 5, '기울어진 축까지의 거리로 적분', R`$y=x^2$ 와 $y=x$ 사이의 영역을 직선 $y=x$ 둘레로 회전한 부피를 구하시오.`, R`\frac{\sqrt2\pi}{60}`,
                R`축 방향 좌표를 $u=(x+y)/\sqrt2$, 수직 거리를 $r=(x-y)/\sqrt2$ 로 잡는다. 영역은 축의 한쪽에 있고 회전 좌표변환은 넓이를 보존한다. 축에 수직인 작은 면적 $dA$ 가 회전할 때 부피 요소는 $2\pi r\,dA$ 이다. 따라서 $V=\sqrt2\pi\int_0^1\int_{x^2}^{x}(x-y)\,dy\,dx$ 이다. 안쪽 적분은 $(x-x^2)^2/2$ 이므로 $V=(\pi/\sqrt2)\int_0^1(x^2-2x^3+x^4)dx=(\pi/\sqrt2)(1/3-1/2+1/5)=\sqrt2\pi/60$ 이다. 이는 거리의 평균을 이용한 회전 부피 공식과 같으며, 축이 영역의 내부를 통과하지 않아 중복해서 세지 않는다.`)
        ]},
        { id: 'adv_col3_lesson2_surface', name: '고미 2차시 · 회전 곡면적', description: '호의 길이 요소와 회전 반지름, 매개변수 곡선 · 자료 4번', problems: [
            q('surface_root', 3, '호의 길이와 반지름을 따로 계산', R`곡선 $y=2\sqrt x$, $1\le x\le2$ 를 $x$ 축 둘레로 회전한 곡면의 넓이를 구하시오. 양 끝의 원판은 포함하지 않는다.`, R`\frac{8\pi}{3}(3\sqrt3-2\sqrt2)`,
                R`곡면적은 $S=2\pi\int r\,ds$ 이다. 여기서는 $r=2\sqrt x$, $y'=1/\sqrt x$, $ds=\sqrt{1+1/x}\,dx$ 이다. 곱을 먼저 정리하면 $r\,ds=2\sqrt{x+1}\,dx$ 가 된다. 따라서 $S=4\pi\int_1^2\sqrt{x+1}dx=(8\pi/3)[(x+1)^{3/2}]_1^2=(8\pi/3)(3\sqrt3-2\sqrt2)$ 이다.`),
            q('surface_cosh', 3, '쌍곡함수 항등식으로 제곱근 제거', R`$y=\cosh x$, $0\le x\le1$ 을 $x$ 축 둘레로 회전한 곡면의 넓이를 구하시오. 끝면은 제외한다.`, R`\pi+\frac{\pi}{4}(e^2-e^{-2})`,
                R`$y'=\sinh x$ 이고 $\sqrt{1+\sinh^2x}=\cosh x$ 이다. 따라서 $S=2\pi\int_0^1\cosh^2x\,dx$ 이다. 배각식 $\cosh^2x=(1+\cosh2x)/2$ 를 쓰면 $S=\pi[x+\sinh2x/2]_0^1=\pi+\pi\sinh2/2$ 이다. $\sinh2=(e^2-e^{-2})/2$ 를 대입하면 답의 지수 표현을 얻는다.`),
            q('cycloid', 4, '사이클로이드 한 아치의 곡면적', R`$x=t-\sin t$, $y=1-\cos t$, $0\le t\le2\pi$ 를 $x$ 축 둘레로 회전한 곡면의 넓이를 구하시오.`, R`\frac{64\pi}{3}`,
                R`매개변수 곡선에서 $ds=\sqrt{(x')^2+(y')^2}dt$ 이다. 따라서 $ds=\sqrt{(1-\cos t)^2+\sin^2t}dt=2\sin(t/2)dt$ 이다. 이 구간에서는 $\sin(t/2)\ge0$ 이므로 절댓값을 이렇게 없앨 수 있다. 또한 $y=2\sin^2(t/2)$ 이므로 $S=8\pi\int_0^{2\pi}\sin^3(t/2)dt=16\pi\int_0^\pi\sin^3u\,du$ 이다. $v=\cos u$ 로 치환하면 마지막 적분은 $\int_{-1}^1(1-v^2)dv=4/3$ 이므로 $S=64\pi/3$ 이다.`),
            q('surface_setup', 3, '계산보다 적분식 세우기', R`$y=x^3$, $0\le x\le1$ 을 $y=-1$ 둘레로 회전한 곡면적을 $S=2\pi\int_0^1 f(x)dx$ 로 나타낸다. 반지름과 호의 길이 요소를 곱하여 얻는 $f(x)$ 를 구하시오.`, R`(x^3+1)\sqrt{1+9x^4}`,
                R`곡선 위 점의 회전축까지 거리는 $r=x^3-(-1)=x^3+1$ 이다. $y'=3x^2$ 이므로 $ds=\sqrt{1+9x^4}\,dx$ 이다. 곡면적 공식 $S=\int2\pi r\,ds$ 에 대입하면 $S=2\pi\int_0^1(x^3+1)\sqrt{1+9x^4}dx$ 이다. 따라서 답은 피적분함수 $(x^3+1)\sqrt{1+9x^4}$ 이며, 이 문제에서는 원시함수를 구할 필요가 없다.`),
            q('astroid_surface', 5, '별모양 곡선의 매개변수화', R`$x^{2/3}+y^{2/3}=1$ 의 제1사분면 부분을 $x=1$ 둘레로 회전한 곡면의 넓이를 구하시오. 끝면은 제외한다.`, R`\frac{9\pi}{5}`,
                R`$x=\cos^3t$, $y=\sin^3t$, $0\le t\le\pi/2$ 로 놓으면 곡선 방정식을 만족한다. 미분하면 $ds=3\sin t\cos t\,dt$ 이고 반지름은 $r=1-\cos^3t$ 이다. 따라서 $S=6\pi\int_0^{\pi/2}(1-\cos^3t)\sin t\cos t\,dt$ 이다. $u=\cos t$ 로 바꾸면 $S=6\pi\int_0^1(u-u^4)du=6\pi(1/2-1/5)=9\pi/5$ 이다. 부피 공식의 반지름 제곱 대신 곡면적 공식의 반지름과 호의 길이를 사용한다.`)
        ]}
    ];
    // Do not create "고미 1차시/2차시" cards.  Each source problem belongs in the
    // ordinary topic collection where a student would expect to meet that skill.
    // This keeps every collection between five and ten questions.
    const target = id => window.generatedCollections.find(c => c.id === id);
    const place = (sourceId, targetId, indexes) => {
        const source = collections.find(c => c.id === sourceId);
        const destination = target(targetId);
        if (!source || !destination) throw new Error(`Missing calculus collection: ${sourceId} -> ${targetId}`);
        destination.problems.push(...indexes.map(index => source.problems[index]));
    };
    place('adv_col1a_lesson1', 'adv_col1a_1', [0, 1, 2]);
    place('adv_col1a_lesson1', 'adv_col1a_2', [3]);
    place('adv_col1a_lesson1', 'adv_col1a_5', [4]);
    place('adv_col1b_lesson1', 'adv_col1b_1', [0, 1, 2]);
    place('adv_col1b_lesson1', 'adv_col1b_2', [3, 4]);
    place('adv_col3_lesson1', 'adv_col1b_5', [0, 1]);
    place('adv_col3_lesson1', 'adv_col3_7', [2, 3, 4]);
    place('adv_col3_lesson2_volume', 'adv_col3_1', [0, 2]);
    place('adv_col3_lesson2_volume', 'adv_col3_2', [1, 3]);
    place('adv_col3_lesson2_volume', 'adv_col3_4', [4]);
    place('adv_col3_lesson2_surface', 'adv_col3_6', [0, 1, 3, 4]);
    place('adv_col3_lesson2_surface', 'adv_col3_5', [2]);
})();
