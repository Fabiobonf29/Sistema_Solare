import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameIt: string;
  diameter: number;
  distanceFromSun: number;
  orbitalPeriod: number;
  color: string;
  size: number;
  orbitRadius: number;
  description: string;
  emoji: string;
}

const planetsData: PlanetData[] = [
  {
    name: 'Mercury', nameIt: 'Mercurio', diameter: 4879, distanceFromSun: 57.9,
    orbitalPeriod: 88, color: '#b5b5b5', size: 6, orbitRadius: 55, emoji: '☿',
    description: 'Il pianeta più piccolo e più vicino al Sole. La sua superficie è coperta di crateri, simile alla nostra Luna.'
  },
  {
    name: 'Venus', nameIt: 'Venere', diameter: 12104, distanceFromSun: 108.2,
    orbitalPeriod: 225, color: '#e8cda0', size: 10, orbitRadius: 80, emoji: '♀',
    description: 'Il pianeta più caldo del sistema solare con una densa atmosfera di CO₂. Ruota in senso opposto agli altri pianeti.'
  },
  {
    name: 'Earth', nameIt: 'Terra', diameter: 12756, distanceFromSun: 149.6,
    orbitalPeriod: 365, color: '#4da6ff', size: 11, orbitRadius: 110, emoji: '🌍',
    description: 'Il nostro pianeta, l\'unico conosciuto con forme di vita. Ha un\'atmosfera ricca di azoto e ossigeno.'
  },
  {
    name: 'Mars', nameIt: 'Marte', diameter: 6792, distanceFromSun: 227.9,
    orbitalPeriod: 687, color: '#e07040', size: 8, orbitRadius: 145, emoji: '♂',
    description: 'Il pianeta rosso, con il vulcano più alto del sistema solare: l\'Olympus Mons (21 km).'
  },
  {
    name: 'Jupiter', nameIt: 'Giove', diameter: 142984, distanceFromSun: 778.6,
    orbitalPeriod: 4333, color: '#d4a574', size: 22, orbitRadius: 200, emoji: '♃',
    description: 'Il pianeta più grande, una gigante gassosa con la famosa Grande Macchia Rossa, una tempesta secolare.'
  },
  {
    name: 'Saturn', nameIt: 'Saturno', diameter: 120536, distanceFromSun: 1433.5,
    orbitalPeriod: 10759, color: '#f4d9a0', size: 19, orbitRadius: 260, emoji: '♄',
    description: 'Famoso per i suoi spettacolari anelli composti da miliardi di particelle di ghiaccio e roccia.'
  },
  {
    name: 'Uranus', nameIt: 'Urano', diameter: 51118, distanceFromSun: 2872.5,
    orbitalPeriod: 30687, color: '#7de8e8', size: 15, orbitRadius: 310, emoji: '♅',
    description: 'Un gigante di ghiaccio che ruota su un fianco con un\'inclinazione assiale di 98°.'
  },
  {
    name: 'Neptune', nameIt: 'Nettuno', diameter: 49528, distanceFromSun: 4495.1,
    orbitalPeriod: 60190, color: '#4466ff', size: 14, orbitRadius: 355, emoji: '♆',
    description: 'Il pianeta più lontano, con i venti più veloci del sistema solare che raggiungono 2100 km/h.'
  }
];

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const anglesRef = useRef<number[]>(planetsData.map(() => Math.random() * Math.PI * 2));
  const [displayAngles, setDisplayAngles] = useState<number[]>([...anglesRef.current]);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Generate stable stars
  const stars = useMemo(() => {
    return Array.from({ length: 250 }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 127.1 + 311.7) * 43758.5453) % 100,
      y: (Math.sin(i * 269.5 + 183.3) * 43758.5453) % 100,
      size: ((Math.sin(i * 420.3) * 43758.5453) % 1) * 2 + 0.5,
      opacity: ((Math.sin(i * 631.2) * 43758.5453) % 1) * 0.6 + 0.3,
      delay: ((Math.sin(i * 853.1) * 43758.5453) % 1) * 5,
    }));
  }, []);

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = Math.min(time - lastTimeRef.current, 50);
    lastTimeRef.current = time;

    if (isPlayingRef.current) {
      const sp = speedRef.current;
      anglesRef.current = anglesRef.current.map((angle, i) => {
        const baseSpeed = (2 * Math.PI) / (planetsData[i].orbitalPeriod * 1.5);
        return (angle + baseSpeed * sp * (delta / 16)) % (Math.PI * 2);
      });
      setDisplayAngles([...anglesRef.current]);
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate]);

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(prev => prev?.name === planet.name ? null : planet);
  };

  const speedOptions = [0.5, 1, 2, 5, 10];

  // SVG viewBox
  const viewSize = 800;
  const center = viewSize / 2;

  return (
    <div className="w-full h-screen bg-[#030712] overflow-hidden relative flex flex-col select-none">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: Math.abs(star.x) + '%',
              top: Math.abs(star.y) + '%',
              opacity: star.opacity,
              animation: `twinkle ${3 + star.delay}s ease-in-out infinite`,
              animationDelay: star.delay + 's',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-3 pb-1 px-4">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
          <span className="text-3xl md:text-4xl">☀️</span>
          Sistema Solare Interattivo
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">Clicca su un pianeta per scoprire le sue caratteristiche</p>
      </div>

      {/* Main solar system area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          className="w-full h-full max-w-[800px] max-h-[800px]"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          <defs>
            <radialGradient id="sunGlow">
              <stop offset="0%" stopColor="#fff700" />
              <stop offset="40%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff4500" />
            </radialGradient>
            <radialGradient id="sunOuter">
              <stop offset="0%" stopColor="rgba(255,165,0,0.4)" />
              <stop offset="100%" stopColor="rgba(255,69,0,0)" />
            </radialGradient>
            {planetsData.map(p => (
              <radialGradient key={p.name} id={`grad-${p.name}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={p.color} stopOpacity="1" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0.6" />
              </radialGradient>
            ))}
          </defs>

          {/* Sun outer glow */}
          <circle cx={center} cy={center} r="50" fill="url(#sunOuter)">
            <animate attributeName="r" values="48;55;48" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Sun */}
          <circle cx={center} cy={center} r="28" fill="url(#sunGlow)">
            <animate attributeName="r" values="27;29;27" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Orbits */}
          {planetsData.map(planet => (
            <circle
              key={`orbit-${planet.name}`}
              cx={center}
              cy={center}
              r={planet.orbitRadius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Planets */}
          {planetsData.map((planet, i) => {
            const angle = displayAngles[i];
            const px = center + Math.cos(angle) * planet.orbitRadius;
            const py = center + Math.sin(angle) * planet.orbitRadius;
            const isSelected = selectedPlanet?.name === planet.name;

            return (
              <g
                key={planet.name}
                onClick={() => handlePlanetClick(planet)}
                className="cursor-pointer"
                style={{ transition: 'transform 0.1s' }}
              >
                {/* Selection glow */}
                {isSelected && (
                  <circle cx={px} cy={py} r={planet.size + 8} fill="none" stroke={planet.color} strokeWidth="2" opacity="0.6">
                    <animate attributeName="r" values={`${planet.size + 6};${planet.size + 12};${planet.size + 6}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Planet glow */}
                <circle cx={px} cy={py} r={planet.size + 3} fill={planet.color} opacity="0.15" />

                {/* Planet body */}
                <circle
                  cx={px}
                  cy={py}
                  r={planet.size}
                  fill={`url(#grad-${planet.name})`}
                  stroke={isSelected ? planet.color : 'transparent'}
                  strokeWidth={isSelected ? 2 : 0}
                />

                {/* Saturn rings */}
                {planet.name === 'Saturn' && (
                  <ellipse
                    cx={px}
                    cy={py}
                    rx={planet.size * 1.7}
                    ry={planet.size * 0.4}
                    fill="none"
                    stroke={planet.color}
                    strokeWidth="2"
                    opacity="0.7"
                    transform={`rotate(-20, ${px}, ${py})`}
                  />
                )}

                {/* Planet label */}
                <text
                  x={px}
                  y={py - planet.size - 6}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  opacity={isSelected ? 1 : 0.7}
                  className="pointer-events-none"
                >
                  {planet.nameIt}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-16 right-2 md:right-4 z-30 bg-gray-900/95 backdrop-blur-md border border-gray-600/50 rounded-xl p-4 md:p-5 w-64 md:w-72 shadow-2xl animate-fadeIn">
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-2 right-3 text-gray-400 hover:text-white text-lg transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.color}88)`,
                boxShadow: `0 0 12px 4px ${selectedPlanet.color}50`,
              }}
            />
            <div>
              <h2 className="text-lg font-bold text-white">{selectedPlanet.emoji} {selectedPlanet.nameIt}</h2>
              <p className="text-gray-400 text-xs">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs md:text-sm mb-3 leading-relaxed">{selectedPlanet.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-gray-700/50">
              <span className="text-gray-400 text-xs">📏 Diametro</span>
              <span className="text-white font-semibold text-sm">{selectedPlanet.diameter.toLocaleString('it-IT')} km</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-700/50">
              <span className="text-gray-400 text-xs">🌞 Distanza dal Sole</span>
              <span className="text-white font-semibold text-sm">{selectedPlanet.distanceFromSun.toLocaleString('it-IT')} M km</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-400 text-xs">🔄 Periodo orbitale</span>
              <span className="text-white font-semibold text-sm">{selectedPlanet.orbitalPeriod.toLocaleString('it-IT')} giorni</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm shadow-lg ${
              isPlaying
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                Pausa
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Riproduci
              </>
            )}
          </button>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-xs font-medium hidden sm:inline">⚡ Velocità:</span>
            <div className="flex gap-1">
              {speedOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all ${
                    speed === s
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105'
                      : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="text-gray-400 text-xs flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            {isPlaying ? `In movimento (${speed}x)` : 'In pausa'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
