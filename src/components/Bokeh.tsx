interface BokehProps {
  colors?: string[];
}

export default function Bokeh({ colors = ['#f0b0c0', '#e8a0d8', '#c0b0f0'] }: BokehProps) {
  const blobs = [
    { c: colors[0], x: '-12%', y: '6%',  s: 320, o: 0.35 },
    { c: colors[1], x: '64%',  y: '-4%', s: 260, o: 0.28 },
    { c: colors[2 % colors.length], x: '28%', y: '55%', s: 360, o: 0.25 },
    { c: colors[0], x: '72%',  y: '62%', s: 220, o: 0.22 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: b.x, top: b.y,
            width: b.s, height: b.s,
            borderRadius: '50%', background: b.c,
            opacity: b.o, filter: 'blur(80px)',
          }}
        />
      ))}
    </div>
  );
}
