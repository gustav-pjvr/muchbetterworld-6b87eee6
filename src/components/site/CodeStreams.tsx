const SNIPPETS = [
  "const world = await build({ better: true });",
  "0x4F2A 1010 1101 0011  if (impact > 0) ship();",
  "function transform(data) { return data.map(better); }",
  "// 01101101 01110111 ~ much.better.world",
  "SELECT solutions FROM strategy WHERE outcome = 'measurable';",
  "await analyze(input).then(insight => act(insight));",
  "<Strategy align='vision' execute='plan' measure='outcome' />",
  "const { insight, action } = decompose(problem);",
  "// TODO: make the world much better. priority: critical",
  "for (const client of clients) deliver(exceed(client.expectation));",
  "0x3E7A 0110 1001 1100  optimize(world).measure(impact);",
  "export default defineConfig({ world: 'better', scale: 'global' });",
];

const PATHS = [
  { d: "M -50 60 C 150 10, 300 140, 520 60 S 900 20, 1100 90", dur: 26, delay: -2, snippet: 0 },
  { d: "M -50 140 C 200 100, 400 220, 600 160 S 950 120, 1100 180", dur: 34, delay: -10, snippet: 1 },
  { d: "M -50 220 C 180 160, 360 300, 580 230 S 920 190, 1100 260", dur: 30, delay: -6, snippet: 2 },
  { d: "M -50 300 C 220 240, 420 380, 640 310 S 960 270, 1100 340", dur: 38, delay: -18, snippet: 3 },
  { d: "M -50 380 C 160 330, 340 450, 560 390 S 880 350, 1100 410", dur: 32, delay: -14, snippet: 4 },
  { d: "M -50 460 C 200 400, 380 540, 600 470 S 920 430, 1100 500", dur: 28, delay: -8, snippet: 5 },
  { d: "M -50 540 C 240 490, 400 620, 620 550 S 940 510, 1100 580", dur: 36, delay: -22, snippet: 6 },
  { d: "M -50 620 C 180 570, 360 690, 580 630 S 900 590, 1100 660", dur: 40, delay: -12, snippet: 7 },
  { d: "M -50 700 C 220 650, 400 770, 640 710 S 960 670, 1100 740", dur: 34, delay: -4, snippet: 8 },
  { d: "M -50 100 C 260 60, 440 180, 680 120 S 980 80, 1100 140", dur: 42, delay: -16, snippet: 9 },
  { d: "M -50 420 C 180 360, 360 500, 560 430 S 900 390, 1100 460", dur: 30, delay: -24, snippet: 10 },
  { d: "M -50 680 C 200 620, 380 740, 600 690 S 950 650, 1100 720", dur: 44, delay: -28, snippet: 11 },
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
