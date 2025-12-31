import React, { useState, useEffect } from 'react';
import { PlannerFormData } from '../types';
import { CUISINES, MOVIE_GENRES, EVENT_SEGMENTS } from '../constants';
import { MapPinIcon, CalendarIcon, UtensilsIcon, FilmIcon, TicketIcon, SendIcon, SparklesIcon } from './Icons';
import MultiSelect from './MultiSelect';

interface PlannerFormProps {
  onSubmit: (data: PlannerFormData) => void;
  isLoading: boolean;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PlannerFormData>({
    city: '',
    email: '',
    date: '',
    cuisine: [],
    genre: [],
    eventType: '',
  });

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 8);

    setMinDate(today.toISOString().split('T')[0]);
    setMaxDate(max.toISOString().split('T')[0]);
    // Set default date to today
    setFormData(prev => ({ ...prev, date: today.toISOString().split('T')[0] }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (name: keyof PlannerFormData, value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.city.trim() && formData.email.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-yellow-300" />
          Plan Your Weekend
        </h2>
        <p className="text-blue-100 mt-2">
          Tell us your preferences and we'll email you a curated itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City Input */}
          <div className="space-y-2">
            <label htmlFor="city" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPinIcon className="w-4 h-4 text-blue-500" />
              Where are you going? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Baltimore, San Jose"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            When does it start? <span className="text-red-500">*</span>
            <span className="text-xs font-normal text-gray-500">(Max 8 days from today)</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            min={minDate}
            max={maxDate}
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cuisine Input */}
            <MultiSelect
                label="Preferred Cuisine"
                options={CUISINES}
                selected={formData.cuisine}
                onChange={(val) => handleMultiChange('cuisine', val)}
                icon={<UtensilsIcon className="w-4 h-4 text-blue-500" />}
                placeholder="Select cuisines..."
            />

            {/* Genre Input */}
            <MultiSelect
                label="Movie Genre"
                options={MOVIE_GENRES}
                selected={formData.genre}
                onChange={(val) => handleMultiChange('genre', val)}
                icon={<FilmIcon className="w-4 h-4 text-blue-500" />}
                placeholder="Select genres..."
            />

            {/* Event Input */}
            <div className="space-y-2 md:col-span-2">
                <label htmlFor="eventType" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <TicketIcon className="w-4 h-4 text-blue-500" />
                    Event Type
                </label>
                 <div className="relative">
                    <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all"
                    >
                        <option value="">Any</option>
                        {EVENT_SEGMENTS.map(event => (
                            <option key={event} value={event}>{event === 'ALL' ? 'All Types' : event.charAt(0).toUpperCase() + event.slice(1)}</option>
                        ))}
                    </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98] ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
          }`}
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>
              Email My Plan <SendIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PlannerForm;
