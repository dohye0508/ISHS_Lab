<?php
/**
 * ISHS Lab - Coding Test Viewer
 * 파이썬 핵심 알고리즘 라이브러리 및 코드 뷰어
 */
?>
<!DOCTYPE html>
<html lang="ko" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Algorithm Coding Test Viewer</title>
    <!-- Google Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet">
    <!-- Highlight.js Themes -->
    <link id="hljs-theme-dark" rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
    <link id="hljs-theme-light" rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-light.min.css" disabled>

    <script>
        (function() {
            var theme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>

    <style>
        :root[data-theme="dark"] {
            --bg-color: #0f111a;
            --sidebar-bg: rgba(21, 24, 34, 0.7);
            --content-bg: #151822;
            --text-main: #e2e8f0;
            --text-muted: #94a3b8;
            --accent-color: #6366f1;
            --accent-hover: #818cf8;
            --folder-color: #38bdf8;
            --border-color: rgba(255, 255, 255, 0.08);
            --glass-blur: 12px;
            --pre-bg: #1e212b;
            --doc-bg: rgba(30, 33, 43, 0.6);
            --io-bg: rgba(99, 102, 241, 0.1);
            --io-border: rgba(99, 102, 241, 0.2);
            --shadow-color: rgba(0, 0, 0, 0.2);
        }

        :root[data-theme="light"] {
            --bg-color: #f8fafc;
            --sidebar-bg: rgba(255, 255, 255, 0.8);
            --content-bg: #ffffff;
            --text-main: #0f172a;
            --text-muted: #1e293b; /* DARKENED for better contrast */
            --accent-color: #4f46e5;
            --accent-hover: #4338ca;
            --folder-color: #0284c7;
            --border-color: rgba(0, 0, 0, 0.12);
            --glass-blur: 12px;
            --pre-bg: #f8fafc;
            --doc-bg: #ffffff;
            --io-bg: #f1f5f9;
            --io-border: rgba(79, 70, 229, 0.2);
            --shadow-color: rgba(0, 0, 0, 0.08);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            background-image:
                radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(56, 189, 248, 0.08), transparent 25%);
            color: var(--text-main);
            display: flex;
            height: 100vh;
            overflow: hidden;
            line-height: 1.6;
        }

        .sidebar {
            width: 300px;
            min-width: 300px;
            background: var(--sidebar-bg);
            backdrop-filter: blur(var(--glass-blur));
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            padding: 1.5rem 0;
            overflow-y: auto;
            z-index: 10;
            box-shadow: 4px 0 24px var(--shadow-color);
            transition: transform 0.3s ease, width 0.3s ease, min-width 0.3s ease;
        }

        .sidebar.collapsed {
            transform: translateX(-100%);
            width: 0;
            min-width: 0;
            padding: 0;
            border: none;
        }

        /* Handle Style Sidebar Toggle - Attached to the right edge */
        #sidebar-toggle {
            position: absolute;
            right: -14px;
            top: 50%;
            transform: translateY(-50%);
            width: 28px;
            height: 56px;
            background: var(--accent-color);
            color: white;
            z-index: 2000;
            border: none;
            border-radius: 0 12px 12px 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
        }

        #sidebar-toggle:hover {
            width: 34px;
            right: -20px;
            background: var(--accent-hover);
        }

        #sidebar-toggle svg {
            transition: transform 0.4s;
            margin-left: 2px;
        }

        .sidebar.collapsed #sidebar-toggle svg {
            transform: rotate(180deg);
        }

        /* Update home button to avoid conflict */
        .home-btn-global {
            position: fixed;
            top: 15px;
            left: 15px;
            width: 36px;
            height: 36px;
            background: var(--sidebar-bg);
            backdrop-filter: blur(10px);
            color: var(--text-main);
            z-index: 2000;
            border: 1px solid var(--border-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 4px 12px var(--shadow-color);
        }

        .sidebar-header {
            padding: 60px 1.5rem 1.5rem; /* ADDED top padding for home button */
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 1rem;
        }

        .sidebar-header h1 {
            font-size: 1.25rem;
            font-weight: 700;
            background: linear-gradient(to right, var(--accent-hover), var(--folder-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        .folder {
            margin-bottom: 0.5rem;
        }

        .folder-name {
            padding: 0.6rem 1.5rem;
            font-weight: 600;
            color: var(--folder-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            user-select: none;
            font-size: 0.9rem;
        }

        .folder-name:hover {
            background: rgba(128, 128, 128, 0.05);
        }

        .folder-name::before {
            content: '📂';
            margin-right: 8px;
            font-size: 1.1rem;
        }

        .file-list {
            list-style: none;
            display: none;
            padding-bottom: 0.5rem;
        }

        .file-list.active {
            display: block;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .file-item {
            padding: 0.5rem 1.5rem 0.5rem 2.8rem;
            font-size: 0.85rem;
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .file-item::before {
            content: '📄';
            margin-right: 6px;
            font-size: 0.9rem;
            opacity: 0.7;
        }

        .file-item:hover {
            color: var(--text-main);
            background: rgba(128, 128, 128, 0.05);
        }

        .file-item.selected {
            color: var(--text-main);
            background: var(--io-bg);
            border-left: 3px solid var(--accent-color);
            padding-left: calc(2.8rem - 3px);
            font-weight: 600;
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-color: var(--content-bg);
            position: relative;
            overflow: hidden;
        }

        .topbar {
            height: 60px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            background: var(--sidebar-bg);
            backdrop-filter: blur(10px);
            z-index: 5;
        }

        .current-file-path {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .current-file-path span {
            color: var(--text-main);
            font-weight: 600;
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .icon-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            border-radius: 8px;
        }

        .icon-btn:hover {
            background: rgba(128, 128, 128, 0.1);
            color: var(--text-main);
        }

        .copy-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 100;
            background: rgba(128, 128, 128, 0.1);
            backdrop-filter: blur(8px);
            color: var(--text-muted);
            border: 1px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .copy-btn:hover {
            background: var(--accent-color);
            color: white;
            border-color: var(--accent-color);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
        }

        .copy-btn svg {
            transition: transform 0.2s;
        }

        .copy-btn:active svg {
            transform: scale(0.8);
        }

        .code-container {
            flex: 1;
            overflow: auto;
            padding: 1.5rem 2rem;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        /* Docstring Styling */
        .docstring-block {
            background: var(--doc-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color);
            display: none;
        }

        .docstring-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: var(--text-main);
        }

        .docstring-desc {
            font-size: 0.95rem;
            color: var(--text-muted);
            margin-bottom: 1.5rem;
            white-space: pre-wrap;
        }

        .io-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .io-card {
            background: var(--io-bg);
            border: 1px solid var(--io-border);
            border-radius: 8px;
            padding: 1rem;
        }

        .io-title {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
            color: var(--accent-color);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .io-content {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: var(--text-main);
            white-space: pre-wrap;
            word-break: break-all;
        }

        /* Code Block Styling */
        pre {
            margin: 0;
            border-radius: 12px;
            background: var(--pre-bg) !important;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 6px -1px var(--shadow-color);
            flex-shrink: 0;
        }

        code {
            font-family: 'JetBrains Mono', monospace !important;
            font-size: 0.9rem;
            padding: 1.5rem !important;
            background: transparent !important;
        }

        /* Empty State */
        .empty-state {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: var(--text-muted);
        }

        .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(128, 128, 128, 0.2);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(128, 128, 128, 0.4);
        }
    </style>
</head>

<body>

    <!-- Go Home Button (Back Arrow) -->
    <a href="index.php" class="home-btn-global" aria-label="Go Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    </a>
    <style>
        .home-btn-global {
            position: fixed;
            top: 12px;
            left: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: var(--text-main);
            opacity: 0.8;
            transition: all 0.2s;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100; /* Higher than sidebar */
            border: 1px solid var(--border-color);
        }
        .home-btn-global:hover {
            opacity: 1;
            background: var(--io-bg);
            transform: scale(1.1);
        }
    </style>

    <aside class="sidebar">
        <!-- New Handle-style Toggle attached to edge -->
        <button id="sidebar-toggle" title="Toggle Sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <div class="sidebar-header">
            <h1>Algorithms</h1>
        </div>
        <div id="file-tree"></div>
    </aside>

    <main class="main-content">
        <div class="topbar">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="current-file-path" id="file-path">파일을 선택해주세요</div>
            </div>
            <div class="topbar-actions">
                <button class="icon-btn" id="theme-toggle" title="Toggle Theme">
                    <svg id="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    </svg>
                </button>
            </div>
        </div>
        <div class="code-container" id="code-container">
            <div class="empty-state" id="empty-state">
                <div class="empty-icon">⌨️</div>
                <h2 style="color: var(--text-main); font-weight: 600; margin-bottom: 0.5rem;">코딩 테스트 템플릿 뷰어</h2>
                <p>왼쪽 트리에서 파일을 선택하여 확인하세요.</p>
            </div>

            <div class="docstring-block" id="docstring-block">
                <div class="docstring-title" id="doc-title"></div>
                <div class="docstring-desc" id="doc-desc"></div>
                <div class="io-container">
                    <div class="io-card" id="io-in-card" style="display: none;">
                        <div class="io-title">📥 입력 예시</div>
                        <div class="io-content" id="io-in"></div>
                    </div>
                    <div class="io-card" id="io-out-card" style="display: none;">
                        <div class="io-title">📤 출력 예시</div>
                        <div class="io-content" id="io-out"></div>
                    </div>
                </div>
            </div>

            <div class="code-wrapper">
                <button class="copy-btn" id="copy-btn" style="display: none;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Code
                </button>
                <pre style="display: none;" id="code-block"><code class="language-python" id="code-display"></code></pre>
            </div>
        </div>
    </main>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/languages/python.min.js"></script>
    <script src="data/algorithms/data.js?v=<?php echo time(); ?>"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const htmlEl = document.documentElement;
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const hljsDark = document.getElementById('hljs-theme-dark');
            const hljsLight = document.getElementById('hljs-theme-light');

            const icons = {
                moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
                sun: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
            };

            // Sidebar Toggle
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggleBtn = document.getElementById('sidebar-toggle');

            sidebarToggleBtn.onclick = () => {
                sidebar.classList.toggle('collapsed');
            };

            // Initialize Theme
            const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
            let isDark = currentTheme === 'dark';
            
            function updateThemeUI() {
                if (isDark) {
                    htmlEl.setAttribute('data-theme', 'dark');
                    themeIcon.innerHTML = icons.sun;
                    hljsDark.disabled = false;
                    hljsLight.disabled = true;
                } else {
                    htmlEl.setAttribute('data-theme', 'light');
                    themeIcon.innerHTML = icons.moon;
                    hljsDark.disabled = true;
                    hljsLight.disabled = false;
                }
            }
            
            updateThemeUI(); // Initial set

            themeToggleBtn.onclick = () => {
                isDark = !isDark;
                updateThemeUI();
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            };

            const fileTreeEl = document.getElementById('file-tree');
            const codeDisplayEl = document.getElementById('code-display');
            const codeBlockEl = document.getElementById('code-block');
            const emptyStateEl = document.getElementById('empty-state');
            const filePathEl = document.getElementById('file-path');
            const copyBtn = document.getElementById('copy-btn');

            const docBlock = document.getElementById('docstring-block');
            const docTitle = document.getElementById('doc-title');
            const docDesc = document.getElementById('doc-desc');
            const ioInCard = document.getElementById('io-in-card');
            const ioOutCard = document.getElementById('io-out-card');
            const ioIn = document.getElementById('io-in');
            const ioOut = document.getElementById('io-out');

            let currentCode = '';

            if (typeof codeData === 'undefined') {
                fileTreeEl.innerHTML = '<div style="padding: 1rem; color: #ef4444;">데이터를 불러오지 못했습니다.<br>scripts/sync_algorithms.py를 실행하세요.</div>';
                return;
            }

            codeData.forEach((folderObj, folderIndex) => {
                const folderDiv = document.createElement('div');
                folderDiv.className = 'folder';

                const folderNameDiv = document.createElement('div');
                folderNameDiv.className = 'folder-name';
                folderNameDiv.textContent = folderObj.folderName;

                const fileListUl = document.createElement('ul');
                fileListUl.className = 'file-list';
                // Folder starts closed by default

                folderNameDiv.onclick = () => fileListUl.classList.toggle('active');

                folderObj.files.forEach(fileObj => {
                    const fileLi = document.createElement('li');
                    fileLi.className = 'file-item';
                    fileLi.textContent = fileObj.fileName;

                    fileLi.onclick = () => {
                        document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
                        fileLi.classList.add('selected');
                        parseAndShow(folderObj.folderName, fileObj.fileName, fileObj.content);
                    };

                    fileListUl.appendChild(fileLi);
                });

                folderDiv.appendChild(folderNameDiv);
                folderDiv.appendChild(fileListUl);
                fileTreeEl.appendChild(folderDiv);
            });

            function parseAndShow(folder, file, fullContent) {
                emptyStateEl.style.display = 'none';
                codeBlockEl.style.display = 'block';
                copyBtn.style.display = 'flex';
                filePathEl.innerHTML = `${folder} / <span>${file}</span>`;

                // Parse Docstring
                let docstring = "";
                let codeStr = fullContent;

                const docRegex = /^\s*(['"]{3})([\s\S]*?)\1\s*/;
                const match = fullContent.match(docRegex);

                if (match) {
                    docstring = match[2].trim();
                    codeStr = fullContent.substring(match[0].length).trim();
                }

                currentCode = codeStr;
                codeDisplayEl.textContent = codeStr;
                delete codeDisplayEl.dataset.highlighted;
                hljs.highlightElement(codeDisplayEl);

                if (!docstring) {
                    docBlock.style.display = 'none';
                    return;
                }

                docBlock.style.display = 'block';

                let title = file.replace('.py', '');
                let desc = "";
                let inExample = "";
                let outExample = "";

                const lines = docstring.split('\n');
                let currentSection = 'desc';

                title = lines[0].trim();

                for (let i = 1; i < lines.length; i++) {
                    const l = lines[i].trim();
                    if (l.includes('[입력 예시]') || l.includes('입력 예시:')) {
                        currentSection = 'in'; continue;
                    } else if (l.includes('[출력 예시]') || l.includes('출력 예시:')) {
                        currentSection = 'out'; continue;
                    }

                    if (currentSection === 'desc') desc += lines[i] + '\n';
                    else if (currentSection === 'in') inExample += lines[i] + '\n';
                    else if (currentSection === 'out') outExample += lines[i] + '\n';
                }

                docTitle.textContent = title;
                docDesc.textContent = desc.trim();

                inExample = inExample.trim();
                outExample = outExample.trim();

                if (inExample) {
                    ioInCard.style.display = 'block';
                    ioIn.textContent = inExample;
                } else {
                    ioInCard.style.display = 'none';
                }

                if (outExample) {
                    ioOutCard.style.display = 'block';
                    ioOut.textContent = outExample;
                } else {
                    ioOutCard.style.display = 'none';
                }
            }

            copyBtn.onclick = () => {
                navigator.clipboard.writeText(currentCode).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✅ Copied!';
                    setTimeout(() => copyBtn.innerHTML = originalText, 2000);
                });
            };
        });
    </script>
</body>

</html>
