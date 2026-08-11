<?php
/**
 * Smart cPanel API Bridge File
 * Upload this file to: /public_html/vaiswanara.in/test/api.php
 */

// Always set JSON headers to prevent HTML fallback errors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, x-api-token, x-admin-password");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

// Detect index.php dynamically in multiple possible locations
$possiblePaths = [
    dirname(dirname(dirname(__DIR__))) . '/jyotisha_php_api/index.php',
    __DIR__ . '/../../jyotisha_php_api/index.php',
    '/home/grcamp30/jyotisha_php_api/index.php',
    '/home/grcamp/jyotisha_php_api/index.php',
];

$indexPath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $indexPath = $path;
        break;
    }
}

if (!$indexPath) {
    http_response_code(500);
    echo json_encode([
        "error" => "PHP API index.php not found.",
        "searched_paths" => $possiblePaths,
        "current_dir" => __DIR__
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

require_once $indexPath;
