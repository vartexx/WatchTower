import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, BookOpen } from 'lucide-react';

export const AegisJudgePitch: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Slide 1: Problem Statement & Core NTRO Mandate",
      subtitle: "Smart India Hackathon 2026 · PS 26163 · NTRO",
      content: (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-[#0c1820] border border-[#31525b] rounded-sm">
            <h4 className="text-[#6be1d6] font-syne font-bold text-sm mb-1 uppercase">THE NTRO MANDATE</h4>
            <p className="text-[#7f939d] leading-relaxed">
              Conduct an end-to-end <strong>Vulnerability Assessment & Penetration Testing (VAPT)</strong> of the real-world, open-source intelligence platform <strong>World Monitor</strong> across 7 mandated security domains.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
              <span className="text-[#6be1d6] font-syne font-bold block text-sm">1. FIND</span>
              <span className="text-[#7f939d] text-[10px]">Uncover flaws across 7 pillars</span>
            </div>
            <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
              <span className="text-[#6be1d6] font-syne font-bold block text-sm">2. EXPLAIN</span>
              <span className="text-[#7f939d] text-[10px]">Quantify impact via CVSS 3.1</span>
            </div>
            <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
              <span className="text-[#6be1d6] font-syne font-bold block text-sm">3. PROVE</span>
              <span className="text-[#7f939d] text-[10px]">Safe, controlled PoC tests</span>
            </div>
            <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
              <span className="text-[#6be1d6] font-syne font-bold block text-sm">4. RECOMMEND</span>
              <span className="text-[#7f939d] text-[10px]">Concrete remediation guide</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Slide 2: The House Analogy (Pitch Hook for Judges)",
      subtitle: "\"World Monitor is a newly constructed house; we are the safety inspectors.\"",
      content: (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-[#122832] border border-[#3a6267] rounded-sm">
            <h4 className="text-[#c2e66b] font-syne font-bold text-sm mb-2">HOW TO EXPLAIN TO NON-TECHNICAL JUDGES:</h4>
            <blockquote className="border-l-2 border-[#6be1d6] pl-3 italic text-[#e6edf0] leading-relaxed">
              "Think of World Monitor like a high-security embassy building newly opened to the public. Our team didn't build a new embassy — NTRO hired us to test every door, lock, window, and security guard on duty. We proved which locks could be picked with safe demonstration keys, and provided an official certified remediation blueprint."
            </blockquote>
          </div>
        </div>
      )
    },
    {
      title: "Slide 3: Core Innovations & Differentiation",
      subtitle: "Why Watchtower beats generic scanners (Burp Suite, Nessus)",
      content: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
            <strong className="text-[#6be1d6] font-syne block text-xs">1. Human-in-the-Loop Triage</strong>
            <p className="text-[#7f939d] text-[11px] mt-1">
              Automated scanners dump 500+ false alarms. Watchtower allows analysts to confirm or reject findings, eliminating false positives before official submission.
            </p>
          </div>
          <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
            <strong className="text-[#6be1d6] font-syne block text-xs">2. Safe-Mode 127.0.0.1 Sinkhole</strong>
            <p className="text-[#7f939d] text-[11px] mt-1">
              Demonstrates SSRF and IDOR live during judge presentations without triggering external denial-of-service or touching live cloud assets.
            </p>
          </div>
          <div className="p-3 bg-[#12242c] border border-[#253740] rounded-sm">
            <strong className="text-[#6be1d6] font-syne block text-xs">3. DPDP Act 2023 Statutory Compliance</strong>
            <p className="text-[#7f939d] text-[11px] mt-1">
              Maps vulnerabilities directly to Section 8(5) and 8(7) of India's Digital Personal Data Protection Act.
            </p>
          </div>
        </div>
      )
    }
  ];

  const qnaList = [
    {
      q: "Judge: 'Why did you build an automated tool instead of just presenting a PDF report?'",
      a: "A static PDF becomes obsolete the moment new code is committed. Watchtower is a continuous VAPT platform containerized in Docker that runs ongoing SAST, dependency, and header checks as World Monitor evolves."
    },
    {
      q: "Judge: 'How do you ensure you don't crash or corrupt World Monitor during penetration testing?'",
      a: "All active probes run through our 127.0.0.1 loopback sinkhole with non-destructive simulation payloads. We do not drop tables, wipe accounts, or flood external servers."
    },
    {
      q: "Judge: 'What is the most critical vulnerability you discovered?'",
      a: "WM-004 (IDOR on /api/v1/reports/export) with CVSS 9.1 Critical: An authenticated guest analyst could supply another user's report identifier and extract confidential intelligence telemetry."
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-mono">
      {/* Intro */}
      <div className="border-b border-[#253740] pb-4">
        <span className="text-[10px] text-[#6be1d6] tracking-widest uppercase block font-mono">
          EVALUATOR BATTLECARDS & FAQ
        </span>
        <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
          Judge pitch & <em className="text-[#6be1d6] not-italic font-normal">defense</em>
        </h2>
        <p className="text-xs text-[#7f939d] max-w-xl mt-2 leading-relaxed">
          Presentation slides, quick answers to tough questions, and the "House Analogy" script for live judge evaluations.
        </p>
      </div>

      {/* Slide Carousel */}
      <div className="border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] p-6 rounded-sm shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#253740] pb-3">
          <div>
            <h3 className="font-syne font-bold text-lg text-white">{slides[currentSlide].title}</h3>
            <span className="text-[11px] text-[#6be1d6]">{slides[currentSlide].subtitle}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlide(p => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
              className="p-1.5 rounded bg-[#12242c] border border-[#253740] text-[#7f939d] hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#7f939d] font-mono">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlide(p => Math.min(slides.length - 1, p + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-1.5 rounded bg-[#12242c] border border-[#253740] text-[#7f939d] hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="py-2">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Tough Judge Q&A Accordion */}
      <div className="border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] p-6 rounded-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs text-[#6be1d6] uppercase font-syne font-bold">
          <MessageSquare className="w-4 h-4" />
          <span>Anticipated Evaluator Questions & High-Impact Answers</span>
        </div>

        <div className="space-y-3">
          {qnaList.map((item, idx) => (
            <div key={idx} className="p-4 bg-[#0c1820] border border-[#253740] rounded-sm space-y-1.5">
              <strong className="text-xs text-[#efb867] font-syne font-semibold block">{item.q}</strong>
              <p className="text-xs text-[#7f939d] leading-relaxed m-0 font-mono">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
