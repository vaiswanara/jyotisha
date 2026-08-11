<?php
function getSunCalcTimesPHP($dateStr, $lat, $lng) {
    $parts = array_map('intval', explode('-', $dateStr));
    $y = $parts[0]; $m = $parts[1]; $d = $parts[2];

    $timeMs = gmmktime(0, 0, 0, $m, $d, $y) * 1000;

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

$tz = 5.5;
$sRes = getSunCalcTimesPHP('2026-07-21', 12.9767936, 77.590082);
$mRes = getSunCalcMoonTimesPHP('2026-07-21', 12.9767936, 77.590082);

echo "SUNRISE:  " . gmdate('H:i:s', $sRes['sunrise'] + (int)($tz * 3600)) . "\n";
echo "SUNSET:   " . gmdate('H:i:s', $sRes['sunset'] + (int)($tz * 3600)) . "\n";
echo "MOONRISE: " . ($mRes['moonrise'] ? gmdate('H:i:s', $mRes['moonrise'] + (int)($tz * 3600)) : '-') . "\n";
echo "MOONSET:  " . ($mRes['moonset'] ? gmdate('H:i:s', $mRes['moonset'] + (int)($tz * 3600)) : '-') . "\n";
