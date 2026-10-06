import { useState, useEffect, useRef } from 'react';

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
}

const planetsData: PlanetData[] = [
  {
    name: 'Mercury', nameIt: 'Mercurio', diameter: 4879, distanceFromSun: 57.9,
    orbitalPeriod: 88, color: '#b5b5b5', size: 6, orbitRadius: 55,
    description: 'Il pianeta più piccolo e più vicino al Sole. La sua superficie è coperta di crateri.'
  },
  {
    name: 'Venus', nameIt: 'Venere', diameter: 12104, distanceFromSun: 108.2,
    orbitalPeriod: 225, color: '#e8cda0', size: 10, orbitRadius: 80,
    description: 'Il pianeta più caldo del sistema solare con una densa atmosfera di CO₂.'
  },
  {
    name: 'Earth', nameIt: 'Terra', diameter: 12756, distanceFromSun: 149.6,
    orbitalPeriod: 365, color: '#4da6ff', size: 11, orbitRadius: 110,
    description: 'Il nostro pianeta, l\'unico conosciuto con forme di vita.'
  },
  {
    name: 'Mars', nameIt: 'Marte', diameter: 6792, distanceFromSun: 227.9,
    orbitalPeriod: 687, color: '#e07040', size: 8, orbitRadius: 145,
    description: 'Il pianeta rosso, con il vulcano più alto del sistema solare.'
  },
  {
    name: 'Jupiter', nameIt: 'Giove', diameter: 142984, distanceFromSun: 778.6,
    orbitalPeriod: 4333, color: '#d4a574', size: 22, orbitRadius: 200,
    description: 'Il pianeta più grande, una gigante gassosa con la Grande Macchia Rossa.'
  },
  {
    name: 'Saturn', nameIt: 'Saturno', diameter: 120536, distanceFromSun: 1433.5,
    orbitalPeriod: 10759, color: '#f4d9a0', size: 19, orbitRadius: 260,
    description: 'Famoso per i suoi spettacolari anelli di ghiaccio e roccia.'
  },
  {
    name: 'Uranus', nameIt: 'Urano', diameter: 51118, distanceFromSun: 2872.5,
    orbitalPeriod: 30687, color: '#7de8e8', size: 15, orbitRadius: 310,
    description: 'Un gigante di ghiaccio che ruota su un fianco con inclinazione di 98°.'
  },
  {
    name: 'Neptune', nameIt: 'Nettuno', diameter: 49528, distanceFromSun: 4495.1,
    orbitalPeriod: 60190, color: '#4466ff', size: 14, orbitRadius: 355,
    description: 'Il pianeta più lontano, con i venti più veloci (2100 km/h).'
  }
];

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(() =>
    planetsData.map(() => Math.random() * 360)
  );

  const isPlayingRef = useRef(true);
  const speedRef = useRef(1);
  const anglesRef = useRef<number[]>([...angles]);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    function tick(now: number) {
      const delta = Math.min(now - lastTime, 100);
      lastTime = now;

      if (isPlayingRef.current) {
        const sp = speedRef.current;
        const newAngles = anglesRef.current.map((angle, i) => {
          const baseSpeed = 360 / (planetsData[i].orbitalPeriod * 2);
          return (angle + baseSpeed * sp * (delta / 16)) % 360;
        });
        anglesRef.current = newAngles;
        setAngles(newAngles);
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(prev => prev?.name === planet.name ? null : planet);
  };

  const speedOptions = [0.5, 1, 2, 5, 10];
  const viewSize = 800;
  const center = viewSize / 2;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#030712',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '12px 16px 4px', zIndex: 10 }}>
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          ☀️ Sistema Solare Interattivo
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0' }}>
          Clicca su un pianeta per scoprire le sue caratteristiche
        </p>
      </div>

      {/* Solar System SVG */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          style={{ width: '100%', height: '100%', maxWidth: '750px', maxHeight: '750px' }}
        >
          {/* Sun glow */}
          <circle cx={center} cy={center} r="45" fill="none" stroke="rgba(255,165,0,0.2)" strokeWidth="20" />
          <circle cx={center} cy={center} r="28" fill="#ff8c00" />
          <circle cx={center} cy={center} r="22" fill="#ffcc00" />
          <circle cx={center} cy={center} r="14" fill="#fff700" />

          {/* Orbits */}
          {planetsData.map(planet => (
            <circle
              key={`orbit-${planet.name}`}
              cx={center}
              cy={center}
              r={planet.orbitRadius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
          ))}

          {/* Planets */}
          {planetsData.map((planet, i) => {
            const angleRad = (angles[i] * Math.PI) / 180;
            const px = center + Math.cos(angleRad) * planet.orbitRadius;
            const py = center + Math.sin(angleRad) * planet.orbitRadius;
            const isSelected = selectedPlanet?.name === planet.name;

            return (
              <g
                key={planet.name}
                onClick={() => handlePlanetClick(planet)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle cx={px} cy={py} r={planet.size + 6} fill="none" stroke={planet.color} strokeWidth="2" opacity="0.7" />
                )}
                {/* Glow */}
                <circle cx={px} cy={py} r={planet.size + 3} fill={planet.color} opacity="0.2" />
                {/* Planet */}
                <circle cx={px} cy={py} r={planet.size} fill={planet.color} />
                {/* Highlight */}
                <circle cx={px - planet.size * 0.3} cy={py - planet.size * 0.3} r={planet.size * 0.35} fill="white" opacity="0.25" />
                {/* Saturn rings */}
                {planet.name === 'Saturn' && (
                  <ellipse cx={px} cy={py} rx={planet.size * 1.6} ry={planet.size * 0.35} fill="none" stroke={planet.color} strokeWidth="2.5" opacity="0.6" />
                )}
                {/* Label */}
                <text x={px} y={py - planet.size - 8} textAnchor="middle" fill="white" fontSize="10" fontWeight="500" style={{ pointerEvents: 'none' }}>
                  {planet.nameIt}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div style={{
          position: 'absolute',
          top: '70px',
          right: '12px',
          zIndex: 30,
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(107, 114, 128, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          width: '260px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}>
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              position: 'absolute', top: '8px', right: '12px',
              background: 'none', border: 'none', color: '#9ca3af',
              fontSize: '18px', cursor: 'pointer'
            }}
          >✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: selectedPlanet.color,
              boxShadow: `0 0 10px 3px ${selectedPlanet.color}60`,
              flexShrink: 0,
            }} />
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{selectedPlanet.nameIt}</h2>
              <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>{selectedPlanet.name}</p>
            </div>
          </div>
          <p style={{ color: '#d1d5db', fontSize: '12px', lineHeight: '1.5', marginBottom: '12px' }}>
            {selectedPlanet.description}
          </p>
          <div style={{ borderTop: '1px solid rgba(75,85,99,0.5)', paddingTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(75,85,99,0.3)' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>📏 Diametro</span>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>{selectedPlanet.diameter.toLocaleString('it-IT')} km</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(75,85,99,0.3)' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>🌞 Distanza dal Sole</span>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>{selectedPlanet.distanceFromSun.toLocaleString('it-IT')} M km</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>🔄 Periodo orbitale</span>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>{selectedPlanet.orbitalPeriod.toLocaleString('it-IT')} giorni</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.9)',
        borderTop: '1px solid rgba(75,85,99,0.5)',
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        zIndex: 10,
      }}>
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: isPlaying ? '#4f46e5' : '#059669',
            color: 'white', fontWeight: '600', fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? '⏸ Pausa' : '▶ Riproduci'}
        </button>

        {/* Speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#d1d5db', fontSize: '12px', fontWeight: '500' }}>⚡ Velocità:</span>
          {speedOptions.map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: 'none',
                background: speed === s ? '#f59e0b' : '#374151',
                color: speed === s ? 'white' : '#d1d5db',
                fontWeight: '700', fontSize: '12px', cursor: 'pointer',
                transform: speed === s ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Status */}
        <div style={{ color: '#9ca3af', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: isPlaying ? '#4ade80' : '#f87171',
            display: 'inline-block',
          }} />
          {isPlaying ? `In movimento (${speed}x)` : 'In pausa'}
        </div>
      </div>
    </div>
  );
}
