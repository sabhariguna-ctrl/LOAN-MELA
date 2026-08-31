import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  ArrowUpRight, 
  Globe2, 
  ShieldCheck, 
  SendHorizontal 
} from 'lucide-react';

const GREEN = '#15A362';
const DARK = '#0A0F0D';
const CARD_DARK = '#101915';
const FONT_HEAD = "'Plus Jakarta Sans', 'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

export default function ContactSection() {
  return (
    <section 
      className="relative overflow-hidden px-6 md:px-10 py-12" // Reduced padding from 20 to 12
      style={{ background: DARK, fontFamily: FONT_BODY }}
    >
      {/* Standard Dotted Texture */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Cinematic Background Glows */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- LEFT SIDE --- */}
          <div>
            <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 text-[12px]"
              style={{ borderColor: 'rgba(21,163,98,0.35)', color: GREEN }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-bold uppercase tracking-widest text-[10px]">Support Live 24/7</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1] mb-6" style={{ fontFamily: FONT_HEAD }}>
              Ready to <br />
              <span style={{ color: GREEN }}>Break Barriers?</span>
            </h2>

            <p className="text-white/40 text-base font-medium mb-10 max-w-md leading-relaxed">
              Connect with our elite loan strategists and get a custom plan in minutes.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-5 group cursor-pointer p-3 rounded-xl transition-all border border-transparent hover:bg-white/5">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#15A362] transition-all duration-300">
                  <PhoneCall className="text-[#15A362] group-hover:text-[#0A0F0D]" size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Hotline</p>
                  <p className="text-lg font-black text-white">+91 999 888 7766</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group cursor-pointer p-3 rounded-xl transition-all border border-transparent hover:bg-white/5">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#15A362] transition-all duration-300">
                  <Mail className="text-[#15A362] group-hover:text-[#0A0F0D]" size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Elite Support</p>
                  <p className="text-lg font-black text-white">priority@loanmela.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE POWER FORM --- */}
          <div className="relative">
            <div className="p-[1px] rounded-[30px] bg-gradient-to-b from-white/10 to-transparent">
              <div className="p-6 md:p-10 rounded-[29px]" style={{ background: CARD_DARK }}>
                <h3 className="text-2xl font-black text-white mb-8" style={{ fontFamily: FONT_HEAD }}>Instant Inquiry</h3>

                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" className="w-full px-5 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-[#15A362] outline-none transition-all font-bold text-white placeholder:text-white/20" />
                    <input type="email" placeholder="Work Email" className="w-full px-5 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-[#15A362] outline-none transition-all font-bold text-white placeholder:text-white/20" />
                  </div>

                  <div className="relative">
                    {/* FIXED: Changed text color to GREEN for the select box to make it stand out and avoid "white" issues */}
                    <select className="w-full px-5 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-[#15A362] outline-none transition-all font-bold text-[#15A362] appearance-none cursor-pointer">
                      <option className="bg-[#101915] text-white">Select Loan Type</option>
                      <option className="bg-[#101915] text-white">Corporate Capital</option>
                      <option className="bg-[#101915] text-white">Personal Growth Loan</option>
                      <option className="bg-[#101915] text-white">Real Estate Financing</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <ArrowUpRight size={16} className="rotate-90" />
                    </div>
                  </div>

                  <textarea rows="3" placeholder="How can we empower you?" className="w-full px-5 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-[#15A362] outline-none transition-all font-bold text-white placeholder:text-white/20 resize-none"></textarea>

                  <button className="group w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all duration-500 transform active:scale-95 shadow-[0_10px_20px_rgba(21,163,98,0.2)]"
                    style={{ background: GREEN, color: DARK }}
                  >
                    Send Application
                    <SendHorizontal className="group-hover:translate-x-2 transition-transform" size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 hidden md:flex" style={{ background: CARD_DARK }}>
               <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                 <Globe2 className="text-yellow-400" size={16} />
               </div>
               <div>
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">Global</p>
                 <p className="text-[12px] font-black text-white">40+ Countries</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}