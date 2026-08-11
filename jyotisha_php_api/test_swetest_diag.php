<?php
/**
 * Swetest Diagnostic Test Script
 * Access via: https://vaiswanara.com/jyotisha_php_api/test_swetest_diag.php
 */

require_once __DIR__ . '/engine/constants.php';
require_once __DIR__ . '/engine/VedicAstroEngine.php';

header("Content-Type: text/plain; charset=utf-8");

echo "=== SWETEST DIAGNOSTIC TEST ===\n\n";
echo "PHP OS: " . PHP_OS . "\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "Disabled Functions: " . (ini_get('disable_functions') ?: "None") . "\n\n";

$isWin = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
$swetestPath = __DIR__ . ($isWin ? '/swetest.exe' : '/swetest');
echo "Swetest Path: {$swetestPath}\n";
echo "Swetest File Exists: " . (file_exists($swetestPath) ? "YES" : "NO") . "\n";
if (file_exists($swetestPath)) {
    echo "Swetest Permissions: " . substr(sprintf('%o', fileperms($swetestPath)), -4) . "\n";
}

$epheDir = __DIR__ . '/ephe';
echo "Ephe Directory Exists: " . (is_dir($epheDir) ? "YES" : "NO") . "\n\n";

echo "Is Swetest Enabled in Engine: " . (VedicAstroEngine::isSwetestEnabled() ? "YES" : "NO") . "\n\n";

echo "--- RUNNING SWETEST DIRECT TEST ---\n";
$out = VedicAstroEngine::runSwetestStatic("-p0 -b1.1.2000 -n1 -s1");
echo "OUTPUT LENGTH: " . strlen($out) . " bytes\n";
echo "OUTPUT CONTENT:\n" . $out . "\n";
echo "--- END TEST ---\n";
