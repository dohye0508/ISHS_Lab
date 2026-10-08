// 참고자료/대수/10.내적,정사영,정규직교기저.pdf (32쪽).
// 표준내적과 자료의 연속함수 내적만 사용. 최소제곱·QR·가중내적은 다루지 않는다.
(function () {
    'use strict';
    const t = String.raw;
    const q = (key, level, title, latex, solution, explanation, pages) => ({
        id: `alg_orth_v1_${key}`, template: `alg_orth_v1_${key}`, level, title,
        latex, solution, explanation, references: [10], referencePages: pages, answerMode: 'exact'
    });
    const set = (n, title, problems) => ({id: `alg_orth_col_v1_${n}`, name: `대수 심화 ${n+6} · ${title}`, problems});
    window.algebraCollections.push(
        set(1, '내적의 조건과 길이 추론', [
            q('norm',3,'길이 정보 세 개로 다른 길이 구하기',
                t`\text{실수 내적공간의 벡터 }u,v\text{가 }\|u\|=3,\ \|u+v\|=5,\ \|u-v\|=3\text{을 만족한다. }\|2u-v\|^2\text{을 구하시오.}`,
                '28',t`\text{두 제곱을 더하면 }2\|u\|^2+2\|v\|^2=34\text{이므로 }\|v\|^2=8\text{이다. 빼면 }4\langle u,v\rangle=16\text{이므로 내적은 4이다. 따라서 }\|2u-v\|^2=4\cdot9+8-4\cdot4=28\text{이다.}`, [3,6]),
            q('reconstruct',4,'비직교 생성자와 내적 조건',
                t`\text{표준내적에서 }u=(1,0,1)^T,\ v=(1,1,0)^T\text{이다. }x\in\operatorname{span}(u,v),\ x\cdot u=3,\ x\cdot v=0\text{을 만족하는 }x\text{를 열벡터로 구하시오.}`,
                t`\begin{pmatrix}1\\-1\\2\end{pmatrix}`,t`\text{두 벡터는 직교하지 않으므로 내적값을 그대로 계수로 쓸 수 없다. }x=au+bv\text{라 두면 }2a+b=3,\ a+2b=0\text{이다. }a=2,b=-1\text{이므로 }x=2u-v=(1,-1,2)^T\text{이다.}`, [6,24]),
            q('function',4,'함수 내적에서 수직과 길이',
                t`\text{연속함수의 내적을 }\langle f,g\rangle=\int_{-1}^{1}f(t)g(t)\,dt\text{로 둔다. }f(t)=t^2-a\text{가 상수함수 1과 직교할 때 }(a,\|f\|^2)^T\text{를 구하시오.}`,
                t`\begin{pmatrix}\frac{1}{3}\\\frac{8}{45}\end{pmatrix}`,t`\text{직교 조건은 }\int_{-1}^{1}(t^2-a)\,dt=2/3-2a=0\text{이므로 }a=1/3\text{이다. 노름의 제곱은 함수값의 제곱을 적분해야 한다. }\int_{-1}^{1}(t^2-1/3)^2\,dt=2/5-4/9+2/9=8/45\text{이다.}`, [7,14]),
            q('constrained_dot',4,'수직 성분에 남는 길이',
                t`\text{표준내적의 }\mathbb R^3\text{에서 }\|x\|=2,\ x\cdot(1,1,1)^T=2\text{이다. }x\cdot(1,-1,0)^T\text{의 최댓값을 구하시오.}`,
                t`\frac{4}{\sqrt{3}}`,t`\text{서로 수직인 }n=(1,1,1)^T,\ d=(1,-1,0)^T\text{를 사용한다. }x=(2/3)n+r,\ r\perp n\text{으로 분해하면 }\|r\|^2=4-4/3=8/3\text{이다. 코시–슈바르츠로 }x\cdot d=r\cdot d\le\sqrt{8/3}\sqrt{2}=4/\sqrt{3}\text{이다. }r=(2/\sqrt{3})d\text{일 때 모든 조건과 등호가 성립한다.}`, [10,19,27]),
            q('three_units',5,'세 단위벡터의 일차관계로 각 추론',
                t`\text{표준내적의 }\mathbb R^3\text{에서 단위벡터 }u,v,w\text{가 }u+2v+2w=0\text{을 만족한다. }(u\cdot v,\ v\cdot w,\ w\cdot u)^T\text{를 구하시오.}`,
                t`\begin{pmatrix}-\frac{1}{4}\\-\frac{7}{8}\\-\frac{1}{4}\end{pmatrix}`,t`\text{각 내적을 }a,b,c\text{라 하자. 주어진 관계에 }u,v,w\text{를 차례로 내적하면 }1+2a+2c=0,\ a+2+2b=0,\ c+2b+2=0\text{이다. 뒤 두 식에서 }a=c\text{이고 첫째 식에서 }a=c=-1/4\text{이다. 이어 }b=-7/8\text{이다. 실현 가능성도 확인할 수 있다. }v=(1,0,0)^T,\ w=(-7/8,\sqrt{15}/8,0)^T,\ u=-2(v+w)\text{로 두면 세 벡터 모두 길이가 1이다.}`, [6,10,16])
        ]),
        set(2, '각·수직·평행의 조건 결합', [
            q('angle4',3,'4차원에서 각을 결정하는 내적',
                t`\text{표준내적에서 }u=(1,0,-1,0)^T,\ v=(2,1,0,-1)^T\text{가 이루는 각을 }\theta\ (0\le\theta\le\pi)\text{라 하자. }\cos\theta\text{를 구하시오.}`,
                t`\frac{1}{\sqrt{3}}`,t`\text{내적은 2이고 길이의 제곱은 각각 2,6이다. 따라서 }\cos\theta=2/(\sqrt{2}\sqrt{6})=1/\sqrt{3}\text{이다. 차원이 4여도 각은 같은 내적 공식으로 정의된다.}`, [11,12]),
            q('angle_parameter',4,'각의 조건을 제곱하기 전 부호 확인',
                t`\text{표준내적에서 }u=(1,t,1)^T,\ v=(t,1,-1)^T\text{가 이루는 각이 }\pi/3\text{이 되게 하는 실수 }t\text{를 구하시오.}`,
                '2',t`\text{두 길이의 제곱은 모두 }t^2+2\text{이고 내적은 }2t-1\text{이다. 따라서 }(2t-1)/(t^2+2)=1/2\text{에서 }(t-2)^2=0\text{이다. }t=2\text{이면 내적은 3으로 양수이며 실제 코사인값도 }3/6=1/2\text{이다. 음의 코사인에 해당하는 해를 제곱 과정에서 섞지 않는다.}`, [11,13]),
            q('sum_difference_angle',4,'합과 차 사이의 각',
                t`\text{실수 내적공간에서 }\|u\|=2,\ \|v\|=1\text{이고 두 벡터의 각은 }\pi/3\text{이다. }u+v\text{와 }u-v\text{사이의 각 }\phi\text{에 대하여 }\cos\phi\text{를 구하시오.}`,
                t`\frac{3}{\sqrt{21}}`,t`\text{먼저 }\langle u,v\rangle=2\cdot1\cdot(1/2)=1\text{이다. }\|u+v\|^2=7,\ \|u-v\|^2=3\text{이고 }\langle u+v,u-v\rangle=\|u\|^2-\|v\|^2=3\text{이다. 두 벡터 모두 영벡터가 아니므로 }\cos\phi=3/\sqrt{21}\text{이다.}`, [6,11,15]),
            q('two_orthogonality',4,'두 수직 조건에서 길이비와 각 복원',
                t`\text{영벡터가 아닌 }u,v\text{가 }u+v\perp2u-v,\ 2u+v\perp u-2v\text{를 만족한다. 두 벡터의 각을 }\theta\text{라 할 때 }(\|v\|^2/\|u\|^2,\cos\theta)^T\text{를 구하시오.}`,
                t`\begin{pmatrix}\frac{8}{5}\\-\frac{1}{\sqrt{10}}\end{pmatrix}`,t`\text{ }A=\|u\|^2>0,B=\|v\|^2,C=\langle u,v\rangle\text{라 두면 }2A-B+C=0,\ 2A-2B-3C=0\text{이다. 이를 풀면 }B=8A/5,C=-2A/5\text{이다. 따라서 }B/A=8/5,\ C/\sqrt{AB}=-1/\sqrt{10}\text{이다. 내적의 부호가 음수이므로 각은 둔각이다.}`, [6,13,14]),
            q('plane_angle',5,'부분공간 안에서 가장 작은 각',
                t`\text{표준내적에서 }W=\operatorname{span}\{(1,1,0)^T,(1,0,1)^T\}\text{이다. }W\text{의 영벡터가 아닌 벡터와 }e_3=(0,0,1)^T\text{사이의 각 중 최솟값을 }\theta_0\text{라 할 때 }\cos\theta_0\text{를 구하시오.}`,
                t`\sqrt{\frac{2}{3}}`,t`\text{ }n=(1,-1,-1)^T\text{는 }W\text{에 수직이다. }p=e_3-((e_3\cdot n)/3)n=(1,-1,2)^T/3\text{는 }W\text{에 속하고 }e_3-p\perp W\text{이므로 정사영이다. }\|p\|=\sqrt{2/3}\text{이다. }x\in W\text{이면 }x\cdot e_3=x\cdot p\le\|x\|\|p\|\text{이다. }x=p\text{에서 등호가 성립하며 코사인이 최대일 때 각이 최소이다.}`, [10,11,27])
        ]),
        set(3, '직선 정사영과 역추론', [
            q('line_residual',3,'평행 성분과 수직 성분 구별',
                t`\text{표준내적에서 }u=(2,1,1)^T,\ v=(1,-1,2)^T\text{이다. }v=p+r,\ p\in\operatorname{span}(u),\ r\perp u\text{일 때 }r\text{을 열벡터로 구하시오.}`,
                t`\begin{pmatrix}0\\-\frac{3}{2}\\\frac{3}{2}\end{pmatrix}`,t`\text{평행 성분은 }p=((v\cdot u)/(u\cdot u))u=(3/6)u=(1,1/2,1/2)^T\text{이다. 따라서 }r=v-p=(0,-3/2,3/2)^T\text{이다. 실제로 }r\cdot u=0\text{이다. 답으로 }p\text{를 입력하지 않도록 분해의 두 성분을 구별한다.}`, [19,20]),
            q('affine_line',4,'원점을 지나지 않는 직선까지의 거리',
                t`\text{표준내적에서 점 }A=(1,2,-1)^T\text{와 직선 }L=\{(0,1,1)^T+t(1,-1,2)^T:t\in\mathbb R\}\text{사이 거리의 제곱을 구하시오.}`,
                t`\frac{10}{3}`,t`\text{직선 위 기준점 }B=(0,1,1)^T\text{에서 }A\text{로 향하는 벡터는 }a=(1,1,-2)^T\text{이다. 방향벡터 }d=(1,-1,2)^T\text{에 대해 }a\cdot d=-4,\|d\|^2=6\text{이다. 수선의 발은 }B-(2/3)d\text{이고 거리의 제곱은 }\|a\|^2-(a\cdot d)^2/\|d\|^2=6-16/6=10/3\text{이다.}`, [19,21]),
            q('inverse_projection',4,'두 정사영과 수직 조건으로 원래 벡터 찾기',
                t`\text{표준내적에서 }u=(1,1,0)^T,v=(1,0,1)^T\text{이다. }\operatorname{proj}_u x=2u,\operatorname{proj}_v x=-v,\ x\perp(1,-1,1)^T\text{일 때 }x\text{를 열벡터로 구하시오.}`,
                t`\begin{pmatrix}6\\-2\\-8\end{pmatrix}`,t`\text{정사영의 계수에 분모를 복원하면 }x\cdot u=4,\ x\cdot v=-2\text{이다. }x=(a,b,c)^T\text{라 두면 }a+b=4,a+c=-2,a-b+c=0\text{이다. 뒤 식에 앞의 두 식을 대입하면 }a=6,b=-2,c=-8\text{이다. 두 주어진 정사영을 단순히 더해 }x\text{라 하는 것은 잘못이다.}`, [19,24]),
            q('false_sum',4,'비직교 방향의 정사영을 더했을 때의 오차',
                t`\text{표준내적에서 }u=(1,0,0)^T,v=(1,1,0)^T,W=\operatorname{span}(u,v),x=(a,1,2)^T\text{이다. }E(a)=\|\operatorname{proj}_u x+\operatorname{proj}_v x-\operatorname{proj}_W x\|^2\text{의 최솟값을 구하시오.}`,
                t`\frac{1}{2}`,t`\text{ }W\text{는 }xy\text{평면이므로 }\operatorname{proj}_W x=(a,1,0)^T\text{이다. 두 직선 정사영의 합에서 이를 빼면 }((a+1)/2,(a-1)/2,0)^T\text{이다. 따라서 }E(a)=((a+1)^2+(a-1)^2)/4=(a^2+1)/2\text{이며 최솟값은 }1/2\text{이다. 어떤 }a\text{에서도 오차가 0이 되지 않는다.}`, [24,27]),
            q('moving_line',5,'방향이 변하는 직선에 가장 가깝게',
                t`\text{표준내적에서 }x=(0,1,0)^T,\ u(t)=(1,t,t^2)^T\text{이다. }D(t)=\|x-\operatorname{proj}_{u(t)}x\|^2\text{가 최소가 되는 실수들을 작은 순서대로 }t_1,t_2\text{라 하자. }(t_1,t_2,\min D)^T\text{를 구하시오.}`,
                t`\begin{pmatrix}-1\\1\\\frac{2}{3}\end{pmatrix}`,t`\text{ }D(t)=1-t^2/(1+t^2+t^4)\text{이다. }1+t^2+t^4-3t^2=(t^2-1)^2\ge0\text{에서 분수는 }1/3\text{이하이고 등호는 }t^2=1\text{에서만 성립한다. 따라서 }t_1=-1,t_2=1,\min D=2/3\text{이다. }u(t)\text{의 첫 성분이 1이어서 모든 실수에서 정사영이 정의된다.}`, [10,19,21])
        ]),
        set(4, '부분공간 정사영의 조건과 변화', [
            q('plane_projection',3,'비직교 생성자로 주어진 평면',
                t`\text{표준내적에서 }W=\operatorname{span}\{(1,1,0)^T,(1,0,1)^T\}\text{이다. }x=(1,2,3)^T\text{의 }W\text{위 정사영을 열벡터로 구하시오.}`,
                t`\begin{pmatrix}\frac{7}{3}\\\frac{2}{3}\\\frac{5}{3}\end{pmatrix}`,t`\text{ }p=a(1,1,0)^T+b(1,0,1)^T\text{라 두고 }x-p\text{가 두 생성자에 수직이 되게 한다. }2a+b=3,a+2b=4\text{에서 }a=2/3,b=5/3\text{이다. 따라서 }p=(7/3,2/3,5/3)^T\text{이다. }p\in W\text{와 잔차의 수직성을 모두 확인해야 한다.}`, [27,28,32]),
            q('four_projection',4,'두 방정식으로 주어진 4차원 부분공간',
                t`\text{표준내적에서 }W=\{z\in\mathbb R^4:z_1+z_2+z_4=0,\ z_2+z_3+z_4=0\}\text{이다. }x=(1,2,3,4)^T\text{의 }W\text{위 정사영을 구하시오.}`,
                t`\begin{pmatrix}\frac{2}{5}\\-\frac{6}{5}\\\frac{2}{5}\\\frac{4}{5}\end{pmatrix}`,t`\text{ }n_1=(1,1,0,1)^T,n_2=(0,1,1,1)^T\text{는 }W\text{에 수직이다. }p=x-an_1-bn_2\text{가 }W\text{에 속하게 하려면 }3a+2b=7,2a+3b=9\text{이다. }a=3/5,b=13/5\text{이므로 }p=(2,-6,2,4)^T/5\text{이다. }x-p\text{는 두 법선의 일차결합이어서 }W\text{의 모든 벡터에 수직이다.}`, [14,27]),
            q('projection_inverse_norm',4,'정사영과 길이로 벡터 복원',
                t`\text{표준내적에서 }W=\{(a,b,c)^T:a+b-c=0\}\text{이다. }\operatorname{proj}_W x=(1,2,3)^T,\|x\|^2=26\text{이고 }x\text{의 첫 성분이 양수이다. }x\text{를 구하시오.}`,
                t`\begin{pmatrix}3\\4\\1\end{pmatrix}`,t`\text{잔차는 }W\text{에 수직이므로 }x=(1,2,3)^T+s(1,1,-1)^T\text{이다. 두 성분이 수직이어서 }26=14+3s^2\text{이고 }s=\pm2\text{이다. }s=-2\text{이면 첫 성분이 }-1\text{이므로 제외한다. }s=2\text{에서 }x=(3,4,1)^T\text{이다.}`, [15,27]),
            q('moving_plane',4,'움직이는 평면에서 잔차가 가장 클 때',
                t`\text{표준내적에서 }W_t=\operatorname{span}\{(1,t,0)^T,(0,1,t)^T\},\ x=(1,0,1)^T\text{이다. 실수 }t\text{가 변할 때 }\|x-\operatorname{proj}_{W_t}x\|^2\text{의 최댓값을 구하시오.}`,
                t`\frac{4}{3}`,t`\text{두 생성자는 모든 }t\text{에서 독립이고 }n=(t^2,-t,1)^T\text{는 둘 다에 수직이다. 잔차의 제곱은 }(x\cdot n)^2/\|n\|^2=(t^2+1)^2/(t^4+t^2+1)\text{이다. }y=t^2\ge0\text{라 두면 이 값은 }1+y/(y^2+y+1)\text{이다. }y^2+y+1-3y=(y-1)^2\ge0\text{이므로 최대는 }4/3\text{이고 }t=\pm1\text{에서 달성된다.}`, [19,27,29]),
            q('enlarge_space',5,'방향 하나를 추가했을 때의 거리 감소',
                t`\text{표준내적의 }\mathbb R^4\text{에서 }a=(1,1,0,0)^T,b=(0,1,1,0)^T,c=(0,0,1,1)^T,x=(1,0,0,1)^T\text{이다. }U=\operatorname{span}(a,b),W=\operatorname{span}(a,b,c)\text{일 때 }\|x-\operatorname{proj}_U x\|^2-\|x-\operatorname{proj}_W x\|^2\text{을 구하시오.}`,
                t`\frac{4}{3}`,t`\text{ }\operatorname{proj}_U c=(-1,1,2,0)^T/3\text{이므로 새 수직 방향은 }r=c-\operatorname{proj}_U c=(1,-1,1,3)^T/3\text{이다. }r\perp U,\|r\|^2=4/3,x\cdot r=4/3\text{이다. }W\text{위 정사영은 }U\text{위 정사영에 }r\text{방향 성분을 더한 것이므로 거리 제곱의 감소는 }(x\cdot r)^2/\|r\|^2=4/3\text{이다. 실제로 }x=a-b+c\in W\text{이다.}`, [27,29,30])
        ]),
        set(5, '정규직교기저와 좌표 해석', [
            q('normalized_coordinates',3,'직교기저를 정규화한 뒤의 좌표',
                t`\text{표준내적에서 }b_1=(1,-1,1)^T,b_2=(1,0,-1)^T,b_3=(1,2,1)^T\text{이다. }q_i=b_i/\|b_i\|\text{로 두고 }x=(2,-3,-2)^T\text{의 순서 있는 기저 }(q_1,q_2,q_3)\text{에 대한 좌표를 열벡터로 구하시오.}`,
                t`\begin{pmatrix}\sqrt{3}\\2\sqrt{2}\\-\sqrt{6}\end{pmatrix}`,t`\text{세 }b_i\text{의 쌍별 내적이 0이며 길이는 }\sqrt{3},\sqrt{2},\sqrt{6}\text{이다. 정규직교기저의 계수는 }x\cdot q_i\text{이므로 }3/\sqrt{3},4/\sqrt{2},-6/\sqrt{6}\text{이다. 정규화 전 기저의 계수 }(1,2,-1)^T\text{와 혼동하지 않는다.}`, [23,24,26]),
            q('complete_basis',4,'마지막 정규직교기저 벡터의 부호',
                t`\text{표준내적에서 }q_1=(1,1,1)^T/\sqrt{3},\ q_2=(1,-1,0)^T/\sqrt{2}\text{이다. }(q_1,q_2,q_3)\text{가 }\mathbb R^3\text{의 정규직교기저이고 }q_3\text{의 세 번째 성분이 양수일 때 }q_3\text{를 구하시오.}`,
                t`\begin{pmatrix}-\frac{1}{\sqrt{6}}\\-\frac{1}{\sqrt{6}}\\\frac{2}{\sqrt{6}}\end{pmatrix}`,t`\text{ }q_3=(a,b,c)^T\text{의 수직 조건은 }a+b+c=0,a-b=0\text{이다. 따라서 }q_3=s(1,1,-2)^T\text{이다. 길이가 1이므로 }s=\pm1/\sqrt{6}\text{이고 }c>0\text{이므로 음의 부호를 택한다. 수직 조건만으로는 정규화와 부호가 정해지지 않는다.}`, [14,23,25]),
            q('orthogonal_change',4,'추상 정규직교기저를 바꾸어 좌표 읽기',
                t`\text{실수 내적공간의 정규직교기저 }(e_1,e_2,e_3)\text{에 대하여 }f_1=(e_1+e_2)/\sqrt{2},\ f_2=(e_1-e_2+2e_3)/\sqrt{6},\ f_3=(e_1-e_2-e_3)/\sqrt{3}\text{이다. }x=2e_1-e_2+3e_3\text{의 기저 }(f_1,f_2,f_3)\text{에 대한 좌표를 구하시오.}`,
                t`\begin{pmatrix}\frac{1}{\sqrt{2}}\\\frac{9}{\sqrt{6}}\\0\end{pmatrix}`,t`\text{기존 기저가 정규직교이므로 계수의 곱을 더해 내적을 구할 수 있다. 이를 이용해 }f_i\text{들의 길이가 1이고 쌍별 내적이 0임을 확인한다. 새 좌표는 }(\langle x,f_1\rangle,\langle x,f_2\rangle,\langle x,f_3\rangle)^T\text{이므로 }((2-1)/\sqrt{2},(2+1+6)/\sqrt{6},(2+1-3)/\sqrt{3})^T\text{이다. 좌표 제곱합도 }1/2+81/6=14=\|x\|^2\text{로 일치한다.}`,[24]),
            q('distance_coordinates',4,'좌표 일부가 알려진 벡터의 거리',
                t`\text{실수 3차원 내적공간의 정규직교기저가 }(q_1,q_2,q_3)\text{이다. }\|x\|=5,\langle x,q_1\rangle=3,\langle x,q_2\rangle=2\text{일 때 }W=\operatorname{span}(q_1+q_2,q_3)\text{에 대한 잔차 }x-\operatorname{proj}_W x\text{의 길이의 제곱을 구하시오.}`,
                t`\frac{1}{2}`,t`\text{ }x=3q_1+2q_2+cq_3\text{이고 }c^2=25-9-4=12\text{이지만 부호는 정해지지 않는다. }W\text{에 수직인 단위벡터는 }(q_1-q_2)/\sqrt{2}\text{이다. 잔차의 길이의 제곱은 }((3-2)/\sqrt{2})^2=1/2\text{이므로 알 수 없는 }c\text{의 부호와 무관하다.}`, [24,27]),
            q('nonorthogonal_coordinates',5,'좌표의 제곱합을 길이로 착각하면 안 되는 경우',
                t`\text{정규직교기저 }(e_1,e_2,e_3)\text{에서 }b_1=e_1+e_2,b_2=e_2+e_3,b_3=e_3+e_1\text{로 둔다. }x=ab_1+bb_2+cb_3,\ a+b+c=1,\ a-b=1\text{일 때 }\|x\|^2\text{의 최솟값을 구하시오.}`,
                t`\frac{11}{6}`,t`\text{ }b_1,b_2,b_3\text{는 정규직교기저가 아니므로 }a^2+b^2+c^2\text{를 최소화하면 안 된다. 두 조건에서 }a=1-c/2,b=-c/2\text{이다. 정규직교기저로 다시 쓰면 }x=(1+c/2)e_1+(1-c)e_2+(c/2)e_3\text{이다. 따라서 }\|x\|^2=2-c+3c^2/2=(3/2)(c-1/3)^2+11/6\text{이며 최솟값은 }11/6\text{이다.}`, [24,26])
        ]),
        set(6, '그람–슈미트 과정의 핵심과 예외', [
            q('gs_third',3,'세 번째 단계까지 정규직교화',
                t`\text{표준내적에서 }v_1=(1,1,0)^T,v_2=(1,0,1)^T,v_3=(1,1,1)^T\text{를 이 순서로 그람–슈미트 직교화한다. 각 잔차를 양의 길이로 나눈 정규직교벡터를 }q_1,q_2,q_3\text{라 할 때 }q_3\text{를 구하시오.}`,
                t`\begin{pmatrix}-\frac{1}{\sqrt{3}}\\\frac{1}{\sqrt{3}}\\\frac{1}{\sqrt{3}}\end{pmatrix}`,t`\text{ }u_1=v_1,\ u_2=v_2-(1/2)u_1=(1/2,-1/2,1)^T\text{이다. }v_3\cdot u_1=2,\|u_1\|^2=2,\ v_3\cdot u_2=1,\|u_2\|^2=3/2\text{이므로 }u_3=v_3-u_1-(2/3)u_2=(-1,1,1)^T/3\text{이다. }\|u_3\|=1/\sqrt{3}\text{으로 나누면 답을 얻는다.}`, [29,30,31]),
            q('gs_parameter',4,'직교화가 멈추는 매개변수까지 포함한 식',
                t`\text{표준내적에서 }v_1=(1,1,0)^T,v_2=(1,t,1)^T,v_3=(0,1,1)^T\text{이다. }q_1,q_2\text{는 앞의 두 벡터를 이 순서로 정규직교화한 것이다. }r_3=v_3-(v_3\cdot q_1)q_1-(v_3\cdot q_2)q_2\text{에 대하여 }\|r_3\|^2\text{를 변수 }t\text{의 식으로 구하시오.}`,
                t`\frac{(t-2)^2}{t^2-2t+3}`,t`\text{첫 잔차는 }u_2=((1-t)/2,(t-1)/2,1)^T\text{이고 길이의 제곱은 }(t^2-2t+3)/2>0\text{이다. }v_3\cdot q_1=1/\sqrt{2},\ v_3\cdot u_2=(t+1)/2\text{이므로 }\|r_3\|^2=2-1/2-(t+1)^2/(2(t^2-2t+3))=(t-2)^2/(t^2-2t+3)\text{이다. }t=2\text{에서는 잔차가 0이어서 세 번째 벡터를 정규화할 수 없다.}`, [29,30]),
            q('gs_four',4,'4차원 직교화를 이용한 부분공간 정사영',
                t`\text{표준내적에서 }W=\operatorname{span}\{(1,1,0,0)^T,(1,0,1,0)^T,(1,0,0,1)^T\}\text{이다. }x=(1,2,3,4)^T\text{의 }W\text{위 정사영을 구하시오.}`,
                t`\begin{pmatrix}3\\0\\1\\2\end{pmatrix}`,t`\text{주어진 순서로 직교화하면 방향벡터 }(1,1,0,0)^T,(1,-1,2,0)^T,(1,-1,-1,3)^T\text{를 얻는다. 이들은 서로 수직이며 길이 제곱은 }2,6,12\text{이다. 각 방향에 대한 정사영을 더하면 }(3/2)(1,1,0,0)^T+(5/6)(1,-1,2,0)^T+(2/3)(1,-1,-1,3)^T=(3,0,1,2)^T\text{이다. 잔차 }(-2,2,2,2)^T\text{는 세 생성자에 모두 수직이다.}`, [27,29,32]),
            q('gs_order',4,'입력 순서를 바꾸면 무엇이 달라지는가',
                t`\text{표준내적에서 }a=(1,1,0)^T,b=(1,0,1)^T,c=(1,1,1)^T\text{이다. }(a,b,c)\text{와 }(b,a,c)\text{를 각각 그람–슈미트 정규직교화하여 }(q_1,q_2,q_3),(p_1,p_2,p_3)\text{를 얻는다. 모든 정규화는 양의 길이로 나눈다. }(q_2\cdot p_2,q_3\cdot p_3)^T\text{를 구하시오.}`,
                t`\begin{pmatrix}-\frac{1}{2}\\1\end{pmatrix}`,t`\text{ }q_2=(1,-1,2)^T/\sqrt{6},\ p_2=(1,2,-1)^T/\sqrt{6}\text{이므로 내적은 }(1-2-2)/6=-1/2\text{이다. 세 번째 단계에서는 어느 순서든 같은 평면 }\operatorname{span}(a,b)\text{위로의 정사영을 }c\text{에서 빼므로 잔차가 같다. 따라서 }q_3=p_3=(-1,1,1)^T/\sqrt{3}\text{이고 내적은 1이다.}`, [27,29,30]),
            q('gs_inverse',5,'잔차의 길이와 부호로 입력을 복원',
                t`\text{표준내적에서 }v_1=(1,1,1)^T,v_2=(a,1,0)^T,v_3=(0,1,1)^T\text{이다. }u_2=v_2-\operatorname{proj}_{v_1}v_2\text{가 }\|u_2\|^2=2,\ u_2\cdot v_3>0\text{을 만족한다. 세 벡터를 이 순서로 정규직교화한 세 번째 벡터가 }q_3=(r,s,t)^T\text{일 때 }(a,r,s,t)^T\text{를 구하시오.}`,
                t`\begin{pmatrix}-1\\-\frac{1}{\sqrt{6}}\\-\frac{1}{\sqrt{6}}\\\frac{2}{\sqrt{6}}\end{pmatrix}`,t`\text{ }\|u_2\|^2=a^2+1-(a+1)^2/3=2\text{이므로 }(a-2)(a+1)=0\text{이다. }u_2\cdot v_3=(1-2a)/3>0\text{에서 }a=-1\text{을 택한다. 이때 }u_2=(-1,1,0)^T\text{이다. 세 번째 잔차는 }v_3-(2/3)v_1-(1/2)u_2=(-1,-1,2)^T/6\text{이고 이를 양의 길이로 나누면 }q_3=(-1,-1,2)^T/\sqrt{6}\text{이다.}`, [19,29,30])
        ])
    );
})();
