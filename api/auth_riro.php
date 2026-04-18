<?php
/**
 * RiroSchool Auth Engine (PHP Version)
 * Replicated from riroschoolauth.py for ISHS Lab
 */

class RiroAuth {
    private $session_id;
    private $cookie_file;
    private $last_html;

    public function __construct() {
        // Create a unique cookie file for this session in the temporary directory
        $this->cookie_file = tempnam(sys_get_temp_dir(), 'riro_cookie_');
    }

    public function __destruct() {
        if (file_exists($this->cookie_file)) {
            unlink($this->cookie_file);
        }
    }

    public function checkLogin($id, $pw) {
        $headers = [
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome",
            "Content-Type: application/x-www-form-urlencoded"
        ];

        // 1. Logout first to be clean
        $this->curlPost("https://iscience.riroschool.kr/user.php?action=user_logout", [], $headers);

        // 2. Login attempt to ajax.php
        $loginData = [
            "app" => "user",
            "mode" => "login",
            "userType" => "1",
            "id" => $id,
            "pw" => $pw,
            "deeplink" => "",
            "redirect_link" => ""
        ];

        $response = $this->curlPost("https://iscience.riroschool.kr/ajax.php", $loginData, $headers);
        $json = json_decode($response, true);

        if (!$json) {
            return ["status" => "error", "message" => "인증 서버 응답 분석 실패"];
        }

        $code = (string)($json['code'] ?? '');
        if ($code === "902") {
            return ["status" => "error", "message" => "아이디 또는 비밀번호가 틀렸습니다."];
        }
        if ($code !== "000") {
            return ["status" => "error", "message" => "로그인 실패 (Code: $code)"];
        }

        $token = $json['token'] ?? '';
        if (!$token) {
            return ["status" => "error", "message" => "토큰을 찾을 수 없습니다."];
        }

        // 3. Access user.php with token cookie to get user details
        // Note: The token is often sent as a cookie named 'cookie_token'
        $this->setCookie("cookie_token", $token);
        
        $userInfoResponse = $this->curlPost("https://iscience.riroschool.kr/user.php", ["pw" => $pw], $headers);
        
        return $this->parseUserInfo($userInfoResponse, $id);
    }

    private function curlPost($url, $data, $headers) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->cookie_file);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie_file);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For compatibility with some shared hosts
        
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

    private function setCookie($name, $value) {
        $domain = "iscience.riroschool.kr";
        $content = "\n$domain\tTRUE\t/\tFALSE\t0\t$name\t$value\n";
        file_put_contents($this->cookie_file, $content, FILE_APPEND);
    }

    private function parseUserInfo($html, $user_id) {
        // Save for debugging if needed
        $this->last_html = $html;
        
        // Detection: Check if it's an integrated account
        if (strpos($html, "통합아이디") !== false) {
            return $this->parseIntegrated($html, $user_id);
        } else {
            return $this->parseNormal($html, $user_id);
        }
    }

    private function getElementsByClass($xpath, $className) {
        return $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $className ')]");
    }

    private function parseNormal($html, $user_id) {
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $xpath = new DOMXPath($dom);

        $m_student = $this->getElementsByClass($xpath, 'm_level1');
        if ($m_student->length === 0) $m_student = $this->getElementsByClass($xpath, 'm_level3');
        
        $m_inputs = $this->getElementsByClass($xpath, 'input_disabled');

        if ($m_student->length === 0 || $m_inputs->length < 2) {
            file_put_contents('debug_riro_fail.html', $html); // Debug log
            return ["status" => "error", "message" => "사용자 정보를 파싱할 수 없습니다. (debug_riro_fail.html 생성됨)"];
        }

        $student = trim($m_student->item(0)->textContent);
        $name = trim($m_inputs->item(0)->textContent);
        $student_number_raw = trim($m_inputs->item(1)->textContent);

        if (strlen($student_number_raw) >= 3) {
            $student_number = $student_number_raw[0] . substr($student_number_raw, 2);
        } else {
            $student_number = $student_number_raw;
        }

        $generation = 0;
        if (strlen($user_id) >= 2 && is_numeric(substr($user_id, 0, 2))) {
            $generation = (int)("20" . substr($user_id, 0, 2)) - 1994 + 1;
        }

        return [
            "status" => "success",
            "name" => $name,
            "school_name" => "인천과학고등학교", // Default for this domain
            "grade" => (strlen($student_number_raw) > 0 && is_numeric($student_number_raw[0])) ? (int)$student_number_raw[0] : 0,
            "student_number" => $student_number,
            "generation" => $generation,
            "student" => $student
        ];
    }

    private function parseIntegrated($html, $user_id) {
        $dom = new DOMDocument();
        @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
        $xpath = new DOMXPath($dom);

        $m_fix = $this->getElementsByClass($xpath, 'elem_fix');
        $m_inputs = $this->getElementsByClass($xpath, 'input_disabled');

        if ($m_fix->length === 0 || $m_inputs->length < 2) {
             file_put_contents('debug_riro_fail_integrated.html', $html); // Debug log
             return ["status" => "error", "message" => "통합계정 정보를 파싱할 수 없습니다. (debug_fail_integrated.html 생성됨)"];
        }

        $fix_text = trim($m_fix->item(0)->textContent);
        $riro_id = substr($fix_text, 0, 8);
        
        $student = '';
        if (preg_match('/\((.*?)\)/', $fix_text, $m_paren)) {
            $student = $m_paren[1];
        }

        $name = trim($m_inputs->item(0)->textContent);
        $student_number_raw = trim($m_inputs->item(1)->textContent);
        
        if (strlen($student_number_raw) >= 3) {
            $student_number = $student_number_raw[0] . substr($student_number_raw, 2);
        } else {
            $student_number = $student_number_raw;
        }

        $generation = 0;
        if (strlen($riro_id) >= 2 && is_numeric(substr($riro_id, 0, 2))) {
            $generation = (int)("20" . substr($riro_id, 0, 2)) - 1994 + 1;
        }

        return [
            "status" => "success",
            "name" => $name,
            "school_name" => "인천과학고등학교", // Default for this domain
            "grade" => (strlen($student_number_raw) > 0 && is_numeric($student_number_raw[0])) ? (int)$student_number_raw[0] : 0,
            "student_number" => $student_number,
            "generation" => $generation,
            "student" => $student
        ];
    }
}
?>
