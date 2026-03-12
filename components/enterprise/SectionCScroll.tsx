"use client";

/**
 * Section C: Full sticky-scroll story (Columbus Pro — GIS Made Effortless).
 * Drop-in from ColumbusScroll. Requires: framer-motion, tailwindcss.
 *
 * Fonts — ensure Sora + DM Sans are loaded (e.g. layout.tsx or globals.css):
 *   <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
 */

import { useEffect, useRef, useCallback } from "react";

// ─── helpers (pure, no deps) ─────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const norm  = (v: number, lo: number, hi: number) => clamp((v - lo) / (hi - lo), 0, 1);
const lerp  = (a: number, b: number, t: number)   => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn  = (t: number) => t * t * t;

function trackProgress(el: HTMLElement): number {
  const rect    = el.getBoundingClientRect();
  const scrolled = -rect.top;
  const total    = rect.height - window.innerHeight;
  return clamp(scrolled / total, 0, 1);
}

// ─── sub-components (pure markup, no animation state) ────────────────────────

function ArcGISMock() {
  return (
    <div className="w-full h-full grid overflow-hidden text-[10px] text-[#ccc]"
      style={{ background:"#2b2b35", gridTemplateRows:"36px 1fr", gridTemplateColumns:"180px 1fr 160px", fontFamily:"'DM Sans',sans-serif" }}>
      {/* toolbar */}
      <div className="col-span-3 flex items-center gap-2 px-[10px] text-[9px] text-[#aaa]"
        style={{ background:"linear-gradient(180deg,#3c3c50,#2e2e40)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
        <span className="opacity-70">ArcGIS Pro — coconut — Map1</span>
        <span className="ml-auto opacity-50">Not signed in</span>
      </div>
      {/* sidebar */}
      <div className="p-2 overflow-hidden" style={{ background:"#252530", borderRight:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-[9px] font-semibold text-[#aaa] mb-1">Contents</div>
        {[
          { color:"#5a8a5a", label:"coconut_Trees", active:true },
          { color:"#4a9a4a", label:"coconut_Stats" },
        ].map(({ color, label, active }) => (
          <div key={label} className={`flex items-center gap-1 text-[8px] rounded px-1 py-0.5 mb-0.5 ${active ? "bg-white/5 text-[#ddd]" : "text-[#999]"}`}>
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background:color }} />
            {label}
          </div>
        ))}
        <div className="text-[7px] text-[#777] mt-1 mb-0.5">MIN</div>
        {[
          { color:"#c0392b", label:"Needs Inspection" },
          { color:"#f39c12", label:"Relatively healthy" },
          { color:"#27ae60", label:"Healthy" },
          { color:"#2ecc71", label:"Thriving" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1 text-[8px] text-[#999] py-0.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background:color }} />
            {label}
          </div>
        ))}
      </div>
      {/* map */}
      <div className="relative overflow-hidden" style={{ background:"#2d3a2d" }}>
        <div className="absolute inset-0" style={{
          background:"radial-gradient(circle at 20% 30%,#3d6e3d 0%,transparent 15%),radial-gradient(circle at 50% 20%,#4a7a4a 0%,transparent 12%),radial-gradient(circle at 75% 40%,#3d6e3d 0%,transparent 18%),radial-gradient(circle at 30% 65%,#4a7a4a 0%,transparent 14%),radial-gradient(circle at 60% 70%,#3d6e3d 0%,transparent 16%),#2d3a2d"
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage:"radial-gradient(circle,rgba(255,100,50,0.8) 2px,transparent 2px),radial-gradient(circle,rgba(100,220,100,0.6) 2px,transparent 2px)",
          backgroundSize:"40px 40px,30px 30px",
          backgroundPosition:"10px 10px,25px 20px"
        }} />
        <span className="absolute top-2 left-2 opacity-40 text-5xl pointer-events-none">🕸</span>
        <span className="absolute bottom-2 right-2 opacity-40 text-5xl pointer-events-none rotate-180">🕸</span>
      </div>
      {/* catalog */}
      <div className="p-2 text-[8px] text-[#888]" style={{ background:"#252530", borderLeft:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-[9px] font-semibold text-[#aaa] mb-1">Catalog</div>
        {["📁 Maps","🔧 Toolboxes","🗄 Databases","🎨 Styles","🌐 Servers","📂 Folders"].map(s => (
          <div key={s} className="py-0.5">{s}</div>
        ))}
      </div>
    </div>
  );
}

function HoloDots() {
  return (
    <div className="absolute inset-0" style={{
      backgroundImage:"radial-gradient(circle,rgba(64,160,255,0.4) 2px,transparent 2px)",
      backgroundSize:"60px 60px",
      animation:"driftDots 8s linear infinite"
    }} />
  );
}

function ColumbusUI() {
  return (
    <div className="w-full overflow-hidden" style={{ display:"grid", gridTemplateColumns:"48px 260px 1fr", gridTemplateRows:"44px 1fr", background:"#f8f8fc", aspectRatio:"16/9", fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#444" }}>
      <div className="col-span-3 flex items-center gap-3 px-4 bg-white" style={{ borderBottom:"1px solid #e8e8f0" }}>
        <div className="flex items-center gap-1.5 font-bold text-[#2656c7] text-[13px]">
          <div className="w-[22px] h-[22px] rounded-[6px] bg-[#2656c7] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2"/></svg>
          </div>
          Columbus
        </div>
        <span className="text-[#999] text-[11px]">/ untitled chat</span>
        <div className="ml-auto flex gap-2">
          {["Report View","Save Mapshot"].map(s=>(
            <div key={s} className="px-3 py-1 rounded bg-[#f0f0f8] border border-[#ddd] text-[10px] text-[#555]">{s}</div>
          ))}
          <div className="px-3 py-1 rounded bg-[#2656c7] text-white text-[10px]">Edits not saved</div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-3 gap-4 bg-white" style={{ borderRight:"1px solid #e8e8f0" }}>
        {["⊞","🔍","✏️","📋"].map((ic,i)=>(
          <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${i===1?"bg-[#2656c7]":"bg-[#f0f0f8]"}`}>{ic}</div>
        ))}
      </div>
      <div className="p-3 bg-white" style={{ borderRight:"1px solid #e8e8f0" }}>
        <div className="text-[10px] font-semibold text-[#555]">Where should we begin?</div>
      </div>
      <div className="relative overflow-hidden" style={{ background:"#dce6f0" }}>
        <div className="absolute inset-0" style={{
          background:"repeating-linear-gradient(90deg,rgba(200,210,230,0.6) 0,rgba(200,210,230,0.6) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(180deg,rgba(200,210,230,0.6) 0,rgba(200,210,230,0.6) 1px,transparent 1px,transparent 40px),#dce6f0"
        }}/>
        <div className="absolute text-[7px] font-semibold text-[#666]" style={{ top:"38%", left:"12%" }}>WESLEY HEIGHTS</div>
        <div className="absolute text-[7px] font-semibold text-[#666]" style={{ top:"55%", right:"8%" }}>CHARLOTTE CENTER CITY</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SectionCScroll() {
  // Track refs
  const trackA   = useRef<HTMLDivElement>(null);
  const trackB   = useRef<HTMLDivElement>(null);
  const trackC   = useRef<HTMLDivElement>(null);
  const trackD   = useRef<HTMLDivElement>(null);
  const trackE   = useRef<HTMLDivElement>(null);
  const trackF   = useRef<HTMLDivElement>(null);
  const trackG   = useRef<HTMLDivElement>(null);
  const trackH   = useRef<HTMLDivElement>(null);
  const trackIJ  = useRef<HTMLDivElement>(null);
  const trackLM  = useRef<HTMLDivElement>(null);

  // Animated element refs
  const refAText    = useRef<HTMLParagraphElement>(null);
  const refBHl      = useRef<HTMLDivElement>(null);
  const refBImg     = useRef<HTMLDivElement>(null);
  const refCContent = useRef<HTMLDivElement>(null);
  const refCWords   = useRef<(HTMLSpanElement | null)[]>([]);
  const refDGif     = useRef<HTMLDivElement>(null);
  const refDText    = useRef<HTMLDivElement>(null);
  const refDChars   = useRef<(HTMLSpanElement | null)[]>([]);
  const refEWords   = useRef<(HTMLSpanElement | null)[]>([]);
  const refFImg     = useRef<HTMLDivElement>(null);
  const refFTxt     = useRef<HTMLDivElement>(null);
  const refGQuote   = useRef<HTMLQuoteElement>(null);
  const refGAttr    = useRef<HTMLDivElement>(null);
  const refHLabels  = useRef<HTMLDivElement>(null);
  const refHPanels  = useRef<HTMLDivElement>(null);
  const refIJBg     = useRef<HTMLDivElement>(null);
  const refIJGif    = useRef<HTMLDivElement>(null);
  const refIJOverlay= useRef<HTMLDivElement>(null);
  const refIJHl     = useRef<HTMLParagraphElement>(null);
  const refIJSub    = useRef<HTMLParagraphElement>(null);
  const refLMGifWrap= useRef<HTMLDivElement>(null);
  const refLMGif    = useRef<HTMLDivElement>(null);
  const refLMWords  = useRef<(HTMLSpanElement | null)[]>([]);
  const refLMSub    = useRef<(HTMLSpanElement | null)[]>([]);

  const PHRASE_D = "So we said bye to the noise";

  const update = useCallback(() => {
    const s = (el: HTMLElement | null, props: Record<string, string>) => {
      if (!el) return;
      Object.assign(el.style, props);
    };

    // ── A ──
    if (trackA.current && refAText.current) {
      const p = trackProgress(trackA.current);
      const op = easeOut(norm(p,0,0.3)) * (1 - easeIn(norm(p,0.6,1.0)));
      s(refAText.current, { opacity: String(op), transform: `translateY(${lerp(30,0,easeOut(norm(p,0,0.3)))}px)` });
    }

    // ── B ──
    if (trackB.current && refBHl.current && refBImg.current) {
      const p  = trackProgress(trackB.current);
      const bIn = easeOut(norm(p,0,0.25));
      s(refBHl.current,  { opacity: String(bIn), transform: `translateY(${lerp(60,0,bIn)}px)` });
      s(refBImg.current, { opacity: String(bIn), transform: `translateY(${lerp(120,0,bIn)}px) scale(${lerp(1.5,1.0,bIn)})` });
      if (p > 0.65) {
        const bOut = easeIn(norm(p,0.65,1.0));
        s(refBHl.current,  { opacity: String(1-bOut), transform: `translateY(${lerp(0,-80,bOut)}px)` });
        s(refBImg.current, { opacity: String(1-bOut), transform: `translateY(${lerp(0,-48,bOut)}px) scale(${lerp(1.0,0.7,bOut)})` });
      }
    }

    // ── C ──
    if (trackC.current && refCContent.current) {
      const p = trackProgress(trackC.current);
      const cIn = easeOut(norm(p,0,0.06));
      s(refCContent.current, { opacity: String(cIn), transform: `translateY(${lerp(30,0,cIn)}px)` });

      const wordPhases: [number,number][] = [[0,0.08],[0.10,0.18],[0.20,0.28],[0.30,0.38],[0.42,0.52]];
      refCWords.current.forEach((w, i) => {
        if (!w) return;
        const [es, ee] = wordPhases[i];
        const xs = i < 4 ? wordPhases[i+1][0] - 0.01 : 0.82;
        const xe = i < 4 ? wordPhases[i+1][0] + 0.05 : 0.92;
        const tIn  = easeOut(norm(p,es,ee));
        const tOut = i < 4 ? easeIn(norm(p,xs,xe)) : 0;
        s(w, { opacity: String(clamp(tIn-tOut,0,1)), transform: `translateY(${lerp(24,0,tIn)+lerp(0,-24,tOut)}px)` });
      });
      if (p > 0.88) {
        const ex = easeIn(norm(p,0.88,1.0));
        const cur = parseFloat(refCContent.current.style.opacity||"1");
        s(refCContent.current, { opacity: String(Math.min(cur, 1-ex)) });
      }
    }

    // ── D ──
    if (trackD.current && refDGif.current && refDText.current) {
      const p = trackProgress(trackD.current);
      const dGifIn = easeOut(norm(p,0,0.12));
      s(refDGif.current,  { opacity: String(dGifIn), transform: `translateY(${lerp(30,0,dGifIn)}px)` });
      s(refDText.current, { opacity: String(easeOut(norm(p,0.08,0.2))) });
      if (p > 0.45) {
        const dOut = easeIn(norm(p,0.45,0.55));
        s(refDGif.current, { opacity: String(Math.max(0, dGifIn-dOut)) });
      }
      const peelT = norm(p,0.52,1.0);
      const mid   = Math.floor(PHRASE_D.length/2);
      refDChars.current.forEach((span,i) => {
        if (!span) return;
        const dist = Math.min(i, PHRASE_D.length-1-i);
        const thr  = (dist/mid)*0.85;
        span.style.opacity = String(clamp(1-norm(peelT, thr, thr+0.15),0,1));
      });
    }

    // ── E ──
    if (trackE.current) {
      const p = trackProgress(trackE.current);
      const thresholds = [0.0,0.12,0.22,0.32,0.42];
      refEWords.current.forEach((w,i) => {
        if (!w) return;
        const t = easeOut(norm(p, thresholds[i], thresholds[i]+0.12));
        s(w, { opacity: String(t), transform: `translateY(${lerp(30,0,t)}px)` });
      });
    }

    // ── F ──
    if (trackF.current && refFImg.current && refFTxt.current) {
      const p = trackProgress(trackF.current);
      const fImg = easeOut(norm(p,0,0.25));
      s(refFImg.current, { opacity: String(fImg), transform: `translateY(${lerp(80,0,fImg)}px) scale(${lerp(0.35,1,fImg)})` });
      const fTxt = easeOut(norm(p,0.2,0.38));
      s(refFTxt.current, { opacity: String(fTxt), transform: `translateY(${lerp(30,0,fTxt)}px)` });
    }

    // ── G ──
    if (trackG.current && refGQuote.current && refGAttr.current) {
      const p  = trackProgress(trackG.current);
      const gIn = easeOut(norm(p,0,0.22));
      s(refGQuote.current, { opacity: String(gIn) });
      s(refGAttr.current,  { opacity: String(easeOut(norm(p,0.1,0.3))) });
      if (p > 0.70) {
        const gOut = easeIn(norm(p,0.70,0.88));
        s(refGQuote.current, { opacity: String(Math.max(0, gIn*(1-gOut))) });
        s(refGAttr.current,  { opacity: String(Math.max(0, gIn*(1-gOut))) });
      }
    }

    // ── H ──
    if (trackH.current && refHLabels.current && refHPanels.current) {
      const p  = trackProgress(trackH.current);
      const hIn = easeOut(norm(p,0,0.22));
      s(refHLabels.current, { opacity: String(hIn), transform: `translateY(${lerp(60,0,hIn)}px)` });
      s(refHPanels.current, { opacity: String(hIn), transform: `translateY(${lerp(80,0,hIn)}px)` });
    }

    // ── IJ ──
    if (trackIJ.current && refIJGif.current && refIJBg.current && refIJOverlay.current && refIJHl.current && refIJSub.current) {
      const p   = trackProgress(trackIJ.current);
      const vw  = window.innerWidth;
      const vh  = window.innerHeight;

      // overlay
      s(refIJOverlay.current, { opacity: String(Math.max(0, 1-easeOut(norm(p,0,0.18))*1.2)) });
      // headline fade in
      s(refIJHl.current, { opacity: String(easeOut(norm(p,0.10,0.28))) });

      // shrink phase
      const shrinkT = easeOut(norm(p,0.35,0.68));
      const cardW   = Math.min(vw*0.48, 520);
      const cardH   = cardW*(9/16);
      const gifW    = lerp(vw, cardW, shrinkT);
      const gifH    = lerp(vh, cardH, shrinkT);
      const gifTop  = lerp(0, vh*0.12, shrinkT);
      const gifLeft = (vw-gifW)/2;

      Object.assign(refIJGif.current.style, {
        width:        gifW+"px",
        height:       gifH+"px",
        left:         gifLeft+"px",
        top:          gifTop+"px",
        borderRadius: lerp(0,18,shrinkT)+"px",
        boxShadow:    shrinkT>0.1 ? `0 ${lerp(0,30,shrinkT)}px ${lerp(0,80,shrinkT)}px rgba(0,0,0,${lerp(0,0.35,shrinkT)})` : "none",
      });

      // bg colour
      s(refIJBg.current, { background: `rgb(${Math.round(lerp(0,240,shrinkT))},${Math.round(lerp(0,236,shrinkT))},${Math.round(lerp(0,228,shrinkT))})` });

      // headline position + colour
      const hlY = lerp(vh/2, gifTop+gifH+20, shrinkT);
      Object.assign(refIJHl.current.style, {
        color:     `rgb(${Math.round(lerp(190,74,shrinkT))},${Math.round(lerp(220,144,shrinkT))},${Math.round(lerp(255,217,shrinkT))})`,
        fontSize:  `clamp(18px,${lerp(3.5,2.2,shrinkT)}vw,${lerp(48,28,shrinkT)}px)`,
        top:       hlY+"px",
        left:      "50%",
        transform: "translateX(-50%)",
      });

      // subtitle
      const subIn = easeOut(norm(p,0.68,0.85));
      Object.assign(refIJSub.current.style, {
        opacity:   String(subIn),
        top:       (gifTop+gifH+lerp(60,80,shrinkT))+"px",
        left:      "50%",
        transform: `translateX(-50%) translateY(${lerp(20,0,subIn)}px)`,
      });
    }

    // ── LM ──
    if (trackLM.current && refLMGifWrap.current && refLMGif.current) {
      const p    = trackProgress(trackLM.current);
      const gifW = lerp(140, 400, easeOut(norm(p,0,0.2)));
      s(refLMGifWrap.current, { opacity: String(easeOut(norm(p,0,0.15))) });
      Object.assign(refLMGif.current.style, { width: gifW+"px", height: Math.round(gifW*9/16)+"px" });

      const wThresh = [0.22,0.30,0.37];
      refLMWords.current.forEach((w,i) => {
        if (!w) return;
        const t = easeOut(norm(p, wThresh[i], wThresh[i]+0.1));
        s(w, { opacity: String(t), transform: `translateY(${lerp(40,0,t)}px)` });
      });
      const sThresh = [0.48,0.54,0.60,0.66];
      refLMSub.current.forEach((w,i) => {
        if (!w) return;
        const t = easeOut(norm(p, sThresh[i], sThresh[i]+0.08));
        s(w, { opacity: String(t), transform: `translateY(${lerp(25,0,t)}px)` });
      });
    }
  }, []);

  useEffect(() => {
    let raf = false;
    const onScroll = () => { if (!raf) { raf=true; requestAnimationFrame(()=>{ raf=false; update(); }); } };
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); };
  }, [update]);

  // Shared stage classes — sticky viewport; content is centered via inner wrapper
  const stage = "sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center";
  const centerPin = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <>
      {/* inject keyframe for drifting dots */}
      <style>{`
        @keyframes driftDots { from { background-position: 0 0; } to { background-position: 60px 60px; } }
        @keyframes holoSpin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ══ A ══ */}
      <section id="secA" className="relative bg-black">
        <div ref={trackA} style={{ height:"180vh" }}>
          <div className={stage + " bg-black"}>
            <div className={centerPin}>
              <p ref={refAText} className="text-center font-light text-white/90"
                style={{ fontSize:"clamp(18px,2.5vw,28px)", letterSpacing:"-0.01em", willChange:"opacity,transform" }}>
                We&apos;ve simplified your GIS life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ B ══ */}
      <section id="secB" className="relative bg-black">
        <div ref={trackB} style={{ height:"280vh" }}>
          <div className={stage + " bg-black"}>
            <div className={centerPin + " flex flex-col items-center gap-8"}>
              <div ref={refBHl} className="text-center text-white/75 font-normal"
                style={{ fontSize:"clamp(20px,3vw,36px)", letterSpacing:"-0.02em", willChange:"opacity,transform" }}>
                This is your Legacy GIS
              </div>
              <div ref={refBImg} className="flex items-center justify-center" style={{ willChange:"opacity,transform" }}>
                <div className="rounded-xl overflow-hidden border border-white/10"
                  style={{ width:"clamp(300px,60vw,740px)", aspectRatio:"16/10", boxShadow:"0 40px 120px rgba(0,0,0,0.9)", background:"#1a1a1a" }}>
                  <ArcGISMock />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ C ══ */}
      <section id="secC" className="relative bg-black">
        <div ref={trackC} style={{ height:"380vh" }}>
          <div className={stage + " bg-black"}>
            <div className={centerPin}>
              <div ref={refCContent} className="flex items-baseline gap-4" style={{ willChange:"opacity,transform" }}>
                <span className="text-white/85 font-normal whitespace-nowrap"
                  style={{ fontSize:"clamp(22px,3vw,38px)", letterSpacing:"-0.02em" }}>
                  Legacy GIS is
                </span>
                <div className="relative" style={{ height:"clamp(40px,5vw,60px)", minWidth:280 }}>
                  {["bulky,","poorly designed,","lame, complex,","high-storage occupying,","limited"].map((word, i) => (
                    <span key={i} ref={el => { if(el) refCWords.current[i]=el; }}
                      className="absolute left-0 top-0 font-semibold italic"
                      style={{ fontSize:"clamp(22px,3vw,38px)", color:"#c0392b", letterSpacing:"-0.02em", willChange:"opacity,transform", whiteSpace:"nowrap" }}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ D ══ */}
      <section id="secD" className="relative bg-white">
        <div ref={trackD} style={{ height:"340vh" }}>
          <div className={stage + " bg-white"}>
            <div className={centerPin + " flex flex-col items-center"} style={{ gap:0 }}>
              <div ref={refDGif} style={{ willChange:"opacity,transform", marginBottom:-20 }}>
              <div className="rounded-2xl overflow-hidden relative"
                style={{ width:"clamp(240px,40vw,520px)", aspectRatio:"16/10", background:"#111", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
                <div className="w-full h-full relative flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#0a1628,#1a2a4a)" }}>
                  <HoloDots />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative z-10 w-[55%] h-[85%]"
                      style={{ background:"linear-gradient(180deg,#3a3a3a,#2a2a2a)", clipPath:"polygon(15% 0%,85% 0%,100% 8%,100% 100%,0% 100%,0% 8%)" }} />
                  </div>
                  {[{w:80,h:80,t:"20%",r:"8%",dur:"3s"},{w:50,h:50,t:"30%",r:"12%",dur:"2s"}].map((c,i)=>(
                    <div key={i} className="absolute rounded-full border-2 border-[rgba(64,160,255,0.5)]"
                      style={{ width:c.w, height:c.h, top:c.t, right:c.r, animation:`holoSpin ${c.dur} linear infinite${i===1?" reverse":""}` }} />
                  ))}
                </div>
              </div>
            </div>
            <div ref={refDText} className="text-center font-bold text-[#111]"
              style={{ fontSize:"clamp(24px,4vw,52px)", letterSpacing:"-0.04em", willChange:"opacity" }}>
              {[...PHRASE_D].map((ch, i) => (
                <span key={i} ref={el => { if(el) refDChars.current[i]=el; }}>{ch}</span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ══ E ══ */}
      <section id="secE" className="relative bg-white">
        <div ref={trackE} style={{ height:"220vh" }}>
          <div className={stage + " bg-white"}>
            <div className={centerPin}>
              <h2 className="text-center font-extrabold text-[#111]"
                style={{ fontSize:"clamp(36px,6vw,86px)", letterSpacing:"-0.05em", lineHeight:1 }}>
                {["And ","hello ","to ","the ","new"].map((word,i) => (
                  <span key={i} ref={el => { if(el) refEWords.current[i]=el; }}
                    className="inline-block" style={{ opacity:0, willChange:"opacity,transform" }}>
                    {word}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ══ F ══ */}
      <section id="secF" className="relative" style={{ background:"#f5f5f0" }}>
        <div ref={trackF} style={{ height:"280vh" }}>
          <div className={stage} style={{ background:"#f5f5f0" }}>
            <div className={centerPin + " flex flex-col items-center justify-end w-full max-w-[90vw]"} style={{ paddingBottom:56 }}>
              <div ref={refFImg} className="flex items-start justify-center w-full"
                style={{ willChange:"opacity,transform" }}>
                <div className="rounded-2xl overflow-hidden border border-black/8"
                  style={{ width:"60vw", maxWidth:760, boxShadow:"0 30px 80px rgba(0,0,0,0.15)", background:"#fff" }}>
                  <ColumbusUI />
                </div>
              </div>
              <div ref={refFTxt} className="relative z-10 w-full px-[4vw] text-left" style={{ willChange:"opacity,transform" }}>
              <div className="font-semibold text-[#2656c7]" style={{ fontSize:"clamp(14px,1.5vw,18px)" }}>Columbus Pro</div>
              <div className="font-extrabold text-[#111]" style={{ fontSize:"clamp(44px,7vw,96px)", letterSpacing:"-0.05em", lineHeight:"0.95" }}>
                GIS made effortless
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ G ══ */}
      <section id="secG" className="relative" style={{ background:"#f0ece4" }}>
        <div ref={trackG} style={{ height:"180vh" }}>
          <div className={stage} style={{ background:"#f0ece4" }}>
            <div className={centerPin + " flex flex-col items-center gap-3"}>
              <blockquote ref={refGQuote}
                className="font-bold text-[#111] text-center max-w-2xl"
                style={{ fontSize:"clamp(20px,2.8vw,36px)", letterSpacing:"-0.03em", lineHeight:1.3, willChange:"opacity" }}>
                &quot;Think of Columbus as ArcGIS and your best Data-scientist combined into one&quot;
              </blockquote>
              <div ref={refGAttr} className="text-center text-[#555] flex items-center gap-2 justify-center"
                style={{ fontSize:"clamp(14px,1.5vw,18px)", willChange:"opacity" }}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8a6a4a] to-[#5a4030] flex items-center justify-center text-sm">👤</div>
                — Erick Lara
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ H ══ */}
      <section id="secH" className="relative" style={{ background:"#f0ece4" }}>
        <div ref={trackH} style={{ height:"240vh" }}>
          <div className={stage} style={{ background:"#f0ece4" }}>
            <div className={centerPin + " flex flex-col items-center gap-8"}>
              <div ref={refHLabels} className="flex items-center gap-12" style={{ willChange:"opacity,transform" }}>
              <span className="font-medium text-[#888]" style={{ fontSize:"clamp(14px,1.8vw,22px)", letterSpacing:"-0.02em" }}>Complex GeoCoding</span>
              <span className="text-[#888] text-xl">——→</span>
              <span className="font-bold text-[#111]" style={{ fontSize:"clamp(14px,1.8vw,22px)", letterSpacing:"-0.02em" }}>Simple Language prompts</span>
            </div>
            <div ref={refHPanels} className="flex gap-4" style={{ width:"clamp(300px,75vw,900px)", willChange:"opacity,transform" }}>
              {/* Old — route manifest */}
              <div className="flex-1 rounded-2xl overflow-hidden" style={{ aspectRatio:"4/3", background:"linear-gradient(160deg,#1a1a2e,#0d0d1a)", padding:12 }}>
                <div className="text-[10px] font-bold text-[#aaa] mb-2">Route Manifest</div>
                {["Route 93 · Monday · Folder 20","03-1463 · Stop 4 · Seq: 12"].map(r=>(
                  <div key={r} className="flex gap-2 mb-1">
                    {r.split("·").map(c=>(
                      <div key={c} className="flex-1 text-[7px] text-[#888] rounded px-1 py-0.5" style={{ background:"rgba(255,255,255,0.05)" }}>{c.trim()}</div>
                    ))}
                  </div>
                ))}
                <div className="text-[7px] text-[#666] mt-2 leading-relaxed">
                  Travel N on Main St<br/>Turn right onto Olive St<br/>Travel on Olive St for 0.56 miles<br/>Turn right onto 3rd Ave<br/>Turn left onto Avenue Blvd...
                </div>
              </div>
              {/* New — Columbus AI */}
              <div className="flex-1 rounded-2xl overflow-hidden flex flex-col gap-2 p-4" style={{ aspectRatio:"4/3", background:"linear-gradient(160deg,#e8f4e8,#f0f8f0)", border:"1px solid rgba(0,0,0,0.08)" }}>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#2656c7]">
                  <div className="w-4 h-4 rounded bg-[#2656c7]" />
                  Columbus is thinking...
                </div>
                <div className="flex flex-col gap-1">
                  {["Considering demographics of Miami","Considering lot prices","Considering trade area competition","Considering your customer target"].map(t=>(
                    <div key={t} className="text-[8px] text-[#888] pl-2" style={{ borderLeft:"2px solid #ddd" }}>{t}</div>
                  ))}
                </div>
                <div className="mt-auto bg-white rounded-xl p-2 text-[8px] text-[#333] shadow border border-[#eee] leading-relaxed">
                  Where best to open a new branch of my business. We&apos;re a local family owned car wash, and would like to expand to another state.
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ IJ ══ unified */}
      <section id="secIJ" className="relative bg-black">
        <div ref={trackIJ} style={{ height:"480vh" }}>
          <div className={stage} style={{ background:"transparent" }}>
            {/* animated background colour */}
            <div ref={refIJBg} className="absolute inset-0 pointer-events-none" style={{ zIndex:0 }} />
            {/* gif container — position/size driven by JS */}
            <div ref={refIJGif} className="absolute overflow-hidden" style={{ zIndex:1 }}>
              <div className="w-full h-full relative flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,#0a1628,#1a2a4a)" }}>
                <HoloDots />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[40%] max-w-[500px]" style={{ aspectRatio:"3/4", background:"linear-gradient(180deg,#3a3a3a,#222)", clipPath:"polygon(12% 0%,88% 0%,100% 6%,100% 100%,0% 100%,0% 6%)" }} />
                </div>
                {[{w:80,h:80,t:"20%",r:"8%"},{w:50,h:50,t:"30%",r:"14%",rev:true}].map((c,i)=>(
                  <div key={i} className="absolute rounded-full border-2 border-[rgba(64,160,255,0.5)]"
                    style={{ width:c.w, height:c.h, top:c.t, right:c.r, animation:`holoSpin 3s linear infinite${c.rev?" reverse":""}` }} />
                ))}
              </div>
              <div ref={refIJOverlay} className="absolute inset-0 pointer-events-none" style={{ background:"rgba(0,0,0,0.85)", zIndex:2 }} />
            </div>
            {/* headline */}
            <p ref={refIJHl} className="absolute font-bold text-center whitespace-nowrap z-[5]"
              style={{ letterSpacing:"-0.03em", opacity:0, willChange:"opacity,color,fontSize,top,transform" }}>
              This is Columbus at work.
            </p>
            {/* subtitle */}
            <p ref={refIJSub} className="absolute text-center font-bold text-[#111] z-[5]"
              style={{ fontSize:"clamp(18px,2.5vw,32px)", letterSpacing:"-0.03em", lineHeight:1.3, opacity:0, willChange:"opacity,transform" }}>
              It sees everything all at once,<br/>so you don&apos;t have to.
            </p>
          </div>
        </div>
      </section>

      {/* ══ K — normal scroll, no sticky ══ */}
      <section id="secK" className="flex flex-col items-center justify-center gap-14 py-28 px-10" style={{ background:"#f0ece4", minHeight:"100vh" }}>
        <p className="text-center text-[#555] max-w-lg leading-relaxed" style={{ fontSize:"clamp(20px,2.5vw,30px)", letterSpacing:"-0.02em" }}>
          We&apos;ve also added abilities that will make<br/>
          your work <strong className="font-bold text-[#111]">faster,</strong> and your life{" "}
          <em className="not-italic font-bold text-[#2656c7]">easier.</em>
        </p>
        <div className="flex flex-wrap gap-12 justify-center">
          {[
            { emoji:"🚀", bg:"from-[#3d6e3d] to-[#4a7a4a]", label:"Data Catalogue" },
            { emoji:"🧭", bg:"from-[#2a3a5a] to-[#3a4a6a]", label:"Predictive Datasets" },
            { emoji:"🗺",  bg:"from-[#d4a020] to-[#e06020]", label:"Creative Heatmaps" },
            { emoji:"🔬", bg:"from-[#4a5a8a] to-[#5a6a9a]", label:"AI Research Audits" },
          ].map(({ emoji, bg, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 w-[120px]">
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-4xl border-2 border-black/8 shadow-lg`}>
                {emoji}
              </div>
              <div className="text-[13px] font-semibold text-[#333] text-center leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LM ══ */}
      <section id="secLM" className="relative bg-white">
        <div ref={trackLM} style={{ height:"340vh" }}>
          <div className={stage + " bg-white"}>
            <div className={centerPin + " flex flex-col items-center justify-center px-[8vw]"} style={{ width:"100%", maxWidth:"90vw" }}>
            <div ref={refLMGifWrap} style={{ willChange:"opacity", marginBottom:32 }}>
              <div ref={refLMGif} className="rounded-2xl overflow-hidden"
                style={{ width:140, height:Math.round(140*9/16), background:"#111", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
                <div className="w-full h-full relative flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#0d1a2e,#1a2a4a)" }}>
                  <HoloDots />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-1/2 h-4/5" style={{ background:"linear-gradient(180deg,#3a3a3a,#252525)", clipPath:"polygon(12% 0%,88% 0%,100% 8%,100% 100%,0% 100%,0% 8%)" }} />
                  </div>
                </div>
              </div>
            </div>
            {/* headline */}
            <div className="flex flex-wrap gap-x-4 items-baseline mb-2">
              {[{word:"Use",color:"#111"},{word:"Columbus",color:"#2656c7"},{word:"Pro,",color:"#2656c7"}].map(({word,color},i)=>(
                <span key={i} ref={el=>{if(el)refLMWords.current[i]=el;}}
                  className="inline-block font-extrabold"
                  style={{ fontSize:"clamp(48px,8vw,108px)", letterSpacing:"-0.05em", lineHeight:1, color, opacity:0, willChange:"opacity,transform" }}>
                  {word}
                </span>
              ))}
            </div>
            {/* sub */}
            <div className="flex flex-wrap gap-x-3 items-baseline">
              {["find","your","targets","faster."].map((word,i)=>(
                <span key={i} ref={el=>{if(el)refLMSub.current[i]=el;}}
                  className="inline-block font-medium text-[#555]"
                  style={{ fontSize:"clamp(24px,3.5vw,48px)", letterSpacing:"-0.03em", opacity:0, willChange:"opacity,transform" }}>
                  {word}
                </span>
              ))}
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
