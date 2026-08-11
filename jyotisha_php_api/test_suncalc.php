<?php
function getSunCalcTimesPHP($dateStr, $lat, $lon, $tz) {
    $parts = array_map('intval', explode('-', $dateStr));
    $y = $parts[0]; $m = $parts[1]; $d = $parts[2];

    $dateUtc = gmmktime(0, 0, 0, $m, $d, $y);
    $jd = ($dateUtc / 86400.0) + 2440587.5;

    $lw = -$lon / 360.0;
    $phi = deg2rad($lat);

    $jSet = 2451545.0 + 0.5 + $lw;
    $nCycle = round($jd - $jSet);
    $jNoon = $jSet + $nCycle;

    $M = deg2rad(fmod(357.5291 + 0.98560028 * ($jNoon - 2451545.0), 360.0));
    $C = deg2rad(1.9148 * sin($M) + 0.0200 * sin(2 * $M) + 0.0003 * sin(3 * $M));
    $L = deg2rad(fmod(rad2deg($M) + rad2deg($C) + 180.0 + 102.9372, 360.0));
    $dec = asin(sin($L) * sin(deg2rad(23.4397)));

    $Jtransit = $jNoon + 0.0053 * sin($M) - 0.0069 * sin(2 * $L);

    $h0 = deg2rad(-0.833);
    $cosH0 = (sin($h0) - sin($phi) * sin($dec)) / (cos($phi) * cos($dec));
    if ($cosH0 > 1 || $cosH0 < -1) return ['sunrise' => null, 'sunset' => null];

    $w0 = acos($cosH0);
    $Jrise = $Jtransit - (rad2deg($w0) / 360.0);
    $Jset = $Jtransit + (rad2deg($w0) / 360.0);

    $sunriseTs = (int)round(($Jrise - 2440587.5) * 86400);
    $sunsetTs = (int)round(($Jset - 2440587.5) * 86400);

    return ['sunrise' => $sunriseTs, 'sunset' => $sunsetTs];
}

$res = getSunCalcTimesPHP('2026-07-21', 12.9767936, 77.590082, 5.5);
echo "FALLBACK SUNRISE TS: " . $res['sunrise'] . "\n";
echo "LOCAL FORMATTED (UTC + 5.5h): " . gmdate('H:i:s', $res['sunrise'] + (int)(5.5 * 3600)) . "\n";
echo "FALLBACK SUNSET TS: " . $res['sunset'] . "\n";
echo "LOCAL FORMATTED (UTC + 5.5h): " . gmdate('H:i:s', $res['sunset'] + (int)(5.5 * 3600)) . "\n";
