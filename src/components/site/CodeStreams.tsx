const SNIPPETS = [
  "const world = await build({ better: true });",
  "0x4F2A 1010 1101 0011  if (impact > 0) ship();",
  "function transform(data) { return data.map(better); }",
  "// 01101101 01110111 ~ much.better.world",
  "SELECT solutions FROM strategy WHERE outcome = 'measurable';",
  "await analyze(input).then(insight => act(insight));",
];

const PATHS = [
  { d: "M -50 90 C 150 30, 300 160, 520 80 S 900 40, 1100 120", dur: 28, delay: 0, snippet: 0 },
  { d: "M -50 260 C 200 200, 380 340, 600 250 S 950 200, 1100 290", dur: 36, delay: -8, snippet: 1 },
  { d: "M -50 460 C 180 400, 360 540, 580 470 S 920 430, 1100 500", dur: 32, delay: -14, snippet: 2 },
  { d: "M -50 640 C 220 590, 400 720, 620 650 S 940 610, 1100 680", dur: 40, delay: -4, snippet: 3 },
  { d: "M -50 180 C 250 140, 420 260, 660 200 S 980 160, 1100 220", dur: 44, delay: -20, snippet: 4 },
  { d: "M -50 560 C 200 510, 380 620, 620 560 S 950 530, 1100 600", dur: 30, delay: -11, snippet: 5 },
];

export function CodeStreams() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.28]"
        viewBox="0 0 1100 760"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {PATHS.map((p, i) => (
            <path key={i} id={`stream-path-${i}`} d={p.d} />
          ))}
        </defs>
        {PATHS.map((p, i) => (
          <g key={i}>
            <use
              href={`#stream-path-${i}`}
              stroke="var(--color-accent)"
              strokeWidth="0.6"
              strokeDasharray="2 6"
              opacity="0.35"
            />
            <text
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="11"
              fill="var(--color-primary)"
              letterSpacing="0.5"
            >
              <textPath href={`#stream-path-${i}`} startOffset="0%">
                {SNIPPETS[p.snippet]}
                <animate
                  attributeName="startOffset"
                  from="-40%"
                  to="110%"
                  dur={`${p.dur}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
              </textPath>
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
