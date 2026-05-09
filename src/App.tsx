import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, MessageSquare, Phone, School, Cpu, Users, 
  ChevronRight, CheckCircle2, Star, Quote, BookOpen,
  Mail, MapPin, Briefcase, Languages, Clock, GraduationCap
} from 'lucide-react';

import instructorImg from './assets/instructor.jpg';
import bookImg from './assets/book.jpg';

const INSTRUCTOR_IMG = instructorImg;
const BOOK_IMG = bookImg;

import { supabase } from './lib/supabase';

// --- Shared Modal Component ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-panel w-full max-w-lg overflow-hidden rounded-3xl border border-white/10"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h3 className="font-display text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- Form Feedback Component ---
const FormFeedback = ({ status, message }: { status: 'idle' | 'loading' | 'success' | 'error', message: string }) => {
  if (status === 'idle') return null;
  
  const colors = {
    loading: 'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className={`mt-4 p-4 rounded-xl border ${colors[status as keyof typeof colors]} flex items-center gap-3 text-sm font-medium`}>
      {status === 'loading' && <div className="w-4 h-4 border-2 border-primary-fixed border-t-transparent rounded-full animate-spin" />}
      {status === 'success' && <CheckCircle2 size={18} />}
      {status === 'error' && <X size={18} />}
      {message}
    </div>
  );
};

// --- Counter Component for Numbers ---
const Counter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const target = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = target;
    if (start === end) return;

    let totalFrames = Math.round(duration * 60);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * (1 - Math.pow(1 - progress, 2)));
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [target, duration, isVisible]);

  return (
    <motion.span 
      onViewportEnter={() => setIsVisible(true)}
      viewport={{ once: true }}
    >
      {count}{suffix}
    </motion.span>
  );
};

// --- Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(212,240,0,0.1)]">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <a href="#" className="font-display text-2xl md:text-3xl font-extrabold text-primary-fixed tracking-tighter">
          RLN Hindi
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          {['Courses', 'About', 'Corporate', 'Levels', 'Books'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-on-surface-variant hover:text-white transition-colors font-semibold text-sm">
              {item}
            </a>
          ))}
          <button className="bg-primary-fixed text-black font-bold text-sm px-6 py-2 rounded-lg inner-bevel hover:bg-white transition-all transform active:scale-95">
            Book Demo
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {['Courses', 'About', 'Corporate', 'Levels', 'Books'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-on-surface-variant hover:text-white font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="bg-primary-fixed text-black font-bold p-3 rounded-lg w-full">
                Book Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero Component ---
const Hero = ({ onBookDemo }: { onBookDemo: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 px-4 md:px-8 overflow-hidden bg-grid">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary-fixed/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-fixed/10 px-4 py-2 rounded-full border border-primary-fixed/20">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
            <span className="font-display text-[10px] md:text-xs text-primary-fixed uppercase tracking-widest font-bold">
              By R Lakshmi Narayanan — Senior Hindi Educator
            </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-7xl font-extrabold text-white leading-tight">
            Master Spoken Hindi Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed to-secondary-container">English & Tamil</span>
          </h1>
          
          <p className="font-sans text-lg text-on-surface-variant max-w-xl">
            Transform your career and communication with expert-led, practical Hindi training designed for IT professionals, students, and corporate teams.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button onClick={onBookDemo} className="bg-primary-fixed text-black font-bold text-base px-8 py-4 rounded-xl inner-bevel hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary-fixed/20">
              Book Free Demo
            </button>
            <a href="https://wa.me/917010538186" target="_blank" rel="noopener noreferrer" className="bg-transparent text-white border border-white/20 hover:border-primary-fixed hover:text-primary-fixed hover:bg-primary-fixed/5 font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center gap-2">
              <MessageSquare size={20} />
              WhatsApp
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            {[
              { label: 'Years Experience', val: '26+' },
              { label: 'Students Trained', val: '1000+' },
              { label: 'Corporate Clients', val: '15+' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="font-display text-2xl md:text-4xl font-bold text-primary-fixed mb-1">
                  <Counter value={stat.val} />
                </div>
                <div className="font-display text-[10px] md:text-xs text-on-surface-variant uppercase tracking-wider font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[400px] md:h-[600px] w-full flex justify-center items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 pointer-events-none" />
          <img 
            src={INSTRUCTOR_IMG} 
            alt="Instructor" 
            className="h-full object-contain object-bottom drop-shadow-[0_0_40px_rgba(212,240,0,0.15)] filter contrast-125 saturate-110" 
          />
          
          {/* Floating Chips */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-4 md:-left-8 glass-panel px-4 md:px-6 py-3 rounded-xl z-20 flex items-center gap-3"
          >
            <School className="text-primary-fixed" size={24} />
            <div>
              <div className="text-[10px] text-on-surface-variant uppercase font-bold">Focus Area</div>
              <div className="text-xs md:text-base font-bold text-white">Sentence Building</div>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-1/4 -right-4 glass-panel px-4 md:px-6 py-3 rounded-xl z-20 flex items-center gap-3"
          >
            <Briefcase className="text-secondary-container" size={24} />
            <div>
              <div className="text-[10px] text-on-surface-variant uppercase font-bold">Specialty</div>
              <div className="text-xs md:text-base font-bold text-white">Corporate Training</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Levels Component ---
const Levels = () => {
  const levels = [
    {
      id: 'L1',
      name: 'Kanishta',
      level: 'Beginner Level',
      points: ['Basic vocabulary and greetings', 'Simple sentence structure', 'Day-to-day survival phrases'],
      opacity: 'opacity-40'
    },
    {
      id: 'L2',
      name: 'Jyeshta',
      level: 'Intermediate Level',
      points: ['Conversational fluency', 'Tenses and grammar application', 'Role-play scenarios'],
      opacity: 'opacity-70'
    },
    {
      id: 'L3',
      name: 'Shreshta',
      level: 'Advanced Level',
      points: ['Professional & corporate communication', 'Complex negotiations', 'Public speaking & presentations'],
      opacity: 'opacity-100'
    }
  ];

  return (
    <section id="levels" className="py-24 px-4 md:px-8 relative border-t border-white/5 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Structured <span className="text-primary-fixed">Learning Levels</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Progress through our carefully designed tiers to master Hindi fluently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((lvl, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-2xl border-t-4 border-t-primary-fixed/40 hover:border-t-primary-fixed transition-all group relative overflow-hidden"
            >
              <div className={`font-display text-7xl font-bold text-white/5 absolute -top-2 -right-4 group-hover:text-primary-fixed/10 transition-colors`}>
                {lvl.id}
              </div>
              <h3 className="font-display text-2xl font-bold text-primary-fixed mb-1">{lvl.name}</h3>
              <p className="font-display text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-6">{lvl.level}</p>
              <ul className="space-y-4">
                {lvl.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary-fixed shrink-0" size={16} />
                    <span className="text-on-surface text-sm">{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Countdown Component (Next Batch) ---
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ d: 2, h: 0, m: 0, s: 0 });
  const [batchDate, setBatchDate] = useState('');

  useEffect(() => {
    // Set next batch to 2 days from today at 10:00 AM
    const target = new Date();
    target.setDate(target.getDate() + 2);
    target.setHours(10, 0, 0, 0);

    setBatchDate(target.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }));

    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 px-4 md:px-8 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary-fixed/5 border border-primary-fixed/20 rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/10 rounded-full border border-primary-fixed/20 text-primary-fixed text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
              Limited Seats Available
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Next Batch Starts: <span className="text-primary-fixed">{batchDate}</span>
            </h3>
            <p className="text-on-surface-variant text-sm md:text-base max-w-lg">
              Secure your spot for the upcoming live sessions. Enrollment closes 6 hours before the start time.
            </p>
          </div>
          <div className="flex gap-3 md:gap-4">
            {[
              { val: timeLeft.d, label: 'Days' },
              { val: timeLeft.h, label: 'Hrs' },
              { val: timeLeft.m, label: 'Mins' },
              { val: timeLeft.s, label: 'Secs' }
            ].map((unit, i) => (
              <div key={i} className="glass-panel px-4 md:px-6 py-4 rounded-xl text-center min-w-[70px] md:min-w-[90px]">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary-fixed">
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <div className="font-display text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold mt-1 tracking-tighter">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Programs Component ---
const Programs = ({ onEnroll }: { onEnroll: (course: string) => void }) => {
  const courses = [
    { title: 'Spoken Hindi Basics', desc: 'Master the fundamentals of Hindi pronunciation, grammar, and essential vocabulary for beginners.', hours: 30, icon: School },
    { title: 'Hindi for IT Employees', desc: 'Learn professional terminology and polite conversational structures needed for remote and office IT environments.', hours: 40, icon: Cpu },
    { title: 'Hindi for College Students', desc: 'Prepare for north Indian placements and campus interviews with confidence-building speaking sessions.', hours: 35, icon: Users },
    { title: 'Corporate Communication', desc: 'Advanced training focusing on business emails, meetings, presentations, and formal negotiations in Hindi.', hours: 50, icon: Briefcase },
    { title: 'Hindi Through Tamil', desc: 'A specialized program utilizing Tamil phonetic structures and grammar comparisons for faster learning.', hours: 45, icon: Languages },
    { title: 'Daily Conversation', desc: 'Practical role-play scenarios covering shopping, travel, banking, and everyday social interactions.', hours: 30, icon: MessageSquare }
  ];

  return (
    <section id="courses" className="py-24 px-4 md:px-8 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Tailored <span className="text-primary-fixed">Programs</span>
          </h2>
          <p className="text-on-surface-variant max-w-xl">
            Comprehensive courses designed for specific needs, from basic conversational skills to advanced corporate communication.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass-panel p-8 rounded-2xl flex flex-col group relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 blur-3xl group-hover:bg-primary-fixed/10 transition-colors" />
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:border-primary-fixed/50 transition-colors">
                  <course.icon className="text-primary-fixed" size={32} />
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white border border-white/10">Online/Live</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{course.title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 flex-grow">{course.desc}</p>
              <div className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
                <Clock size={16} />
                <span>{course.hours} Hours</span>
              </div>
              <div className="space-y-4">
                <button onClick={() => onEnroll(course.title)} className="w-full py-3 rounded-xl border border-primary-fixed/50 text-primary-fixed font-bold text-sm hover:bg-primary-fixed hover:text-black transition-all group-hover:shadow-[0_0_15px_rgba(212,240,0,0.3)]">
                  Enroll Now
                </button>
                <div className="text-center text-[10px] text-on-surface-variant">
                  Call Us At: <a href="tel:7010538186" className="text-primary-fixed hover:underline">7010538186</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Corporate Component ---
const Corporate = ({ onOpenForm }: { onOpenForm: () => void }) => {
  const orgs = [
    { label: 'Faiveley Transit', short: 'FT' },
    { label: 'Ramco Cements', short: 'RC' },
    { label: 'NACIN', short: 'NC' },
    { label: 'RCI Digitals', short: 'RCI' }
  ];

  const benefits = [
    'Employee Communication Training',
    'Workplace Hindi Communication',
    'Customized Corporate Workshops',
    'Industry-Specific Hindi Vocabulary',
    'Online and Offline Training Sessions',
    'Practical Communication Improvement'
  ];

  return (
    <section id="corporate" className="py-24 px-4 md:px-8 bg-surface-container-low/50 relative border-y border-white/5 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              Corporate <span className="text-primary-fixed">Training Solutions</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Professional Hindi communication training programs for companies, institutions, and organizations. Our corporate training programs are designed to improve communication confidence and collaboration in multilingual work environments.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary-fixed" size={20} />
                  <span className="text-on-surface font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={onOpenForm} className="bg-primary-fixed text-black font-bold px-8 py-4 rounded-xl hover:bg-white transition-all transform hover:scale-105 scale-95">
                Fill Corporate Form
              </button>
              <button className="bg-transparent text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:border-primary-fixed transition-all flex items-center gap-2">
                <Phone size={20} />
                Call us at 7010538186
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { title: 'Custom Curriculum', desc: "Tailored programs designed specifically for your organization's needs and goals." },
              { title: 'Flexible Batch Sizes', desc: "From small teams to large organizations, we accommodate all batch sizes." },
              { title: 'Flexible Scheduling', desc: "Online or offline training at convenient times for your team." },
              { title: 'Progress Tracking', desc: "Detailed reports and analytics to measure employee progress and ROI." }
            ].map((box, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl border border-white/5">
                <h4 className="font-display text-primary-fixed font-bold mb-2">{box.title}</h4>
                <p className="text-on-surface-variant text-sm">{box.desc}</p>
              </div>
            ))}
            
            <div className="col-span-full pt-8">
              <h3 className="font-display text-sm text-on-surface-variant uppercase tracking-widest font-bold mb-6">Organizations We've Trained</h3>
              <div className="grid grid-cols-4 gap-4">
                {orgs.map((org, i) => (
                  <div key={i} className="glass-panel p-4 rounded-xl text-center group cursor-default h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center font-bold text-black mb-2 text-sm group-hover:scale-110 transition-transform">
                      {org.short}
                    </div>
                    <div className="text-[10px] text-on-surface font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      {org.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Instructor Component ---
const Instructor = () => {
  return (
    <section id="about" className="py-24 px-4 md:px-8 bg-surface border-b border-white/5 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Meet Your <span className="text-primary-fixed">Instructor</span></h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Learn from a seasoned professional with a deep passion for language education and corporate communication.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary-fixed/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative glass-panel rounded-3xl p-4 md:p-8">
              <img src={INSTRUCTOR_IMG} alt="Instructor" className="rounded-2xl transition-all duration-700 w-full" />
              <div className="absolute bottom-12 left-12 right-12 glass-panel p-6 rounded-2xl border-primary-fixed/30">
                <h3 className="font-display text-primary-fixed font-bold mb-3">Qualifications</h3>
                <div className="flex flex-wrap gap-2">
                  {['M.A/M.Phil Hindi', 'M.A English', 'B.Ed Hindi'].map((q, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white font-semibold">{q}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">R Lakshmi Narayanan</h3>
              <p className="text-lg text-primary-fixed font-bold">Senior Hindi Educator & Corporate Trainer</p>
              <p className="text-on-surface-variant mt-6 leading-relaxed">
                With over 26 years of dedicated experience in translation and teaching, I specialize in breaking down complex language barriers. My methodology focuses on practical usage, sentence building, and professional communication, enabling learners to speak Hindi confidently in any environment.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Experience', val: '26+', i: Briefcase },
                { label: 'Students', val: '1000+', i: Users },
                { label: 'Corporate', val: '15+', i: Briefcase },
                { label: 'Multilingual', val: '3+', i: Languages }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary-fixed/30 transition-all"
                >
                  <stat.i size={24} className="text-primary-fixed mb-4" />
                  <div className="text-3xl font-bold text-white mb-1">
                    <Counter value={stat.val} />
                  </div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Testimonials Component ---
const Testimonials = () => {
  const reviews = [
    { name: 'Karthik S.', role: 'L2: Jyeshta', text: "The 'Hindi through Tamil' course was a game-changer for me. As an IT professional moving to Pune, I was terrified of the language barrier. RLN sir's methodology made grasping sentence structures incredibly intuitive." },
    { name: 'Priya M.', role: 'L3: Shreshta', text: "We engaged RLN Hindi for our corporate communication workshop. The customized curriculum addressed our exact operational needs in logistics. Highly recommend for any pan-India enterprise." },
    { name: 'Arjun R.', role: 'L1: Kanishta', text: "Starting as a complete beginner, I found the classes very structured. The focus on survival phrases helped me settle into my new role in Delhi within weeks." }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Learner <span className="text-primary-fixed">Success Stories</span></h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Hear from professionals who have transformed their careers through our training.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-3xl relative group"
            >
              <Quote className="absolute top-4 right-6 opacity-10 text-primary-fixed group-hover:opacity-20 transition-opacity" size={64} />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-primary-fixed text-primary-fixed" />)}
                </div>
                <p className="text-on-surface italic mb-8 flex-grow leading-relaxed">"{rev.text}"</p>
                <div className="pt-6 border-t border-white/10">
                  <h4 className="font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-primary-fixed font-bold">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Book Component ---
const Book = ({ onBuy }: { onBuy: () => void }) => {
  return (
    <section id="books" className="py-24 px-4 md:px-8 bg-surface-container-low transition-colors duration-500 bg-grid">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, rotateY: -20 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative group perspective-1000"
        >
          <div className="absolute inset-0 bg-primary-fixed/20 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="relative glass-panel rounded-2xl overflow-hidden aspect-[3/4] max-w-sm mx-auto shadow-2xl flex items-center justify-center border-white/20 transform-gpu group-hover:rotate-y-12 transition-transform duration-500">
            <img 
              src={BOOK_IMG} 
              alt="Amizh Thamizh Moolam Annaivarukum Hindi Book Cover" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
        
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/10 border border-secondary-container/20 rounded-full text-secondary-container text-xs font-bold uppercase tracking-widest">
            <Star size={14} className="fill-current" />
            Featured Publication
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Amizh Thamizh Moolam <br /><span className="text-primary-fixed">Annaivarukum Hindi</span>
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Authored by R Lakshmi Narayanan, this comprehensive guide bridges the gap between Tamil and Hindi. Perfect for self-learners, it utilizes familiar Tamil phonetic structures to make learning Hindi intuitive and fast.
          </p>
          
          <ul className="space-y-4">
            {['Clear Tamil explanations for Hindi grammar', 'Extensive everyday vocabulary', 'Practice exercises with answers'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-primary-fixed shrink-0" size={20} />
                <span className="text-on-surface font-medium">{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button onClick={onBuy} className="bg-primary-fixed text-black font-bold px-10 py-4 rounded-xl flex items-center gap-3 hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary-fixed/30">
              <BookOpen size={20} />
              Buy Book
            </button>
            <p className="text-xs text-on-surface-variant max-w-[240px]">
              *For bulk orders or institution copies, please use the contact form below to inquire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Contact Component ---
// --- Contact Component ---
const Contact = () => {
  const [activeTab, setActiveTab] = useState('demo');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMsg('Submitting your request...');

    try {
      const table = activeTab === 'demo' ? 'demo_requests' : 'contact_messages';
      const { error } = await supabase.from(table).insert([formData]);

      if (error) throw error;

      setStatus('success');
      setStatusMsg(activeTab === 'demo' ? 'Demo booked! Redirecting to WhatsApp...' : 'Message sent! Redirecting to WhatsApp...');
      
      // WhatsApp Redirection
      const phone = '917010538186';
      const type = activeTab === 'demo' ? 'Book a Demo' : 'General Inquiry';
      const message = `Hello! I'm interested in ${type}.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'None'}`;
      
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');
      setStatusMsg(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Get In <span className="text-primary-fixed">Touch</span></h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Ready to start your learning journey? Book a demo or drop us a message.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold text-white mb-6">Contact Information</h3>
            {[
              { icon: Phone, label: 'PHONE', val: '7010538186' },
              { icon: Mail, label: 'EMAIL', val: 'rlnhindi@gmail.com' },
              { icon: MapPin, label: 'LOCATION', val: 'Chennai, Tamil Nadu (Online Available)' }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-primary-fixed/10 p-3 rounded-lg">
                  <item.icon size={20} className="text-primary-fixed" />
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-on-surface font-semibold">{item.val}</div>
                </div>
              </div>
            ))}
            
            <a href="https://wa.me/917010538186" target="_blank" rel="noopener noreferrer" className="w-full bg-surface border border-white/10 hover:border-primary-fixed/50 p-6 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all group">
              <MessageSquare size={24} className="text-primary-fixed group-hover:scale-110 transition-transform" />
              Chat on WhatsApp
            </a>
          </div>
          
          {/* Form Side */}
          <div className="lg:col-span-2 glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="flex gap-8 border-b border-white/10 mb-8 pb-1">
              {['Book a Demo', 'General Inquiry'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab === 'Book a Demo' ? 'demo' : 'inquiry');
                    setStatus('idle');
                  }}
                  className={`pb-4 px-2 font-bold transition-all relative ${
                    (activeTab === 'demo' && tab === 'Book a Demo') || (activeTab === 'inquiry' && tab === 'General Inquiry')
                    ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {tab}
                  {((activeTab === 'demo' && tab === 'Book a Demo') || (activeTab === 'inquiry' && tab === 'General Inquiry')) && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-fixed rounded-full" />
                  )}
                </button>
              ))}
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-primary-fixed/50 outline-none transition-colors" 
                    placeholder="Arjun Kumar" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-primary-fixed/50 outline-none transition-colors" 
                    placeholder="arjun@example.com" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-primary-fixed/50 outline-none transition-colors" 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Message</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-primary-fixed/50 outline-none transition-colors resize-none" 
                  placeholder={activeTab === 'demo' ? "I'd like to book a demo for..." : "I have a question about..."} 
                />
              </div>
              
              <FormFeedback status={status} message={statusMsg} />

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-primary-fixed text-black font-bold text-lg px-12 py-4 rounded-xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-fixed/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start space-y-4">
          <a href="#" className="font-display text-2xl font-extrabold text-primary-fixed tracking-tighter">
            RLN Hindi
          </a>
          <p className="text-xs text-on-surface-variant">© 2024 RLN Hindi. All rights reserved.</p>
        </div>
        
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((p) => (
            <a key={p} href="#" className="text-xs text-on-surface-variant hover:text-primary-fixed transition-colors">{p}</a>
          ))}
        </div>
        
        <div className="flex gap-4">
          {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
            <a key={social} href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/10 transition-all">
              <span className="sr-only">{social}</span>
              <div className="w-2 h-2 rounded-full bg-on-surface-variant" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---
export default function App() {
  const [modalType, setModalType] = useState<'none' | 'enroll' | 'corporate' | 'book'>('none');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  
  const [formData, setFormData] = useState<any>({});

  const closeModal = () => {
    setModalType('none');
    setStatus('idle');
    setFormData({});
  };

  const openEnroll = (course: string) => {
    setSelectedCourse(course);
    setFormData({ selected_course: course });
    setModalType('enroll');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (endpoint: string) => {
    setStatus('loading');
    setStatusMsg('Submitting...');
    try {
      const table = endpoint === '/enroll' ? 'enrollments' : 
                    endpoint === '/corporate' ? 'corporate_requests' : 
                    endpoint === '/book' ? 'book_requests' : '';
      
      const { error } = await supabase.from(table).insert([formData]);
      
      if (error) throw error;

      setStatus('success');
      setStatusMsg('Success! Redirecting to WhatsApp...');
      
      // WhatsApp Redirection
      const phone = '917010538186';
      let message = '';
      
      if (modalType === 'enroll') {
        message = `Hello! I'd like to enroll in the ${selectedCourse} course.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'None'}`;
      } else if (modalType === 'corporate') {
        message = `Hello! I'm interested in Corporate Training for ${formData.company_name}.\n\nContact: ${formData.contact_person}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nRequirement: ${formData.requirement}`;
      } else if (modalType === 'book') {
        message = `Hello! I'd like to order a copy of your book.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}`;
      }

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      setTimeout(closeModal, 2000);
    } catch (e: any) {
      console.error('Submission error:', e);
      setStatus('error');
      setStatusMsg(e.message || 'Submission failed.');
    }
  };

  return (
    <div className="min-h-screen text-on-surface bg-surface font-sans selection:bg-primary-fixed selection:text-black">
      <Navbar />
      <main>
        <Hero onBookDemo={() => setModalType('enroll')} />
        <Instructor />
        <Levels />
        <Countdown />
        <Programs onEnroll={openEnroll} />
        <Corporate onOpenForm={() => setModalType('corporate')} />
        <Testimonials />
        <Book onBuy={() => setModalType('book')} />
        <Contact />
      </main>
      <Footer />

      {/* Enrollment Modal */}
      <Modal isOpen={modalType === 'enroll'} onClose={closeModal} title={`Enroll: ${selectedCourse || 'Spoken Hindi'}`}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit('/enroll'); }}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Full Name</label>
            <input name="name" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Arjun Kumar" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Email</label>
            <input name="email" type="email" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="arjun@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Phone</label>
            <input name="phone" type="tel" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Phone Number" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Message (Optional)</label>
            <textarea name="message" onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none resize-none" rows={3} placeholder="Any specific requirements?" />
          </div>
          <FormFeedback status={status} message={statusMsg} />
          <button type="submit" disabled={status === 'loading'} className="w-full bg-primary-fixed text-black font-bold py-3 rounded-xl hover:bg-white transition-all disabled:opacity-50">
            {status === 'loading' ? 'Enrolling...' : 'Confirm Enrollment'}
          </button>
        </form>
      </Modal>

      {/* Corporate Modal */}
      <Modal isOpen={modalType === 'corporate'} onClose={closeModal} title="Corporate Training Inquiry">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit('/corporate'); }}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Company Name</label>
            <input name="company_name" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Your Company" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Contact Person</label>
            <input name="contact_person" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Full Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Email</label>
              <input name="email" type="email" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Email" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Phone</label>
              <input name="phone" type="tel" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Phone" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Requirement Details</label>
            <textarea name="requirement" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none resize-none" rows={3} placeholder="Batch size, specific goals, etc." />
          </div>
          <FormFeedback status={status} message={statusMsg} />
          <button type="submit" disabled={status === 'loading'} className="w-full bg-primary-fixed text-black font-bold py-3 rounded-xl hover:bg-white transition-all disabled:opacity-50">
            {status === 'loading' ? 'Submitting...' : 'Send Inquiry'}
          </button>
        </form>
      </Modal>

      {/* Book Modal */}
      <Modal isOpen={modalType === 'book'} onClose={closeModal} title="Order Book">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit('/book'); }}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Full Name</label>
            <input name="name" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Arjun Kumar" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Email</label>
              <input name="email" type="email" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="arjun@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Phone</label>
              <input name="phone" type="tel" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none" placeholder="Phone" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase">Shipping Address</label>
            <textarea name="address" required onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-primary-fixed outline-none resize-none" rows={3} placeholder="Full address with pincode" />
          </div>
          <FormFeedback status={status} message={statusMsg} />
          <button type="submit" disabled={status === 'loading'} className="w-full bg-primary-fixed text-black font-bold py-3 rounded-xl hover:bg-white transition-all disabled:opacity-50">
            {status === 'loading' ? 'Processing...' : 'Confirm Order'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
