import React, { useState } from 'react';
import { 
  Presentation, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Zap,
  Volume2
} from 'lucide-react';

export const JudgePitchMode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Slide 1: Problem Statement & Core Mission",
      subtitle: "Smart India Hackathon 2026 · PS 26163 · NTRO",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-cyber-950 border border-cyber-800 rounded-xl">
            <h4 className="text-cyan-400 font-mono font-bold text-sm mb-1">THE NTRO MANDATE</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conduct a complete <strong>Vulnerability Assessment & Penetration Testing (VAPT)</strong> of the real-world, open-source platform <strong>World Monitor</strong> across 7 mandated security domains.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-cyber-900 border border-cyber-700 rounded-lg text-center">
              <span className="text-cyan-400 font-bold block text-sm">1. FIND</span>
              <span className="text-slate-400 text-[11px]">Uncover vulnerabilities</span>
            </div>
            <div className="p-3 bg-cyber-900 border border-cyber-700 rounded-lg text-center">
              <span className="text-cyan-400 font-bold block text-sm">2. EXPLAIN</span>
              <span className="text-slate-400 text-[11px]">Detail real-world impact</span>
            </div>
            <div className="p-3 bg-cyber-900 border border-cyber-700 rounded-lg text-center">
              <span className="text-cyan-400 font-bold block text-sm">3. PROVE</span>
              <span className="text-slate-400 text-[11px]">Safe, controlled PoC</span>
            </div>
            <div className="p-3 bg-cyber-900 border border-cyber-700 rounded-lg text-center">
              <span className="text-cyan-400 font-bold block text-sm">4. RECOMMEND</span>
              <span className="text-slate-400 text-[11px]">Engineering fix</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Slide 2: The Solution — Watchtower",
      subtitle: "\"World Monitor watches the world. Watchtower watches World Monitor.\"",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-cyber-900 to-blue-950/40 border border-cyan-500/40 rounded-xl space-y-2">
            <h4 className="text-cyan-300 font-bold text-sm">Purpose-Built VAPT & Security Evaluation Engine</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              Watchtower does the inspection and writes the report for you. It runs automated scans against your local World Monitor copy, lets your team manually confirm which findings are real (eliminating false alarms), calculates CVSS v3.1 scores, and generates the exact formal PDF report NTRO asked for in one click.
            </p>
          </div>

          <div className="p-3 bg-cyber-950 border border-cyber-800 rounded-lg text-xs font-mono text-slate-400">
            <strong className="text-amber-400">The Golden Rule:</strong> 100% testing on self-hosted local sandbox (127.0.0.1 sinkhole), zero impact on production users.
          </div>
        </div>
      )
    },
    {
      title: "Slide 3: The 7 Mandated Pillars Mapped",
      subtitle: "Exhaustive coverage of every attack surface required by NTRO",
      content: (
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg">
            <strong className="text-cyan-400 block">1. Authentication & Sessions</strong>
            <span className="text-slate-400 text-[11px]">Weak tokens, fixation, Clerk advisory</span>
          </div>
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg">
            <strong className="text-cyan-400 block">2. Authorization & RBAC</strong>
            <span className="text-slate-400 text-[11px]">BOLA/IDOR in user-prefs mutation</span>
          </div>
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg">
            <strong className="text-cyan-400 block">3. Input Validation</strong>
            <span className="text-slate-400 text-[11px]">SSRF in RSS & notification webhook proxies</span>
          </div>
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg">
            <strong className="text-cyan-400 block">4. API Security</strong>
            <span className="text-slate-400 text-[11px]">Rate limiting bypass on high-cost AI routes</span>
          </div>
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg">
            <strong className="text-cyan-400 block">5. Client-Side Security</strong>
            <span className="text-slate-400 text-[11px]">Deck.gl WebGL supply-chain advisories</span>
          </div>
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg">
            <strong className="text-cyan-400 block">6. Secure Communication</strong>
            <span className="text-slate-400 text-[11px]">Missing HSTS, TLS downgrade, CORS wildcard</span>
          </div>
          <div className="p-2.5 bg-cyber-950 border border-cyber-800 rounded-lg col-span-2">
            <strong className="text-cyan-400 block">7. Data Storage & Privacy (DPDP Act 2023)</strong>
            <span className="text-slate-400 text-[11px]">Raw telemetry retention in Redis without anonymization or TTL</span>
          </div>
        </div>
      )
    },
    {
      title: "Slide 4: Architecture & Workflow",
      subtitle: "Dashboard → API Server → Scanners → Human Triage → CVSS → Report Engine",
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 bg-cyber-950 border border-cyber-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-cyan-400 font-bold">1. Recon Engine</span>
              <span>Maps 60+ API endpoints & files</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-purple-400 font-bold">2. Automated Scanners</span>
              <span>SAST, npm-audit, Headers → "Unverified"</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-amber-400 font-bold">3. Human Triage</span>
              <span>Manual reproduction & False Positive rejection</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-rose-400 font-bold">4. CVSS v3.1 Engine</span>
              <span>Consistent mathematical severity scoring</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-emerald-400 font-bold">5. NTRO Report Engine</span>
              <span>1-Click PDF & JSON export</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const faqs = [
    {
      q: "Why aren't you testing the real live app?",
      a: "NTRO's own rules say no impact on production users — so we self-host our own copy of the open-source app and test that instead. It's the same code, zero risk."
    },
    {
      q: "Isn't this just running a free scanner?",
      a: "The scanner is only step one. Every single flag gets manually re-checked by our team before it's counted — that's the actual security work, and it's what turns a raw scan into a trustworthy report."
    },
    {
      q: "What makes your tool different from Burp or Nessus?",
      a: "Those are generic scanners. Watchtower is purpose-built around NTRO's exact reporting format — it takes you from scan to a submission-ready report in one flow, with CVSS scoring built in."
    },
    {
      q: "How do you know your findings aren't false positives?",
      a: "That's exactly what our manual validation step is for — nothing is marked 'Confirmed' until a team member reproduces it themselves."
    },
    {
      q: "Is this legal/ethical?",
      a: "Yes — we only ever test our own self-hosted instance, never production, and we follow OWASP's standard ethical testing methodology."
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <Presentation className="w-4 h-4 text-cyan-400" />
          <span>HACKATHON DEMO & JURY DEFENSE DECK</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Judge Presentation & Q&A Simulator
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Complete presentation materials, slide progression, elevator pitch scripts (English & Hinglish), and winning answers to tough jury questions directly from the master guide.
        </p>
      </div>

      {/* Hinglish Elevator Pitch Box */}
      <div className="bg-gradient-to-r from-amber-950/30 via-cyber-900 to-amber-950/20 border border-amber-500/40 rounded-xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>HINGLISH ELEVATOR PITCH (BOL KE PRACTICE KARNE KE LIYE)</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">30-Second Hook</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-100/90 italic leading-relaxed font-sans bg-cyber-950/60 p-3 rounded-lg border border-amber-900/40">
          "Sir/Ma'am, NTRO ne humein ek existing app — World Monitor — ki security check karne ko bola hai. Humne uske liye ek tool banaya hai jiska naam hai Watchtower. Yeh tool automatically scan karta hai, phir hum manually confirm karte hain ki bug real hai ya nahi, uske baad severity score deta hai, aur last mein ek professional report bana deta hai — bilkul waisi jaisi NTRO ne maangi hai. Hum sirf apne khud ke local copy pe test kar rahe hain, real users ko kabhi touch nahi karte."
        </p>
      </div>

      {/* Interactive Slide Viewer */}
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400">{slides[currentSlide].title}</span>
            <h3 className="text-base font-bold text-white mt-0.5">{slides[currentSlide].subtitle}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400 mr-2">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-lg bg-cyber-800 text-slate-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide(s => Math.min(slides.length - 1, s + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-1.5 rounded-lg bg-cyber-800 text-slate-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="min-h-[180px]">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Judge Q&A FAQ Accordion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Tough Judge Questions & Winning Answers</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Battle-tested responses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold font-mono text-cyan-300 flex items-start space-x-2">
                <span className="text-cyan-500">Q:</span>
                <span>"{faq.q}"</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pl-5 font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
