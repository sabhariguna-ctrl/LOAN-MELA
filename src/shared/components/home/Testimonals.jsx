import React, { useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, CircleDollarSign, Landmark, TrendingUp } from 'lucide-react';

const GREEN = '#15A362';
const DARK = '#0A0F0D';
const FONT_HEAD = "'Plus Jakarta Sans', 'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

export default function LoanCommandCenter() {
  const [amount, setAmount] = useState(500000); 
  const [tenure, setTenure] = useState(12);
  const rate = 10.5;

  const MAX_AMOUNT = 5000000; 

  const calculateEMI = () => {
    const r = rate / (12 * 100);
    const emi = (amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
    return Math.round(emi).toLocaleString('en-IN');
  };

  const scaleFactor = 1 + (amount / MAX_AMOUNT) * 0.15; 
  const glowIntensity = (amount / MAX_AMOUNT) * 60; 

  return (
    <section 
      className="relative overflow-hidden px-6 md:px-10 py-20" 
      style={{ background: DARK, fontFamily: FONT_BODY }}
    >
      {/* ADDED: Standard Dotted Texture to match Navbar/Hero */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Standard Green Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full -z-10 transition-all duration-700"
        style={{ opacity: 0.1 + (amount / MAX_AMOUNT) * 0.3 }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
           <p className="text-[12px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: GREEN }}>
              Command Center
            </p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none" style={{ fontFamily: FONT_HEAD }}>
            Control Your <span style={{ color: GREEN }}>Pulse.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: SLIDERS (Using CARD_DARK style) */}
          <div className="bg-white/5 backdrop-blur-xl p-10 md:p-14 rounded-[40px] border border-white/10 shadow-2xl">
            <div className="space-y-12">
              
              {/* Amount Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Adjust Loan Amount</label>
                  <span className="text-4xl font-black" style={{ color: GREEN }}>
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input 
                  type="range" min="100000" max={MAX_AMOUNT} step="50000"
                  value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#15A362]"
                />
              </div>

              {/* Tenure Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Repayment Period</label>
                  <span className="text-3xl font-black text-[#F0A93A]">{tenure} Months</span>
                </div>
                <input 
                  type="range" min="6" max="60" step="6"
                  value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F0A93A]"
                />
              </div>

              {/* EMI Display */}
              <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Monthly EMI</p>
                    <p className="text-4xl font-black text-white">₹{calculateEMI()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Interest Rate</p>
                    <p className="text-2xl font-black" style={{ color: GREEN }}>{rate}% p.a</p>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT: THE INTERACTIVE VAULT CIRCLE */}
          <div className="relative flex justify-center items-center">
             
             <div 
                className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex items-center justify-center transition-all duration-500 ease-out"
                style={{ transform: `scale(${scaleFactor})` }} 
             >
                {/* Outer Dashed Spinning Ring */}
                <div 
                  className="absolute inset-0 border-[8px] border-dashed border-[#15A362]/20 rounded-full animate-[spin_30s_linear_infinite]" 
                  style={{ opacity: 0.2 + (amount / MAX_AMOUNT) * 0.8 }}
                />
                
                {/* Inner Glow Circle */}
                <div 
                   className="w-[85%] h-[85%] bg-gradient-to-br from-[#101915] to-[#0A0F0D] border border-white/10 rounded-full flex flex-col items-center justify-center relative"
                   style={{ boxShadow: `0 0 ${glowIntensity}px rgba(21,163,98,0.3)` }}
                >
                  <CircleDollarSign 
                    size={60} 
                    className="text-[#F0A93A] mb-4"
                    style={{ transform: `translateY(${amount > 2500000 ? '-5px' : '0px'})` }}
                  />
                  
                  <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-2">Approved Limit</h4>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                      ₹{(amount/100000).toFixed(1)}L
                    </span>
                  </div>

                  <button className="absolute -bottom-5 bg-[#15A362] text-[#052B1B] px-8 py-3.5 rounded-full font-black text-[13px] shadow-[0_15px_30px_rgba(21,163,98,0.3)] hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest">
                    Claim ₹{(amount/100000).toFixed(0)}L <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>

                {/* Floating Tags */}
                <div className="absolute top-10 right-0 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 animate-pulse hidden md:block">
                  <TrendingUp className="text-[#15A362] mb-1" size={18} />
                  <p className="text-[9px] font-black">AI SECURE</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

