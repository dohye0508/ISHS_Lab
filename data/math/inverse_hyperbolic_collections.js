// Hand-curated advanced inverse-trigonometric and hyperbolic collections.
// $...$ delimits mathematics so Advanced Math Studio can wrap Korean prose safely.
(() => {
    const tex = (s) => s.split('$').map((part, i) => i % 2 ? part : (part.trim() ? `\\text{${part.trim()}}` : '')).join(' ');
    const q = (id, level, title, statement, solution, explanation) => ({
        id, level, template: id, title, latex: tex(statement), solution, explanation: tex(explanation)
    });
    const R = String.raw;
    const collections = [
        {
            id: 'adv_col1a_v2_6', name: '역삼각함수 심화 6 · 주값과 가지의 추적',
            description: '합성식의 모양보다 주값 범위와 불연속점을 먼저 판정하기',
            problems: [
                q('inv_branch_rational_acos', 5, '절댓값이 숨어 있는 반각 공식',
                    R`정적분 $\int_{-1}^{1}\cos^{-1}\left(\frac{1-x^2}{1+x^2}\right)dx$ 의 값을 구하시오. $\cos^{-1}$ 의 값은 $[0,\pi]$ 에서 택한다.`,
                    R`\pi-2\ln(2)`,
                    R`$t=\tan^{-1}x$ 라 하면 $t\in[-\pi/4,\pi/4]$ 이고 분수는 $\cos2t$ 이다. 주값 때문에 $\cos^{-1}(\cos2t)=2|t|=2\tan^{-1}|x|$ 이다. 짝함수를 적분하면 $4\int_0^1\tan^{-1}x\,dx=\pi-2\ln2$ 이다.`),
                q('inv_branch_tan3x', 5, '주기함수 합성의 톱니 모양',
                    R`정적분 $\int_0^{\pi/2}\tan^{-1}(\tan3x)dx$ 의 값을 구하시오. $\tan^{-1}$ 의 값은 $(-\pi/2,\pi/2)$ 에서 택하며, 적분구간 안의 불연속점에서는 이상적분으로 해석한다.`,
                    R`\frac{\pi^2}{24}`,
                    R`$0<x<\pi/6$ 에서는 값이 $3x$, $\pi/6<x<\pi/2$ 에서는 $3x-\pi$ 이다. 뒤 구간의 직선은 $x=\pi/3$ 을 중심으로 홀대칭이어서 적분값이 0이다. 앞 구간만 적분하면 $\int_0^{\pi/6}3x\,dx=\pi^2/24$ 이다.`),
                q('inv_branch_roots_unity', 5, '단위원 위 각의 주값 접기',
                    R`$S=\sum_{k=0}^{6}\cos^{-1}\left(\cos\frac{2\pi k}{7}\right)$ 일 때 $S$ 를 구하시오.`,
                    R`\frac{24\pi}{7}`,
                    R`$\cos^{-1}(\cos t)$ 는 $t$ 를 $[0,\pi]$ 로 접은 값이다. 일곱 항은 차례로 $0,2\pi/7,4\pi/7,6\pi/7,6\pi/7,4\pi/7,2\pi/7$ 이므로 합은 $24\pi/7$ 이다.`),
                q('inv_branch_triangle_wave', 5, '역삼각함수가 만드는 삼각파',
                    R`정적분 $\int_0^{3\pi}|\sin^{-1}(\sin x)|dx$ 의 값을 구하시오.`,
                    R`\frac{3\pi^2}{4}`,
                    R`$|\sin^{-1}(\sin x)|$ 는 길이 $\pi$ 인 각 구간에서 밑변 $\pi$, 높이 $\pi/2$ 인 같은 삼각형 하나를 만든다. $[0,3\pi]$ 에 세 개가 있으므로 넓이는 $3\cdot\frac12\pi\cdot\frac\pi2=3\pi^2/4$ 이다.`),
                q('inv_branch_double_angle', 5, '배각 공식의 허용 구간',
                    R`정적분 $\int_0^1\tan^{-1}\left(\frac{2x}{1-x^2}\right)dx$ 의 값을 구하시오. 끝점의 함수값은 좌극한으로 해석한다.`,
                    R`\frac{\pi}{2}-\ln(2)`,
                    R`$0\le x<1$ 에서는 $0\le2\tan^{-1}x<\pi/2$ 이므로 주값을 벗어나지 않아 피적분함수는 $2\tan^{-1}x$ 이다. $\int\tan^{-1}x\,dx=x\tan^{-1}x-\frac12\ln(1+x^2)$ 를 사용하면 결과는 $\pi/2-\ln2$ 이다.`)
            ]
        },
        {
            id: 'adv_col1a_v2_7', name: '역삼각함수 심화 7 · 급수와 국소 구조',
            description: '테일러 계수, 고계도함수와 정밀한 극한',
            problems: [
                q('inv_series_asin_x9', 5, '중심이항계수가 만드는 고차항',
                    R`$\sin^{-1}x$ 의 매클로린 급수에서 $x^9$ 의 계수를 구하시오.`,
                    R`\frac{35}{1152}`,
                    R`일반항은 $\frac{(2n)!}{4^n(n!)^2(2n+1)}x^{2n+1}$ 이다. $2n+1=9$, 즉 $n=4$ 를 대입하면 $8!/(4^4(4!)^2\cdot9)=35/1152$ 이다.`),
                q('inv_series_atan_derivative7', 5, '급수에서 읽는 고계도함수',
                    R`$f(x)=\tan^{-1}x$ 일 때 $f^{(7)}(0)$ 을 구하시오.`,
                    R`-720`,
                    R`$\tan^{-1}x=x-x^3/3+x^5/5-x^7/7+\cdots$ 이므로 $x^7$ 의 계수는 $-1/7$ 이다. 따라서 $f^{(7)}(0)=7!(-1/7)=-720$ 이다.`),
                q('inv_series_asin_remainder', 5, '세 항을 제거한 뒤 남는 정보',
                    R`극한 $\lim_{x\to0}\frac{\sin^{-1}x-x-\frac{x^3}{6}}{x^5}$ 를 구하시오.`,
                    R`\frac{3}{40}`,
                    R`$\sin^{-1}x=x+x^3/6+3x^5/40+O(x^7)$ 이다. 분자에서 앞의 두 비선형 항까지 제거하고 $x^5$ 로 나누면 극한은 $3/40$ 이다.`),
                q('inv_series_asin_square', 5, '합성 급수의 짝수차 계수',
                    R`$(\sin^{-1}x)^2$ 의 매클로린 급수에서 $x^8$ 의 계수를 구하시오.`,
                    R`\frac{4}{35}`,
                    R`$(\sin^{-1}x)^2=\frac12\sum_{n\ge1}\frac{(2x)^{2n}}{n^2\binom{2n}{n}}$ 이다. $n=4$ 항은 $\frac12\cdot\frac{2^8}{4^2\binom84}=4/35$ 이다.`),
                q('inv_series_binomial_sum', 5, '함숫값으로 닫히는 무한급수',
                    R`무한급수 $\sum_{n=0}^{\infty}\frac{\binom{2n}{n}}{4^n(2n+1)}$ 의 값을 구하시오.`,
                    R`\frac{\pi}{2}`,
                    R`$\sin^{-1}x=\sum_{n\ge0}\frac{\binom{2n}{n}}{4^n(2n+1)}x^{2n+1}$ 이다. 계수들이 양수이고 $x=1$ 에서 급수가 수렴하므로 대입하면 합은 $\sin^{-1}1=\pi/2$ 이다.`)
            ]
        },
        {
            id: 'adv_col1a_v2_8', name: '역삼각함수 심화 8 · 매개변수 적분',
            description: '치환, 적분 기호 아래 미분과 이상적분의 결합',
            problems: [
                q('inv_param_improper_atan', 5, '각도 변수로 바꾸는 이상적분',
                    R`이상적분 $\int_0^{\infty}\frac{\tan^{-1}x}{x(1+x^2)}dx$ 의 값을 구하시오.`,
                    R`\frac{\pi}{2}\ln(2)`,
                    R`$t=\tan^{-1}x$ 로 바꾸면 적분은 $\int_0^{\pi/2}t\cot t\,dt$ 이다. 부분적분하면 경계항은 0이고 $-\int_0^{\pi/2}\ln(\sin t)dt$ 의 $\pi/2$ 배가 남는다. 고전적 적분 $\int_0^{\pi/2}\ln(\sin t)dt=-(\pi/2)\ln2$ 를 쓰면 $\pi\ln2/2$ 이다.`),
                q('inv_param_I_derivative', 5, '적분을 닫힌식으로 만든 뒤 미분하기',
                    R`$I(a)=\int_0^1\frac{dx}{1+a^2x^2}$ $(a>0)$ 일 때 $I'(1)$ 을 구하시오.`,
                    R`\frac{1}{2}-\frac{\pi}{4}`,
                    R`$I(a)=\tan^{-1}a/a$ 이다. 따라서 $I'(a)=\frac{a/(1+a^2)-\tan^{-1}a}{a^2}$ 이고 $a=1$ 을 대입하면 $1/2-\pi/4$ 이다.`),
                q('inv_param_sqrt_atan', 5, '겹친 제곱근을 제거하는 치환',
                    R`정적분 $\int_0^1\frac{\tan^{-1}\sqrt{x}}{\sqrt{x}}dx$ 의 값을 구하시오.`,
                    R`\frac{\pi}{2}-\ln(2)`,
                    R`$x=u^2$ 로 두면 적분은 $2\int_0^1\tan^{-1}u\,du$ 이다. 부분적분의 원시함수 $u\tan^{-1}u-\frac12\ln(1+u^2)$ 를 대입하면 $\pi/2-\ln2$ 이다.`),
                q('inv_param_asin_over_x', 5, '삼각치환 뒤 로그 적분',
                    R`정적분 $\int_0^1\frac{\sin^{-1}x}{x}dx$ 의 값을 구하시오.`,
                    R`\frac{\pi}{2}\ln(2)`,
                    R`$x=\sin t$ 로 바꾸면 $\int_0^{\pi/2}t\cot t\,dt$ 가 된다. 부분적분과 $\int_0^{\pi/2}\ln(\sin t)dt=-(\pi/2)\ln2$ 를 이용하면 $\pi\ln2/2$ 이다.`),
                q('inv_param_second_derivative', 5, '적분 기호 아래 두 번의 구조 읽기',
                    R`$F(a)=\int_0^1\tan^{-1}(ax)dx$ $(a>0)$ 일 때 $F''(1)$ 을 구하시오.`,
                    R`\frac{1}{2}-\ln(2)`,
                    R`적분 기호 아래에서 미분하면 $F'(a)=\int_0^1\frac{x}{1+a^2x^2}dx=\frac{\ln(1+a^2)}{2a^2}$ 이다. 이를 한 번 더 미분하여 $a=1$ 을 넣으면 $F''(1)=1/2-\ln2$ 이다.`)
            ]
        },
        {
            id: 'adv_col1a_v2_9', name: '역삼각함수 심화 9 · 넓이와 무게중심',
            description: '역함수의 그래프가 만드는 영역을 적분으로 해석하기',
            problems: [
                q('inv_geo_between_inverse_curves', 5, '서로 보완각인 두 곡선 사이',
                    R`$0\le x\le1/\sqrt{2}$ 에서 두 곡선 $y=\cos^{-1}x$, $y=\sin^{-1}x$ 사이 영역의 넓이를 구하시오.`,
                    R`2-\sqrt{2}`,
                    R`두 함수의 차는 $\pi/2-2\sin^{-1}x$ 이다. $\int\sin^{-1}x\,dx=x\sin^{-1}x+\sqrt{1-x^2}$ 를 사용해 $0$ 에서 $1/\sqrt2$ 까지 계산하면 $2-\sqrt2$ 이다.`),
                q('inv_geo_centroid_x', 5, '역사인 아래 영역의 가로 무게중심',
                    R`$0\le x\le1$ 에서 $y=\sin^{-1}x$ 와 $x$축으로 둘러싸인 영역의 무게중심의 $x$ 좌표를 구하시오. 밀도는 일정하다.`,
                    R`\frac{\pi}{4(\pi-2)}`,
                    R`넓이는 $A=\int_0^1\sin^{-1}x\,dx=\pi/2-1$ 이다. $y$축에 대한 모멘트는 부분적분으로 $\int_0^1x\sin^{-1}x\,dx=\pi/8$ 이다. 따라서 $\bar x=(\pi/8)/(\pi/2-1)=\pi/[4(\pi-2)]$ 이다.`),
                q('inv_geo_centroid_y', 5, '역사인 아래 영역의 세로 무게중심',
                    R`$0\le x\le1$ 에서 $y=\sin^{-1}x$ 와 $x$축으로 둘러싸인 영역의 무게중심의 $y$ 좌표를 구하시오. 밀도는 일정하다.`,
                    R`\frac{\pi^2-8}{4(\pi-2)}`,
                    R`$x$축에 대한 모멘트는 $\frac12\int_0^1(\sin^{-1}x)^2dx=\frac12(\pi^2/4-2)$ 이다. 이를 넓이 $\pi/2-1$ 로 나누면 $(\pi^2-8)/[4(\pi-2)]$ 이다.`),
                q('inv_geo_atan_area', 5, '특별각에서 닫히는 넓이',
                    R`곡선 $y=\tan^{-1}x$, $x$축 및 직선 $x=\sqrt3$ 으로 둘러싸인 영역의 넓이를 구하시오.`,
                    R`\frac{\pi\sqrt{3}}{3}-\ln(2)`,
                    R`$\int\tan^{-1}x\,dx=x\tan^{-1}x-\frac12\ln(1+x^2)$ 이다. $x=\sqrt3$ 에서 $\tan^{-1}x=\pi/3$ 이고 $1+x^2=4$ 이므로 넓이는 $\pi\sqrt3/3-\ln2$ 이다.`),
                q('inv_geo_acos_shell_volume', 5, '원통껍질로 보는 역코사인',
                    R`$0\le x\le1$ 에서 곡선 $y=\cos^{-1}x$ 아래 영역을 $y$축 둘레로 회전시킨 회전체의 부피를 구하시오.`,
                    R`\frac{\pi^2}{4}`,
                    R`원통껍질법으로 $V=2\pi\int_0^1x\cos^{-1}x\,dx$ 이다. 부분적분하면 내부 적분은 $\frac12\int_0^1x^2/\sqrt{1-x^2}\,dx=\pi/8$ 이므로 $V=\pi^2/4$ 이다.`)
            ]
        },
        {
            id: 'adv_col1a_v2_10', name: '역삼각함수 심화 10 · 수열과 정밀 극한',
            description: '역삼각함수의 국소 전개와 리만합을 함께 다루기',
            problems: [
                q('inv_limit_atan_cubic', 5, '선형 근사를 넘는 세제곱 오차',
                    R`극한 $\lim_{n\to\infty}n^3\left(\frac1n-\tan^{-1}\frac1n\right)$ 을 구하시오.`,
                    R`\frac13`,
                    R`$\tan^{-1}u=u-u^3/3+O(u^5)$ 에 $u=1/n$ 을 대입한다. 괄호는 $1/(3n^3)+O(n^{-5})$ 이므로 극한은 $1/3$ 이다.`),
                q('inv_limit_acos_endpoint', 5, '끝점에서 나타나는 제곱근 척도',
                    R`극한 $\lim_{n\to\infty}n\cos^{-1}\left(1-\frac1{n^2}\right)$ 을 구하시오.`,
                    R`\sqrt{2}`,
                    R`$u\to0^+$ 에서 $\cos^{-1}(1-u)\sim\sqrt{2u}$ 이다. $u=1/n^2$ 를 대입하면 전체 식은 $n\cdot\sqrt2/n$ 으로 수렴한다.`),
                q('inv_limit_riemann_atan', 5, '역탄젠트의 리만합',
                    R`극한 $\lim_{n\to\infty}\frac1n\sum_{k=1}^n\tan^{-1}\left(\frac{k}{n}\right)$ 을 구하시오.`,
                    R`\frac{\pi}{4}-\frac{1}{2}\ln(2)`,
                    R`이는 $\int_0^1\tan^{-1}x\,dx$ 의 오른쪽 리만합이다. 원시함수를 대입하면 $\pi/4-\frac12\ln2$ 이다.`),
                q('inv_limit_atan_infinity', 5, '무한대에서의 각도 결손',
                    R`극한 $\lim_{n\to\infty}n\left(\frac\pi2-\tan^{-1}n\right)$ 을 구하시오.`,
                    R`1`,
                    R`$n>0$ 에서 $\pi/2-\tan^{-1}n=\tan^{-1}(1/n)$ 이다. 따라서 식은 $\tan^{-1}u/u$ 꼴이며 $u\to0^+$ 에서 1로 수렴한다.`),
                q('inv_limit_asin_atan_fifth', 5, '같은 일차항과 삼차항을 제거한 극한',
                    R`극한 $\lim_{x\to0}\frac{\sin^{-1}x-\tan^{-1}x-\frac{x^3}{2}}{x^5}$ 를 구하시오.`,
                    R`-\frac18`,
                    R`$\sin^{-1}x=x+x^3/6+3x^5/40+O(x^7)$, $\tan^{-1}x=x-x^3/3+x^5/5+O(x^7)$ 이다. 차에서 $x^3/2$ 를 제거하면 $x^5$ 의 계수는 $3/40-1/5=-1/8$ 이다.`)
            ]
        },
        {
            id: 'adv_col1b_v2_6', name: '쌍곡함수 심화 6 · 역함수의 가지',
            description: '절댓값과 로그 표현이 생기는 이유를 정의역에서 추적하기',
            problems: [
                q('hyp_branch_acosh_cosh', 5, '역함수 합성에 남는 절댓값',
                    R`정적분 $\int_{-2}^{2}\cosh^{-1}(\cosh x)dx$ 의 값을 구하시오. $\cosh^{-1}$ 의 값은 $[0,\infty)$ 에서 택한다.`,
                    R`4`,
                    R`$\cosh$ 는 짝함수이고 $[0,\infty)$ 에서 일대일이므로 $\cosh^{-1}(\cosh x)=|x|$ 이다. 따라서 적분은 $2\int_0^2x\,dx=4$ 이다.`),
                q('hyp_branch_atanh_double', 5, '쌍곡탄젠트 배각과 끝점 극한',
                    R`이상적분 $\int_0^1\tanh^{-1}\left(\frac{2x}{1+x^2}\right)dx$ 의 값을 구하시오.`,
                    R`2\ln(2)`,
                    R`$0\le x<1$ 에서 $\frac{2x}{1+x^2}=\tanh(2\tanh^{-1}x)$ 이므로 피적분함수는 $2\tanh^{-1}x$ 이다. $\int\tanh^{-1}x\,dx=x\tanh^{-1}x+\frac12\ln(1-x^2)$ 의 끝점 극한은 $\ln2$ 이므로 답은 $2\ln2$ 이다.`),
                q('hyp_branch_acosh_logabs', 5, '상반수 대칭과 로그의 절댓값',
                    R`정적분 $\int_{e^{-1}}^e\cosh^{-1}\left(\frac{x+x^{-1}}2\right)dx$ 의 값을 구하시오.`,
                    R`2-\frac{2}{e}`,
                    R`$x>0$ 에서 $(x+x^{-1})/2=\cosh(\ln x)$ 이므로 역함수의 주값은 $|\ln x|$ 이다. 1에서 나누어 적분하면 $\int_{1/e}^1-\ln x\,dx+\int_1^e\ln x\,dx=2-2/e$ 이다.`),
                q('hyp_branch_three_logs', 5, '서로 다른 역쌍곡함수의 같은 값',
                    R`$\sinh^{-1}(3/4)+\cosh^{-1}(5/4)+\tanh^{-1}(3/5)$ 의 값을 구하시오.`,
                    R`3\ln(2)`,
                    R`로그 정의를 쓰면 세 항이 각각 $\ln(3/4+5/4)$, $\ln(5/4+3/4)$, $\frac12\ln((1+3/5)/(1-3/5))$ 이다. 모두 $\ln2$ 이므로 합은 $3\ln2$ 이다.`),
                q('hyp_branch_acosh_quadratic', 5, '이차식 안에 숨은 역쌍곡사인',
                    R`정적분 $\int_0^1\cosh^{-1}(1+2x^2)dx$ 의 값을 구하시오.`,
                    R`2\ln(1+\sqrt{2})-2\sqrt{2}+2`,
                    R`$\cosh(2\sinh^{-1}x)=1+2x^2$ 이고 $x\ge0$ 이므로 피적분함수는 $2\sinh^{-1}x$ 이다. $\int\sinh^{-1}x\,dx=x\sinh^{-1}x-\sqrt{1+x^2}$ 를 사용하면 답을 얻는다.`)
            ]
        },
        {
            id: 'adv_col1b_v2_7', name: '쌍곡함수 심화 7 · 합성과 최적화',
            description: '역쌍곡함수 합성을 대수식으로 바꾸어 분석하기',
            problems: [
                q('hyp_comp_tanh_asinh', 5, '직각삼각형 형태로 환원되는 합성',
                    R`정적분 $\int_0^1\tanh(\sinh^{-1}x)dx$ 의 값을 구하시오.`,
                    R`\sqrt{2}-1`,
                    R`$u=\sinh^{-1}x$ 이면 $\sinh u=x$, $\cosh u=\sqrt{1+x^2}$ 이므로 합성함수는 $x/\sqrt{1+x^2}$ 이다. 적분하면 $\sqrt{1+x^2}$ 의 경계값 차이인 $\sqrt2-1$ 이다.`),
                q('hyp_comp_sech_acosh', 5, '역쌍곡코사인과 역수',
                    R`정적분 $\int_1^2\operatorname{sech}(\cosh^{-1}x)dx$ 의 값을 구하시오.`,
                    R`\ln(2)`,
                    R`$u=\cosh^{-1}x$ 이면 $\cosh u=x$ 이므로 $\operatorname{sech}u=1/x$ 이다. 따라서 적분은 $\int_1^2dx/x=\ln2$ 이다.`),
                q('hyp_comp_cusp_derivatives', 5, '합성함수의 첨점',
                    R`$f(x)=\cosh^{-1}(\cosh x)$ 라 하자. $f'_-(0)f'_+(0)$ 을 구하시오.`,
                    R`-1`,
                    R`주값 범위 때문에 $f(x)=|x|$ 이다. 따라서 왼쪽 미분계수는 $-1$, 오른쪽 미분계수는 $1$ 이고 곱은 $-1$ 이다.`),
                q('hyp_comp_tanh_sech_max', 5, '항등식으로 푸는 곱의 최댓값',
                    R`$x\ge0$ 에서 $\tanh x\operatorname{sech}x$ 의 최댓값을 구하시오.`,
                    R`\frac12`,
                    R`$u=\tanh x\in[0,1)$ 로 놓으면 $\operatorname{sech}x=\sqrt{1-u^2}$ 이다. $u\sqrt{1-u^2}$ 의 제곱 $u^2(1-u^2)$ 은 $u^2=1/2$ 에서 최대이므로 원래 최댓값은 $1/2$ 이다.`),
                q('hyp_comp_double_angle', 5, '배각식에서 복원하는 쌍곡탄젠트',
                    R`$x>0$ 이고 $\cosh2x=3$ 일 때 $\tanh x$ 의 값을 구하시오.`,
                    R`\frac{1}{\sqrt{2}}`,
                    R`$\tanh^2x=(\cosh2x-1)/(\cosh2x+1)=2/4=1/2$ 이다. $x>0$ 이므로 양의 제곱근을 택해 $1/\sqrt2$ 이다.`)
            ]
        },
        {
            id: 'adv_col1b_v2_8', name: '쌍곡함수 심화 8 · 이상적분',
            description: '지수급수, 베타적분과 경계항을 이용한 정확한 평가',
            problems: [
                q('hyp_improper_x_sech2', 5, '발산하는 경계항의 상쇄',
                    R`이상적분 $\int_0^{\infty}x\operatorname{sech}^2x\,dx$ 의 값을 구하시오.`,
                    R`\ln(2)`,
                    R`상한을 $R$ 로 두고 부분적분하면 $R\tanh R-\ln(\cosh R)$ 이다. 두 항은 각각 발산하지만 $\ln(\cosh R)=R-\ln2+o(1)$ 이고 $R\tanh R=R+o(1)$ 이므로 차는 $\ln2$ 로 수렴한다.`),
                q('hyp_improper_x_over_sinh', 5, '홀수 지수항만 남는 급수',
                    R`이상적분 $\int_0^{\infty}\frac{x}{\sinh x}dx$ 의 값을 구하시오.`,
                    R`\frac{\pi^2}{4}`,
                    R`$1/\sinh x=2\sum_{n\ge0}e^{-(2n+1)x}$ 이다. 항별 적분하면 $2\sum_{n\ge0}(2n+1)^{-2}$ 이고, 홀수 제곱 역수의 합은 $\pi^2/8$ 이므로 결과는 $\pi^2/4$ 이다.`),
                q('hyp_improper_x2_sech2', 5, '교대 지수급수와 이차 모멘트',
                    R`이상적분 $\int_0^{\infty}x^2\operatorname{sech}^2x\,dx$ 의 값을 구하시오.`,
                    R`\frac{\pi^2}{12}`,
                    R`$\operatorname{sech}^2x=4\sum_{n\ge1}(-1)^{n-1}ne^{-2nx}$ 이다. $\int_0^\infty x^2e^{-2nx}dx=1/(4n^3)$ 이므로 합은 $\sum_{n\ge1}(-1)^{n-1}/n^2=\pi^2/12$ 이다.`),
                q('hyp_improper_sech3', 5, '베타적분으로 닫히는 홀수 거듭제곱',
                    R`이상적분 $\int_0^{\infty}\operatorname{sech}^3x\,dx$ 의 값을 구하시오.`,
                    R`\frac{\pi}{4}`,
                    R`$u=\tanh x$ 로 두면 적분은 $\int_0^1\sqrt{1-u^2}\,du$ 가 된다. 이는 단위원의 제1사분면 넓이이므로 $\pi/4$ 이다.`),
                q('hyp_improper_tanh_defect', 5, '극한값과의 차이를 제곱한 적분',
                    R`이상적분 $\int_0^{\infty}(1-\tanh x)^2dx$ 의 값을 구하시오.`,
                    R`2\ln(2)-1`,
                    R`$u=\tanh x$ 로 두면 적분은 $\int_0^1(1-u)/(1+u)du$ 이다. $(1-u)/(1+u)=-1+2/(1+u)$ 이므로 값은 $-1+2\ln2$ 이다.`)
            ]
        },
        {
            id: 'adv_col1b_v2_9', name: '쌍곡함수 심화 9 · 미분방정식',
            description: '초기값·경계값 문제와 기본해 행렬을 쌍곡함수로 해석하기',
            problems: [
                q('hyp_ode_global_min', 5, '지수해의 균형점과 전역최솟값',
                    R`$y''-y=0$, $y(0)=2$, $y'(0)=-1$ 을 만족하는 해의 전 실수 범위에서의 최솟값을 구하시오.`,
                    R`\sqrt{3}`,
                    R`$y=2\cosh x-\sinh x=(e^x+3e^{-x})/2$ 이다. 산술기하평균 또는 미분으로 $e^{2x}=3$ 일 때 최소이고 그 값은 $\sqrt3$ 이다.`),
                q('hyp_ode_dirichlet_slope', 5, '양 끝값이 정하는 초기 기울기',
                    R`$y''-y=0$, $y(0)=0$, $y(1)=1$ 을 만족하는 해에 대하여 $y'(0)$ 을 구하시오.`,
                    R`\frac{1}{\sinh(1)}`,
                    R`$y(0)=0$ 이므로 $y=C\sinh x$ 이다. $y(1)=1$ 에서 $C=1/\sinh1$ 이고 $y'(0)=C\cosh0=1/\sinh1$ 이다.`),
                q('hyp_ode_forced_max', 5, '대칭 경계값 문제의 중심값',
                    R`$y''-y=-1$, $y(0)=y(2)=0$ 을 만족하는 해의 $[0,2]$ 에서의 최댓값을 구하시오.`,
                    R`1-\text{sech}(1)`,
                    R`경계조건이 $x=1$ 에 대해 대칭이므로 $y=1-\cosh(x-1)/\cosh1$ 이다. $\cosh(x-1)$ 이 중심에서 최소이므로 최댓값은 $y(1)=1-1/\cosh1=1-\operatorname{sech}1$ 이다.`),
                q('hyp_ode_logistic_integral', 5, '비선형 초기값 문제와 누적량',
                    R`$y'=1-y^2$, $y(0)=0$ 을 만족하는 해에 대하여 $\int_0^{\ln3}y(x)dx$ 를 구하시오.`,
                    R`\ln\left(\frac{5}{3}\right)`,
                    R`초기값을 만족하는 해는 $y=\tanh x$ 이다. 따라서 적분은 $\ln(\cosh x)|_0^{\ln3}$ 이고 $\cosh(\ln3)=(3+1/3)/2=5/3$ 이므로 $\ln(5/3)$ 이다.`),
                q('hyp_ode_fundamental_determinant', 5, '서로 다른 시각의 기본해 행렬',
                    R`행렬 $M=\begin{pmatrix}\cosh(\ln2)&\sinh(\ln2)\\\sinh(\ln3)&\cosh(\ln3)\end{pmatrix}$ 의 행렬식을 구하시오.`,
                    R`\frac{13}{12}`,
                    R`덧셈정리에 의해 행렬식은 $\cosh(\ln2-\ln3)=\cosh(\ln(2/3))$ 이다. $\cosh(\ln a)=(a+a^{-1})/2$ 를 쓰면 $(2/3+3/2)/2=13/12$ 이다.`)
            ]
        },
        {
            id: 'adv_col1b_v2_10', name: '쌍곡함수 심화 10 · 쌍곡선 기하',
            description: '매개화, 부채꼴과 접선에 담긴 기하량',
            problems: [
                q('hyp_geo_distance_hyperbola', 5, '쌍곡선 위 두 점의 유클리드 거리',
                    R`단위쌍곡선 $x^2-y^2=1$ 위의 두 점 $P=(\cosh(\ln2),\sinh(\ln2))$, $Q=(\cosh(\ln3),\sinh(\ln3))$ 에 대하여 $PQ^2$ 을 구하시오.`,
                    R`\frac{37}{72}`,
                    R`$P=(5/4,3/4)$, $Q=(5/3,4/3)$ 이다. 따라서 좌표 차는 $(5/12,7/12)$ 이고 유클리드 거리의 제곱은 $(5/12)^2+(7/12)^2=74/144=37/72$ 이다. 매개값의 차만 쓰는 식은 민코프스키 계량과 혼동하므로 사용할 수 없다.`),
                q('hyp_geo_sector_area', 5, '쌍곡선 부채꼴과 매개변수',
                    R`단위쌍곡선 $x^2-y^2=1$ 에서 매개값 $t=\ln2$ 와 $t=\ln3$ 에 해당하는 두 반지름벡터와 그 사이의 쌍곡선 호가 이루는 영역의 넓이를 구하시오.`,
                    R`\frac{1}{2}\ln\left(\frac{3}{2}\right)`,
                    R`$x=\cosh t$, $y=\sinh t$ 에 대해 부채꼴의 유향넓이는 $\frac12\int(xy'-yx')dt=\frac12\int1dt$ 이다. 따라서 넓이는 두 매개값 차이의 절반인 $\frac12\ln(3/2)$ 이다.`),
                q('hyp_geo_rapidity_addition', 5, '속도 합성에 숨은 덧셈정리',
                    R`$\tanh u=3/5$, $\tanh v=5/13$ 이고 $u,v>0$ 일 때 $\tanh(u+v)$ 를 구하시오.`,
                    R`\frac45`,
                    R`쌍곡탄젠트 덧셈정리로 값은 $\frac{3/5+5/13}{1+(3/5)(5/13)}$ 이다. 분자와 분모를 정리하면 $(64/65)/(80/65)=4/5$ 이다.`),
                q('hyp_geo_tangent_intercepts', 5, '단위쌍곡선 접선의 절편삼각형',
                    R`단위쌍곡선 $x^2-y^2=1$ 위의 점 $P=(\cosh(\ln2),\sinh(\ln2))$ 에서 그은 접선과 두 좌표축이 만드는 삼각형의 넓이를 구하시오.`,
                    R`\frac8{15}`,
                    R`매개값이 $t$ 인 점에서 접선은 $x\cosh t-y\sinh t=1$ 이다. 두 절편의 절댓값은 각각 $\operatorname{sech}t$, $\operatorname{csch}t$ 이다. $t=\ln2$ 에서 $\cosh t=5/4$, $\sinh t=3/4$ 이므로 넓이는 $\frac12(4/5)(4/3)=8/15$ 이다.`)
            ]
        }
    ];
    window.generatedCollections.push(...collections);
})();
