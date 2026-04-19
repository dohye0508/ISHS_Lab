<?php
/**
 * User Log Dashboard
 * Displays all registered users and their details.
 */
session_start();
require_once 'db_config.php';

// Access Control: Only users with the 'admin' role can view this page
$is_admin = (isset($_SESSION['role']) && $_SESSION['role'] === 'admin');

if (!$is_admin) {
    exit(); // Just show a blank screen as requested
}

// Fetch users
try {
    $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    die(""); // Silent error for database issues as well
}
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
            max-width: 1300px;
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
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: rgba(var(--primary-rgb, 26, 115, 232), 0.03);
        }

        .role-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
        }
        .role-admin { background: #ea4335; color: white; }
        .role-user { background: #eee; color: #666; }

        [data-theme="dark"] .log-container {
            background: rgba(30, 31, 34, 0.8);
        }
    </style>
</head>

<body>
    <div class="log-container">
        <div class="log-header">
            <h1 class="log-title">User Account Logs</h1>
            <div class="badge progress">Total Users:
                <?php echo count($users); ?>
            </div>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Role</th>
                        <th>Nickname</th>
                        <th>Real Name</th>
                        <th>School</th>
                        <th>Grade</th>
                        <th>Student #</th>
                        <th>Gen</th>
                        <th>Username</th>
                        <th>Type</th>
                        <th>Joined At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($users)): ?>
                        <tr>
                            <td colspan="11" style="text-align: center; padding: 40px; opacity: 0.5;">가입된 사용자가 없습니다.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td>
                                    <?php echo $user['id']; ?>
                                </td>
                                <td>
                                    <span class="role-badge <?php echo ($user['role'] === 'admin') ? 'role-admin' : 'role-user'; ?>">
                                        <?php echo htmlspecialchars($user['role']); ?>
                                    </span>
                                </td>
                                <td style="font-weight: 700;">
                                    <?php echo htmlspecialchars($user['nickname']); ?>
                                </td>
                                <td>
                                    <?php echo htmlspecialchars($user['riro_name']); ?>
                                </td>
                                <td>
                                    <?php echo htmlspecialchars($user['school_name'] ?? '-'); ?>
                                </td>
                                <td>
                                    <?php echo $user['grade'] ? $user['grade'] . '학년' : '-'; ?>
                                </td>
                                <td>`
                                    <?php echo htmlspecialchars($user['student_number']); ?>`
                                </td>
                                <td>
                                    <?php echo $user['generation']; ?>기
                                </td>
                                <td style="opacity: 0.6; font-size: 0.8rem;">
                                    <?php echo htmlspecialchars($user['username']); ?>
                                </td>
                                <td><span class="badge-type">
                                        <?php echo htmlspecialchars($user['student_type']); ?>
                                    </span></td>
                                <td style="font-size: 0.8rem; opacity: 0.7;">
                                    <?php echo $user['created_at']; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <div style="margin-top: 20px; text-align: right;">
            <a href="index.php" class="btn secondary" style="text-decoration: none; font-size: 0.85rem;">← Back to
                Home</a>
        </div>
    </div>
</body>

</html>