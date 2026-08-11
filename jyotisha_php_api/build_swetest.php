<?php
/**
 * Auto-Compile Swiss Ephemeris swetest binary on cPanel Linux
 * Access via: https://vaiswanara.com/jyotisha_php_api/build_swetest.php
 */

header("Content-Type: text/plain; charset=utf-8");

echo "=== SWETEST CPANEL AUTO-COMPILER ===\n\n";

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    echo "Windows detected. Compilation not needed for Windows.\n";
    exit;
}

$rootDir = __DIR__;
$targetBinary = $rootDir . '/swetest';

// Check available C compilers
$compilers = ['gcc', 'cc', 'clang'];
$foundCompiler = null;

foreach ($compilers as $comp) {
    $which = trim(@shell_exec("which $comp 2>&1") ?: '');
    if (!empty($which) && strpos($which, 'no ') === false && (file_exists($which) || strpos($which, '/') === 0)) {
        $foundCompiler = $which;
        break;
    }
}

if (!$foundCompiler) {
    foreach (['/bin/gcc', '/usr/bin/gcc', '/usr/bin/cc', '/usr/bin/clang', '/usr/local/bin/gcc'] as $p) {
        if (file_exists($p)) {
            $foundCompiler = $p;
            break;
        }
    }
}

echo "Compiler Found: " . ($foundCompiler ?: "NONE") . "\n";

if (!$foundCompiler) {
    echo "❌ No C compiler found on cPanel. Please contact support.\n";
    exit;
}

echo "\nDownloading Swiss Ephemeris C source tarball (3.8MB)...\n";
$tarPath = $rootDir . '/libswe_source.tar.gz';
$sourceUrl = "https://archive.ubuntu.com/ubuntu/pool/universe/libs/libswe/libswe_2.10.03.orig.tar.gz";

$data = @file_get_contents($sourceUrl);
if (!$data) {
    $ch = curl_init($sourceUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $data = curl_exec($ch);
    curl_close($ch);
}

if ($data) {
    file_put_contents($tarPath, $data);
    echo "Source downloaded successfully. Size: " . strlen($data) . " bytes\n";

    $tempBuildDir = $rootDir . '/swetest_build_temp';
    @mkdir($tempBuildDir, 0755, true);

    exec("tar -xf " . escapeshellarg($tarPath) . " -C " . escapeshellarg($tempBuildDir));

    $extractedDirs = glob($tempBuildDir . '/*', GLOB_ONLYDIR);
    $srcDir = !empty($extractedDirs) ? $extractedDirs[0] : $tempBuildDir;

    echo "Compiling swetest in {$srcDir} using {$foundCompiler}...\n";

    // Precise compilation command for swetest without utility mains & with -ldl
    $cFiles = "swetest.c swedate.c swehouse.c swejpl.c swemdate.c swemphex.c swecl.c sweph.c swephexp.c swephlib.c";
    $compileCmd = "cd " . escapeshellarg($srcDir) . " && (make swetest || {$foundCompiler} -O2 {$cFiles} -lm -ldl -o swetest) 2>&1";
    
    $compileOut = @shell_exec($compileCmd);
    echo "Compile Output:\n" . ($compileOut ?: "(Clean compilation)") . "\n";

    $compiledFile = $srcDir . '/swetest';
    if (file_exists($compiledFile)) {
        @copy($compiledFile, $targetBinary);
        @chmod($targetBinary, 0755);
        echo "\n✅ SUCCESS: Fresh swetest binary compiled on cPanel and saved to {$targetBinary}!\n";
        echo "Permissions: " . substr(sprintf('%o', fileperms($targetBinary)), -4) . "\n";
    } else {
        echo "\n❌ Compilation failed.\n";
    }

    // Cleanup
    @unlink($tarPath);
    exec("rm -rf " . escapeshellarg($tempBuildDir));
} else {
    echo "❌ Failed to download source tarball.\n";
}
