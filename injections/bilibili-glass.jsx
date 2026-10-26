import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import LiquidGlass from "liquid-glass-react";

const ROOT_ID = "pake-liquid-glass-root";
const HOME_URL = "https://www.bilibili.com/";
const appWindow = window.__TAURI__?.window?.getCurrentWindow?.();

function runWindowAction(action) {
  const result = appWindow?.[action]?.();
  result?.catch?.((error) => console.warn(`[Pake] ${action} failed:`, error));
}

const buttonStyle = {
  width: 34,
  height: 34,
  padding: 0,
  border: 0,
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.34)",
  color: "#0b0b0f",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  flex: "0 0 auto",
};

function Icon({ children }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GlassButton({ label, onClick, className = "", children }) {
  return (
    <button
      type="button"
      className={`pake-glass-button ${className}`}
      style={buttonStyle}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function GlassToolbar() {
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  if (fullscreen) return null;

  return (
    <LiquidGlass
      displacementScale={52}
      blurAmount={0.28}
      saturation={150}
      aberrationIntensity={1.6}
      elasticity={0.22}
      cornerRadius={24}
      padding="6px"
      style={{ position: "absolute", top: "50%", left: "50%" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          color: "#17171c",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          className="pake-glass-drag"
          role="button"
          tabIndex={0}
          aria-label="拖动窗口，双击最大化"
          title="拖动窗口，双击最大化"
          onMouseDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            runWindowAction("startDragging");
          }}
          onDoubleClick={() => runWindowAction("toggleMaximize")}
          onKeyDown={(event) => {
            if (event.key === "Enter") runWindowAction("toggleMaximize");
          }}
          style={{
            width: 46,
            height: 34,
            display: "grid",
            placeItems: "center",
            cursor: "grab",
            borderRadius: 12,
            outline: "none",
          }}
        >
          <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor" aria-hidden="true">
            {[5, 11, 17].map((x) =>
              [4, 10, 16].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />),
            )}
          </svg>
        </div>
        <div style={{ width: 1, height: 20, background: "currentColor", opacity: 0.18, margin: "0 3px" }} />
        <GlassButton label="后退" onClick={() => window.history.back()}>
          <Icon><path d="m15 18-6-6 6-6" /></Icon>
        </GlassButton>
        <GlassButton label="主页" onClick={() => window.location.assign(HOME_URL)}>
          <Icon><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></Icon>
        </GlassButton>
        <GlassButton label="刷新" onClick={() => window.location.reload()}>
          <Icon><path d="M20 6v5h-5" /><path d="M4 18v-5h5" /><path d="M6.1 9a7 7 0 0 1 11.5-2.6L20 11" /><path d="M17.9 15a7 7 0 0 1-11.5 2.6L4 13" /></Icon>
        </GlassButton>
        <div style={{ width: 1, height: 20, background: "currentColor", opacity: 0.18, margin: "0 3px" }} />
        <GlassButton label="最小化" onClick={() => runWindowAction("minimize")}>
          <Icon><path d="M5 12h14" /></Icon>
        </GlassButton>
        <GlassButton label="最大化或还原" onClick={() => runWindowAction("toggleMaximize")}>
          <Icon><rect x="5" y="5" width="14" height="14" rx="2" /></Icon>
        </GlassButton>
        <GlassButton label="关闭" className="pake-glass-close" onClick={() => runWindowAction("close")}>
          <Icon><path d="m6 6 12 12" /><path d="m18 6-12 12" /></Icon>
        </GlassButton>
      </div>
    </LiquidGlass>
  );
}

function mount() {
  if (window.top !== window.self || document.getElementById(ROOT_ID)) return;

  const style = document.createElement("style");
  style.textContent = `
    #pake-liquid-glass-root .relative { position: relative; }
    #pake-liquid-glass-root .bg-black { background: #000; }
    #pake-liquid-glass-root .pointer-events-none { pointer-events: none; }
    #pake-liquid-glass-root .opacity-0 { opacity: 0; }
    #pake-liquid-glass-root .opacity-20 { opacity: 0.2; }
    #pake-liquid-glass-root .opacity-100 { opacity: 1; }
    #pake-liquid-glass-root .mix-blend-overlay { mix-blend-mode: overlay; }
    #pake-liquid-glass-root .glass__warp { background: rgba(255, 255, 255, 0.42) !important; }
    #pake-liquid-glass-root .pake-glass-button svg,
    #pake-liquid-glass-root .pake-glass-button svg * { fill: none !important; stroke: currentColor !important; }
    #pake-liquid-glass-root .pake-glass-drag svg,
    #pake-liquid-glass-root .pake-glass-drag svg * { fill: currentColor !important; stroke: none !important; }
    .pake-glass-button { transition: background 160ms ease, color 160ms ease, transform 160ms ease; }
    .pake-glass-button:hover { background: rgba(255, 255, 255, 0.42) !important; transform: translateY(-1px); }
    .pake-glass-button:active { transform: translateY(0) scale(0.94); }
    .pake-glass-button:focus-visible { outline: 2px solid rgba(0, 122, 255, 0.8); outline-offset: 1px; }
    .pake-glass-close:hover { background: rgba(255, 59, 48, 0.9) !important; color: white !important; }
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.cssText = "position:fixed;left:50%;bottom:20px;width:320px;height:58px;transform:translateX(-50%);z-index:2147483647;user-select:none;-webkit-user-select:none;";
  document.body.appendChild(root);
  createRoot(root).render(<GlassToolbar />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
