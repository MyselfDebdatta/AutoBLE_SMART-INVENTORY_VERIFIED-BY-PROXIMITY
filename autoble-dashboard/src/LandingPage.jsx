import { useEffect, useRef } from "react";

export default function LandingPage({ onEnterDashboard }) {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const rxRef = useRef(0);
  const ryRef = useRef(0);
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = cursorRingRef.current;
    if (!cursor || !ring) return;

    const onMove = (e) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", onMove);

    const animate = () => {
      rxRef.current += (mxRef.current - rxRef.current) * 0.12;
      ryRef.current += (myRef.current - ryRef.current) * 0.12;
      ring.style.left = rxRef.current + "px";
      ring.style.top = ryRef.current + "px";
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Hover interactions
    const hoverEls = document.querySelectorAll("a, button, .feat-card, .app-card, .team-card, .stat-item");
    const onEnter = () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      cursor.style.background = "var(--lp-green)";
      ring.style.width = "52px";
      ring.style.height = "52px";
    };
    const onLeave = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      cursor.style.background = "var(--lp-cyan)";
      ring.style.width = "36px";
      ring.style.height = "36px";
    };
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lp-visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".lp-reveal").forEach((el) => observer.observe(el));

    // Nav scroll
    const nav = document.getElementById("lp-nav");
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.style.background = "rgba(5,13,26,0.96)";
        nav.style.backdropFilter = "blur(12px)";
      } else {
        nav.style.background = "linear-gradient(to bottom, rgba(5,13,26,0.95) 0%, transparent 100%)";
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        :root {
          --lp-navy:   #050D1A;
          --lp-navy2:  #0A1628;
          --lp-navy3:  #0F2040;
          --lp-blue:   #1A6BFF;
          --lp-cyan:   #00D4FF;
          --lp-green:  #00FF88;
          --lp-white:  #F0F6FF;
          --lp-gray:   #6B7A99;
          --lp-border: rgba(255,255,255,0.07);
        }
        .lp-root { cursor: none; background: var(--lp-navy); color: var(--lp-white); font-family: 'DM Sans', sans-serif; font-weight: 300; overflow-x: hidden; }
        .lp-root body { cursor: none; }

        /* Custom cursor */
        .lp-cursor {
          position: fixed; top: 0; left: 0; width: 12px; height: 12px;
          background: var(--lp-cyan); border-radius: 50%; pointer-events: none;
          z-index: 9999; transform: translate(-50%,-50%);
          transition: transform 0.1s, width 0.2s, height 0.2s, background 0.2s;
          mix-blend-mode: screen;
        }
        .lp-cursor-ring {
          position: fixed; top: 0; left: 0; width: 36px; height: 36px;
          border: 1.5px solid rgba(0,212,255,0.5); border-radius: 50%;
          pointer-events: none; z-index: 9998; transform: translate(-50%,-50%);
          transition: width 0.25s, height 0.25s;
        }

        /* Noise */
        .lp-root::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025; pointer-events: none; z-index: 1;
        }

        /* NAV */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 20px 60px; display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(to bottom, rgba(5,13,26,0.95) 0%, transparent 100%);
          backdrop-filter: blur(2px);
        }
        .lp-nav-logo { font-family: 'Space Mono', monospace; font-size: 1.1rem; font-weight: 700; color: var(--lp-white); letter-spacing: 0.05em; text-decoration: none; cursor: none; }
        .lp-nav-logo span { color: var(--lp-cyan); }
        .lp-nav-links { display: flex; gap: 36px; list-style: none; }
        .lp-nav-links a { font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--lp-gray); text-decoration: none; letter-spacing: 0.12em; text-transform: uppercase; transition: color 0.2s; cursor: none; }
        .lp-nav-links a:hover { color: var(--lp-cyan); }
        .lp-nav-cta { font-family: 'Space Mono', monospace; font-size: 0.72rem; padding: 10px 22px; border: 1px solid var(--lp-cyan); color: var(--lp-cyan); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; transition: background 0.2s, color 0.2s; cursor: none; }
        .lp-nav-cta:hover { background: var(--lp-cyan); color: var(--lp-navy); }

        /* HERO */
        .lp-hero {
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; padding: 120px 60px 80px; text-align: center; overflow: hidden;
        }
        .lp-hero::after {
          content: ''; position: absolute; width: 900px; height: 900px;
          background: radial-gradient(ellipse, rgba(26,107,255,0.18) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-60%); pointer-events: none;
        }
        .lp-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(26,107,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,107,255,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          pointer-events: none;
        }
        .lp-hero-radar {
          position: absolute; width: 600px; height: 600px;
          border: 1px solid rgba(0,212,255,0.08); border-radius: 50%;
          top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none;
        }
        .lp-hero-radar::before { content: ''; position: absolute; inset: 60px; border: 1px solid rgba(0,212,255,0.06); border-radius: 50%; }
        .lp-hero-radar::after  { content: ''; position: absolute; inset: 140px; border: 1px solid rgba(0,212,255,0.05); border-radius: 50%; }
        .lp-hero-sweep {
          position: absolute; width: 300px; height: 1px;
          top: 50%; left: 50%; transform-origin: left center;
          background: linear-gradient(to right, transparent, rgba(0,212,255,0.6));
          animation: lpSweep 4s linear infinite; pointer-events: none;
        }
        @keyframes lpSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .lp-blip {
          position: absolute; width: 8px; height: 8px; background: var(--lp-green); border-radius: 50%;
          box-shadow: 0 0 12px var(--lp-green), 0 0 24px rgba(0,255,136,0.4);
          animation: lpBlipPulse 2s ease-in-out infinite; pointer-events: none;
        }
        @keyframes lpBlipPulse { 0%,100%{opacity:0.9;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.7);} }
        .lp-blip:nth-child(4) { top: calc(50% - 90px); left: calc(50% + 60px); animation-delay: 0s; }
        .lp-blip:nth-child(5) { top: calc(50% + 50px); left: calc(50% - 120px); animation-delay: 0.7s; }
        .lp-blip:nth-child(6) { top: calc(50% - 30px); left: calc(50% + 160px); animation-delay: 1.4s; }
        .lp-blip:nth-child(7) { top: calc(50% + 110px); left: calc(50% + 40px); animation-delay: 0.4s; }

        .lp-hero-eyebrow { font-family: 'Space Mono', monospace; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--lp-cyan); margin-bottom: 24px; position: relative; z-index: 2; opacity: 0; animation: lpFadeUp 0.8s ease forwards 0.3s; }
        .lp-hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(3.5rem,9vw,8rem); font-weight: 800; line-height: 0.95; letter-spacing: -0.03em; position: relative; z-index: 2; opacity: 0; animation: lpFadeUp 0.9s ease forwards 0.5s; }
        .lp-hero h1 .word-ble { -webkit-text-stroke: 2px var(--lp-cyan); color: transparent; }
        .lp-hero-sub { font-size: 1.15rem; font-weight: 300; color: rgba(240,246,255,0.6); margin-top: 28px; max-width: 520px; line-height: 1.7; position: relative; z-index: 2; opacity: 0; animation: lpFadeUp 0.9s ease forwards 0.7s; }
        .lp-hero-actions { display: flex; gap: 16px; margin-top: 48px; position: relative; z-index: 2; opacity: 0; animation: lpFadeUp 0.9s ease forwards 0.9s; }
        @keyframes lpFadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }

        .lp-hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; font-family: 'Space Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; color: var(--lp-gray); z-index: 2; opacity: 0; animation: lpFadeUp 1s ease forwards 1.3s; }
        .lp-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--lp-gray), transparent); animation: lpScrollBob 1.8s ease-in-out infinite; }
        @keyframes lpScrollBob { 0%,100%{transform:scaleY(1);opacity:1;} 50%{transform:scaleY(0.5);opacity:0.4;} }

        /* Buttons */
        .lp-btn-primary {
          display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px;
          background: var(--lp-blue); color: #fff; font-family: 'Space Mono', monospace;
          font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          border: none; cursor: none; position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 0 30px rgba(26,107,255,0.4);
          text-decoration: none;
        }
        .lp-btn-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%); opacity: 0; transition: opacity 0.2s; }
        .lp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(26,107,255,0.6); }
        .lp-btn-primary:hover::after { opacity: 1; }
        .lp-btn-outline {
          display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px;
          border: 1px solid rgba(255,255,255,0.15); color: var(--lp-white);
          font-family: 'Space Mono', monospace; font-size: 0.8rem; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none; cursor: none;
          transition: border-color 0.2s, color 0.2s; background: transparent;
        }
        .lp-btn-outline:hover { border-color: var(--lp-cyan); color: var(--lp-cyan); }

        /* STATS */
        .lp-stats-bar { position: relative; z-index: 2; border-top: 1px solid var(--lp-border); border-bottom: 1px solid var(--lp-border); background: rgba(10,22,40,0.6); backdrop-filter: blur(12px); display: grid; grid-template-columns: repeat(4,1fr); }
        .lp-stat-item { padding: 36px 48px; border-right: 1px solid var(--lp-border); display: flex; flex-direction: column; gap: 6px; position: relative; overflow: hidden; transition: background 0.3s; cursor: none; }
        .lp-stat-item:last-child { border-right: none; }
        .lp-stat-item::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right,transparent,var(--lp-blue),transparent); opacity: 0; transition: opacity 0.3s; }
        .lp-stat-item:hover::before { opacity: 1; }
        .lp-stat-item:hover { background: rgba(26,107,255,0.05); }
        .lp-stat-val { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; line-height: 1; color: var(--lp-white); }
        .lp-stat-val span { color: var(--lp-cyan); }
        .lp-stat-label { font-family: 'Space Mono', monospace; font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--lp-gray); }

        /* Sections */
        .lp-section-inner { max-width: 1200px; margin: 0 auto; padding: 120px 60px; position: relative; z-index: 2; }
        .lp-section-label { font-family: 'Space Mono', monospace; font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--lp-cyan); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
        .lp-section-label::before { content: ''; width: 24px; height: 1px; background: var(--lp-cyan); }
        .lp-section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3.2rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; color: var(--lp-white); margin-bottom: 20px; }
        .lp-section-body { font-size: 1.05rem; font-weight: 300; color: rgba(240,246,255,0.55); line-height: 1.8; max-width: 560px; }

        /* HOW */
        .lp-how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-top: 80px; }
        .lp-steps { display: flex; flex-direction: column; gap: 0; }
        .lp-step { display: flex; gap: 28px; padding: 32px 0; border-bottom: 1px solid var(--lp-border); cursor: none; transition: padding-left 0.3s; }
        .lp-step:last-child { border-bottom: none; }
        .lp-step:hover { padding-left: 8px; }
        .lp-step-num { font-family: 'Space Mono', monospace; font-size: 0.7rem; font-weight: 700; color: var(--lp-blue); min-width: 28px; padding-top: 4px; letter-spacing: 0.1em; }
        .lp-step h3 { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; color: var(--lp-white); margin-bottom: 8px; }
        .lp-step p { font-size: 0.9rem; color: var(--lp-gray); line-height: 1.7; }

        /* Phone */
        .lp-phone-vis { position: relative; display: flex; align-items: center; justify-content: center; }
        .lp-phone-frame { width: 260px; background: var(--lp-navy2); border: 1px solid rgba(255,255,255,0.1); border-radius: 36px; padding: 20px 16px; position: relative; box-shadow: 0 40px 80px rgba(0,0,0,0.5),0 0 60px rgba(26,107,255,0.15); }
        .lp-phone-notch { width: 80px; height: 20px; background: var(--lp-navy); border-radius: 0 0 14px 14px; margin: 0 auto 16px; }
        .lp-phone-screen { background: var(--lp-navy3); border-radius: 20px; padding: 16px; min-height: 420px; }
        .lp-ps-header { font-family: 'Space Mono', monospace; font-size: 0.55rem; color: var(--lp-cyan); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px; display: flex; justify-content: space-between; }
        .lp-mini-radar { width: 100%; aspect-ratio: 1; border-radius: 50%; border: 1px solid rgba(0,212,255,0.15); position: relative; overflow: hidden; background: radial-gradient(circle,rgba(26,107,255,0.06) 0%,transparent 70%); margin-bottom: 14px; }
        .lp-mini-radar::before { content: ''; position: absolute; inset: 20%; border: 1px solid rgba(0,212,255,0.1); border-radius: 50%; }
        .lp-radar-sweep-mini { position: absolute; width: 50%; height: 1px; top: 50%; left: 50%; transform-origin: left center; background: linear-gradient(to right,transparent,rgba(0,212,255,0.7)); animation: lpSweep 3s linear infinite; }
        .lp-mini-blip { position: absolute; width: 7px; height: 7px; background: var(--lp-green); border-radius: 50%; box-shadow: 0 0 10px var(--lp-green); animation: lpBlipPulse 2s ease-in-out infinite; }
        .lp-mini-blip:nth-child(2) { top: 28%; left: 65%; }
        .lp-mini-blip:nth-child(3) { top: 60%; left: 25%; animation-delay: 0.5s; }
        .lp-mini-blip:nth-child(4) { top: 42%; left: 72%; animation-delay: 1s; }
        .lp-ps-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 6px; border-left: 3px solid; font-family: 'Space Mono', monospace; font-size: 0.52rem; color: var(--lp-gray); }
        .lp-ps-item.imm  { border-color: var(--lp-green); }
        .lp-ps-item.near { border-color: var(--lp-cyan); }
        .lp-ps-item.med  { border-color: #FFB347; }
        .lp-ps-badge { padding: 2px 6px; border-radius: 4px; font-size: 0.48rem; font-weight: 700; text-transform: uppercase; }
        .lp-ps-badge.imm  { background: rgba(0,255,136,0.15); color: var(--lp-green); }
        .lp-ps-badge.near { background: rgba(0,212,255,0.15); color: var(--lp-cyan); }
        .lp-ps-badge.med  { background: rgba(255,179,71,0.15); color: #FFB347; }

        /* FEATURES */
        .lp-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; margin-top: 60px; border: 1px solid var(--lp-border); }
        .feat-card { padding: 44px 36px; background: var(--lp-navy2); border: 1px solid var(--lp-border); position: relative; overflow: hidden; transition: background 0.3s; cursor: none; }
        .feat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(to right,transparent,var(--lp-blue),transparent); opacity: 0; transition: opacity 0.3s; }
        .feat-card:hover { background: rgba(26,107,255,0.06); }
        .feat-card:hover::before { opacity: 1; }
        .lp-feat-icon { width: 48px; height: 48px; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; font-size: 1.4rem; background: rgba(255,255,255,0.03); }
        .feat-card h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--lp-white); margin-bottom: 12px; }
        .feat-card p { font-size: 0.875rem; color: var(--lp-gray); line-height: 1.7; }
        .lp-feat-tag { display: inline-block; margin-top: 20px; font-family: 'Space Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 3px; background: rgba(26,107,255,0.12); color: var(--lp-blue); border: 1px solid rgba(26,107,255,0.2); }

        /* RSSI */
        .lp-rssi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-top: 60px; }
        .lp-rssi-levels { display: flex; flex-direction: column; gap: 12px; }
        .lp-rssi-level { display: flex; align-items: center; gap: 20px; padding: 20px 24px; border: 1px solid var(--lp-border); position: relative; overflow: hidden; transition: border-color 0.3s,transform 0.3s; cursor: none; }
        .lp-rssi-level:hover { transform: translateX(6px); }
        .lp-rssi-level.imm  { border-left: 3px solid var(--lp-green); }
        .lp-rssi-level.near { border-left: 3px solid var(--lp-cyan); }
        .lp-rssi-level.med  { border-left: 3px solid #FFB347; }
        .lp-rssi-level.far  { border-left: 3px solid #FF6B6B; }
        .lp-rssi-level:hover.imm  { border-color: var(--lp-green);  background: rgba(0,255,136,0.04); }
        .lp-rssi-level:hover.near { border-color: var(--lp-cyan);   background: rgba(0,212,255,0.04); }
        .lp-rssi-level:hover.med  { border-color: #FFB347;           background: rgba(255,179,71,0.04); }
        .lp-rssi-level:hover.far  { border-color: #FF6B6B;           background: rgba(255,107,107,0.04); }
        .lp-rssi-bars { display: flex; gap: 3px; align-items: flex-end; height: 28px; flex-shrink: 0; }
        .lp-rssi-bar { width: 5px; background: rgba(255,255,255,0.08); border-radius: 2px; }
        .lp-rssi-bar.active { background: currentColor; }
        .lp-rssi-level.imm  .lp-rssi-bar { color: var(--lp-green); }
        .lp-rssi-level.near .lp-rssi-bar { color: var(--lp-cyan); }
        .lp-rssi-level.med  .lp-rssi-bar { color: #FFB347; }
        .lp-rssi-level.far  .lp-rssi-bar { color: #FF6B6B; }
        .lp-rssi-bar:nth-child(1) { height: 30%; }
        .lp-rssi-bar:nth-child(2) { height: 55%; }
        .lp-rssi-bar:nth-child(3) { height: 78%; }
        .lp-rssi-bar:nth-child(4) { height: 100%; }
        .lp-rssi-info h4 { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--lp-white); margin-bottom: 4px; }
        .lp-rssi-info span { font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--lp-gray); }
        .lp-rssi-info p { font-size: 0.82rem; color: var(--lp-gray); margin-top: 4px; }
        .lp-code-block { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; font-family: 'Space Mono', monospace; font-size: 0.78rem; line-height: 1.8; color: rgba(240,246,255,0.5); position: relative; overflow: hidden; white-space: pre; }
        .lp-code-block::before { content: 'RSSI LOGIC'; position: absolute; top: 16px; right: 20px; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.15); }
        .lp-kw  { color: var(--lp-blue); }
        .lp-str { color: var(--lp-cyan); }
        .lp-num { color: var(--lp-green); }
        .lp-cmt { color: rgba(255,255,255,0.25); font-style: italic; }

        /* TECH */
        .lp-tech-cols { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; margin-top: 60px; }
        .lp-tech-col { background: rgba(0,0,0,0.2); border: 1px solid var(--lp-border); padding: 32px 28px; }
        .lp-tech-col-label { font-family: 'Space Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--lp-border); }
        .lp-tech-col-label.hw  { color: var(--lp-cyan); }
        .lp-tech-col-label.fw  { color: var(--lp-green); }
        .lp-tech-col-label.fe  { color: #FFB347; }
        .lp-tech-col-label.pro { color: var(--lp-blue); }
        .lp-tech-item { font-size: 0.85rem; color: var(--lp-gray); padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; gap: 10px; transition: color 0.2s; cursor: none; }
        .lp-tech-item:hover { color: var(--lp-white); }
        .lp-tech-item::before { content: '→'; font-family: 'Space Mono', monospace; font-size: 0.6rem; color: rgba(255,255,255,0.15); flex-shrink: 0; transition: color 0.2s; }
        .lp-tech-item:hover::before { color: var(--lp-cyan); }

        /* APPS */
        .lp-apps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 60px; }
        .app-card { padding: 36px 30px; border: 1px solid var(--lp-border); position: relative; overflow: hidden; transition: border-color 0.3s,transform 0.3s; cursor: none; }
        .app-card:hover { border-color: rgba(26,107,255,0.4); transform: translateY(-4px); }
        .app-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right,var(--lp-blue),var(--lp-cyan)); opacity: 0; transition: opacity 0.3s; }
        .app-card:hover::after { opacity: 1; }
        .lp-app-emoji { font-size: 2rem; margin-bottom: 20px; display: block; }
        .app-card h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--lp-white); margin-bottom: 10px; }
        .app-card p { font-size: 0.875rem; color: var(--lp-gray); line-height: 1.7; }

        /* CTA */
        .lp-cta-section { position: relative; overflow: hidden; }
        .lp-cta-section::before { content: ''; position: absolute; width: 800px; height: 800px; background: radial-gradient(ellipse,rgba(26,107,255,0.15) 0%,transparent 65%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
        .lp-cta-inner { max-width: 800px; margin: 0 auto; padding: 120px 60px; text-align: center; position: relative; z-index: 2; }
        .lp-cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .lp-cta-note { margin-top: 28px; font-family: 'Space Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; color: var(--lp-gray); display: flex; align-items: center; justify-content: center; gap: 20px; }
        .lp-cta-note span { display: flex; align-items: center; gap: 6px; }
        .lp-cta-note span::before { content: '✓'; color: var(--lp-green); }

        /* TEAM */
        .lp-team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-top: 60px; }
        .team-card { padding: 32px 24px; border: 1px solid var(--lp-border); text-align: center; transition: border-color 0.3s,transform 0.3s; cursor: none; }
        .team-card:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-3px); }
        .lp-team-avatar { width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; border: 2px solid rgba(0,212,255,0.3); }
        .team-card h4 { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--lp-white); margin-bottom: 6px; }
        .team-card span { font-family: 'Space Mono', monospace; font-size: 0.62rem; color: var(--lp-cyan); letter-spacing: 0.1em; text-transform: uppercase; }

        /* FOOTER */
        .lp-footer { border-top: 1px solid var(--lp-border); padding: 48px 60px; display: flex; align-items: center; justify-content: space-between; background: var(--lp-navy); position: relative; z-index: 2; }
        .lp-foot-logo { font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 700; color: var(--lp-gray); }
        .lp-foot-logo span { color: var(--lp-cyan); }
        .lp-foot-copy { font-family: 'Space Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; color: rgba(107,122,153,0.6); text-align: center; }
        .lp-foot-links { display: flex; gap: 28px; }
        .lp-foot-links a { font-family: 'Space Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; color: var(--lp-gray); text-decoration: none; text-transform: uppercase; transition: color 0.2s; cursor: none; }
        .lp-foot-links a:hover { color: var(--lp-cyan); }

        /* Reveal */
        .lp-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease,transform 0.7s ease; }
        .lp-reveal.lp-visible { opacity: 1; transform: none; }
        .lp-d1 { transition-delay: 0.1s; }
        .lp-d2 { transition-delay: 0.2s; }
        .lp-d3 { transition-delay: 0.3s; }
        .lp-d4 { transition-delay: 0.4s; }

        /* Responsive */
        @media (max-width: 900px) {
          .lp-nav { padding: 18px 24px; }
          .lp-nav-links { display: none; }
          .lp-section-inner { padding: 80px 24px; }
          .lp-how-grid,.lp-rssi-grid { grid-template-columns: 1fr; }
          .lp-features-grid { grid-template-columns: 1fr 1fr; }
          .lp-tech-cols { grid-template-columns: 1fr 1fr; }
          .lp-apps-grid { grid-template-columns: 1fr 1fr; }
          .lp-team-grid { grid-template-columns: 1fr 1fr; }
          .lp-stats-bar { grid-template-columns: 1fr 1fr; }
          .lp-stat-item:nth-child(2) { border-right: none; }
          .lp-phone-vis { display: none; }
          .lp-footer { flex-direction: column; gap: 20px; text-align: center; }
          .lp-hero { padding: 100px 24px 60px; }
          .lp-hero-actions { flex-direction: column; align-items: center; }
        }
        @media (max-width: 600px) {
          .lp-features-grid,.lp-tech-cols,.lp-apps-grid,.lp-team-grid { grid-template-columns: 1fr; }
          .lp-stats-bar { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="lp-root" style={{ position: "relative" }}>
        {/* Cursor */}
        <div className="lp-cursor" ref={cursorRef} id="lp-cursor" />
        <div className="lp-cursor-ring" ref={cursorRingRef} id="lp-cursor-ring" />

        {/* NAV */}
        <nav className="lp-nav" id="lp-nav">
          <a href="#" className="lp-nav-logo">Auto<span>BLE</span></a>
          <ul className="lp-nav-links">
            <li><a href="#lp-how" onClick={e=>{e.preventDefault();scrollTo("lp-how")}}>How It Works</a></li>
            <li><a href="#lp-features" onClick={e=>{e.preventDefault();scrollTo("lp-features")}}>Features</a></li>
            <li><a href="#lp-tech" onClick={e=>{e.preventDefault();scrollTo("lp-tech")}}>Tech Stack</a></li>
            <li><a href="#lp-apps" onClick={e=>{e.preventDefault();scrollTo("lp-apps")}}>Applications</a></li>
            <li><a href="#lp-team" onClick={e=>{e.preventDefault();scrollTo("lp-team")}}>Team</a></li>
          </ul>
          <a href="https://github.com" className="lp-nav-cta" target="_blank" rel="noreferrer">View on GitHub</a>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-grid" />
          <div className="lp-hero-radar" />
          <div className="lp-hero-sweep" />
          <div className="lp-blip" />
          <div className="lp-blip" />
          <div className="lp-blip" />
          <div className="lp-blip" />

          <p className="lp-hero-eyebrow">ESP32 · BLE · Offline-First · React Dashboard</p>
          <h1><span className="word-auto">Auto</span><span className="word-ble">BLE</span></h1>
          <p className="lp-hero-sub">Smart inventory verification powered by Bluetooth proximity — fully offline, served from a $5 microcontroller.</p>
          <div className="lp-hero-actions">
            {/* "See How It Works" → goes to dashboard */}
            <button className="lp-btn-primary" onClick={onEnterDashboard} style={{ cursor: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,8 12,12 14,14"/></svg>
              See How It Works
            </button>
            <button className="lp-btn-outline" onClick={() => scrollTo("lp-features")} style={{ cursor: "none" }}>
              Explore Features
            </button>
          </div>
          <div className="lp-hero-scroll">
            <span>Scroll</span>
            <div className="lp-scroll-line" />
          </div>
        </section>

        {/* STATS BAR */}
        <div className="lp-stats-bar">
          {[
            { val: "$", num: "5",    label: "Hardware Cost",    valFirst: true },
            { val: "",  num: "0",    label: "Internet Required", valFirst: false },
            { val: "4", num: "×",    label: "Proximity Levels", valFirst: false },
            { val: "100",num: "+",   label: "Scalable Beacons", valFirst: false },
          ].map((s, i) => (
            <div key={i} className={`lp-stat-item stat-item lp-reveal${i>0?" lp-d"+i:""}`}>
              <div className="lp-stat-val">
                {s.val && !s.valFirst && s.val}
                <span>{s.num}</span>
                {s.val && s.valFirst && s.val}
              </div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <section style={{ background: "var(--lp-navy)", position: "relative", zIndex: 2 }} id="lp-how">
          <div className="lp-section-inner">
            <p className="lp-section-label lp-reveal">How It Works</p>
            <h2 className="lp-section-title lp-reveal">Walk the floor.<br/>Let AutoBLE do the rest.</h2>
            <p className="lp-section-body lp-reveal">No scanning guns. No barcodes. No internet. Just walk near your inventory — beacons are detected, verified, and logged automatically in real time.</p>

            <div className="lp-how-grid">
              <div className="lp-steps">
                {[
                  { n:"01", title:"Tag Your Containers",   body:"Attach BLE iBeacons to every container, shelf, or asset you want to track. Each beacon broadcasts a unique ID." },
                  { n:"02", title:"Carry the ESP32",        body:"The operator carries a pocket-sized ESP32 microcontroller. It continuously scans for BLE signals as they walk." },
                  { n:"03", title:"Connect to Hotspot",     body:<>The ESP32 creates its own offline Wi-Fi at <code style={{fontFamily:"'Space Mono',monospace",fontSize:"0.8em",color:"var(--lp-cyan)"}}>192.168.4.1</code>. Your phone connects in seconds.</> },
                  { n:"04", title:"Open Dashboard & Verify", body:"The React dashboard loads in your browser. Items auto-verify as beacons are detected — green checkmarks in real time." },
                ].map((s, i) => (
                  <div key={i} className={`lp-step lp-reveal${i>0?" lp-d"+i:""}`}>
                    <div className="lp-step-num">{s.n}</div>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lp-phone-vis lp-reveal lp-d2">
                <div className="lp-phone-frame">
                  <div className="lp-phone-notch" />
                  <div className="lp-phone-screen">
                    <div className="lp-ps-header">
                      <span>AutoBLE</span>
                      <span style={{color:"var(--lp-green)"}}>● LIVE</span>
                    </div>
                    <div className="lp-mini-radar">
                      <div className="lp-radar-sweep-mini" />
                      <div className="lp-mini-blip" />
                      <div className="lp-mini-blip" />
                      <div className="lp-mini-blip" />
                    </div>
                    {[
                      { label:"Container A1", badge:"Immediate", cls:"imm" },
                      { label:"Container B3", badge:"Near",      cls:"near" },
                      { label:"Reagent Box C",badge:"Medium",    cls:"med" },
                      { label:"Flask Set D",  badge:"Immediate", cls:"imm" },
                    ].map((r,i) => (
                      <div key={i} className={`lp-ps-item ${r.cls}`}>
                        <span>{r.label}</span>
                        <span className={`lp-ps-badge ${r.cls}`}>{r.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ background: "var(--lp-navy2)", position: "relative", zIndex: 2 }} id="lp-features">
          <div className="lp-section-inner">
            <p className="lp-section-label lp-reveal">Features</p>
            <h2 className="lp-section-title lp-reveal">Everything you need.<br/>Nothing you don't.</h2>
            <div className="lp-features-grid">
              {[
                { icon:"📡", title:"Fully Offline",         body:"Zero internet required. The entire system — dashboard, API, and scanner — runs from the ESP32 itself with no cloud dependency.", tag:"No Cloud" },
                { icon:"⚡", title:"Real-Time Detection",   body:"BLE scan results update every 2.5 seconds. Beacons appear, verify, and disappear from the dashboard instantly as you move.", tag:"2.5s Refresh" },
                { icon:"🎯", title:"RSSI Proximity Radar",  body:"Animated SVG radar places each beacon at a distance relative to its RSSI signal strength with a rotating sweep line.", tag:"Visual Radar" },
                { icon:"✅", title:"Auto-Verification",     body:"Items in your checklist automatically glow green and tick off the moment their beacon is detected in IMMEDIATE or NEAR range.", tag:"Zero Manual Entry" },
                { icon:"📳", title:"Haptic Feedback",       body:"Using the Web Vibration API, your phone vibrates on detection — making AutoBLE feel like a professional handheld scanner.", tag:"Web Vibration API" },
                { icon:"💰", title:"Ultra Low Cost",        body:"ESP32 under ₹200. BLE beacon under ₹400. Months of battery life. No subscriptions, no servers, no ongoing fees.", tag:"Under ₹600 Total" },
              ].map((f, i) => (
                <div key={i} className={`feat-card lp-reveal${i>0?" lp-d"+Math.min(i,4):""}`}>
                  <div className="lp-feat-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                  <span className="lp-feat-tag">{f.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RSSI */}
        <section style={{ background: "var(--lp-navy)", position: "relative", zIndex: 2 }} id="lp-rssi">
          <div className="lp-section-inner">
            <p className="lp-section-label lp-reveal">Proximity Engine</p>
            <h2 className="lp-section-title lp-reveal">4-Level RSSI<br/>Classification</h2>
            <p className="lp-section-body lp-reveal">AutoBLE reads raw RSSI from each BLE beacon and classifies proximity into four actionable levels in real time.</p>
            <div className="lp-rssi-grid">
              <div className="lp-rssi-levels">
                {[
                  { cls:"imm",  bars:4, title:"IMMEDIATE", range:"≥ −60 dBm",      desc:"Right next to the operator — instant verification triggered" },
                  { cls:"near", bars:3, title:"NEAR",       range:"−60 to −70 dBm", desc:"Within a few metres — strong reliable detection" },
                  { cls:"med",  bars:2, title:"MEDIUM",     range:"−70 to −80 dBm", desc:"Same room — detected but not yet verified" },
                  { cls:"far",  bars:1, title:"FAR",        range:"< −80 dBm",      desc:"Weak signal — item may need repositioning" },
                ].map((l, i) => (
                  <div key={i} className={`lp-rssi-level ${l.cls} lp-reveal${i>0?" lp-d"+i:""}`}>
                    <div className="lp-rssi-bars">
                      {[1,2,3,4].map(b => <div key={b} className={`lp-rssi-bar${b<=l.bars?" active":""}`} style={{height:`${(b/4)*100}%`}} />)}
                    </div>
                    <div className="lp-rssi-info">
                      <h4>{l.title}</h4>
                      <span>{l.range}</span>
                      <p>{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lp-code-block lp-reveal lp-d2">{`// RSSI → Proximity classification
`}<span className="lp-kw">const char</span>{`* rssiToProximity(`}<span className="lp-kw">int</span>{` rssi) {
  `}<span className="lp-kw">if</span>{` (rssi >= `}<span className="lp-num">-60</span>{`)
    `}<span className="lp-kw">return</span>{` `}<span className="lp-str">"IMMEDIATE"</span>{`;  `}<span className="lp-cmt">// verify ✓</span>{`

  `}<span className="lp-kw">if</span>{` (rssi >= `}<span className="lp-num">-70</span>{`)
    `}<span className="lp-kw">return</span>{` `}<span className="lp-str">"NEAR"</span>{`;       `}<span className="lp-cmt">// verify ✓</span>{`

  `}<span className="lp-kw">if</span>{` (rssi >= `}<span className="lp-num">-80</span>{`)
    `}<span className="lp-kw">return</span>{` `}<span className="lp-str">"MEDIUM"</span>{`;

  `}<span className="lp-kw">return</span>{` `}<span className="lp-str">"FAR"</span>{`;
}

`}<span className="lp-cmt">// React dashboard polls /api/scan</span>{`
`}<span className="lp-cmt">// every 2500ms and updates live</span>{`
`}<span className="lp-kw">const</span>{` { data } = `}<span className="lp-kw">useSWR</span>{`(
  `}<span className="lp-str">"/api/scan"</span>{`,
  fetcher,
  { refreshInterval: `}<span className="lp-num">2500</span>{` }
);`}</div>
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section style={{ background: "var(--lp-navy2)", position: "relative", zIndex: 2 }} id="lp-tech">
          <div className="lp-section-inner">
            <p className="lp-section-label lp-reveal">Technology</p>
            <h2 className="lp-section-title lp-reveal">Built on a battle-tested<br/>open stack.</h2>
            <p className="lp-section-body lp-reveal">Every component was chosen to maximise reliability, minimise cost, and eliminate cloud dependencies entirely.</p>
            <div className="lp-tech-cols">
              {[
                { cls:"hw",  label:"Hardware",  items:["ESP32 (240MHz Dual Core)","BLE iBeacon Tags","LittleFS Flash Storage","Li-Ion / USB Battery"] },
                { cls:"fw",  label:"Firmware",  items:["Arduino Framework","ESP32 BLEScan Library","ESPAsyncWebServer","ArduinoJson","WiFi.softAP()"] },
                { cls:"fe",  label:"Frontend",  items:["React 18 + Vite 5","Custom SVG Components","React Hooks (useState)","Web Vibration API","IBM Plex Mono Font"] },
                { cls:"pro", label:"Protocols", items:["Bluetooth LE 4.2 / 5.0","RSSI Proximity Logic","Wi-Fi 802.11 b/g/n","HTTP REST /api/scan"] },
              ].map((col, i) => (
                <div key={i} className={`lp-tech-col lp-reveal${i>0?" lp-d"+i:""}`}>
                  <div className={`lp-tech-col-label ${col.cls}`}>{col.label}</div>
                  {col.items.map((item, j) => <div key={j} className="lp-tech-item">{item}</div>)}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATIONS */}
        <section style={{ background: "var(--lp-navy)", position: "relative", zIndex: 2 }} id="lp-apps">
          <div className="lp-section-inner">
            <p className="lp-section-label lp-reveal">Use Cases</p>
            <h2 className="lp-section-title lp-reveal">Anywhere inventory<br/>needs to be tracked.</h2>
            <p className="lp-section-body lp-reveal">AutoBLE works wherever existing solutions fail — offline environments, tight budgets, and spaces where installing fixed infrastructure isn't possible.</p>
            <div className="lp-apps-grid">
              {[
                { emoji:"🏭", title:"Warehouses",          body:"Auto-verify stock in large storage areas. Operators walk aisles and inventory updates in real time — no scanners, no barcodes." },
                { emoji:"🧪", title:"Pharma & Chem Labs",  body:"Track chemical cabinets, reagent samples, and lab instruments in cold storage rooms with zero internet connectivity." },
                { emoji:"🖥️", title:"Data Centres",        body:"Monitor server racks, networking equipment, and cable trays. Walk the floor and verify assets without manual logging." },
                { emoji:"🔧", title:"Tool Rooms",          body:"Track tools in manufacturing and maintenance facilities. Know instantly which tools are present, missing, or misplaced." },
                { emoji:"🏥", title:"Hospital Equipment",  body:"Locate mobile medical devices, infusion pumps, and wheelchairs across floors and wards — no fixed gateway installation needed." },
                { emoji:"🎓", title:"University Labs",     body:"Manage research instruments, lab equipment, and student assets across departments. Ideal for academic environments on tight budgets." },
              ].map((a, i) => (
                <div key={i} className={`app-card lp-reveal${i>0?" lp-d"+Math.min(i,4):""}`}>
                  <span className="lp-app-emoji">{a.emoji}</span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta-section" style={{ background: "var(--lp-navy2)" }} id="lp-cta">
          <div className="lp-cta-inner">
            <p className="lp-section-label lp-reveal" style={{justifyContent:"center"}}>Get Started</p>
            <h2 className="lp-section-title lp-reveal" style={{fontSize:"clamp(2.5rem,5vw,4rem)",margin:"0 auto 20px"}}>Just walk near<br/>your inventory.</h2>
            <p className="lp-section-body lp-reveal" style={{textAlign:"center",margin:"0 auto 48px"}}>Flash the firmware, upload the dashboard, connect your phone. AutoBLE is ready in under 10 minutes.</p>
            <div className="lp-cta-actions lp-reveal">
              <button className="lp-btn-primary" onClick={onEnterDashboard} style={{ cursor: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                Open Dashboard
              </button>
              <button className="lp-btn-outline" onClick={() => scrollTo("lp-how")} style={{ cursor: "none" }}>Read the Docs</button>
            </div>
            <div className="lp-cta-note lp-reveal">
              <span>No Internet Required</span>
              <span>No Subscription</span>
              <span>Open Source</span>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section style={{ background: "var(--lp-navy)", position: "relative", zIndex: 2 }} id="lp-team">
          <div className="lp-section-inner">
            <p className="lp-section-label lp-reveal">The Team</p>
            <h2 className="lp-section-title lp-reveal">Team AutoBLE</h2>
            <p className="lp-section-body lp-reveal">Built by students at Siksha 'O' Anusandhan University, Faculty of Engineering & Technology.</p>
            <div className="lp-team-grid">
              {[
                { initial:"Y", name:"Yashvi Lodhi",     bg:"rgba(26,107,255,0.1)",   color:"var(--lp-blue)" },
                { initial:"R", name:"Ritisha Sahoo",    bg:"rgba(0,212,255,0.1)",    color:"var(--lp-cyan)" },
                { initial:"D", name:"Debdatta Panda",   bg:"rgba(0,255,136,0.1)",    color:"var(--lp-green)" },
                { initial:"S", name:"Sahil Kumar Sahoo",bg:"rgba(255,179,71,0.1)",   color:"#FFB347" },
              ].map((m, i) => (
                <div key={i} className={`team-card lp-reveal${i>0?" lp-d"+i:""}`}>
                  <div className="lp-team-avatar" style={{background:m.bg,color:m.color}}>{m.initial}</div>
                  <h4>{m.name}</h4>
                  <span>Team Member</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-foot-logo">Auto<span>BLE</span></div>
          <div className="lp-foot-copy">
            © 2026 Team AutoBLE · Siksha 'O' Anusandhan University<br/>
            Smart Inventory, Verified by Proximity
          </div>
          <div className="lp-foot-links">
            <a href="#lp-how" onClick={e=>{e.preventDefault();scrollTo("lp-how")}}>Docs</a>
            <a href="#lp-tech" onClick={e=>{e.preventDefault();scrollTo("lp-tech")}}>Tech</a>
            <a href="#lp-team" onClick={e=>{e.preventDefault();scrollTo("lp-team")}}>Team</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </footer>
      </div>
    </>
  );
}
