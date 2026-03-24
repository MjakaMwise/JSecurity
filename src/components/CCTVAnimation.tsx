import { useEffect, useRef } from "react";

const CCTVAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef(0);
  const eventsRef = useRef(0);
  const threatsRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const intervals: number[] = [];
    const timeouts: number[] = [];

    // Timestamp + uptime
    const tsEl = container.querySelector<HTMLSpanElement>("#cctv-timestamp");
    const uptimeEl = container.querySelector<HTMLSpanElement>("#cctv-uptime");
    const eventsEl = container.querySelector<HTMLSpanElement>("#cctv-events");
    const threatsEl = container.querySelector<HTMLSpanElement>("#cctv-threats");
    const statusEl = container.querySelector<HTMLSpanElement>("#cctv-status");
    const motionEl = container.querySelector<HTMLSpanElement>("#cctv-motion");
    const alertOverlay = container.querySelector<HTMLDivElement>("#cctv-alert-overlay");
    const alertText = container.querySelector<HTMLDivElement>("#cctv-alert-text");

    intervals.push(window.setInterval(() => {
      secondsRef.current++;
      const m = String(Math.floor((secondsRef.current % 3600) / 60)).padStart(2, "0");
      const s = String(secondsRef.current % 60).padStart(2, "0");
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      if (tsEl) tsEl.textContent = ts;
      if (uptimeEl) uptimeEl.textContent = `${m}:${s}`;
    }, 1000));

    // Figure animation (CSS-based instead of anime.js)
    const figure = container.querySelector<SVGGElement>("#cctv-figure");
    if (figure) {
      let figX = 490;
      let walkDir = -1;
      const figY = 258;
      figure.style.transform = `translate(${figX}px, ${figY}px)`;

      const walkStep = () => {
        const destX = walkDir < 0 ? 30 : 490;
        const duration = Math.abs(destX - figX) * 22;
        figure.style.transition = `transform ${duration}ms linear`;
        figure.style.transform = `translate(${destX}px, ${figY}px)`;
        timeouts.push(window.setTimeout(() => {
          figX = destX;
          walkDir *= -1;
          walkStep();
        }, duration));
      };
      timeouts.push(window.setTimeout(walkStep, 1200));
    }

    // Threat trigger
    const triggerThreat = () => {
      threatsRef.current++;
      eventsRef.current++;
      if (threatsEl) threatsEl.textContent = String(threatsRef.current);
      if (eventsEl) eventsEl.textContent = String(eventsRef.current);
      if (statusEl) { statusEl.style.color = "#f87171"; statusEl.textContent = "ALERT"; }
      if (motionEl) { motionEl.style.color = "#f87171"; motionEl.textContent = "MOTION: DETECTED"; }
      if (alertOverlay) alertOverlay.style.display = "block";
      if (alertText) alertText.style.display = "block";

      timeouts.push(window.setTimeout(() => {
        if (alertOverlay) alertOverlay.style.display = "none";
        if (alertText) alertText.style.display = "none";
        if (motionEl) { motionEl.style.color = "#4ade80"; motionEl.textContent = "MOTION: CLEAR"; }
        if (statusEl) { statusEl.style.color = "#4ade80"; statusEl.textContent = "ARMED"; }
      }, 3000));

      timeouts.push(window.setTimeout(triggerThreat, Math.random() * 14000 + 10000));
    };
    timeouts.push(window.setTimeout(triggerThreat, 7000));

    // Random events
    const logEvent = () => {
      eventsRef.current++;
      if (eventsEl) eventsEl.textContent = String(eventsRef.current);
      timeouts.push(window.setTimeout(logEvent, Math.random() * 5000 + 4000));
    };
    timeouts.push(window.setTimeout(logEvent, 5000));

    return () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full max-w-[560px] mx-auto font-mono">
      <style>{`
        @keyframes cctvScanMove { 0% { transform: translateY(0); } 100% { transform: translateY(400px); } }
        @keyframes cctvCornerFlash { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes cctvBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes cctvSweep { 0% { transform: rotate(-60deg); } 30% { transform: rotate(-60deg); } 65% { transform: rotate(60deg); } 85% { transform: rotate(60deg); } 100% { transform: rotate(-60deg); } }
        @keyframes cctvIrBlink { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes cctvAlertFlash { 0%,100%{opacity:0} 10%,30%,50%{opacity:1} 20%,40%{opacity:0.3} }
        @keyframes cctvTextScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes cctvGlitch { 0%,95%,100% { clip-path: none; transform: none; } 96% { clip-path: inset(20% 0 60% 0); transform: translateX(-3px); } 97% { clip-path: inset(70% 0 10% 0); transform: translateX(3px); } 98% { clip-path: inset(40% 0 40% 0); transform: translateX(-2px); } }
      `}</style>

      {/* HUD bar */}
      <div className="w-full flex justify-between items-center text-[11px] tracking-wider px-1 pb-2" style={{ color: "#4ade80" }}>
        <span className="flex items-center gap-1.5" style={{ color: "#f87171" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#f87171", animation: "cctvBlink 1.2s ease-in-out infinite" }} />
          REC
        </span>
        <span id="cctv-timestamp">00:00:00</span>
        <span>CAM 01 · SECTOR 7G</span>
        <span className="hidden sm:inline">1080P · 30FPS</span>
      </div>

      {/* Camera viewport */}
      <div className="relative w-full" style={{ aspectRatio: "16/10", border: "1px solid #1e3a1e", overflow: "hidden", background: "#050f05" }}>
        {/* Scanlines */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)" }} />
        {/* Scan beam */}
        <div className="absolute left-0 right-0 z-[11] pointer-events-none" style={{ top: "-4px", height: "3px", background: "linear-gradient(180deg,transparent,rgba(74,222,128,0.4),transparent)", animation: "cctvScanMove 3s linear infinite" }} />
        {/* Vignette */}
        <div className="absolute inset-0 z-[9] pointer-events-none" style={{ background: "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.65))" }} />

        {/* Corner brackets */}
        {[
          { pos: "top-[10px] left-[10px]", border: "border-t-2 border-l-2", delay: "0s" },
          { pos: "top-[10px] right-[10px]", border: "border-t-2 border-r-2", delay: "0.75s" },
          { pos: "bottom-[10px] left-[10px]", border: "border-b-2 border-l-2", delay: "1.5s" },
          { pos: "bottom-[10px] right-[10px]", border: "border-b-2 border-r-2", delay: "2.25s" },
        ].map((c, i) => (
          <div key={i} className={`absolute ${c.pos} w-5 h-5 ${c.border} z-[12]`} style={{ borderColor: "#4ade80", animation: `cctvCornerFlash 3s ease-in-out infinite ${c.delay}` }} />
        ))}

        {/* Alert overlay */}
        <div id="cctv-alert-overlay" className="absolute inset-0 z-[13] pointer-events-none" style={{ display: "none", border: "3px solid #f87171", animation: "cctvAlertFlash 2.2s ease-in-out forwards" }} />
        <div id="cctv-alert-text" className="absolute z-[14] pointer-events-none text-lg tracking-widest" style={{ display: "none", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#f87171", animation: "cctvAlertFlash 2.2s ease-in-out forwards" }}>
          ⚠ THREAT DETECTED
        </div>

        {/* Scene SVG */}
        <svg width="100%" viewBox="0 0 560 350" className="absolute inset-0 z-[1]" style={{ animation: "cctvGlitch 12s ease-in-out infinite 7s" }}>
          <rect width="560" height="350" fill="#050f05"/>
          <g fill="#4ade80" opacity="0.5">
            <circle cx="40" cy="25" r="1"/><circle cx="90" cy="40" r="0.8"/><circle cx="150" cy="15" r="1.2"/>
            <circle cx="210" cy="30" r="0.7"/><circle cx="300" cy="20" r="1"/><circle cx="380" cy="35" r="0.9"/>
            <circle cx="450" cy="12" r="1.1"/><circle cx="510" cy="28" r="0.8"/>
          </g>
          <rect x="0" y="280" width="560" height="70" fill="#0a1a0a"/>
          <rect x="0" y="278" width="560" height="4" fill="#143314" opacity="0.8"/>
          <g stroke="#1e3a1e" strokeWidth="0.5" opacity="0.6">
            <line x1="0" y1="300" x2="560" y2="300"/><line x1="0" y1="320" x2="560" y2="320"/>
            <line x1="0" y1="340" x2="560" y2="340"/><line x1="80" y1="280" x2="80" y2="350"/>
            <line x1="160" y1="280" x2="160" y2="350"/><line x1="240" y1="280" x2="240" y2="350"/>
            <line x1="320" y1="280" x2="320" y2="350"/><line x1="400" y1="280" x2="400" y2="350"/>
            <line x1="480" y1="280" x2="480" y2="350"/>
          </g>
          <rect x="160" y="80" width="240" height="200" fill="#071507" stroke="#1e3a1e" strokeWidth="1"/>
          <g fill="#4ade80" opacity="0.15"><rect x="175" y="95" width="18" height="14" rx="1"/><rect x="205" y="95" width="18" height="14" rx="1"/><rect x="235" y="95" width="18" height="14" rx="1"/><rect x="265" y="95" width="18" height="14" rx="1"/><rect x="295" y="95" width="18" height="14" rx="1"/><rect x="325" y="95" width="18" height="14" rx="1"/></g>
          <g fill="#4ade80" opacity="0.55"><rect x="175" y="95" width="18" height="14" rx="1"/><rect x="265" y="95" width="18" height="14" rx="1"/><rect x="325" y="95" width="18" height="14" rx="1"/></g>
          <g fill="#4ade80" opacity="0.1"><rect x="175" y="125" width="18" height="14" rx="1"/><rect x="205" y="125" width="18" height="14" rx="1"/><rect x="235" y="125" width="18" height="14" rx="1"/><rect x="265" y="125" width="18" height="14" rx="1"/><rect x="295" y="125" width="18" height="14" rx="1"/><rect x="325" y="125" width="18" height="14" rx="1"/></g>
          <g fill="#4ade80" opacity="0.45"><rect x="205" y="125" width="18" height="14" rx="1"/><rect x="295" y="125" width="18" height="14" rx="1"/></g>
          <rect x="258" y="240" width="44" height="40" fill="#0a1f0a" stroke="#1e3a1e" strokeWidth="0.8"/>
          <rect x="440" y="140" width="100" height="140" fill="#061206" stroke="#152a15" strokeWidth="0.8"/>
          <rect x="20" y="190" width="90" height="90" fill="#061206" stroke="#152a15" strokeWidth="0.8"/>
          <rect x="127" y="240" width="6" height="40" fill="#0d250d"/>
          <ellipse cx="130" cy="230" rx="22" ry="28" fill="#0d1f0d" stroke="#152a15" strokeWidth="0.5"/>
          <rect x="417" y="248" width="6" height="32" fill="#0d250d"/>
          <ellipse cx="420" cy="238" rx="18" ry="22" fill="#0d1f0d" stroke="#152a15" strokeWidth="0.5"/>
          {/* Moving figure */}
          <g id="cctv-figure" style={{ transition: "transform 10s linear" }}>
            <rect x="-8" y="0" width="10" height="18" rx="2" fill="#4ade80" opacity="0.7"/>
            <circle cx="-3" cy="-6" r="6" fill="#4ade80" opacity="0.7"/>
            <line x1="-8" y1="4" x2="-16" y2="14" stroke="#4ade80" strokeWidth="2" opacity="0.7"/>
            <line x1="2" y1="4" x2="10" y2="14" stroke="#4ade80" strokeWidth="2" opacity="0.7"/>
            <line x1="-6" y1="18" x2="-10" y2="30" stroke="#4ade80" strokeWidth="2" opacity="0.7"/>
            <line x1="0" y1="18" x2="4" y2="30" stroke="#4ade80" strokeWidth="2" opacity="0.7"/>
          </g>
        </svg>

        {/* FOV cone */}
        <svg width="100%" viewBox="0 0 560 350" className="absolute inset-0 z-[5] pointer-events-none">
          <defs>
            <radialGradient id="fovGrad" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.01"/>
            </radialGradient>
          </defs>
          <g style={{ transformOrigin: "280px 0px", animation: "cctvSweep 6s ease-in-out infinite" }}>
            <polygon points="280,0 140,350 420,350" fill="url(#fovGrad)" stroke="#4ade80" strokeWidth="0.5" strokeOpacity="0.25"/>
            <line x1="280" y1="0" x2="280" y2="350" stroke="#4ade80" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="5 8"/>
          </g>
        </svg>

        {/* HUD overlays */}
        <div className="absolute inset-0 z-[15] pointer-events-none text-[10px]" style={{ color: "#4ade80" }}>
          <div className="absolute top-3.5 left-8 leading-7">
            <div>ZOOM: 1.0×</div>
            <div>IR: <span style={{ color: "#f87171" }}>ON</span></div>
          </div>
          <div className="absolute top-3.5 right-8 text-right leading-7">
            <div>FPS: 30</div>
            <div id="cctv-motion">MOTION: CLEAR</div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="w-full overflow-hidden h-6 relative" style={{ border: "1px solid #1e3a1e", borderTop: "none", background: "#030a03" }}>
        <div className="absolute whitespace-nowrap text-[10px] leading-6 px-2" style={{ color: "#4ade80", animation: "cctvTextScroll 20s linear infinite" }}>
          SYSTEM NOMINAL &nbsp;·&nbsp; ALL SECTORS CLEAR &nbsp;·&nbsp; NETWORK ENCRYPTED &nbsp;·&nbsp; INTRUSION DETECTION ACTIVE &nbsp;·&nbsp; FIREWALL RULES UPDATED &nbsp;·&nbsp; VPN TUNNEL ESTABLISHED &nbsp;·&nbsp; ZERO TRUST POLICY ENFORCED &nbsp;·&nbsp; THREAT INTEL FEED CONNECTED &nbsp;·&nbsp; SYSTEM NOMINAL &nbsp;·&nbsp; ALL SECTORS CLEAR &nbsp;·&nbsp; NETWORK ENCRYPTED &nbsp;·&nbsp; INTRUSION DETECTION ACTIVE
        </div>
      </div>

      {/* Camera unit */}
      <div className="mt-1.5">
        <svg width="180" height="80" viewBox="0 0 180 80">
          <rect x="84" y="0" width="12" height="22" rx="3" fill="#1a2e1a" stroke="#2a4a2a" strokeWidth="0.8"/>
          <circle cx="90" cy="22" r="8" fill="#0d1f0d" stroke="#4ade80" strokeWidth="1"/>
          <circle cx="90" cy="22" r="3" fill="#4ade80" opacity="0.8"/>
          <g style={{ transformOrigin: "90px 22px", animation: "cctvSweep 6s ease-in-out infinite" }}>
            <rect x="54" y="24" width="72" height="30" rx="6" fill="#0d1f0d" stroke="#2a4a2a" strokeWidth="1"/>
            <rect x="46" y="29" width="18" height="20" rx="4" fill="#071507" stroke="#1e3a1e" strokeWidth="0.8"/>
            <circle cx="55" cy="39" r="7" fill="#030f03" stroke="#4ade80" strokeWidth="0.8"/>
            <circle cx="55" cy="39" r="4" fill="#000" stroke="#4ade80" strokeWidth="0.5" opacity="0.9"/>
            <circle cx="52" cy="36" r="1.5" fill="#4ade80" opacity="0.4"/>
            <circle cx="70" cy="28" r="3" fill="#f87171" opacity="0.7" style={{ animation: "cctvIrBlink 1.8s ease-in-out infinite" }}/>
            <circle cx="110" cy="28" r="3" fill="#f87171" opacity="0.7" style={{ animation: "cctvIrBlink 1.8s ease-in-out infinite 0.4s" }}/>
            <circle cx="70" cy="50" r="3" fill="#f87171" opacity="0.7" style={{ animation: "cctvIrBlink 1.8s ease-in-out infinite 0.8s" }}/>
            <circle cx="110" cy="50" r="3" fill="#f87171" opacity="0.7" style={{ animation: "cctvIrBlink 1.8s ease-in-out infinite 1.2s" }}/>
            <circle cx="120" cy="39" r="3" fill="#4ade80" style={{ animation: "cctvBlink 1.2s ease-in-out infinite" }}/>
            <path d="M90 54 Q90 66 90 74" stroke="#1e3a1e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </g>
        </svg>
      </div>

      {/* Stats row */}
      <div className="flex gap-5 mt-2 text-center">
        {[
          { label: "STATUS", id: "cctv-status", value: "ARMED", color: "#4ade80" },
          { label: "EVENTS", id: "cctv-events", value: "0", color: "#4ade80" },
          { label: "UPTIME", id: "cctv-uptime", value: "00:00", color: "#4ade80" },
          { label: "THREATS", id: "cctv-threats", value: "0", color: "#f87171" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[9px] tracking-wider opacity-50" style={{ color: "#4ade80" }}>{s.label}</div>
            <div className="text-xs tracking-wide" style={{ color: s.color }} id={s.id}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CCTVAnimation;
