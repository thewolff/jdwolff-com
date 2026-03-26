const FONT = '"JetBrains Mono",monospace';

function isDarkMode(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return true;
  }
}

export const THEMES: Record<string, Record<string, string>> = {
  default: {
    h: `color:#9b7fc4;font-weight:bold;font-size:14px;font-family:${FONT}`,
    p: `color:#c8c2b8;font-size:12px;font-family:${FONT};line-height:1.8`,
    item: `color:#f0c674;font-size:12px;font-family:${FONT}`,
    ok: `color:#b5bd68;font-size:12px;font-family:${FONT}`,
    err: `color:#cc6666;font-size:12px;font-family:${FONT}`,
    hint: `color:#555;font-size:11px;font-family:${FONT}`,
    warn: `color:#de935f;font-size:12px;font-family:${FONT}`,
    win: `color:#9b7fc4;font-weight:bold;font-size:15px;font-family:${FONT}`,
    div: `color:#333;font-size:12px;font-family:${FONT}`,
  },
  matrix: {
    h: `color:#00ff41;font-weight:bold;font-size:14px;font-family:${FONT}`,
    p: `color:#00cc33;font-size:12px;font-family:${FONT};line-height:1.8`,
    item: `color:#39ff14;font-size:12px;font-family:${FONT}`,
    ok: `color:#00ff41;font-size:12px;font-family:${FONT}`,
    err: `color:#ff0040;font-size:12px;font-family:${FONT}`,
    hint: `color:#006622;font-size:11px;font-family:${FONT}`,
    warn: `color:#33ff77;font-size:12px;font-family:${FONT}`,
    win: `color:#00ff41;font-weight:bold;font-size:15px;font-family:${FONT}`,
    div: `color:#003311;font-size:12px;font-family:${FONT}`,
  },
  retro: {
    h: `color:#ffb000;font-weight:bold;font-size:14px;font-family:${FONT}`,
    p: `color:#cc8800;font-size:12px;font-family:${FONT};line-height:1.8`,
    item: `color:#ffdd44;font-size:12px;font-family:${FONT}`,
    ok: `color:#ffcc00;font-size:12px;font-family:${FONT}`,
    err: `color:#ff6600;font-size:12px;font-family:${FONT}`,
    hint: `color:#665500;font-size:11px;font-family:${FONT}`,
    warn: `color:#ffaa00;font-size:12px;font-family:${FONT}`,
    win: `color:#ffb000;font-weight:bold;font-size:15px;font-family:${FONT}`,
    div: `color:#443300;font-size:12px;font-family:${FONT}`,
  },
  midnight: {
    h: `color:#5edfff;font-weight:bold;font-size:14px;font-family:${FONT}`,
    p: `color:#3ea8c8;font-size:12px;font-family:${FONT};line-height:1.8`,
    item: `color:#7fecff;font-size:12px;font-family:${FONT}`,
    ok: `color:#45ffca;font-size:12px;font-family:${FONT}`,
    err: `color:#ff5577;font-size:12px;font-family:${FONT}`,
    hint: `color:#2a6a7a;font-size:11px;font-family:${FONT}`,
    warn: `color:#ffaa55;font-size:12px;font-family:${FONT}`,
    win: `color:#5edfff;font-weight:bold;font-size:15px;font-family:${FONT}`,
    div: `color:#1a3a4a;font-size:12px;font-family:${FONT}`,
  },
};

const DARK_OVERRIDES: Record<string, Record<string, string>> = {
  default: {
    hint: `color:#8e8e8e;font-size:11px;font-family:${FONT}`,
    div: `color:#555;font-size:12px;font-family:${FONT}`,
  },
  matrix: {
    hint: `color:#33aa55;font-size:11px;font-family:${FONT}`,
    div: `color:#1a5530;font-size:12px;font-family:${FONT}`,
  },
  retro: {
    hint: `color:#aa8833;font-size:11px;font-family:${FONT}`,
    div: `color:#665522;font-size:12px;font-family:${FONT}`,
  },
  midnight: {
    hint: `color:#4a9aaa;font-size:11px;font-family:${FONT}`,
    div: `color:#2a5a6a;font-size:12px;font-family:${FONT}`,
  },
};

function resolveTheme(name: string): Record<string, string> {
  const base = THEMES[name] ?? THEMES.default;
  if (isDarkMode() && DARK_OVERRIDES[name]) {
    return { ...base, ...DARK_OVERRIDES[name] };
  }
  return { ...base };
}

export function createOutput() {
  const T: Record<string, string> = resolveTheme("default");

  const say = (msg: string, style = T.p) => console.log(`%c${msg}`, style);
  const br = () =>
    console.log("%c────────────────────────────────────────", T.div);

  const setTheme = (name: string) => {
    const theme = resolveTheme(name);
    Object.assign(T, theme);
  };

  return { T, say, br, setTheme };
}
