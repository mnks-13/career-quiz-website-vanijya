

import React, { useState, useEffect } from 'react';
import { AppStep, Archetype, Profession, QuizState, DetailedProfile, UserDetails, CareerInsights, TaskResponse } from './types';
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
  ChevronUp,
  Menu,
  X,
  Map,
  Search,
  ClipboardList,
  Send,
  Lock,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { getCareerInsights } from './services/geminiService';

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
    professionHistory: {},
    taskResponses: {}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // New state for Gemini-generated suggestions
  const [jobSuggestions, setJobSuggestions] = useState<Record<Profession, CareerInsights | null>>({
    [Profession.LAW]: null,
    [Profession.PSYCHOLOGY]: null,
    [Profession.DESIGNING]: null
  });
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);

  // --- Handlers ---

  const navigateTo = (step: AppStep) => {
    setState(prev => ({ ...prev, step }));
    setCurrentQuestionIndex(0);
    setIsMobileMenuOpen(false);
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
    if (!userDetailsForm.name || !userDetailsForm.standard) {
      alert("Please fill in your Name and Class details to proceed.");
      return;
    }

    setState(prev => ({
      ...prev,
      userDetails: userDetailsForm,
      step: AppStep.QUIZ_GENERAL,
      generalAnswers: Array(GENERAL_QUESTIONS.length).fill(null)
    }));
    setCurrentQuestionIndex(0);
    window.scrollTo(0, 0);
  };

  const handleSkipToCareers = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Enforce validation for Skip as well
    if (!userDetailsForm.name || !userDetailsForm.standard) {
      alert("Please fill in your Name and Class details to explore careers.");
      return;
    }

    const finalUserDetails: UserDetails = {
      name: userDetailsForm.name.trim(),
      email: userDetailsForm.email.trim() || "",
      standard: userDetailsForm.standard,
      stream: userDetailsForm.stream || ""
    };

    setState(prev => ({
      ...prev,
      userDetails: finalUserDetails,
      step: AppStep.PROFESSION_SELECTION,
      finalArchetype: null, // Explicitly null as skipped
      generalAnswers: Array(GENERAL_QUESTIONS.length).fill(null)
    }));
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

  const handleProfessionAnswer = async (value: string | number) => {
    const score = value as number;
    const newAnswers = [...state.professionAnswers];
    newAnswers[currentQuestionIndex] = score;

    const isLastQuestion = currentQuestionIndex === PROFESSION_QUESTIONS[state.selectedProfession!].length - 1;
    
    if (isLastQuestion) {
      // Calculate score
      const totalScore = newAnswers.reduce((sum, val) => (sum || 0) + (val || 0), 0) || 0;
      const matchPercentage = Math.min(100, Math.round((totalScore / 100) * 100));

      const updatedState = {
        ...state,
        professionAnswers: [],
        step: AppStep.TASK_PAGE, // Navigate to Task Page
        aptitudeScores: {
          ...state.aptitudeScores,
          [state.selectedProfession!]: matchPercentage
        },
        professionHistory: {
          ...state.professionHistory,
          [state.selectedProfession!]: newAnswers
        }
      };

      setState(updatedState);
      window.scrollTo(0, 0);

      // Fetch insights from Gemini
      setIsLoadingInsights(true);
      try {
        const archetype = state.finalArchetype || Archetype.CREATIVE; // Fallback if skipped
        const insights = await getCareerInsights(archetype, state.selectedProfession!, matchPercentage);
        setJobSuggestions(prev => ({
          ...prev,
          [state.selectedProfession!]: insights
        }));
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setIsLoadingInsights(false);
      }

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
      professionHistory: {},
      taskResponses: {}
    });
    setUserDetailsForm({ name: '', email: '', standard: '', stream: '' });
    setCurrentQuestionIndex(0);
    setShowHistory(false);
    setJobSuggestions({
      [Profession.LAW]: null,
      [Profession.PSYCHOLOGY]: null,
      [Profession.DESIGNING]: null
    });
    setExpandedJobIndex(null);
    window.scrollTo(0, 0);
  };

  // --- Handlers for Task Responses ---
  const handleTaskTextChange = (taskIndex: number, text: string) => {
    const prof = state.selectedProfession;
    if (!prof) return;

    const currentResponses = [...(state.taskResponses[prof] || [])];
    // Ensure the array is big enough
    while (currentResponses.length <= taskIndex) {
      currentResponses.push({ text: "" });
    }
    
    currentResponses[taskIndex] = { ...currentResponses[taskIndex], text };

    setState(prev => ({
      ...prev,
      taskResponses: {
        ...prev.taskResponses,
        [prof]: currentResponses
      }
    }));
  };

  const handleTaskFileChange = (taskIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const prof = state.selectedProfession;
    const file = e.target.files?.[0];
    if (!prof || !file) return;

    const currentResponses = [...(state.taskResponses[prof] || [])];
    while (currentResponses.length <= taskIndex) {
      currentResponses.push({ text: "" });
    }

    // We store just the name for display since we don't have a backend
    currentResponses[taskIndex] = { ...currentResponses[taskIndex], fileName: file.name };

    setState(prev => ({
      ...prev,
      taskResponses: {
        ...prev.taskResponses,
        [prof]: currentResponses
      }
    }));
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[75vh] w-full text-center px-4 md:px-6 fade-in overflow-hidden py-10">
        
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
        <div className="relative z-10 bg-white/60 backdrop-blur-md p-8 md:p-14 rounded-3xl border border-white/80 shadow-2xl max-w-4xl w-full mx-auto mt-8">
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
          
          <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Unlock the path that truly matches your unique skills and potential. No guesswork, just science.
          </p>
          
          <button 
            onClick={startQuiz}
            className="group bg-slate-900 hover:bg-blue-600 text-white text-lg md:text-xl font-bold py-4 md:py-5 px-8 md:px-12 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 flex items-center gap-3 hover:-translate-y-1 mx-auto"
          >
            Start
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How PATHIO Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">Your journey from confusion to clarity in three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Profile & Archetype</h3>
            <p className="text-slate-600 leading-relaxed">
              Tell us about yourself and take our scientifically designed personality quiz to discover your core thinking style.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Skill Assessment</h3>
            <p className="text-slate-600 leading-relaxed">
              Choose a profession you're curious about and test your aptitude with real-world scenarios, not just textbook questions.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
              <Map className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Career Roadmap</h3>
            <p className="text-slate-600 leading-relaxed">
              Get a detailed report with job profiles, salary expectations, and a step-by-step educational pathway to your goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserDetails = () => {
    const isSenior = userDetailsForm.standard === '11' || userDetailsForm.standard === '12';

    return (
      <div className="max-w-xl mx-auto px-4 md:px-6 py-12 fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Tell us about yourself</h2>
            <p className="text-slate-500 mt-2">We'll use this to personalize your experience.</p>
          </div>

          <form onSubmit={handleUserDetailsSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="Enter your email"
                value={userDetailsForm.email}
                onChange={e => setUserDetailsForm({...userDetailsForm, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Standard/Class <span className="text-red-500">*</span></label>
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

            <div className="flex flex-col gap-4 pt-4">
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start General Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                type="button"
                onClick={handleSkipToCareers}
                className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-xl border-2 border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Skip & Explore Career Profiles
                <Briefcase className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">About Us</h2>
        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 mb-12 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
          <span className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Compass className="w-6 h-6" />
          </span>
          Our Mission
        </h3>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 relative z-10">
          PATHIO is a multi-dimensional career discovery tool designed to bridge the gap between ambition and reality. We believe that students shouldn't have to wait until they are committed to a degree to understand what a job actually feels like.
        </p>
        <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 relative z-10">
           <p className="text-slate-800 font-medium italic text-sm md:text-base">
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
    </div>
  );

  const renderTeam = () => (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Our Team</h2>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Showcase */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">Showcase</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-bold">Mayank Sharma</span>
            </li>
          </ul>
        </div>

        {/* PitchVerse */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Result: {state.finalArchetype || "Skipped"}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {state.finalArchetype ? (
              GENERAL_QUESTIONS.map((q, idx) => {
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
              })
            ) : (
              <div className="p-6 text-slate-500 italic text-center">
                General assessment was skipped.
              </div>
            )}
          </div>
        </div>

        {/* Profession Quiz Answers - Dynamically rendered based on history */}
        {Object.entries(state.professionHistory).map(([prof, answers]) => {
          const answerList = answers as (number | null)[];
          if (!answerList || answerList.length === 0) return null;
          const questions = PROFESSION_QUESTIONS[prof as Profession];
          
          return (
            <div key={prof} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{prof} Aptitude Responses</h4>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">
                  Score: {state.aptitudeScores[prof as Profession]}%
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {questions.map((q, idx) => {
                  const score = answerList[idx];
                  let label = "Skipped";
                  if (score === 10) label = "Strongly Agree";
                  else if (score === 7) label = "Agree";
                  else if (score === 5) label = "Neutral";
                  else if (score === 2) label = "Disagree";

                  return (
                    <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <p className="text-sm text-slate-500 mb-1 font-mono">Q{idx + 1}</p>
                      <p className="text-slate-800 font-medium mb-2">{q.text}</p>
                      <p className="text-sm text-purple-600 bg-purple-50 inline-block px-3 py-1 rounded-lg">
                        Selected: <span className="font-bold">{label}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Task Responses Section */}
        {Object.entries(state.taskResponses).map(([prof, tasks]) => {
          if (!tasks || tasks.length === 0) return null;
          
          return (
            <div key={`${prof}-tasks`} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{prof} Simulation Tasks</h4>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">
                   Completed
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {tasks.map((taskResponse, idx) => {
                  if (!taskResponse) return null;
                  
                  // Retrieve the original task text if possible, or just number
                  const originalTaskText = jobSuggestions[prof as Profession]?.simulatedTasks[idx] || `Task ${idx + 1}`;

                  return (
                    <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                       <p className="text-sm font-bold text-slate-600 mb-2">Task: {originalTaskText}</p>
                       
                       {taskResponse.text && (
                         <div className="mb-3">
                           <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Your Text Response:</p>
                           <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">{taskResponse.text}</p>
                         </div>
                       )}

                       {taskResponse.fileName && (
                          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100 w-fit">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Uploaded File: {taskResponse.fileName}</span>
                          </div>
                       )}

                       {!taskResponse.text && !taskResponse.fileName && (
                         <p className="text-sm text-slate-400 italic">No response provided.</p>
                       )}
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

  const renderTaskPage = () => {
    const prof = state.selectedProfession;
    if (!prof) return null;
    const insights = jobSuggestions[prof];
    const tasks = insights?.simulatedTasks || [];
    const currentResponses = state.taskResponses[prof] || [];

    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-orange-50 rounded-full mb-4 ring-1 ring-orange-200">
            <ClipboardList className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Workspace Simulation Tasks — <span className="text-blue-600">{prof}</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Experience what it feels like to work in this field with these short, real-world scenarios.
          </p>
        </div>

        {isLoadingInsights && !insights ? (
           <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Generating Your Tasks...</h3>
              <p className="text-slate-500">Our AI is designing custom workplace scenarios for you.</p>
           </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
               <div className="p-8 space-y-8">
                 {tasks.map((task, idx) => {
                   const isDesignTask = task.toLowerCase().includes('sketch') || 
                                        task.toLowerCase().includes('draw') || 
                                        task.toLowerCase().includes('design') ||
                                        task.toLowerCase().includes('create') ||
                                        task.toLowerCase().includes('upload');

                   return (
                     <div key={idx} className="relative">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm border border-orange-200">
                            {idx + 1}
                          </div>
                          <div className="flex-grow space-y-4">
                             <p className="text-lg font-medium text-slate-800 leading-relaxed">
                               {task}
                             </p>
                             
                             <textarea 
                               className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none text-slate-700"
                               rows={3}
                               placeholder="Type your response here..."
                               value={currentResponses[idx]?.text || ""}
                               onChange={(e) => handleTaskTextChange(idx, e.target.value)}
                             />

                             {isDesignTask && (
                               <div className="flex items-center gap-4">
                                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm">
                                    <Upload className="w-4 h-4" />
                                    {currentResponses[idx]?.fileName ? 'Change File' : 'Upload Sketch/Design'}
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*,.pdf"
                                      onChange={(e) => handleTaskFileChange(idx, e)}
                                    />
                                  </label>
                                  {currentResponses[idx]?.fileName && (
                                    <span className="text-sm text-blue-600 flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4" /> {currentResponses[idx].fileName}
                                    </span>
                                  )}
                               </div>
                             )}
                          </div>
                        </div>
                        {idx < tasks.length - 1 && <div className="h-px bg-slate-100 w-full ml-12 mt-8"></div>}
                     </div>
                   );
                 })}
               </div>

               <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col items-center gap-6">
                  <button 
                    onClick={() => {
                      alert("Tasks submitted successfully! Check your full report for details.");
                      navigateTo(AppStep.PROFESSION_SELECTION);
                    }}
                    className="bg-slate-900 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-1"
                  >
                    Submit My Responses
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center gap-2">
                     <button className="text-slate-400 font-bold py-2 px-6 rounded-full border-2 border-slate-200 cursor-not-allowed flex items-center gap-2" disabled>
                       <Lock className="w-4 h-4" />
                       Get Review From Experts
                     </button>
                     <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                       This is a premium feature.
                     </span>
                  </div>
               </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => navigateTo(AppStep.PROFESSION_SELECTION)}
                className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition-colors py-2 px-4 hover:bg-slate-100 rounded-lg"
              >
                View Full Career Report <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfessionSelection = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Path</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {state.finalArchetype 
            ? `As a ${state.finalArchetype}, here are three career paths that might interest you. Select one to test your aptitude.`
            : "Explore these career paths and test your aptitude to see if it's the right fit for you."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[Profession.LAW, Profession.PSYCHOLOGY, Profession.DESIGNING].map((prof) => {
          const score = state.aptitudeScores[prof];
          const hasScore = score !== null;
          const ProfileIcon = getProfessionIcon(prof);
          const profileData = DETAILED_PROFILES[prof];
          const insights = jobSuggestions[prof];
          const jobs = insights?.jobs || [];
          
          return (
            <div key={prof} className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-8 pb-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 
                  ${prof === Profession.LAW ? 'bg-blue-100 text-blue-600' : 
                    prof === Profession.PSYCHOLOGY ? 'bg-purple-100 text-purple-600' : 
                    'bg-pink-100 text-pink-600'}`}>
                  <ProfileIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{prof}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm h-12 line-clamp-2">
                  {profileData.summary}
                </p>

                {hasScore ? (
                   <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Aptitude</span>
                    <div className="text-3xl font-extrabold text-slate-900">{score}%</div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${score > 70 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <button 
                      onClick={() => startProfessionQuiz(prof)}
                      className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Test My Aptitude
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-2">Takes ~2 minutes</p>
                  </div>
                )}
              </div>

              {/* Suggestions / Details Area */}
              <div className="flex-grow bg-slate-50 border-t border-slate-100 p-6">
                 {hasScore ? (
                  isLoadingInsights && !insights ? (
                    <div className="text-center py-8">
                       <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                       <p className="text-slate-500 text-sm font-medium">AI is generating insights...</p>
                    </div>
                  ) : insights ? (
                    <div className="space-y-6">
                      
                      {/* Job Matches Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          AI Career Matches
                        </h4>
                        {jobs.map((job: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-pointer hover:border-blue-300 transition-all"
                               onClick={() => setExpandedJobIndex(expandedJobIndex === idx ? null : idx)}>
                            <div className="flex justify-between items-start">
                               <h5 className="font-bold text-slate-800 text-sm">{job.title}</h5>
                               {expandedJobIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                            </div>
                            
                            {expandedJobIndex === idx && (
                              <div className="mt-3 text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-2 animate-fadeIn">
                                 <p className="italic text-slate-500">{job.summary}</p>
                                 <div className="bg-blue-50 p-2 rounded text-blue-800">
                                   <strong>Salary:</strong>
                                   <pre className="whitespace-pre-wrap font-sans mt-1">{job.salary}</pre>
                                 </div>
                                 <div>
                                   <strong>Pathway:</strong>
                                   <p className="mt-1">{job.pathway}</p>
                                 </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={() => setState(prev => ({...prev, step: AppStep.TASK_PAGE, selectedProfession: prof}))}
                          className="w-full py-2 bg-orange-50 text-orange-700 font-bold rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <ClipboardList className="w-4 h-4" />
                          View Practice Tasks
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      Insights loaded. Click detail view to see more.
                    </div>
                  )
                 ) : (
                   <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
                     Take the quiz to unlock AI career roles
                   </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {renderResponseHistory()}
      
      <div className="mt-12 text-center">
         <button 
           onClick={() => setShowHistory(!showHistory)}
           className="text-slate-500 hover:text-slate-800 font-medium underline underline-offset-4"
         >
           {showHistory ? "Hide Response History" : "View Full Response History"}
         </button>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Pathio Logo" className="h-16 w-auto" />
             </div>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              Taste the Reality before Responsibility. We help students discover their true professional calling through science and experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-slate-200">Quick Links</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <button onClick={() => navigateTo(AppStep.HOME)} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo(AppStep.ABOUT)} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo(AppStep.TEAM)} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Our Team
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-slate-200">Contact Us</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</span>
                  <a href="mailto:contact@pathio.in" className="text-white hover:text-blue-400 transition-colors">contact@pathio.in</a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                   <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</span>
                  <span className="text-white">+91 98765 43210</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                   <Map className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location</span>
                  <span className="text-white">New Delhi, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Pathio Career Compass. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header - Optimized Height & Color */}
      <header className="sticky top-0 z-50 bg-[#0047AB] shadow-sm transition-all duration-300 h-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between relative">
          {/* Logo - Large but contained */}
           <div 
            className="flex items-center gap-3 cursor-pointer group h-full py-2" 
            onClick={() => navigateTo(AppStep.HOME)}
          >
            <img src="/logo.png" alt="Pathio Logo" className="h-full w-auto object-contain transition-transform group-hover:scale-105" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <button onClick={() => navigateTo(AppStep.HOME)} className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-white ${state.step === AppStep.HOME ? 'text-white' : 'text-blue-200'}`}>Home</button>
            <button onClick={() => navigateTo(AppStep.ABOUT)} className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-white ${state.step === AppStep.ABOUT ? 'text-white' : 'text-blue-200'}`}>About</button>
            <button onClick={() => navigateTo(AppStep.TEAM)} className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-white ${state.step === AppStep.TEAM ? 'text-white' : 'text-blue-200'}`}>Team</button>
            {state.userDetails && (
              <div className="flex items-center gap-3 pl-4 border-l border-blue-400">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold border border-blue-300">
                  {state.userDetails.name[0]}
                </div>
                <button onClick={resetApp} className="text-xs font-bold text-red-300 hover:text-red-100 px-2 py-1 rounded transition-colors">
                  Restart
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col p-4 animate-in slide-in-from-top-5">
            <button onClick={() => navigateTo(AppStep.HOME)} className="p-4 text-left font-bold text-slate-700 hover:bg-slate-50 rounded-lg">Home</button>
            <button onClick={() => navigateTo(AppStep.ABOUT)} className="p-4 text-left font-bold text-slate-700 hover:bg-slate-50 rounded-lg">About</button>
            <button onClick={() => navigateTo(AppStep.TEAM)} className="p-4 text-left font-bold text-slate-700 hover:bg-slate-50 rounded-lg">Team</button>
             {state.userDetails && (
               <button onClick={resetApp} className="p-4 text-left font-bold text-red-500 hover:bg-red-50 rounded-lg border-t border-slate-100 mt-2">Restart App</button>
             )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative w-full max-w-[100vw] overflow-x-hidden">
        {state.step === AppStep.HOME && renderHome()}
        {state.step === AppStep.ABOUT && renderAbout()}
        {state.step === AppStep.TEAM && renderTeam()}
        
        {state.step === AppStep.USER_DETAILS && renderUserDetails()}

        {state.step === AppStep.QUIZ_GENERAL && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
             <div className="w-full max-w-2xl mb-8">
               <button onClick={resetApp} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
               </button>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">General Assessment</h2>
               <p className="text-slate-500">Discover your core archetype to find the best career fit.</p>
             </div>
             <QuizCard 
              question={GENERAL_QUESTIONS[currentQuestionIndex]}
              onAnswer={handleGeneralAnswer}
              currentNumber={currentQuestionIndex + 1}
              total={GENERAL_QUESTIONS.length}
              onPrevious={handlePrevious}
              hasPrevious={currentQuestionIndex > 0}
              selectedValue={state.generalAnswers[currentQuestionIndex]}
            />
          </div>
        )}

        {state.step === AppStep.PROFESSION_SELECTION && renderProfessionSelection()}

        {state.step === AppStep.TASK_PAGE && renderTaskPage()}

        {state.step === AppStep.QUIZ_PROFESSION && state.selectedProfession && (
           <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
             <div className="w-full max-w-2xl mb-8">
               <button 
                onClick={() => setState(prev => ({...prev, step: AppStep.PROFESSION_SELECTION}))}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-4 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" /> Back to Careers
               </button>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">{state.selectedProfession} Aptitude</h2>
               <p className="text-slate-500">Test your natural skills for this career path.</p>
             </div>
             <QuizCard 
              question={PROFESSION_QUESTIONS[state.selectedProfession][currentQuestionIndex]}
              onAnswer={handleProfessionAnswer}
              currentNumber={currentQuestionIndex + 1}
              total={PROFESSION_QUESTIONS[state.selectedProfession].length}
              onPrevious={handlePrevious}
              hasPrevious={currentQuestionIndex > 0}
              selectedValue={state.professionAnswers[currentQuestionIndex]}
            />
          </div>
        )}
      </main>

      {renderFooter()}
    </div>
  );
};

export default App;