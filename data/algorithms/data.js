const codeData = [
  {
    "folderName": "그래프_탐색",
    "files": [
      {
        "fileName": "BFS_최단거리.py",
        "content": "'''\n너비 우선 탐색 (BFS) - 최단거리 (일반 그래프)\n방향 벡터가 없는 일반적인 인접 리스트 형태의 그래프에서 시작점부터 목표점까지의 최단 거리를 구하는 알고리즘입니다.\n모든 간선의 길이가 같을 때 최단 거리를 찾는 데 최적화되어 있습니다.\n시간 복잡도: O(V + E)\n\n[입력 예시]\n4 5 1\n1 2\n1 3\n1 4\n2 4\n3 4\n\n[출력 예시]\n1 2 3 4\n'''\nimport sys\nfrom collections import deque\n\nn, m, start = map(int, sys.stdin.readline().split())\ngraph = [[] for _ in range(n + 1)]\n\nfor _ in range(m):\n    a, b = map(int, sys.stdin.readline().split())\n    graph[a].append(b)\n    graph[b].append(a)\n\ndistance = [-1] * (n + 1)\n\ndef bfs(start_node):\n    queue = deque([start_node])\n    distance[start_node] = 0\n    \n    while queue:\n        curr = queue.popleft()\n        \n        for adj in graph[curr]:\n            if distance[adj] == -1:\n                distance[adj] = distance[curr] + 1\n                queue.append(adj)\n\nbfs(start)\n\nfor i in range(1, n + 1):\n    print(distance[i])\n"
      },
      {
        "fileName": "DFS_연결요소.py",
        "content": "'''\n깊이 우선 탐색 (DFS) - 연결요소\n스택 또는 재귀함수를 이용하여 그래프의 깊은 부분을 먼저 탐색하는 알고리즘입니다.\n그래프 전체를 깊게 탐색할 때 사용하는 경로 찾기/연결 요소 세기 알고리즘.\n시간 복잡도: O(V + E)\n\n[입력 예시]\n4 5 1\n1 2\n1 3\n1 4\n2 4\n3 4\n\n[출력 예시]\n1 2 4 3\n'''\nimport sys\nsys.setrecursionlimit(10**5)\n\ndef dfs(x, y, n, m, graph):\n    if x <= -1 or x >= n or y <= -1 or y >= m:\n        return False\n    if graph[x][y] == 0:\n        graph[x][y] = 1\n        dfs(x - 1, y, n, m, graph)\n        dfs(x, y - 1, n, m, graph)\n        dfs(x + 1, y, n, m, graph)\n        dfs(x, y + 1, n, m, graph)\n        return True\n    return False\n\nn, m = map(int, sys.stdin.readline().split())\ngraph = []\n\nfor _ in range(n):\n    graph.append(list(map(int, list(sys.stdin.readline().rstrip()))))\n    \nresult = 0\nfor i in range(n):\n    for j in range(m):\n        if dfs(i, j, n, m, graph):\n            result += 1\n\nprint(result)\n"
      },
      {
        "fileName": "LCA.py",
        "content": "'''\n최소 공통 조상 (LCA, Lowest Common Ancestor)\n트리 구조에서 임의의 두 노드가 주어졌을 때, 두 노드의 공통된 조상 중에서 가장 가까운(깊이가 가장 깊은) 조상을 구하는 알고리즘.\n촌수 계산, 트리 내에서 두 노드 간의 거리 계산 등에 사용.\n\n[입력 예시]\n15\n1 2\n1 3\n2 4\n3 7\n6 2\n3 8\n4 9\n2 5\n5 11\n7 13\n10 4\n11 15\n12 5\n14 7\n6\n6 11\n10 9\n2 6\n7 6\n8 13\n8 15\n\n[출력 예시]\n2\n4\n2\n1\n3\n1\n'''\nimport sys\nsys.setrecursionlimit(10**5)\n\nn = int(sys.stdin.readline())\nparent = [[0] * 21 for _ in range(n + 1)]\nd = [0] * (n + 1)\nc = [False] * (n + 1)\ngraph = [[] for _ in range(n + 1)]\n\nfor _ in range(n - 1):\n    a, b = map(int, sys.stdin.readline().split())\n    graph[a].append(b)\n    graph[b].append(a)\n\ndef dfs(x, depth):\n    c[x] = True\n    d[x] = depth\n    for y in graph[x]:\n        if c[y]:\n            continue\n        parent[y][0] = x\n        dfs(y, depth + 1)\n\ndef set_parent():\n    dfs(1, 0)\n    for i in range(1, 21):\n        for j in range(1, n + 1):\n            parent[j][i] = parent[parent[j][i - 1]][i - 1]\n\ndef lca(a, b):\n    if d[a] > d[b]:\n        a, b = b, a\n    for i in range(20, -1, -1):\n        if d[b] - d[a] >= (1 << i):\n            b = parent[b][i]\n    if a == b:\n        return a\n    for i in range(20, -1, -1):\n        if parent[a][i] != parent[b][i]:\n            a = parent[a][i]\n            b = parent[b][i]\n    return parent[a][0]\n\nset_parent()\n\nm = int(sys.stdin.readline())\nfor _ in range(m):\n    a, b = map(int, sys.stdin.readline().split())\n    print(lca(a, b))\n"
      },
      {
        "fileName": "격자탐색.py",
        "content": "'''\n격자 그래프 탐색 (Grid Traversal / Flood Fill)\n2차원 배열(격자)에서 4방향(상, 하, 좌, 우) 또는 8방향 벡터를 이용하여 인접한 칸을 탐색하는 알고리즘.\n미로 찾기, 영역 넓이 구하기, 섬의 개수 세기, 토마토 익히기 등의 정올(Olympiad) 빈출 유형에 주로 결합됩니다.\n\n[입력 예시]\n4 5\n10111\n10101\n10101\n11101\n\n[출력 예시]\n15\n'''\nimport sys\nfrom collections import deque\n\nr, c = map(int, sys.stdin.readline().split())\ngrid = [list(map(int, sys.stdin.readline().split())) for _ in range(r)]\nvisited = [[False] * c for _ in range(r)]\n\ndr = [-1, 1, 0, 0]\ndc = [0, 0, -1, 1]\n\ndef process_bfs(start_r, start_c):\n    queue = deque()\n    queue.append((start_r, start_c))\n    visited[start_r][start_c] = True\n    area_count = 1\n    \n    while queue:\n        curr_r, curr_c = queue.popleft()\n        \n        for i in range(4):\n            nr = curr_r + dr[i]\n            nc = curr_c + dc[i]\n            \n            if 0 <= nr < r and 0 <= nc < c:\n                if not visited[nr][nc] and grid[nr][nc] == 0:\n                    visited[nr][nc] = True\n                    queue.append((nr, nc))\n                    area_count += 1\n                    \n    return area_count\n\ntotal_areas = 0\nfor i in range(r):\n    for j in range(c):\n        if not visited[i][j] and grid[i][j] == 0:\n            area_size = process_bfs(i, j)\n            total_areas += 1\n\nprint(total_areas)\n"
      },
      {
        "fileName": "다익스트라.py",
        "content": "import heapq\n\nV, E = map(int, input().split())\n\ngraph = [[] for _ in range(V+1)]\n\nfor _ in range(E):\n    a, b, cost = map(int, input().split())\n    graph[a].append((cost, b))\n    graph[b].append((cost, a))\n\nvisited = [False] * (V+1)\n\npq = []\nheapq.heappush(pq, (0, 1))\n\nresult = 0\n\nwhile pq:\n    cost, node = heapq.heappop(pq)\n    \n    if visited[node]:\n        continue\n    \n    visited[node] = True\n    result += cost\n    \n    for next_cost, next_node in graph[node]:\n        if not visited[next_node]:\n            heapq.heappush(pq, (next_cost, next_node))\n\nprint(result)"
      },
      {
        "fileName": "벨만포드.py",
        "content": "'''\n벨만 포드 알고리즘 (Bellman-Ford Algorithm)\n\n[작동 원리]\n단일 출발점 최단 경로 알고리즘으로, 다익스트라와 달리 '음수 가중치'를 가진 간선이 있을 때도 사용할 수 있습니다.\n모든 간선을 N-1번(V-1번) 확인하며 최단 거리를 갱신합니다.\n만약 N번째(V번째) 확인에서 또 거리가 갱신된다면, 그래프 내에 무한히 비용이 줄어드는 '음수 사이클'이 존재함을 판단할 수 있습니다.\n\n[시간 복잡도]\nO(V * E)\n\n[입력 예시]\n3 4\n1 2 4\n1 3 3\n2 3 -1\n3 1 -2\n\n[출력 예시]\n4\n3\n'''\nimport sys\n\nINF = int(1e9)\n\nn, m = map(int, sys.stdin.readline().split())\nedges = []\ndist = [INF] * (n + 1)\n\nfor _ in range(m):\n    a, b, c = map(int, sys.stdin.readline().split())\n    edges.append((a, b, c))\n\ndef bf(start):\n    dist[start] = 0\n    for i in range(n):\n        for j in range(m):\n            cur_node = edges[j][0]\n            next_node = edges[j][1]\n            edge_cost = edges[j][2]\n            \n            if dist[cur_node] != INF and dist[next_node] > dist[cur_node] + edge_cost:\n                dist[next_node] = dist[cur_node] + edge_cost\n                if i == n - 1:\n                    return True\n    return False\n\nnegative_cycle = bf(1)\n\nif negative_cycle:\n    print(\"-1\")\nelse:\n    for i in range(2, n + 1):\n        if dist[i] == INF:\n            print(\"-1\")\n        else:\n            print(dist[i])\n"
      },
      {
        "fileName": "위상정렬.py",
        "content": "'''\n위상 정렬 (Topological Sorting)\n방향 그래프에서 그래프의 모든 노드를 방향성에 거스르지 않도록 순서대로 나열하는 알고리즘.\n선수 과목을 고려한 수강 신청, 작업의 순서 결정 등에 사용. (사이클이 없어야 함)\n\n[입력 예시]\n3 2\n1 3\n2 3\n\n[출력 예시]\n1 2 3\n'''\nimport sys\nfrom collections import deque\n\nv, e = map(int, sys.stdin.readline().split())\nindegree = [0] * (v + 1)\ngraph = [[] for _ in range(v + 1)]\n\nfor _ in range(e):\n    a, b = map(int, sys.stdin.readline().split())\n    graph[a].append(b)\n    indegree[b] += 1\n\nresult = []\nq = deque()\n\nfor i in range(1, v + 1):\n    if indegree[i] == 0:\n        q.append(i)\n\nwhile q:\n    now = q.popleft()\n    result.append(now)\n    for i in graph[now]:\n        indegree[i] -= 1\n        if indegree[i] == 0:\n            q.append(i)\n\nfor i in result:\n    print(i, end=' ')\n"
      },
      {
        "fileName": "크루스칼.py",
        "content": "'''\n크루스칼 알고리즘 (Kruskal's Algorithm) - 최소 신장 트리 (MST)\n그래프 내의 모든 노드를 포함하면서 사이클이 없고, 간선 가중치의 합이 최소가 되는 트리를 찾는 알고리즘.\n모든 마을을 최소 비용으로 연결하는 전력망 구축 등에 사용.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\ndef find_parent(parent, x):\n    if parent[x] != x:\n        parent[x] = find_parent(parent, parent[x])\n    return parent[x]\n\ndef union_parent(parent, a, b):\n    a = find_parent(parent, a)\n    b = find_parent(parent, b)\n    if a < b:\n        parent[b] = a\n    else:\n        parent[a] = b\n\nv, e = map(int, sys.stdin.readline().split())\nparent = [0] * (v + 1)\nedges = []\nresult = 0\n\nfor i in range(1, v + 1):\n    parent[i] = i\n\nfor _ in range(e):\n    a, b, cost = map(int, sys.stdin.readline().split())\n    edges.append((cost, a, b))\n\nedges.sort()\n\nfor edge in edges:\n    cost, a, b = edge\n    if find_parent(parent, a) != find_parent(parent, b):\n        union_parent(parent, a, b)\n        result += cost\n\nprint(result)\n"
      }
    ]
  },
  {
    "folderName": "그리디",
    "files": [
      {
        "fileName": "분할가능배낭문제.py",
        "content": "'''\n부분 배낭 문제 (Fractional Knapsack / 무도회장) - 그리디\n물건을 쪼갤 수 있는(Fractional) 조건의 배낭 문제.\n가성비(단위 무게당 가치)가 높은 순서대로 내림차순 정렬하여 담고,\n물건이 전부 들어가지 않으면 배낭의 남은 하중만큼 물건을 쪼개서 넣습니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, capacity = map(int, sys.stdin.readline().split())\nitems = []\n\nfor _ in range(n):\n    w, v = map(int, sys.stdin.readline().split())\n    items.append((w, v, v / w)) \n\nitems.sort(key=lambda x: x[2], reverse=True)\n\ntotal_value = 0.0\n\nfor w, v, ratio in items:\n    if capacity >= w:\n        capacity -= w\n        total_value += v\n    else:\n        total_value += capacity * ratio\n        break\n\nprint(f\"{total_value:.2f}\")\n"
      },
      {
        "fileName": "허프만코딩.py",
        "content": "'''\n허프만 코딩 (Huffman Coding) / 카드 정렬 최적화 - 우선순위 큐(Greedy)\n여러 데이터가 있을 때 항상 가장 작은 두 묶음을 선택해서 합치는 과정을 통해 최종 합을 최소화하는 알고리즘.\n최소 힙(Min Heap) 자료구조를 응용한 필수 그리디 기법입니다. (EX: 백준 '카드 정렬하기')\n힙에 묶음이 1개 남을 때까지 가장 작은 두 묶음을 꺼내서 더하며 합친 비용은 전체 비용에 누적됨.\n이후 합친 묶음을 다시 힙에 넣습니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\nimport heapq\n\nn = int(sys.stdin.readline())\nheap = []\n\nfor _ in range(n):\n    heapq.heappush(heap, int(sys.stdin.readline()))\n\nresult = 0\n\nwhile len(heap) > 1:\n    first = heapq.heappop(heap)\n    second = heapq.heappop(heap)\n    \n    sum_value = first + second\n    result += sum_value\n    \n    heapq.heappush(heap, sum_value)\n\nprint(result)\n"
      },
      {
        "fileName": "회의실배정.py",
        "content": "'''\n회의실 배정 (Activity Selection / Greedy)\n시작 시간과 끝나는 시간이 정해진 N개의 회의가 주어질 때, 겹치지 않게 하면서 가장 많은 회의를 할 수 있는 개수를 구하는 알고리즘.\n그리디 알고리즘의 대표적인 예시로, '끝나는 시간'을 기준으로 오름차순 정렬하는 것이 핵심입니다.\n\n[입력 예시]\n11\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11\n8 12\n2 13\n12 14\n\n[출력 예시]\n4\n'''\nimport sys\n\nn = int(sys.stdin.readline())\nmeetings = []\nfor _ in range(n):\n    start, end = map(int, sys.stdin.readline().split())\n    meetings.append((start, end))\n\nmeetings.sort(key=lambda x: (x[1], x[0]))\n\ncount = 0\ncurrent_end_time = 0\n\nfor start, end in meetings:\n    if start >= current_end_time:\n        current_end_time = end\n        count += 1\n\nprint(count)\n"
      }
    ]
  },
  {
    "folderName": "기하학",
    "files": [
      {
        "fileName": "CCW.py",
        "content": "'''\nCCW (Counter Clockwise) \n세 점 A, B, C가 주어졌을 때 이 세 점의 방향성(반시계, 시계, 일직선)을 판별하는 기하학 핵심 알고리즘.\n신발끈 공식(외적)을 사용하여 양수면 반시계 방향, 음수면 시계 방향, 0이면 일직선 상에 있음을 의미합니다.\n\n[입력 예시]\n1 1\n5 5\n7 3\n\n[출력 예시]\n-1\n'''\nimport sys\n\ndef ccw(x1, y1, x2, y2, x3, y3):\n    return (x1 * y2 + x2 * y3 + x3 * y1) - (x2 * y1 + x3 * y2 + x1 * y3)\n\nlines = []\nfor _ in range(3):\n    lines.append(list(map(int, sys.stdin.readline().split())))\n\np1, p2, p3 = lines[0], lines[1], lines[2]\nresult = ccw(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1])\n\nif result > 0:\n    print(\"1 (반시계 방향)\")\nelif result < 0:\n    print(\"-1 (시계 방향)\")\nelse:\n    print(\"0 (일직선)\")\n"
      },
      {
        "fileName": "볼록껍질.py",
        "content": "'''\n볼록 껍질 (Convex Hull) - 그라함 스캔(Graham Scan) / 모노톤 체인\n2차원 평면 위에 여러 점이 있을 때, 가장 바깥쪽에 있는 점들을 연결해 모든 점을 포함하는 볼록 다각형을 만드는 알고리즘.\n모노톤 체인 방식을 사용하기 위해 위치를 기준으로 정렬 (x좌표 우선, y좌표 차선)하고\n아래 껍질(Lower Hull)과 위 껍질(Upper Hull)을 각각 구합니다.\n처음과 끝 점은 lower/upper 양쪽에서 중복으로 포함되므로 둘 중 한 군데에서는 제외하고 합칩니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\ndef ccw(x1, y1, x2, y2, x3, y3):\n    return (x1 * y2 + x2 * y3 + x3 * y1) - (x2 * y1 + x3 * y2 + x1 * y3)\n\nn = int(sys.stdin.readline())\npoints = []\nfor _ in range(n):\n    points.append(list(map(int, sys.stdin.readline().split())))\n\npoints.sort()\n\nlower = []\nfor p in points:\n    while len(lower) >= 2 and ccw(lower[-2][0], lower[-2][1], lower[-1][0], lower[-1][1], p[0], p[1]) <= 0:\n        lower.pop()\n    lower.append(p)\n\nupper = []\nfor p in reversed(points):\n    while len(upper) >= 2 and ccw(upper[-2][0], upper[-2][1], upper[-1][0], upper[-1][1], p[0], p[1]) <= 0:\n        upper.pop()\n    upper.append(p)\n\nconvex_hull = lower[:-1] + upper[:-1]\n\nprint(len(convex_hull))\nfor pt in convex_hull:\n    print(pt[0], pt[1])\n"
      },
      {
        "fileName": "선분교차.py",
        "content": "'''\n선분 교차 판별 (Line Intersection)\nCCW를 응용하여 두 선분 AB와 CD가 교차하는지 판별하는 알고리즘.\n두 점 쌍에 대해 서로 엇갈려 있는지 CCW 부호의 곱으로 판단하며, 일직선 상에 겹치는 예외 케이스 처리도 포함됩니다.\n두 선분이 일직선 상에 있는 경우 양 점의 좌표를 비교해 겹치는지 확인하고, \n일반적인 경우 두 선분의 CCW 곱이 모두 0 이하일 때 교차하는 것으로 판정합니다.\n\n[입력 예시]\n1 1 5 5\n1 5 5 1\n\n[출력 예시]\n1\n'''\nimport sys\n\ndef ccw(x1, y1, x2, y2, x3, y3):\n    res = (x1 * y2 + x2 * y3 + x3 * y1) - (x2 * y1 + x3 * y2 + x1 * y3)\n    if res > 0: return 1\n    if res < 0: return -1\n    return 0\n\ndef is_intersect(x1, y1, x2, y2, x3, y3, x4, y4):\n    abc = ccw(x1, y1, x2, y2, x3, y3)\n    abd = ccw(x1, y1, x2, y2, x4, y4)\n    cda = ccw(x3, y3, x4, y4, x1, y1)\n    cdb = ccw(x3, y3, x4, y4, x2, y2)\n\n    if abc * abd == 0 and cda * cdb == 0:\n        if min(x1, x2) <= max(x3, x4) and min(x3, x4) <= max(x1, x2) and min(y1, y2) <= max(y3, y4) and min(y3, y4) <= max(y1, y2):\n            return True\n        return False\n    \n    if abc * abd <= 0 and cda * cdb <= 0:\n        return True\n    \n    return False\n\nx1, y1, x2, y2 = map(int, sys.stdin.readline().split())\nx3, y3, x4, y4 = map(int, sys.stdin.readline().split())\n\nif is_intersect(x1, y1, x2, y2, x3, y3, x4, y4):\n    print(\"1 (교차함)\")\nelse:\n    print(\"0 (교차하지 않음)\")\n"
      }
    ]
  },
  {
    "folderName": "누적_합",
    "files": [
      {
        "fileName": "1차원누적합.py",
        "content": "'''\n1차원 배열 누적 합 (Prefix Sum)\n배열의 특정 구간 합을 구할 때 매번 반복문을 돌지 않고 O(1)의 속도로 빠르게 합을 구할 수 있도록 초기값을 미리 누적해두는 알고리즘.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, m = map(int, sys.stdin.readline().split())\narr = list(map(int, sys.stdin.readline().split()))\n\nprefix_sum = [0] * (n + 1)\n\nfor i in range(n):\n    prefix_sum[i + 1] = prefix_sum[i] + arr[i]\n\nfor _ in range(m):\n    a, b = map(int, sys.stdin.readline().split())\n    result = prefix_sum[b] - prefix_sum[a - 1]\n    print(result)\n"
      },
      {
        "fileName": "2차원누적합.py",
        "content": "'''\n2차원 배열 누적 합 (2D Prefix Sum)\n2차원 격자에서 지정된 특정 직사각형 영역의 합을 O(1) 시간만에 빠르게 계산하는 알고리즘.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, m = map(int, sys.stdin.readline().split())\ngraph = [list(map(int, sys.stdin.readline().split())) for _ in range(n)]\n\nprefix_2d = [[0] * (n + 1) for _ in range(n + 1)]\n\nfor i in range(1, n + 1):\n    for j in range(1, n + 1):\n        prefix_2d[i][j] = graph[i - 1][j - 1] + prefix_2d[i - 1][j] + prefix_2d[i][j - 1] - prefix_2d[i - 1][j - 1]\n\nfor _ in range(m):\n    r1, c1, r2, c2 = map(int, sys.stdin.readline().split())\n    result = prefix_2d[r2][c2] - prefix_2d[r1 - 1][c2] - prefix_2d[r2][c1 - 1] + prefix_2d[r1 - 1][c1 - 1]\n    print(result)\n"
      }
    ]
  },
  {
    "folderName": "동적_계획법",
    "files": [
      {
        "fileName": "0_1배낭문제.py",
        "content": "'''\n0/1 배낭 문제 (0-1 Knapsack)\n\n[작동 원리]\n배낭의 용량이 정해져 있을 때, 담을 수 있는 물건들의 가치 합을 최대로 만드는 조합을 찾는 동적 계획법 알고리즘입니다.\n가장 일반적인 점화식은 `DP[i][w] = max(DP[i-1][w], DP[i-1][w-weight[i]] + value[i])` 입니다.\n즉, i번째 물건을 넣지 않았을 때의 가치와, i번째 물건을 넣었을 때의 가치 중 더 큰 값을 선택하며 표를 채워나갑니다.\n1차원 배열로 최적화할 경우, 중복 선택을 막기 위해 반드시 뒤에서부터 역방향으로 채워나가야 합니다.\n\n[시간 복잡도]\nO(N * K) (N: 물품의 수, K: 배낭의 용량)\n\n[입력 예시]\n4 7\n6 13\n4 8\n3 6\n5 12\n\n[출력 예시]\n14\n'''\nimport sys\n\nn, k = map(int, sys.stdin.readline().split())\n\ndp = [0] * (k + 1)\n\nfor _ in range(n):\n    w, v = map(int, sys.stdin.readline().split())\n    for j in range(k, w - 1, -1):\n        dp[j] = max(dp[j], dp[j - w] + v)\n\nprint(dp[k])\n"
      },
      {
        "fileName": "LCS.py",
        "content": "'''\n최장 공통 부분 수열 (LCS, Longest Common Subsequence)\n두 수열(또는 문자열)이 주어졌을 때, 두 수열의 길이가 가장 긴 부분 수열(흩어져 있어도 순서가 맞으면 됨)을 찾는 알고리즘.\n두 데이터의 유사도를 판별하거나 DNA 염기서열 비교 등에 사용.\n\n[입력 예시]\nACAYKP\nCAPCAK\n\n[출력 예시]\n4\n'''\nimport sys\n\ns1 = sys.stdin.readline().strip()\ns2 = sys.stdin.readline().strip()\n\nn = len(s1)\nm = len(s2)\n\ndp = [[0] * (m + 1) for _ in range(n + 1)]\n\nfor i in range(1, n + 1):\n    for j in range(1, m + 1):\n        if s1[i - 1] == s2[j - 1]:\n            dp[i][j] = dp[i - 1][j - 1] + 1\n        else:\n            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n\nprint(dp[n][m])\n"
      },
      {
        "fileName": "LIS.py",
        "content": "'''\n최장 증가 부분 수열 (LIS, Longest Increasing Subsequence)\n어떤 수열이 주어졌을 때, 원소가 점진적으로 커지는 가장 긴 부분 수열의 길이를 구하는 알고리즘.\n전봇대 전선 겹치지 않게 연결하기, 아이들을 키 순서대로 배치할 때 제외할 최소 인원 수 찾기 등에서 사용.\n\n[입력 예시]\n6\n10 20 10 30 20 50\n\n[출력 예시]\n4\n'''\nimport sys\n\nn = int(sys.stdin.readline())\narr = list(map(int, sys.stdin.readline().split()))\n\ndp = [1] * n\n\nfor i in range(1, n):\n    for j in range(i):\n        if arr[j] < arr[i]:\n            dp[i] = max(dp[i], dp[j] + 1)\n\nprint(max(dp))\n"
      },
      {
        "fileName": "LIS_NlogN.py",
        "content": "'''\n최장 증가 부분 수열 (LIS) - O(N log N) 이분 탐색 활용\n단순 DP O(N^2)로 풀 수 없는 배열의 길이가 매우 긴 경우, 이분 탐색을 결합하여 시간 복잡도를 O(N log N)으로 단축시키는 알고리즘입니다.\n\n[입력 예시]\n6\n10 20 10 30 20 50\n\n[출력 예시]\n4\n'''\nimport sys\nimport bisect\n\nn = int(sys.stdin.readline())\narr = list(map(int, sys.stdin.readline().split()))\n\ndp = [arr[0]]\n\nfor i in range(1, n):\n    if arr[i] > dp[-1]:\n        dp.append(arr[i])\n    else:\n        idx = bisect.bisect_left(dp, arr[i])\n        dp[idx] = arr[i]\n\nprint(len(dp))\n"
      },
      {
        "fileName": "RGB거리.py",
        "content": "'''\nRGB 거리 (RGB Street / Coloring Constraint) - State DP\nN개의 집을 빨강, 초록, 파랑 중 하나로 칠할 때, 인접한 두 집의 색이 같지 않게 칠하는 비용의 최솟값을 구하는 알고리즘.\n각 상태(R, G, B)에 대해 이전 단계에서 칠할 수 있는 색상의 최소 비용만을 누적해 나가는 상태 보존형 1D DP입니다.\n\n[입력 예시]\n3\n26 40 83\n49 60 57\n13 89 99\n\n[출력 예시]\n96\n'''\nimport sys\n\nn = int(sys.stdin.readline())\ncost = []\n\nfor _ in range(n):\n    cost.append(list(map(int, sys.stdin.readline().split())))\n\nfor i in range(1, n):\n    cost[i][0] += min(cost[i - 1][1], cost[i - 1][2]) # 현재 빨강 선택 -> 이전 집은 초록 or 파랑\n    cost[i][1] += min(cost[i - 1][0], cost[i - 1][2]) # 현재 초록 선택 -> 이전 집은 빨강 or 파랑\n    cost[i][2] += min(cost[i - 1][0], cost[i - 1][1]) # 현재 파랑 선택 -> 이전 집은 빨강 or 초록\n\nprint(min(cost[n - 1]))\n"
      },
      {
        "fileName": "가장큰정사각형.py",
        "content": "'''\n가장 큰 정사각형 (Largest Square in a Matrix) - 2D DP\n0과 1로 이루어진 격자 안에서 값이 1로만 이루어진 가장 큰 정사각형의 크기(넓이)를 구하는 알고리즘입니다.\n자신의 왼쪽, 위쪽, 왼쪽 대각선 위쪽의 최솟값을 참조하여 한 변의 길이를 점진적으로 업데이트합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, m = map(int, sys.stdin.readline().split())\ngraph = [list(map(int, list(sys.stdin.readline().strip()))) for _ in range(n)]\n\ndp = [[0] * m for _ in range(n)]\nmax_side = 0\n\nfor i in range(n):\n    for j in range(m):\n        if i == 0 or j == 0:\n            dp[i][j] = graph[i][j]\n        elif graph[i][j] == 1:\n            dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1\n            \n        max_side = max(max_side, dp[i][j])\n\nprint(max_side * max_side)\n"
      },
      {
        "fileName": "격자경로.py",
        "content": "'''\n2차원 격자 이동 DP (Grid Path DP)\nN x M 크기의 격자 형태 미로에서 이동 제약 조건(예: 오른쪽이나 아래로만 이동 가능)이 있을 때 도달하는 최소 비용, 혹은 가능한 경로의 수를 찾는 알고리즘.\n특정 칸에 장애물이 있거나 각 칸마다 밟았을 때 얻는/잃는 점수가 다를 때 최대/최소 이득 수치를 산출함.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, m = map(int, sys.stdin.readline().split())\ngrid = []\nfor _ in range(n):\n    grid.append(list(map(int, sys.stdin.readline().split())))\n\ndp = [[0] * m for _ in range(n)]\ndp[0][0] = grid[0][0]\n\nfor i in range(1, m):\n    dp[0][i] = dp[0][i - 1] + grid[0][i]\n\nfor i in range(1, n):\n    dp[i][0] = dp[i - 1][0] + grid[i][0]\n\nfor i in range(1, n):\n    for j in range(1, m):\n        dp[i][j] = grid[i][j] + max(dp[i - 1][j], dp[i][j - 1])\n\nprint(dp[n - 1][m - 1])\n"
      },
      {
        "fileName": "계단오르기.py",
        "content": "'''\n계단 오르기 (Climbing Stairs)\n\n[작동 원리]\nn개의 계단을 오르는데, 한 번에 1계단 또는 2계단씩 오를 수 있으며 연속된 세 개의 계단을 모두 밟을 수는 없는 조건일 때, 얻을 수 있는 총 점수의 최댓값을 구하는 매우 유명한 기초 DP입니다.\n마지막 i번째 계단을 밟는 방법은 두 가지입니다:\n1. i-3번째 계단 -> i-1번째 계단 -> i번째 계단 (연속 2칸 밟기)\n2. i-2번째 계단 -> i번째 계단 (2칸 건너뛰기)\n따라서 점화식은 `DP[i] = max(DP[i-3] + score[i-1] + score[i], DP[i-2] + score[i])`가 됩니다.\n배열의 초기값만 잘 설정해 주면 O(N)으로 빠르게 계산할 수 있습니다.\n\n[시간 복잡도]\nO(N) (N은 계단의 개수)\n\n[입력 예시]\n6\n10\n20\n15\n25\n10\n20\n\n[출력 예시]\n75\n'''\nimport sys\n\nn = int(sys.stdin.readline())\nif n == 0:\n    print(0)\n    sys.exit()\n    \nstairs = [0] * 301\nfor i in range(1, n + 1):\n    stairs[i] = int(sys.stdin.readline())\n\ndp = [0] * 301\nif n >= 1:\n    dp[1] = stairs[1]\nif n >= 2:\n    dp[2] = stairs[1] + stairs[2]\nif n >= 3:\n    dp[3] = max(stairs[1] + stairs[3], stairs[2] + stairs[3])\n\nfor i in range(4, n + 1):\n    dp[i] = max(dp[i - 2] + stairs[i], dp[i - 3] + stairs[i - 1] + stairs[i])\n\nprint(dp[n] if n > 0 else 0)\n"
      },
      {
        "fileName": "내리막길.py",
        "content": "'''\n내리막 길 (Grid Path with DFS + DP) \n격자 위에서 시작점부터 도착점까지 이동할 때, 인접한 4방향 중 항상 '높이가 더 낮은 곳'으로만 가는 경로의 개수를 구하는 알고리즘입니다.\n일반적인 BFS/DFS로는 겹치는 경로 탐색 때문에 시간 초과가 나므로, DFS에 DP(메모이제이션)를 결합하여 O(N*M)의 시간 안에 풉니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\nsys.setrecursionlimit(10**6)\n\nm, n = map(int, sys.stdin.readline().split())\nheights = [list(map(int, sys.stdin.readline().split())) for _ in range(m)]\n\n# 방문하지 않은 곳은 -1, 경로가 없으면 0, 있으면 해당 경로의 수 저장\ndp = [[-1] * n for _ in range(m)]\n\ndx = [-1, 1, 0, 0]\ndy = [0, 0, -1, 1]\n\ndef dfs(x, y):\n    if x == m - 1 and y == n - 1:\n        return 1\n        \n    if dp[x][y] != -1:\n        return dp[x][y]\n        \n    dp[x][y] = 0\n    \n    for i in range(4):\n        nx = x + dx[i]\n        ny = y + dy[i]\n        \n        if 0 <= nx < m and 0 <= ny < n:\n            if heights[nx][ny] < heights[x][y]:\n                dp[x][y] += dfs(nx, ny)\n                \n    return dp[x][y]\n\nprint(dfs(0, 0))\n"
      },
      {
        "fileName": "다중배낭문제.py",
        "content": "'''\n다중 배낭 문제 (Bounded Knapsack Problem)\n각 물건의 개수가 정해져 있을 때, 가치의 최댓값을 구하는 알고리즘입니다.\n단순히 물건 개수만큼 반복하면 시간 초과가 날 수 있으므로, 물건의 개수를 이진수(1, 2, 4...) 단위로 쪼개어\n여러 개의 0/1 배낭 문제로 변환하여 O(N * K * log(C)) 시간에 푸는 기법입니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, k = map(int, sys.stdin.readline().split())\nitems = []\n\nfor _ in range(n):\n    w, v, c = map(int, sys.stdin.readline().split())\n    count = 1\n    while c > 0:\n        take = min(count, c)\n        items.append((w * take, v * take))\n        c -= take\n        count *= 2\n\ndp = [0] * (k + 1)\n\nfor w, v in items:\n    for j in range(k, w - 1, -1):\n        dp[j] = max(dp[j], dp[j - w] + v)\n\nprint(dp[k])\n"
      },
      {
        "fileName": "돌놓기.py",
        "content": "'''\n돌 놓기 (Pebble Placing)\n\n[작동 원리]\n3 x N 크기의 테이블에 돌을 놓는 문제입니다. 단, 가로나 세로로 인접한 두 칸에는 동시에 돌을 놓을 수 없습니다.\n각 열에 돌을 놓을 수 있는 패턴은 다음 4가지로 압축됩니다.\n- 패턴 0: 아무 곳에도 돌을 놓지 않음\n- 패턴 1: 1행에만 돌을 놓음\n- 패턴 2: 2행에만 돌을 놓음\n- 패턴 3: 3행에만 돌을 놓음\n- 패턴 4: 1행과 3행에 돌을 놓음\n여기서 i번째 열에 패턴 p로 돌을 놓았을 때의 최대 점수를 DP[i][p]라고 정의합니다.\n이전 열(i-1)의 패턴과 현재 열(i)의 패턴이 양립 가능한지(호환되는지) 확인한 후, 호환되는 패턴 조합 중 최대값을 계속 누적해 나가는 동적 계획법(Dynamic Programming)을 사용합니다.\n\n[시간 복잡도]\n상태 공간이 4개로 고정되어 있으므로, 4 * 4 * N 번의 연산이 수행됩니다. 따라서 O(N)의 시간 복잡도를 가집니다.\n\n[입력 예시]\n3\n1 2 3\n4 5 6\n7 8 9\n\n[출력 예시]\n28\n'''\nimport sys\n\ndef solve():\n    input = sys.stdin.read\n    data = input().split()\n    if not data:\n        return\n    \n    N = int(data[0])\n    \n    # 3xN 테이블 점수 입력\n    board = []\n    idx = 1\n    for _ in range(3):\n        board.append([int(x) for x in data[idx:idx+N]])\n        idx += N\n        \n    # 패턴 4가지에 대한 각 열의 점수 계산 함수\n    # 패턴 0: 돌 놓지 않음\n    # 패턴 1: 1행 (인덱스 0)\n    # 패턴 2: 2행 (인덱스 1)\n    # 패턴 3: 3행 (인덱스 2)\n    # 패턴 4: 1, 3행 (인덱스 0, 2)\n    def get_score(col, pattern):\n        if pattern == 0: return 0\n        if pattern == 1: return board[0][col]\n        if pattern == 2: return board[1][col]\n        if pattern == 3: return board[2][col]\n        if pattern == 4: return board[0][col] + board[2][col]\n        return 0\n        \n    # 양립 가능한(인접하지 않은) 패턴인지 확인\n    def is_compatible(p1, p2):\n        if p1 == 0 or p2 == 0: return True\n        if p1 == 1 and (p2 == 2 or p2 == 3 or p2 == 4): return True\n        if p1 == 2 and (p2 == 1 or p2 == 3): return True\n        if p1 == 3 and (p2 == 1 or p2 == 2 or p2 == 4): return True\n        if p1 == 4 and (p2 == 2): return True\n        return False\n        \n    dp = [[0] * 5 for _ in range(N)]\n    \n    # 첫 번째 열 초기화\n    for p in range(5):\n        dp[0][p] = get_score(0, p)\n        \n    # DP 채우기\n    for i in range(1, N):\n        for pt_curr in range(5):\n            max_prev = -float('inf')\n            for pt_prev in range(5):\n                if is_compatible(pt_prev, pt_curr):\n                    max_prev = max(max_prev, dp[i-1][pt_prev])\n            dp[i][pt_curr] = max_prev + get_score(i, pt_curr)\n            \n    print(max(dp[N-1]))\n\nif __name__ == '__main__':\n    solve()\n"
      },
      {
        "fileName": "동전교환.py",
        "content": "'''\n동전 교환 (Coin Change)\n\n[작동 원리]\nN가지 종류의 동전이 주어질 때, 이 동전들을 사용하여 목표 금액 K를 만드는 경우의 수(또는 최소 동전 개수)를 구하는 1차원 배낭문제(Knapsack) 유형의 동적 계획법 알고리즘입니다.\n이 코드는 금액을 만드는 '최소 동전의 개수'를 구하는 방식입니다.\n초기 배열을 충분히 큰 값(예: 10001)으로 세팅한 뒤, 각 동전에 대해 목표 금액까지 순회하며 무제한 배낭 문제(정방향)처럼 배열을 업데이트합니다.\n점화식은 `DP[j] = min(DP[j], DP[j - coin] + 1)` 입니다.\n\n[시간 복잡도]\nO(N * K) (N은 동전 종류의 개수, K는 목표 금액)\n\n[입력 예시]\n3 15\n1\n5\n12\n\n[출력 예시]\n3\n'''\nimport sys\n\nn, k = map(int, sys.stdin.readline().split())\ncoins = []\nfor _ in range(n):\n    coins.append(int(sys.stdin.readline()))\n\n# 최소 개수를 구하기 위해 초기값을 K보다 큰 임의의 값으로 설정\nMAX_VAL = 100001\ndp = [MAX_VAL] * (k + 1)\ndp[0] = 0\n\nfor coin in coins:\n    for j in range(coin, k + 1):\n        dp[j] = min(dp[j], dp[j - coin] + 1)\n\nif dp[k] == MAX_VAL:\n    print(-1)\nelse:\n    print(dp[k])\n"
      },
      {
        "fileName": "무한배낭문제.py",
        "content": "'''\n무한 배낭 문제 (Unbounded Knapsack Problem)\n각 물건의 개수 제한이 무한대일 때, 버틸 수 있는 무게 내에서 가치의 최댓값을 구하는 알고리즘.\n0/1 1차원 배낭과 유사하지만, 중복을 허용해야 하므로 무게를 앞에서부터(정방향) 탐색합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, k = map(int, sys.stdin.readline().split())\n\ndp = [0] * (k + 1)\n\nfor _ in range(n):\n    w, v = map(int, sys.stdin.readline().split())\n    for j in range(w, k + 1):\n        dp[j] = max(dp[j], dp[j - w] + v)\n\nprint(dp[k])\n"
      },
      {
        "fileName": "바이토닉수열.py",
        "content": "'''\n바이토닉 부분 수열 (Bitonic Subsequence) - LIS 응용 DP\n수열이 증가하다가 일정 지점부터 감소하는 형태인 '바이토닉 수열' 중 가장 긴 길이를 구하는 알고리즘입니다.\n각 원소를 기준으로 왼쪽에서 오른쪽으로 가는 최장 증가 부분 수열(LIS)과,\n오른쪽에서 왼쪽으로 가는 최장 증가 부분 수열의 길이를 합하여 구합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn = int(sys.stdin.readline())\narr = list(map(int, sys.stdin.readline().split()))\n\ninc_dp = [1] * n\ndec_dp = [1] * n\n\nfor i in range(n):\n    for j in range(i):\n        if arr[j] < arr[i]:\n            inc_dp[i] = max(inc_dp[i], inc_dp[j] + 1)\n\nfor i in range(n - 1, -1, -1):\n    for j in range(n - 1, i, -1):\n        if arr[j] < arr[i]:\n            dec_dp[i] = max(dec_dp[i], dec_dp[j] + 1)\n\nresult = 0\nfor i in range(n):\n    result = max(result, inc_dp[i] + dec_dp[i] - 1)\n\nprint(result)\n"
      },
      {
        "fileName": "비트마스킹DP.py",
        "content": "'''\n외판원 순회 (TSP) - 비트마스킹 DP\n방문한 노드들의 집합을 정수가 아닌 비트(이진수)로 표현하여 메모리를 절약하고 속도를 높이는 DP 알고리즘.\n모든 도시를 한 번씩 방문하고 출발지로 돌아오는 최소 비용을 구할 때 사용.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn = int(sys.stdin.readline())\ncost = [list(map(int, sys.stdin.readline().split())) for _ in range(n)]\n\nINF = int(1e9)\ndp = [[-1] * (1 << n) for _ in range(n)]\n\ndef dfs(x, visited):\n    if visited == (1 << n) - 1:\n        if cost[x][0]:\n            return cost[x][0]\n        else:\n            return INF\n\n    if dp[x][visited] != -1:\n        return dp[x][visited]\n\n    dp[x][visited] = INF\n    for i in range(1, n):\n        if not cost[x][i]:\n            continue\n        if visited & (1 << i):\n            continue\n        \n        dp[x][visited] = min(dp[x][visited], dfs(i, visited | (1 << i)) + cost[x][i])\n    \n    return dp[x][visited]\n\nprint(dfs(0, 1))\n"
      },
      {
        "fileName": "연속합.py",
        "content": "'''\n연속 합 (Maximum Subarray Sum)\n\n[작동 원리]\n배열 안에서 연속된 몇 개의 수를 선택해 구할 수 있는 가장 큰 부분합을 구하는 카다네(Kadane's) 알고리즘 방식의 기초 DP입니다.\n`DP[i]`는 i번째 원소를 마지막으로 하는 연속 합의 최댓값입니다.\ni번째 원소를 새롭게 시작할지, 혹은 이전까지의 연속 합(DP[i-1])에 이어서 더할지를 결정합니다.\n점화식: `DP[i] = max(Array[i], DP[i-1] + Array[i])`\n\n[시간 복잡도]\nO(N) (N은 배열의 길이)\n\n[입력 예시]\n10\n10 -4 3 1 5 6 -35 12 21 -1\n\n[출력 예시]\n33\n'''\nimport sys\n\nn = int(sys.stdin.readline())\narr = list(map(int, sys.stdin.readline().split()))\n\ndp = [0] * n\ndp[0] = arr[0]\n\nfor i in range(1, n):\n    dp[i] = max(arr[i], dp[i-1] + arr[i])\n\nprint(max(dp))\n"
      },
      {
        "fileName": "자릿수DP.py",
        "content": "'''\n자릿수 DP (Digit DP)\n특정 범위 [A, B] 내에 존재하는 숫자 중에서 길이나 각 자릿수가 만족해야 하는 특정 조건을 충족하는 숫자의 개수 등을 구할 때 사용하는 패턴.\n자릿수 DP는 각 문제의 조건(예: 특정 숫자가 몇 번 들어가는지 등)에 따라 memoization 배열(dp) 설정이 달라집니다.\n보통 dp[idx][limit_status] 등 형태를 사용하며, -1은 아직 방문 안 함을 의미합니다.\n상한선(limit)이 걸려있으면 해당 자리수만큼만, 아니면 0~9까지(진법에 따라) 지정하여 재귀 탐색합니다.\nis_limit은 현재 재귀가 상한선과 동일한 숫자를 뽑았는지 전달합니다.\n최종적으로 B까지의 결과에서 A-1까지의 결과를 빼면 구간 [A, B]에 해당하는 결과값을 얻을 수 있습니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\na, b = sys.stdin.readline().split()\n\ndef solve(num_str):\n    length = len(num_str)\n    dp = [[-1] * 2 for _ in range(length)]\n    \n    def dfs(idx, limit):\n        if idx == length:\n            return 1\n            \n        if dp[idx][limit] != -1:\n            return dp[idx][limit]\n            \n        up = int(num_str[idx]) if limit else 9\n        ans = 0\n        \n        for i in range(up + 1):\n            is_limit = limit and (i == up)\n            ans += dfs(idx + 1, is_limit)\n            \n        dp[idx][limit] = ans\n        return ans\n\n    return dfs(0, True)\n\nval_b = solve(b)\nval_a = solve(str(int(a) - 1)) if int(a) > 0 else 0\n\nprint(val_b - val_a)\n"
      },
      {
        "fileName": "타일링.py",
        "content": "'''\n타일링 문제 (Tiling Problem)\n2xN 크기의 직사각형을 1x2, 2x1 타일(때로는 2x2 포함)로 채우는 방법의 수를 구하는 알고리즘.\n점화식을 세우기 가장 좋은 피보나치 수열 형태의 기초 DP.\n\n[입력 예시]\n9\n\n[출력 예시]\n55\n'''\nimport sys\n\nn = int(sys.stdin.readline())\n\ndp = [0] * 1001\ndp[1] = 1\nif n >= 2:\n    dp[2] = 2\n\nfor i in range(3, n + 1):\n    dp[i] = (dp[i - 1] + dp[i - 2]) % 10007\n\nprint(dp[n])\n"
      },
      {
        "fileName": "트리DP.py",
        "content": "'''\n트리 DP (Tree DP)\n트리 구조에서 자식 노드들의 DP 결괏값을 모아 부모 노드의 결괏값을 도출하는 알고리즘.\n우수 마을 선정(독립 집합), 트리의 지름, 자식 노드 개수 세기 등에 사용.\n\n[입력 예시]\n9\n1 3\n2 3\n4 3\n5 4\n6 4\n7 4\n8 7\n9 7\n1\n4\n3\n7\n\n[출력 예시]\n1\n5\n9\n3\n'''\nimport sys\nsys.setrecursionlimit(10**5)\n\nn = int(sys.stdin.readline())\ntree = [[] for _ in range(n + 1)]\nfor _ in range(n - 1):\n    u, v = map(int, sys.stdin.readline().split())\n    tree[u].append(v)\n    tree[v].append(u)\n\ndp = [[0, 0] for _ in range(n + 1)]\nvisited = [False] * (n + 1)\n\ndef dfs(node):\n    visited[node] = True\n    dp[node][0] = 0 \n    dp[node][1] = 1 \n    \n    for child in tree[node]:\n        if not visited[child]:\n            dfs(child)\n            dp[node][0] += max(dp[child][0], dp[child][1])\n            dp[node][1] += dp[child][0]\n\ndfs(1)\nprint(max(dp[1][0], dp[1][1]))\n"
      },
      {
        "fileName": "팰린드롬DP.py",
        "content": "'''\n팰린드롬 (Palindrome) 판별 DP\n어떤 문자열의 부분 문자열이 팰린드롬(앞으로 읽어도, 뒤로 읽어도 같은 문자열)인지 미리 계산해두어 여러 쿼리를 O(1)에 처리하는 2차원 DP 알고리즘입니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn = int(sys.stdin.readline())\narr = list(map(int, sys.stdin.readline().split()))\n\ndp = [[0] * n for _ in range(n)]\n\nfor i in range(n):\n    dp[i][i] = 1\n\nfor i in range(n - 1):\n    if arr[i] == arr[i + 1]:\n        dp[i][i + 1] = 1\n\nfor length in range(3, n + 1):\n    for start in range(n - length + 1):\n        end = start + length - 1\n        if arr[start] == arr[end] and dp[start + 1][end - 1] == 1:\n            dp[start][end] = 1\n\nm = int(sys.stdin.readline())\nfor _ in range(m):\n    s, e = map(int, sys.stdin.readline().split())\n    print(dp[s - 1][e - 1])\n"
      },
      {
        "fileName": "편집거리.py",
        "content": "'''\n편집 거리 알고리즘 / 레벤슈타인 거리 (Levenshtein Distance)\n\n[작동 원리]\n두 문자열이 얼마나 유사한지를 수치화하기 위해, 한 문자열을 다른 문자열로 변환하는 데 필요한 최소한의 삽입, 삭제, 교체 연산 횟수를 구하는 2차원 DP 알고리즘입니다.\n두 문자가 같다면 수정할 필요가 없으므로 대각선 위 값(비용 추가 없음)을 그대로 가져오며, 문자가 다르다면 삽입(왼쪽+1), 삭제(위쪽+1), 교체(대각선+1) 중 가장 작은 비용을 선택해 DP 배열을 갱신합니다.\n\n[시간 복잡도]\nO(N * M) (N, M은 각각 두 문자열의 길이)\n\n[입력 예시]\nabc\ndef\n\n[출력 예시]\n3\n'''\nimport sys\n\ns1 = sys.stdin.readline().strip()\ns2 = sys.stdin.readline().strip()\n\nn = len(s1)\nm = len(s2)\n\ndp = [[0] * (m + 1) for _ in range(n + 1)]\n\nfor i in range(1, n + 1):\n    dp[i][0] = i\nfor j in range(1, m + 1):\n    dp[0][j] = j\n\nfor i in range(1, n + 1):\n    for j in range(1, m + 1):\n        if s1[i - 1] == s2[j - 1]:\n            dp[i][j] = dp[i - 1][j - 1]\n        else:\n            dp[i][j] = 1 + min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1])\n\nprint(dp[n][m])\n"
      },
      {
        "fileName": "포도주시식.py",
        "content": "'''\n포도주 시식 (Wine Tasting)\n\n[작동 원리]\n포도주 잔이 일렬로 놓여 있을 때, 연속으로 3잔을 마시지 않으면서 가장 많은 양의 포도주를 마시는 문제입니다.\n계단 오르기와 비슷해 보이지만, '마지막 잔을 마시지 않아도 된다'는 점이 다릅니다.\n현재 잔(i)을 고려할 때 세 가지 경우가 있습니다:\n1. 이번 포도주를 마시지 않는 경우: DP[i-1]\n2. 이번 포도주와 이전 포도주(i-1)를 마시는 경우 (이때 i-2는 마실 수 없음): DP[i-3] + wine[i-1] + wine[i]\n3. 이번 포도주만 마시고 이전 포도주(i-1)를 마시지 않는 경우: DP[i-2] + wine[i]\n점화식은 `DP[i] = max(DP[i-1], DP[i-3] + wine[i-1] + wine[i], DP[i-2] + wine[i])` 입니다.\n\n[시간 복잡도]\nO(N) (N은 포도주 잔의 개수)\n\n[입력 예시]\n6\n6\n10\n13\n9\n8\n1\n\n[출력 예시]\n33\n'''\nimport sys\n\nn = int(sys.stdin.readline())\nwine = [0] * 10001\nfor i in range(1, n + 1):\n    wine[i] = int(sys.stdin.readline())\n\ndp = [0] * 10001\n\nif n >= 1:\n    dp[1] = wine[1]\nif n >= 2:\n    dp[2] = wine[1] + wine[2]\n\nfor i in range(3, n + 1):\n    dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])\n\nprint(dp[n])\n"
      },
      {
        "fileName": "행렬곱셈순서.py",
        "content": "'''\n행렬 곱셈 순서 (Matrix Chain Multiplication) - DP\nN개의 행렬을 연속해서 곱할 때, 어떤 순서로 괄호를 묶어 곱셈을 하느냐에 따라 연산 횟수가 달라집니다.\n최소의 곱셈 연산 횟수를 구하는 2차원 구간 DP의 대표적인 사례입니다.\n구간의 길이 L을 1부터 N-1까지 늘려가며 탐색하고,\ni부터 k까지의 최소 횟수 + k+1부터 j까지의 최소 횟수 + 앞뒤 결과 행렬을 합치는 비용을 계산합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn = int(sys.stdin.readline())\nmatrices = []\nfor _ in range(n):\n    r, c = map(int, sys.stdin.readline().split())\n    matrices.append((r, c))\n\ndp = [[0] * n for _ in range(n)]\n\nfor L in range(1, n):\n    for i in range(n - L):\n        j = i + L\n        dp[i][j] = float('inf')\n        for k in range(i, j):\n            cost = dp[i][k] + dp[k+1][j] + matrices[i][0] * matrices[k][1] * matrices[j][1]\n            if cost < dp[i][j]:\n                dp[i][j] = cost\n\nprint(dp[0][n-1])\n"
      }
    ]
  },
  {
    "folderName": "문자열",
    "files": [
      {
        "fileName": "KMP_문자열매칭.py",
        "content": "'''\nKMP 문자열 매칭 알고리즘\n\n[작동 원리]\n긴 본문 문자열 속에서 특정 패턴 문자열을 빠르게 찾는 알고리즘입니다.\n불일치가 발생했을 때 처음부터 다시 비교를 시작하는 단순 O(N*M)의 비효율을 막기 위해, 접두사와 접미사의 일치 길이를 저장한 LPS(Longest Prefix Suffix) 배열을 미리 전처리합니다.\n본문과 패턴을 비교하다 틀릴 경우, 패턴 내에서 중복되는 부분을 건너뛰고 비교를 이어나갑니다.\n\n[시간 복잡도]\nO(N + M) (N: 본문 길이, M: 패턴 길이)\n\n[입력 예시]\nABC ABCDAB ABCDABCDABDE\nABCDABD\n\n[출력 예시]\n1\n16\n'''\nimport sys\n\ntext = sys.stdin.readline().strip()\npattern = sys.stdin.readline().strip()\n\nt_len = len(text)\np_len = len(pattern)\n\nlps = [0] * p_len\nmatch_idx = 0\n\nfor i in range(1, p_len):\n    while match_idx > 0 and pattern[i] != pattern[match_idx]:\n        match_idx = lps[match_idx - 1]\n    if pattern[i] == pattern[match_idx]:\n        match_idx += 1\n        lps[i] = match_idx\n\nmatches = []\nmatch_idx = 0\n\nfor i in range(t_len):\n    while match_idx > 0 and text[i] != pattern[match_idx]:\n        match_idx = lps[match_idx - 1]\n    if text[i] == pattern[match_idx]:\n        if match_idx == p_len - 1:\n            matches.append(i - p_len + 2)\n            match_idx = lps[match_idx]\n        else:\n            match_idx += 1\n\nprint(len(matches))\nfor m in matches:\n    print(m, end=' ')\n"
      }
    ]
  },
  {
    "folderName": "백트래킹",
    "files": [
      {
        "fileName": "순열.py",
        "content": "'''\n백트래킹 (Backtracking) - 순열\n재귀를 통해 조건을 만족하는 모든 조합을 찾는 알고리즘입니다. (순서가 있는 나열)\nN개의 숫자 중 M개를 고르는 모든 경우의 수를 반환합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\ndef dfs(depth, n, m, arr, visited, result):\n    if depth == m:\n        print(' '.join(map(str, result)))\n        return\n\n    for i in range(n):\n        if not visited[i]:\n            visited[i] = True\n            result.append(arr[i])\n            dfs(depth + 1, n, m, arr, visited, result)\n            result.pop()\n            visited[i] = False\n\nn, m = map(int, sys.stdin.readline().split())\narr = list(map(int, sys.stdin.readline().split()))\nvisited = [False] * n\nresult = []\n\ndfs(0, n, m, arr, visited, result)\n"
      }
    ]
  },
  {
    "folderName": "세그먼트_트리",
    "files": [
      {
        "fileName": "세그먼트트리.py",
        "content": "'''\n세그먼트 트리 (Segment Tree)\n\n[작동 원리]\n어떤 배열에서 '특정 구간의 데이터 합/최솟값/최댓값' 등을 구하는 쿼리가 매우 잦고, 동시에 '배열의 특정 요소 값이 변경'되는 업데이트 쿼리 또한 잦을 때 사용하는 고급 자료구조입니다.\n루트 노드가 전체 구간을 담당하고 자식 노드들이 반씩 구간을 나누어 가지는 이진 트리 형태입니다.\n단순 배열로 하면 합을 구하는 데 O(N), 요소를 바꾸는 데 O(1)이 걸리지만, 세그먼트 트리를 사용하면 합치기와 변경 모두 빠르게 수행할 수 있습니다.\n\n[시간 복잡도]\n트리 초기화 O(N), 쿼리당 O(log N), 업데이트 O(log N)\n\n[입력 예시]\n5 2 2\n1\n2\n3\n4\n5\n1 3 6\n2 2 5\n1 5 2\n2 3 5\n\n[출력 예시]\n17\n12\n'''\nimport sys\n\nclass SegTree:\n    def __init__(self, data, n):\n        self.n = n\n        self.tree = [0] * (2 * self.n)\n        for i in range(self.n):\n            self.tree[self.n + i] = data[i]\n        for i in range(self.n - 1, 0, -1):\n            self.tree[i] = self.tree[i * 2] + self.tree[i * 2 + 1]\n\n    def update(self, i, val):\n        i += self.n\n        self.tree[i] = val\n        while i > 1:\n            if i % 2 == 0:\n                self.tree[i // 2] = self.tree[i] + self.tree[i + 1]\n            else:\n                self.tree[i // 2] = self.tree[i - 1] + self.tree[i]\n            i //= 1\n\n    def query(self, l, r):\n        res = 0\n        l += self.n\n        r += self.n\n        while l < r:\n            if l % 2 == 1:\n                res += self.tree[l]\n                l += 1\n            if r % 2 == 1:\n                r -= 1\n                res += self.tree[r]\n            l //= 2\n            r //= 2\n        return res\n\ninput_data = sys.stdin.read().split()\nif input_data:\n    n = int(input_data[0])\n    arr = list(map(int, input_data[1:n+1]))\n    st = SegTree(arr, n)\n"
      }
    ]
  },
  {
    "folderName": "수학",
    "files": [
      {
        "fileName": "에라토스테네스의체.py",
        "content": "'''\n에라토스테네스의 체 (Sieve of Eratosthenes)\n\n[작동 원리]\n대량의 숫자 범위 내에서 소수(Prime Number)를 한꺼번에 구하고자 할 때 사용하는 고속 알고리즘입니다.\n마치 체로 치듯이 합성수를 걸러낸다는 의미가 있습니다.\n2부터 시작해 특정 수의 배수들을 전부 지우는 방식으로 진행되며, 어떤 수 N까지 소수를 판별할 때는 N의 제곱근까지만 판별해도 충분하다는 수학적 정리를 이용하여 최적화합니다.\n\n[시간 복잡도]\nO(N log(log N))\n\n[입력 예시]\n3 16\n\n[출력 예시]\n3\n5\n7\n11\n13\n'''\nimport sys\nimport math\n\nn = int(sys.stdin.readline())\n\nprimes = [True] * (n + 1)\nprimes[0] = False\nprimes[1] = False\n\nfor i in range(2, int(math.sqrt(n)) + 1):\n    if primes[i]:\n        j = 2\n        while i * j <= n:\n            primes[i * j] = False\n            j += 1\n\nresult = [i for i in range(2, n + 1) if primes[i]]\n\nprint(len(result))\nfor p in result:\n    print(p, end=' ')\n"
      },
      {
        "fileName": "유클리드호제법.py",
        "content": "'''\n유클리드 호제법 (Euclidean Algorithm)\n\n[작동 원리]\n두 정수의 최대공약수(GCD)를 로그 시간 내에 빠르게 구하는 고전적인 수학 알고리즘입니다.\n`A`를 `B`로 나눈 나머지를 `R`이라고 할 때, `A`와 `B`의 최대공약수는 `B`와 `R`의 최대공약수와 동일하다는 원리를 이용합니다.\n재귀나 반복문을 통해 나머지가 0이 될 때까지 `A = B`, `B = R`로 값을 넘겨주면서 몫을 계산합니다.\n최소공배수(LCM)는 두 수의 곱을 이 GCD로 나누어 구합니다.\n\n[시간 복잡도]\nO(log(min(A, B)))\n\n[입력 예시]\n24 18\n\n[출력 예시]\n6\n72\n'''\nimport sys\n\ndef gcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n\ndef lcm(a, b, g):\n    return (a * b) // g\n\na, b = map(int, sys.stdin.readline().split())\n\ng = gcd(a, b)\nl = lcm(a, b, g)\n\nprint(g)\nprint(l)\n"
      }
    ]
  },
  {
    "folderName": "이분_탐색",
    "files": [
      {
        "fileName": "Lower_Upper_Bound.py",
        "content": "'''\nLower Bound & Upper Bound (이분 탐색)\n정렬된 배열에서 특정 값 이상이 처음 나오는 위치(Lower Bound)와, 특정 값을 초과하는 값이 처음 나오는 위치(Upper Bound)를 찾는 알고리즘입니다.\n특정 범위 내에 속하는 원소의 개수를 빠르게 O(log N) 시간에 구할 때 주로 사용합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\nimport bisect\n\nn, target = map(int, sys.stdin.readline().split())\narr = list(map(int, sys.stdin.readline().split()))\n\ndef get_lower_bound(array, value):\n    start = 0\n    end = len(array)\n    while start < end:\n        mid = (start + end) // 2\n        if array[mid] >= value:\n            end = mid\n        else:\n            start = mid + 1\n    return start\n\ndef get_upper_bound(array, value):\n    start = 0\n    end = len(array)\n    while start < end:\n        mid = (start + end) // 2\n        if array[mid] > value:\n            end = mid\n        else:\n            start = mid + 1\n    return start\n\nlower = get_lower_bound(arr, target)\nupper = get_upper_bound(arr, target)\ncount = upper - lower\n\nprint(lower)\nprint(upper)\nprint(count)\n"
      },
      {
        "fileName": "이진탐색.py",
        "content": "'''\n이진 탐색 (Binary Search)\n정렬된 배열 내에서 찾아야 할 값을 반으로 나누어가며 탐색하는 알고리즘.\n시간 복잡도: O(log N)\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\ndef binary_search(array, target, start, end):\n    while start <= end:\n        mid = (start + end) // 2\n        if array[mid] == target:\n            return mid\n        elif array[mid] > target:\n            end = mid - 1\n        else:\n            start = mid + 1\n    return None\n\nn, target = map(int, sys.stdin.readline().split())\narray = list(map(int, sys.stdin.readline().split()))\n\nresult = binary_search(array, target, 0, n - 1)\nif result == None:\n    print(\"Not Found\")\nelse:\n    print(result + 1)\n"
      },
      {
        "fileName": "파라메트릭서치.py",
        "content": "'''\n파라메트릭 서치 (Parametric Search) - 이분 탐색 응용\n최적화 문제(예: \"조건을 만족하는 가장 큰 값을 구하시오\")를 결정 문제(예: \"이 값이 조건을 만족하는가?\")로 바꾸어 이분 탐색을 통해 해결하는 알고리즘입니다.\n주로 길이나 무게 등의 최댓값/최솟값을 구할 때 많이 쓰입니다. (예: 나무 자르기, 랜선 자르기)\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\nn, m = map(int, sys.stdin.readline().split())\narr = list(map(int, sys.stdin.readline().split()))\n\nstart = 0\nend = max(arr)\n\nresult = 0\n\nwhile start <= end:\n    mid = (start + end) // 2\n    \n    total = 0\n    for x in arr:\n        if x > mid:\n            total += x - mid\n            \n    if total < m:\n        end = mid - 1\n    else:\n        result = mid\n        start = mid + 1\n\nprint(result)\n"
      }
    ]
  },
  {
    "folderName": "자료구조",
    "files": [
      {
        "fileName": "괄호검사.py",
        "content": "'''\n스택 활용: 괄호 검사 (Valid Parentheses)\n문자열에 포함된 괄호 '()', '{}', '[]' 등의 짝이 올바르게 맞는지 쌍을 검사하는 알고리즘.\n여는 괄호는 스택에 넣고, 닫는 괄호가 나오면 스택의 Top과 짝이 맞는지 확인하며 Pop합니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\n\ns = sys.stdin.readline().strip()\nstack = []\nis_valid = True\n\npair = {')': '(', '}': '{', ']': '['}\n\nfor char in s:\n    if char in \"({[\":\n        stack.append(char)\n    elif char in \")}]\":\n        if not stack:\n            is_valid = False\n            break\n        top = stack.pop()\n        if pair[char] != top:\n            is_valid = False\n            break\n\nif stack:\n    is_valid = False\n\nif is_valid:\n    print(\"YES\")\nelse:\n    print(\"NO\")\n"
      },
      {
        "fileName": "유니온파인드.py",
        "content": "'''\n분리 집합 / 유니온 파인드 (Disjoint Set / Union-Find)\n\n[작동 원리]\n서로 중복되지 않는 부분 집합들을 표현할 때 사용하는 자료구조로, 노드들이 같은 집합에 속해 있는지를 확인하거나 두 집합을 하나로 합치는 연산을 수행합니다.\n- `Find`: 해당 노드의 최상위 부모(루트) 노드를 찾으며 이 과정에서 경로 압축(Path Compression)을 통해 트리의 높이를 평평하게 만듭니다.\n- `Union`: 두 노드의 트리를 하나로 연결하며, 랭크나 크기 최적화를 통해 작은 트리를 큰 트리에 붙입니다.\n\n[시간 복잡도]\n실질적으로 O(1) (엄밀히는 아커만 함수의 역함수 알파(N))\n\n[입력 예시]\n7 4\n0 1 3\n1 1 7\n0 7 6\n1 7 1\n\n[출력 예시]\nNO\nYES\n'''\nimport sys\n\ndef find_parent(parent, x):\n    if parent[x] != x:\n        parent[x] = find_parent(parent, parent[x])\n    return parent[x]\n\ndef union_parent(parent, a, b):\n    a = find_parent(parent, a)\n    b = find_parent(parent, b)\n    if a < b:\n        parent[b] = a\n    else:\n        parent[a] = b\n\nv, e = map(int, sys.stdin.readline().split())\nparent = [0] * (v + 1)\n\nfor i in range(1, v + 1):\n    parent[i] = i\n\ncycle = False\nfor _ in range(e):\n    a, b = map(int, sys.stdin.readline().split())\n    if find_parent(parent, a) == find_parent(parent, b):\n        cycle = True\n        break\n    else:\n        union_parent(parent, a, b)\n\nif cycle:\n    print(\"Cycle Exists\")\nelse:\n    print(\"No Cycle\")\n"
      }
    ]
  },
  {
    "folderName": "최단_경로",
    "files": [
      {
        "fileName": "다익스트라.py",
        "content": "'''\n다익스트라 알고리즘 (Dijkstra's Algorithm)\n\n[작동 원리]\n하나의 시작 정점으로부터 다른 모든 정점까지의 가장 짧은 경로를 구하는 최단 경로 알고리즘입니다.\n음의 간선이 없을 때만 사용 가능합니다.\n우선순위 큐(Min Heap)를 사용하여 현재 방문한 정점들 중 가장 비용이 적은 정점을 꺼내고, 그 정점을 거쳐서 가는 경로가 기존 경로보다 더 짧다면 비용 배열을 갱신하는 그리디(Greedy) 방식입니다.\n\n[시간 복잡도]\nO(E log V) (E: 간선의 수, V: 정점의 수)\n\n[입력 예시]\n5 6\n1\n1 2 2\n1 3 3\n2 3 4\n2 4 5\n3 4 6\n5 1 1\n\n[출력 예시]\n0\n2\n3\n7\nINF\n'''\nimport heapq\nimport sys\n\nINF = int(1e9)\n\ndef dijkstra(start, graph, distance):\n    q = []\n    heapq.heappush(q, (0, start))\n    distance[start] = 0\n    while q:\n        dist, now = heapq.heappop(q)\n        if distance[now] < dist:\n            continue\n        for i in graph[now]:\n            cost = dist + i[1]\n            if cost < distance[i[0]]:\n                distance[i[0]] = cost\n                heapq.heappush(q, (cost, i[0]))\n\nn, m = map(int, sys.stdin.readline().split())\nstart = int(sys.stdin.readline())\ngraph = [[] for _ in range(n + 1)]\ndistance = [INF] * (n + 1)\n\nfor _ in range(m):\n    a, b, c = map(int, sys.stdin.readline().split())\n    graph[a].append((b, c))\n\ndijkstra(start, graph, distance)\n\nfor i in range(1, n + 1):\n    if distance[i] == INF:\n        print(\"INF\")\n    else:\n        print(distance[i])\n"
      },
      {
        "fileName": "플로이드워셜.py",
        "content": "'''\n플로이드 워셜 알고리즘 (Floyd-Warshall Algorithm)\n\n[작동 원리]\n동적 계획법을 이용하여 '모든 정점에서 모든 정점으로'의 최단 경로를 구하는 알고리즘입니다.\n3중 for문을 돌며, `정점 i에서 정점 j로 가는 거리`와 `정점 i에서 정점 k를 거쳐 정점 j로 가는 거리`를 비교하여 최적화합니다.\n노드 개수가 적을 때(일반적으로 V <= 500) 유용하며, 음의 가중치를 가진 간선이 있어도 사용할 수 있으나 음의 사이클이 없어야 합니다.\n\n[시간 복잡도]\nO(V^3)\n\n[입력 예시]\n5\n14\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n3 5 10\n3 1 8\n1 4 2\n5 1 7\n3 4 2\n5 2 4\n\n[출력 예시]\n0 2 3 1 4\n12 0 15 2 5\n8 5 0 1 1\n10 7 13 0 3\n7 4 10 6 0\n'''\nimport sys\n\nINF = int(1e9)\n\nn = int(sys.stdin.readline())\nm = int(sys.stdin.readline())\n\ngraph = [[INF] * (n + 1) for _ in range(n + 1)]\n\nfor a in range(1, n + 1):\n    for b in range(1, n + 1):\n        if a == b:\n            graph[a][b] = 0\n\nfor _ in range(m):\n    a, b, c = map(int, sys.stdin.readline().split())\n    graph[a][b] = c\n\nfor k in range(1, n + 1):\n    for a in range(1, n + 1):\n        for b in range(1, n + 1):\n            graph[a][b] = min(graph[a][b], graph[a][k] + graph[k][b])\n\nfor a in range(1, n + 1):\n    for b in range(1, n + 1):\n        if graph[a][b] == INF:\n            print(\"INF\", end=\" \")\n        else:\n            print(graph[a][b], end=\" \")\n    print()\n"
      }
    ]
  },
  {
    "folderName": "투_포인터",
    "files": [
      {
        "fileName": "투포인터.py",
        "content": "'''\n투 포인터 (Two Pointers)\n주로 정렬되어 있거나 연속된 특정 구간을 처리할 때 사용하는 테크닉입니다. 두 개의 포인터를 조작하여 원하는 결과를 얻습니다.\n리스트에서 2개의 점(위치)을 이용해 특정 조건을 만족하는 구간을 구합니다.\n시간 복잡도: O(N)\n\n[입력 예시]\n5 5\n1 2 3 2 5\n\n[출력 예시]\n3\n'''\nimport sys\n\nn, m = map(int, sys.stdin.readline().split())\ndata = list(map(int, sys.stdin.readline().split()))\n\ncount = 0\ninterval_sum = 0\nend = 0\n\nfor start in range(n):\n    while interval_sum < m and end < n:\n        interval_sum += data[end]\n        end += 1\n    \n    if interval_sum == m:\n        count += 1\n    \n    interval_sum -= data[start]\n\nprint(count)\n"
      }
    ]
  },
  {
    "folderName": "트리",
    "files": [
      {
        "fileName": "트리_순회.py",
        "content": "'''\n트리 순회 (Tree Traversal)\n이진 트리에서 전위 순회(Preorder), 중위 순회(Inorder), 후위 순회(Postorder)를 구현한 알고리즘입니다.\n루트 노드 방문 순서에 따라 이름이 결정되며, 재귀를 통해 깔끔하게 구현됩니다.\n\n[입력 예시]\n7\nA B C\nB D .\nC E F\nE . .\nF . G\nD . .\nG . .\n\n[출력 예시]\nABDCEFG\nDBAECFG\nDBEGFCA\n'''\nimport sys\n\nn = int(sys.stdin.readline())\ntree = {}\n\nfor _ in range(n):\n    node, left, right = sys.stdin.readline().split()\n    tree[node] = (left, right)\n\ndef preorder(node):\n    if node == '.':\n        return\n    print(node, end='')\n    preorder(tree[node][0])\n    preorder(tree[node][1])\n\ndef inorder(node):\n    if node == '.':\n        return\n    inorder(tree[node][0])\n    print(node, end='')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == '.':\n        return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end='')\n\npreorder('A')\nprint()\ninorder('A')\nprint()\npostorder('A')\nprint()\n"
      },
      {
        "fileName": "트리의_지름.py",
        "content": "'''\n트리의 지름 (Diameter of a Tree)\n트리에서 가장 멀리 떨어진 두 노드 사이의 거리(지름)를 구하는 알고리즘.\n원리:\n임의의 노드(보통 1번)에서 가장 먼 노드 A를 찾고, A에서 가장 먼 노드 B를 찾으면 A와 B 사이의 거리가 트리의 지름이 됩니다.\n\n[입력 예시]\n5 3\n1 2\n2 3\n3 4\n4 5\n\n[출력 예시]\n1\n2\n3 4 5\n'''\nimport sys\nfrom collections import deque\n\nv = int(sys.stdin.readline())\ngraph = [[] for _ in range(v + 1)]\n\nfor _ in range(v):\n    data = list(map(int, sys.stdin.readline().split()))\n    node = data[0]\n    idx = 1\n    while data[idx] != -1:\n        adj, dist = data[idx], data[idx + 1]\n        graph[node].append((adj, dist))\n        idx += 2\n\ndef bfs(start):\n    visited = [-1] * (v + 1)\n    queue = deque()\n    queue.append(start)\n    visited[start] = 0\n    \n    max_dist = 0\n    farthest_node = start\n    \n    while queue:\n        curr = queue.popleft()\n        \n        for adj, dist in graph[curr]:\n            if visited[adj] == -1:\n                visited[adj] = visited[curr] + dist\n                queue.append(adj)\n                if visited[adj] > max_dist:\n                    max_dist = visited[adj]\n                    farthest_node = adj\n                    \n    return farthest_node, max_dist\n\nnode_a, _ = bfs(1)\n_, diameter = bfs(node_a)\n\nprint(diameter)\n"
      }
    ]
  }
];