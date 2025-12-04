import React, { useState, useEffect } from 'react';
import { AppStep, Archetype, Profession, QuizState } from './types';
import { GENERAL_QUESTIONS, PROFESSION_QUESTIONS, PROFESSION_OVERVIEWS } from './data';
import { getCareerInsights } from './services/geminiService';
import { QuizCard } from './components/QuizCard';
import { 
  BrainCircuit, 
  Lightbulb, 
  Users, 
  Wrench, 
  ArrowRight, 
  RefreshCcw,
  Sparkles,
  Briefcase,
  GraduationCap,
  Loader2,
  CheckCircle2,
  Scale,
  Palette,
  Heart
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    step: AppStep.HOME,
    generalAnswers: {
      [Archetype.CREATIVE]: 0,
      [Archetype.LOGICAL]: 0,
      [Archetype.SOCIAL]: 0,
      [Archetype.PRACTICAL]: 0,
    },
    selectedProfession: null,
    professionScore: 0,
    finalArchetype: null,
    jobSuggestions: []
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // --- Handlers ---

  const navigateTo = (step: AppStep) => {
    setState(prev => ({ ...prev, step }));
    setCurrentQuestionIndex(0);
  };

  const startQuiz = () => {
    setState(prev => ({ ...prev, step: AppStep.QUIZ_GENERAL }));
    setCurrentQuestionIndex(0);
  };

  const handleGeneralAnswer = (value: string | number) => {
    const archetype = value as Archetype;
    // Update score map
    const newAnswers = {
      ...state.generalAnswers,
      [archetype]: state.generalAnswers[archetype] + 1
    };
    
    // Check if last question
    if (currentQuestionIndex < GENERAL_QUESTIONS.length - 1) {
      setState(prev => ({ ...prev, generalAnswers: newAnswers }));
      setCurrentQuestionIndex(curr => curr + 1);
    } else {
      // Calculate archetype immediately
      const result = Object.entries(newAnswers).reduce((a, b) => a[1] > b[1] ? a : b)[0] as Archetype;
      
      setState(prev => ({
        ...prev,
        generalAnswers: newAnswers,
        finalArchetype: result,
        step: AppStep.PROFESSION_SELECTION
      }));
      setCurrentQuestionIndex(0);
    }
  };

  const selectProfession = (prof: Profession) => {
    setState(prev => ({
      ...prev,
      selectedProfession: prof,
      step: AppStep.PROFESSION_OVERVIEW
    }));
  };

  const startProfessionQuiz = () => {
    setState(prev => ({
      ...prev,
      step: AppStep.QUIZ_PROFESSION
    }));
    setCurrentQuestionIndex(0);
  };

  const handleProfessionAnswer = (value: string | number) => {
    const score = value as number;
    const isLastQuestion = currentQuestionIndex === PROFESSION_QUESTIONS[state.selectedProfession!].length - 1;
    
    if (isLastQuestion) {
      const finalScore = state.professionScore + score;
      setState(prev => ({
        ...prev,
        professionScore: finalScore,
        step: AppStep.LOADING_RESULTS
      }));
    } else {
      setState(prev => ({
        ...prev,
        professionScore: prev.professionScore + score
      }));
      setCurrentQuestionIndex(curr => curr + 1);
    }
  };

  const resetApp = () => {
    setState({
      step: AppStep.HOME,
      generalAnswers: {
        [Archetype.CREATIVE]: 0,
        [Archetype.LOGICAL]: 0,
        [Archetype.SOCIAL]: 0,
        [Archetype.PRACTICAL]: 0,
      },
      selectedProfession: null,
      professionScore: 0,
      finalArchetype: null,
      jobSuggestions: []
    });
    setCurrentQuestionIndex(0);
  };

  // --- Effects ---

  useEffect(() => {
    let mounted = true;
    
    const fetchResults = async () => {
      if (state.step === AppStep.LOADING_RESULTS && state.selectedProfession && state.finalArchetype) {
        const matchScore = Math.min(100, Math.round((state.professionScore / 100) * 100));
        
        try {
          const suggestions = await getCareerInsights(state.finalArchetype, state.selectedProfession, matchScore);
          
          if (mounted) {
            setState(prev => ({
              ...prev,
              jobSuggestions: suggestions,
              step: AppStep.RESULTS
            }));
          }
        } catch (e) {
          console.error(e);
          if (mounted) {
            setState(prev => ({ ...prev, step: AppStep.RESULTS }));
          }
        }
      }
    };

    fetchResults();

    return () => { mounted = false; };
  }, [state.step, state.selectedProfession, state.finalArchetype, state.professionScore]);


  // --- Renderers ---

  const renderFooterCaption = () => (
    <p className="text-slate-500 font-semibold italic text-lg tracking-wide text-center mt-12 mb-6">
      PATHIO - Taste the Reality before Responsibility
    </p>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto px-6 fade-in">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
        Discover Your Real Career Fit
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
        Unlock the path that truly matches your unique skills and potential.
      </p>
      
      <button 
        onClick={startQuiz}
        className="group bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 px-12 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 hover:-translate-y-1 mb-8"
      >
        Start Quiz
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      {renderFooterCaption()}
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-3xl mx-auto px-6 py-12 fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">About Us</h2>
      <div className="bg-white rounded-2xl shadow-sm p-8 border-l-8 border-green-500 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">SHOWCASE</h3>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          "Ideas talk, prototypes act. We provide a platform for students to turn ideas into functional creations like models, apps, or designs."
        </p>
        <p className="text-slate-600 text-lg leading-relaxed">
          Rooted in <strong className="text-green-700">SDG 12: Responsible Consumption and Production</strong>, we promote sustainable, efficient, and responsible innovation.
        </p>
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
              Mayank Sharma
            </li>
          </ul>
        </div>

        {/* PitchVerse */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">PitchVerse</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Aanya Bhatnagar
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Aayushi Balsara
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Sneha Prajapati
            </li>
          </ul>
        </div>

        {/* InstaVista */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">InstaVista</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              Arun Kumar
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              Advik Bhargwa
            </li>
          </ul>
        </div>

        {/* Market o drama */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-slate-100 pb-3 uppercase tracking-wide">Market o drama</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Sharanya Sampath
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Shobhin Malkoti
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Prashasti Singh
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Khyati
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Riyaan Tongaria
            </div>
            <div className="flex items-center gap-3 text-slate-700 text-lg">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Arpita Tripathi
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
      case Profession.PSYCHOLOGY: return Heart;
      case Profession.DESIGNING: return Palette;
      default: return Briefcase;
    }
  };

  const renderProfessionSelection = () => (
    <div className="max-w-4xl mx-auto px-6 py-10 fade-in">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 2 of 4</span>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Which path interests you most?</h2>
        <p className="text-slate-600">Select a path to explore its possibilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.values(Profession).map((prof) => {
          const Icon = getProfessionIcon(prof);
          return (
            <button
              key={prof}
              onClick={() => selectProfession(prof)}
              className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-64"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon className="w-8 h-8" />
              </div>
              <span className="font-bold text-xl text-slate-800 group-hover:text-blue-700 text-center">{prof}</span>
            </button>
          );
        })}
      </div>
      {renderFooterCaption()}
    </div>
  );

  const renderProfessionOverview = () => {
    if (!state.selectedProfession) return null;
    const info = PROFESSION_OVERVIEWS[state.selectedProfession];
    const Icon = getProfessionIcon(state.selectedProfession);

    return (
      <div className="max-w-5xl mx-auto px-6 py-10 fade-in">
        <div className="mb-8 text-center">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 3 of 4</span>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8">
          <div className="bg-slate-900 p-10 md:p-14 text-white text-center">
            <Icon className="w-20 h-20 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The World of {state.selectedProfession}</h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">{info.description}</p>
          </div>
          
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Key Fields in this Path</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-12">
              {info.fields.map((field, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-blue-50 hover:border-blue-100">
                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                   <span className="font-medium text-slate-800 text-lg leading-tight">{field}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
              <p className="text-slate-700 mb-6 font-medium text-lg">Ready to see where you fit within {state.selectedProfession}?</p>
              <button 
                onClick={startProfessionQuiz}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-12 rounded-full transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1"
              >
                Take Aptitude Test
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        {renderFooterCaption()}
      </div>
    );
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Your Profile</h2>
      <p className="text-slate-500 mb-8">Finding the perfect niche for you...</p>
      {renderFooterCaption()}
    </div>
  );

  const renderResults = () => {
    const matchPercentage = Math.min(100, Math.round((state.professionScore / 100) * 100));

    // Icon helper
    const ArchetypeIcon = {
      [Archetype.CREATIVE]: Lightbulb,
      [Archetype.LOGICAL]: BrainCircuit,
      [Archetype.SOCIAL]: Users,
      [Archetype.PRACTICAL]: Wrench
    }[state.finalArchetype!] || Sparkles;

    return (
      <div className="max-w-5xl mx-auto px-6 py-8 fade-in pb-20">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-slate-900">Your Career Profile</h2>
           <p className="text-slate-600 mt-2">Here is how your natural skills align with your choice.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Card A: Skill Type */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-purple-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <ArchetypeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Your Archetype</h3>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-2">{state.finalArchetype}</p>
            <p className="text-slate-600">
              Based on your skills quiz, you naturally excel in this area.
            </p>
          </div>

          {/* Card B: Profession Match */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-blue-500">
             <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Aptitude Match</h3>
            </div>
            <div className="flex items-end gap-3 mb-2">
              <p className="text-5xl font-bold text-blue-600">{matchPercentage}%</p>
              <p className="text-slate-500 font-medium pb-1 mb-1">match for {state.selectedProfession}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${matchPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Section C: Suggestions */}
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <Sparkles className="text-yellow-500" />
          Recommended Careers in {state.selectedProfession}
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {state.jobSuggestions.map((job, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="mb-4">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h4>
                <div className="w-10 h-1 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">{job.description}</p>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-auto">
                <p className="text-green-800 text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Why you fit
                </p>
                <p className="text-green-700 text-sm">{job.fitReason}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <button 
            onClick={resetApp}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Start Over
          </button>
        </div>
        {renderFooterCaption()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Ribbon Header */}
      <nav className="bg-blue-700 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => navigateTo(AppStep.HOME)}
          >
            <img 
              src="/logo.png" 
              alt="PATHIO - change the reality before the responsibility" 
              className="h-12 w-auto object-contain"
            />
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

      <main className="flex-grow pt-12 pb-12">
        {state.step === AppStep.HOME && renderHome()}
        {state.step === AppStep.ABOUT && renderAbout()}
        {state.step === AppStep.TEAM && renderTeam()}
        
        {state.step === AppStep.QUIZ_GENERAL && (
          <div className="flex flex-col items-center px-4">
            <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 1 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900">General Skills Assessment</h2>
            </div>
            <QuizCard 
              question={GENERAL_QUESTIONS[currentQuestionIndex]} 
              onAnswer={handleGeneralAnswer}
              currentNumber={currentQuestionIndex + 1}
              total={GENERAL_QUESTIONS.length}
            />
            {renderFooterCaption()}
          </div>
        )}

        {state.step === AppStep.PROFESSION_SELECTION && renderProfessionSelection()}
        
        {state.step === AppStep.PROFESSION_OVERVIEW && renderProfessionOverview()}
        
        {state.step === AppStep.QUIZ_PROFESSION && (
          <div className="flex flex-col items-center px-4">
             <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 4 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900">{state.selectedProfession} Aptitude</h2>
            </div>
            <QuizCard 
              question={PROFESSION_QUESTIONS[state.selectedProfession!][currentQuestionIndex]} 
              onAnswer={handleProfessionAnswer}
              currentNumber={currentQuestionIndex + 1}
              total={PROFESSION_QUESTIONS[state.selectedProfession!].length}
            />
            {renderFooterCaption()}
          </div>
        )}

        {state.step === AppStep.LOADING_RESULTS && renderLoading()}
        {state.step === AppStep.RESULTS && renderResults()}
      </main>
    </div>
  );
};

export default App;