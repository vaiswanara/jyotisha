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

$res = getSunCalcTimesPHP('2026-07-21', 12.9767936, 77.590082);
echo "FALLBACK SUNRISE TS: " . $res['sunrise'] . "\n";
echo "LOCAL FORMATTED (UTC + 5.5h): " . gmdate('H:i:s', $res['sunrise'] + (int)(5.5 * 3600)) . "\n";
echo "FALLBACK SUNSET TS: " . $res['sunset'] . "\n";
echo "LOCAL FORMATTED (UTC + 5.5h): " . gmdate('H:i:s', $res['sunset'] + (int)(5.5 * 3600)) . "\n";
