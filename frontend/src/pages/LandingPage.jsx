import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  MapPin,
  Navigation,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
  Clock,
  Wallet,
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  CheckCircle2,
  Rocket,
  Globe,
  Radio,
  Car
} from 'lucide-react';
import FareCalculator from '../components/FareCalculator';
import videoFondoLanding from '../assets/video_fondo_landing.mp4';
import videoRecorridoLineas from '../assets/recorrido_lineas.mp4';
import passengersComfortImg from '../assets/passengers_comfort.jpg';

import MiniLogoTP from '../components/MiniLogoTP';

// COMPONENTE DE VIDEO DE FONDO CON VELOCIDAD 0.5X Y DEGRADADOS DE TRANSICIÓN SUAVE
function SectionVideoBg({ opacity = 0.20 }) {
  const vidRef = useRef(null);

  useEffect(() => {
    const video = vidRef.current;
    if (!video) return;

    // Velocidad lenta 0.5x
    video.playbackRate = 0.5;
    video.play().catch(() => {});

    const handleEnded = () => {
      video.currentTime = 0;
      if (vidRef.current) vidRef.current.playbackRate = 0.5;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div className="section-video-bg-container">
      <video
        ref={vidRef}
        autoPlay
        loop
        muted
        playsInline
        className="section-video-bg-element"
        style={{ opacity: opacity }}
      >
        <source src={videoRecorridoLineas} type="video/mp4" />
      </video>
      <div className="section-video-fade-top" />
      <div className="section-video-fade-bottom" />
    </div>
  );
}

export default function LandingPage({
  onEnterApp,
  onOpenAuthModal
}) {
  const videoRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // SCROLL LISTENER PARA MOSTRAR NAVBAR SOLO AL BAJAR
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // REPRODUCCIÓN CONTINUA DEL HERO (NADA DEL HERO SE TOCÓ EN ABSOLUTO)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const [lang, setLang] = useState('es');
  const t = TRANSLATIONS[lang];
  const faqs = FAQS_DATA[lang];

  return (
    <div className="tramo-landing-root text-white">
      
      {/* NAVBAR FLOTANTE SCROLLABLE CON MINI LOGO TP */}
      <header className={`tramo-navbar-fixed ${isScrolled ? 'nav-active' : 'nav-passive'}`}>
        <div 
          className="tramo-brand-logo flex-center gap-10 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <MiniLogoTP size={34} />
          <span className="brand-title-text font-outfit">
            Tramo<span className="brand-emerald">Points</span>
          </span>
        </div>

        <nav className="tramo-nav-menu">
          <a href="#inicio" className="tramo-nav-item">{t.nav.inicio}</a>
          <a href="#plataforma" className="tramo-nav-item">{t.nav.plataforma}</a>
          <a href="#como-funciona" className="tramo-nav-item">{t.nav.comoFunciona}</a>
          <a href="#precios" className="tramo-nav-item">{t.nav.precios}</a>
          <a href="#faq" className="tramo-nav-item">{t.nav.faq}</a>
        </nav>

        <div className="tramo-nav-right" style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', 
              color: 'white', borderRadius: '30px', padding: '6px 14px', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '14px', fontWeight: '600', transition: 'all 0.3s ease', outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'none'; }}
          >
            {lang === 'es' ? (
              <>
                <img src="https://flagcdn.com/w40/us.png" alt="English" style={{ width: '20px', borderRadius: '2px' }} />
                <span>English</span>
              </>
            ) : (
              <>
                <img src="https://flagcdn.com/w40/ar.png" alt="Español" style={{ width: '20px', borderRadius: '2px' }} />
                <span>Español</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 1. HERO TOTALMENTE INTACTO (LA PARTE DE ARRIBA DEL HERO NO SE TOCÓ EN ABSOLUTO) */}
      <section id="inicio" className="tramo-hero-viewport">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="tramo-hero-video-vivid"
        >
          <source src={videoFondoLanding} type="video/mp4" />
        </video>

        <div className="tramo-hero-content-exact">
          <div className="margin-bottom-24 flex-center">
            <MiniLogoTP size={52} />
          </div>

            <h1 className="tramo-headline-exact">

              Tramo<span className="text-neon-green">Points</span>.<br />

              {t.hero.subtitle}


            </h1>

          <div className="tramo-stats-row-exact">
            <div className="tramo-stat-pill">
              <div className="stat-icon-green">
                <Users size={22} />
              </div>
              <div className="stat-text-box">
                <strong className="stat-number">3M+</strong>
                <span className="stat-label">{t.hero.stats1}</span>
              </div>
            </div>

            <div className="tramo-stat-pill">
              <div className="stat-icon-green">
                <Clock size={22} />
              </div>
              <div className="stat-text-box">
                <strong className="stat-number">96%</strong>
                <span className="stat-label">{t.hero.stats2}</span>
              </div>
            </div>

            <div className="tramo-stat-pill highlight-pill">
              <div className="stat-icon-green">
                <Wallet size={22} />
              </div>
              <div className="stat-text-box">
                <strong className="stat-title-strong">{t.hero.stats3}</strong>
                <span className="stat-label-bold">{t.hero.stats3Val}</span>
              </div>
            </div>
          </div>

          <div className="margin-top-52">
            <button
              type="button"
              className="btn-gold-emerald-pill"
              onClick={() => onEnterApp('CREATE')}
            >
              {t.hero.cta}
            </button>
          </div>
        </div>
      </section>
       {/* =====================================================
          LOWER LANDING — FULL VIEWPORT SCROLL SNAP & FADE EFFECTS
          ===================================================== */}
      <style>{`
        /* Global Snap & Behavior */
        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .tramo-hero-viewport {
          scroll-snap-align: start;
        }
        
        .lp-lower {
          background: #060a10;
          color: #e2e8f0;
          font-family: 'Outfit', 'Inter', system-ui, sans-serif;
          overflow-x: hidden;
        }
        .lp-lower * { box-sizing: border-box; }
        
        .lp-section {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          overflow: hidden;
          background: #060a10;
          
          /* Fade-in Scroll Effect */
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-section:nth-child(even) {
          background: #090e16;
        }
        .lp-section.lp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @media (min-width: 901px) {
          .lp-section {
            height: 100vh;
            min-height: 700px;
          }
        }
        @media (max-width: 900px) {
          .lp-section {
            min-height: 100vh;
            padding: 100px 24px;
          }
        }
        
        .lp-inner {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .lp-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
          margin-bottom: 24px;
        }
        .lp-h2 {
          font-size: clamp(28px, 4.5vw, 42px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.15;
          margin: 0 0 16px 0;
          text-align: center;
        }
        .lp-subtitle {
          font-size: 16px;
          color: #94a3b8;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 0 40px 0;
          text-align: center;
        }

        /* FEATURES GRID */
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }
        .lp-feature-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 28px 24px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .lp-feature-card:hover {
          border-color: rgba(52, 211, 153, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
        }
        .lp-feature-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .lp-feature-icon.green { background: rgba(16, 185, 129, 0.12); color: #34d399; }
        .lp-feature-icon.amber { background: rgba(234, 179, 8, 0.12); color: #fbbf24; }
        .lp-feature-icon.indigo { background: rgba(99, 102, 241, 0.12); color: #818cf8; }
        .lp-feature-card h3 {
          font-size: 18px; font-weight: 800; color: #fff;
          margin: 0 0 8px 0;
        }
        .lp-feature-card p {
          font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0;
        }

        /* HOW IT WORKS STEPS */
        .lp-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          margin-bottom: 40px;
        }
        .lp-step {
          text-align: center;
          padding: 28px 20px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(15, 23, 42, 0.4);
        }
        .lp-step-num {
          font-size: 36px; font-weight: 900;
          background: linear-gradient(135deg, #34d399, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 14px;
        }
        .lp-step h4 {
          font-size: 16px; font-weight: 700; color: #fff;
          margin: 0 0 8px 0;
        }
        .lp-step p {
          font-size: 13px; color: #64748b; line-height: 1.4; margin: 0;
        }
        .lp-cta-btn {
          display: inline-block;
          padding: 14px 40px;
          border-radius: 12px;
          font-size: 16px; font-weight: 700;
          color: #060a10;
          background: linear-gradient(135deg, #34d399, #10b981);
          border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .lp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        /* COMPARISON TABLE */
        .lp-table-wrap {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          width: 100%;
          margin-bottom: 32px;
        }
        .lp-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(15, 23, 42, 0.4);
        }
        .lp-table th, .lp-table td {
          padding: 16px 20px;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .lp-table aggression th {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          background: rgba(15, 23, 42, 0.7);
        }
        .lp-table thead th:nth-child(2) { color: #34d399; }
        .lp-table td:nth-child(2) {
          color: #34d399;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.03);
        }
        .lp-table td:first-child { color: #e2e8f0; font-weight: 600; }
        .lp-table td:nth-child(3) { color: #64748b; }
        .lp-table tbody tr:last-child td { border-bottom: none; }

        /* PARTNERS ROW */
        .lp-partners {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 36px;
          font-size: 14px; font-weight: 600;
          color: #475569;
          margin-top: 10px;
        }
        .lp-partners span { transition: color 0.2s; cursor: default; }
        .lp-partners span:hover { color: #94a3b8; }
        .lp-partners .highlight { color: #34d399; }

        /* FAQ ACCORDION */
        .lp-faq-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        .lp-faq-item {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
          background: rgba(15, 23, 42, 0.3);
          transition: border-color 0.3s;
        }
        .lp-faq-item:hover { border-color: rgba(52, 211, 153, 0.2); }
        .lp-faq-btn {
          width: 100%; padding: 18px 20px;
          display: flex; align-items: center; justify-content: space-between;
          background: none; border: none; cursor: pointer;
          color: #fff; font-size: 15px; font-weight: 600;
          font-family: inherit; text-align: left;
          gap: 12px;
        }
        .lp-faq-answer {
          padding: 0 20px 18px 20px;
          font-size: 14px; color: #94a3b8; line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 14px;
        }

        /* HIGH QUALITY CENTERED VIDEO BG - ENLARGED & MORE VISIBLE */
        .lp-video-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 1100px; /* Ampliado de 800px para que se vea más grande */
          height: 90%;
          pointer-events: none;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .lp-video-bg video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0.22; /* Opacidad aumentada de 0.12 a 0.22 para mayor visibilidad */
          filter: brightness(0.95) blur(0.5px); /* Brillo aumentado para que se note un poco más */
          mask-image: radial-gradient(circle, black 35%, transparent 75%);
          -webkit-mask-image: radial-gradient(circle, black 35%, transparent 75%);
        }

        /* STANDARD FOOTER - NOT FULL SCREEN */
        .lp-footer-container {
          background: #060a10;
          color: #475569;
          font-size: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
          padding: 40px 24px;
          position: relative;
          z-index: 2;
        }
        .lp-footer-inner {
          max-width: 1140px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .lp-footer-inner a {
          color: #64748b;
          text-decoration: none;
          margin-right: 16px;
        }
        .lp-footer-inner a:hover {
          color: #34d399;
        }

        /* RESPONSIVE LAYOUT */
        @media (max-width: 900px) {
          .lp-features-grid { grid-template-columns: 1fr 1fr; }
          .lp-steps { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .lp-features-grid { grid-template-columns: 1fr; }
          .lp-steps { grid-template-columns: 1fr; }
          .lp-section { padding: 80px 16px; }
          .lp-table th, .lp-table td { padding: 12px 14px; font-size: 13px; }
          .lp-footer-inner { flex-direction: column; text-align: center; }
          .lp-footer-inner a { margin: 0 8px; }
        }
      `}</style>

      {/* Intersection Observer Initializer */}
      <ObserverLoader />

      <div className="lp-lower">

        {/* ——— SECTION 1: FEATURES ——— */}
        <section id="plataforma" className="lp-section">
          <div className="lp-inner">
            <span className="lp-badge">{t.section1.badge}</span>
            <h2 className="lp-h2" style={{ whiteSpace: 'pre-line' }}>{t.section1.title}</h2>
            <p className="lp-subtitle">
              {t.section1.subtitle}
            </p>

            <div className="lp-features-grid">
              <div className="lp-feature-card">
                <div className="lp-feature-icon green"><MapPin size={22} /></div>
                <h3>{t.section1.f1}</h3>
                <p>{t.section1.f1d}</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon amber"><Cpu size={22} /></div>
                <h3>{t.section1.f2}</h3>
                <p>{t.section1.f2d}</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon indigo"><Navigation size={22} /></div>
                <h3>{t.section1.f3}</h3>
                <p>{t.section1.f3d}</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon green"><ShieldCheck size={22} /></div>
                <h3>{t.section1.f4}</h3>
                <p>{t.section1.f4d}</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon amber"><Users size={22} /></div>
                <h3>{t.section1.f5}</h3>
                <p>{t.section1.f5d}</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon indigo"><Activity size={22} /></div>
                <h3>{t.section1.f6}</h3>
                <p>{t.section1.f6d}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ——— SECTION 2: HOW IT WORKS ——— */}
        <section id="como-funciona" className="lp-section">
          <div className="lp-video-bg">
            <video autoPlay loop muted playsInline><source src={videoRecorridoLineas} type="video/mp4" /></video>
          </div>
          <div className="lp-inner">
            <span className="lp-badge">{t.section2.badge}</span>
            <h2 className="lp-h2" style={{ whiteSpace: 'pre-line' }}>{t.section2.title}</h2>
            <p className="lp-subtitle">
              {t.section2.subtitle}
            </p>

            <div className="lp-steps">
              <div className="lp-step">
                <div className="lp-step-num">01</div>
                <h4>{t.section2.s1}</h4>
                <p>{t.section2.s1d}</p>
              </div>
              <div className="lp-step">
                <div className="lp-step-num">02</div>
                <h4>{t.section2.s2}</h4>
                <p>{t.section2.s2d}</p>
              </div>
              <div className="lp-step">
                <div className="lp-step-num">03</div>
                <h4>{t.section2.s3}</h4>
                <p>{t.section2.s3d}</p>
              </div>
              <div className="lp-step">
                <div className="lp-step-num">04</div>
                <h4>{t.section2.s4}</h4>
                <p>{t.section2.s4d}</p>
              </div>
            </div>

            <button className="lp-cta-btn" onClick={() => onEnterApp('CREATE')}>
              {t.section2.cta}
            </button>
          </div>
        </section>

        {/* ——— SECTION 3: COMPARISON TABLE ——— */}
        <section id="precios" className="lp-section">
          <div className="lp-inner">
            <span className="lp-badge">{t.section3.badge}</span>
            <h2 className="lp-h2">{t.section3.title}</h2>
            <p className="lp-subtitle">
              {t.section3.subtitle}
            </p>

            <div className="lp-table-wrap">
              <table className="lp-table">
                <thead>
                  <tr>
                    <th>{t.section3.th1}</th>
                    <th>{t.section3.th2}</th>
                    <th>{t.section3.th3}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t.section3.tr1c1}</td>
                    <td>{t.section3.tr1c2}</td>
                    <td>{t.section3.tr1c3}</td>
                  </tr>
                  <tr>
                    <td>{t.section3.tr2c1}</td>
                    <td>{t.section3.tr2c2}</td>
                    <td>{t.section3.tr2c3}</td>
                  </tr>
                  <tr>
                    <td>{t.section3.tr3c1}</td>
                    <td>{t.section3.tr3c2}</td>
                    <td>{t.section3.tr3c3}</td>
                  </tr>
                  <tr>
                    <td>{t.section3.tr4c1}</td>
                    <td>{t.section3.tr4c2}</td>
                    <td>{t.section3.tr4c3}</td>
                  </tr>
                  <tr>
                    <td>{t.section3.tr5c1}</td>
                    <td>{t.section3.tr5c2}</td>
                    <td>{t.section3.tr5c3}</td>
                  </tr>
                  <tr>
                    <td>{t.section3.tr6c1}</td>
                    <td>{t.section3.tr6c2}</td>
                    <td>{t.section3.tr6c3}</td>
                  </tr>
                </tbody>
              </table>
            </div>


          </div>
        </section>

        {/* ——— SECTION 4: FAQ ——— */}
        <section id="faq" className="lp-section">
          <div className="lp-video-bg">
            <video autoPlay loop muted playsInline><source src={videoRecorridoLineas} type="video/mp4" /></video>
          </div>
          <div className="lp-inner">
            <span className="lp-badge">{t.section4.badge}</span>
            <h2 className="lp-h2" style={{ marginBottom: '40px' }}>{t.section4.title}</h2>

            <div className="lp-faq-container">
              {faqs.map((faq, idx) => (
                <div key={faq.question} className="lp-faq-item">
                  <button className="lp-faq-btn" onClick={() => toggleFaq(idx)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <HelpCircle size={18} style={{ color: '#34d399', flexShrink: 0 }} />
                      {faq.question}
                    </span>
                    {openFaqIndex === idx
                      ? <ChevronUp size={18} style={{ color: '#34d399', flexShrink: 0 }} />
                      : <ChevronDown size={18} style={{ color: '#475569', flexShrink: 0 }} />
                    }
                  </button>
                  {openFaqIndex === idx && (
                    <div className="lp-faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ——— STANDARD FOOTER ——— */}
        <footer className="lp-footer-container">
          <div className="lp-footer-inner">
            <div>
              <a href="#inicio">{t.footer.home}</a>
              <a href="#servicios">{t.footer.services}</a>
              <a href="#faq">{t.footer.faq}</a>
              <a href="#">{t.footer.resources}</a>
              <a href="#">{t.footer.privacy}</a>
            </div>
            <p style={{ margin: 0 }}>{t.footer.rights}</p>
          </div>
        </footer>

      </div>
    </div>
  );
}

// Simple internal helper component to execute IntersectionObserver
function ObserverLoader() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lp-visible');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll('.lp-section');
    sections.forEach(sec => observer.observe(sec));

    return () => {
      sections.forEach(sec => observer.unobserve(sec));
    };
  }, []);

  return null;
}

const TRANSLATIONS = {
  es: {
    nav: { inicio: 'Inicio', plataforma: 'Plataforma', comoFunciona: 'Cómo Funciona', precios: 'Precios', faq: 'FAQ' },
    hero: { subtitle: 'Múltiples caminos, un solo viaje.', stats1: 'Viajes Compartidos', stats2: 'Puntualidad', stats3: 'Ahorro Promedio', stats3Val: 'del 75%', cta: 'Empezar Solicitud de Viaje' },
    section1: { badge: 'Plataforma', title: 'Todo lo que necesitás\npara viajar mejor', subtitle: 'TramoPoints combina inteligencia artificial, rutas OSRM y grupos inteligentes para ofrecerte viajes compartidos premium a una fracción del costo.', f1: 'Geocodificación en Tiempo Real', f1d: 'Ubicamos paradas seguras a menos de 300m de tu posición usando datos cartográficos vivos.', f2: 'Clustering Inteligente', f2d: 'Agrupamos pasajeros cercanos automáticamente para optimizar rutas y reducir costos.', f3: 'Rutas OSRM Optimizadas', f3d: 'Calculamos el trayecto más eficiente en milisegundos con el motor de ruteo OSRM.', f4: 'Choferes Verificados', f4d: 'Licencia D2, VTV al día, seguro obligatorio y documentación auditada.', f5: 'Paneles Multi-Rol', f5d: 'Dashboard dedicado para pasajeros, choferes y administradores con datos en tiempo real.', f6: 'Seguimiento GPS en Vivo', f6d: 'Rastreá tu combi en tiempo real desde la app. Sabé exactamente cuándo llega.'},
    section2: { badge: 'Cómo Funciona', title: 'De la solicitud al viaje\nen 4 pasos', subtitle: 'Nuestro algoritmo procesa tu pedido y arma el grupo perfecto en segundos.', s1: 'Solicitás', s1d: 'Ingresás origen, destino y horario preferido desde la app.', s2: 'Agrupamos', s2d: 'El AI agrupa pasajeros cercanos con destinos similares.', s3: 'Optimizamos', s3d: 'OSRM calcula la ruta más eficiente y asigna paradas seguras.', s4: 'Viajás', s4d: 'Tu combi pasa por la esquina indicada. Seguimiento GPS en vivo.', cta: 'Solicitar Mi Viaje' },
    section3: { badge: 'Precios', title: 'TramoPoints vs. Alternativas', subtitle: 'Comparación directa de costo, tiempo y confort para tus trayectos diarios.', th1: 'Atributo', th2: 'TramoPoints', th3: 'Uber / Taxi', tr1c1: 'Costo promedio', tr1c2: '$18 – $28', tr1c3: '$70 – $120', tr2c1: 'Tiempo de espera', tr2c2: 'Horarios fijos y puntuales', tr2c3: 'Variable por demanda', tr3c1: 'Asiento', tr3c2: '100% reservado', tr3c3: 'Sujeto a disponibilidad', tr4c1: 'Paradas', tr4c2: 'Esquinas iluminadas (OSRM)', tr4c3: 'Puerta a puerta', tr5c1: 'Seguimiento GPS', tr5c2: 'En vivo desde la app', tr5c3: 'Disponible', tr6c1: 'Documentación del chofer', tr6c2: 'Verificada y auditada', tr6c3: 'Variable' },
    section4: { badge: 'Soporte', title: 'Preguntas Frecuentes' },
    footer: { home: 'Inicio', services: 'Servicios', faq: 'FAQ', resources: 'Recursos', privacy: 'Políticas de Privacidad', rights: '© 2026 TramoPoints. Movilidad inteligente para todos.' }
  },
  en: {
    nav: { inicio: 'Home', plataforma: 'Platform', comoFunciona: 'How it Works', precios: 'Pricing', faq: 'FAQ' },
    hero: { subtitle: 'Multiple routes, a single journey.', stats1: 'Shared Rides', stats2: 'On Time', stats3: 'Average Savings', stats3Val: 'of 75%', cta: 'Start Ride Request' },
    section1: { badge: 'Platform', title: 'Everything you need\nto travel better', subtitle: 'TramoPoints combines AI, OSRM routing, and smart clustering to offer premium shared rides at a fraction of the cost.', f1: 'Real-Time Geocoding', f1d: 'We locate safe stops within 300m of your location using live map data.', f2: 'Smart Clustering', f2d: 'We automatically group nearby passengers to optimize routes and reduce costs.', f3: 'Optimized OSRM Routes', f3d: 'We calculate the most efficient path in milliseconds using the OSRM routing engine.', f4: 'Verified Drivers', f4d: 'D2 License, up-to-date MOT, mandatory insurance, and audited documentation.', f5: 'Multi-Role Dashboards', f5d: 'Dedicated dashboard for passengers, drivers, and admins with real-time data.', f6: 'Live GPS Tracking', f6d: 'Track your shuttle in real-time from the app. Know exactly when it arrives.'},
    section2: { badge: 'How it Works', title: 'From request to ride\nin 4 steps', subtitle: 'Our algorithm processes your request and builds the perfect group in seconds.', s1: 'Request', s1d: 'Enter origin, destination, and preferred time from the app.', s2: 'Group', s2d: 'The AI groups nearby passengers with similar destinations.', s3: 'Optimize', s3d: 'OSRM calculates the most efficient route and assigns safe stops.', s4: 'Ride', s4d: 'Your shuttle arrives at the designated corner. Live GPS tracking.', cta: 'Request My Ride' },
    section3: { badge: 'Pricing', title: 'TramoPoints vs. Alternatives', subtitle: 'Direct comparison of cost, time, and comfort for your daily commutes.', th1: 'Attribute', th2: 'TramoPoints', th3: 'Uber / Taxi', tr1c1: 'Average Cost', tr1c2: '$18 – $28', tr1c3: '$70 – $120', tr2c1: 'Wait Time', tr2c2: 'Fixed and punctual schedules', tr2c3: 'Variable by demand', tr3c1: 'Seat', tr3c2: '100% reserved', tr3c3: 'Subject to availability', tr4c1: 'Stops', tr4c2: 'Illuminated corners (OSRM)', tr4c3: 'Door to door', tr5c1: 'GPS Tracking', tr5c2: 'Live from the app', tr5c3: 'Available', tr6c1: 'Driver Documentation', tr6c2: 'Verified and audited', tr6c3: 'Variable' },
    section4: { badge: 'Support', title: 'Frequently Asked Questions' },
    footer: { home: 'Home', services: 'Services', faq: 'FAQ', resources: 'Resources', privacy: 'Privacy Policies', rights: '© 2026 TramoPoints. Smart mobility for everyone.' }
  }
};

const FAQS_DATA = {
  es: [
    { question: '¿Cómo se calcula el costo del viaje?', answer: 'El costo total trazado por OSRM se divide equitativamente entre los pasajeros del grupo (hasta 75% menos que Uber/Taxi).' },
    { question: '¿El asiento está garantizado?', answer: 'Sí. Al confirmarse el grupo, tu lugar en la combi de 30 asientos queda 100% reservado.' },
    { question: '¿Los choferes están verificados?', answer: 'Sí. Todos cuentan con licencia profesional D2, VTV, seguro y documentación auditada.' },
    { question: '¿Dónde me subo a la combi?', answer: 'El algoritmo OSRM fija esquinas iluminadas a menos de 300m de tu origen.' }
  ],
  en: [
    { question: 'How is the ride cost calculated?', answer: 'The total cost routed by OSRM is divided equally among the group passengers (up to 75% less than Uber/Taxi).' },
    { question: 'Is the seat guaranteed?', answer: 'Yes. Once the group is confirmed, your seat in the 30-passenger shuttle is 100% reserved.' },
    { question: 'Are the drivers verified?', answer: 'Yes. All have a professional D2 license, MOT, insurance, and audited documentation.' },
    { question: 'Where do I board the shuttle?', answer: 'The OSRM algorithm sets illuminated corners within 300m of your origin.' }
  ]
};