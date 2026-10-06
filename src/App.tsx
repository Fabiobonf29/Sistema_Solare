import { useState, useEffect, useRef } from 'react';

interface Planet {
  name: string;
  nameIt: string;
  diameter: number;
  distanceFromSun: number;
  orbitalPeriod: number;
  color: string;
  size: number;
  orbitRadius: number;
  description: string;
}

const planets: Planet[] = [
  {
    name: 'Mercury',
    nameIt: 'Mercurio',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    size: 8,
    orbitRadius: 70,
    description: 'Il pianeta più piccolo e più vicino al Sole. La sua superficie è coperta di crateri.'
  },
  {
    name: 'Venus',
    nameIt: 'Venere',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    size: 12,
    orbitRadius: 100,
    description: 'Il pianeta più caldo del sistema solare, con una densa atmosfera di CO2.'
  },
  {
    name: 'Earth',
    nameIt: 'Terra',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    size: 13,
    orbitRadius: 140,
    description: 'Il nostro pianeta, l\'unico conosciuto con forme di vita. Ha un\'atmosfera ricca di azoto e ossigeno.'
  },
  {
    name: 'Mars',
    nameIt: 'Marte',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07040',
    size: 10,
    orbitRadius: 185,
    description: 'Il pianeta rosso, con il vulcano più alto del sistema solare (Olympus Mons).'
  },
  {
    name: 'Jupiter',
    nameIt: 'Giove',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#d4a574',
    size: 28,
    orbitRadius: 250,
    description: 'Il pianeta più grande, una gigante gassosa con la Grande Macchia Rossa.'
  },
  {
    name: 'Saturn',
    nameIt: 'Saturno',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#f4d9a0',
    size: 24,
    orbitRadius: 320,
    description: 'Famoso per i suoi spettacolari anelli composti da ghiaccio e roccia.'
  },
  {
    name: 'Uranus',
    nameIt: 'Urano',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    size: 18,
    orbitRadius: 385,
    description: 'Un gigante di ghiaccio che ruota su un fianco con un\'inclinazione assiale di 98°.'
  },
  {
    name: 'Neptune',
    nameIt: 'Nettuno',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4466ff',
    size: 17,
    orbitRadius: 440,
    description: 'Il pianeta più lontano, con i venti più veloci del sistema solare (2100 km/h).'
  }
];

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * 360));
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (isPlaying) {
        setAngles(prev => prev.map((angle, i) => {
          const baseSpeed = 360 / (planets[i].orbitalPeriod * 2);
          return (angle + baseSpeed * speed * (delta / 16)) % 360;
        }));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet);
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="w-full h-screen bg-gray-950 overflow-hidden relative flex flex-col">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          ☀️ Sistema Solare Interattivo
        </h1>
        <p className="text-gray-400 text-sm mt-1">Clicca su un pianeta per scoprire le sue caratteristiche</p>
      </div>

      {/* Solar System */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="relative" style={{ width: '900px', height: '900px' }}>
          {/* Sun */}
          <div
            className="absolute rounded-full cursor-pointer z-20"
            style={{
              width: '60px',
              height: '60px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #fff700 0%, #ff8c00 50%, #ff4500 100%)',
              boxShadow: '0 0 40px 15px rgba(255, 165, 0, 0.6), 0 0 80px 30px rgba(255, 69, 0, 0.3)',
            }}
          />

          {/* Orbits and Planets */}
          {planets.map((planet, index) => (
            <div key={planet.name}>
              {/* Orbit path */}
              <div
                className="absolute rounded-full border border-gray-700/40"
                style={{
                  width: planet.orbitRadius * 2 + 'px',
                  height: planet.orbitRadius * 2 + 'px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Planet */}
              <div
                className="absolute cursor-pointer z-10 group"
                style={{
                  width: planet.size + 'px',
                  height: planet.size + 'px',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angles[index]}deg) translateX(${planet.orbitRadius}px)`,
                }}
                onClick={() => handlePlanetClick(planet)}
              >
                <div
                  className="w-full h-full rounded-full transition-transform hover:scale-150"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}88)`,
                    boxShadow: selectedPlanet?.name === planet.name
                      ? `0 0 15px 5px ${planet.color}80, 0 0 30px 10px ${planet.color}40`
                      : `0 0 5px 2px ${planet.color}60`,
                  }}
                />
                {/* Planet label */}
                <div
                  className="absolute text-xs text-white/80 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    top: '-20px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${-angles[index]}deg)`,
                  }}
                >
                  {planet.nameIt}
                </div>
                {/* Saturn rings */}
                {planet.name === 'Saturn' && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: planet.size * 1.8 + 'px',
                      height: planet.size * 0.5 + 'px',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${-angles[index]}deg) rotateX(60deg)`,
                      border: `2px solid ${planet.color}80`,
                      borderRadius: '50%',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 z-30 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-5 w-72 shadow-2xl">
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.color}88)`,
                boxShadow: `0 0 10px 3px ${selectedPlanet.color}60`,
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPlanet.nameIt}</h2>
              <p className="text-gray-400 text-xs">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPlanet.description}</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400 text-sm">📏 Diametro</span>
              <span className="text-white font-semibold">{selectedPlanet.diameter.toLocaleString('it-IT')} km</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400 text-sm">🌞 Distanza dal Sole</span>
              <span className="text-white font-semibold">{selectedPlanet.distanceFromSun.toLocaleString('it-IT')} M km</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm">🔄 Periodo orbitale</span>
              <span className="text-white font-semibold">{selectedPlanet.orbitalPeriod.toLocaleString('it-IT')} giorni</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium shadow-lg"
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pausa
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Riproduci
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm font-medium">⚡ Velocità:</span>
            <div className="flex gap-1">
              {speedOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    speed === s
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Current speed display */}
          <div className="text-gray-400 text-sm">
            {isPlaying ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                In movimento a {speed}x
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                In pausa
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
