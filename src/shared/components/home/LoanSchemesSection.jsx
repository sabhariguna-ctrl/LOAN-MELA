import React, { useState } from "react";
import {
  Briefcase, Bike, Car, Home, GraduationCap, Sprout, Stethoscope,
  ArrowRight, CheckCircle2, Sparkles,
} from "lucide-react";

/* LoanMela official palette — now matches Navbar / Footer / About / Loanschema / Login */
const PRIMARY = "#2f76fb";  // BLUE
const NAVY = "#132261";     // NAVY
const LAVENDER = "#89b6f8"; // BLUE_LIGHT
const MUTED = "#757e9e";    // SLATE
const BORDER = "#d9e7f9";   // BLUE_TINT
const SKY = "#f0f6fc";      // BLUE_PALE
const WHITE = "#fdfdfd";    // WHITE

const CATEGORIES = [
  {
    key: "business",
    icon: Briefcase,
    title: "Business & MSME",
    tagline: "For traders, shop owners & entrepreneurs",
    img: "/images/shopowner.jpg",
    desc: "Whether you're launching your first venture or scaling an existing shop, this category covers capital for growth, stock and daily operations.",
    subs: ["Startup Loan", "Working Capital", "Inventory Finance", "Shop Expansion", "Equipment Finance"],
  },
  {
    key: "gig",
    icon: Bike,
    title: "Gig Workers & Self-Employed",
    tagline: "For riders, drivers, freelancers & creators",
    img: "/images/delivery partner.jpg",
    desc: "Built for India's growing gig economy — finance for the vehicle, gear or tools that directly power your daily income.",
    subs: ["Delivery Partner", "Bike Purchase", "Cab / Taxi", "Freelancer", "Photographer", "Professional Equipment"],
  },
  {
    key: "vehicle",
    icon: Car,
    title: "Vehicle Finance",
    tagline: "For personal & commercial vehicle buyers",
    img: "/images/car loan.jpg",
    desc: "From your first two-wheeler to a commercial fleet vehicle, get financing matched to how the vehicle will be used.",
    subs: ["Two-Wheeler", "Car", "EV", "Commercial Vehicle", "Used Vehicle"],
  },
  {
    key: "home",
    icon: Home,
    title: "Home & Property",
    tagline: "For homeowners & land buyers",
    img: "/images/homeloan.jpg",
    desc: "Purchase a new home, build on your own plot, or improve the one you have — with terms suited to long-term repayment.",
    subs: ["Home Purchase", "Construction", "Renovation", "Plot Purchase", "Loan Against Property"],
  },
  {
    key: "education",
    icon: GraduationCap,
    title: "Education & Career",
    tagline: "For students & upskilling professionals",
    img: "/images/eductional loan.jpg",
    desc: "Invest in higher studies, an overseas program, or a certification that moves your career forward.",
    subs: ["Higher Education", "Study Abroad", "Skill Development", "Professional Courses"],
  },
  {
    key: "agriculture",
    icon: Sprout,
    title: "Agriculture",
    tagline: "For farmers & rural entrepreneurs",
    img: "/images/agriculture.jpg",
    desc: "Seasonal and asset-based finance for farming and allied activities, sized to your land, crop cycle and equipment needs.",
    subs: ["Crop", "Tractor", "Farm Equipment", "Dairy", "Poultry"],
  },
  {
    key: "professional",
    icon: Stethoscope,
    title: "Professional Finance",
    tagline: "For doctors, technicians & specialists",
    img: "/images/doctor.jpg",
    desc: "Equipment and asset finance for professionals whose tools of trade are also their biggest investment.",
    subs: ["Medical Equipment", "Computer / Laptop", "Camera", "Tools", "Machinery"],
  },
];

export default function LoanSchemesSection() {
  const [active, setActive] = useState(CATEGORIES[0].key);
  const current = CATEGORIES.find((c) => c.key === active);

  return (
    <section id="schemes" className="relative overflow-hidden py-20 md:py-28" style={{ background: `linear-gradient(180deg, ${WHITE} 0%, ${SKY} 100%)` }}>

      {/* decorative accents */}
      <div className="absolute -top-10 right-[8%] w-64 h-64 rounded-full pointer-events-none" style={{ background: `${LAVENDER}14`, filter: "blur(60px)" }} />
      <div className="absolute bottom-0 left-[4%] w-72 h-72 rounded-full pointer-events-none" style={{ background: `${PRIMARY}10`, filter: "blur(70px)" }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10">
        {/* header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full" style={{ background: "#d9e7f9" }}>
            <Sparkles size={12} style={{ color: PRIMARY }} />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: PRIMARY }}>
              Loan Schemes
            </span>
          </div>
          <h2 className="font-head font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4" style={{ color: NAVY }}>
            7 Categories. 30+ Purposes.{" "}
            <span style={{ color: PRIMARY }}>One Genuine Match.</span>
          </h2>
          <p className="text-[15px] md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
            Pick the category closest to your need — every purpose below is
            mapped to a real, lender-assessed loan product. Final approval,
            rate and amount always rest with the participating lender.
          </p>
        </div>

        {/* category chip selector */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap md:justify-center md:overflow-visible scrollbar-hide">
          {CATEGORIES.map((c) => {
            const isActive = active === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-[13.5px] transition-all duration-300 border"
                style={{
                  background: isActive ? `linear-gradient(135deg, ${PRIMARY}, ${LAVENDER})` : WHITE,
                  color: isActive ? WHITE : NAVY,
                  borderColor: isActive ? "transparent" : `${BORDER}80`,
                  boxShadow: isActive ? "0 10px 24px rgba(47,118,251,0.28)" : "0 2px 8px rgba(19,34,97,0.06)",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
              >
                <c.icon size={16} />
                {c.title}
              </button>
            );
          })}
        </div>

        {/* active category detail panel */}
        <div
          key={current.key}
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-0 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(19,34,97,0.15)] animate-[lm-fade-in_0.5s_ease]"
          style={{ background: WHITE, border: `1px solid ${BORDER}50` }}
        >
          {/* image side */}
          <div className="relative h-64 lg:h-auto">
            <img src={current.img} alt={current.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${NAVY}10 0%, ${NAVY}b0 100%)` }} />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${LAVENDER})` }}>
                <current.icon size={22} color={WHITE} />
              </div>
              <p className="font-head font-extrabold text-2xl text-white leading-tight">{current.title}</p>
              <p className="text-[12.5px] text-white/75 mt-1">{current.tagline}</p>
            </div>
          </div>

          {/* details side */}
          <div className="p-7 md:p-10 flex flex-col justify-center">
            <p className="text-[14.5px] md:text-[15px] leading-relaxed mb-6" style={{ color: MUTED }}>
              {current.desc}
            </p>

            <p className="text-[11.5px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: PRIMARY }}>
              Purposes Covered
            </p>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {current.subs.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: SKY, color: NAVY, border: `1px solid ${BORDER}70` }}
                >
                  <CheckCircle2 size={13} style={{ color: PRIMARY }} />
                  {s}
                </span>
              ))}
            </div>

            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="group self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[14px] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${LAVENDER})`, color: WHITE }}
            >
              Check My Eligibility
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lm-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}