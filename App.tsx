import React, { useState, useEffect } from 'react';
import { AppStep, Archetype, Profession, QuizState, DetailedProfile, UserDetails } from './types';
import { GENERAL_QUESTIONS, PROFESSION_QUESTIONS, DETAILED_PROFILES } from './data';
import { QuizCard } from './components/QuizCard';
import { 
  BrainCircuit, 
  Lightbulb, 
  Users, 
  Wrench, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCcw,
  Sparkles,
  Briefcase,
  GraduationCap,
  Scale,
  Palette,
  Brain,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Compass,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    step: AppStep.HOME,
    generalAnswers: Array(GENERAL_QUESTIONS.length).fill(null),
    professionAnswers: [],
    userDetails: null,
    selectedProfession: null,
    finalArchetype: null,
    aptitudeScores: {
      [Profession.LAW]: null,
      [Profession.PSYCHOLOGY]: null,
      [Profession.DESIGNING]: null,
    },
    professionHistory: {}
  });

  // Local state for the User Details form
  const [userDetailsForm, setUserDetailsForm] = useState<UserDetails>({
    name: '',
    email: '',
    standard: '',
    stream: ''
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // --- Handlers ---

  const navigateTo = (step: AppStep) => {
    setState(prev => ({ ...prev, step }));
    setCurrentQuestionIndex(0);
    window.scrollTo(0, 0);
  };

  const startQuiz = () => {
    // Navigate to User Details first
    setState(prev => ({ 
      ...prev, 
      step: AppStep.USER_DETAILS
    }));
    window.scrollTo(0, 0);
  };

  const handleUserDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetailsForm.name || !userDetailsForm.standard) return;

    setState(prev => ({
      ...prev,
      userDetails: userDetailsForm,
      step: AppStep.QUIZ_GENERAL,
      generalAnswers: Array(GENERAL_QUESTIONS.length).fill(null)
    }));
    setCurrentQuestionIndex(0);
    window.scrollTo(0, 0);
  };

  const handleGeneralAnswer = (value: string | number) => {
    const archetype = value as Archetype;
    const newAnswers = [...state.generalAnswers];
    newAnswers[currentQuestionIndex] = archetype;

    // Check if last question
    if (currentQuestionIndex < GENERAL_QUESTIONS.length - 1) {
      setState(prev => ({ ...prev, generalAnswers: newAnswers }));
      setCurrentQuestionIndex(curr => curr + 1);
    } else {
      // Calculate archetype result
      const counts: Record<string, number> = {
        [Archetype.CREATIVE]: 0,
        [Archetype.LOGICAL]: 0,
        [Archetype.SOCIAL]: 0,
        [Archetype.PRACTICAL]: 0,
      };
      
      newAnswers.forEach(ans => {
        if (ans) counts[ans as string] = (counts[ans as string] || 0) + 1;
      });

      const result = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as Archetype;
      
      setState(prev => ({
        ...prev,
        generalAnswers: newAnswers,
        finalArchetype: result,
        step: AppStep.PROFESSION_SELECTION
      }));
      setCurrentQuestionIndex(0);
      window.scrollTo(0, 0);
    }
  };

  const startProfessionQuiz = (prof: Profession) => {
    setState(prev => ({
      ...prev,
      selectedProfession: prof,
      step: AppStep.QUIZ_PROFESSION,
      professionAnswers: Array(PROFESSION_QUESTIONS[prof].length).fill(null)
    }));
    setCurrentQuestionIndex(0);
    window.scrollTo(0, 0);
  };

  const handleProfessionAnswer = (value: string | number) => {
    const score = value as number;
    const newAnswers = [...state.professionAnswers];
    newAnswers[currentQuestionIndex] = score;

    const isLastQuestion = currentQuestionIndex === PROFESSION_QUESTIONS[state.selectedProfession!].length - 1;
    
    if (isLastQuestion) {
      // Calculate score
      const totalScore = newAnswers.reduce((sum, val) => (sum || 0) + (val || 0), 0) || 0;
      const matchPercentage = Math.min(100, Math.round((totalScore / 100) * 100));

      setState(prev => ({
        ...prev,
        professionAnswers: [],
        step: AppStep.PROFESSION_SELECTION,
        aptitudeScores: {
          ...prev.aptitudeScores,
          [prev.selectedProfession!]: matchPercentage
        },
        professionHistory: {
          ...prev.professionHistory,
          [prev.selectedProfession!]: newAnswers
        }
      }));
      window.scrollTo(0, 0);
    } else {
      setState(prev => ({
        ...prev,
        professionAnswers: newAnswers
      }));
      setCurrentQuestionIndex(curr => curr + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(curr => curr - 1);
    }
  };

  const resetApp = () => {
    setState({
      step: AppStep.HOME,
      generalAnswers: Array(GENERAL_QUESTIONS.length).fill(null),
      professionAnswers: [],
      selectedProfession: null,
      userDetails: null,
      finalArchetype: null,
      aptitudeScores: {
        [Profession.LAW]: null,
        [Profession.PSYCHOLOGY]: null,
        [Profession.DESIGNING]: null,
      },
      professionHistory: {}
    });
    setUserDetailsForm({ name: '', email: '', standard: '', stream: '' });
    setCurrentQuestionIndex(0);
    setShowHistory(false);
    window.scrollTo(0, 0);
  };

  // --- Renderers ---

  const renderFooterCaption = () => (
    <p className="text-slate-500 font-semibold italic text-lg tracking-wide text-center mt-12 mb-6">
      PATHIO - Taste the Reality before Responsibility
    </p>
  );

  const renderHome = () => (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center max-w-6xl mx-auto px-6 fade-in overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse delay-700 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

      {/* Floating Icons */}
      <div className="absolute top-24 right-[15%] hidden lg:block animate-bounce duration-[3000ms] pointer-events-none">
         <div className="bg-white p-4 rounded-2xl shadow-lg shadow-yellow-100 rotate-12">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
         </div>
      </div>
      <div className="absolute bottom-32 left-[15%] hidden lg:block animate-bounce duration-[4000ms] delay-500 pointer-events-none">
         <div className="bg-white p-4 rounded-2xl shadow-lg shadow-red-100 -rotate-6">
            <Target className="w-8 h-8 text-red-500" />
         </div>
      </div>
      <div className="absolute top-32 left-[10%] hidden lg:block animate-bounce duration-[3500ms] delay-200 pointer-events-none">
         <div className="bg-white p-4 rounded-2xl shadow-lg shadow-blue-100 -rotate-12">
            <BrainCircuit className="w-8 h-8 text-blue-500" />
         </div>
      </div>
       <div className="absolute bottom-40 right-[20%] hidden lg:block animate-bounce duration-[4500ms] delay-1000 pointer-events-none">
         <div className="bg-white p-4 rounded-2xl shadow-lg shadow-purple-100 rotate-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
         </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 bg-white/60 backdrop-blur-md p-8 md:p-14 rounded-3xl border border-white/80 shadow-2xl max-w-4xl w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-8 tracking-wide">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Discover Your Future
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
          Discover Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Real Career Fit</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Unlock the path that truly matches your unique skills and potential. No guesswork, just science.
        </p>
        
        <button 
          onClick={startQuiz}
          className="group bg-slate-900 hover:bg-blue-600 text-white text-xl font-bold py-5 px-12 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 flex items-center gap-3 hover:-translate-y-1 mx-auto"
        >
          Start Quiz
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {renderFooterCaption()}
    </div>
  );

  const renderUserDetails = () => {
    const isSenior = userDetailsForm.standard === '11' || userDetailsForm.standard === '12';

    return (
      <div className="max-w-xl mx-auto px-6 py-12 fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Tell us about yourself</h2>
            <p className="text-slate-500 mt-2">We'll use this to personalize your experience.</p>
          </div>

          <form onSubmit={handleUserDetailsSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Enter your name"
                value={userDetailsForm.name}
                onChange={e => setUserDetailsForm({...userDetailsForm, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Enter your email"
                value={userDetailsForm.email}
                onChange={e => setUserDetailsForm({...userDetailsForm, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Standard/Class</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                value={userDetailsForm.standard}
                onChange={e => setUserDetailsForm({...userDetailsForm, standard: e.target.value, stream: ''})}
              >
                <option value="">Select your class</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="UG">Undergraduate</option>
                <option value="Grad">Graduate/Other</option>
              </select>
            </div>

            {isSenior && (
              <div className="fade-in">
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Stream</label>
                <select 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                  value={userDetailsForm.stream}
                  onChange={e => setUserDetailsForm({...userDetailsForm, stream: e.target.value})}
                >
                  <option value="">Select your stream</option>
                  <option value="Science (PCM)">Science (PCM)</option>
                  <option value="Science (PCB)">Science (PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities/Arts">Humanities/Arts</option>
                </select>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2"
            >
              Continue to Quiz
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        {renderFooterCaption()}
      </div>
    );
  };

  const renderAbout = () => (
    <div className="max-w-4xl mx-auto px-6 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">About Us</h2>
        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
          <span className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Compass className="w-6 h-6" />
          </span>
          Our Mission
        </h3>
        <p className="text-slate-600 text-lg leading-relaxed mb-6 relative z-10">
          PATHIO is a multi-dimensional career discovery tool designed to bridge the gap between ambition and reality. We believe that students shouldn't have to wait until they are committed to a degree to understand what a job actually feels like.
        </p>
        <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 relative z-10">
           <p className="text-slate-800 font-medium italic">
            "Rooted in <span className="font-bold text-green-700">SDG 12: Responsible Consumption and Production</span>, we advocate for the responsible consumption of educational resources by ensuring human potential isn't wasted on the wrong paths."
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Choose PATHIO?</h3>
      <div className="grid md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Scientific Assessment</h4>
          <p className="text-slate-600">
            Move beyond simple interest tests. Our archetype quiz analyzes how you solve problems, handle conflict, and view the world.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
           <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Reality-Based Profiles</h4>
          <p className="text-slate-600">
            Get raw, unfiltered insights into professions. We break down salary realities, daily grinds, and growth paths in the Indian context.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
           <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Aptitude Testing</h4>
          <p className="text-slate-600">
            Don't just guess. Take specific skill-based challenges for Law, Psychology, or Design to see if you have the natural knack for it.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
           <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Clear Action Plans</h4>
          <p className="text-slate-600">
            Confused about entrance exams? We provide concrete roadmaps for students in Class 11 & 12 to navigate their journey.
          </p>
        </div>

      </div>

      {renderFooterCaption()}
    </div>
  );

  const renderTeam = () => (
    <div className="max-w-5xl mx-auto px-6 py-12 fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Our Team</h2>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Showcase */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">Showcase</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-bold">Mayank Sharma</span>
            </li>
          </ul>
        </div>

        {/* PitchVerse */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">PitchVerse</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="font-bold">Aanya Bhatnagar</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="font-bold">Aayushi Balsara</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="font-bold">Sneha Prajapati</span>
            </li>
          </ul>
        </div>

        {/* InstaVista */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">InstaVista</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span className="font-bold">Arun Kumar</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span className="font-bold">Advik Bhargwa</span>
            </li>
          </ul>
        </div>

        {/* Market o drama */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">Market o drama</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-bold">Sharanya Sampath</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-bold">Shobhin Malkoti</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-bold">Prashasti Singh</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-bold">Khyati</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-bold">Riyaan Tongaria</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="font-bold">Arpita Tripathi</span>
            </div>
          </div>
        </div>
      </div>
      {renderFooterCaption()}
    </div>
  );

  const getProfessionIcon = (prof: Profession) => {
    switch(prof) {
      case Profession.LAW: return Scale;
      case Profession.PSYCHOLOGY: return Brain;
      case Profession.DESIGNING: return Palette;
      default: return Briefcase;
    }
  };

  const renderResponseHistory = () => {
    if (!showHistory) return null;

    return (
      <div className="mt-12 border-t border-slate-200 pt-12 fade-in">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Your Full Response Record
        </h3>

        {/* User Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">Student Profile</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="block text-xs text-slate-400 font-semibold uppercase">Name</span>
              <span className="text-slate-800 font-medium">{state.userDetails?.name}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-semibold uppercase">Email</span>
              <span className="text-slate-800 font-medium">{state.userDetails?.email}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-semibold uppercase">Class</span>
              <span className="text-slate-800 font-medium">{state.userDetails?.standard}</span>
            </div>
            {state.userDetails?.stream && (
              <div>
                <span className="block text-xs text-slate-400 font-semibold uppercase">Stream</span>
                <span className="text-slate-800 font-medium">{state.userDetails.stream}</span>
              </div>
            )}
          </div>
        </div>

        {/* General Quiz Answers */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">General Assessment Responses</h4>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Result: {state.finalArchetype}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {GENERAL_QUESTIONS.map((q, idx) => {
              const answerValue = state.generalAnswers[idx];
              const answerLabel = q.options.find(opt => opt.value === answerValue)?.label;
              return (
                <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <p className="text-sm text-slate-500 mb-1 font-mono">Q{idx + 1}</p>
                  <p className="text-slate-800 font-medium mb-2">{q.text}</p>
                  <p className="text-sm text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                    Selected: <span className="font-bold">{answerLabel || "Skipped"}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profession Quiz Answers - Dynamically rendered based on history */}
        {Object.entries(state.professionHistory).map(([profKey, answers]) => {
          const prof = profKey as Profession;
          const questions = PROFESSION_QUESTIONS[prof];
          if (!questions || !answers) return null;

          return (
            <div key={prof} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{prof} Aptitude Test Responses</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Score: {state.aptitudeScores[prof]}%</span>
              </div>
              <div className="divide-y divide-slate-100">
                {questions.map((q, idx) => {
                  const answerValue = answers[idx];
                  const answerLabel = q.options.find(opt => opt.value === answerValue)?.label;
                  return (
                    <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <p className="text-sm text-slate-500 mb-1 font-mono">Q{idx + 1}</p>
                      <p className="text-slate-800 font-medium mb-2">{q.text}</p>
                       <p className={`text-sm inline-block px-3 py-1 rounded-lg ${
                        answerValue === 10 ? 'bg-green-50 text-green-700' :
                        answerValue === 7 ? 'bg-blue-50 text-blue-700' :
                        answerValue === 5 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                       }`}>
                        Selected: <span className="font-bold">{answerLabel || "Skipped"}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderProfessionSelection = () => {
    // Helper to render the Detailed Card
    const renderProfileCard = (prof: Profession) => {
      const details = DETAILED_PROFILES[prof];
      const Icon = getProfessionIcon(prof);
      const score = state.aptitudeScores[prof];

      return (
        <div key={prof} className="bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col mb-12">
          {/* 1. Job Title & Icon Header */}
          <div className="bg-slate-900 p-8 text-white relative rounded-t-3xl">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                 <Icon className="w-8 h-8 text-blue-300" />
              </div>
              <h4 className="text-3xl font-bold">{details.title}</h4>
            </div>
            {/* 2. One-Sentence Summary */}
            <p className="text-blue-100 text-lg italic leading-snug font-medium pl-16 border-l-4 border-blue-500">{details.summary}</p>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            {/* 3. Detailed Description */}
            <section>
              <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600"/> What This Career Involves
              </h5>
              <p className="text-slate-700 text-base leading-relaxed">
                {details.description}
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 4. Key Skills */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h5 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                   <Wrench className="w-4 h-4 text-orange-500"/> Key Skills Required
                </h5>
                <ul className="space-y-2">
                  {details.keySkills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Personality Fit */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h5 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                   <Users className="w-4 h-4 text-blue-600"/> Personality Fit
                </h5>
                <ul className="space-y-2">
                  {details.personalityFit.map((fit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      {fit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 6. Pathway */}
            <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600"/> Pathway to Enter (India)
                </h5>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                  {details.pathway}
                </p>
            </section>

            {/* 7. Salary */}
            <section className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600"/> Average Salary in India
                </h5>
                <p className="text-sm text-slate-800 whitespace-pre-line font-mono font-medium">
                  {details.salary}
                </p>
            </section>

             {/* 8. Growth */}
            <section>
                <h5 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600"/> Growth Opportunities
                </h5>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {details.growth.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0"/> {g}
                    </li>
                  ))}
                </ul>
            </section>

             {/* 9. Why Fit */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                    Why This Career Might Fit You
                  </h5>
                  <p className="text-base text-slate-600 font-medium leading-relaxed">
                    {details.fitReason}
                  </p>
                </div>
              </div>
            </div>

            {/* APTITUDE TEST ACTION */}
            <div className="mt-8 pt-8 border-t-2 border-slate-100 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-8">
              {score === null ? (
                <>
                  <p className="text-lg font-medium text-slate-700 mb-6 text-center">
                    Curious if you have the aptitude for {details.title}?
                  </p>
                  <button 
                    onClick={() => startProfessionQuiz(prof)}
                    className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    Take {prof} Aptitude Test
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-bold text-slate-700 uppercase tracking-wider text-sm">Your Aptitude Score</span>
                     <span className="font-bold text-3xl text-blue-600">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden mb-4">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-center text-slate-500 text-sm">
                    {score > 70 ? "Excellent match! You show strong natural aptitude." : "Good effort! With practice, you can master these skills."}
                  </p>
                   <button 
                    onClick={() => startProfessionQuiz(prof)}
                    className="mt-4 text-sm text-blue-600 font-bold hover:underline mx-auto block"
                  >
                    Retake Test
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      );
    };

    return (
      <div className="max-w-4xl mx-auto px-6 py-10 fade-in pb-24">
        {/* Header Section */}
        <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 shadow-xl mb-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <BrainCircuit className="w-full h-full absolute -right-20 -bottom-20 rotate-12" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Career Profile</h2>
             <p className="text-indigo-100 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
               Based on your assessment, your archetype is <strong className="text-white border-b-2 border-white/50">{state.finalArchetype}</strong>. 
            </p>
            <p className="text-indigo-200 font-medium">
               Explore the recommended paths below.
            </p>
          </div>
        </div>
        
        <h3 className="text-3xl font-bold text-slate-900 mb-10 text-center flex items-center justify-center gap-3">
          <Sparkles className="text-yellow-500 fill-yellow-500 w-8 h-8" />
          Recommended Career Paths
        </h3>

        {/* Detailed Cards Loop */}
        <div className="space-y-16">
          {renderProfileCard(Profession.LAW)}
          {renderProfileCard(Profession.PSYCHOLOGY)}
          {renderProfileCard(Profession.DESIGNING)}
        </div>

        {/* History Toggle */}
        <div className="mt-16 text-center">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors"
          >
            {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {showHistory ? "Hide Response Record" : "View My Full Response Record"}
          </button>
        </div>

        {/* History Section */}
        {renderResponseHistory()}

        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <button 
            onClick={resetApp}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 hover:bg-slate-800"
          >
            <RefreshCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Start New Assessment
          </button>
        </div>
        {renderFooterCaption()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Ribbon Header */}
      <nav className="bg-blue-700 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => navigateTo(AppStep.HOME)}
          >
            <img src="/logo.png" alt="Pathio Logo" className="h-10 w-auto" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigateTo(AppStep.HOME)}
              className={`text-white font-medium hover:text-blue-200 transition-colors ${state.step === AppStep.HOME ? 'border-b-2 border-white' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo(AppStep.ABOUT)}
              className={`text-white font-medium hover:text-blue-200 transition-colors ${state.step === AppStep.ABOUT ? 'border-b-2 border-white' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => navigateTo(AppStep.TEAM)}
              className={`text-white font-medium hover:text-blue-200 transition-colors ${state.step === AppStep.TEAM ? 'border-b-2 border-white' : ''}`}
            >
              Team
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-12 pb-12 relative overflow-hidden">
        {state.step === AppStep.HOME && renderHome()}
        {state.step === AppStep.ABOUT && renderAbout()}
        {state.step === AppStep.TEAM && renderTeam()}
        {state.step === AppStep.USER_DETAILS && renderUserDetails()}
        
        {state.step === AppStep.QUIZ_GENERAL && (
          <div className="flex flex-col items-center px-4">
            <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 1 of 2</span>
              <h2 className="text-2xl font-bold text-slate-900">General Skills Assessment</h2>
            </div>
            <QuizCard 
              question={GENERAL_QUESTIONS[currentQuestionIndex]} 
              onAnswer={handleGeneralAnswer}
              onPrevious={handlePrevious}
              hasPrevious={currentQuestionIndex > 0}
              selectedValue={state.generalAnswers[currentQuestionIndex]}
              currentNumber={currentQuestionIndex + 1}
              total={GENERAL_QUESTIONS.length}
            />
            {renderFooterCaption()}
          </div>
        )}

        {state.step === AppStep.PROFESSION_SELECTION && renderProfessionSelection()}
        
        {state.step === AppStep.QUIZ_PROFESSION && (
          <div className="flex flex-col items-center px-4">
             <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">APTITUDE TEST</span>
              <h2 className="text-2xl font-bold text-slate-900">{state.selectedProfession} Assessment</h2>
            </div>
            <QuizCard 
              question={PROFESSION_QUESTIONS[state.selectedProfession!][currentQuestionIndex]} 
              onAnswer={handleProfessionAnswer}
              onPrevious={handlePrevious}
              hasPrevious={currentQuestionIndex > 0}
              selectedValue={state.professionAnswers[currentQuestionIndex]}
              currentNumber={currentQuestionIndex + 1}
              total={PROFESSION_QUESTIONS[state.selectedProfession!].length}
            />
            {renderFooterCaption()}
          </div>
        )}
      </main>

      {/* Footer Ribbon */}
      <footer className="bg-slate-900 text-white py-8 mt-auto border-t border-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h5 className="text-xl font-bold tracking-tight mb-1 text-blue-400">PATHIO</h5>
            <p className="text-slate-400 text-sm">Taste the Reality before Responsibility</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 bg-slate-800 rounded-full text-blue-400">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Call Us</span>
                <span className="text-sm font-medium">+91 98765 43210</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 bg-slate-800 rounded-full text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Us</span>
                <span className="text-sm font-medium">hello@pathio.in</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;