import React, { useEffect, useRef, useState } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const starCount = 150;
    let mouseX = 0;
    let mouseY = 0;

    class Star {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      opacity: number;
      twinkleSpeed: number;
      parallaxFactor: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.baseOpacity = Math.random() * 0.5 + 0.2;
        this.opacity = this.baseOpacity;
        this.twinkleSpeed = Math.random() * 0.02;
        this.parallaxFactor = Math.random() * 20;
      }

      update(width: number, height: number, mX: number, mY: number) {
        // Twinkle
        this.opacity = this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * 0.2;

        // Slow drift
        this.y -= 0.05;
        if (this.y < 0) this.y = height;

        // Render with parallax offset
        const offsetX = (mX - width / 2) / (100 - this.parallaxFactor);
        const offsetY = (mY - height / 2) / (100 - this.parallaxFactor);

        return { x: this.x + offsetX, y: this.y + offsetY };
      }

      draw(context: CanvasRenderingContext2D, coords: { x: number; y: number }) {
        context.beginPath();
        context.arc(coords.x, coords.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        context.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: starCount }, () => new Star(canvas.width, canvas.height));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        const coords = star.update(canvas.width, canvas.height, mouseX, mouseY);
        star.draw(ctx, coords);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

const Hero: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'How can I adjust these metrics for you?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chartData, setChartData] = useState<number[]>([120, 100, 110, 80, 90, 60, 70, 40, 50, 20]);
  const [weeklyGrowth, setWeeklyGrowth] = useState<string>('+24.5%');
  const [revenue, setRevenue] = useState<string>('$124,500');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chatInput.trim()) {
      const newMessages = [...chatMessages, { role: 'user' as const, text: chatInput }];
      setChatMessages(newMessages);
      setChatInput('');
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'Optimizing metrics based on your request. Generating new trajectory...' }]);
        
        const newChartData = chartData.map((val, i) => Math.max(10, val - (Math.random() * 20 - 5) - i * 2));
        setChartData(newChartData);
        
        setWeeklyGrowth('+' + (24.5 + Math.random() * 15).toFixed(1) + '%');
        setRevenue('$' + (124500 + Math.floor(Math.random() * 30000)).toLocaleString());
      }, 800);
    }
  };

  const generatePath = (data: number[]) => {
    const step = 360 / (data.length - 1);
    let path = `M0,${data[0]}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L${i * step},${data[i]}`;
    }
    return path;
  };

  const generateFillPath = (data: number[]) => {
    return generatePath(data) + ` V200 H0 Z`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-4 pb-20 overflow-hidden bg-black">
      {/* Dynamic Starfield */}
      <Starfield />

      {/* Logo */}
      <div className="mb-20 relative z-10 mt-4 flex items-center justify-center">
        <span className="text-2xl md:text-3xl font-serif font-bold text-white tracking-widest">ALEC </span>
        <span className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400 ml-2 tracking-widest">AI</span>
      </div>

      {/* Headlines */}
      <div className="text-center max-w-5xl px-6 relative z-10 transition-all duration-1000">

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards] leading-[1.1]">
          <span className="text-white">I'm actually</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 animate-gradient-x">Vibecoding!</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards] font-light">
          If you're making <span className="text-white font-medium">$50k/mo+ online</span> and want a hands-off LinkedIn revenue stream, we'll show you exactly how much profit you're leaving on the table.
        </p>

        {/* Hero Dashboard Graphic (Reduced Size) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto mb-0 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards] scale-90 origin-top">
          <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full" />

          {/* Main Dashboard Glass Panel */}
          <div className="glass-panel w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl border border-white/10 relative z-10 overflow-hidden flex flex-col shadow-2xl group hover:border-white/20 transition-all duration-500">

            {/* Dashboard Header */}
            <div className="h-10 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="text-[10px] font-mono text-gray-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Revenue Tracking
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 flex gap-6 relative">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
              />

              {/* Left Column: Profile & LinkedIn */}
              <div className="hidden md:flex flex-col gap-4 w-56 z-10">
                {/* Profile Card */}
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-red-500 to-orange-500">
                    <img src="Logo/jack profile .png" alt="Jack Roberts" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Jack Roberts</div>
                    <div className="text-[10px] text-green-400">Top 1% Creator</div>
                  </div>
                </div>

                {/* LinkedIn Box */}
                <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/20 flex flex-col h-full group/linkedin hover:bg-red-500/10 transition-all relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-2 z-10">
                    <img src="Logo/LinkedIn_logo_initials.png.webp" alt="LinkedIn" className="w-8 h-8 object-contain opacity-80" style={{filter: 'grayscale(100%) brightness(200%)'}} />
                    <div>
                      <div className="text-xl font-bold text-white leading-none">15.2k</div>
                      <div className="text-[10px] text-red-200">Total Followers</div>
                    </div>
                  </div>

                  {/* Pulse Graph */}
                  <div className="flex-1 flex items-end gap-[2px] mt-2 z-10">
                    {[40, 60, 45, 70, 50, 80, 60, 90, 75, 100].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="w-full bg-red-400/40 rounded-t-[1px]" />
                    ))}
                  </div>

                  {/* Glow Background */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/20 blur-xl rounded-full" />
                </div>
              </div>

              {/* Right Column: Chart & Stats & Chatbot */}
              <div className="flex-1 flex flex-col z-10 gap-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider">Total Revenue</div>
                    <div className="text-xl font-bold text-white mt-1">{revenue}</div>
                    <div className="text-green-400 text-[10px] mt-1 flex items-center gap-1">
                      <span>▲</span> 12% vs last month
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider">Pipeline Value</div>
                    <div className="text-xl font-bold text-white mt-1">$52,000</div>
                    <div className="text-green-400 text-[10px] mt-1 flex items-center gap-1">
                      <span>▲</span> 8% vs last month
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 hidden sm:block hover:border-white/10 transition-colors">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider">Booked Calls</div>
                    <div className="text-xl font-bold text-white mt-1">48</div>
                    <div className="text-green-400 text-[10px] mt-1 flex items-center gap-1">
                      <span>▲</span> 24% vs last month
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex gap-4">
                  {/* Enhanced Graph Area */}
                  <div className="flex-[2] bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col group/chart hover:border-white/20 transition-all">
                    <div className="px-6 pt-5 pb-2 flex items-center justify-between z-10">
                      <div>
                        <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Weekly Growth</div>
                        <div className="text-3xl font-bold text-white">{weeklyGrowth}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>

                    {/* Full Width Red Graph */}
                    <div className="flex-1 relative w-full overflow-hidden transition-all duration-700 ease-in-out">
                      <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-50" />
                      <svg className="absolute inset-0 w-full h-full transform scale-x-105 scale-y-110 origin-bottom transition-all duration-700 ease-in-out" preserveAspectRatio="none" viewBox="0 0 360 200">
                        <defs>
                          <linearGradient id="largeRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(227, 24, 55, 0.4)" />
                            <stop offset="100%" stopColor="rgba(227, 24, 55, 0)" />
                          </linearGradient>
                        </defs>
                        <path d={generateFillPath(chartData)}
                          fill="url(#largeRedGradient)"
                          className="transition-all duration-700 ease-in-out"
                        />
                        <path d={generatePath(chartData)}
                          fill="none"
                          stroke="#E31837"
                          strokeWidth="3"
                          vectorEffect="non-scaling-stroke"
                          className="drop-shadow-lg transition-all duration-700 ease-in-out"
                        />
                      </svg>

                      {/* Interactive Vertical Hover Line */}
                      <div className="absolute inset-x-0 inset-y-0 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300">
                        <div className="w-[1px] h-full bg-white/20 absolute left-1/2" />
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/10">
                          {revenue}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chatbot Interface */}
                  <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-inner">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-white tracking-wide">AI Graph Agent</span>
                    </div>
                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scroll-smooth">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`text-[11px] p-2.5 rounded-xl max-w-[90%] leading-relaxed ${msg.role === 'ai' ? 'bg-red-500/10 text-red-100 border border-red-500/20 rounded-tl-sm self-start' : 'bg-white/10 text-white ml-auto border border-white/10 rounded-tr-sm self-end'}`}>
                          {msg.text}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10 bg-black/20">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleChatSubmit}
                        placeholder="Type to adjust graph... (Press Enter)" 
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

              </div>



            </div>
          </div>

          <style>{`
            @keyframes growUp {
              from { height: 0; opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>

        {/* CTA Button */}
        <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards] relative group mt-8 inline-flex justify-center items-center">
          {/* Animated Glow Ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

          {/* Cosmic red glow behind button */}
          <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60 rounded-xl overflow-hidden">
            <div className="absolute inset-0 animate-[cosmicShift_14s_ease-in-out_infinite]"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(227, 24, 55, 0.4) 0%, transparent 60%)',
                filter: 'blur(10px)'
              }} />
          </div>

          <button
            onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative z-10 flex items-center gap-2 bg-white text-black px-8 py-3.5 text-base font-bold hover:bg-gray-100 transition-all rounded-xl cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] group/btn"
          >
            Scale My Business
          </button>
        </div>
      </div>

      {/* Enhanced Breathing Horizon Glow */}
      <div className="absolute bottom-60 left-[-30%] w-[160%] h-[400px] z-0 pointer-events-none animate-[pulse_8s_ease-in-out_infinite]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(227, 24, 55, 0.2) 0%, transparent 75%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '50% / 100% 100% 0 0',
          filter: 'blur(40px)'
        }} />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cosmicShift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translate(8px, -6px) scale(1.05);
            opacity: 1;
          }
          50% {
            transform: translate(-6px, 8px) scale(0.98);
            opacity: 0.6;
          }
          75% {
            transform: translate(4px, 4px) scale(1.02);
            opacity: 0.85;
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        @keyframes cosmicButtonGlow {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.6;
          }
          33% {
            transform: scale(1.1) translate(3px, -3px);
            opacity: 0.8;
          }
          66% {
            transform: scale(1.05) translate(-3px, 3px);
            opacity: 0.7;
          }
        }

        @keyframes fadeInGlow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Custom scrollbar for chatbot */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default Hero;
