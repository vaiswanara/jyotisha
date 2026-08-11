<?php
/**
 * Core constants and static data structures for Vedic Astrology Engine
 */

class Planet {
    const SUN = 'Sun';
    const MOON = 'Moon';
    const MARS = 'Mars';
    const MERCURY = 'Mercury';
    const JUPITER = 'Jupiter';
    const VENUS = 'Venus';
    const SATURN = 'Saturn';
    const RAHU = 'Rahu';
    const KETU = 'Ketu';
    const ASCENDANT = 'Ascendant';
}

define('SWE_CODE', [
    Planet::SUN => '0',
    Planet::MOON => '1',
    Planet::MERCURY => '2',
    Planet::VENUS => '3',
    Planet::MARS => '4',
    Planet::JUPITER => '5',
    Planet::SATURN => '6',
    Planet::RAHU => 't',
]);

define('RASHI_NAMES', [
    ['en' => 'Aries', 'sa' => 'Mesha', 'sym' => 'Ar'],
    ['en' => 'Taurus', 'sa' => 'Vrishabha', 'sym' => 'Ta'],
    ['en' => 'Gemini', 'sa' => 'Mithuna', 'sym' => 'Ge'],
    ['en' => 'Cancer', 'sa' => 'Karka', 'sym' => 'Cn'],
    ['en' => 'Leo', 'sa' => 'Simha', 'sym' => 'Le'],
    ['en' => 'Virgo', 'sa' => 'Kanya', 'sym' => 'Vi'],
    ['en' => 'Libra', 'sa' => 'Tula', 'sym' => 'Li'],
    ['en' => 'Scorpio', 'sa' => 'Vrischika', 'sym' => 'Sc'],
    ['en' => 'Sagittarius', 'sa' => 'Dhanu', 'sym' => 'Sg'],
    ['en' => 'Capricorn', 'sa' => 'Makara', 'sym' => 'Cp'],
    ['en' => 'Aquarius', 'sa' => 'Kumbha', 'sym' => 'Aq'],
    ['en' => 'Pisces', 'sa' => 'Meena', 'sym' => 'Pi'],
]);

define('NAKSHATRAS', [
    ['name' => 'Ashwini', 'lord' => Planet::KETU],
    ['name' => 'Bharani', 'lord' => Planet::VENUS],
    ['name' => 'Krittika', 'lord' => Planet::SUN],
    ['name' => 'Rohini', 'lord' => Planet::MOON],
    ['name' => 'Mrigashira', 'lord' => Planet::MARS],
    ['name' => 'Ardra', 'lord' => Planet::RAHU],
    ['name' => 'Punarvasu', 'lord' => Planet::JUPITER],
    ['name' => 'Pushya', 'lord' => Planet::SATURN],
    ['name' => 'Ashlesha', 'lord' => Planet::MERCURY],
    ['name' => 'Magha', 'lord' => Planet::KETU],
    ['name' => 'Purva Phalguni', 'lord' => Planet::VENUS],
    ['name' => 'Uttara Phalguni', 'lord' => Planet::SUN],
    ['name' => 'Hasta', 'lord' => Planet::MOON],
    ['name' => 'Chitra', 'lord' => Planet::MARS],
    ['name' => 'Swati', 'lord' => Planet::RAHU],
    ['name' => 'Vishakha', 'lord' => Planet::JUPITER],
    ['name' => 'Anuradha', 'lord' => Planet::SATURN],
    ['name' => 'Jyeshtha', 'lord' => Planet::MERCURY],
    ['name' => 'Mula', 'lord' => Planet::KETU],
    ['name' => 'Purva Ashadha', 'lord' => Planet::VENUS],
    ['name' => 'Uttara Ashadha', 'lord' => Planet::SUN],
    ['name' => 'Shravana', 'lord' => Planet::MOON],
    ['name' => 'Dhanishtha', 'lord' => Planet::MARS],
    ['name' => 'Shatabhisha', 'lord' => Planet::RAHU],
    ['name' => 'Purva Bhadrapada', 'lord' => Planet::JUPITER],
    ['name' => 'Uttara Bhadrapada', 'lord' => Planet::SATURN],
    ['name' => 'Revati', 'lord' => Planet::MERCURY],
]);

define('DASHA_YEARS', [
    Planet::KETU => 7,
    Planet::VENUS => 20,
    Planet::SUN => 6,
    Planet::MOON => 10,
    Planet::MARS => 7,
    Planet::RAHU => 18,
    Planet::JUPITER => 16,
    Planet::SATURN => 19,
    Planet::MERCURY => 17,
    Planet::ASCENDANT => 0,
]);

define('DASHA_ORDER', [
    Planet::KETU,
    Planet::VENUS,
    Planet::SUN,
    Planet::MOON,
    Planet::MARS,
    Planet::RAHU,
    Planet::JUPITER,
    Planet::SATURN,
    Planet::MERCURY,
]);

define('AYANAMSHA_LIST', [
    'lahiri' => ['code' => '1', 'label' => 'Lahiri (Chitrapaksha)'],
    'raman' => ['code' => '3', 'label' => 'B.V. Raman'],
    'krishnamurti' => ['code' => '5', 'label' => 'Krishnamurti (KP)'],
    'fagan_bradley' => ['code' => '0', 'label' => 'Fagan-Bradley'],
    'yukteshwar' => ['code' => '7', 'label' => 'Sri Yukteshwar'],
    'jn_bhasin' => ['code' => '9', 'label' => 'J.N. Bhasin'],
    'sassanian' => ['code' => '16', 'label' => 'Sassanian'],
    'true_chitra' => ['code' => '27', 'label' => 'True Chitra'],
]);
