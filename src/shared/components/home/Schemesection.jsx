import React, { useEffect, useRef, useState } from 'react';
import {
  Bike, Home, Briefcase, GraduationCap, Truck, Wallet,
  Car, Building2, Wrench, TrendingUp, BookOpen, Award,
  Gem, ChevronRight, FileCheck2, Percent, Layers,
  MessageCircleQuestion, PhoneCall, Sparkles, Flame, Users2, LayoutGrid,
  ArrowUpRight,
} from 'lucide-react';

const GREEN = '#15A362';
const DARK = '#0A0F0D';
const CARD_DARK = '#101915';
const GOLD = '#F0A93A';

const FONT_SERIF = "'Playfair Display', Georgia, serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const FONT_HEAD = "'Plus Jakarta Sans', 'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

const CATEGORIES = [
  {
    id: 'vehicle', name: 'Vehicle Loans', icon: Bike,
    blurb: 'For anything with wheels', appliedThisWeek: '1,240',
    schemes: [
      { icon: Bike, name: 'Bike Loan', rate: '10.5% p.a.', docs: ['PAN Card', 'Aadhar Card', 'Driving License'], popular: true },
      { icon: Car, name: 'Car Loan', rate: '9.2% p.a.', docs: ['PAN Card', 'Aadhar Card', 'Income Proof'] },
      { icon: Truck, name: 'Commercial Vehicle Loan', rate: '11.5% p.a.', docs: ['PAN Card', 'RC Book', 'GST Certificate'] },
    ],
  },
  {
    id: 'home', name: 'Home & Property', icon: Home,
    blurb: 'Buy, renovate or borrow against property', appliedThisWeek: '860',
    schemes: [
      { icon: Home, name: 'Home Loan', rate: '8.4% p.a.', docs: ['PAN Card', 'Aadhar Card', 'Property Papers', 'Income Proof'], popular: true },
      { icon: Building2, name: 'Loan Against Property', rate: '9.8% p.a.', docs: ['PAN Card', 'Title Deed', 'Income Proof'] },
      { icon: Wrench, name: 'Home Renovation Loan', rate: '10.2% p.a.', docs: ['PAN Card', 'Aadhar Card', 'Renovation Estimate'] },
    ],
  },
  {
    id: 'business', name: 'Business & MSME', icon: Briefcase,
    blurb: 'Fuel your shop, unit or startup', appliedThisWeek: '2,105',
    schemes: [
      { icon: TrendingUp, name: 'MSME Loan', rate: '9.5% p.a.', docs: ['Udyam Registration', 'PAN Card', 'Bank Statement'], popular: true },
      { icon: Briefcase, name: 'Business Loan', rate: '10.5% p.a.', docs: ['PAN Card', 'GST Certificate', 'Bank Statement'] },
      { icon: Layers, name: 'Working Capital Loan', rate: '11% p.a.', docs: ['GST Returns', 'Bank Statement'] },
    ],
  },
  {
    id: 'education', name: 'Education & Career', icon: GraduationCap,
    blurb: 'Invest in courses and degrees', appliedThisWeek: '540',
    schemes: [
      { icon: GraduationCap, name: 'Education Loan', rate: '7.9% p.a.', docs: ['Admission Letter', 'Fee Structure', 'PAN Card'], popular: true },
      { icon: BookOpen, name: 'Skill Certification Loan', rate: '8.5% p.a.', docs: ['Enrollment Proof', 'PAN Card'] },
    ],
  },
  {
    id: 'gig', name: 'Gig & Delivery Partner', icon: Truck,
    blurb: 'For riders and platform partners', appliedThisWeek: '3,320',
    schemes: [
      { icon: Truck, name: 'Delivery Bhai Loan', rate: '13% p.a.', docs: ['Platform ID Proof', 'PAN Card', 'Aadhar Card'], popular: true },
      { icon: Award, name: 'Cab Driver Loan', rate: '10.8% p.a.', docs: ['Driving License', 'Platform ID Proof', 'PAN Card'] },
    ],
  },
  {
    id: 'personal', name: 'Personal & Gold', icon: Wallet,
    blurb: 'Quick funds for anything else', appliedThisWeek: '1,780',
    schemes: [
      { icon: Wallet, name: 'Personal Loan', rate: '11% p.a.', docs: ['PAN Card', 'Aadhar Card', 'Income Proof'], popular: true },
      { icon: Gem, name: 'Gold Loan', rate: '7.5% p.a.', docs: ['Gold Ownership Proof', 'PAN Card', 'Aadhar Card'] },
    ],
  },
];

const TOTAL_SCHEMES = CATEGORIES.reduce((sum, c) => sum + c.schemes.length, 0);

export default function SchemesSection() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const [visible, setVisible] = useState(true);
  const active = CATEGORIES.find((c) => c.id === activeId);

  const handleSelect = (id) => {
    if (id === activeId) return;
    setVisible(false);
    setTimeout(() => { setActiveId(id); setVisible(true); }, 180);
  };

  return (
    <section
      className="relative overflow-hidden px-6 md:px-10 pt-0 pb-20" /* CHANGED: pt-0 to pull it up */
      style={{ background: DARK, fontFamily: FONT_BODY }}
    >
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute top-0 right-[10%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.06] blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: GREEN, fontFamily: FONT_MONO }}>
              Schemes
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-1" style={{ fontFamily: FONT_SERIF }}>
              Every loan, every lifestyle.
            </h2>
          </div>
          <button className="hidden md:inline-flex items-center gap-1.5 text-[13.5px] font-bold" style={{ color: GREEN, fontFamily: FONT_HEAD }}>
            See all schemes
            <ChevronRight size={15} strokeWidth={3} />
          </button>
        </div>

        <p className="text-white/50 text-[15px] md:text-base leading-relaxed max-w-2xl mb-10">
          Six categories, {TOTAL_SCHEMES}+ individual schemes, one place to compare them all.
          No two borrowers need the same thing. Pick your
          category below, and we'll show you exactly which loans sit inside it, their
          starting rates, and precisely what documents you'll need to apply.
        </p>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">

          {/* Left: category list */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  className="flex-shrink-0 md:flex-shrink flex items-center gap-3 text-left px-4 py-4 rounded-2xl border transition-all min-w-[240px] md:min-w-0"
                  style={{
                    background: isActive ? 'rgba(21,163,98,0.12)' : CARD_DARK,
                    borderColor: isActive ? 'rgba(21,163,98,0.45)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isActive ? 'rgba(21,163,98,0.2)' : 'rgba(255,255,255,0.05)' }}
                  >
                    <cat.icon size={19} style={{ color: isActive ? GREEN : 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[14.5px] truncate text-white" style={{ fontFamily: FONT_SERIF }}>
                      {cat.name}
                    </p>
                    <p className="text-[11.5px] truncate flex items-center gap-1 text-white/40">
                      {cat.schemes.length} loan types
                      <span className="text-white/20">&middot;</span>
                      <Users2 size={10} className="flex-shrink-0" />
                      {cat.appliedThisWeek} this week
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="ml-auto flex-shrink-0 hidden md:block"
                    style={{ color: isActive ? GREEN : 'rgba(255,255,255,0.2)' }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: schemes under selected category */}
          <div
            className="rounded-3xl p-6 md:p-8 overflow-hidden border"
            style={{ background: CARD_DARK, borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className={`transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(21,163,98,0.15)' }}>
                    <active.icon size={21} style={{ color: GREEN }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: FONT_SERIF }}>{active.name}</h3>
                    <p className="text-[13px] text-white/40">{active.blurb}</p>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(21,163,98,0.12)', color: GREEN }}
                >
                  <Users2 size={11} />
                  {active.appliedThisWeek} applied this week
                </span>
              </div>

              <div className="mt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {active.schemes.map((s) => (
                  <div
                    key={s.name}
                    className="py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <s.icon size={17} className="text-white/70" />
                      </div>
                      <div>
                        <p className="font-bold text-[14.5px] flex items-center gap-1.5 text-white" style={{ fontFamily: FONT_SERIF }}>
                          {s.name}
                          {s.popular && (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(240,169,58,0.15)', color: GOLD, fontFamily: FONT_HEAD }}>
                              <Flame size={9} /> Popular
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-white/30" style={{ fontFamily: FONT_MONO }}>FROM</span>
                          <span className="text-[12.5px] font-bold" style={{ color: GREEN, fontFamily: FONT_MONO }}>{s.rate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-white/30 mr-1">
                        <FileCheck2 size={12} /> Needs:
                      </span>
                      {s.docs.map((d) => (
                        <span
                          key={d}
                          className="text-[11.5px] font-medium px-2.5 py-1 rounded-full text-white/60"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <button
                      className="group inline-flex items-center gap-1 text-[13px] font-bold flex-shrink-0 sm:ml-2"
                      style={{ color: GREEN, fontFamily: FONT_HEAD }}
                    >
                      Apply
                      <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-8 relative overflow-hidden rounded-3xl p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 justify-between border"
          style={{ background: 'linear-gradient(120deg, rgba(21,163,98,0.14) 0%, rgba(21,163,98,0.04) 100%)', borderColor: 'rgba(21,163,98,0.2)' }}
        >
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <MessageCircleQuestion size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: FONT_SERIF }}>
                Not sure which category fits you?
                <Sparkles size={14} style={{ color: GOLD }} />
              </p>
              <p className="text-white/50 text-[13.5px] mt-1 max-w-md">
                Answer 3 quick questions and we'll point you to the scheme
                with the best rate for your need.
              </p>
            </div>
          </div>

          <div className="relative flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#052B1B] transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: GREEN, fontFamily: FONT_HEAD }}
            >
              Take the 30-sec quiz
              <ChevronRight size={16} strokeWidth={3} />
            </button>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white border transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.15)', fontFamily: FONT_HEAD }}
            >
              <PhoneCall size={16} />
              Talk to an advisor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}