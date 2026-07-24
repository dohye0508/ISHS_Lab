<?php
/**
 * User Log Dashboard
 * Displays all registered users and their details.
 * Admin can change user roles.
 */
session_start();
require_once 'db_config.php';

// Access Control: Only admin or sub_admin can view this page
$current_role = $_SESSION['role'] ?? '';
$is_admin = ($current_role === 'admin');
$is_sub_admin = ($current_role === 'sub_admin');

if (!$is_admin && !$is_sub_admin) {
    exit(); // Just show a blank screen as requested
}

// Fetch users
try {
    // Try to auto-create last_active column if missing
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN last_active DATETIME NULL");
    } catch (PDOException $e) {
        // likely already exists
    }

    $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    die(""); // Silent error for database issues as well
}

$current_user_id = $_SESSION['user_id'] ?? -1;
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Log</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?php echo time(); ?>">
    <style>
        .log-container {
            width: 95%;
            max-width: 1400px;
            margin: 40px auto;
            background: rgba(var(--surface-rgb, 255, 255, 255), 0.7);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 30px;
            border: 1px solid var(--border);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border);
        }

        .log-title {
            font-size: 1.8rem;
            font-weight: 800;
            background: linear-gradient(45deg, #1a73e8, #8e44ad);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .table-wrapper {
            overflow-x: auto;
            border-radius: 12px;
            border: 1px solid var(--border);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            background: var(--surface);
        }

        th {
            background: rgba(var(--primary-rgb, 26, 115, 232), 0.1);
            color: var(--primary);
            text-align: left;
            padding: 15px;
            font-weight: 700;
            white-space: nowrap;
        }

        td {
            padding: 12px 15px;
            border-bottom: 1px solid var(--border);
            color: var(--text);
            vertical-align: middle;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: rgba(var(--primary-rgb, 26, 115, 232), 0.03);
        }

        tr.banned-row td {
            opacity: 0.45;
        }

        .role-badge {
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        .role-admin     { background: #ea4335; color: white; }
        .role-sub_admin { background: #f29900; color: white; }
        .role-user      { background: #eee; color: #666; }
        .role-banned    { background: #333; color: #ff6b6b; }

        /* Role selector dropdown — only visible to admin */
        .role-select {
            appearance: none;
            -webkit-appearance: none;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 5px 28px 5px 10px;
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--text);
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 8px center;
            transition: border-color 0.2s, box-shadow 0.2s;
            min-width: 100px;
        }
        .role-select:hover { border-color: var(--primary); }
        .role-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(var(--primary-rgb),0.25); }

        .role-select option[value="admin"]     { color: #ea4335; font-weight: 800; }
        .role-select option[value="sub_admin"] { color: #f29900; font-weight: 800; }
        .role-select option[value="user"]      { color: #555; }
        .role-select option[value="banned"]    { color: #e53935; }

        /* Toast notification */
        #toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #323232;
            color: #fff;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 9999;
            pointer-events: none;
        }
        #toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        #toast.success { background: #1e8e3e; }
        #toast.error   { background: #c62828; }

        [data-theme="dark"] .log-container {
            background: rgba(30, 31, 34, 0.8);
        }
        [data-theme="dark"] .role-select {
            background-color: #2a2a2a;
        }
    </style>
</head>

<body>
    <div id="toast"></div>

    <div class="log-container">
        <div class="log-header">
            <h1 class="log-title">User Account Logs</h1>
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="badge progress">Total: <?php echo count($users); ?>명</div>
                <?php if ($is_admin): ?>
                <span style="font-size:0.8rem; opacity:0.5;">드롭다운으로 역할 변경 가능</span>
                <?php endif; ?>
            </div>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>역할 (Role)</th>
                        <th>닉네임</th>
                        <th>이름</th>
                        <th>학교</th>
                        <th>학년</th>
                        <th>기수</th>
                        <th>리로 ID</th>
                        <th>유형</th>
                        <th>가입일</th>
                        <th>최근 활동</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($users)): ?>
                        <tr>
                            <td colspan="11" style="text-align: center; padding: 40px; opacity: 0.5;">가입된 사용자가 없습니다.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($users as $user): ?>
                            <?php
                                $uid    = $user['id'];
                                $urole  = $user['role'] ?? 'user';
                                $isSelf = ($uid == $current_user_id);
                            ?>
                            <tr id="row-<?php echo $uid; ?>" class="<?php echo ($urole === 'banned') ? 'banned-row' : ''; ?>">
                                <td><?php echo $uid; ?></td>
                                <td>
                                    <?php if ($is_admin && !$isSelf): ?>
                                        <!-- Admin: editable dropdown -->
                                        <select
                                            class="role-select"
                                            data-uid="<?php echo $uid; ?>"
                                            onchange="updateRole(this)"
                                        >
                                            <?php foreach (['admin','sub_admin','user','banned'] as $r): ?>
                                                <option value="<?php echo $r; ?>" <?php echo ($urole === $r) ? 'selected' : ''; ?>>
                                                    <?php echo strtoupper($r); ?>
                                                </option>
                                            <?php endforeach; ?>
                                        </select>
                                    <?php else: ?>
                                        <!-- Non-admin or self: just show badge -->
                                        <span class="role-badge role-<?php echo htmlspecialchars($urole); ?>" id="badge-<?php echo $uid; ?>">
                                            <?php echo htmlspecialchars($urole); ?>
                                        </span>
                                    <?php endif; ?>
                                </td>
                                <td style="font-weight: 700;">
                                    <?php echo htmlspecialchars($user['nickname']); ?>
                                    <?php if ($isSelf): ?><span style="font-size:0.7rem; opacity:0.4; margin-left:4px;">(나)</span><?php endif; ?>
                                </td>
                                <td><?php echo htmlspecialchars($user['riro_name']); ?></td>
                                <td><?php echo htmlspecialchars($user['school_name'] ?? '-'); ?></td>
                                <td><?php echo $user['grade'] ? $user['grade'] . '학년' : '-'; ?></td>
                                <td><?php echo $user['generation']; ?>기</td>
                                <td style="opacity: 0.6; font-size: 0.8rem;"><?php echo htmlspecialchars($user['username']); ?></td>
                                <td><span class="badge-type"><?php echo htmlspecialchars($user['student_type']); ?></span></td>
                                <td style="font-size: 0.8rem; opacity: 0.7;"><?php echo $user['created_at']; ?></td>
                                <td style="font-size: 0.8rem; font-weight: 600; color: #1a73e8;"><?php echo $user['last_active'] ?? '-'; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <div style="margin-top: 20px; text-align: right;">
            <a href="index.php" class="btn secondary" style="text-decoration: none; font-size: 0.85rem;">← Back to Home</a>
        </div>
    </div>

    <?php if ($is_admin): ?>
    <script>
        const ROLE_COLORS = {
            admin:     '#ea4335',
            sub_admin: '#f29900',
            user:      '#888',
            banned:    '#e53935'
        };

        function showToast(msg, type = 'success') {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.className = 'show ' + type;
            setTimeout(() => { t.className = ''; }, 2800);
        }

        async function updateRole(selectEl) {
            const uid     = selectEl.dataset.uid;
            const newRole = selectEl.value;

            // Optimistically update row appearance
            const row = document.getElementById('row-' + uid);
            row.classList.toggle('banned-row', newRole === 'banned');

            try {
                const res = await fetch('api/user_system.php?action=update_role', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: parseInt(uid), role: newRole })
                });
                const data = await res.json();

                if (data.status === 'success') {
                    showToast(`✅ ID ${uid} → ${newRole.toUpperCase()} 변경 완료`, 'success');
                } else {
                    showToast('❌ ' + (data.message || '오류 발생'), 'error');
                    // Revert on failure
                    location.reload();
                }
            } catch (e) {
                showToast('❌ 네트워크 오류', 'error');
                location.reload();
            }
        }
    </script>
    <?php endif; ?>
</body>

</html>