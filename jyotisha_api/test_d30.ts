import { VedicAstroEngine } from './engine/VedicAstroEngine';

const engine = VedicAstroEngine.fromBirthData(1982, 2, 16, 12, 15, 5.5, 'lahiri');
const planets = engine.calculateAll(13.16, 78.75);
console.log('Rahu Rashi:', planets.Rahu?.rashi, 'Degree:', planets.Rahu?.degree);
console.log('Ketu Rashi:', planets.Ketu?.rashi, 'Degree:', planets.Ketu?.degree);

const d30 = engine.calcTrimshamshaD30(planets);
console.log('D30 Rahu:', d30.Rahu);
console.log('D30 Ketu:', d30.Ketu);
