<?php
/**
 * Vedic Astrology Engine - PHP Version
 */

require_once __DIR__ . '/constants.php';

class VedicAstroEngine {
    private float $julianDay;
    private bool $useSwetest;
    private float $ayanamsha = 0.0;
    private string $ayanamshaName;
    private ?string $utDateStr;
    private ?string $utTimeStr;
    private string $rahuMode = "mean";

    private static ?string $exePath = null;
    private static ?string $ephePath = null;
    private static bool $initialized = false;

    public function __construct(
        float $julianDay,
        ?string $utDateStr = null,
        ?string $utTimeStr = null,
        string $ayanamshaKey = "lahiri",
        string $rahuMode = "mean"
    ) {
        $this->julianDay = $julianDay;
        $this->utDateStr = $utDateStr;
        $this->utTimeStr = $utTimeStr;
        $this->ayanamshaName = $ayanamshaKey;
        $this->rahuMode = $rahuMode;

        self::initPaths();
        $this->useSwetest = self::$exePath !== null;

        $ayList = AYANAMSHA_LIST;
        $ayCode = isset($ayList[$ayanamshaKey]) ? $ayList[$ayanamshaKey]['code'] : '1';
        $customVal = is_numeric($ayanamshaKey) ? (float)$ayanamshaKey : null;

        if ($customVal !== null && !isset($ayList[$ayanamshaKey])) {
            $this->ayanamsha = $customVal;
            $this->useSwetest = false;
        } else {
            if ($this->useSwetest && $utDateStr) {
                $ayCalc = $this->calcAyanamshaViaSwetest($ayCode);
                if ($ayCalc !== null) {
                    $this->ayanamsha = $ayCalc;
                }
            }
            if (!$this->ayanamsha || $this->ayanamsha < 20) {
                $this->ayanamsha = $this->calcLahiriAyanamshaFallback($julianDay);
            }
        }
    }

    public static function isSwetestEnabled(): bool {
        self::initPaths();
        if (!self::$exePath) return false;
        static $checked = null;
        if ($checked !== null) return $checked;
        $testOut = self::runSwetestStatic("-p0 -b1.1.2000 -n1 -s1");
        $checked = !empty(trim($testOut)) && (strpos($testOut, 'Sun') !== false || strpos($testOut, 'date') !== false || strpos($testOut, 'ET') !== false);
        return $checked;
    }

    private static function initPaths(): void {
        if (self::$initialized) return;

        $rootDir = realpath(__DIR__ . '/..');
        $swetestCandidates = [];

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $swetestCandidates[] = $rootDir . DIRECTORY_SEPARATOR . 'swetest.exe';
        } else if (PHP_OS === 'Darwin') {
            $swetestCandidates[] = $rootDir . DIRECTORY_SEPARATOR . 'swetest_mac';
        } else {
            $swetestCandidates[] = $rootDir . DIRECTORY_SEPARATOR . 'swetest';
        }

        foreach ($swetestCandidates as $candidate) {
            if (file_exists($candidate)) {
                self::$exePath = $candidate;
                if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
                    @chmod($candidate, 0755);
                }
                break;
            }
        }

        self::$ephePath = $rootDir . DIRECTORY_SEPARATOR . 'ephe';
        self::$initialized = true;
    }

    public static function toJulianDay(
        int $year,
        int $month,
        int $day,
        int $hour,
        int $minute,
        float $timezone,
        int $second = 0
    ): float {
        $utHour = $hour + ($minute + $second / 60.0) / 60.0 - $timezone;
        if ($utHour < 0) {
            $utHour += 24;
            $day--;
        }
        if ($utHour >= 24) {
            $utHour -= 24;
            $day++;
        }
        if ($month <= 2) {
            $year--;
            $month += 12;
        }
        $A = (int)floor($year / 100);
        $B = 2 - $A + (int)floor($A / 4);

        return floor(365.25 * ($year + 4716)) +
               floor(30.6001 * ($month + 1)) +
               $day +
               $B -
               1524.5 +
               $utHour / 24.0;
    }

    public static function fromBirthData(
        int $year,
        int $month,
        int $day,
        int $hour,
        int $minute,
        float $timezone,
        string $ayanamshaKey = "lahiri",
        int $second = 0,
        string $rahuMode = "mean"
    ): VedicAstroEngine {
        $utHour = $hour + ($minute + $second / 60.0) / 60.0 - $timezone;
        $utDay = $day;
        $utMon = $month;
        $utYear = $year;

        if ($utHour < 0) {
            $utHour += 24;
            $utDay--;
        }
        if ($utHour >= 24) {
            $utHour -= 24;
            $utDay++;
        }

        if ($utDay < 1) {
            $utMon--;
            if ($utMon < 1) {
                $utMon = 12;
                $utYear--;
            }
            $utDay = cal_days_in_month(CAL_GREGORIAN, $utMon, $utYear);
        }

        $jd = self::toJulianDay($year, $month, $day, $hour, $minute, $timezone, $second);
        $utDateStr = sprintf("%d.%d.%d", $utDay, $utMon, $utYear);
        $utH = (int)floor($utHour);
        $utM = (int)floor(($utHour - $utH) * 60);
        $utS = (int)floor((($utHour - $utH) * 60 - $utM) * 60);

        $utTimeStr = sprintf("%02d:%02d:%02d", $utH, $utM, $utS);

        return new VedicAstroEngine($jd, $utDateStr, $utTimeStr, $ayanamshaKey, $rahuMode);
    }

    public static function runSwetestStatic(string $args): string {
        self::initPaths();
        if (!self::$exePath) return "";
        
        $isWin = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
        if (!$isWin) {
            @chmod(self::$exePath, 0755);
        }

        $rootDir = dirname(self::$exePath);

        if ($isWin) {
            $epheArg = '"-edir' . self::$ephePath . '"';
            $cmd = '"' . self::$exePath . '" ' . $epheArg . ' ' . $args;
        } else {
            $cmd = 'export LD_LIBRARY_PATH="' . $rootDir . ':$LD_LIBRARY_PATH"; "' . self::$exePath . '" -edir"' . self::$ephePath . '" ' . $args . ' 2>&1';
        }
        
        $output = [];
        $returnVar = 0;
        @exec($cmd, $output, $returnVar);
        if (empty($output)) {
            $raw = @shell_exec($cmd);
            if ($raw) {
                $output = explode("\n", $raw);
            }
        }
        if (empty($output)) {
            $handle = @popen($cmd, 'r');
            if ($handle) {
                $readStr = '';
                while (!feof($handle)) {
                    $readStr .= fread($handle, 2048);
                }
                pclose($handle);
                if (!empty($readStr)) {
                    $output = explode("\n", $readStr);
                }
            }
        }
        return implode("\n", $output);
    }

    protected function runSwetest(string $args): string {
        return self::runSwetestStatic($args);
    }

    public static function getRiseSetTimes(
        string|int $planet,
        string $dateStr, // YYYY-MM-DD
        float $lon,
        float $lat,
        float $timezone
    ): array {
        self::initPaths();
        if (!self::$exePath) {
            return ['rise' => null, 'set' => null];
        }

        $parts = array_map('intval', explode('-', trim($dateStr)));
        $y = $parts[0]; $m = $parts[1]; $d = $parts[2];
        
        $prevUtc = gmmktime(0, 0, 0, $m, $d - 1, $y);
        $startDay = (int)gmdate('j', $prevUtc);
        $startMonth = (int)gmdate('n', $prevUtc);
        $startYear = (int)gmdate('Y', $prevUtc);

        $swetestDateStr = "{$startDay}.{$startMonth}.{$startYear}";
        $args = "-b\"{$swetestDateStr}\" -geopos\"{$lon},{$lat},0\" -rise -p{$planet} -n3";

        $out = self::runSwetestStatic($args);
        $lines = explode("\n", $out);

        $localStartTs = gmmktime(0, 0, 0, $m, $d, $y) - (int)round($timezone * 3600);
        $localEndTs = $localStartTs + 86400;

        $riseTs = null;
        $setTs = null;

        foreach ($lines as $line) {
            if (strpos($line, 'rise') === false && strpos($line, 'set') === false) continue;
            $setIndex = strpos($line, 'set');
            if ($setIndex === false) $setIndex = 999999;

            if (preg_match_all('/(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2}(?:\.\d+)?)/', $line, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
                foreach ($matches as $match) {
                    $matchIndex = $match[0][1];
                    $matchDay = (int)$match[1][0];
                    $matchMonth = (int)$match[2][0];
                    $matchYear = (int)$match[3][0];
                    $matchHour = (int)$match[4][0];
                    $matchMinute = (int)$match[5][0];
                    $matchSecond = (float)$match[6][0];

                    $eventUtc = gmmktime($matchHour, $matchMinute, (int)floor($matchSecond), $matchMonth, $matchDay, $matchYear);

                    if ($eventUtc >= $localStartTs && $eventUtc < $localEndTs) {
                        if ($matchIndex < $setIndex) {
                            $riseTs = $eventUtc;
                        } else {
                            $setTs = $eventUtc;
                        }
                    }
                }
            }
        }

        return ['rise' => $riseTs, 'set' => $setTs];
    }

    private function calcAyanamshaViaSwetest(string $ayCode = "1"): ?float {
        if (!$this->utDateStr || !$this->utTimeStr) return null;
        $out = $this->runSwetest("-b{$this->utDateStr} -ut{$this->utTimeStr} -ay{$ayCode}");
        $lines = explode("\n", $out);
        foreach ($lines as $line) {
            if (stripos($line, "ayanam") !== false) {
                if (preg_match_all('/(\d+\.?\d*)/', $line, $matches)) {
                    $vals = $matches[0];
                    for ($i = 0; $i < count($vals); $i++) {
                        $n = (float)$vals[$i];
                        if ($n >= 20 && $n <= 30) {
                            $deg = $n;
                            $min = isset($vals[$i + 1]) ? (float)$vals[$i + 1] : 0.0;
                            $sec = isset($vals[$i + 2]) ? (float)$vals[$i + 2] : 0.0;
                            if ($min < 60 && $sec < 60) {
                                return $deg + $min / 60.0 + $sec / 3600.0;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    private function calcLahiriAyanamshaFallback(float $jd): float {
        $T = ($jd - 2415020.0) / 36525.0;
        $ay = 22.46045 + ((50.290966 + 0.0222226 * $T) * $T) / 3600.0;
        return fmod(fmod($ay, 360) + 360, 360);
    }

    public function getAyanamsha(): float {
        return $this->ayanamsha;
    }

    public function getAyanamshaName(): string {
        $ayList = AYANAMSHA_LIST;
        if (is_numeric($this->ayanamshaName) && !isset($ayList[$this->ayanamshaName])) {
            return "User Defined (" . $this->ayanamshaName . "°)";
        }
        return isset($ayList[$this->ayanamshaName]) ? $ayList[$this->ayanamshaName]['label'] : $this->ayanamshaName;
    }

    public function isUsingSwetest(): bool {
        return $this->useSwetest;
    }

    public function setSwetest(bool $val): void {
        $this->useSwetest = $val && self::$exePath !== null;
    }

    private function calcPlanetViaSwetest(string $planetCode): ?array {
        if (!$this->utDateStr || !$this->utTimeStr) return null;
        $out = $this->runSwetest("-b{$this->utDateStr} -ut{$this->utTimeStr} -p{$planetCode} -fls -eswe");
        $lines = array_reverse(explode("\n", $out));
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if (preg_match('/^(\d+\.\d+)\s+([-\d.]+)/', $trimmed, $match)) {
                $tropLon = (float)$match[1];
                $speed = (float)$match[2];
                $sidLon = fmod(fmod($tropLon - $this->ayanamsha, 360) + 360, 360);
                return ['longitude' => $sidLon, 'speed' => $speed];
            }
        }
        return null;
    }

    private function calcAscendantViaSwetest(float $latitude, float $longitude): ?float {
        if (!$this->utDateStr || !$this->utTimeStr) return null;
        $out = $this->runSwetest("-b{$this->utDateStr} -ut{$this->utTimeStr} -house{$longitude},{$latitude},W");
        $tropAsc = null;
        $lines = explode("\n", $out);
        foreach ($lines as $line) {
            if (preg_match('/^Ascendant/i', $line)) {
                if (preg_match_all('/(\d+\.?\d*)/', $line, $matches)) {
                    $vals = $matches[0];
                    for ($i = 0; $i < count($vals); $i++) {
                        $deg = (float)$vals[$i];
                        if ($deg >= 0 && $deg < 360) {
                            $min = isset($vals[$i + 1]) ? (float)$vals[$i + 1] : 0.0;
                            $sec = isset($vals[$i + 2]) ? (float)$vals[$i + 2] : 0.0;
                            if ($min < 60 && $sec < 60) {
                                $tropAsc = $deg + $min / 60.0 + $sec / 3600.0;
                                break;
                            }
                        }
                    }
                }
                if ($tropAsc !== null) break;
            }
        }
        if ($tropAsc === null) return null;
        return fmod(fmod($tropAsc - $this->ayanamsha, 360) + 360, 360);
    }

    private function fmod360(float $val): float {
        return fmod(fmod($val, 360) + 360, 360);
    }

    private function deg2radCustom(float $deg): float {
        return $deg * (M_PI / 180.0);
    }

    private function rad2degCustom(float $rad): float {
        return $rad * (180.0 / M_PI);
    }

    private function toSidereal(float $trop): float {
        return $this->fmod360($trop - $this->ayanamsha);
    }

    private function getRashi(float $lon): int {
        return (int)floor($lon / 30) + 1;
    }

    private function getDegInRashi(float $lon): float {
        return fmod($lon, 30);
    }

    private function getNakInfo(float $sidLon): array {
        $nakLen = 360.0 / 27.0;
        $nakList = NAKSHATRAS;
        $idx = min(26, (int)floor($sidLon / $nakLen));
        $posInNak = fmod($sidLon, $nakLen);
        $pada = min(4, (int)floor($posInNak / ($nakLen / 4)) + 1);

        return [
            'nakshatra' => $nakList[$idx]['name'],
            'lord' => $nakList[$idx]['lord'],
            'pada' => $pada,
            'index' => $idx,
            'deg_in_nak' => $posInNak,
        ];
    }

    private function calcPlanetFallback(string $planetName): ?array {
        $T = ($this->julianDay - 2451545.0) / 36525.0;

        switch ($planetName) {
            case Planet::SUN:
                $L0 = 280.46646 + 36000.76983 * $T + 0.0003032 * $T * $T;
                $M = $this->deg2radCustom(357.52911 + 35999.05029 * $T - 0.0001537 * $T * $T);
                $C = (1.914602 - 0.004817 * $T) * sin($M) +
                     (0.019993 - 0.000101 * $T) * sin(2 * $M) +
                     0.000289 * sin(3 * $M);
                return ['trop_lon' => $this->fmod360($L0 + $C), 'speed' => 1.0];

            case Planet::MOON:
                $Lp = 218.3165 + 481267.8813 * $T;
                $M = $this->deg2radCustom(357.5291 + 35999.0503 * $T);
                $Mp = $this->deg2radCustom(134.9634 + 477198.8676 * $T);
                $D = $this->deg2radCustom(297.8502 + 445267.1115 * $T);
                $F = $this->deg2radCustom(93.272 + 483202.0175 * $T);
                $lon = $Lp + 6.2888 * sin($Mp) + 1.274 * sin(2 * $D - $Mp) +
                       0.6583 * sin(2 * $D) + 0.2136 * sin(2 * $Mp) -
                       0.1851 * sin($M) - 0.1143 * sin(2 * $F) +
                       0.0588 * sin(2 * $D - 2 * $Mp) + 0.0572 * sin(2 * $D - $M - $Mp) +
                       0.0533 * sin(2 * $D + $Mp) + 0.041 * sin(2 * $D - $M);
                return ['trop_lon' => $this->fmod360($lon), 'speed' => 13.2];

            case Planet::MARS:
                $L = 355.433 + 19140.2993 * $T + 0.000261 * $T * $T;
                $M = $this->deg2radCustom(19.373 + 19139.8585 * $T);
                $lon = $L + 10.6912 * sin($M) + 0.6228 * sin(2 * $M) + 0.0503 * sin(3 * $M);
                return ['trop_lon' => $this->fmod360($lon), 'speed' => 0.52];

            case Planet::MERCURY:
                $L = 252.2509 + 149472.6746 * $T;
                $M = $this->deg2radCustom(174.7948 + 149472.5153 * $T);
                $lon = $L + 23.4405 * sin($M) + 2.9818 * sin(2 * $M) + 0.5255 * sin(3 * $M) + 0.1058 * sin(4 * $M);
                return ['trop_lon' => $this->fmod360($lon), 'speed' => 1.38];

            case Planet::JUPITER:
                $L = 34.351 + 3034.9057 * $T - 0.00008501 * $T * $T;
                $M = $this->deg2radCustom(20.0202 + 3034.6626 * $T);
                $lon = $L + 5.5549 * sin($M) + 0.1683 * sin(2 * $M) + 0.0071 * sin(3 * $M);
                return ['trop_lon' => $this->fmod360($lon), 'speed' => 0.083];

            case Planet::VENUS:
                $L = 181.9798 + 58517.8156 * $T;
                $M = $this->deg2radCustom(212.2606 + 58517.8039 * $T);
                $lon = $L + 0.7758 * sin($M) + 0.0033 * sin(2 * $M);
                return ['trop_lon' => $this->fmod360($lon), 'speed' => 1.6];

            case Planet::SATURN:
                $L = 50.0774 + 1222.1138 * $T + 0.00021004 * $T * $T;
                $M = $this->deg2radCustom(317.0207 + 1221.5515 * $T);
                $lon = $L + 6.3585 * sin($M) + 0.1914 * sin(2 * $M) + 0.0087 * sin(3 * $M);
                return ['trop_lon' => $this->fmod360($lon), 'speed' => 0.034];

            case Planet::RAHU:
                $lon = 125.0445 - 1934.1363 * $T + 0.0020754 * $T * $T + 0.00000215 * $T * $T * $T;
                return ['trop_lon' => $this->fmod360($lon), 'speed' => -0.053];
        }
        return null;
    }

    private function buildPlanetEntry(float $sidLon, float $speed, int $lagnaRashi): array {
        $rashi = $this->getRashi($sidLon);
        $deg = $this->getDegInRashi($sidLon);
        $nak = $this->getNakInfo($sidLon);
        $house = (($rashi - $lagnaRashi + 12) % 12) + 1;
        $rashiNames = RASHI_NAMES;

        return [
            'longitude' => $sidLon,
            'rashi' => $rashi,
            'rashi_name' => $rashiNames[$rashi - 1]['en'],
            'degree' => $deg,
            'nakshatra' => $nak['nakshatra'],
            'pada' => $nak['pada'],
            'nak_lord' => $nak['lord'],
            'nak_index' => $nak['index'],
            'deg_in_nak' => $nak['deg_in_nak'],
            'retrograde' => $speed < 0,
            'speed' => $speed,
            'house' => $house,
        ];
    }

    public function calcAscendant(float $latitude, float $longitude): float {
        if ($this->useSwetest && $this->utDateStr) {
            $ascSid = $this->calcAscendantViaSwetest($latitude, $longitude);
            if ($ascSid !== null && $ascSid > 0) {
                return $this->fmod360($ascSid);
            }
        }
        $T = ($this->julianDay - 2451545.0) / 36525.0;
        $GMST = 280.46061837 + 360.98564736629 * ($this->julianDay - 2451545.0) + 0.000387933 * $T * $T;
        $LST = $this->fmod360($GMST + $longitude);
        $eps = $this->deg2radCustom(23.439292 - 0.013004 * $T);
        $lat = $this->deg2radCustom($latitude);
        $E = $this->deg2radCustom($LST);
        $y = -cos($E);
        $x = sin($E) * cos($eps) + tan($lat) * sin($eps);
        $asc = $this->rad2degCustom(atan2($y, $x));
        $asc = $this->fmod360($asc);
        return $this->toSidereal(fmod($asc + 180, 360));
    }

    public function calculateAll(float $latitude, float $longitude): array {
        $ascSid = $this->calcAscendant($latitude, $longitude);
        $lagnaRashi = $this->getRashi($ascSid);
        $planets = [];

        $planets[Planet::ASCENDANT] = array_merge(
            $this->buildPlanetEntry($ascSid, 0, $lagnaRashi),
            ['house' => 1]
        );

        $corePlanets = [
            Planet::SUN,
            Planet::MOON,
            Planet::MARS,
            Planet::MERCURY,
            Planet::JUPITER,
            Planet::VENUS,
            Planet::SATURN,
            Planet::RAHU,
        ];

        $sweCodes = SWE_CODE;
        foreach ($corePlanets as $pname) {
            $calculated = false;
            if ($this->useSwetest && $this->utDateStr) {
                $code = isset($sweCodes[$pname]) ? $sweCodes[$pname] : null;
                if ($pname === Planet::RAHU) {
                    $code = $this->rahuMode === "true" ? "t" : "m";
                }
                if ($code) {
                    $data = $this->calcPlanetViaSwetest($code);
                    if ($data) {
                        $sidLon = $this->fmod360($data['longitude']);
                        $planets[$pname] = $this->buildPlanetEntry($sidLon, $data['speed'], $lagnaRashi);
                        $calculated = true;
                    }
                }
            }
            if (!$calculated) {
                $fb = $this->calcPlanetFallback($pname);
                if ($fb) {
                    $sidLon = $this->toSidereal($fb['trop_lon']);
                    $planets[$pname] = $this->buildPlanetEntry($sidLon, $fb['speed'], $lagnaRashi);
                }
            }
        }

        if (isset($planets[Planet::RAHU])) {
            $planets[Planet::RAHU]['retrograde'] = true;
            $ketuLon = $this->fmod360($planets[Planet::RAHU]['longitude'] + 180);
            $planets[Planet::KETU] = array_merge(
                $this->buildPlanetEntry($ketuLon, $planets[Planet::RAHU]['speed'], $lagnaRashi),
                ['retrograde' => true]
            );
        }

        // Combustion (Asta)
        $sunLon = isset($planets[Planet::SUN]) ? $planets[Planet::SUN]['longitude'] : 0;
        foreach ($planets as $name => &$p) {
            $p['combust'] = false;
            if (in_array($name, [Planet::SUN, Planet::MOON, Planet::RAHU, Planet::KETU, Planet::ASCENDANT])) continue;

            $limit = 0;
            if ($name === Planet::MARS) $limit = 17;
            else if ($name === Planet::JUPITER) $limit = 11;
            else if ($name === Planet::SATURN) $limit = 15;
            else if ($name === Planet::MERCURY) $limit = $p['retrograde'] ? 12 : 14;
            else if ($name === Planet::VENUS) $limit = $p['retrograde'] ? 8 : 10;

            $diff = abs($p['longitude'] - $sunLon);
            if ($diff > 180) $diff = 360 - $diff;
            if ($diff <= $limit) $p['combust'] = true;
        }

        return $planets;
    }

    public function calcHouses(int $lagnaRashi): array {
        $houses = [];
        $rashiNames = RASHI_NAMES;
        for ($i = 1; $i <= 12; $i++) {
            $r = (($lagnaRashi - 1 + $i - 1) % 12) + 1;
            $houses[$i] = [
                'rashi' => $r,
                'rashi_name' => $rashiNames[$r - 1]['en'],
                'degree' => 0,
            ];
        }
        return $houses;
    }

    public function calcNavamsa(array $planets): array {
        $nav = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $navIdx = (int)floor($p['degree'] / (30.0 / 9.0));
            $start = 0;
            if (in_array($ri, [0, 4, 8])) $start = 0;
            else if (in_array($ri, [1, 5, 9])) $start = 9;
            else if (in_array($ri, [2, 6, 10])) $start = 6;
            else $start = 3;
            $navRashi = (($start + $navIdx) % 12) + 1;
            $nav[$name] = ['rashi' => $navRashi, 'rashi_name' => $rashiNames[$navRashi - 1]['en']];
        }
        if (isset($nav[Planet::RAHU])) {
            $rahuRashi = $nav[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $nav[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $nav;
    }

    public function calcDrekkanaD3(array $planets): array {
        $d3 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 10.0);
            $shift = 0;
            if ($idx === 1) $shift = 4;
            else if ($idx === 2) $shift = 8;
            $d3Rashi = (($ri + $shift) % 12) + 1;
            $d3[$name] = ['rashi' => $d3Rashi, 'rashi_name' => $rashiNames[$d3Rashi - 1]['en']];
        }
        if (isset($d3[Planet::RAHU])) {
            $rahuRashi = $d3[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d3[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d3;
    }

    public function calcSaptamshaD7(array $planets): array {
        $d7 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / (30.0 / 7.0));
            $isOdd = ($p['rashi'] % 2) !== 0;
            $start = $isOdd ? $ri : ($ri + 6);
            $d7Rashi = (($start + $idx) % 12) + 1;
            $d7[$name] = ['rashi' => $d7Rashi, 'rashi_name' => $rashiNames[$d7Rashi - 1]['en']];
        }
        if (isset($d7[Planet::RAHU])) {
            $rahuRashi = $d7[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d7[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d7;
    }

    public function calcDasamshaD10(array $planets): array {
        $d10 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 3.0);
            $isOdd = ($p['rashi'] % 2) !== 0;
            $start = $isOdd ? $ri : ($ri + 8);
            $d10Rashi = (($start + $idx) % 12) + 1;
            $d10[$name] = ['rashi' => $d10Rashi, 'rashi_name' => $rashiNames[$d10Rashi - 1]['en']];
        }
        if (isset($d10[Planet::RAHU])) {
            $rahuRashi = $d10[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d10[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d10;
    }

    public function calcDwadashamshaD12(array $planets): array {
        $d12 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 2.5);
            $d12Rashi = (($ri + $idx) % 12) + 1;
            $d12[$name] = ['rashi' => $d12Rashi, 'rashi_name' => $rashiNames[$d12Rashi - 1]['en']];
        }
        if (isset($d12[Planet::RAHU])) {
            $rahuRashi = $d12[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d12[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d12;
    }

    public function calcHoraD2(array $planets): array {
        $d2 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $isOdd = ($p['rashi'] % 2) !== 0;
            $d2Rashi = 4;
            if ($isOdd) {
                $d2Rashi = $p['degree'] < 15 ? 5 : 4;
            } else {
                $d2Rashi = $p['degree'] < 15 ? 4 : 5;
            }
            $d2[$name] = ['rashi' => $d2Rashi, 'rashi_name' => $rashiNames[$d2Rashi - 1]['en']];
        }
        if (isset($d2[Planet::RAHU])) {
            $rahuRashi = $d2[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d2[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d2;
    }

    public function calcChaturthamshaD4(array $planets): array {
        $d4 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 7.5);
            $d4Rashi = (($ri + $idx * 3) % 12) + 1;
            $d4[$name] = ['rashi' => $d4Rashi, 'rashi_name' => $rashiNames[$d4Rashi - 1]['en']];
        }
        if (isset($d4[Planet::RAHU])) {
            $rahuRashi = $d4[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d4[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d4;
    }

    public function calcShodashamshaD16(array $planets): array {
        $d16 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 1.875);
            $start = 0;
            if (in_array($ri, [0, 3, 6, 9])) $start = 0;
            else if (in_array($ri, [1, 4, 7, 10])) $start = 4;
            else $start = 8;
            $d16Rashi = (($start + $idx) % 12) + 1;
            $d16[$name] = ['rashi' => $d16Rashi, 'rashi_name' => $rashiNames[$d16Rashi - 1]['en']];
        }
        if (isset($d16[Planet::RAHU])) {
            $rahuRashi = $d16[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d16[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d16;
    }

    public function calcVimshamshaD20(array $planets): array {
        $d20 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 1.5);
            $start = 0;
            if (in_array($ri, [0, 3, 6, 9])) $start = 0;
            else if (in_array($ri, [1, 4, 7, 10])) $start = 8;
            else $start = 4;
            $d20Rashi = (($start + $idx) % 12) + 1;
            $d20[$name] = ['rashi' => $d20Rashi, 'rashi_name' => $rashiNames[$d20Rashi - 1]['en']];
        }
        if (isset($d20[Planet::RAHU])) {
            $rahuRashi = $d20[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d20[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d20;
    }

    public function calcChaturvimshamshaD24(array $planets): array {
        $d24 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $isOdd = ($p['rashi'] % 2) !== 0;
            $idx = (int)floor($p['degree'] / 1.25);
            $start = $isOdd ? 4 : 3;
            $d24Rashi = (($start + $idx) % 12) + 1;
            $d24[$name] = ['rashi' => $d24Rashi, 'rashi_name' => $rashiNames[$d24Rashi - 1]['en']];
        }
        if (isset($d24[Planet::RAHU])) {
            $rahuRashi = $d24[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d24[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d24;
    }

    public function calcSaptavimshamshaD27(array $planets): array {
        $d27 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / (10.0 / 9.0));
            $start = 0;
            if (in_array($ri, [0, 4, 8])) $start = 0;
            else if (in_array($ri, [1, 5, 9])) $start = 9;
            else if (in_array($ri, [2, 6, 10])) $start = 6;
            else $start = 3;
            $d27Rashi = (($start + $idx) % 12) + 1;
            $d27[$name] = ['rashi' => $d27Rashi, 'rashi_name' => $rashiNames[$d27Rashi - 1]['en']];
        }
        if (isset($d27[Planet::RAHU])) {
            $rahuRashi = $d27[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d27[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d27;
    }

    public function calcTrimshamshaD30(array $planets): array {
        $d30 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $isOdd = ($p['rashi'] % 2) !== 0;
            $deg = $p['degree'];
            $d30Rashi = 1;
            if ($isOdd) {
                if ($deg < 5) $d30Rashi = 1;
                else if ($deg < 10) $d30Rashi = 11;
                else if ($deg < 18) $d30Rashi = 9;
                else if ($deg < 25) $d30Rashi = 3;
                else $d30Rashi = 7;
            } else {
                if ($deg < 5) $d30Rashi = 2;
                else if ($deg < 12) $d30Rashi = 6;
                else if ($deg < 20) $d30Rashi = 12;
                else if ($deg < 25) $d30Rashi = 10;
                else $d30Rashi = 8;
            }
            $d30[$name] = ['rashi' => $d30Rashi, 'rashi_name' => $rashiNames[$d30Rashi - 1]['en']];
        }
        return $d30;
    }

    public function calcShashtiamshaD60(array $planets): array {
        $d60 = [];
        $rashiNames = RASHI_NAMES;
        foreach ($planets as $name => $p) {
            if (!$p) continue;
            $ri = $p['rashi'] - 1;
            $idx = (int)floor($p['degree'] / 0.5);
            $d60Rashi = (($ri + $idx) % 12) + 1;
            $d60[$name] = ['rashi' => $d60Rashi, 'rashi_name' => $rashiNames[$d60Rashi - 1]['en']];
        }
        if (isset($d60[Planet::RAHU])) {
            $rahuRashi = $d60[Planet::RAHU]['rashi'];
            $ketuRashi = (($rahuRashi - 1 + 6) % 12) + 1;
            $d60[Planet::KETU] = ['rashi' => $ketuRashi, 'rashi_name' => $rashiNames[$ketuRashi - 1]['en']];
        }
        return $d60;
    }

    private function addDaysToDateStr(string $dateStr, float $days): string {
        $dt = new DateTime($dateStr, new DateTimeZone('UTC'));
        $dt->modify(round($days) . ' days');
        return $dt->format('Y-m-d');
    }

    public function calcVimshottariDasha(int $moonNakIndex, float $degInNak, string $birthDate): array {
        $nakLen = 360.0 / 27.0;
        $elapsed = $degInNak / $nakLen;
        $nakList = NAKSHATRAS;
        $dashaYears = DASHA_YEARS;
        $dashaOrder = DASHA_ORDER;

        $birthLord = $nakList[$moonNakIndex % 27]['lord'];
        $lordPos = array_search($birthLord, $dashaOrder);
        $totalYears = $dashaYears[$birthLord];
        $elapsedYears = $totalYears * $elapsed;
        $yearsLeft = $totalYears - $elapsedYears;

        $dashas = [];
        $dtBirth = new DateTime($birthDate, new DateTimeZone('UTC'));
        $dobStr = $dtBirth->format('Y-m-d');

        $theoreticalStart = $this->addDaysToDateStr($dobStr, -$elapsedYears * 365.25);
        $curDate = $dobStr;
        $endDate = $this->addDaysToDateStr($curDate, $yearsLeft * 365.25);

        $dashas[] = [
            'planet' => $birthLord,
            'start' => $curDate,
            'end' => $endDate,
            'years' => (float)number_format($yearsLeft, 4, '.', ''),
            'antardashas' => $this->calcAntardasha($birthLord, $theoreticalStart, $dobStr),
        ];
        $curDate = $endDate;

        for ($i = 1; $i <= 8; $i++) {
            $lord = $dashaOrder[($lordPos + $i) % 9];
            $years = $dashaYears[$lord];
            $endDate = $this->addDaysToDateStr($curDate, $years * 365.25);
            $dashas[] = [
                'planet' => $lord,
                'start' => $curDate,
                'end' => $endDate,
                'years' => $years,
                'antardashas' => $this->calcAntardasha($lord, $curDate, $curDate),
            ];
            $curDate = $endDate;
        }
        return $dashas;
    }

    public function calcAntardasha(string $mahaLord, string $theoreticalStart, string $clampDate): array {
        $dashaYears = DASHA_YEARS;
        $dashaOrder = DASHA_ORDER;

        $totalYears = $dashaYears[$mahaLord];
        $startPos = array_search($mahaLord, $dashaOrder);
        $theoreticalCurDate = (new DateTime($theoreticalStart, new DateTimeZone('UTC')))->format('Y-m-d');
        $antardashas = [];

        for ($i = 0; $i < 9; $i++) {
            $lord = $dashaOrder[($startPos + $i) % 9];
            $antarYears = ($totalYears * $dashaYears[$lord]) / 120.0;
            $endDate = $this->addDaysToDateStr($theoreticalCurDate, $antarYears * 365.25);

            if (strtotime($endDate) > strtotime($clampDate)) {
                $actualStart = $theoreticalCurDate;
                if (strtotime($theoreticalCurDate) < strtotime($clampDate)) {
                    $actualStart = $clampDate;
                }

                $diffDays = (strtotime($endDate) - strtotime($actualStart)) / 86400;
                $actualYears = $diffDays / 365.25;

                $antardashas[] = [
                    'planet' => $lord,
                    'start' => $actualStart,
                    'end' => $endDate,
                    'years' => (float)number_format($actualYears, 4, '.', ''),
                    'pratyantara_dashas' => $this->calcPratyantara(
                        $mahaLord,
                        $lord,
                        $theoreticalCurDate,
                        $clampDate
                    ),
                ];
            }
            $theoreticalCurDate = $endDate;
        }
        return $antardashas;
    }

    public function calcPratyantara(string $mahaLord, string $antarLord, string $theoreticalStart, string $clampDate): array {
        $dashaYears = DASHA_YEARS;
        $dashaOrder = DASHA_ORDER;

        $mahaTotalYears = $dashaYears[$mahaLord];
        $antarTotalYears = ($mahaTotalYears * $dashaYears[$antarLord]) / 120.0;
        $startPos = array_search($antarLord, $dashaOrder);
        $theoreticalCurDate = (new DateTime($theoreticalStart, new DateTimeZone('UTC')))->format('Y-m-d');
        $pratyantaras = [];

        for ($i = 0; $i < 9; $i++) {
            $lord = $dashaOrder[($startPos + $i) % 9];
            $pratDays = (int)round(($antarTotalYears * 365.25 * $dashaYears[$lord]) / 120.0);
            $endDate = $this->addDaysToDateStr($theoreticalCurDate, $pratDays);

            if (strtotime($endDate) > strtotime($clampDate)) {
                $actualStart = $theoreticalCurDate;
                if (strtotime($theoreticalCurDate) < strtotime($clampDate)) {
                    $actualStart = $clampDate;
                }

                $actualDays = (int)round((strtotime($endDate) - strtotime($actualStart)) / 86400);

                $pratyantaras[] = [
                    'planet' => $lord,
                    'start' => $actualStart,
                    'end' => $endDate,
                    'days' => $actualDays,
                ];
            }
            $theoreticalCurDate = $endDate;
        }
        return $pratyantaras;
    }

    public function calcPanchanga(float $sunLon, float $moonLon): array {
        $diff = $this->fmod360($moonLon - $sunLon);
        $tithi = (int)floor($diff / 12) + 1;
        $tithiNames = [
            "", "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
            "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
            "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
            "K.Pratipada", "K.Dvitiya", "K.Tritiya", "K.Chaturthi", "K.Panchami",
            "K.Shashthi", "K.Saptami", "K.Ashtami", "K.Navami", "K.Dashami",
            "K.Ekadashi", "K.Dwadashi", "K.Trayodashi", "K.Chaturdashi", "Amavasya"
        ];

        $yogaIdx = (int)floor($this->fmod360($sunLon + $moonLon) / (360 / 27.0));
        $yogaNames = [
            "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
            "Sukarman", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
            "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
            "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
        ];

        $kIndex = (int)floor($diff / 6);
        $movableKaranas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
        $karanaName = "";
        if ($kIndex === 0) $karanaName = "Kimstughna";
        else if ($kIndex === 57) $karanaName = "Shakuni";
        else if ($kIndex === 58) $karanaName = "Chatushpada";
        else if ($kIndex === 59) $karanaName = "Naga";
        else $karanaName = $movableKaranas[($kIndex - 1) % 7];

        $varaNames = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];
        $vara = (int)floor($this->julianDay + 1.5) % 7;
        $paksha = $diff < 180 ? "Shukla (Waxing)" : "Krishna (Waning)";
        $moonNak = $this->getNakInfo($moonLon);

        return [
            'tithi' => isset($tithiNames[$tithi]) ? $tithiNames[$tithi] : "Tithi {$tithi}",
            'tithi_number' => $tithi,
            'paksha' => $paksha,
            'yoga' => $yogaNames[min($yogaIdx, 26)],
            'karana' => $karanaName,
            'vara' => $varaNames[$vara],
            'moon_nakshatra' => $moonNak['nakshatra'],
            'moon_pada' => $moonNak['pada'],
        ];
    }

    public function calcShadabala(array $planets, int $lagnaRashi): array {
        $exaltDeg = [
            Planet::SUN => 10, Planet::MOON => 33, Planet::MARS => 298,
            Planet::MERCURY => 165, Planet::JUPITER => 95, Planet::VENUS => 357,
            Planet::SATURN => 200, Planet::RAHU => 60, Planet::KETU => 240
        ];
        $exaltRashi = [
            Planet::SUN => 1, Planet::MOON => 2, Planet::MARS => 10,
            Planet::MERCURY => 6, Planet::JUPITER => 4, Planet::VENUS => 12,
            Planet::SATURN => 7, Planet::RAHU => 2, Planet::KETU => 8
        ];
        $debilRashi = [
            Planet::SUN => 7, Planet::MOON => 8, Planet::MARS => 4,
            Planet::MERCURY => 12, Planet::JUPITER => 10, Planet::VENUS => 6,
            Planet::SATURN => 1, Planet::RAHU => 8, Planet::KETU => 2
        ];
        $mtRashi = [
            Planet::SUN => 5, Planet::MOON => 2, Planet::MARS => 1,
            Planet::MERCURY => 6, Planet::JUPITER => 9, Planet::VENUS => 7,
            Planet::SATURN => 11
        ];
        $ownRashi = [
            Planet::SUN => [5], Planet::MOON => [4], Planet::MARS => [1, 8],
            Planet::MERCURY => [3, 6], Planet::JUPITER => [9, 12], Planet::VENUS => [2, 7],
            Planet::SATURN => [10, 11]
        ];

        $natFriendScore = [
            Planet::SUN => [Planet::MOON => "friend", Planet::MARS => "friend", Planet::JUPITER => "friend", Planet::MERCURY => "neutral", Planet::VENUS => "enemy", Planet::SATURN => "enemy", Planet::RAHU => "enemy", Planet::KETU => "enemy"],
            Planet::MOON => [Planet::SUN => "friend", Planet::MERCURY => "friend", Planet::MARS => "neutral", Planet::JUPITER => "neutral", Planet::VENUS => "neutral", Planet::SATURN => "neutral", Planet::RAHU => "enemy", Planet::KETU => "enemy"],
            Planet::MARS => [Planet::SUN => "friend", Planet::MOON => "friend", Planet::JUPITER => "friend", Planet::VENUS => "neutral", Planet::SATURN => "neutral", Planet::MERCURY => "enemy", Planet::RAHU => "enemy", Planet::KETU => "enemy"],
            Planet::MERCURY => [Planet::SUN => "friend", Planet::VENUS => "friend", Planet::RAHU => "neutral", Planet::MARS => "neutral", Planet::JUPITER => "neutral", Planet::SATURN => "neutral", Planet::MOON => "enemy", Planet::KETU => "enemy"],
            Planet::JUPITER => [Planet::SUN => "friend", Planet::MOON => "friend", Planet::MARS => "friend", Planet::SATURN => "neutral", Planet::MERCURY => "enemy", Planet::VENUS => "enemy", Planet::RAHU => "enemy", Planet::KETU => "enemy"],
            Planet::VENUS => [Planet::MERCURY => "friend", Planet::SATURN => "friend", Planet::MARS => "neutral", Planet::JUPITER => "neutral", Planet::RAHU => "neutral", Planet::SUN => "enemy", Planet::MOON => "enemy", Planet::KETU => "enemy"],
            Planet::SATURN => [Planet::MERCURY => "friend", Planet::VENUS => "friend", Planet::RAHU => "friend", Planet::JUPITER => "neutral", Planet::SUN => "enemy", Planet::MOON => "enemy", Planet::MARS => "enemy", Planet::KETU => "enemy"],
        ];

        $naisargikaStrength = [
            Planet::SUN => 60, Planet::MOON => 51.43, Planet::VENUS => 42.86,
            Planet::JUPITER => 34.29, Planet::MERCURY => 25.71, Planet::MARS => 17.14,
            Planet::SATURN => 8.57, Planet::RAHU => 5, Planet::KETU => 5
        ];

        $results = [];
        $grahas = [Planet::SUN, Planet::MOON, Planet::MARS, Planet::MERCURY, Planet::JUPITER, Planet::VENUS, Planet::SATURN];

        foreach ($grahas as $p) {
            if (!isset($planets[$p])) continue;
            $pData = $planets[$p];

            $sthana = 0;
            $pRashi = $pData['rashi'];
            $uchhaFull = isset($exaltDeg[$p]) ? $exaltDeg[$p] : 0;
            $actualDeg = $pData['longitude'];
            $uchhaAngle = min(
                $this->fmod360(abs($actualDeg - $uchhaFull)),
                $this->fmod360(360 - abs($actualDeg - $uchhaFull))
            );
            $sthana += max(0, (180 - $uchhaAngle) / 3.0);

            if (isset($exaltRashi[$p]) && $pRashi === $exaltRashi[$p]) $sthana += 45;
            else if (isset($mtRashi[$p]) && $pRashi === $mtRashi[$p]) $sthana += 37.5;
            else if (isset($ownRashi[$p]) && in_array($pRashi, $ownRashi[$p])) $sthana += 30;
            else if (isset($debilRashi[$p]) && $pRashi === $debilRashi[$p]) $sthana += 0;
            else $sthana += 15;

            $digBestHouse = [
                Planet::SUN => 10, Planet::MOON => 4, Planet::MARS => 7,
                Planet::MERCURY => 1, Planet::JUPITER => 10, Planet::VENUS => 4, Planet::SATURN => 7
            ];
            $bestH = isset($digBestHouse[$p]) ? $digBestHouse[$p] : 1;
            $hDiff = min(abs($pData['house'] - $bestH), 12 - abs($pData['house'] - $bestH));
            $digBala = max(0, 60 - $hDiff * 5);

            $kalaBala = 0;
            $isDay = true;
            if (in_array($p, [Planet::SUN, Planet::JUPITER, Planet::SATURN])) $kalaBala += $isDay ? 15 : 5;
            if (in_array($p, [Planet::MOON, Planet::VENUS, Planet::MARS])) $kalaBala += $isDay ? 5 : 15;
            if ($p === Planet::MERCURY) $kalaBala += 7.5;

            $sunLon = isset($planets[Planet::SUN]) ? $planets[Planet::SUN]['longitude'] : 0;
            $moonLon = isset($planets[Planet::MOON]) ? $planets[Planet::MOON]['longitude'] : 0;
            $tithiDiff = $this->fmod360($moonLon - $sunLon);
            $pakshaBala = $tithiDiff < 180 ? ($tithiDiff / 180.0) * 60 : ((360 - $tithiDiff) / 180.0) * 60;
            $kalaBala += in_array($p, [Planet::MOON, Planet::MERCURY, Planet::JUPITER, Planet::VENUS]) ? $pakshaBala : (60 - $pakshaBala);

            $mSpeed = [
                Planet::SUN => 1.0, Planet::MOON => 13.176, Planet::MARS => 0.524,
                Planet::MERCURY => 1.383, Planet::JUPITER => 0.083, Planet::VENUS => 1.6, Planet::SATURN => 0.033
            ];
            $sp = isset($mSpeed[$p]) ? $mSpeed[$p] : 1.0;
            $chestaBala = $pData['retrograde'] ? 60 : min(60, (abs($pData['speed']) / max($sp, 0.001)) * 30);
            $naisargika = isset($naisargikaStrength[$p]) ? $naisargikaStrength[$p] : 15;

            $drigBala = 0;
            foreach ($grahas as $asp) {
                if ($asp === $p || !isset($planets[$asp])) continue;
                $houseDiff = ($planets[$asp]['house'] - $pData['house'] + 12) % 12;
                $aspScore = $houseDiff === 6 ? 1 : (in_array($houseDiff, [2, 4, 8, 10]) ? 0.5 : (in_array($houseDiff, [3, 9]) ? 0.75 : 0));
                $rel = isset($natFriendScore[$p][$asp]) ? $natFriendScore[$p][$asp] : "neutral";
                if ($aspScore > 0) {
                    $drigBala += $aspScore * ($rel === "friend" ? 1 : ($rel === "enemy" ? -1 : 0)) * 15;
                }
            }
            $drigBala = max(0, $drigBala + 30);

            $total = $sthana + $digBala + $kalaBala + $chestaBala + $naisargika + $drigBala;
            $results[$p] = [
                'sthana_bala' => (float)number_format($sthana, 2, '.', ''),
                'dig_bala' => (float)number_format($digBala, 2, '.', ''),
                'kala_bala' => (float)number_format($kalaBala, 2, '.', ''),
                'chesta_bala' => (float)number_format($chestaBala, 2, '.', ''),
                'naisargika_bala' => (float)number_format($naisargika, 2, '.', ''),
                'drig_bala' => (float)number_format($drigBala, 2, '.', ''),
                'total_rupas' => (float)number_format($total, 2, '.', ''),
                'virupas' => (int)round($total * 60),
                'strength' => $total >= 150 ? "Strong" : ($total >= 90 ? "Medium" : "Weak"),
            ];
        }
        return $results;
    }

    public static function calcAshtakavarga(array $planets, int $lagnaRashi): array {
        $beneficPositions = [
            'Sun' => [
                'Sun' => [1, 2, 4, 7, 8, 9, 10, 11], 'Moon' => [3, 6, 10, 11], 'Mars' => [1, 2, 4, 7, 8, 9, 10, 11],
                'Mercury' => [3, 5, 6, 9, 10, 11, 12], 'Jupiter' => [5, 6, 9, 11], 'Venus' => [6, 7, 12],
                'Saturn' => [1, 2, 4, 7, 8, 9, 10, 11], 'Lagna' => [3, 4, 6, 10, 11, 12]
            ],
            'Moon' => [
                'Sun' => [3, 6, 7, 8, 10, 11], 'Moon' => [1, 3, 6, 7, 10, 11], 'Mars' => [2, 3, 5, 6, 9, 10, 11],
                'Mercury' => [1, 3, 4, 5, 7, 8, 10, 11], 'Jupiter' => [1, 4, 7, 8, 10, 11, 12], 'Venus' => [3, 4, 5, 7, 9, 10, 11],
                'Saturn' => [3, 5, 6, 11], 'Lagna' => [3, 6, 10, 11]
            ],
            'Mars' => [
                'Sun' => [3, 5, 6, 10, 11], 'Moon' => [3, 6, 11], 'Mars' => [1, 2, 4, 7, 8, 10, 11],
                'Mercury' => [3, 5, 6, 11], 'Jupiter' => [6, 10, 11, 12], 'Venus' => [6, 8, 11, 12],
                'Saturn' => [1, 4, 7, 8, 9, 10, 11], 'Lagna' => [1, 3, 6, 10, 11]
            ],
            'Mercury' => [
                'Sun' => [5, 6, 9, 11, 12], 'Moon' => [2, 4, 6, 8, 10, 11], 'Mars' => [1, 2, 4, 7, 8, 9, 10, 11],
                'Mercury' => [1, 3, 5, 6, 9, 10, 11, 12], 'Jupiter' => [6, 8, 11, 12], 'Venus' => [1, 2, 3, 4, 5, 8, 9, 11],
                'Saturn' => [1, 2, 4, 7, 8, 9, 10, 11], 'Lagna' => [1, 2, 4, 6, 8, 10, 11]
            ],
            'Jupiter' => [
                'Sun' => [1, 2, 3, 4, 7, 8, 9, 10, 11], 'Moon' => [2, 5, 7, 9, 11], 'Mars' => [1, 2, 4, 7, 8, 10, 11],
                'Mercury' => [1, 2, 4, 5, 6, 9, 10, 11], 'Jupiter' => [1, 2, 3, 4, 7, 8, 10, 11], 'Venus' => [2, 5, 6, 9, 10, 11],
                'Saturn' => [3, 5, 6, 12], 'Lagna' => [1, 2, 4, 5, 6, 7, 9, 10, 11]
            ],
            'Venus' => [
                'Sun' => [8, 11, 12], 'Moon' => [1, 2, 3, 4, 5, 8, 9, 11, 12], 'Mars' => [3, 4, 6, 9, 11, 12],
                'Mercury' => [3, 5, 6, 9, 11], 'Jupiter' => [5, 8, 9, 10, 11], 'Venus' => [1, 2, 3, 4, 5, 8, 9, 10, 11],
                'Saturn' => [3, 4, 5, 8, 9, 10, 11], 'Lagna' => [1, 2, 3, 4, 5, 8, 9, 11]
            ],
            'Saturn' => [
                'Sun' => [1, 2, 4, 7, 8, 10, 11], 'Moon' => [3, 6, 11], 'Mars' => [3, 5, 6, 10, 11, 12],
                'Mercury' => [6, 8, 9, 10, 11, 12], 'Jupiter' => [5, 6, 11, 12], 'Venus' => [6, 11, 12],
                'Saturn' => [3, 5, 6, 11], 'Lagna' => [1, 3, 4, 6, 10, 11]
            ],
        ];

        $subjects = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
        $sourceRashis = ['Lagna' => $lagnaRashi];
        foreach ($subjects as $subject) {
            if (isset($planets[$subject])) {
                $sourceRashis[$subject] = $planets[$subject]['rashi'];
            }
        }

        $prastara = [];
        $sarva = [];
        for ($house = 1; $house <= 12; $house++) $sarva[$house] = ['points' => 0];

        foreach ($subjects as $subject) {
            $prastara[$subject] = [];
            for ($house = 1; $house <= 12; $house++) $prastara[$subject][$house] = 0;

            $contributors = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna"];
            foreach ($contributors as $contributor) {
                if (!isset($sourceRashis[$contributor])) continue;
                $fromRashi = $sourceRashis[$contributor];
                $allowedOffsets = isset($beneficPositions[$subject][$contributor]) ? $beneficPositions[$subject][$contributor] : [];

                for ($house = 1; $house <= 12; $house++) {
                    $offset = (($house - $fromRashi + 12) % 12) + 1;
                    if (in_array($offset, $allowedOffsets)) {
                        $prastara[$subject][$house]++;
                        $sarva[$house]['points']++;
                    }
                }
            }
        }

        $planetBeneficPoints = [];
        foreach ($subjects as $subject) {
            $r = isset($sourceRashis[$subject]) ? $sourceRashis[$subject] : 1;
            $planetBeneficPoints[$subject] = isset($prastara[$subject][$r]) ? $prastara[$subject][$r] : 0;
        }

        return [
            'prastarashtakavarga' => $prastara,
            'sarvashtakavarga' => $sarva,
            'planet_benefic_pts' => $planetBeneficPoints,
        ];
    }
}
