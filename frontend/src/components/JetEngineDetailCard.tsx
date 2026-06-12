'use client';

import { CSSProperties, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Spec {
  label: string;
  value: string;
  icon?: string;
  unit?: string;
}

interface RelatedEngine {
  _id: string;
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  thrust?: string;
  usedIn?: string;
  status?: string;
  imageUrl?: string;
}

interface JetEngineDetailCardProps {
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  type: string;
  description: string;
  maxThrustWithAB?: string;
  dryThrust?: string;
  usedIn?: string;
  specs: Spec[];
  imageUrl: string;
  generatedImages?: string[];
  relatedEngines?: RelatedEngine[];
  onViewDatasheet?: () => void;
}

const cssVars = {
  '--bg': '#0a0505',
  '--card': '#160808',
  '--card-2': '#1f0a0a',
  '--border': '#2a1010',
  '--fg': '#ededed',
  '--muted': '#a1a1aa',
  '--primary': '#ef4444',
  '--primary-glow': '#dc2626',
} as CSSProperties;

export default function JetEngineDetailCard({
  id,
  name,
  manufacturer,
  origin,
  type,
  description,
  maxThrustWithAB = '0',
  dryThrust = '0',
  usedIn = 'Unknown',
  specs,
  imageUrl,
  generatedImages,
  relatedEngines = [],
  onViewDatasheet,
}: JetEngineDetailCardProps) {
  const router = useRouter();

  const galleryImages = generatedImages && generatedImages.length > 0 ? generatedImages : [imageUrl];
  const [imgIndex, setImgIndex] = useState(0);
  const currentImage = galleryImages[imgIndex];

  const nextImg = () => setImgIndex((p) => (p + 1) % galleryImages.length);
  const prevImg = () => setImgIndex((p) => (p - 1 + galleryImages.length) % galleryImages.length);

  const handleRelatedEngineClick = (engineId: string) => {
    router.push(`/jet-engines/${encodeURIComponent(engineId)}`);
  };

  return (
    <div style={{ ...cssVars, background: 'var(--bg)' } as CSSProperties} className="min-h-screen">
      <style>{`
        :root {
          --bg: #0a0505;
          --card: #160808;
          --card-2: #1f0a0a;
          --border: #2a1010;
          --fg: #ededed;
          --muted: #a1a1aa;
          --primary: #ef4444;
          --primary-glow: #dc2626;
          --gradient-ember: linear-gradient(135deg, #ef4444, #dc2626);
          --gradient-surface: linear-gradient(160deg, #1f0a0a, #0a0505);
          --shadow-ember: 0 20px 60px -20px rgba(239, 68, 68, 0.35);
          --shadow-deep: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
        }
        * {
          box-sizing: border-box;
        }
        body {
          background: var(--bg);
          color: var(--fg);
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.01em;
        }
        .wrap {
          max-width: 1600px;
          margin: 0 auto;
          padding: 48px 20px;
        }
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--muted);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
        .status-pill {
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
          color: var(--primary);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 10px;
          letter-spacing: 0.2em;
        }
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--gradient-surface);
          box-shadow: var(--shadow-deep);
        }
        .glow {
          position: absolute;
          right: -120px;
          top: -120px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: var(--gradient-ember);
          opacity: 0.25;
          filter: blur(80px);
          pointer-events: none;
        }
        .grid-main {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 0;
        }
        @media (max-width: 900px) {
          .grid-main {
            grid-template-columns: 1fr;
          }
        }
        .imgwrap {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: linear-gradient(135deg, #1f0a0a, #0a0505);
          border-right: 1px solid var(--border);
        }
        @media (max-width: 900px) {
          .imgwrap {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
        .imgwrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .img-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--card), transparent 60%);
        }
        .id-tag {
          position: absolute;
          left: 24px;
          top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(10px);
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          color: #fff;
        }
        .thrust-badge {
          position: absolute;
          bottom: 24px;
          left: 24px;
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: rgba(10, 5, 5, 0.7);
          backdrop-filter: blur(10px);
          padding: 12px 20px;
          border-radius: 16px;
          box-shadow: var(--shadow-ember);
        }
        .thrust-badge .lbl {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--primary);
        }
        .thrust-badge .val {
          margin-top: 2px;
          font-size: 24px;
          font-weight: 700;
          font-family: 'Space Grotesk';
        }
        .info {
          padding: 40px;
        }
        @media (max-width: 600px) {
          .info {
            padding: 28px;
          }
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        h1.name {
          margin-top: 12px;
          font-size: 34px;
          font-weight: 700;
          line-height: 1.1;
        }
        .meta-row {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px 20px;
          font-size: 12px;
          color: var(--muted);
        }
        .meta-row span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .desc {
          margin-top: 22px;
          font-size: 14px;
          line-height: 1.65;
          color: var(--muted);
        }
        .divider {
          margin-top: 28px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--border), transparent);
        }
        .thrust-row {
          margin-top: 24px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .thrust-row .lbl {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--muted);
        }
        .thrust-big {
          margin-top: 4px;
          font-family: 'Space Grotesk';
          font-size: 48px;
          font-weight: 700;
          background: var(--gradient-ember);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1;
        }
        .thrust-unit {
          margin-left: 6px;
          font-size: 14px;
          color: var(--muted);
        }
        .btn {
          padding: 11px 22px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: var(--gradient-ember);
          color: #161217;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          box-shadow: var(--shadow-ember);
          transition: transform 0.2s;
        }
        .btn:hover {
          transform: scale(1.04);
        }
        .specs {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1px;
          background: var(--border);
          border-top: 1px solid var(--border);
        }
        @media (max-width: 900px) {
          .specs {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 520px) {
          .specs {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .spec {
          background: var(--card);
          padding: 20px;
          transition: background 0.2s;
        }
        .spec:hover {
          background: var(--card-2);
        }
        .spec .icon {
          width: 18px;
          height: 18px;
          color: var(--primary);
        }
        .spec .lbl {
          margin-top: 12px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .spec .val {
          margin-top: 4px;
          font-family: 'Space Grotesk';
          font-size: 20px;
          font-weight: 600;
        }
        .spec .unit {
          margin-left: 4px;
          font-size: 12px;
          color: var(--muted);
          font-weight: 400;
        }
        .foot {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: var(--muted);
        }
        .related-head {
          margin: 64px 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .related-head h2 {
          font-size: 26px;
          font-weight: 700;
          margin-top: 8px;
        }
        .rel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .rel-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .rel-grid {
            grid-template-columns: 1fr;
          }
        }
        .rcard {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--gradient-surface);
          transition: transform 0.3s, border-color 0.3s;
          cursor: pointer;
        }
        .rcard:hover {
          transform: translateY(-4px);
          border-color: rgba(239, 68, 68, 0.4);
        }
        .rcard .imgbox {
          position: relative;
          aspect-ratio: 5/4;
          overflow: hidden;
        }
        .rcard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .rcard:hover img {
          transform: scale(1.06);
        }
        .rcard .imgbox::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--card), transparent 60%);
        }
        .rcard .body {
          padding: 20px;
          position: relative;
        }
        .rcard h3 {
          font-size: 17px;
          font-weight: 600;
          margin-top: 8px;
        }
        .rcard .mfg {
          margin-top: 4px;
          font-size: 12px;
          color: var(--muted);
        }
        .rstats {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .rstats .lbl {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .rstats .thr {
          margin-top: 2px;
          font-family: 'Space Grotesk';
          font-size: 22px;
          font-weight: 700;
          background: var(--gradient-ember);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .rstats .thr-u {
          font-size: 11px;
          color: var(--muted);
          margin-left: 4px;
        }
        .rstats .right {
          text-align: right;
        }
        .rstats .right .val {
          margin-top: 2px;
          font-size: 12px;
          font-weight: 500;
        }
        .cta {
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          transition: color 0.2s;
        }
        .rcard:hover .cta {
          color: var(--primary);
        }
      `}</style>

      <div className="wrap">
        {/* Top bar */}
        <div className="topbar">
          <div><span className="dot"></span>Engine Database</div>
          <span className="status-pill">In Development</span>
        </div>

        {/* Main card */}
        <article className="card">
          <div className="glow"></div>
          <div className="grid-main">
            {/* Image section */}
            <div className="imgwrap">
              <img src={currentImage} alt={name} />
              <div className="img-fade"></div>
              <div className="id-tag"><span className="dot" style={{ margin: 0 }}></span>ID · {id}</div>
              <div className="thrust-badge">
                <div className="lbl">Max Thrust w/ AB</div>
                <div className="val">{maxThrustWithAB}</div>
              </div>

              {/* Gallery controls */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Previous image"
                    style={{
                      position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1,
                    }}
                  >‹</button>
                  <button
                    onClick={nextImg}
                    aria-label="Next image"
                    style={{
                      position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1,
                    }}
                  >›</button>
                  <div style={{
                    position: 'absolute', bottom: 24, right: 24, display: 'flex', gap: 6,
                  }}>
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImgIndex(idx)}
                        aria-label={`Image ${idx + 1}`}
                        style={{
                          width: idx === imgIndex ? 20 : 8, height: 8, borderRadius: 999, border: 'none', padding: 0,
                          background: idx === imgIndex ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Info section */}
            <div className="info">
              <div className="eyebrow">✈ {type}</div>
              <h1 className="name">{name}</h1>
              <div className="meta-row">
                <span>🏭 {manufacturer}</span>
                <span>📍 {origin}</span>
                {usedIn && <span>✈ Used in {usedIn}</span>}
              </div>
              <p className="desc">{description}</p>
              <div className="divider"></div>
              <div className="thrust-row">
                <div>
                  <div className="lbl">Dry Thrust</div>
                  <div><span className="thrust-big">{dryThrust.split(' ')[0]}</span><span className="thrust-unit">{dryThrust.split(' ')[1] || 'lbf'}</span></div>
                </div>
                <button className="btn" onClick={onViewDatasheet}>View Datasheet</button>
              </div>
            </div>
          </div>

          {/* Specs grid */}
          <div className="specs">
            {specs.map((spec, idx) => (
              <div key={idx} className="spec">
                <div className="icon">{spec.icon || '⚙️'}</div>
                <div className="lbl">{spec.label}</div>
                <div className="val">{spec.value}<span className="unit">{spec.unit || ''}</span></div>
              </div>
            ))}
          </div>
        </article>

        {/* Footer */}
        <p className="foot">Specifications based on publicly available data · {id}</p>

        {/* Related engines */}
        {relatedEngines.length > 0 && (
          <>
            <div className="related-head">
              <div>
                <div className="eyebrow"><span className="dot" style={{ width: 6, height: 6, margin: '0 4px 0 0' }}></span>Related Engines</div>
                <h2>Comparable powerplants</h2>
              </div>
              <a href="#" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>View all ↗</a>
            </div>

            <div className="rel-grid">
              {relatedEngines.slice(0, 3).map((engine) => (
                <div key={engine._id || engine.id} className="rcard" onClick={() => handleRelatedEngineClick(engine.id)} style={{ cursor: 'pointer' }}>
                  <div className="imgbox">
                    <img src={engine.imageUrl || '/default-engine.jpg'} alt={engine.name} />
                    <div className="id-tag"><span className="dot" style={{ margin: 0 }}></span>{engine.id}</div>
                    {engine.status && <span className="status-pill" style={{ position: 'absolute', right: 16, top: 16 }}>{engine.status}</span>}
                  </div>
                  <div className="body">
                    <div className="eyebrow" style={{ fontSize: 10 }}>✈ {engine.type}</div>
                    <h3>{engine.name}</h3>
                    <div className="mfg">{engine.manufacturer}</div>
                    <div className="rstats">
                      <div><div className="lbl">Thrust</div><div><span className="thr">{engine.thrust?.split(' ')[0] || '0'}</span><span className="thr-u">{engine.thrust?.split(' ')[1] || 'lbf'}</span></div></div>
                      <div className="right"><div className="lbl">Used in</div><div className="val">{engine.usedIn || 'Unknown'}</div></div>
                    </div>
                    <div className="cta"><span>View specs</span><span>↗</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
