interface FloatingHeartsProps {
  color?: string;
  n?: number;
}

const SEED = [
  [8, 82, 18, 0.22, 0], [22, 40, 12, 0.18, 1.6], [40, 88, 22, 0.28, 0.4],
  [58, 30, 14, 0.20, 2.2], [74, 70, 20, 0.24, 1.1], [88, 46, 12, 0.16, 0.7],
  [15, 16, 16, 0.22, 2.8], [48, 60, 11, 0.14, 1.4], [66, 12, 18, 0.20, 0.2],
  [82, 90, 15, 0.18, 2.5], [31, 72, 13, 0.16, 0.9], [92, 22, 14, 0.20, 1.8],
  [5, 54, 12, 0.14, 3.1], [55, 4, 16, 0.22, 0.6],
];

export default function FloatingHearts({ color = '#d4687a', n = 14 }: FloatingHeartsProps) {
  const hearts = SEED.slice(0, n);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h, i) => (
        <div
          key={i}
          className="animate-float"
          style={{
            position: 'absolute', left: `${h[0]}%`, top: `${h[1]}%`,
            fontSize: h[2], color, opacity: h[3],
            '--duration': `${7 + (h[2] as number) / 4}s`,
            '--delay': `${h[4]}s`,
          } as React.CSSProperties}
        >
          ♥
        </div>
      ))}
    </div>
  );
}
