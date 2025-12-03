import React, { useState, useEffect } from 'react';
import { AppStep, Archetype, Profession, QuizState } from './types';
import { GENERAL_QUESTIONS, PROFESSION_QUESTIONS } from './data';
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
  CheckCircle2
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
        // Calculate percentage: Max score is 100 (10 questions * 10 points max)
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
          // Transition to results even on error (service handles fallback data)
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

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto px-6 fade-in">
      <div className="bg-blue-50 p-4 rounded-full mb-8 animate-bounce">
        <Sparkles className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
        Discover Your <span className="text-blue-600">Real</span> Career Fit
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
        Careers are not a single bullet — uncover what truly matches your skills.
      </p>
      
      <button 
        onClick={startQuiz}
        className="group bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        Start Quiz 1
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-20 border-t border-slate-200 pt-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">About the Event</h3>
        <p className="text-slate-500 max-w-3xl mx-auto italic border-l-4 border-green-500 pl-6 py-2 bg-slate-50 rounded-r-lg text-left">
          "Ideas talk, prototypes act. ShowCase provides a platform for students to turn ideas into functional creations like models, apps, or designs. Rooted in SDG 12: Responsible Consumption and Production, this event promotes sustainable, efficient, and responsible innovation."
        </p>
      </div>
    </div>
  );

  const renderProfessionSelection = () => (
    <div className="max-w-4xl mx-auto px-6 py-10 fade-in">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 2 of 3</span>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Which path interests you most?</h2>
        <p className="text-slate-600">Select a profession to test your aptitude.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(Profession).map((prof) => (
          <button
            key={prof}
            onClick={() => selectProfession(prof)}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 group h-40"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="font-semibold text-slate-800 group-hover:text-blue-700 text-center">{prof}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Your Profile</h2>
      <p className="text-slate-500">Connecting your skills with your ambition...</p>
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
           <p className="text-slate-600 mt-2">Here is how your natural skills align with your goals.</p>
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
          Recommended Roles for You
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {state.jobSuggestions.map((job, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="mb-4">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h4>
                <div className="w-10 h-1 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-slate-600 text-sm mb-6 flex-grow">{job.description}</p>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-auto">
                <p className="text-green-800 text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Why you fit
                </p>
                <p className="text-green-700 text-sm">{job.fitReason}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={resetApp}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Retake Quizzes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-lg tracking-tight">ShowCase</span>
          </div>
          {state.step !== AppStep.HOME && (
            <button onClick={resetApp} className="text-sm font-medium text-slate-500 hover:text-blue-600">
              Exit
            </button>
          )}
        </div>
      </nav>

      <main className="flex-grow pt-8 pb-12">
        {state.step === AppStep.HOME && renderHome()}
        
        {state.step === AppStep.QUIZ_GENERAL && (
          <div className="flex flex-col items-center px-4">
            <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 1 of 3</span>
              <h2 className="text-2xl font-bold text-slate-900">General Skills Assessment</h2>
            </div>
            <QuizCard 
              question={GENERAL_QUESTIONS[currentQuestionIndex]} 
              onAnswer={handleGeneralAnswer}
              currentNumber={currentQuestionIndex + 1}
              total={GENERAL_QUESTIONS.length}
            />
          </div>
        )}

        {state.step === AppStep.PROFESSION_SELECTION && renderProfessionSelection()}
        
        {state.step === AppStep.QUIZ_PROFESSION && (
          <div className="flex flex-col items-center px-4">
             <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">STEP 3 of 3</span>
              <h2 className="text-2xl font-bold text-slate-900">{state.selectedProfession} Aptitude</h2>
            </div>
            <QuizCard 
              question={PROFESSION_QUESTIONS[state.selectedProfession!][currentQuestionIndex]} 
              onAnswer={handleProfessionAnswer}
              currentNumber={currentQuestionIndex + 1}
              total={PROFESSION_QUESTIONS[state.selectedProfession!].length}
            />
          </div>
        )}

        {state.step === AppStep.LOADING_RESULTS && renderLoading()}
        {state.step === AppStep.RESULTS && renderResults()}
      </main>
    </div>
  );
};

export default App;