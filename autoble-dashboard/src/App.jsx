import { useState, useEffect, useRef } from "react";

// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, width: w };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const INVENTORY_ITEMS = [
  { id: "BLE-001", name: "Server Rack A",      location: "Zone 1", category: "Hardware",  icon: "🖥️" },
  { id: "BLE-002", name: "Chemical Cabinet B", location: "Zone 2", category: "Lab",       icon: "🧪" },
  { id: "BLE-003", name: "Tool Kit C",         location: "Zone 3", category: "Equipment", icon: "🔧" },
  { id: "BLE-004", name: "Battery Pack D",     location: "Zone 1", category: "Power",     icon: "🔋" },
  { id: "BLE-005", name: "Network Switch E",   location: "Zone 4", category: "Hardware",  icon: "📡" },
  { id: "BLE-006", name: "Sample Tray F",      location: "Zone 2", category: "Lab",       icon: "🧫" },
  { id: "BLE-007", name: "Sensor Module G",    location: "Zone 3", category: "Equipment", icon: "📦" },
  { id: "BLE-008", name: "Power Supply H",     location: "Zone 4", category: "Power",     icon: "⚡" },
];

function genRSSI() { return Math.floor(Math.random() * 60) - 95; }
function rssiLevel(rssi) {
  if (rssi >= -60) return { label: "IMMEDIATE", color: "#22c55e", hex: 0 };
  if (rssi >= -70) return { label: "NEAR",      color: "#84cc16", hex: 1 };
  if (rssi >= -80) return { label: "MEDIUM",    color: "#f59e0b", hex: 2 };
  return             { label: "FAR",       color: "#ef4444", hex: 3 };
}
function vibrate(p) { if ("vibrate" in navigator) navigator.vibrate(p); }

// ─── Signal Bars ──────────────────────────────────────────────────────────────
function SignalBars({ rssi, size = 1 }) {
  const { color, hex } = rssiLevel(rssi);
  const w = 5 * size, gap = 2 * size, h = 18 * size;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap, height: h, flexShrink: 0 }}>
      {[1,2,3,4].map(b => (
        <div key={b} style={{
          width: w, height: `${(b / 4) * h}px`,
          background: b <= (4 - hex) ? color : "rgba(255,255,255,0.07)",
          borderRadius: 2, transition: "background 0.4s",
        }} />
      ))}
    </div>
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ found, total, size = 180 }) {
  const pct = total === 0 ? 0 : found / total;
  const r = size * 0.39, circ = 2 * Math.PI * r;
  const isComplete = found === total;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={isComplete ? "#22c55e" : "url(#ringGrad)"}
          strokeWidth={10}
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: size * 0.27, fontWeight: 900, color: isComplete ? "#22c55e" : "#f8fafc", lineHeight: 1, fontFamily: "monospace" }}>{found}</div>
        <div style={{ fontSize: size * 0.065, color: "#64748b", letterSpacing: 2, fontWeight: 700 }}>OF {total}</div>
        <div style={{ fontSize: size * 0.058, color: isComplete ? "#22c55e" : "#3b82f6", marginTop: 3, fontWeight: 700 }}>
          {Math.round(pct * 100)}%
        </div>
      </div>
    </div>
  );
}

// ─── Radar ────────────────────────────────────────────────────────────────────
function Radar({ items }) {
  const cx = 200, cy = 200, maxR = 170;
  const [sweep, setSweep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSweep(a => (a + 2) % 360), 30);
    return () => clearInterval(id);
  }, []);
  const dots = items.map((item, i) => {
    const norm = Math.min(1, Math.max(0, (item.rssi + 95) / 60));
    const r = maxR * (1 - norm * 0.82);
    const angle = (i * 137.5) * Math.PI / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), ...item };
  });
  const sweepRad = (sweep * Math.PI) / 180;
  const sx = cx + maxR * Math.cos(sweepRad);
  const sy = cy + maxR * Math.sin(sweepRad);
  return (
    <svg width="100%" viewBox="0 0 400 400" style={{ display: "block" }}>
      <defs>
        <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.06)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0.01)" />
        </radialGradient>
        <radialGradient id="sweepGrad" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={maxR} fill="url(#radarBg)" />
      {[0.25,0.5,0.75,1].map((f,i) => (
        <circle key={i} cx={cx} cy={cy} r={maxR*f} fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth={1} strokeDasharray={i<3?"4 6":"none"} />
      ))}
      <line x1={cx-maxR} y1={cy} x2={cx+maxR} y2={cy} stroke="rgba(59,130,246,0.1)" strokeWidth={1} />
      <line x1={cx} y1={cy-maxR} x2={cx} y2={cy+maxR} stroke="rgba(59,130,246,0.1)" strokeWidth={1} />
      <path d={`M${cx},${cy} L${cx+maxR*Math.cos(sweepRad-0.4)},${cy+maxR*Math.sin(sweepRad-0.4)} A${maxR},${maxR} 0 0,1 ${sx},${sy} Z`} fill="url(#sweepGrad)" opacity={0.6} />
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke="#3b82f6" strokeWidth={1.5} opacity={0.8} />
      {dots.map(d => {
        const { color } = rssiLevel(d.rssi);
        return (
          <g key={d.id}>
            <circle cx={d.x} cy={d.y} r={5} fill={color} opacity={0.95} />
            <circle cx={d.x} cy={d.y} r={5} fill="none" stroke={color} strokeWidth={1}>
              <animate attributeName="r" values="5;16;5" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <text x={d.x+8} y={d.y+4} fill="rgba(148,163,184,0.9)" fontSize={9} fontFamily="monospace">{d.id}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={7} fill="#3b82f6" />
      <circle cx={cx} cy={cy} r={7} fill="none" stroke="#3b82f6" strokeWidth={2}>
        <animate attributeName="r" values="7;18;7" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x={cx+4} y={cy-maxR*0.25+4} fill="rgba(71,85,105,0.8)" fontSize={8} fontFamily="monospace">IMM</text>
      <text x={cx+4} y={cy-maxR*0.5+4}  fill="rgba(71,85,105,0.8)" fontSize={8} fontFamily="monospace">NEAR</text>
      <text x={cx+4} y={cy-maxR*0.75+4} fill="rgba(71,85,105,0.8)" fontSize={8} fontFamily="monospace">MED</text>
      <text x={cx+4} y={cy-maxR+12}      fill="rgba(71,85,105,0.8)" fontSize={8} fontFamily="monospace">FAR</text>
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, sub, icon }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: `1px solid ${color}22`,
      borderRadius: 16, padding: "16px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />
      <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#475569", marginTop: 5 }}>{sub}</div>}
      <div style={{ position: "absolute", bottom: 10, right: 14, fontSize: 24, opacity: 0.12 }}>{icon}</div>
    </div>
  );
}

// ─── Checklist Row ────────────────────────────────────────────────────────────
function CheckRow({ item, detected, rssiData, isMobile }) {
  const isDetected = detected.has(item.id);
  const rssi = rssiData[item.id];
  const level = rssi ? rssiLevel(rssi) : null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: isMobile ? 10 : 14,
      padding: isMobile ? "12px 14px" : "14px 18px",
      borderRadius: 12,
      background: isDetected ? `linear-gradient(90deg,${level?.color}10,transparent)` : "rgba(255,255,255,0.015)",
      border: `1px solid ${isDetected ? level?.color+"30" : "rgba(255,255,255,0.06)"}`,
      marginBottom: 8,
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
      boxShadow: isDetected ? `0 0 20px ${level?.color}15` : "none",
    }}>
      <span style={{ fontSize: isMobile ? 18 : 22, flexShrink: 0 }}>{item.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: isDetected ? "#f1f5f9" : "#64748b", transition: "color 0.4s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
        <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", letterSpacing: 1, marginTop: 2 }}>
          {item.id} · {item.location}{!isMobile && ` · ${item.category}`}
        </div>
      </div>
      {isDetected && rssi ? (
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, flexShrink: 0 }}>
          {!isMobile && <SignalBars rssi={rssi} />}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: isMobile ? 11 : 12, color: level.color, fontFamily: "monospace", fontWeight: 700 }}>{rssi} dBm</div>
            <div style={{ fontSize: 9, color: level.color, letterSpacing: 1, fontWeight: 700, background: level.color+"18", padding: "1px 5px", borderRadius: 4 }}>{level.label}</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", flexShrink: 0 }}>NOT FOUND</div>
      )}
      <div style={{
        width: isMobile ? 22 : 26, height: isMobile ? 22 : 26, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isDetected ? level?.color : "rgba(255,255,255,0.04)",
        border: `2px solid ${isDetected ? level?.color : "rgba(255,255,255,0.1)"}`,
        boxShadow: isDetected ? `0 0 12px ${level?.color}80` : "none",
        transition: "all 0.5s",
      }}>
        {isDetected && <span style={{ fontSize: 11, color: "#000", fontWeight: 900 }}>✓</span>}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [tab, setTab] = useState("dashboard");
  const [rssiData, setRssiData] = useState({});
  const [detected, setDetected] = useState(new Set());
  const [scanning, setScanning] = useState(true);
  const [toast, setToast] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [history, setHistory] = useState([]);
  const prevDetected = useRef(new Set());
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => {
      setScanCount(c => c + 1);
      setRssiData(prev => {
        const next = { ...prev };
        INVENTORY_ITEMS.forEach(item => {
          const was = !!next[item.id];
          const roll = Math.random();
          if (was) { if (roll < 0.85) next[item.id] = genRSSI(); else delete next[item.id]; }
          else      { if (roll < 0.35) next[item.id] = genRSSI(); }
        });
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [scanning]);

  useEffect(() => {
    const newSet = new Set(Object.keys(rssiData));
    newSet.forEach(id => {
      if (!prevDetected.current.has(id)) {
        const item = INVENTORY_ITEMS.find(i => i.id === id);
        if (item) {
          setToast(item.name);
          vibrate([40, 20, 80]);
          setTimeout(() => setToast(null), 2800);
        }
      }
    });
    prevDetected.current = newSet;
    setDetected(newSet);
    setHistory(h => [...h.slice(-19), { count: newSet.size }]);
  }, [rssiData]);

  const found = detected.size;
  const total = INVENTORY_ITEMS.length;
  const detectedItems = INVENTORY_ITEMS.filter(i => detected.has(i.id)).map(i => ({ ...i, rssi: rssiData[i.id] }));
  const missingItems  = INVENTORY_ITEMS.filter(i => !detected.has(i.id));
  const uptimeSec = Math.floor((Date.now() - startTime.current) / 1000);
  const avgRSSI = detectedItems.length ? Math.round(detectedItems.reduce((a,b) => a + b.rssi, 0) / detectedItems.length) : "--";

  const TABS = [
    { id: "dashboard", label: isMobile ? "DASH" : "DASHBOARD", icon: "▣" },
    { id: "checklist", label: isMobile ? "LIST" : "CHECKLIST", icon: "☑" },
    { id: "radar",     label: "RADAR",                          icon: "◎" },
  ];

  const px = isMobile ? 14 : isTablet ? 20 : 32;

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#080f1a",
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      color: "#f8fafc",
      display: "flex", flexDirection: "column",
      overflow: "auto",
    }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",
        backgroundSize: "48px 48px" }} />
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: isMobile ? 8 : 0,
        padding: isMobile ? "10px 14px" : `0 ${px}px`,
        minHeight: isMobile ? "auto" : 64,
        background: "rgba(8,15,26,0.97)",
        borderBottom: "1px solid rgba(59,130,246,0.15)",
        backdropFilter: "blur(12px)",
      }}>
        {/* Logo + status */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 20, flexWrap: "wrap" }}>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, letterSpacing: -1 }}>
            Auto<span style={{ color: "#3b82f6" }}>BLE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "blink 2s infinite" }} />
            <span style={{ fontSize: isMobile ? 9 : 11, color: "#22c55e", letterSpacing: 2, fontWeight: 700 }}>
              {isMobile ? "LOCAL ACTIVE" : "LOCAL NETWORK ACTIVE"}
            </span>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }} />
              <span style={{ fontSize: 11, color: "#3b82f6", letterSpacing: 1 }}>ESP32 · 192.168.4.1</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4,
          background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4,
          order: isMobile ? 3 : 0,
          width: isMobile ? "100%" : "auto",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: isMobile ? 1 : "none",
              border: "none", cursor: "pointer", padding: isMobile ? "8px 0" : "8px 18px", borderRadius: 8,
              background: tab === t.id ? "#3b82f6" : "transparent",
              color: tab === t.id ? "#fff" : "#475569",
              fontSize: isMobile ? 10 : 11, fontWeight: 700, letterSpacing: 1,
              transition: "all 0.2s", fontFamily: "inherit",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isMobile && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#334155" }}>SCAN #{scanCount}</div>
              <div style={{ fontSize: 10, color: "#334155" }}>UPTIME {uptimeSec}s</div>
            </div>
          )}
          <button onClick={() => setScanning(s => !s)} style={{
            border: `1px solid ${scanning ? "#22c55e44" : "#ef444444"}`,
            background: scanning ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: scanning ? "#22c55e" : "#ef4444",
            padding: isMobile ? "6px 10px" : "7px 16px",
            borderRadius: 8, cursor: "pointer",
            fontSize: isMobile ? 10 : 11, fontWeight: 700, letterSpacing: 1, fontFamily: "inherit",
          }}>{scanning ? "● SCAN" : "○ OFF"}</button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: isMobile ? 70 : 80, left: "50%", transform: "translateX(-50%)",
          background: "rgba(34,197,94,0.15)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,197,94,0.35)", borderRadius: 12,
          padding: "10px 20px", zIndex: 200, whiteSpace: "nowrap",
          boxShadow: "0 0 30px rgba(34,197,94,0.2)", animation: "toastIn 0.3s ease",
        }}>
          <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: "#22c55e" }}>✓ DETECTED · {toast}</span>
        </div>
      )}

      {/* ── CONTENT ── */}
      <main style={{ flex: 1, position: "relative", zIndex: 1, padding: `20px ${px}px 32px` }}>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
              <StatCard label="ITEMS FOUND"   value={found}         color="#22c55e" sub={`${Math.round(found/total*100)}% verified`} icon="✓" />
              <StatCard label="ITEMS MISSING" value={total - found} color="#ef4444" sub="Undetected"                                 icon="✗" />
              <StatCard label="AVG RSSI"      value={avgRSSI}       color="#3b82f6" sub="dBm signal"                                 icon="📶" />
              <StatCard label="SCAN CYCLES"   value={scanCount}     color="#f59e0b" sub={`${uptimeSec}s uptime`}                     icon="🔄" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "280px 1fr 220px", gap: 16 }}>
              {/* Progress ring */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, alignSelf: "flex-start" }}>VERIFICATION STATUS</div>
                <CircularProgress found={found} total={total} size={isMobile ? 140 : 160} />
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: found===total?"#22c55e":"#64748b", textAlign: "center", padding: "7px 14px", borderRadius: 8, background: found===total?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.03)", border: `1px solid ${found===total?"rgba(34,197,94,0.25)":"rgba(255,255,255,0.06)"}`, width: "100%" }}>
                  {found===total ? "✓ ALL VERIFIED" : `${total-found} UNDETECTED`}
                </div>
                <div style={{ width: "100%" }}>
                  <div style={{ fontSize: 9, color: "#334155", letterSpacing: 2, marginBottom: 6 }}>DETECTION HISTORY</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
                    {history.slice(-20).map((h, i) => (
                      <div key={i} style={{ flex: 1, borderRadius: 2, background: `rgba(59,130,246,${0.2+(h.count/total)*0.8})`, height: `${(h.count/total)*100}%`, minHeight: 3, transition: "height 0.3s" }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Live BLE Feed */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700 }}>LIVE BLE FEED</div>
                  <div style={{ fontSize: 10, color: "#334155" }}>{new Date().toLocaleTimeString()}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                  {detectedItems.slice(0, isMobile ? 4 : 6).map(item => {
                    const lv = rssiLevel(item.rssi);
                    return (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: `1px solid ${lv.color}22` }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{item.id}</div>
                          <div style={{ fontSize: 9, color: "#475569" }}>{item.name.split(" ").slice(0,2).join(" ")}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <SignalBars rssi={item.rssi} />
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: lv.color, fontWeight: 700 }}>{item.rssi} dBm</div>
                            <div style={{ fontSize: 9, color: lv.color }}>{lv.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {detectedItems.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#334155", padding: "24px 0", fontSize: 13 }}>Scanning for beacons...</div>}
                </div>
              </div>

              {/* Zone summary desktop */}
              {!isMobile && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 20 }}>
                  <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, marginBottom: 16 }}>ZONE STATUS</div>
                  {["Zone 1","Zone 2","Zone 3","Zone 4"].map(zone => {
                    const zi = INVENTORY_ITEMS.filter(i => i.location===zone);
                    const zd = zi.filter(i => detected.has(i.id)).length;
                    const pct = zd/zi.length;
                    return (
                      <div key={zone} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>{zone}</span>
                          <span style={{ fontSize: 11, color: pct===1?"#22c55e":"#64748b", fontFamily: "monospace" }}>{zd}/{zi.length}</span>
                        </div>
                        <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                          <div style={{ height: "100%", borderRadius: 3, width: `${pct*100}%`, background: pct===1?"#22c55e":pct>0.5?"#3b82f6":"#f59e0b", transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Zone summary mobile */}
            {isMobile && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>ZONE STATUS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Zone 1","Zone 2","Zone 3","Zone 4"].map(zone => {
                    const zi = INVENTORY_ITEMS.filter(i => i.location===zone);
                    const zd = zi.filter(i => detected.has(i.id)).length;
                    const pct = zd/zi.length;
                    return (
                      <div key={zone} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>{zone}</span>
                          <span style={{ fontSize: 10, color: pct===1?"#22c55e":"#64748b", fontFamily: "monospace" }}>{zd}/{zi.length}</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                          <div style={{ height: "100%", borderRadius: 2, width: `${pct*100}%`, background: pct===1?"#22c55e":pct>0.5?"#3b82f6":"#f59e0b", transition: "width 0.6s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Missing */}
            <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>⚠ MISSING ITEMS</div>
              {missingItems.length === 0 ? (
                <div style={{ textAlign: "center", color: "#22c55e", fontSize: 14, fontWeight: 700, padding: "10px 0" }}>✓ All items accounted for</div>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {missingItems.map(item => (
                    <div key={item.id} style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: isMobile?11:12, fontWeight: 700, color: "#fca5a5" }}>{item.name}</div>
                        <div style={{ fontSize: 9, color: "#7f1d1d" }}>{item.id} · {item.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ CHECKLIST ══ */}
        {tab === "checklist" && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "VERIFIED",  val: found,         color: "#22c55e" },
                { label: "MISSING",   val: total-found,   color: "#ef4444" },
                { label: "IMMEDIATE", val: detectedItems.filter(i=>rssiLevel(i.rssi).hex===0).length, color: "#22c55e" },
                { label: "FAR RANGE", val: detectedItems.filter(i=>rssiLevel(i.rssi).hex===3).length, color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${s.color}22`, borderRadius: 14, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: isMobile?28:32, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>ALL INVENTORY ITEMS</div>
            {INVENTORY_ITEMS.map(item => (
              <CheckRow key={item.id} item={item} detected={detected} rssiData={rssiData} isMobile={isMobile} />
            ))}
          </div>
        )}

        {/* ══ RADAR ══ */}
        {tab === "radar" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 360px", gap: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, marginBottom: 14 }}>
                PROXIMITY RADAR · {detectedItems.length} BEACONS ACTIVE
              </div>
              <Radar items={detectedItems} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginTop: 14 }}>
                {[
                  { label: "Immediate", range: "≥ -60", color: "#22c55e" },
                  { label: "Near",      range: "-60→-70", color: "#84cc16" },
                  { label: "Medium",    range: "-70→-80", color: "#f59e0b" },
                  { label: "Far",       range: "< -80",   color: "#ef4444" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0, boxShadow: `0 0 5px ${l.color}` }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: l.color }}>{l.label}</div>
                      <div style={{ fontSize: 8, color: "#475569" }}>{l.range}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 18 }}>
                <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>BEACON DETAILS</div>
                {detectedItems.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#334155", padding: "30px 0", fontSize: 13 }}>No beacons in range</div>
                ) : (
                  detectedItems.map(item => {
                    const lv = rssiLevel(item.rssi);
                    return (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{item.name}</div>
                            <div style={{ fontSize: 9, color: "#475569" }}>{item.id} · {item.location}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <SignalBars rssi={item.rssi} />
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: lv.color, fontWeight: 700 }}>{item.rssi} dBm</div>
                            <div style={{ fontSize: 9, color: lv.color, background: lv.color+"18", padding: "1px 5px", borderRadius: 3 }}>{lv.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 20, padding: 18 }}>
                <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 3, fontWeight: 700, marginBottom: 10 }}>OUT OF RANGE</div>
                {missingItems.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>✓ All beacons visible</div>
                ) : (
                  missingItems.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#fca5a5" }}>{item.name}</div>
                        <div style={{ fontSize: 9, color: "#7f1d1d" }}>{item.id}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(-12px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: auto; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}