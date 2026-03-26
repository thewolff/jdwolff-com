const FONT = '"JetBrains Mono",monospace';

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

export function createOutput() {
  const T: Record<string, string> = { ...THEMES.default };

  const say = (msg: string, style = T.p) => console.log(`%c${msg}`, style);
  const br = () =>
    console.log("%c────────────────────────────────────────", T.div);

  const setTheme = (name: string) => {
    const theme = THEMES[name];
    if (theme) Object.assign(T, theme);
  };

  return { T, say, br, setTheme };
}
