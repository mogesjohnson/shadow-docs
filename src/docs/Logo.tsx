/**
 * The Shadow Army logo, as the "Shadow Army Terminal UI" design canvas defines it
 * (board "Banner, prompt and status line"): the v1 banner art from
 * shadow-army src/ui/art.ts, one gradient token per art row (g0–g5), and the
 * ◆ brand mark in the accent colour. Drawn here as vector cells: █ is a filled
 * cell, the box-drawing shadow a thin line. Colours come from --sd-g0…5.
 */

const SHADOW_ART = [
  "███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██╗    ██╗",
  "██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██║    ██║",
  "███████╗███████║███████║██║  ██║██║   ██║██║ █╗ ██║",
  "╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██║███╗██║",
  "███████║██║  ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝",
  "╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝",
];

const ARMY_ART = [
  " █████╗ ██████╗ ███╗   ███╗██╗   ██╗",
  "██╔══██╗██╔══██╗████╗ ████║╚██╗ ██╔╝",
  "███████║██████╔╝██╔████╔██║ ╚████╔╝",
  "██╔══██║██╔══██╗██║╚██╔╝██║  ╚██╔╝",
  "██║  ██║██║  ██║██║ ╚═╝ ██║   ██║",
  "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝",
];

/** Terminal cells are about twice as tall as wide. */
const CH = 2;

const STROKES: Record<string, ("l" | "r" | "u" | "d")[]> = {
  "═": ["l", "r"],
  "║": ["u", "d"],
  "╔": ["r", "d"],
  "╗": ["l", "d"],
  "╚": ["r", "u"],
  "╝": ["l", "u"],
};

type Row = { fill: string; stroke: string };

function drawRows(lines: string[], left = 0): Row[] {
  return lines.map((line, row) => {
    const y = row * CH;
    const cells = Array.from(line);
    let fill = "";
    let stroke = "";
    for (let col = 0; col < cells.length; col++) {
      const ch = cells[col];
      const x = left + col;
      if (ch === "█") {
        // One rectangle per run of blocks, so no seams show between cells.
        let end = col;
        while (cells[end + 1] === "█") end++;
        fill += `M${x} ${y}h${end - col + 1}v${CH}h-${end - col + 1}z`;
        col = end;
        continue;
      }
      const cx = x + 0.5;
      const cy = y + CH / 2;
      for (const dir of STROKES[ch] ?? []) {
        if (dir === "l") stroke += `M${x} ${cy}H${cx}`;
        if (dir === "r") stroke += `M${cx} ${cy}H${x + 1}`;
        if (dir === "u") stroke += `M${cx} ${y}V${cy}`;
        if (dir === "d") stroke += `M${cx} ${cy}V${y + CH}`;
      }
    }
    return { fill, stroke };
  });
}

const widthOf = (lines: string[]) => Math.max(...lines.map((l) => Array.from(l).length));
const SHADOW_W = widthOf(SHADOW_ART);
const ARMY_W = widthOf(ARMY_ART);
const GAP = 2;
const HEIGHT = SHADOW_ART.length * CH;

const ART = {
  /** 92 columns and up: SHADOW and ARMY side by side. */
  wide: { w: SHADOW_W + GAP + ARMY_W, rows: [drawRows(SHADOW_ART), drawRows(ARMY_ART, SHADOW_W + GAP)] },
  /** SHADOW alone, for the medium form (ARMY is spelled out under it). */
  shadow: { w: SHADOW_W, rows: [drawRows(SHADOW_ART)] },
};

function BannerArt({ height, art }: { height: number; art: keyof typeof ART }) {
  const { w, rows } = ART[art];
  return (
    <svg
      className="sd-banner"
      viewBox={`0 0 ${w} ${HEIGHT}`}
      height={height}
      width={(height * w) / HEIGHT}
      aria-hidden="true"
    >
      {rows.flatMap((group, g) =>
        group.map((row, i) => (
          <g key={`${g}-${i}`} className={`sd-g${i}`}>
            {row.stroke && <path d={row.stroke} fill="none" strokeWidth={0.3} />}
            {row.fill && <path d={row.fill} stroke="none" />}
          </g>
        )),
      )}
    </svg>
  );
}

/** The ◆ brand mark. */
export function Diamond({ size = 12 }: { size?: number }) {
  return (
    <svg className="sd-diamond" width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <path d="M5 0 L10 5 L5 10 L0 5 Z" />
    </svg>
  );
}

/** Top-bar logo: the wide banner, or `◆ SHADOW ARMY` where the bar is narrow. */
export function LogoBar() {
  return (
    <span className="sd-logo">
      <span className="sd-logo-wide">
        <BannerArt art="wide" height={24} />
      </span>
      <span className="sd-logo-compact">
        <Diamond />
        <span>SHADOW ARMY</span>
      </span>
      <span className="sd-logo-docs">Docs</span>
    </span>
  );
}

/** Compact logo: `◆ SHADOW ARMY`. */
export function LogoCompact() {
  return (
    <span className="sd-logo">
      <span className="sd-logo-compact sd-logo-compact-always">
        <Diamond />
        <span>SHADOW ARMY</span>
      </span>
      <span className="sd-logo-docs">Docs</span>
    </span>
  );
}

/** Medium form: SHADOW in block letters, `◆  A R M Y` under its right edge. */
export function LogoStacked() {
  return (
    <span className="sd-logo-stacked">
      <BannerArt art="shadow" height={36} />
      <span className="sd-logo-army">
        <Diamond size={9} />
        <span>A R M Y</span>
      </span>
    </span>
  );
}
