17-06-2026
- Added location details (place, longitude, latitude, and timezone) under the search results table in both Panchanga tab and `PanchangaSearch.jsx`.
- Swapped chart footers in the Muhurtha tab: D1 chart displays saved location details (at a smaller font size of 11px) and D9 chart displays the Ayanamsha name.
- Synchronized Muhurtha D1/D9 chart calculation coordinates with the loaded profile's saved location rather than the currently entered form coordinates.
- Modified the JSON export feature to include location metadata (city, lat, lon, tz) inside the exported JSON object.
- Wrapped the Saved Muhurtha Table in horizontal and vertical scrollable containers (maxHeight: 400px).
- Restructured Varjyam and Durmuhurtham interval display to render line-by-line.
- Implemented precise Lagna and Pushkaraamsha calculation window calculations using Julian days and binary search in the Node API.
- Implemented backend caching of ayanamsha value to optimize performance of binary search calculation.
- Fixed a sign inversion error in ascendant calculation logic.
- Added a borderless, transparent reset button (🔄) next to the date and time fields in Sankalpa and Me Profile pages to quickly reset input values to the current local date and time.
- Standardized the reset button height and icon sizes to match input fields uniformly (41px for Sankalpa Page, 37px for Me Page).


16-06-2026
- Pancahnga at surise logic removed and displayed panchange as per realtime. 
- Nitya Sankalpa moved to a separate page
- Added date and time selection to Sankalpa page
- Added "Today" button to Sankalpa page to quickly set current date and time
- Made date and time picker collapsible (click to expand/collapse)
- Enabled PWA auto-update mode to automatically download and apply new web app builds/updates immediately without manual hard refreshes or clicks.
- Added short weekday (Vaaram) display to the daily Panchanga banner in the Me Profile page in Sanskrit transliteration (Bhaanu, Soma, Mangala, Budha, Guru, Shukra, Shani format).
- Increased the font-size of card icons on the Home Page by 20% for both desktop and mobile screens while preserving text sizes.
- Added global chunk load error and unhandled promise rejection handlers to automatically reload the page when a dynamic page import fails, preventing blank screen issues after updates/deployments.
- Implemented next Guru Balam prediction calculation and display on the Me Profile page, utilizing a static JSON database of Jupiter (Guru) transits from 2024 to 2040 for instant offline client-side calculation.
- Made Balams Grid on the Me Profile page responsive (stacks cards vertically "one by one" on mobile screens of width <= 600px).
- Extended prediction feature to Shani Balam (calculates and displays next/ending transit dates for Shani Balam under Option 3 style utilizing a static database of Saturn transits from 2023 to 2041).
- Added Shani Balam specific translation keys to Telugu, Kannada, and English locale files.
- Fixed `QuotaExceededError` in LocalStorage during background sync of daily dashboard data by creating a `safeSetLocalStorage` helper that automatically prunes old cached charts to free up space.


15-06-2026
- Nija Jesta masa display bug fixed
- defult location bug fixed in eclock page
- push messge scrolling bug issue fixed
- Repositioned D1 and D9 gear icons above charts with a minute 2px gap (they no longer overlap chart cells)
- Removed gear button background shadow, border, and background circle, making it transparent
- Increased gear icon size by 20%.
- Introduced North Indian Chart Type, user can select chart type in Settings page (South Indian vs North Indian, defaults to South Indian).
- Supported North Indian layout globally (Horoscope, Gochara, Ashtakavarga, Match Page, Muhurtha Tab, Astro Clock, and PDF exports) with bold planet names for better readability.
- Enabled instant reactive update across all charts when the chart style is changed and saved.
- Removed Chart Style toggling selection from the D1 chart settings gear menu, keeping it centered in settings.
- PDF chart styles for Ashtakavarga and Matchmaking D1/D9 fixed
- deleted Vendor directory (excluding composer.json and composer.lock)



14-06-2026
- Enabled manual co-ordinates below place field. 
- Added Setting Icon to Birth Chart. in that setting we can enable/disable the display of planets degrees.
- New gear icon added in Navamsha Chart to display Divisional charts.

