import React, { useState } from 'react';
import PlannerForm from './components/PlannerForm';
import { fetchHolidayPlan } from './services/agentService';
import { PlannerFormData } from './types';

function App() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');

  const handleFormSubmit = (data: PlannerFormData) => {
    // 1. Immediate UI transition (Optimistic UI)
    setUserEmail(data.email);
    setSuccess(true);
    setError(null);

    // 2. Trigger API in background (Fire and Forget)
    // We do not await this, so the UI remains in the success state regardless of network delay
    fetchHolidayPlan(data).catch(err => {
      console.error("Background Agent request failed:", err);
      // We log the error but do not disturb the user with an error message 
      // since the UI has already confirmed receipt.
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
               W
             </div>
             <h1 className="text-xl font-bold text-gray-900 tracking-tight">Weekend AI</h1>
          </div>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            About
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Hero Text */}
        {!success && (
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Your Weekend, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfectly Planned</span>
                </h2>
                <p className="text-lg text-gray-600">
                    Enter your preferences and our AI agent will email you a curated itinerary for movies, dining, and events.
                </p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section - Hide when success to focus on the message */}
          {!success && (
            <div className="lg:col-span-12 max-w-2xl mx-auto w-full">
              <PlannerForm onSubmit={handleFormSubmit} isLoading={false} />
            </div>
          )}

          {/* Status Section */}
          {(success || error) && (
            <div className="lg:col-span-12 w-full max-w-2xl mx-auto animate-fade-in-up">
              
              {error && (
                <div className="bg-red-50 rounded-xl border border-red-100 p-6 text-center text-red-600 mt-6">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {success && (
                 <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Agent running behind the scenes!</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-md">
                        The agent is busy crafting your perfect weekend plan.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-md w-full mb-8">
                        <p className="text-blue-800 font-medium">
                            An email will be sent to <span className="font-bold">{userEmail}</span> in approximately 10 minutes.
                        </p>
                    </div>
                    <button 
                        onClick={() => setSuccess(false)}
                        className="text-blue-600 font-semibold hover:text-blue-800 hover:underline"
                    >
                        Plan another weekend
                    </button>
                 </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © {new Date().getFullYear()} Weekend AI Planner. Powered by Agent API.
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
