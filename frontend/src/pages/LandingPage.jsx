import React, { useState } from 'react';
import {
  Zap,
  MapPin,
  Clock,
  Sparkles,
  TrendingDown,
  Bus,
  Users,
  Navigation,
  DollarSign,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldAlert,
  Car,
  Award,
  HelpCircle,
  PhoneCall,
  LogIn
} from 'lucide-react';
import FareCalculator from '../components/FareCalculator';
import heroCombiImg from '../assets/hero_combi.jpg';
import passengersComfortImg from '../assets/passengers_comfort.jpg';

export default function LandingPage({
  onEnterApp,
  onOpenAuthModal
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: '¿Cómo calcula TrampoPoints la tarifa del viaje?',
      answer: 'El costo total del recorrido trazado por OSRM se calcula de acuerdo con la distancia real y el consumo de la combi. Ese valor total se divide equitativamente entre la cantidad exacta de pasajeros agrupados (hasta 75% más económico que pedir un auto privado).'
    },
    {
      question: '¿Tengo asiento garantizado al reservar?',
      answer: '¡Sí! Al ser un sistema de solicitudes previas con cupos de combis de 30 asientos, tu plaza queda 100% reservada desde el momento en que se confirma la coincidencia de tu grupo.'
    },
    {
      question: '¿Los choferes y unidades están habilitados?',
      answer: 'Absolutamente. Todos los choferes y empresas de combis asociadas cuentan con licencia profesional, seguro contra terceros y pasajeros, VTV vigente y documentación al día verificada por nuestro equipo.'
    },
    {
      question: '¿Qué pasa si mi punto de partida está a unas cuadras de la combi?',
      answer: 'Nuestro algoritmo de ruteo OSRM optimiza las paradas intermedias para que camines menos de 300 metros hasta tu punto de ascenso y descenso en esquinas seguras e iluminadas.'
    },
    {
      question: '¿Puedo usar TrampoPoints para viajes diarios de trabajo o facultad?',
      answer: '¡Es nuestro uso principal! Podés programar tus viajes de lunes a viernes en tu horario habitual y viajar siempre con la misma comunidad de vecinos o compañeros.'
    }
  ];

  return (
    <div className="landing-standalone-wrapper text-left text-white">
      {/* NAVBAR EXCLUSIVA DE LANDING PAGE */}
      <header className="landing-navbar glass-card border-bottom-glass sticky top-0 z-50 padding-v-16 padding-h-32 flex-between align-center">
        <div className="landing-logo flex-center gap-10 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-icon-bg bg-emerald text-dark padding-8 border-radius-10 flex-center">
            <Bus size={22} className="text-white" />
          </div>
          <span className="font-extrabold text-22 tracking-tight text-white">
            Trampo<span className="text-emerald">Points</span>
          </span>
        </div>

        <nav className="landing-nav-links flex-center gap-24 font-semibold text-14">
          <a href="#como-funciona" className="nav-link text-muted hover-white">Cómo Funciona</a>
          <a href="#tarifas" className="nav-link text-muted hover-white">Tarifas y Ahorro</a>
          <a href="#seguridad" className="nav-link text-muted hover-white">Seguridad</a>
          <a href="#testimonios" className="nav-link text-muted hover-white">Testimonios</a>
          <a href="#faq" className="nav-link text-muted hover-white">Preguntas Frecuentes</a>
        </nav>

        <div className="landing-nav-actions flex-center gap-12">
          <button
            type="button"
            className="btn-secondary text-14 flex-center gap-6"
            onClick={onOpenAuthModal}
          >
            <LogIn size={16} /> Iniciar Sesión
          </button>
          
          <button
            type="button"
            className="btn-primary btn-landing-cta text-14 font-bold flex-center gap-8 shadow-emerald"
            onClick={() => onEnterApp('CREATE')}
          >
            <PlusCircle size={18} /> ¡Quiero Viajar!
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION PRINCIPAL DE VENTA */}
      <section className="landing-hero padding-v-60 padding-h-24 relative overflow-hidden">
        <div className="container max-w-1200 margin-auto grid-2-col gap-40 align-center">
          
          <div className="hero-text-side flex-column gap-24 align-start">
            <div className="badge badge-amber badge-pill font-semibold text-xs flex-center gap-6 animate-pulse">
              <Sparkles size={14} className="text-amber" />
              LA RED INTELIGENTE DE COMBIS COMPARTIDAS
            </div>

            <h1 className="text-gradient-white font-extrabold text-52 leading-tight">
              Viajá en combi con gente de tu zona. <br />
              <span className="text-gradient-emerald">Pagá hasta 75% menos.</span>
            </h1>

            <p className="text-muted text-18 leading-relaxed">
              Decile adiós al costo exorbitante del auto privado y al estrés del colectivo colapsado. TrampoPoints agrupa pasajeros afines en combis modernas con ruta optimizada por OSRM y asiento asegurado.
            </p>

            {/* CALL TO ACTION PRINCIPAL */}
            <div className="hero-cta-group flex-center-left gap-16 margin-top-12 flex-wrap">
              <button
                type="button"
                className="btn-primary btn-hero-lg text-18 font-extrabold padding-v-16 padding-h-36 flex-center gap-12 shadow-emerald animate-bounce-subtle"
                onClick={() => onEnterApp('CREATE')}
              >
                <PlusCircle size={22} /> ¡Quiero Viajar Ahora! <ArrowRight size={20} />
              </button>

              <button
                type="button"
                className="btn-secondary btn-hero-lg text-15 font-semibold padding-v-16 padding-h-24 flex-center gap-8"
                onClick={() => onEnterApp('ADMIN')}
              >
                <ShieldCheck size={18} className="text-amber" /> Acceso Administrador
              </button>
            </div>

            <div className="trust-badges-row flex-center-left gap-20 margin-top-16 text-xs text-muted">
              <span className="flex-center gap-6"><CheckCircle2 size={14} className="text-emerald" /> Sin costo de reserva previo</span>
              <span className="flex-center gap-6"><CheckCircle2 size={14} className="text-emerald" /> Cancelación flexible</span>
              <span className="flex-center gap-6"><CheckCircle2 size={14} className="text-emerald" /> Choferes verificados</span>
            </div>
          </div>

          {/* FOTO HERO / DEMO VISUAL */}
          <div className="hero-image-side relative">
            <div className="hero-image-wrapper glass-card padding-8 border-gradient">
              <img
                src={heroCombiImg}
                alt="Combi Inteligente TrampoPoints navegando por la ciudad"
                className="width-full height-auto border-radius-14 shadow-lg object-cover"
              />
              <div className="floating-hero-pill glass-card padding-12 border-emerald absolute bottom-20 left-20 flex-center gap-12">
                <div className="badge-icon-bg bg-emerald text-dark padding-8 border-radius-8">
                  <Navigation size={20} className="text-white" />
                </div>
                <div>
                  <strong className="block text-white text-14 font-extrabold">Ruta Activa Belgrano ➔ Centro</strong>
                  <span className="text-xs text-emerald font-bold">OSRM • 11.4 km por calles reales</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS IMPACT BAR */}
      <section className="landing-stats-bar bg-card-dark padding-v-28 border-y-glass">
        <div className="container max-w-1200 margin-auto grid-4-col gap-24 text-center">
          <div className="stat-box">
            <strong className="text-36 font-extrabold text-gradient-emerald font-mono">+50.000</strong>
            <span className="block text-13 text-muted margin-top-4">Viajes Compartidos Trazados</span>
          </div>
          <div className="stat-box">
            <strong className="text-36 font-extrabold text-gradient-white font-mono">75%</strong>
            <span className="block text-13 text-muted margin-top-4">Ahorro Promedio por Viaje</span>
          </div>
          <div className="stat-box">
            <strong className="text-36 font-extrabold text-amber font-mono">30 Min</strong>
            <span className="block text-13 text-muted margin-top-4">Ventana Horaria de Puntualidad</span>
          </div>
          <div className="stat-box">
            <strong className="text-36 font-extrabold text-indigo font-mono">4.9 ★</strong>
            <span className="block text-13 text-muted margin-top-4">Satisfacción de Pasajeros</span>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DINÁMICA DE TARIFAS */}
      <section id="tarifas" className="landing-section padding-v-60">
        <div className="container max-w-1100 margin-auto">
          <FareCalculator onStartRequest={() => onEnterApp('CREATE')} />
        </div>
      </section>

      {/* 3. CÓMO FUNCIONA EL ALGORITMO (3 PASOS) */}
      <section id="como-funciona" className="landing-section padding-v-60 bg-dark-subtle">
        <div className="container max-w-1100 margin-auto">
          <div className="section-header text-center margin-bottom-48">
            <span className="badge badge-amber font-bold text-xs uppercase margin-bottom-8">
              Tecnología e Inteligencia Spatio-Temporal
            </span>
            <h2 className="text-gradient-white text-36 font-extrabold">
              ¿Cómo agrupamos tu viaje en 3 simples pasos?
            </h2>
            <p className="text-muted text-16 margin-top-8 max-w-650 margin-auto">
              Nuestro algoritmo analiza tu origen, tu destino y tu ventana horaria para asignarte la combi ideal.
            </p>
          </div>

          <div className="steps-grid grid-3-col gap-28">
            <div className="step-card card glass-card padding-32 flex-column gap-20 relative">
              <div className="step-number-badge">1</div>
              <div className="step-icon bg-indigo-subtle text-indigo padding-14 border-radius-12 width-fit">
                <MapPin size={30} />
              </div>
              <div>
                <h3 className="font-extrabold text-20 text-white">1. Solicitás tu Recorrido</h3>
                <p className="text-muted text-14 margin-top-8 leading-relaxed">
                  Ingresás tu dirección de casa, tu lugar de trabajo o facultad y la hora a la que querés salir.
                </p>
              </div>
            </div>

            <div className="step-card card glass-card padding-32 flex-column gap-20 relative">
              <div className="step-number-badge">2</div>
              <div className="step-icon bg-amber-subtle text-amber padding-14 border-radius-12 width-fit">
                <Zap size={30} />
              </div>
              <div>
                <h3 className="font-extrabold text-20 text-white">2. Agrupamiento por Afinidad</h3>
                <p className="text-muted text-14 margin-top-8 leading-relaxed">
                  El algoritmo detecta vecinos con orígenes cercanos (hasta 2 km) y destinos afines (hasta 3 km) armando el cluster.
                </p>
              </div>
            </div>

            <div className="step-card card glass-card padding-32 flex-column gap-20 relative">
              <div className="step-number-badge">3</div>
              <div className="step-icon bg-emerald-subtle text-emerald padding-14 border-radius-12 width-fit">
                <Navigation size={30} />
              </div>
              <div>
                <h3 className="font-extrabold text-20 text-white">3. Trazado OSRM y Combi</h3>
                <p className="text-muted text-14 margin-top-8 leading-relaxed">
                  OSRM genera el trayecto doblando esquina por esquina por calles reales. Te subís en tu parada con asiento garantizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCIA Y CONFORT A BORDO */}
      <section className="landing-section padding-v-60">
        <div className="container max-w-1200 margin-auto grid-2-col gap-40 align-center">
          <div className="comfort-img-side">
            <div className="glass-card padding-8 border-gradient">
              <img
                src={passengersComfortImg}
                alt="Pasajeros disfrutando del confort a bordo de una combi TrampoPoints"
                className="width-full height-auto border-radius-14 shadow-lg object-cover"
              />
            </div>
          </div>

          <div className="comfort-text-side flex-column gap-20">
            <span className="badge badge-emerald font-bold text-xs uppercase width-fit">
              Máximo Confort e Integración
            </span>
            <h2 className="text-gradient-white text-36 font-extrabold leading-tight">
              Viajá como te merecés todos los días.
            </h2>
            <p className="text-muted text-16 leading-relaxed">
              Combis equipadas con sillones reclinables ergonométricos, Wi-Fi gratis a bordo, aire acondicionado y comunidad respetuosa de vecinos y compañeros.
            </p>

            <ul className="comfort-checklist flex-column gap-12 margin-top-8 text-15">
              <li className="flex-center-left gap-10">
                <CheckCircle2 size={18} className="text-emerald" />
                <span><strong>Asiento reservado e individual</strong> — Sin viajar de pie ni amontonado.</span>
              </li>
              <li className="flex-center-left gap-10">
                <CheckCircle2 size={18} className="text-emerald" />
                <span><strong>Wi-Fi gratis a bordo</strong> — Aprovechá el viaje para trabajar o estudiar.</span>
              </li>
              <li className="flex-center-left gap-10">
                <CheckCircle2 size={18} className="text-emerald" />
                <span><strong>Sin trasbordos engorrosos</strong> — De tu zona directo al destino.</span>
              </li>
            </ul>

            <button
              type="button"
              className="btn-primary btn-hero-lg font-bold text-16 width-fit margin-top-12 flex-center gap-8 shadow-emerald"
              onClick={() => onEnterApp('CREATE')}
            >
              <PlusCircle size={18} /> ¡Quiero Reservar Mi Lugar!
            </button>
          </div>
        </div>
      </section>

      {/* 5. SEGURIDAD Y VERIFICACIÓN DE CHOFERES */}
      <section id="seguridad" className="landing-section padding-v-60 bg-dark-subtle">
        <div className="container max-w-1100 margin-auto text-center">
          <span className="badge badge-indigo font-bold text-xs uppercase margin-bottom-8">
            Seguridad Garantizada
          </span>
          <h2 className="text-gradient-white text-36 font-extrabold">
            Tu tranquilidad es nuestra prioridad N° 1
          </h2>

          <div className="grid-3-col gap-24 margin-top-40">
            <div className="card glass-card padding-28 text-center flex-column align-center gap-12">
              <div className="icon-badge text-indigo bg-indigo-subtle padding-14 border-radius-14">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-18 text-white">Conductores Habilitados</h3>
              <p className="text-muted text-13 leading-relaxed">
                Choferes con licencia profesional D2, registro de antecedentes penales limpio y seguros al día.
              </p>
            </div>

            <div className="card glass-card padding-28 text-center flex-column align-center gap-12">
              <div className="icon-badge text-emerald bg-emerald-subtle padding-14 border-radius-14">
                <Navigation size={32} />
              </div>
              <h3 className="font-bold text-18 text-white">Monitoreo GPS en Vivo</h3>
              <p className="text-muted text-13 leading-relaxed">
                Todas las combis emiten su ubicación satelital en tiempo real durante todo el itinerario trazado.
              </p>
            </div>

            <div className="card glass-card padding-28 text-center flex-column align-center gap-12">
              <div className="icon-badge text-amber bg-amber-subtle padding-14 border-radius-14">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-18 text-white">Comunidad Validada</h3>
              <p className="text-muted text-13 leading-relaxed">
                Pasajeros con identidad verificada por e-mail institucional, universitario o DNI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIOS REALES */}
      <section id="testimonios" className="landing-section padding-v-60">
        <div className="container max-w-1100 margin-auto text-center">
          <span className="badge badge-amber font-bold text-xs uppercase margin-bottom-8">
            Opiniones de la Comunidad
          </span>
          <h2 className="text-gradient-white text-36 font-extrabold">
            Lo que dicen nuestros pasajeros
          </h2>

          <div className="grid-3-col gap-24 margin-top-40">
            <div className="card glass-card padding-24 flex-column flex-between text-left">
              <div>
                <div className="flex-center-left gap-4 text-amber margin-bottom-12">
                  <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" />
                </div>
                <p className="text-muted text-14 italic leading-relaxed">
                  "Antes me gastaba una fortuna en Uber desde Pilar a Palermo todos los días. Con TrampoPoints pago un 70% menos y viajo sentado trabajando con la laptop."
                </p>
              </div>
              <div className="margin-top-16 border-top-glass padding-top-12 flex-center-left gap-10">
                <div className="avatar-circle bg-emerald text-dark font-bold text-12 padding-6 border-radius-full">MP</div>
                <div>
                  <strong className="block text-white text-14">Martín Paez</strong>
                  <span className="text-xs text-muted">Ingeniero • Pilar ➔ Palermo</span>
                </div>
              </div>
            </div>

            <div className="card glass-card padding-24 flex-column flex-between text-left">
              <div>
                <div className="flex-center-left gap-4 text-amber margin-bottom-12">
                  <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" />
                </div>
                <p className="text-muted text-14 italic leading-relaxed">
                  "Es genial porque la combi me pasa a buscar a 2 cuadras de casa en Belgrano y me deja en la puerta de la facultad. Salgo a horario exacto."
                </p>
              </div>
              <div className="margin-top-16 border-top-glass padding-top-12 flex-center-left gap-10">
                <div className="avatar-circle bg-indigo text-white font-bold text-12 padding-6 border-radius-full">CR</div>
                <div>
                  <strong className="block text-white text-14">Camila Rivas</strong>
                  <span className="text-xs text-muted">Estudiante UBA • Belgrano ➔ Centro</span>
                </div>
              </div>
            </div>

            <div className="card glass-card padding-24 flex-column flex-between text-left">
              <div>
                <div className="flex-center-left gap-4 text-amber margin-bottom-12">
                  <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" />
                </div>
                <p className="text-muted text-14 italic leading-relaxed">
                  "Como chofer de combi, TrampoPoints me llena los cupos vacíos del recorrido de ida y vuelta. El ruteo por OSRM dobló en cada esquina perfecta."
                </p>
              </div>
              <div className="margin-top-16 border-top-glass padding-top-12 flex-center-left gap-10">
                <div className="avatar-circle bg-amber text-dark font-bold text-12 padding-6 border-radius-full">GL</div>
                <div>
                  <strong className="block text-white text-14">Gustavo López</strong>
                  <span className="text-xs text-muted">Chofer de Flota • San Isidro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (FAQ ACCORDION) */}
      <section id="faq" className="landing-section padding-v-60 bg-dark-subtle">
        <div className="container max-w-900 margin-auto">
          <div className="section-header text-center margin-bottom-40">
            <span className="badge badge-indigo font-bold text-xs uppercase margin-bottom-8">
              Respuestas Rápidas
            </span>
            <h2 className="text-gradient-white text-36 font-extrabold">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="faq-accordion-container flex-column gap-16">
            {faqs.map((faq, idx) => (
              <div key={faq.question} className="faq-item card glass-card padding-20 border-radius-14">
                <button
                  type="button"
                  className="faq-question-btn width-full flex-between align-center text-left background-none border-none cursor-pointer"
                  onClick={() => toggleFaq(idx)}
                >
                  <span className="font-extrabold text-16 text-white flex-center-left gap-10">
                    <HelpCircle size={18} className="text-emerald" />
                    {faq.question}
                  </span>
                  {openFaqIndex === idx ? (
                    <ChevronUp size={20} className="text-emerald" />
                  ) : (
                    <ChevronDown size={20} className="text-muted" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="faq-answer-content margin-top-14 border-top-glass padding-top-12 text-muted text-14 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION FINAL DE ALTO IMPACTO */}
      <section className="landing-cta-banner padding-v-80 text-center relative overflow-hidden">
        <div className="hero-background-glow" />
        <div className="container max-w-900 margin-auto flex-column align-center gap-24 relative z-10">
          <h2 className="text-gradient-white text-42 font-extrabold">
            ¿Qué esperás para cambiar tu forma de viajar?
          </h2>
          <p className="text-muted text-18 max-w-650">
            Sumate hoy a la comunidad de movilidad inteligente. Cargá tu solicitud en 30 segundos y descubrí tu combi asignada.
          </p>

          <button
            type="button"
            className="btn-primary btn-hero-lg text-20 font-extrabold padding-v-18 padding-h-44 flex-center gap-12 shadow-emerald animate-pulse"
            onClick={() => onEnterApp('CREATE')}
          >
            <PlusCircle size={24} /> ¡Quiero Viajar Ahora! <ArrowRight size={22} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer border-top-glass padding-v-32 text-center text-xs text-muted">
        <div className="container max-w-1200 margin-auto flex-between align-center flex-wrap gap-16">
          <div className="flex-center gap-8">
            <Bus size={16} className="text-emerald" />
            <strong className="text-white">TrampoPoints Argentina</strong> © 2026. Todos los derechos reservados.
          </div>
          <div className="flex-center gap-16">
            <a href="#como-funciona" className="hover-white">Cómo Funciona</a>
            <a href="#tarifas" className="hover-white">Tarifas</a>
            <a href="#seguridad" className="hover-white">Seguridad</a>
            <a href="#faq" className="hover-white">Preguntas Frecuentes</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
