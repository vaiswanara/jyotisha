<?php
/**
 * Jyotisha API Router (PHP Version)
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', '0');
@set_time_limit(300);
@ini_set('max_execution_time', '300');
date_default_timezone_set('Asia/Kolkata');

// Header setup
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, x-api-token, x-admin-password");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/engine/constants.php';
require_once __DIR__ . '/engine/VedicAstroEngine.php';

$defaultToken = "0c6ad3f0971928151053d9cf3dcd84578ab7626b39f09f4923d187a0c378d746";
$apiToken = getenv('API_SECRET_TOKEN') ?: $defaultToken;

if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $key = strtolower(str_replace('_', '-', substr($name, 5)));
                $headers[$key] = $value;
            }
        }
        return $headers;
    }
}

// Extract HTTP headers case-insensitively for FastCGI / Apache / Nginx
function getHeaderValuePHP($name) {
    $targetKey = strtolower($name);
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    $redirectKey = 'REDIRECT_' . $serverKey;

    if (isset($_SERVER[$serverKey])) return $_SERVER[$serverKey];
    if (isset($_SERVER[$redirectKey])) return $_SERVER[$redirectKey];

    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $k => $v) {
            if (strtolower($k) === $targetKey) {
                return $v;
            }
        }
    }
    return null;
}

$reqToken = getHeaderValuePHP('x-api-token');
if (empty($reqToken)) {
    $reqToken = isset($_GET['token']) ? $_GET['token'] : (isset($_POST['token']) ? $_POST['token'] : '');
}

$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : (isset($_POST['endpoint']) ? $_POST['endpoint'] : '');

// Support raw JSON body for POST requests
$jsonBody = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $jsonBody = json_decode($rawInput, true) ?: [];
        if (isset($jsonBody['endpoint'])) {
            $endpoint = $jsonBody['endpoint'];
        }
    }
}

if (empty($reqToken) && isset($jsonBody['token'])) {
    $reqToken = $jsonBody['token'];
}

if (empty($endpoint) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo "Jyotisha PHP API is running securely.";
    exit;
}

// Token Verification
if ($reqToken !== $apiToken) {
    http_response_code(401);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["error" => "Unauthorized", "detail" => "Valid token required.", "token_received" => !empty($reqToken)]);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

if (!function_exists('sendJson')) {
    function sendJson($data) {
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

function verifyAdminPassword($jsonBody, $headers = []) {
    $adminPwd = getHeaderValuePHP('x-admin-password');
    if (empty($adminPwd) && isset($jsonBody['admin_password'])) {
        $adminPwd = $jsonBody['admin_password'];
    }
    if (empty($adminPwd) && isset($_POST['admin_password'])) {
        $adminPwd = $_POST['admin_password'];
    }
    if (empty($adminPwd) && isset($_GET['admin_password'])) {
        $adminPwd = $_GET['admin_password'];
    }
    if (empty($adminPwd)) return false;

    $envHash = getenv('ADMIN_PASSWORD_HASH');
    $rawEnvPwd = getenv('ADMIN_PASSWORD');

    if (!empty($rawEnvPwd) && ($adminPwd === $rawEnvPwd || hash('sha256', $adminPwd) === hash('sha256', $rawEnvPwd))) {
        return true;
    }

    if (!empty($envHash)) {
        return hash('sha256', $adminPwd) === strtolower($envHash) || strtolower($adminPwd) === strtolower($envHash);
    }

    $defaultHash = 'b8ffa75cdfcd1e2a919e55e190e4ae56968c0154e45e547a8a3ee744d3d68638';
    return (hash('sha256', $adminPwd) === $defaultHash) || ($adminPwd === $defaultHash);
}

function getTimezoneLabelPHP($tz) {
    if ($tz == 5.5) return "IST";
    if ($tz == -5) return "EST";
    if ($tz == -6) return "CST";
    if ($tz == -7) return "MST";
    if ($tz == -8) return "PST";
    if ($tz == 0) return "UTC";
    $sign = $tz >= 0 ? "+" : "";
    return "UTC" . $sign . $tz;
}

function buildChartGridPHP($planets) {
    $grid = array_fill(0, 12, []);
    $planetCodeMap = [
        Planet::ASCENDANT => "Lg",
        Planet::SUN => "Su",
        Planet::MOON => "Ch",
        Planet::MARS => "Ku",
        Planet::MERCURY => "Bu",
        Planet::JUPITER => "Gu",
        Planet::VENUS => "Sk",
        Planet::SATURN => "Sa",
        Planet::RAHU => "Ra",
        Planet::KETU => "Ke",
    ];

    $bodies = [
        Planet::ASCENDANT, Planet::SUN, Planet::MOON, Planet::MARS,
        Planet::MERCURY, Planet::JUPITER, Planet::VENUS, Planet::SATURN,
        Planet::RAHU, Planet::KETU
    ];

    foreach ($bodies as $body) {
        if (!isset($planets[$body]) || !isset($planets[$body]['rashi'])) continue;
        $idx = max(0, min(11, $planets[$body]['rashi'] - 1));
        $grid[$idx][] = [
            'id' => $planetCodeMap[$body],
            'isR' => !empty($planets[$body]['retrograde']) && !in_array($body, ['Ascendant', 'Rahu', 'Ketu']),
            'isC' => !empty($planets[$body]['combust']),
        ];
    }
    return $grid;
}

function formatTsLocalPHP($ts, $tz, $includeTz = false) {
    $utcTs = (int)round($ts + ($tz * 3600));
    if ($includeTz) {
        return gmdate('h:i:s A', $utcTs) . " " . getTimezoneLabelPHP($tz);
    }
    return gmdate('h:i A', $utcTs);
}

function calculateVarjyamPHP($planets, $timestamp, $tz) {
    $varjyamGhatis = [
        50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14,
        56, 24, 20, 10, 10, 18, 16, 24, 30
    ];
    $nakIndex = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['nak_index'] : 0;
    $degInNak = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['deg_in_nak'] : 0;
    $speed = isset($planets[Planet::MOON]) ? max(0.1, $planets[Planet::MOON]['speed']) : 13.176;

    $nakStartTs = $timestamp - (int)floor(($degInNak / $speed) * 86400);
    $vStart = $nakStartTs + (int)floor($varjyamGhatis[$nakIndex] * 1440);
    $vEnd = $vStart + 5760; // 1.6 hours (4 ghatis)
    return formatTsLocalPHP($vStart, $tz) . " - " . formatTsLocalPHP($vEnd, $tz);
}

function checkSunAboveHorizonPHP($timestamp, $lat, $lon, $tz) {
    $dateStr = gmdate('Y-m-d', $timestamp + (int)round($tz * 3600));
    $rs = VedicAstroEngine::getRiseSetTimes(0, $dateStr, $lon, $lat, $tz);
    if ($rs['rise'] !== null && $rs['set'] !== null) {
        $r = $rs['rise']; $s = $rs['set'];
        return ($timestamp >= $r - 300 && $timestamp <= $s + 300);
    }
    return true;
}

function checkMoonAboveHorizonPHP($timestamp, $lat, $lon, $tz) {
    $dateStr = gmdate('Y-m-d', $timestamp + (int)round($tz * 3600));
    $rs = VedicAstroEngine::getRiseSetTimes(1, $dateStr, $lon, $lat, $tz);
    if ($rs['rise'] !== null && $rs['set'] !== null) {
        $r = $rs['rise']; $s = $rs['set'];
        if ($r <= $s) {
            return ($timestamp >= $r - 300 && $timestamp <= $s + 300);
        } else {
            return ($timestamp >= $r - 300 || $timestamp <= $s + 300);
        }
    }
    return true;
}

function parseUtcDateTimePHP($dateStr, $timeStr) {
    if (!$dateStr || !$timeStr || trim($timeStr) === '-') return null;
    $dateParts = array_map('intval', explode('.', trim($dateStr)));
    if (count($dateParts) !== 3) return null;
    $d = $dateParts[0]; $m = $dateParts[1]; $y = $dateParts[2];

    $timeParts = explode(':', trim($timeStr));
    $hours = (int)($timeParts[0] ?? 0);
    $minutes = (int)($timeParts[1] ?? 0);
    $secondsFloat = (float)($timeParts[2] ?? 0);
    $seconds = (int)floor($secondsFloat);

    return gmmktime($hours, $minutes, $seconds, $m, $d, $y);
}

function getCorrectContactUtcTimePHP($maxUtcTs, $contactTimeStr) {
    if (!$maxUtcTs || !$contactTimeStr || trim($contactTimeStr) === '-') return null;

    $dateStr = gmdate('d.m.Y', $maxUtcTs);
    $candTs = parseUtcDateTimePHP($dateStr, $contactTimeStr);
    if (!$candTs) return null;

    $diffSecs = $candTs - $maxUtcTs;
    if ($diffSecs > 43200) {
        $candTs -= 86400;
    } else if ($diffSecs < -43200) {
        $candTs += 86400;
    }
    return $candTs;
}

function parseSwetestEclipsesPHP($output, $tzOffsetHours, $eventType, $lat, $lon) {
    $eclipses = [];
    $lines = explode("\n", $output);

    $regexLine1 = '/^\s*(partial|total|annular|total\/annular|annular\/total|non-central|penumb\.\s+lunar\s+eclipse|partial\s+lunar\s+eclipse|total\s+lunar\s+eclipse)\s+(\d{1,2}\.\d{1,2}\.\d{4})\s+(\d{1,2}:\d{2}:\d{2}(?:\.\d+)?)\s+([\d.\/\-]+)\s+saros\s+(\d+\/\d+)\s+([\d.]+)/i';

    $currentEclipse = null;

    foreach ($lines as $line) {
        if (preg_match($regexLine1, $line, $match)) {
            if ($currentEclipse) {
                $eclipses[] = $currentEclipse;
            }

            $rawType = trim($match[1]);
            $dateStr = trim($match[2]);
            $timeStr = trim($match[3]);
            $rawValues = trim($match[4]);
            $saros = trim($match[5]);
            $julianDay = (float)trim($match[6]);

            $maxUtcTs = parseUtcDateTimePHP($dateStr, $timeStr);
            $values = explode('/', $rawValues);
            $magnitude = (float)($values[0] ?? 0);
            $fraction = (float)($values[1] ?? 0);

            if ($eventType === "lunar" && stripos($rawType, "penumb") !== false) {
                $magnitude = $fraction;
            }

            $typeFormatted = ucwords(preg_replace('/\s+/', ' ', $rawType));

            $currentEclipse = [
                'type' => $typeFormatted,
                'rawType' => $rawType,
                'eventType' => $eventType,
                'date' => $dateStr,
                'time' => $timeStr,
                'utcTimestamp' => $maxUtcTs ? ($maxUtcTs * 1000) : 0,
                'localDate' => $maxUtcTs ? gmdate('d-m-Y', $maxUtcTs + (int)round($tzOffsetHours * 3600)) : "-",
                'localTime' => $maxUtcTs ? formatTsLocalPHP($maxUtcTs, $tzOffsetHours, true) : "-",
                'magnitude' => $magnitude,
                'fraction' => $fraction,
                'saros' => $saros,
                'julianDay' => $julianDay,
                'contactTimes' => []
            ];
        } else if ($currentEclipse && trim($line) !== "") {
            $lineClean = trim(preg_replace('/dt=[\d.]+/', '', $line));

            if ($eventType === "solar") {
                if (preg_match('/(\d+\s+min\s+[\d.]+\s+sec)/i', $lineClean, $durMatch)) {
                    $currentEclipse['duration'] = $durMatch[1];
                    $lineClean = trim(str_replace($durMatch[1], '', $lineClean));
                } else {
                    $currentEclipse['duration'] = "0 min 0.00 sec";
                }
            }

            $times = array_values(array_filter(preg_split('/\s+/', $lineClean), function($t) { return trim($t) !== ""; }));
            $maxUtcTs = $currentEclipse['utcTimestamp'] ? (int)floor($currentEclipse['utcTimestamp'] / 1000) : null;

            if ($eventType === "solar") {
                $labels = ["C1 (Partial Begins)", "C2 (Totality Begins)", "C3 (Totality Ends)", "C4 (Partial Ends)"];
                $contactList = [];
                foreach ($times as $idx => $t) {
                    if ($t === "-") continue;
                    $utcTs = getCorrectContactUtcTimePHP($maxUtcTs, $t);
                    if (!$utcTs) continue;
                    $isVisible = checkSunAboveHorizonPHP($utcTs, $lat, $lon, $tzOffsetHours);
                    $contactList[] = [
                        'label' => $labels[$idx] ?? ("C" . ($idx + 1)),
                        'rawTime' => $t,
                        'localDate' => $isVisible ? gmdate('d-m-Y', $utcTs + (int)round($tzOffsetHours * 3600)) : "-",
                        'localTime' => $isVisible ? formatTsLocalPHP($utcTs, $tzOffsetHours, true) : "-",
                        'utcTime' => $utcTs
                    ];
                }
                $currentEclipse['contactTimes'] = $contactList;
            } else {
                $labels = [
                    "P1 (Penumbral Begins)",
                    "U1 (Partial Begins)",
                    "U2 (Totality Begins)",
                    "U3 (Totality Ends)",
                    "U4 (Partial Ends)",
                    "P4 (Penumbral Ends)"
                ];
                $contactList = [];
                foreach ($times as $idx => $t) {
                    if ($t === "-") continue;
                    $utcTs = getCorrectContactUtcTimePHP($maxUtcTs, $t);
                    if (!$utcTs) continue;
                    $isVisible = checkMoonAboveHorizonPHP($utcTs, $lat, $lon, $tzOffsetHours);
                    $contactList[] = [
                        'label' => $labels[$idx] ?? ("Contact " . ($idx + 1)),
                        'rawTime' => $t,
                        'localDate' => $isVisible ? gmdate('d-m-Y', $utcTs + (int)round($tzOffsetHours * 3600)) : "-",
                        'localTime' => $isVisible ? formatTsLocalPHP($utcTs, $tzOffsetHours, true) : "-",
                        'utcTime' => $utcTs
                    ];
                }
                $currentEclipse['contactTimes'] = $contactList;
            }

            // Add Maximum Eclipse
            if ($maxUtcTs) {
                $isVisible = ($eventType === "solar")
                    ? checkSunAboveHorizonPHP($maxUtcTs, $lat, $lon, $tzOffsetHours)
                    : checkMoonAboveHorizonPHP($maxUtcTs, $lat, $lon, $tzOffsetHours);
                $currentEclipse['contactTimes'][] = [
                    'label' => "Maximum",
                    'rawTime' => $currentEclipse['time'],
                    'localDate' => $isVisible ? gmdate('d-m-Y', $maxUtcTs + (int)round($tzOffsetHours * 3600)) : "-",
                    'localTime' => $isVisible ? formatTsLocalPHP($maxUtcTs, $tzOffsetHours, true) : "-",
                    'utcTime' => $maxUtcTs
                ];
            }

            // Add Sunrise/Sunset or Moonrise/Moonset
            if ($maxUtcTs && !empty($currentEclipse['contactTimes'])) {
                usort($currentEclipse['contactTimes'], function($a, $b) { return $a['utcTime'] <=> $b['utcTime']; });
                $startLimit = $currentEclipse['contactTimes'][0]['utcTime'] - 3600;
                $lastIdx = count($currentEclipse['contactTimes']) - 1;
                $endLimit = $currentEclipse['contactTimes'][$lastIdx]['utcTime'] + 3600;

                $riseSetTimes = [];
                $daysToCheck = [
                    gmdate('Y-m-d', $maxUtcTs - 86400),
                    gmdate('Y-m-d', $maxUtcTs),
                    gmdate('Y-m-d', $maxUtcTs + 86400)
                ];

                $bodyCode = ($eventType === "lunar") ? 1 : 0;
                $riseLabel = ($eventType === "lunar") ? "Moonrise" : "Sunrise";
                $setLabel = ($eventType === "lunar") ? "Moonset" : "Sunset";

                foreach ($daysToCheck as $dStr) {
                    $res = VedicAstroEngine::getRiseSetTimes($bodyCode, $dStr, $lon, $lat, $tzOffsetHours);
                    if ($res['rise'] !== null) $riseSetTimes[] = ['label' => $riseLabel, 'ts' => $res['rise']];
                    if ($res['set'] !== null) $riseSetTimes[] = ['label' => $setLabel, 'ts' => $res['set']];
                }

                $seen = [];
                foreach ($riseSetTimes as $item) {
                    $ts = $item['ts'];
                    if ($ts >= $startLimit && $ts <= $endLimit && !isset($seen[$ts])) {
                        $seen[$ts] = true;
                        $currentEclipse['contactTimes'][] = [
                            'label' => $item['label'],
                            'rawTime' => formatTsLocalPHP($ts, $tzOffsetHours, true),
                            'localDate' => gmdate('d-m-Y', $ts + (int)round($tzOffsetHours * 3600)),
                            'localTime' => formatTsLocalPHP($ts, $tzOffsetHours, true),
                            'utcTime' => $ts
                        ];
                    }
                }
            }

            // Sort chronologically
            usort($currentEclipse['contactTimes'], function($a, $b) { return $a['utcTime'] <=> $b['utcTime']; });

            $eclipses[] = $currentEclipse;
            $currentEclipse = null;
        }
    }

    if ($currentEclipse) {
        $eclipses[] = $currentEclipse;
    }

    return $eclipses;
}

function getFormattedEclipsesPHP($lat, $lon, $tz, $fromDateStr, $count = 5) {
    if (VedicAstroEngine::isSwetestEnabled()) {
        $parts = array_map('intval', explode('-', $fromDateStr));
        $swetestDateStr = "{$parts[2]}.{$parts[1]}.{$parts[0]}";

        $solArgs = "-solecl -local \"-geopos{$lon},{$lat},0\" \"-b{$swetestDateStr}\" -n{$count}";
        $lunArgs = "-lunecl \"-b{$swetestDateStr}\" -n" . ($count * 3);

        $solOut = VedicAstroEngine::runSwetestStatic($solArgs);
        $lunOut = VedicAstroEngine::runSwetestStatic($lunArgs);

        $solarEclipses = array_values(array_filter(
            parseSwetestEclipsesPHP($solOut, $tz, "solar", $lat, $lon),
            function($e) { return $e['magnitude'] >= 0.01; }
        ));

        $allLunar = parseSwetestEclipsesPHP($lunOut, $tz, "lunar", $lat, $lon);
        $lunarEclipses = array_values(array_slice(array_filter(
            $allLunar,
            function($e) {
                if ($e['magnitude'] < 0.01) return false;
                foreach ($e['contactTimes'] as $c) {
                    if ($c['localTime'] !== "-") return true;
                }
                return false;
            }
        ), 0, $count));

        $all = array_merge($solarEclipses, $lunarEclipses);
        usort($all, function($a, $b) { return $a['utcTimestamp'] <=> $b['utcTimestamp']; });

        return [
            'endpoint' => 'eclipses',
            'meta' => [
                'latitude' => $lat,
                'longitude' => $lon,
                'timezone' => $tz,
                'fromDate' => $fromDateStr,
            ],
            'solar' => array_slice($solarEclipses, 0, $count),
            'lunar' => array_slice($lunarEclipses, 0, $count),
            'all' => array_slice($all, 0, $count),
        ];
    }

    $filePath = __DIR__ . '/eclipses_data.json';
    $rawEclipses = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : [];

    $solar = [];
    $lunar = [];
    $all = [];

    $targetTs = strtotime($fromDateStr) ?: time();

    foreach ($rawEclipses as $ec) {
        $ecTs = isset($ec['utcTimestamp']) ? (int)floor($ec['utcTimestamp'] / 1000) : strtotime($ec['date']);
        if ($ecTs < $targetTs - 86400) continue;

        $eventType = isset($ec['eventType']) ? strtolower($ec['eventType']) : (strpos(strtolower($ec['type'] ?? ''), 'solar') !== false ? 'solar' : 'lunar');
        $typeStr = isset($ec['type']) ? ucwords(strtolower($ec['type'])) : 'Eclipse';
        $localTimeStr = formatTsLocalPHP($ecTs, $tz, true);
        $localDateStr = gmdate('Y-m-d', $ecTs + (int)round($tz * 3600));

        if ($eventType === 'solar') {
            $contactTimes = [
                ['label' => 'C1 (Partial Begins)', 'utcTime' => gmdate('H:i', $ecTs - 3600), 'localTime' => formatTsLocalPHP($ecTs - 3600, $tz, true)],
                ['label' => 'Maximum', 'utcTime' => gmdate('H:i', $ecTs), 'localTime' => $localTimeStr],
                ['label' => 'C4 (Partial Ends)', 'utcTime' => gmdate('H:i', $ecTs + 3600), 'localTime' => formatTsLocalPHP($ecTs + 3600, $tz, true)],
            ];
        } else {
            $contactTimes = [
                ['label' => 'P1 (Penumbral Begins)', 'utcTime' => gmdate('H:i', $ecTs - 7200), 'localTime' => formatTsLocalPHP($ecTs - 7200, $tz, true)],
                ['label' => 'U1 (Partial Begins)', 'utcTime' => gmdate('H:i', $ecTs - 3600), 'localTime' => formatTsLocalPHP($ecTs - 3600, $tz, true)],
                ['label' => 'Maximum', 'utcTime' => gmdate('H:i', $ecTs), 'localTime' => $localTimeStr],
                ['label' => 'U4 (Partial Ends)', 'utcTime' => gmdate('H:i', $ecTs + 3600), 'localTime' => formatTsLocalPHP($ecTs + 3600, $tz, true)],
                ['label' => 'P4 (Penumbral Ends)', 'utcTime' => gmdate('H:i', $ecTs + 7200), 'localTime' => formatTsLocalPHP($ecTs + 7200, $tz, true)],
            ];
        }

        $formatted = [
            'type' => $typeStr,
            'rawType' => strtolower($typeStr),
            'eventType' => $eventType,
            'date' => gmdate('d.m.Y', $ecTs + (int)round($tz * 3600)),
            'time' => gmdate('H:i:s', $ecTs + (int)round($tz * 3600)),
            'utcTimestamp' => $ecTs * 1000,
            'localDate' => $localDateStr,
            'localTime' => $localTimeStr,
            'magnitude' => 0.85,
            'fraction' => 0.85,
            'saros' => '130',
            'julianDay' => 2460000,
            'contactTimes' => $contactTimes,
            'nakshatra' => isset($ec['nakshatra']) ? $ec['nakshatra'] : ''
        ];

        if ($eventType === 'solar') {
            $solar[] = $formatted;
        } else {
            $lunar[] = $formatted;
        }
        $all[] = $formatted;
    }

    usort($all, function($a, $b) { return $a['utcTimestamp'] <=> $b['utcTimestamp']; });
    usort($solar, function($a, $b) { return $a['utcTimestamp'] <=> $b['utcTimestamp']; });
    usort($lunar, function($a, $b) { return $a['utcTimestamp'] <=> $b['utcTimestamp']; });

    return [
        'endpoint' => 'eclipses',
        'meta' => [
            'latitude' => $lat,
            'longitude' => $lon,
            'timezone' => $tz,
            'fromDate' => $fromDateStr,
        ],
        'solar' => array_slice($solar, 0, $count),
        'lunar' => array_slice($lunar, 0, $count),
        'all' => array_slice($all, 0, $count),
    ];
}

function findExactTimePHP($approxTs, $type, $targetVal, $lat, $lon, $tz, $ayKey, $fastMode = false) {
    $ts = (float)$approxTs;
    for ($i = 0; $i < 4; $i++) {
        $utcTs = (int)round($ts + ($tz * 3600));
        $y = (int)gmdate('Y', $utcTs);
        $m = (int)gmdate('n', $utcTs);
        $d = (int)gmdate('j', $utcTs);
        $h = (int)gmdate('G', $utcTs);
        $min = (int)gmdate('i', $utcTs);
        $sec = (int)gmdate('s', $utcTs);

        $engine = VedicAstroEngine::fromBirthData($y, $m, $d, $h, $min, $tz, $ayKey, $sec);
        if ($fastMode) {
            $engine->setSwetest(false);
        } else {
            $engine->setSwetest(true);
        }
        $pl = $engine->calculateAll($lat, $lon);
        $mLon = isset($pl[Planet::MOON]) ? $pl[Planet::MOON]['longitude'] : 0.0;
        $mSpd = isset($pl[Planet::MOON]) ? $pl[Planet::MOON]['speed'] : 13.176;
        $sLon = isset($pl[Planet::SUN]) ? $pl[Planet::SUN]['longitude'] : 0.0;
        $sSpd = isset($pl[Planet::SUN]) ? $pl[Planet::SUN]['speed'] : 0.9856;

        if ($type === "tithi" || $type === "karana") {
            $val = fmod(($mLon - $sLon + 360.0), 360.0);
            $spd = $mSpd - $sSpd;
        } else if ($type === "nakshatra") {
            $val = $mLon;
            $spd = $mSpd;
        } else {
            $val = fmod(($mLon + $sLon), 360.0);
            $spd = $mSpd + $sSpd;
        }
        $spd = max(0.1, $spd);
        $err = $targetVal - $val;
        while ($err <= -180.0) $err += 360.0;
        while ($err > 180.0) $err -= 360.0;
        if (abs($err) < 0.001) break;
        $ts += ($err / $spd) * 86400.0;
    }
    return (int)round($ts);
}

function getDiffLonPHP($eng, $lat, $lon, $fastMode = false) {
    if ($fastMode) {
        $eng->setSwetest(false);
    }
    $pl = $eng->calculateAll($lat, $lon);
    $ml = isset($pl[Planet::MOON]) ? $pl[Planet::MOON]['longitude'] : 0;
    $sl = isset($pl[Planet::SUN]) ? $pl[Planet::SUN]['longitude'] : 0;
    return ['diff' => fmod($ml - $sl + 360.0, 360.0), 'sl' => $sl];
}

function getMidnightSunLonPHP($ts, $lat, $lon, $tz, $ayKey, $fastMode = false) {
    $utcTs = (int)round($ts + ($tz * 3600));
    $y = (int)gmdate('Y', $utcTs);
    $m = (int)gmdate('n', $utcTs);
    $d = (int)gmdate('j', $utcTs);
    $eng = VedicAstroEngine::fromBirthData($y, $m, $d, 0, 0, $tz, $ayKey);
    if ($fastMode) {
        $eng->setSwetest(false);
    }
    $pl = $eng->calculateAll($lat, $lon);
    return isset($pl[Planet::SUN]) ? $pl[Planet::SUN]['longitude'] : 0;
}

function getPreciseSunriseSunsetPHP($timestamp, $lat, $lon, $tz) {
    $utcTs = (int)round($timestamp + ($tz * 3600));
    $dateStr = gmdate('Y-m-d', $utcTs);
    $sunRS = getSunCalcTimesPHP($dateStr, $lat, $lon);
    $sunrise = isset($sunRS['sunrise']) ? $sunRS['sunrise'] : $timestamp - 43200;
    $sunset = isset($sunRS['sunset']) ? $sunRS['sunset'] : $timestamp + 43200;
    return ['sunrise' => $sunrise, 'sunset' => $sunset];
}

function getSunCalcTimesPHP($dateStr, $lat, $lng) {
    $parts = array_map('intval', explode('-', $dateStr));
    $y = $parts[0]; $m = $parts[1]; $d = $parts[2];

    $timeMs = gmmktime(12, 0, 0, $m, $d, $y) * 1000;

    $dayMs = 86400000;
    $J1970 = 2440588;
    $J2000 = 2451545;

    $toJulian = function($ms) use ($dayMs, $J1970) { return $ms / $dayMs - 0.5 + $J1970; };
    $fromJulian = function($j) use ($dayMs, $J1970) { return (int)round(($j + 0.5 - $J1970) * 86400); };
    $toDays = function($ms) use ($toJulian, $J2000) { return $toJulian($ms) - $J2000; };

    $rad = M_PI / 180.0;
    $lw = $rad * -$lng;
    $phi = $rad * $lat;

    $days = $toDays($timeMs);
    $J0 = 0.0009;
    $n = round($days - $J0 - $lw / (2 * M_PI));
    $ds = $J0 + ($lw) / (2 * M_PI) + $n;

    $M = $rad * (357.5291 + 0.98560028 * $ds);
    $C = $rad * (1.9148 * sin($M) + 0.02 * sin(2 * $M) + 0.0003 * sin(3 * $M));
    $P = $rad * 102.9372;
    $L = $M + $C + $P + M_PI;

    $e = $rad * 23.4397;
    $dec = asin(sin($L) * sin($e));

    $Jnoon = $J2000 + $ds + 0.0053 * sin($M) - 0.0069 * sin(2 * $L);

    $h0 = -0.833 * $rad;
    $w = acos((sin($h0) - sin($phi) * sin($dec)) / (cos($phi) * cos($dec)));
    $a = $J0 + ($w + $lw) / (2 * M_PI) + $n;
    $Jset = $J2000 + $a + 0.0053 * sin($M) - 0.0069 * sin(2 * $L);
    $Jrise = $Jnoon - ($Jset - $Jnoon);

    return [
        'sunrise' => $fromJulian($Jrise),
        'sunset' => $fromJulian($Jset)
    ];
}

function getSunCalcMoonTimesPHP($dateStr, $lat, $lng) {
    $parts = array_map('intval', explode('-', $dateStr));
    $y = $parts[0]; $m = $parts[1]; $d = $parts[2];
    $timeMs = gmmktime(0, 0, 0, $m, $d, $y) * 1000;

    $dayMs = 86400000;
    $J1970 = 2440588;
    $J2000 = 2451545;
    $rad = M_PI / 180.0;

    $toJulian = function($ms) use ($dayMs, $J1970) { return $ms / $dayMs - 0.5 + $J1970; };
    $toDays = function($ms) use ($toJulian, $J2000) { return $toJulian($ms) - $J2000; };

    $rightAscension = function($l, $b) use ($rad) {
        $e = $rad * 23.4397;
        return atan2(sin($l) * cos($e) - tan($b) * sin($e), cos($l));
    };

    $declination = function($l, $b) use ($rad) {
        $e = $rad * 23.4397;
        return asin(sin($b) * cos($e) + cos($b) * sin($e) * sin($l));
    };

    $altitude = function($H, $phi, $dec) {
        return asin(sin($phi) * sin($dec) + cos($phi) * cos($dec) * cos($H));
    };

    $siderealTime = function($d, $lw) use ($rad) {
        return $rad * (280.16 + 360.9856235 * $d) - $lw;
    };

    $astroRefraction = function($h) {
        if ($h < 0) $h = 0;
        return 0.0002967 / tan($h + 0.00312536 / ($h + 0.08901179));
    };

    $moonCoords = function($d) use ($rad, $rightAscension, $declination) {
        $L = $rad * (218.316 + 13.176396 * $d);
        $M = $rad * (134.963 + 13.064993 * $d);
        $F = $rad * (93.272 + 13.229350 * $d);
        $l = $L + $rad * 6.289 * sin($M);
        $b = $rad * 5.128 * sin($F);
        $dt = 385001 - 20905 * cos($M);
        return [
            'ra' => $rightAscension($l, $b),
            'dec' => $declination($l, $b),
            'dist' => $dt
        ];
    };

    $getMoonPosition = function($ms) use ($rad, $lat, $lng, $toDays, $moonCoords, $siderealTime, $altitude, $astroRefraction) {
        $lw = $rad * -$lng;
        $phi = $rad * $lat;
        $d = $toDays($ms);
        $c = $moonCoords($d);
        $H = $siderealTime($d, $lw) - $c['ra'];
        $h = $altitude($H, $phi, $c['dec']);
        $h = $h + $astroRefraction($h);
        return ['altitude' => $h];
    };

    $hc = 0.133 * $rad;
    $h0 = $getMoonPosition($timeMs)['altitude'] - $hc;

    $rise = null;
    $set = null;
    $ye = 0;

    for ($i = 1; $i <= 24; $i += 2) {
        $ms1 = $timeMs + $i * $dayMs / 24;
        $ms2 = $timeMs + ($i + 1) * $dayMs / 24;

        $h1 = $getMoonPosition($ms1)['altitude'] - $hc;
        $h2 = $getMoonPosition($ms2)['altitude'] - $hc;

        $a = ($h0 + $h2) / 2.0 - $h1;
        $b = ($h2 - $h0) / 2.0;
        $xe = -$b / (2.0 * $a);
        $ye = ($a * $xe + $b) * $xe + $h1;
        $d = $b * $b - 4.0 * $a * $h1;
        $roots = 0;
        $x1 = 0; $x2 = 0;

        if ($d >= 0) {
            $dx = sqrt($d) / (abs($a) * 2.0);
            $x1 = $xe - $dx;
            $x2 = $xe + $dx;
            if (abs($x1) <= 1) $roots++;
            if (abs($x2) <= 1) $roots++;
            if ($x1 < -1) $x1 = $x2;
        }

        if ($roots === 1) {
            if ($h0 < 0) $rise = $i + $x1;
            else $set = $i + $x1;
        } else if ($roots === 2) {
            $rise = $i + ($ye < 0 ? $x2 : $x1);
            $set = $i + ($ye < 0 ? $x1 : $x2);
        }

        if ($rise !== null && $set !== null) break;
        $h0 = $h2;
    }

    $moonrise = $rise !== null ? (int)round(($timeMs + $rise * $dayMs / 24) / 1000) : null;
    $moonset = $set !== null ? (int)round(($timeMs + $set * $dayMs / 24) / 1000) : null;

    return ['moonrise' => $moonrise, 'moonset' => $moonset];
}

// Endpoint handling
switch (strtolower($endpoint)) {
    case 'birthchart':
        $dob = isset($_GET['dob']) ? $_GET['dob'] : (isset($jsonBody['dob']) ? $jsonBody['dob'] : '1990-01-01');
        $tob = isset($_GET['tob']) ? $_GET['tob'] : (isset($jsonBody['tob']) ? $jsonBody['tob'] : '12:00');
        $lat = isset($_GET['latitude']) ? (float)$_GET['latitude'] : (isset($jsonBody['latitude']) ? (float)$jsonBody['latitude'] : 17.3850);
        $lon = isset($_GET['longitude']) ? (float)$_GET['longitude'] : (isset($jsonBody['longitude']) ? (float)$jsonBody['longitude'] : 78.4867);
        $tz = isset($_GET['timezone']) ? (float)$_GET['timezone'] : (isset($jsonBody['timezone']) ? (float)$jsonBody['timezone'] : 5.5);
        $ayanamsha = isset($_GET['ayanamsha']) ? $_GET['ayanamsha'] : (isset($jsonBody['ayanamsha']) ? $jsonBody['ayanamsha'] : 'lahiri');
        $rahuMode = isset($_GET['rahu_mode']) ? $_GET['rahu_mode'] : (isset($jsonBody['rahu_mode']) ? $jsonBody['rahu_mode'] : 'mean');

        $dobParts = array_map('intval', explode('-', $dob));
        $tobParts = array_map('floatval', explode(':', $tob));
        $year = $dobParts[0]; $month = $dobParts[1]; $day = $dobParts[2];
        $hour = isset($tobParts[0]) ? (int)$tobParts[0] : 12;
        $minute = isset($tobParts[1]) ? (int)$tobParts[1] : 0;
        $second = isset($tobParts[2]) ? (int)$tobParts[2] : 0;

        $engine = VedicAstroEngine::fromBirthData($year, $month, $day, $hour, $minute, $tz, $ayanamsha, $second, $rahuMode);
        $planets = $engine->calculateAll($lat, $lon);

        $sunLon = isset($planets[Planet::SUN]) ? $planets[Planet::SUN]['longitude'] : 0;
        $moonLon = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['longitude'] : 0;
        $panchanga = $engine->calcPanchanga($sunLon, $moonLon);

        $lagnaRashi = isset($planets[Planet::ASCENDANT]) ? $planets[Planet::ASCENDANT]['rashi'] : 1;
        $houses = $engine->calcHouses($lagnaRashi);

        $d9 = $engine->calcNavamsa($planets);
        $d3 = $engine->calcDrekkanaD3($planets);
        $d7 = $engine->calcSaptamshaD7($planets);
        $d10 = $engine->calcDasamshaD10($planets);
        $d12 = $engine->calcDwadashamshaD12($planets);
        $d2 = $engine->calcHoraD2($planets);
        $d4 = $engine->calcChaturthamshaD4($planets);
        $d16 = $engine->calcShodashamshaD16($planets);
        $d20 = $engine->calcVimshamshaD20($planets);
        $d24 = $engine->calcChaturvimshamshaD24($planets);
        $d27 = $engine->calcSaptavimshamshaD27($planets);
        $d30 = $engine->calcTrimshamshaD30($planets);
        $d60 = $engine->calcShashtiamshaD60($planets);

        $moonNakIdx = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['nak_index'] : 0;
        $degInNak = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['deg_in_nak'] : 0;
        $dashas = $engine->calcVimshottariDasha($moonNakIdx, $degInNak, $dob);

        $shadabala = $engine->calcShadabala($planets, $lagnaRashi);
        $ashtakavarga = VedicAstroEngine::calcAshtakavarga($planets, $lagnaRashi);

        $dateUtc = gmmktime($hour, $minute, $second, $month, $day, $year);
        $timestamp = $dateUtc - (int)round($tz * 3600);
        $riseSet = VedicAstroEngine::getRiseSetTimes(0, $dob, $lon, $lat, $tz);
        $sunriseTs = $riseSet['rise'] ?: ($timestamp - 43200);
        $sunsetTs = $riseSet['set'] ?: ($timestamp + 43200);
        $mDayDuration = max(1, $sunsetTs - $sunriseTs);

        $mVaaraNum = (int)gmdate('w', $timestamp + (int)round($tz * 3600));
        if ($timestamp < $sunriseTs) {
            $mVaaraNum = ($mVaaraNum - 1 + 7) % 7;
        }

        $rahuRatios = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
        $yamaRatios = [0.5, 0.375, 0.25, 0.125, 0.0, 0.75, 0.625];
        $gulikaRatios = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0.0];

        $rahuStart = $sunriseTs + (int)floor($mDayDuration * $rahuRatios[$mVaaraNum]);
        $rahuEnd = $rahuStart + (int)floor($mDayDuration * 0.125);
        $yamaStart = $sunriseTs + (int)floor($mDayDuration * $yamaRatios[$mVaaraNum]);
        $yamaEnd = $yamaStart + (int)floor($mDayDuration * 0.125);
        $gulikaStart = $sunriseTs + (int)floor($mDayDuration * $gulikaRatios[$mVaaraNum]);
        $gulikaEnd = $gulikaStart + (int)floor($mDayDuration * 0.125);

        $varjyamStr = calculateVarjyamPHP($planets, $timestamp, $tz);

        $extendedPanchanga = array_merge($panchanga, [
            'rahu_kalam' => formatTsLocalPHP($rahuStart, $tz) . " - " . formatTsLocalPHP($rahuEnd, $tz),
            'yamagandam' => formatTsLocalPHP($yamaStart, $tz) . " - " . formatTsLocalPHP($yamaEnd, $tz),
            'gulika_kalam' => formatTsLocalPHP($gulikaStart, $tz) . " - " . formatTsLocalPHP($gulikaEnd, $tz),
            'durmuhurtham' => "-",
            'varjyam' => $varjyamStr,
        ]);

        sendJson([
            'meta' => [
                'dob' => $dob,
                'tob' => $tob,
                'latitude' => $lat,
                'longitude' => $lon,
                'timezone' => $tz,
                'ayanamsha' => (float)number_format($engine->getAyanamsha(), 6, '.', ''),
                'ayanamsha_name' => $engine->getAyanamshaName(),
                'sunrise' => formatTsLocalPHP($sunriseTs, $tz),
                'sunset' => formatTsLocalPHP($sunsetTs, $tz),
                'engine' => $engine->isUsingSwetest() ? "swetest (Swiss Ephemeris)" : "Math fallback",
            ],
            'planets' => $planets,
            'houses' => $houses,
            'navamsa_d9' => $d9,
            'd2' => $d2,
            'd3' => $d3,
            'd4' => $d4,
            'd7' => $d7,
            'd10' => $d10,
            'd12' => $d12,
            'd16' => $d16,
            'd20' => $d20,
            'd24' => $d24,
            'd27' => $d27,
            'd30' => $d30,
            'd60' => $d60,
            'dashas' => $dashas,
            'panchanga' => $extendedPanchanga,
            'shadabala' => $shadabala,
            'ashtakavarga' => $ashtakavarga,
            'chart' => buildChartGridPHP($planets),
            'chart_d9' => buildChartGridPHP($d9),
        ]);
        break;

    case 'match':
        $boyDob = isset($_GET['boy_dob']) ? $_GET['boy_dob'] : (isset($jsonBody['boy_dob']) ? $jsonBody['boy_dob'] : '1995-05-15');
        $boyTob = isset($_GET['boy_tob']) ? $_GET['boy_tob'] : (isset($jsonBody['boy_tob']) ? $jsonBody['boy_tob'] : '10:30');
        $boyLat = isset($_GET['boy_latitude']) ? (float)$_GET['boy_latitude'] : (isset($_GET['boy_lat']) ? (float)$_GET['boy_lat'] : (isset($jsonBody['boy_latitude']) ? (float)$jsonBody['boy_latitude'] : 17.3850));
        $boyLon = isset($_GET['boy_longitude']) ? (float)$_GET['boy_longitude'] : (isset($_GET['boy_lon']) ? (float)$_GET['boy_lon'] : (isset($jsonBody['boy_longitude']) ? (float)$jsonBody['boy_longitude'] : 78.4867));
        $boyTz = isset($_GET['boy_timezone']) ? (float)$_GET['boy_timezone'] : (isset($_GET['boy_tz']) ? (float)$_GET['boy_tz'] : (isset($jsonBody['boy_timezone']) ? (float)$jsonBody['boy_timezone'] : 5.5));

        $girlDob = isset($_GET['girl_dob']) ? $_GET['girl_dob'] : (isset($jsonBody['girl_dob']) ? $jsonBody['girl_dob'] : '1995-05-15');
        $girlTob = isset($_GET['girl_tob']) ? $_GET['girl_tob'] : (isset($jsonBody['girl_tob']) ? $jsonBody['girl_tob'] : '10:30');
        $girlLat = isset($_GET['girl_latitude']) ? (float)$_GET['girl_latitude'] : (isset($_GET['girl_lat']) ? (float)$_GET['girl_lat'] : (isset($jsonBody['girl_latitude']) ? (float)$jsonBody['girl_latitude'] : 17.3850));
        $girlLon = isset($_GET['girl_longitude']) ? (float)$_GET['girl_longitude'] : (isset($_GET['girl_lon']) ? (float)$_GET['girl_lon'] : (isset($jsonBody['girl_longitude']) ? (float)$jsonBody['girl_longitude'] : 78.4867));
        $girlTz = isset($_GET['girl_timezone']) ? (float)$_GET['girl_timezone'] : (isset($_GET['girl_tz']) ? (float)$_GET['girl_tz'] : (isset($jsonBody['girl_timezone']) ? (float)$jsonBody['girl_timezone'] : 5.5));

        $ayanamsha = isset($_GET['ayanamsha']) ? $_GET['ayanamsha'] : (isset($jsonBody['ayanamsha']) ? $jsonBody['ayanamsha'] : 'lahiri');
        $rahuMode = isset($_GET['rahu_mode']) ? $_GET['rahu_mode'] : (isset($jsonBody['rahu_mode']) ? $jsonBody['rahu_mode'] : 'mean');

        // Boy
        $bParts = array_map('intval', explode('-', $boyDob));
        $bTobParts = array_map('floatval', explode(':', $boyTob));
        $bEngine = VedicAstroEngine::fromBirthData($bParts[0], $bParts[1], $bParts[2], (int)$bTobParts[0], (int)$bTobParts[1], $boyTz, $ayanamsha, 0, $rahuMode);
        $bPlanets = $bEngine->calculateAll($boyLat, $boyLon);
        $bNavamsa = $bEngine->calcNavamsa($bPlanets);
        $bMoon = isset($bPlanets[Planet::MOON]) ? $bPlanets[Planet::MOON] : null;

        // Girl
        $gParts = array_map('intval', explode('-', $girlDob));
        $gTobParts = array_map('floatval', explode(':', $girlTob));
        $gEngine = VedicAstroEngine::fromBirthData($gParts[0], $gParts[1], $gParts[2], (int)$gTobParts[0], (int)$gTobParts[1], $girlTz, $ayanamsha, 0, $rahuMode);
        $gPlanets = $gEngine->calculateAll($girlLat, $girlLon);
        $gNavamsa = $gEngine->calcNavamsa($gPlanets);
        $gMoon = isset($gPlanets[Planet::MOON]) ? $gPlanets[Planet::MOON] : null;

        sendJson([
            'endpoint' => 'match',
            'ayanamsha' => $bEngine->getAyanamshaName(),
            'boy' => [
                'moon' => $bMoon,
                'planets' => $bPlanets,
                'navamsa' => $bNavamsa,
                'chart' => [
                    'planets' => $bPlanets,
                    'navamsa_d9' => $bNavamsa,
                    'chart' => buildChartGridPHP($bPlanets),
                    'chart_d9' => buildChartGridPHP($bNavamsa),
                ],
            ],
            'girl' => [
                'moon' => $gMoon,
                'planets' => $gPlanets,
                'navamsa' => $gNavamsa,
                'chart' => [
                    'planets' => $gPlanets,
                    'navamsa_d9' => $gNavamsa,
                    'chart' => buildChartGridPHP($gPlanets),
                    'chart_d9' => buildChartGridPHP($gNavamsa),
                ],
            ]
        ]);
        break;

    case 'clock':
        $lat = isset($_GET['lat']) ? (float)$_GET['lat'] : (isset($_GET['latitude']) ? (float)$_GET['latitude'] : (isset($jsonBody['lat']) ? (float)$jsonBody['lat'] : 17.3850));
        $lon = isset($_GET['lon']) ? (float)$_GET['lon'] : (isset($_GET['longitude']) ? (float)$_GET['longitude'] : (isset($jsonBody['lon']) ? (float)$jsonBody['lon'] : 78.4867));
        $tz = isset($_GET['tz']) ? (float)$_GET['tz'] : (isset($_GET['timezone']) ? (float)$_GET['timezone'] : (isset($jsonBody['tz']) ? (float)$jsonBody['tz'] : 5.5));
        $timestamp = isset($_GET['timestamp']) && !empty($_GET['timestamp']) ? (int)$_GET['timestamp'] : time();
        if (abs($timestamp) > 9999999999) $timestamp = (int)floor($timestamp / 1000);
        $ayKey = isset($_GET['ayanamsha']) ? $_GET['ayanamsha'] : 'lahiri';

        $utcTs = $timestamp + (int)round($tz * 3600);
        $year = (int)gmdate('Y', $utcTs);
        $month = (int)gmdate('n', $utcTs);
        $day = (int)gmdate('j', $utcTs);
        $hour = (int)gmdate('G', $utcTs);
        $minute = (int)gmdate('i', $utcTs);

        $engine = VedicAstroEngine::fromBirthData($year, $month, $day, $hour, $minute, $tz, $ayKey);
        $planets = $engine->calculateAll($lat, $lon);
        $lagnaRashi = isset($planets[Planet::ASCENDANT]) ? $planets[Planet::ASCENDANT]['rashi'] : 1;
        $sunLon = isset($planets[Planet::SUN]) ? $planets[Planet::SUN]['longitude'] : 0;
        $moonLon = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['longitude'] : 0;
        $panchanga = $engine->calcPanchanga($sunLon, $moonLon);

        $sunSpeed = isset($planets[Planet::SUN]['speed']) ? (float)$planets[Planet::SUN]['speed'] : 0.9856;
        $moonSpeed = isset($planets[Planet::MOON]['speed']) ? (float)$planets[Planet::MOON]['speed'] : 13.176;
        if ($moonSpeed <= 0) $moonSpeed = 13.176;

        $tithiSpeed = $moonSpeed - $sunSpeed;
        if ($tithiSpeed <= 0) $tithiSpeed = 12.19;
        $yogaSpeed = $moonSpeed + $sunSpeed;
        if ($yogaSpeed <= 0) $yogaSpeed = 14.16;

        $diff = fmod(fmod($moonLon - $sunLon, 360.0) + 360.0, 360.0);

        $tithiRemDeg = 12.0 - fmod($diff, 12.0);
        $tithiEndTs = $timestamp + (int)floor(($tithiRemDeg / $tithiSpeed) * 86400);
        $tithiEndTs = findExactTimePHP(
            $tithiEndTs,
            "tithi",
            (floor($diff / 12.0) + 1) * 12.0,
            $lat,
            $lon,
            $tz,
            $ayKey,
            !$engine->isUsingSwetest()
        );

        $nakLen = 360.0 / 27.0;
        $nakRemDeg = $nakLen - fmod($moonLon, $nakLen);
        $nakEndTs = $timestamp + (int)floor(($nakRemDeg / $moonSpeed) * 86400);
        $nakEndTs = findExactTimePHP(
            $nakEndTs,
            "nakshatra",
            (floor($moonLon / $nakLen) + 1) * $nakLen,
            $lat,
            $lon,
            $tz,
            $ayKey,
            !$engine->isUsingSwetest()
        );

        $yogaVal = fmod($moonLon + $sunLon, 360.0);
        $yogaRemDeg = $nakLen - fmod($yogaVal, $nakLen);
        $yogaEndTs = $timestamp + (int)floor(($yogaRemDeg / $yogaSpeed) * 86400);
        $yogaEndTs = findExactTimePHP(
            $yogaEndTs,
            "yoga",
            (floor($yogaVal / $nakLen) + 1) * $nakLen,
            $lat,
            $lon,
            $tz,
            $ayKey,
            !$engine->isUsingSwetest()
        );

        $karanaRemDeg = 6.0 - fmod($diff, 6.0);
        $karanaEndTs = $timestamp + (int)floor(($karanaRemDeg / $tithiSpeed) * 86400);
        $karanaEndTs = findExactTimePHP(
            $karanaEndTs,
            "karana",
            (floor($diff / 6.0) + 1) * 6.0,
            $lat,
            $lon,
            $tz,
            $ayKey,
            !$engine->isUsingSwetest()
        );

        $ascLon = isset($planets[Planet::ASCENDANT]['longitude']) ? (float)$planets[Planet::ASCENDANT]['longitude'] : 0.0;
        $lagnaRemDeg = 30.0 - fmod($ascLon, 30.0);
        $lagnaEndTsPrecise = $timestamp + (int)floor($lagnaRemDeg * 240);

        $sunRS = getPreciseSunriseSunsetPHP($timestamp, $lat, $lon, $tz);
        $sunriseTs = $sunRS['sunrise'];
        $sunsetTs = $sunRS['sunset'];

        if ($timestamp < $sunriseTs) {
            $prevRS = getPreciseSunriseSunsetPHP($timestamp - 86400, $lat, $lon, $tz);
            $baseTs = $prevRS['sunset'];
            $endTs = $sunriseTs;
            $isDay = false;
            $vaaraStartTs = $prevRS['sunrise'];
            $vaaraEndTs = $sunriseTs;
            $wd = (int)gmdate('w', $timestamp - 86400 + (int)round($tz * 3600));
        } else if ($timestamp < $sunsetTs) {
            $baseTs = $sunriseTs;
            $endTs = $sunsetTs;
            $isDay = true;
            $nextRS = getPreciseSunriseSunsetPHP($timestamp + 86400, $lat, $lon, $tz);
            $vaaraStartTs = $sunriseTs;
            $vaaraEndTs = $nextRS['sunrise'];
            $wd = (int)gmdate('w', $timestamp + (int)round($tz * 3600));
        } else {
            $nextRS = getPreciseSunriseSunsetPHP($timestamp + 86400, $lat, $lon, $tz);
            $baseTs = $sunsetTs;
            $endTs = $nextRS['sunrise'];
            $isDay = false;
            $vaaraStartTs = $sunriseTs;
            $vaaraEndTs = $nextRS['sunrise'];
            $wd = (int)gmdate('w', $timestamp + (int)round($tz * 3600));
        }

        $duration = max(0.1, $endTs - $baseTs);
        $muhDuration = max(0.1, $duration / 15.0);
        $mIdx = max(0, min(14, (int)floor(($timestamp - $baseTs) / $muhDuration)));
        $dayMuhurthas = [
            "Rudra", "Ahi", "Mitra", "Pitru", "Vasu", "Varaaha", "Viswedeva", "Vidhi",
            "Satamukhi", "Puruhuta", "Vaahini", "Nakshatra", "Varuna", "Aryamana", "Bhaga"
        ];
        $nightMuhurthas = [
            "Gireesha", "Ajapaada", "Ahir-budha", "Pushya", "Ashwini", "Yama", "Agni",
            "Vidhaata", "Kanda", "Adithi", "Jiva/Amrutha", "Vishnu", "Dyumadgadyuti", "Brahma", "Samudra"
        ];
        $currMuhurtha = $isDay ? $dayMuhurthas[$mIdx] : $nightMuhurthas[$mIdx];
        $muhurthaEndTs = (int)floor($baseTs + ($mIdx + 1) * $muhDuration);
        $badMuhurthas = [
            "Rudra", "Ahi", "Pitru", "Vaahini", "Nakshatra", "Bhaga",
            "Gireesha", "Ahir-budha", "Yama", "Agni"
        ];

        $horaDur = max(0.1, $duration / 12.0);
        $hIdx = max(0, min(11, (int)floor(($timestamp - $baseTs) / $horaDur)));
        if (!$isDay) $hIdx += 12;

        $horaLords = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
        $horaLordsJs = [
            'Sun' => 'Surya',
            'Venus' => 'Shukra',
            'Mercury' => 'Budha',
            'Moon' => 'Chandra',
            'Saturn' => 'Shani',
            'Jupiter' => 'Guru',
            'Mars' => 'Kuja',
        ];
        $horaLordsKey = [
            'Sun' => 'Su',
            'Venus' => 'Sk',
            'Mercury' => 'Bu',
            'Moon' => 'Mo',
            'Saturn' => 'Sa',
            'Jupiter' => 'Gu',
            'Mars' => 'Ku',
        ];
        $wdStartIdx = [0, 3, 6, 2, 5, 1, 4];
        $currentHoraEng = $horaLords[($wdStartIdx[$wd] + $hIdx) % 7];
        $horaLordCode = $horaLordsKey[$currentHoraEng];
        $horaEndTs = (int)floor($baseTs + (($hIdx % 12) + 1) * $horaDur);

        $clockData = [
            'endpoint' => 'clock',
            'meta' => [
                'timestamp' => $timestamp,
                'datetime' => gmdate('Y-m-d\TH:i:s\Z', $timestamp),
                'lat' => $lat,
                'lon' => $lon,
                'tz' => $tz,
                'engine' => $engine->isUsingSwetest() ? "swetest" : "fallback",
            ]
        ];

        $planetMap = [
            'Sun' => 'Su', 'Moon' => 'Mo', 'Mars' => 'Ku', 'Mercury' => 'Bu',
            'Jupiter' => 'Gu', 'Venus' => 'Sk', 'Saturn' => 'Sa', 'Rahu' => 'Ra', 'Ketu' => 'Ke'
        ];

        foreach ($planetMap as $phpKey => $jsKey) {
            if (isset($planets[$phpKey])) {
                $p = $planets[$phpKey];
                $isR = false;
                if (!in_array($phpKey, ['Sun', 'Moon', 'Rahu', 'Ketu'])) {
                    $isR = !empty($p['retrograde']) || (isset($p['speed']) && $p['speed'] < -0.001);
                }
                $clockData[$jsKey] = [
                    'angle' => isset($p['longitude']) ? $p['longitude'] : 0,
                    'isR' => $isR,
                    'isC' => !empty($p['combust']),
                    'isH' => $jsKey === $horaLordCode,
                ];
            }
        }

        $clockData['lagna'] = $ascLon;
        if (isset($clockData['Mo'])) {
            $tIndex = (int)floor($diff / 12.0);
            $clockData['Mo']['tithi_num'] = ($tIndex % 15) + 1;
            $clockData['Mo']['paksha'] = $tIndex < 15 ? "Shukla" : "Krishna";
        }

        $pPaksha = !empty($panchanga['paksha']) ? explode(' ', $panchanga['paksha'])[0] : '';
        $rashiNames = ["", "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];

        $clockData['sunrise'] = $sunriseTs;
        $clockData['panchanga'] = [
            'vaara' => str_replace('vara', '', strtolower($panchanga['vara'] ?? '')),
            'vaara_end' => formatTsLocalPHP($vaaraEndTs, $tz),
            'vaara_end_ts' => $vaaraEndTs,
            'vaara_rem' => (int)floor((($vaaraEndTs - $timestamp) / max(1, $vaaraEndTs - $vaaraStartTs)) * 100),
            'tithi' => trim($pPaksha . ' ' . ($panchanga['tithi'] ?? '')),
            'tithi_end' => formatTsLocalPHP($tithiEndTs, $tz),
            'tithi_end_ts' => $tithiEndTs,
            'tithi_rem' => (int)floor(($tithiRemDeg / 12.0) * 100),
            'nakshatra' => ($panchanga['moon_nakshatra'] ?? '') . " (P" . ($panchanga['moon_pada'] ?? 1) . ")",
            'nakshatra_end' => formatTsLocalPHP($nakEndTs, $tz),
            'nakshatra_end_ts' => $nakEndTs,
            'nakshatra_rem' => (int)floor(($nakRemDeg / $nakLen) * 100),
            'yoga' => $panchanga['yoga'] ?? '',
            'yoga_end' => formatTsLocalPHP($yogaEndTs, $tz),
            'yoga_end_ts' => $yogaEndTs,
            'yoga_rem' => (int)floor(($yogaRemDeg / $nakLen) * 100),
            'karana' => $panchanga['karana'] ?? '',
            'karana_end' => formatTsLocalPHP($karanaEndTs, $tz),
            'karana_end_ts' => $karanaEndTs,
            'karana_rem' => (int)floor(($karanaRemDeg / 6.0) * 100),
            'muhurtha' => $currMuhurtha,
            'muhurtha_end' => formatTsLocalPHP($muhurthaEndTs, $tz),
            'muhurtha_end_ts' => $muhurthaEndTs,
            'muhurtha_rem' => (int)floor((($muhurthaEndTs - $timestamp) / max(1, $muhDuration)) * 100),
            'muhurtha_is_good' => !in_array($currMuhurtha, $badMuhurthas),
            'hora' => isset($horaLordsJs[$currentHoraEng]) ? $horaLordsJs[$currentHoraEng] : $currentHoraEng,
            'hora_end' => formatTsLocalPHP($horaEndTs, $tz),
            'hora_end_ts' => $horaEndTs,
            'hora_rem' => (int)floor((($horaEndTs - $timestamp) / max(1, $horaDur)) * 100),
            'lagna' => isset($rashiNames[$lagnaRashi]) ? $rashiNames[$lagnaRashi] : 'Mesha',
            'lagna_end' => formatTsLocalPHP($lagnaEndTsPrecise, $tz),
            'lagna_end_ts' => $lagnaEndTsPrecise,
            'lagna_rem' => (int)floor(($lagnaRemDeg / 30.0) * 100),
        ];

        sendJson($clockData);
        break;

    case 'panchanga_table':
        $fromDate = isset($_GET['from_date']) ? $_GET['from_date'] : (isset($_GET['date']) ? $_GET['date'] : (isset($jsonBody['from_date']) ? $jsonBody['from_date'] : (isset($jsonBody['date']) ? $jsonBody['date'] : date('Y-m-d'))));
        $days = isset($_GET['days']) ? min(90, max(1, (int)$_GET['days'])) : (isset($jsonBody['days']) ? min(90, max(1, (int)$jsonBody['days'])) : 10);
        $lat = isset($_GET['latitude']) ? (float)$_GET['latitude'] : (isset($_GET['lat']) ? (float)$_GET['lat'] : (isset($jsonBody['latitude']) ? (float)$jsonBody['latitude'] : (isset($jsonBody['lat']) ? (float)$jsonBody['lat'] : 17.3850)));
        $lon = isset($_GET['longitude']) ? (float)$_GET['longitude'] : (isset($_GET['lon']) ? (float)$_GET['lon'] : (isset($jsonBody['longitude']) ? (float)$jsonBody['longitude'] : (isset($jsonBody['lon']) ? (float)$jsonBody['lon'] : 78.4867)));
        $tz = isset($_GET['timezone']) ? (float)$_GET['timezone'] : (isset($_GET['tz']) ? (float)$_GET['tz'] : (isset($jsonBody['timezone']) ? (float)$jsonBody['timezone'] : (isset($jsonBody['tz']) ? (float)$jsonBody['tz'] : 5.5)));
        $ayKey = isset($_GET['ayanamsha']) ? $_GET['ayanamsha'] : (isset($jsonBody['ayanamsha']) ? $jsonBody['ayanamsha'] : 'lahiri');

        $boyNak = isset($_GET['boy_nakshatra']) ? $_GET['boy_nakshatra'] : (isset($jsonBody['boy_nakshatra']) ? $jsonBody['boy_nakshatra'] : null);
        $girlNak = isset($_GET['girl_nakshatra']) ? $_GET['girl_nakshatra'] : (isset($jsonBody['girl_nakshatra']) ? $jsonBody['girl_nakshatra'] : null);

        $fastMode = $days > 30;

        $parts = array_map('intval', explode('-', $fromDate));
        $startYear = $parts[0]; $startMonth = $parts[1]; $startDay = $parts[2];
        $startUtcTs = gmmktime(6, 0, 0, $startMonth, $startDay, $startYear);
        $startTs = $startUtcTs;

        $tithiNames = ["Prathama","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dvadashi","Trayodashi","Chaturdashi"];
        $nakNames = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Arudra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
        $yogaNames = ["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
        $karanaNames = ["Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti","Kimstughna","Shakuni","Chatushpada","Naga"];
        $vaaraNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        $rashiNames = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"];
        $lunarMonths = ["Chaitra","Vaisakha","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashwayuja","Kartika","Margashirsha","Pausha","Magha","Phalguna"];
        $nakToRasi = [
            0 => [0], 1 => [0], 2 => [0, 1], 3 => [1], 4 => [1, 2], 5 => [2], 6 => [2, 3], 7 => [3], 8 => [3], 9 => [4], 10 => [4], 11 => [4, 5],
            12 => [5], 13 => [5, 6], 14 => [6], 15 => [6, 7], 16 => [7], 17 => [7], 18 => [8], 19 => [8], 20 => [8, 9], 21 => [9], 22 => [9, 10],
            23 => [10], 24 => [10, 11], 25 => [11], 26 => [11]
        ];
        $taraNames = [1 => "Janma", 2 => "Sampat", 3 => "Vipat", 4 => "Kshema", 5 => "Pratyak", 6 => "Sadhana", 7 => "Naidhana", 8 => "Mitra", 0 => "Parama Mitra"];

        // Lunar month tracking (Amavasya detection)
        $lastAmTs = $startTs;
        $lastAmSunLon = 0;
        for ($d = 0; $d <= 35; $d++) {
            $checkTs = $startTs - $d * 86400;
            $checkUtcTs = (int)round($checkTs + ($tz * 3600));
            $y = (int)gmdate('Y', $checkUtcTs);
            $m = (int)gmdate('n', $checkUtcTs);
            $day = (int)gmdate('j', $checkUtcTs);
            $e = VedicAstroEngine::fromBirthData($y, $m, $day, 6, 0, $tz, $ayKey);
            $r = getDiffLonPHP($e, $lat, $lon, true);
            if ((int)floor($r['diff'] / 12) === 29) {
                $lastAmTs = $checkTs;
                $lastAmSunLon = getMidnightSunLonPHP($checkTs, $lat, $lon, $tz, $ayKey, true);
                break;
            }
        }

        $nextAmTs = $startTs + 30 * 86400;
        $nextAmSunLon = 0;
        for ($d = 1; $d <= 35; $d++) {
            $checkTs = $lastAmTs + $d * 86400;
            $checkUtcTs = (int)round($checkTs + ($tz * 3600));
            $y = (int)gmdate('Y', $checkUtcTs);
            $m = (int)gmdate('n', $checkUtcTs);
            $day = (int)gmdate('j', $checkUtcTs);
            $e = VedicAstroEngine::fromBirthData($y, $m, $day, 6, 0, $tz, $ayKey);
            $r = getDiffLonPHP($e, $lat, $lon, true);
            if ((int)floor($r['diff'] / 12) === 29) {
                $nextAmTs = $checkTs;
                $nextAmSunLon = getMidnightSunLonPHP($checkTs, $lat, $lon, $tz, $ayKey, true);
                break;
            }
        }

        $lastAmSunRashi = (int)floor(fmod($lastAmSunLon, 360) / 30);
        $nextAmSunRashi = (int)floor(fmod($nextAmSunLon, 360) / 30);
        $currentMasaName = $lunarMonths[($lastAmSunRashi + 1) % 12];
        $isAdhika = ($nextAmSunRashi === $lastAmSunRashi);
        $prevMonthWasAdhika = false;

        $results = [];
        $curTs = $startTs;

        for ($i = 0; $i < $days; $i++) {
            while ($curTs > $nextAmTs) {
                $prevMonthWasAdhika = $isAdhika;
                $lastAmTs = $nextAmTs;
                $lastAmSunLon = $nextAmSunLon;
                $lastAmSunRashi = $nextAmSunRashi;
                $currentMasaName = $lunarMonths[($lastAmSunRashi + 1) % 12];
                $nextAmTs = $lastAmTs + 30 * 86400;
                for ($d = 1; $d <= 35; $d++) {
                    $checkTs = $lastAmTs + $d * 86400;
                    $checkUtcTs = (int)round($checkTs + ($tz * 3600));
                    $y = (int)gmdate('Y', $checkUtcTs);
                    $m = (int)gmdate('n', $checkUtcTs);
                    $day = (int)gmdate('j', $checkUtcTs);
                    $e = VedicAstroEngine::fromBirthData($y, $m, $day, 6, 0, $tz, $ayKey);
                    $r = getDiffLonPHP($e, $lat, $lon, true);
                    if ((int)floor($r['diff'] / 12) === 29) {
                        $nextAmTs = $checkTs;
                        $nextAmSunLon = getMidnightSunLonPHP($checkTs, $lat, $lon, $tz, $ayKey, true);
                        break;
                    }
                }
                $nextAmSunRashi = (int)floor(fmod($nextAmSunLon, 360) / 30);
                $isAdhika = ($nextAmSunRashi === $lastAmSunRashi);
            }

            $masaDisplay = $isAdhika
                ? "Adhika " . $currentMasaName
                : ($prevMonthWasAdhika ? "Nija " . $currentMasaName : $currentMasaName);

            $curDtUtc = (int)round($curTs + ($tz * 3600));
            $dateStr = gmdate('d-M-Y', $curDtUtc);

            $sunRS = getPreciseSunriseSunsetPHP($curTs, $lat, $lon, $tz);
            $sunriseTs = $sunRS['sunrise'];
            $sunsetTs = $sunRS['sunset'];

            $srDtUtc = (int)round($sunriseTs + ($tz * 3600));
            $srY = (int)gmdate('Y', $srDtUtc);
            $srM = (int)gmdate('n', $srDtUtc);
            $srD = (int)gmdate('j', $srDtUtc);
            $srH = (int)gmdate('G', $srDtUtc);
            $srMin = (int)gmdate('i', $srDtUtc);
            $srSec = (int)gmdate('s', $srDtUtc);

            $engine = VedicAstroEngine::fromBirthData($srY, $srM, $srD, $srH, $srMin, $tz, $ayKey, $srSec);
            if ($fastMode) {
                $engine->setSwetest(false);
            }
            $planets = $engine->calculateAll($lat, $lon);

            $sunLon = isset($planets[Planet::SUN]['longitude']) ? $planets[Planet::SUN]['longitude'] : 0;
            $sunSpeed = isset($planets[Planet::SUN]['speed']) ? $planets[Planet::SUN]['speed'] : 0.9856;
            $moonLon = isset($planets[Planet::MOON]['longitude']) ? $planets[Planet::MOON]['longitude'] : 0;
            $moonSpeed = isset($planets[Planet::MOON]['speed']) ? $planets[Planet::MOON]['speed'] : 13.176;

            $tSpeed = max(0.1, $moonSpeed - $sunSpeed);
            $ySpeed = max(0.1, $moonSpeed + $sunSpeed);
            $diff = fmod($moonLon - $sunLon + 360.0, 360.0);

            $tIndex = (int)floor($diff / 12.0);
            $tRem = 12.0 - fmod($diff, 12.0);
            $tEndTs = $sunriseTs + (int)floor(($tRem / $tSpeed) * 86400);
            $tEndTs = findExactTimePHP($tEndTs, "tithi", ($tIndex + 1) * 12.0, $lat, $lon, $tz, $ayKey, $fastMode);
            $tithiName = ($tIndex === 14)
                ? "Purnima"
                : (($tIndex === 29) ? "Amavasya" : (($tIndex < 15 ? "S-" : "K-") . $tithiNames[$tIndex % 15]));

            $nakLen = 360.0 / 27.0;
            $nakIndex = (int)floor($moonLon / $nakLen);
            $nEndTs = $sunriseTs + (int)floor((($nakLen - fmod($moonLon, $nakLen)) / $moonSpeed) * 86400);
            $nEndTs = findExactTimePHP($nEndTs, "nakshatra", ($nakIndex + 1) * $nakLen, $lat, $lon, $tz, $ayKey, $fastMode);
            $nakName = $nakNames[$nakIndex];

            $yVal = fmod($moonLon + $sunLon, 360.0);
            $yIndex = (int)floor($yVal / $nakLen);
            $yEndTs = $sunriseTs + (int)floor((($nakLen - fmod($yVal, $nakLen)) / $ySpeed) * 86400);
            $yEndTs = findExactTimePHP($yEndTs, "yoga", ($yIndex + 1) * $nakLen, $lat, $lon, $tz, $ayKey, $fastMode);
            $yogaName = $yogaNames[$yIndex];

            $kIndex = (int)floor($diff / 6.0);
            $kEndTs = $sunriseTs + (int)floor(((6.0 - fmod($diff, 6.0)) / $tSpeed) * 86400);
            $kEndTs = findExactTimePHP($kEndTs, "karana", ($kIndex + 1) * 6.0, $lat, $lon, $tz, $ayKey, $fastMode);
            $karanaName = ($kIndex === 0) ? "Kimstughna"
                : (($kIndex === 57) ? "Shakuni"
                : (($kIndex === 58) ? "Chatushpada"
                : (($kIndex === 59) ? "Naga" : $karanaNames[($kIndex - 1) % 7])));

            $vaaraNum = (int)gmdate('w', $curDtUtc);
            $moonRasiIdx = (int)floor($moonLon / 30.0);

            // Astangatha (Jupiter / Venus Combustion)
            $asthg = [];
            foreach ([Planet::JUPITER, Planet::VENUS] as $p) {
                if (!isset($planets[$p])) continue;
                $cLimit = ($p === Planet::JUPITER) ? 11 : ((isset($planets[$p]['speed']) && $planets[$p]['speed'] < 0) ? 8 : 10);
                $pDiff = abs($planets[$p]['longitude'] - $sunLon);
                $pDiff = min(fmod($pDiff, 360.0), 360.0 - fmod($pDiff, 360.0));
                if ($pDiff <= $cLimit) {
                    $asthg[] = ($p === Planet::JUPITER) ? "Gu" : "Sk";
                }
            }

            // Inauspicious & Timing windows
            $dayDur = $sunsetTs - $sunriseTs;
            $rahuRatios = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
            $yamaRatios = [0.5, 0.375, 0.25, 0.125, 0.0, 0.75, 0.625];
            $gulikaRatios = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0.0];

            $rkStartTs = $sunriseTs + (int)floor($dayDur * $rahuRatios[$vaaraNum]);
            $ygStartTs = $sunriseTs + (int)floor($dayDur * $yamaRatios[$vaaraNum]);
            $gkStartTs = $sunriseTs + (int)floor($dayDur * $gulikaRatios[$vaaraNum]);

            $durmuhurthams = [
                0 => [13],
                1 => [8, 11],
                2 => [3, 10],
                3 => [5],
                4 => [8],
                5 => [3, 8],
                6 => [1],
            ];
            $durTimes = [];
            foreach ($durmuhurthams[$vaaraNum] ?? [] as $mIdx) {
                $mStart = $sunriseTs + (int)floor($dayDur * ($mIdx / 15.0));
                $mEnd = $sunriseTs + (int)floor($dayDur * (($mIdx + 1) / 15.0));
                $durTimes[] = formatTsLocalPHP($mStart, $tz) . " - " . formatTsLocalPHP($mEnd, $tz);
            }

            // Varjyam calculation
            $mSpeedSafe = max(0.1, $moonSpeed);
            $degPassed = fmod($moonLon, $nakLen);
            $nakStartTs1 = $sunriseTs - (int)floor(($degPassed / $mSpeedSafe) * 86400);
            $nakStartTs1 = findExactTimePHP($nakStartTs1, "nakshatra", $nakIndex * $nakLen, $lat, $lon, $tz, $ayKey, $fastMode);

            $varjyamGhatis = [
                50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14,
                56, 24, 20, 10, 10, 18, 16, 24, 30
            ];
            $vStart1 = $nakStartTs1 + (int)floor($varjyamGhatis[$nakIndex] * 1440);
            $vEnd1 = $vStart1 + 5760;
            $nakIndex2 = ($nakIndex + 1) % 27;
            $vStart2 = $nEndTs + (int)floor($varjyamGhatis[$nakIndex2] * 1440);
            $vEnd2 = $vStart2 + 5760;

            $varjyams = [];
            $windowStart = $sunriseTs - 3600;
            $windowEnd = $sunriseTs + 86400 + 3600;
            if ($vEnd1 > $windowStart && $vStart1 < $windowEnd) {
                $varjyams[] = formatTsLocalPHP($vStart1, $tz) . " - " . formatTsLocalPHP($vEnd1, $tz);
            }
            if ($vEnd2 > $windowStart && $vStart2 < $windowEnd) {
                $varjyams[] = formatTsLocalPHP($vStart2, $tz) . " - " . formatTsLocalPHP($vEnd2, $tz);
            }

            $row = [
                'Date' => $dateStr,
                'Vaara' => $vaaraNames[$vaaraNum],
                'Vaara_is_good' => true,
                'Asthg' => count($asthg) ? implode(",", $asthg) : "-",
                'Maasa' => $masaDisplay,
                'Tithi' => $tithiName,
                'Tithi End' => formatTsLocalPHP($tEndTs, $tz),
                'Tithi_End' => formatTsLocalPHP($tEndTs, $tz),
                'Tithi_is_good' => true,
                'Sunrise' => formatTsLocalPHP($sunriseTs, $tz),
                'Nakshatra' => $nakName,
                'Nakshatra End' => formatTsLocalPHP($nEndTs, $tz),
                'Nakshatra_End' => formatTsLocalPHP($nEndTs, $tz),
                'Nakshatra_is_good' => true,
                'Moon Rasi' => $rashiNames[$moonRasiIdx],
                'Moon_Rasi' => $rashiNames[$moonRasiIdx],
                'Yoga' => $yogaName,
                'Yoga End' => formatTsLocalPHP($yEndTs, $tz),
                'Yoga_End' => formatTsLocalPHP($yEndTs, $tz),
                'Yoga_is_good' => true,
                'Karana' => $karanaName,
                'Karana End' => formatTsLocalPHP($kEndTs, $tz),
                'Karana_End' => formatTsLocalPHP($kEndTs, $tz),
                'Karana_is_good' => true,
                'Rahu Kalam' => formatTsLocalPHP($rkStartTs, $tz) . " - " . formatTsLocalPHP($rkStartTs + (int)floor($dayDur * 0.125), $tz),
                'Rahu_Kalam' => formatTsLocalPHP($rkStartTs, $tz) . " - " . formatTsLocalPHP($rkStartTs + (int)floor($dayDur * 0.125), $tz),
                'Yamagandam' => formatTsLocalPHP($ygStartTs, $tz) . " - " . formatTsLocalPHP($ygStartTs + (int)floor($dayDur * 0.125), $tz),
                'Gulika Kalam' => formatTsLocalPHP($gkStartTs, $tz) . " - " . formatTsLocalPHP($gkStartTs + (int)floor($dayDur * 0.125), $tz),
                'Durmuhurtham' => count($durTimes) ? implode(", ", $durTimes) : "-",
                'Varjyam' => count($varjyams) ? implode(", ", $varjyams) : "-",
                'Girl Tarabalam' => "",
                'Girl_Tarabalam' => "",
                'Girl Chandra Balam' => "",
                'Girl_Chandra_Balam' => "",
                'Boy Tarabalam' => "",
                'Boy_Tarabalam' => "",
                'Boy Chandra Balam' => "",
                'Boy_Chandra_Balam' => "",
            ];

            if ($boyNak) {
                $idx = array_search($boyNak, $nakNames);
                if ($idx !== false) {
                    $val = $taraNames[((($nakIndex - $idx + 27) % 27) + 1) % 9];
                    $row['Boy Tarabalam'] = $val;
                    $row['Boy_Tarabalam'] = $val;
                    $row['Boy_Tarabalam_is_good'] = true;
                    $isAshtama = in_array(($moonRasiIdx + 5) % 12, $nakToRasi[$idx]);
                    $cbVal = $isAshtama ? "Ashtama" : "Good";
                    $row['Boy Chandra Balam'] = $cbVal;
                    $row['Boy_Chandra_Balam'] = $cbVal;
                    $row['Boy_Chandra_Balam_is_good'] = !$isAshtama;
                }
            }
            if ($girlNak) {
                $idx = array_search($girlNak, $nakNames);
                if ($idx !== false) {
                    $val = $taraNames[((($nakIndex - $idx + 27) % 27) + 1) % 9];
                    $row['Girl Tarabalam'] = $val;
                    $row['Girl_Tarabalam'] = $val;
                    $row['Girl_Tarabalam_is_good'] = true;
                    $isAshtama = in_array(($moonRasiIdx + 5) % 12, $nakToRasi[$idx]);
                    $cbVal = $isAshtama ? "Ashtama" : "Good";
                    $row['Girl Chandra Balam'] = $cbVal;
                    $row['Girl_Chandra_Balam'] = $cbVal;
                    $row['Girl_Chandra_Balam_is_good'] = !$isAshtama;
                }
            }

            $results[] = $row;
            $curTs += 86400;
        }

        sendJson($results);
        break;

    case 'muhurtha_chart':
        $dateStr = isset($_GET['date']) ? $_GET['date'] : (isset($jsonBody['date']) ? $jsonBody['date'] : date('Y-m-d'));
        $timeStr = isset($_GET['time']) ? $_GET['time'] : (isset($jsonBody['time']) ? $jsonBody['time'] : '12:00:00');
        $lat = isset($_GET['lat']) ? (float)$_GET['lat'] : (isset($_GET['latitude']) ? (float)$_GET['latitude'] : (isset($jsonBody['lat']) ? (float)$jsonBody['lat'] : 17.3850));
        $lon = isset($_GET['lon']) ? (float)$_GET['lon'] : (isset($_GET['longitude']) ? (float)$_GET['longitude'] : (isset($jsonBody['lon']) ? (float)$jsonBody['lon'] : 78.4867));
        $tz = isset($_GET['tz']) ? (float)$_GET['tz'] : (isset($_GET['timezone']) ? (float)$_GET['timezone'] : (isset($jsonBody['tz']) ? (float)$jsonBody['tz'] : 5.5));
        $ayKey = isset($_GET['ayanamsha']) ? $_GET['ayanamsha'] : (isset($jsonBody['ayanamsha']) ? $jsonBody['ayanamsha'] : 'lahiri');
        $rahuMode = isset($_GET['rahu_mode']) ? $_GET['rahu_mode'] : (isset($jsonBody['rahu_mode']) ? $jsonBody['rahu_mode'] : 'mean');

        $parts = array_map('intval', explode('-', $dateStr));
        $tParts = array_map('floatval', explode(':', $timeStr));
        $year = $parts[0]; $month = $parts[1]; $day = $parts[2];
        $hour = isset($tParts[0]) ? (int)$tParts[0] : 12;
        $minute = isset($tParts[1]) ? (int)$tParts[1] : 0;
        $second = isset($tParts[2]) ? (int)$tParts[2] : 0;

        $engine = VedicAstroEngine::fromBirthData($year, $month, $day, $hour, $minute, $tz, $ayKey, $second, $rahuMode);
        $planets = $engine->calculateAll($lat, $lon);
        $navamsa = $engine->calcNavamsa($planets);
        $sunLon = isset($planets[Planet::SUN]) ? $planets[Planet::SUN]['longitude'] : 0;
        $moonLon = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['longitude'] : 0;
        $panchanga = $engine->calcPanchanga($sunLon, $moonLon);

        $ascDeg = isset($planets[Planet::ASCENDANT]) ? $planets[Planet::ASCENDANT]['degree'] : 0.0;
        $degWhole = (int)floor($ascDeg);
        $degMin = (int)floor(($ascDeg - $degWhole) * 60);
        $lagnaLabel = "{$degWhole}°{$degMin}'";
        $lagnaRemPct = (int)round(((30.0 - $ascDeg) / 30.0) * 100);

        $rashiNames = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
        $lagnaRashi = isset($planets[Planet::ASCENDANT]) ? $planets[Planet::ASCENDANT]['rashi'] : 1;
        $lagnaName = $rashiNames[$lagnaRashi - 1];

        $dateUtc = gmmktime($hour, $minute, $second, $month, $day, $year);
        $timestamp = $dateUtc - (int)round($tz * 3600);

        $sunRS = getPreciseSunriseSunsetPHP($timestamp, $lat, $lon, $tz);
        $mSunriseTs = $sunRS['sunrise'];
        $mSunsetTs = $sunRS['sunset'];
        if ($timestamp < $mSunriseTs) {
            $prevRS = getPreciseSunriseSunsetPHP($timestamp - 86400, $lat, $lon, $tz);
            $mBaseTs = $prevRS['sunset'];
            $mEndTs = $mSunriseTs;
            $mIsDay = false;
            $mVaaraNum = (int)gmdate('w', $timestamp - 86400 + (int)round($tz * 3600));
        } else if ($timestamp < $mSunsetTs) {
            $mBaseTs = $mSunriseTs;
            $mEndTs = $mSunsetTs;
            $mIsDay = true;
            $nextRS = getPreciseSunriseSunsetPHP($timestamp + 86400, $lat, $lon, $tz);
            $mVaaraNum = (int)gmdate('w', $timestamp + (int)round($tz * 3600));
        } else {
            $nextRS = getPreciseSunriseSunsetPHP($timestamp + 86400, $lat, $lon, $tz);
            $mBaseTs = $mSunsetTs;
            $mEndTs = $nextRS['sunrise'];
            $mIsDay = false;
            $mVaaraNum = (int)gmdate('w', $timestamp + (int)round($tz * 3600));
        }

        $mDuration = max(1, $mEndTs - $mBaseTs);
        $mMuhurthaDuration = $mDuration / 15.0;
        $mIndex = max(0, min(14, (int)floor(($timestamp - $mBaseTs) / $mMuhurthaDuration)));
        $mDayMuhurthas = [
            "Rudra", "Ahi", "Mitra", "Pitru", "Vasu", "Varaaha", "Viswedeva", "Vidhi",
            "Satamukhi", "Puruhuta", "Vaahini", "Nakshatra", "Varuna", "Aryamana", "Bhaga"
        ];
        $mNightMuhurthas = [
            "Gireesha", "Ajapaada", "Ahir-budha", "Pushya", "Ashwini", "Yama", "Agni",
            "Vidhaata", "Kanda", "Adithi", "Jiva/Amrutha", "Vishnu", "Dyumadgadyuti", "Brahma", "Samudra"
        ];
        $mBadMuhurthas = [
            "Rudra", "Ahi", "Pitru", "Vaahini", "Nakshatra", "Bhaga",
            "Gireesha", "Ahir-budha", "Yama", "Agni"
        ];
        $mCurrent = $mIsDay ? $mDayMuhurthas[$mIndex] : $mNightMuhurthas[$mIndex];
        $mEndTime = (int)floor($mBaseTs + ($mIndex + 1) * $mMuhurthaDuration);
        $mDayDuration = max(1, $mSunsetTs - $mSunriseTs);

        $rahuRatios = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
        $yamaRatios = [0.5, 0.375, 0.25, 0.125, 0.0, 0.75, 0.625];
        $gulikaRatios = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0.0];

        $rahuStart = $mSunriseTs + (int)floor($mDayDuration * $rahuRatios[$mVaaraNum]);
        $rahuEnd = $rahuStart + (int)floor($mDayDuration * 0.125);
        $yamaStart = $mSunriseTs + (int)floor($mDayDuration * $yamaRatios[$mVaaraNum]);
        $yamaEnd = $yamaStart + (int)floor($mDayDuration * 0.125);
        $gulikaStart = $mSunriseTs + (int)floor($mDayDuration * $gulikaRatios[$mVaaraNum]);
        $gulikaEnd = $gulikaStart + (int)floor($mDayDuration * 0.125);

        $durmuhurthams = [
            0 => [13],
            1 => [8, 11],
            2 => [3, 10],
            3 => [5],
            4 => [8],
            5 => [3, 8],
            6 => [1],
        ];
        $durTimes = [];
        foreach ($durmuhurthams[$mVaaraNum] as $mdIdx) {
            $mStart = $mSunriseTs + (int)floor($mDayDuration * ($mdIdx / 15.0));
            $mEnd = $mSunriseTs + (int)floor($mDayDuration * (($mdIdx + 1) / 15.0));
            $durTimes[] = formatTsLocalPHP($mStart, $tz) . " - " . formatTsLocalPHP($mEnd, $tz);
        }

        $startLagnaTs = $timestamp - 3600;
        $endLagnaTs = $timestamp + 3600;
        $midTs = (int)floor(($startLagnaTs + $endLagnaTs) / 2);
        $midWindow = formatTsLocalPHP($midTs - 1800, $tz) . " to " . formatTsLocalPHP($midTs + 1800, $tz);

        $pushkaraMap = [
            1=>[21,24], 5=>[21,24], 9=>[21,24],
            2=>[14,17], 6=>[14,17], 10=>[14,17],
            3=>[24,27], 7=>[24,27], 11=>[24,27],
            4=>[7,10], 8=>[7,10], 12=>[7,10]
        ];
        $pDegs = $pushkaraMap[$lagnaRashi] ?? [21, 24];
        $nearestP = $pDegs[0];
        $minDiff = abs($ascDeg - $pDegs[0]);
        if (isset($pDegs[1])) {
            $d2 = abs($ascDeg - $pDegs[1]);
            if ($d2 < $minDiff) { $minDiff = $d2; $nearestP = $pDegs[1]; }
        }
        $isPushkara = $minDiff <= 1.5;
        $pushkaramshaLabel = ($isPushkara ? "Yes" : "No") . " (Nearest: {$nearestP}°, Diff: " . number_format($minDiff, 2) . "°)";
        $pushkaraTime = formatTsLocalPHP($timestamp - 900, $tz) . " - " . formatTsLocalPHP($timestamp + 900, $tz);

        $hinduWd = $mVaaraNum + 1;
        $tithiNum = $panchanga['tithi_number'] ?? 1;
        $nakNum = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['nak_index'] + 1 : 1;
        $totalSum = $hinduWd + $tithiNum + $nakNum + $lagnaRashi;
        $pRem = $totalSum % 9;
        $panchakaMap = [
            1 => ["Mrityu (Bad)", false],
            2 => ["Agni (Bad)", false],
            4 => ["Raja (Bad)", false],
            6 => ["Chora (Bad)", false],
            8 => ["Roga (Bad)", false],
        ];
        $pRes = $panchakaMap[$pRem] ?? ["Shubham (Good)", true];
        $panchakaLabel = $pRes[0] . " [Total:{$totalSum}]";
        $panchakaGood = $pRes[1];

        $rashiTyajyaStarts = [1=>30, 2=>16, 3=>23, 4=>2, 5=>21, 6=>14, 7=>10, 8=>20, 9=>9, 10=>4, 11=>23, 12=>11];
        $startPart = $rashiTyajyaStarts[$lagnaRashi] ?? 1;
        $tyajyaStart = $startLagnaTs + (int)floor(7200 * ($startPart - 1) / 30);
        $tyajyaEnd = $tyajyaStart + 720;
        $lagnaTyajyamStr = formatTsLocalPHP($tyajyaStart, $tz) . " - " . formatTsLocalPHP($tyajyaEnd, $tz);

        $varjyamStr = calculateVarjyamPHP($planets, $timestamp, $tz);

        $doshas = [];
        $moonHouse = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['house'] : 0;
        $marsHouse = isset($planets[Planet::MARS]) ? $planets[Planet::MARS]['house'] : 0;
        $venusHouse = isset($planets[Planet::VENUS]) ? $planets[Planet::VENUS]['house'] : 0;
        $saturnHouse = isset($planets[Planet::SATURN]) ? $planets[Planet::SATURN]['house'] : 0;

        $houseHasGraha = [];
        foreach ([Planet::SUN, Planet::MOON, Planet::MARS, Planet::MERCURY, Planet::JUPITER, Planet::VENUS, Planet::SATURN, Planet::RAHU, Planet::KETU] as $p) {
            if (isset($planets[$p]['house'])) $houseHasGraha[$planets[$p]['house']] = true;
        }
        if ($saturnHouse === 7 || !empty($houseHasGraha[7])) $doshas[] = "Saptamastha Graha";
        if (in_array($moonHouse, [6, 8, 12])) $doshas[] = "Shashtashta Chandra";

        $moonRashi = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['rashi'] : 0;
        foreach ([Planet::SUN, Planet::MARS, Planet::MERCURY, Planet::JUPITER, Planet::VENUS, Planet::SATURN, Planet::RAHU, Planet::KETU] as $p) {
            if (isset($planets[$p]['rashi']) && $planets[$p]['rashi'] === $moonRashi) {
                $doshas[] = "Sagraha Chandra Dosha";
                break;
            }
        }
        if ($venusHouse === 6) $doshas[] = "Bhrigu Shatka";
        if ($marsHouse === 8) $doshas[] = "Ashtamastha Kuja";
        if (isset($planets[Planet::MOON]) && in_array($planets[Planet::MOON]['nakshatra'], ["Ashlesha", "Jyeshtha", "Revati"]) && $planets[Planet::MOON]['pada'] === 4) {
            $doshas[] = "Gandanta (Moon)";
        }
        if (!empty($planets[Planet::JUPITER]['combust']) || !empty($planets[Planet::VENUS]['combust'])) {
            $doshas[] = "Asthangatha";
        }
        if (!$panchakaGood) $doshas[] = "Bad Panchakam";
        if ($timestamp >= $rahuStart && $timestamp <= $rahuEnd) $doshas[] = "Rahu Kalam";
        if ($timestamp >= $yamaStart && $timestamp <= $yamaEnd) $doshas[] = "Yamagandam";

        sendJson([
            'endpoint' => 'muhurtha_chart',
            'ayanamsha_name' => $engine->getAyanamshaName(),
            'chart' => buildChartGridPHP($planets),
            'chart_d9' => buildChartGridPHP($navamsa),
            'lagna_deg' => $lagnaLabel,
            'lagna_rem_pct' => $lagnaRemPct,
            'lagna_name' => $lagnaName,
            'lagna_start' => formatTsLocalPHP($startLagnaTs, $tz),
            'lagna_end' => formatTsLocalPHP($endLagnaTs, $tz),
            'pushkaramsha' => $pushkaramshaLabel,
            'is_pushkara' => $isPushkara,
            'pushkaramsha_time' => $pushkaraTime,
            'mid_lagna_window' => $midWindow,
            'current_muhurtha' => $mCurrent,
            'current_muhurtha_start' => formatTsLocalPHP((int)floor($mBaseTs + $mIndex * $mMuhurthaDuration), $tz),
            'current_muhurtha_end' => formatTsLocalPHP($mEndTime, $tz),
            'muhurtha_is_good' => !in_array($mCurrent, $mBadMuhurthas),
            'panchaka' => $panchakaLabel,
            'panchaka_is_good' => $panchakaGood,
            'rahu_kalam' => formatTsLocalPHP($rahuStart, $tz) . " - " . formatTsLocalPHP($rahuEnd, $tz),
            'yamagandam' => formatTsLocalPHP($yamaStart, $tz) . " - " . formatTsLocalPHP($yamaEnd, $tz),
            'gulika_kalam' => formatTsLocalPHP($gulikaStart, $tz) . " - " . formatTsLocalPHP($gulikaEnd, $tz),
            'durmuhurtham' => implode(', ', $durTimes),
            'varjyam' => $varjyamStr,
            'lagna_tyajyam' => $lagnaTyajyamStr,
            'doshas' => $doshas,
        ]);
        break;

    case 'precision_test':
        $dob = isset($_GET['dob']) ? $_GET['dob'] : (isset($jsonBody['dob']) ? $jsonBody['dob'] : '1990-01-01');
        $tob = isset($_GET['tob']) ? $_GET['tob'] : (isset($jsonBody['tob']) ? $jsonBody['tob'] : '12:00:00');
        $lat = isset($_GET['latitude']) ? (float)$_GET['latitude'] : (isset($_GET['lat']) ? (float)$_GET['lat'] : (isset($jsonBody['latitude']) ? (float)$jsonBody['latitude'] : 17.3850));
        $lon = isset($_GET['longitude']) ? (float)$_GET['longitude'] : (isset($_GET['lon']) ? (float)$_GET['lon'] : (isset($jsonBody['longitude']) ? (float)$jsonBody['longitude'] : 78.4867));
        $tz = isset($_GET['timezone']) ? (float)$_GET['timezone'] : (isset($_GET['tz']) ? (float)$_GET['tz'] : (isset($jsonBody['timezone']) ? (float)$jsonBody['timezone'] : 5.5));
        $ayKey = isset($_GET['ayanamsha']) ? $_GET['ayanamsha'] : 'lahiri';
        $rahuMode = isset($_GET['rahu_mode']) ? $_GET['rahu_mode'] : 'mean';

        $dobParts = array_map('intval', explode('-', $dob));
        $tobParts = array_map('floatval', explode(':', $tob));
        $year = $dobParts[0]; $month = $dobParts[1]; $day = $dobParts[2];
        $hour = (int)$tobParts[0]; $minute = (int)$tobParts[1]; $second = isset($tobParts[2]) ? (int)$tobParts[2] : 0;

        $dateUtc = gmmktime($hour, $minute, $second, $month, $day, $year);
        $timestamp = $dateUtc - (int)round($tz * 3600);
        $targetLocalTs = $timestamp;
        $nakLen = 360.0 / 27.0;

        // Rise / Set Calculations matching Node SunCalc vs Swetest
        $fbSunRS = getSunCalcTimesPHP($dob, $lat, $lon, $tz);
        $fbMoonRS = getSunCalcMoonTimesPHP($dob, $lat, $lon, $tz);
        $precSunRS = VedicAstroEngine::getRiseSetTimes(0, $dob, $lon, $lat, $tz);
        $precMoonRS = VedicAstroEngine::getRiseSetTimes(1, $dob, $lon, $lat, $tz);

        // Fallback Panchanga
        $fbEngine = VedicAstroEngine::fromBirthData($year, $month, $day, $hour, $minute, $tz, $ayKey, $second, $rahuMode);
        $fbEngine->setSwetest(false);
        $fbPlanets = $fbEngine->calculateAll($lat, $lon);
        $fbSunLon = isset($fbPlanets[Planet::SUN]) ? $fbPlanets[Planet::SUN]['longitude'] : 0;
        $fbMoonLon = isset($fbPlanets[Planet::MOON]) ? $fbPlanets[Planet::MOON]['longitude'] : 0;
        $fbPanchanga = $fbEngine->calcPanchanga($fbSunLon, $fbMoonLon);
        $fbSunSpeed = isset($fbPlanets[Planet::SUN]['speed']) ? $fbPlanets[Planet::SUN]['speed'] : 0.9856;
        $fbMoonSpeed = isset($fbPlanets[Planet::MOON]['speed']) ? $fbPlanets[Planet::MOON]['speed'] : 13.176;
        $fbTSpeed = max(0.1, $fbMoonSpeed - $fbSunSpeed);
        $fbYSpeed = max(0.1, $fbMoonSpeed + $fbSunSpeed);

        $fbDiff = fmod($fbMoonLon - $fbSunLon + 360, 360);
        $fbTIndex = (int)floor($fbDiff / 12);
        $fbTRem = 12.0 - fmod($fbDiff, 12.0);
        $fbTEndApprox = $targetLocalTs + (int)floor(($fbTRem / $fbTSpeed) * 86400);
        $fbTithiEnd = findExactTimePHP($fbTEndApprox, "tithi", ($fbTIndex + 1) * 12.0, $lat, $lon, $tz, $ayKey, true);

        $fbNakIndex = (int)floor($fbMoonLon / $nakLen);
        $fbNakRem = $nakLen - fmod($fbMoonLon, $nakLen);
        $fbNEndApprox = $targetLocalTs + (int)floor(($fbNakRem / $fbMoonSpeed) * 86400);
        $fbNakshatraEnd = findExactTimePHP($fbNEndApprox, "nakshatra", ($fbNakIndex + 1) * $nakLen, $lat, $lon, $tz, $ayKey, true);

        $fbYogaDiff = fmod($fbSunLon + $fbMoonLon, 360);
        $fbYogaIndex = (int)floor($fbYogaDiff / $nakLen);
        $fbYogaRem = $nakLen - fmod($fbYogaDiff, $nakLen);
        $fbYEndApprox = $targetLocalTs + (int)floor(($fbYogaRem / $fbYSpeed) * 86400);
        $fbYogaEnd = findExactTimePHP($fbYEndApprox, "yoga", ($fbYogaIndex + 1) * $nakLen, $lat, $lon, $tz, $ayKey, true);

        $fbKaranaIndex = (int)floor($fbDiff / 6.0);
        $fbKaranaRem = 6.0 - fmod($fbDiff, 6.0);
        $fbKEndApprox = $targetLocalTs + (int)floor(($fbKaranaRem / $fbTSpeed) * 86400);
        $fbKaranaEnd = findExactTimePHP($fbKEndApprox, "karana", ($fbKaranaIndex + 1) * 6.0, $lat, $lon, $tz, $ayKey, true);

        // Precise Panchanga (Swetest)
        $precEngine = VedicAstroEngine::fromBirthData($year, $month, $day, $hour, $minute, $tz, $ayKey, $second, $rahuMode);
        $precEngine->setSwetest(true);
        $precPlanets = $precEngine->calculateAll($lat, $lon);
        $precSunLon = isset($precPlanets[Planet::SUN]) ? $precPlanets[Planet::SUN]['longitude'] : 0;
        $precMoonLon = isset($precPlanets[Planet::MOON]) ? $precPlanets[Planet::MOON]['longitude'] : 0;
        $precPanchanga = $precEngine->calcPanchanga($precSunLon, $precMoonLon);
        $precSunSpeed = isset($precPlanets[Planet::SUN]['speed']) ? $precPlanets[Planet::SUN]['speed'] : 0.9856;
        $precMoonSpeed = isset($precPlanets[Planet::MOON]['speed']) ? $precPlanets[Planet::MOON]['speed'] : 13.176;
        $precTSpeed = max(0.1, $precMoonSpeed - $precSunSpeed);
        $precYSpeed = max(0.1, $precMoonSpeed + $precSunSpeed);

        $precDiff = fmod($precMoonLon - $precSunLon + 360, 360);
        $precTIndex = (int)floor($precDiff / 12);
        $precTRem = 12.0 - fmod($precDiff, 12.0);
        $precTEndApprox = $targetLocalTs + (int)floor(($precTRem / $precTSpeed) * 86400);
        $precTithiEnd = findExactTimePHP($precTEndApprox, "tithi", ($precTIndex + 1) * 12.0, $lat, $lon, $tz, $ayKey, false);

        $precNakIndex = (int)floor($precMoonLon / $nakLen);
        $precNakRem = $nakLen - fmod($precMoonLon, $nakLen);
        $precNEndApprox = $targetLocalTs + (int)floor(($precNakRem / $precMoonSpeed) * 86400);
        $precNakshatraEnd = findExactTimePHP($precNEndApprox, "nakshatra", ($precNakIndex + 1) * $nakLen, $lat, $lon, $tz, $ayKey, false);

        $precYogaDiff = fmod($precSunLon + $precMoonLon, 360);
        $precYogaIndex = (int)floor($precYogaDiff / $nakLen);
        $precYogaRem = $nakLen - fmod($precYogaDiff, $nakLen);
        $precYEndApprox = $targetLocalTs + (int)floor(($precYogaRem / $precYSpeed) * 86400);
        $precYogaEnd = findExactTimePHP($precYEndApprox, "yoga", ($precYogaIndex + 1) * $nakLen, $lat, $lon, $tz, $ayKey, false);

        $precKaranaIndex = (int)floor($precDiff / 6.0);
        $precKaranaRem = 6.0 - fmod($precDiff, 6.0);
        $precKEndApprox = $targetLocalTs + (int)floor(($precKaranaRem / $precTSpeed) * 86400);
        $precKaranaEnd = findExactTimePHP($precKEndApprox, "karana", ($precKaranaIndex + 1) * 6.0, $lat, $lon, $tz, $ayKey, false);

        sendJson([
            'meta' => [
                'dob' => $dob,
                'tob' => $tob,
                'timezone' => $tz,
                'latitude' => $lat,
                'longitude' => $lon,
                'ayanamsha' => $ayKey,
                'targetLocalTs' => $timestamp,
                'engine' => $precEngine->isUsingSwetest() ? "swetest (Swiss Ephemeris)" : "Math fallback",
            ],
            'riseSet' => [
                'fallback' => [
                    'sunrise' => $fbSunRS['sunrise'],
                    'sunset' => $fbSunRS['sunset'],
                    'moonrise' => $fbMoonRS['moonrise'],
                    'moonset' => $fbMoonRS['moonset'],
                ],
                'precise' => [
                    'sunrise' => $precSunRS['rise'],
                    'sunset' => $precSunRS['set'],
                    'moonrise' => $precMoonRS['rise'],
                    'moonset' => $precMoonRS['set'],
                ]
            ],
            'panchanga' => [
                'fallback' => [
                    'tithi' => $fbPanchanga['tithi'] ?? '',
                    'tithi_number' => $fbPanchanga['tithi_number'] ?? 1,
                    'tithi_end' => $fbTithiEnd,
                    'nakshatra' => $fbPanchanga['moon_nakshatra'] ?? '',
                    'nakshatra_end' => $fbNakshatraEnd,
                    'yoga' => $fbPanchanga['yoga'] ?? '',
                    'yoga_end' => $fbYogaEnd,
                    'karana' => $fbPanchanga['karana'] ?? '',
                    'karana_end' => $fbKaranaEnd,
                    'vara' => $fbPanchanga['vara'] ?? '',
                    'paksha' => $fbPanchanga['paksha'] ?? '',
                    'ayanamsha' => (float)number_format($fbEngine->getAyanamsha(), 6, '.', ''),
                    'ayanamsha_name' => $fbEngine->getAyanamshaName(),
                ],
                'precise' => [
                    'tithi' => $precPanchanga['tithi'] ?? '',
                    'tithi_number' => $precPanchanga['tithi_number'] ?? 1,
                    'tithi_end' => $precTithiEnd,
                    'nakshatra' => $precPanchanga['moon_nakshatra'] ?? '',
                    'nakshatra_end' => $precNakshatraEnd,
                    'yoga' => $precPanchanga['yoga'] ?? '',
                    'yoga_end' => $precYogaEnd,
                    'karana' => $precPanchanga['karana'] ?? '',
                    'karana_end' => $precKaranaEnd,
                    'vara' => $precPanchanga['vara'] ?? '',
                    'paksha' => $precPanchanga['paksha'] ?? '',
                    'ayanamsha' => (float)number_format($precEngine->getAyanamsha(), 6, '.', ''),
                    'ayanamsha_name' => $precEngine->getAyanamshaName(),
                ],
            ]
        ]);
        break;

    case 'get_lessons':
        $filePath = __DIR__ . '/lessons.json';
        if (file_exists($filePath)) {
            $data = json_decode(file_get_contents($filePath), true);
            if (is_array($data)) {
                if (isset($data['lessons'])) {
                    sendJson($data);
                } else {
                    sendJson(['lessons' => $data]);
                }
            } else {
                sendJson(['lessons' => []]);
            }
        } else {
            sendJson(['lessons' => []]);
        }
        break;

    case 'save_lessons':
        if (!verifyAdminPassword($jsonBody, $headers)) {
            http_response_code(403);
            sendJson(["error" => "Forbidden", "detail" => "Invalid admin password."]);
        }
        $lessons = isset($jsonBody['lessons']) ? $jsonBody['lessons'] : (is_array($jsonBody) ? $jsonBody : []);
        file_put_contents(__DIR__ . '/lessons.json', json_encode(['lessons' => $lessons], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["status" => "success", "success" => true, "message" => "Lessons saved successfully."]);
        break;

    case 'get_library':
        $filePath = __DIR__ . '/library.json';
        if (file_exists($filePath)) {
            $data = json_decode(file_get_contents($filePath), true);
            if (is_array($data)) {
                if (isset($data['library'])) {
                    sendJson($data['library']);
                } else {
                    sendJson($data);
                }
            } else {
                sendJson([]);
            }
        } else {
            sendJson([]);
        }
        break;

    case 'save_library':
        if (!verifyAdminPassword($jsonBody, $headers)) {
            http_response_code(403);
            sendJson(["error" => "Forbidden", "detail" => "Invalid admin password."]);
        }
        $library = isset($jsonBody['library']) ? $jsonBody['library'] : (is_array($jsonBody) ? $jsonBody : []);
        file_put_contents(__DIR__ . '/library.json', json_encode($library, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["status" => "success", "success" => true, "message" => "Library saved successfully."]);
        break;

    case 'get_ticker':
        $filePath = __DIR__ . '/ticker.json';
        if (file_exists($filePath)) {
            sendJson(json_decode(file_get_contents($filePath), true));
        } else {
            sendJson([]);
        }
        break;

    case 'save_ticker':
        if (!verifyAdminPassword($jsonBody, $headers)) {
            http_response_code(403);
            sendJson(["error" => "Forbidden", "detail" => "Invalid admin password."]);
        }
        $ticker = isset($jsonBody['ticker']) ? $jsonBody['ticker'] : (is_array($jsonBody) ? $jsonBody : []);
        file_put_contents(__DIR__ . '/ticker.json', json_encode($ticker, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["status" => "success", "success" => true, "message" => "Ticker saved successfully."]);
        break;

    case 'register_student':
        $firstName = isset($jsonBody['first_name']) ? trim($jsonBody['first_name']) : (isset($_POST['first_name']) ? trim($_POST['first_name']) : '');
        $lastName = isset($jsonBody['last_name']) ? trim($jsonBody['last_name']) : (isset($_POST['last_name']) ? trim($_POST['last_name']) : '');
        $countryCode = isset($jsonBody['country_code']) ? trim($jsonBody['country_code']) : (isset($_POST['country_code']) ? trim($_POST['country_code']) : '+91');
        $whatsappNumber = isset($jsonBody['whatsapp_number']) ? trim($jsonBody['whatsapp_number']) : (isset($_POST['whatsapp_number']) ? trim($_POST['whatsapp_number']) : '');
        $language = isset($jsonBody['language']) ? trim($jsonBody['language']) : (isset($_POST['language']) ? trim($_POST['language']) : 'Telugu');
        $courses = isset($jsonBody['courses']) ? $jsonBody['courses'] : (isset($_POST['courses']) ? $_POST['courses'] : []);
        $email = isset($jsonBody['email']) ? trim($jsonBody['email']) : (isset($_POST['email']) ? trim($_POST['email']) : '');
        $address = isset($jsonBody['address']) ? trim($jsonBody['address']) : (isset($_POST['address']) ? trim($_POST['address']) : '');

        if (empty($firstName) || empty($lastName) || empty($whatsappNumber)) {
            http_response_code(400);
            sendJson(["success" => false, "error" => "Validation Error", "message" => "First Name, Last Name, and WhatsApp Number are required."]);
            break;
        }

        $cleanWhatsapp = preg_replace('/[^0-9]/', '', $whatsappNumber);

        $filePath = __DIR__ . '/students.json';
        $students = [];
        if (file_exists($filePath)) {
            $existingData = json_decode(file_get_contents($filePath), true);
            if (is_array($existingData)) {
                $students = $existingData;
            }
        }

        // Check if student with this WhatsApp number already exists
        foreach ($students as $student) {
            $existingCleanWa = preg_replace('/[^0-9]/', '', $student['whatsapp_number'] ?? '');
            $existingCountry = $student['country_code'] ?? '+91';
            if ($existingCleanWa === $cleanWhatsapp && $existingCountry === $countryCode) {
                http_response_code(400);
                sendJson([
                    "success" => false,
                    "error" => "Already Registered",
                    "message" => "A student with this WhatsApp number ($countryCode $whatsappNumber) is already registered."
                ]);
                break 2;
            }
        }

        $currentYear = date("Y");
        $prefix = "STU-" . $currentYear . "-";

        $maxSeq = 0;
        foreach ($students as $student) {
            if (isset($student['id']) && strpos($student['id'], $prefix) === 0) {
                $seqVal = (int)substr($student['id'], strlen($prefix));
                if ($seqVal > $maxSeq) {
                    $maxSeq = $seqVal;
                }
            }
        }

        if ($maxSeq === 0 && !empty($students)) {
            $yearCount = 0;
            foreach ($students as $student) {
                $regYear = isset($student['created_at']) ? date('Y', strtotime($student['created_at'])) : '';
                if ($regYear === $currentYear) {
                    $yearCount++;
                }
            }
            $maxSeq = $yearCount;
        }

        $nextSeq = $maxSeq + 1;
        $studentId = $prefix . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);

        $batchId = trim($jsonBody['batch_id'] ?? ($jsonBody['batch'] ?? ''));
        $batchList = $batchId ? [$batchId] : (is_array($jsonBody['batches'] ?? null) ? $jsonBody['batches'] : []);

        $newStudent = [
            "id" => $studentId,
            "first_name" => $firstName,
            "last_name" => $lastName,
            "country_code" => $countryCode,
            "whatsapp_number" => $whatsappNumber,
            "full_phone" => $countryCode . " " . $whatsappNumber,
            "language" => $language,
            "courses" => is_array($courses) ? $courses : [$courses],
            "batch_id" => $batchId,
            "batches" => $batchList,
            "email" => $email,
            "address" => $address,
            "status" => "pending",
            "created_at" => date("c"),
        ];

        $students[] = $newStudent;
        file_put_contents($filePath, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        sendJson([
            "success" => true,
            "message" => "Student registered successfully!",
            "student" => $newStudent
        ]);
        break;

    case 'get_students':
        $filePath = __DIR__ . '/students.json';
        if (file_exists($filePath)) {
            $students = json_decode(file_get_contents($filePath), true) ?: [];
            sendJson(["success" => true, "students" => $students]);
        } else {
            sendJson(["success" => true, "students" => []]);
        }
        break;

    case 'update_student':
        $filePath = __DIR__ . '/students.json';
        $students = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $studentId = $jsonBody['student_id'] ?? ($_POST['student_id'] ?? '');
        if (!$studentId) { sendJson(["success" => false, "message" => "Student ID required."], 400); break; }
        $found = false;
        foreach ($students as &$stu) {
            if (isset($stu['id']) && $stu['id'] === $studentId) {
                if (isset($jsonBody['first_name']))      $stu['first_name']      = trim($jsonBody['first_name']);
                if (isset($jsonBody['last_name']))       $stu['last_name']       = trim($jsonBody['last_name']);
                if (isset($jsonBody['whatsapp_number'])) $stu['whatsapp_number'] = trim($jsonBody['whatsapp_number']);
                if (isset($jsonBody['country_code']))    $stu['country_code']    = trim($jsonBody['country_code']);
                if (isset($jsonBody['language']))        $stu['language']        = trim($jsonBody['language']);
                if (isset($jsonBody['courses']))         $stu['courses']         = is_array($jsonBody['courses']) ? $jsonBody['courses'] : [$jsonBody['courses']];
                if (isset($jsonBody['batch_id']))        $stu['batch_id']        = trim($jsonBody['batch_id']);
                if (isset($jsonBody['email']))           $stu['email']           = trim($jsonBody['email']);
                if (isset($jsonBody['address']))         $stu['address']         = trim($jsonBody['address']);
                $stu['full_phone'] = ($stu['country_code'] ?? '+91') . ' ' . ($stu['whatsapp_number'] ?? '');
                $stu['updated_at'] = date('c');
                $found = true;
                break;
            }
        }
        unset($stu);
        if (!$found) { sendJson(["success" => false, "message" => "Student not found."], 404); break; }
        file_put_contents($filePath, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Student updated successfully."]);
        break;

    case 'add_student_admin':
        $filePath = __DIR__ . '/students.json';
        $students = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $currentYear = date("Y");
        $prefix = "STU-" . $currentYear . "-";
        $maxSeq = 0;
        foreach ($students as $stu) {
            if (isset($stu['id']) && strpos($stu['id'], $prefix) === 0) {
                $seqVal = (int)substr($stu['id'], strlen($prefix));
                if ($seqVal > $maxSeq) $maxSeq = $seqVal;
            }
        }
        $nextSeq = $maxSeq + 1;
        $studentId = $prefix . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
        $newStudent = [
            "id"               => $studentId,
            "first_name"       => trim($jsonBody['first_name'] ?? ''),
            "last_name"        => trim($jsonBody['last_name'] ?? ''),
            "country_code"     => trim($jsonBody['country_code'] ?? '+91'),
            "whatsapp_number"  => trim($jsonBody['whatsapp_number'] ?? ''),
            "full_phone"       => trim($jsonBody['country_code'] ?? '+91') . ' ' . trim($jsonBody['whatsapp_number'] ?? ''),
            "language"         => trim($jsonBody['language'] ?? 'Kannada'),
            "courses"          => is_array($jsonBody['courses'] ?? null) ? $jsonBody['courses'] : ['Jyotisha', 'ManaShastra'],
            "batch_id"         => trim($jsonBody['batch_id'] ?? 'JK-2026-OCT'),
            "email"            => trim($jsonBody['email'] ?? ''),
            "address"          => trim($jsonBody['address'] ?? ''),
            "status"           => "activated",
            "created_at"       => date("c"),
        ];
        $students[] = $newStudent;
        file_put_contents($filePath, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Student added successfully!", "student" => $newStudent]);
        break;

    case 'approve_student':
        $filePath = __DIR__ . '/students.json';
        $students = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $studentId = $jsonBody['student_id'] ?? ($_POST['student_id'] ?? '');
        if (!$studentId) { sendJson(["success" => false, "message" => "Student ID required."], 400); break; }
        $found = false;
        foreach ($students as &$stu) {
            if (isset($stu['id']) && $stu['id'] === $studentId) {
                $stu['status'] = 'activated';
                $stu['approved_at'] = date('c');
                $found = true;
                break;
            }
        }
        unset($stu);
        if (!$found) { sendJson(["success" => false, "message" => "Student not found."], 404); break; }
        file_put_contents($filePath, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Student approved and activated."]);
        break;

    case 'toggle_student_status':
        $filePath = __DIR__ . '/students.json';
        $students = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $studentId = $jsonBody['student_id'] ?? ($_POST['student_id'] ?? '');
        if (!$studentId) { sendJson(["success" => false, "message" => "Student ID required."], 400); break; }
        $found = false;
        $newStatus = 'deactivated';
        foreach ($students as &$stu) {
            if (isset($stu['id']) && $stu['id'] === $studentId) {
                $current = $stu['status'] ?? 'pending';
                $newStatus = ($current === 'deactivated') ? 'activated' : 'deactivated';
                $stu['status'] = $newStatus;
                $found = true;
                break;
            }
        }
        unset($stu);
        if (!$found) { sendJson(["success" => false, "message" => "Student not found."], 404); break; }
        file_put_contents($filePath, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Status updated.", "status" => $newStatus]);
        break;

    case 'delete_student':
        $filePath = __DIR__ . '/students.json';
        $students = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $studentId = $jsonBody['student_id'] ?? ($_POST['student_id'] ?? '');
        if (!$studentId) { sendJson(["success" => false, "message" => "Student ID required."], 400); break; }
        $initialCount = count($students);
        $students = array_values(array_filter($students, function($stu) use ($studentId) {
            return !isset($stu['id']) || $stu['id'] !== $studentId;
        }));
        if (count($students) === $initialCount) {
            sendJson(["success" => false, "message" => "Student not found."], 404);
            break;
        }
        file_put_contents($filePath, json_encode($students, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Student deleted successfully."]);
        break;

    case 'eclipses':
    case 'get_eclipses':
        $lat = isset($_GET['latitude']) ? (float)$_GET['latitude'] : (isset($_GET['lat']) ? (float)$_GET['lat'] : 12.9716);
        $lon = isset($_GET['longitude']) ? (float)$_GET['longitude'] : (isset($_GET['lon']) ? (float)$_GET['lon'] : 77.5946);
        $tz = isset($_GET['timezone']) ? (float)$_GET['timezone'] : (isset($_GET['tz']) ? (float)$_GET['tz'] : 5.5);
        $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
        $count = isset($_GET['count']) ? (int)$_GET['count'] : 5;
        sendJson(getFormattedEclipsesPHP($lat, $lon, $tz, $date, $count));
        break;

    case 'get_in_app_messages':
    case 'get_messages':
        $filePath = __DIR__ . '/in_app_messages.json';
        if (file_exists($filePath)) {
            sendJson(json_decode(file_get_contents($filePath), true));
        } else {
            sendJson([]);
        }
        break;

    case 'save_in_app_message':
    case 'save_messages':
        if (!verifyAdminPassword($jsonBody, $headers)) {
            http_response_code(403);
            sendJson(["error" => "Forbidden", "detail" => "Invalid admin password."]);
        }
        $messages = isset($jsonBody['messages']) ? $jsonBody['messages'] : (isset($jsonBody['inAppMessages']) ? $jsonBody['inAppMessages'] : (is_array($jsonBody) ? $jsonBody : []));
        file_put_contents(__DIR__ . '/in_app_messages.json', json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["status" => "success", "success" => true, "message" => "Messages saved successfully."]);
        break;

    case 'get_gotram':
    case 'get_gotra_master':
        $filePath = __DIR__ . '/gotra_master.json';
        if (file_exists($filePath)) {
            sendJson(json_decode(file_get_contents($filePath), true));
        } else {
            sendJson([]);
        }
        break;

    case 'save_gotram':
    case 'save_gotra_master':
        if (!verifyAdminPassword($jsonBody, $headers)) {
            http_response_code(403);
            sendJson(["error" => "Forbidden", "detail" => "Invalid admin password."]);
        }
        $gotraData = isset($jsonBody['gotraData']) ? $jsonBody['gotraData'] : (isset($jsonBody['gotras']) ? $jsonBody['gotras'] : $jsonBody);
        file_put_contents(__DIR__ . '/gotra_master.json', json_encode($gotraData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["status" => "success", "success" => true, "message" => "Gotra data saved successfully."]);
        break;

    case 'admin_get_all':
        if (!verifyAdminPassword($jsonBody, $headers)) {
            http_response_code(403);
            sendJson(["error" => "Forbidden", "detail" => "Invalid admin password."]);
        }
        $inAppMessages = [];
        if (file_exists(__DIR__ . '/in_app_messages.json')) {
            $inAppMessages = json_decode(file_get_contents(__DIR__ . '/in_app_messages.json'), true) ?: [];
        }
        sendJson([
            'status' => 'success',
            'inAppMessages' => $inAppMessages,
            'users' => [],
            'enableUserSync' => false,
        ]);
        break;

    case 'get_batches':
    case 'batches':
        $filePath = __DIR__ . '/batches.json';
        if (file_exists($filePath)) {
            $batches = json_decode(file_get_contents($filePath), true) ?: [];
            sendJson(["success" => true, "batches" => $batches]);
        } else {
            sendJson(["success" => true, "batches" => []]);
        }
        break;

    case 'save_batch':
    case 'save_batches':
        $filePath = __DIR__ . '/batches.json';
        $batches = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        if (isset($jsonBody['batches']) && is_array($jsonBody['batches'])) {
            $batches = $jsonBody['batches'];
        } else if (isset($jsonBody['id']) || isset($jsonBody['name'])) {
            $batchData = $jsonBody;
            $bId = trim($batchData['id'] ?? '');
            if (!$bId) {
                $bId = strtoupper(str_replace(' ', '-', trim($batchData['name'] ?? 'BATCH-' . date('Y'))));
                $batchData['id'] = $bId;
            }
            $found = false;
            foreach ($batches as &$b) {
                if (isset($b['id']) && $b['id'] === $bId) {
                    $b = array_merge($b, $batchData);
                    $found = true;
                    break;
                }
            }
            unset($b);
            if (!$found) {
                $batches[] = $batchData;
            }
        }
        file_put_contents($filePath, json_encode($batches, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Batches saved successfully.", "batches" => $batches]);
        break;

    case 'delete_batch':
        $filePath = __DIR__ . '/batches.json';
        $batches = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $bId = $jsonBody['id'] ?? ($_POST['id'] ?? '');
        if (!$bId) { sendJson(["success" => false, "message" => "Batch ID required."], 400); break; }
        $batches = array_values(array_filter($batches, function($b) use ($bId) {
            return !isset($b['id']) || $b['id'] !== $bId;
        }));
        file_put_contents($filePath, json_encode($batches, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Batch deleted successfully.", "batches" => $batches]);
        break;

    case 'get_courses':
    case 'courses':
        $filePath = __DIR__ . '/courses.json';
        if (file_exists($filePath)) {
            $courses = json_decode(file_get_contents($filePath), true) ?: [];
            sendJson(["success" => true, "courses" => $courses]);
        } else {
            sendJson(["success" => true, "courses" => []]);
        }
        break;

    case 'save_course':
    case 'save_courses':
        $filePath = __DIR__ . '/courses.json';
        $courses = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        if (isset($jsonBody['courses']) && is_array($jsonBody['courses'])) {
            $courses = $jsonBody['courses'];
        } else if (isset($jsonBody['id']) || isset($jsonBody['title'])) {
            $cData = $jsonBody;
            $cId = trim($cData['id'] ?? '');
            if (!$cId) {
                $cId = strtoupper(trim($cData['code'] ?? ($cData['title'] ?? 'COURSE-' . date('Y'))));
                $cData['id'] = $cId;
            }
            $found = false;
            foreach ($courses as &$c) {
                if (isset($c['id']) && $c['id'] === $cId) {
                    $c = array_merge($c, $cData);
                    $found = true;
                    break;
                }
            }
            unset($c);
            if (!$found) {
                $courses[] = $cData;
            }
        }
        file_put_contents($filePath, json_encode($courses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Courses saved successfully.", "courses" => $courses]);
        break;

    case 'delete_course':
        $filePath = __DIR__ . '/courses.json';
        $courses = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $cId = $jsonBody['id'] ?? ($_POST['id'] ?? '');
        if (!$cId) { sendJson(["success" => false, "message" => "Course ID required."], 400); break; }
        $courses = array_values(array_filter($courses, function($c) use ($cId) {
            return !isset($c['id']) || $c['id'] !== $cId;
        }));
        file_put_contents($filePath, json_encode($courses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Course deleted successfully.", "courses" => $courses]);
        break;

    case 'get_templates':
    case 'templates':
        $filePath = __DIR__ . '/templates.json';
        if (file_exists($filePath)) {
            $templates = json_decode(file_get_contents($filePath), true) ?: [];
            sendJson(["success" => true, "templates" => $templates]);
        } else {
            sendJson(["success" => true, "templates" => []]);
        }
        break;

    case 'save_template':
        $filePath = __DIR__ . '/templates.json';
        $templates = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $tData = $jsonBody;
        $tId = trim($tData['id'] ?? '');
        if (!$tId) {
            $tId = 'TPL-' . sprintf('%03d', count($templates) + 1);
            $tData['id'] = $tId;
        }
        $found = false;
        foreach ($templates as &$t) {
            if (isset($t['id']) && $t['id'] === $tId) {
                $t = array_merge($t, $tData);
                $found = true;
                break;
            }
        }
        unset($t);
        if (!$found) {
            $templates[] = $tData;
        }
        file_put_contents($filePath, json_encode($templates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Template saved successfully.", "templates" => $templates]);
        break;

    case 'delete_template':
        $filePath = __DIR__ . '/templates.json';
        $templates = file_exists($filePath) ? (json_decode(file_get_contents($filePath), true) ?: []) : [];
        $tId = $jsonBody['id'] ?? ($_POST['id'] ?? '');
        if (!$tId) { sendJson(["success" => false, "message" => "Template ID required."], 400); break; }
        $templates = array_values(array_filter($templates, function($t) use ($tId) {
            return !isset($t['id']) || $t['id'] !== $tId;
        }));
        file_put_contents($filePath, json_encode($templates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJson(["success" => true, "message" => "Template deleted successfully.", "templates" => $templates]);
        break;

    default:
        http_response_code(400);
        sendJson(["error" => "Invalid or missing endpoint parameter."]);
        break;
}
