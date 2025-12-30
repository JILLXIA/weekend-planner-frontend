import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange, icon, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (e: React.MouseEvent, option: string) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {icon}
        {label}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 rounded-lg border bg-white cursor-pointer min-h-[50px] flex flex-wrap gap-2 items-center transition-all ${
            isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {selected.length === 0 && (
             <span className="text-gray-400 select-none">{placeholder}</span>
          )}
          {selected.map(item => (
            <span key={item} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="capitalize">{item}</span>
              <button 
                onClick={(e) => removeOption(e, item)} 
                className="hover:text-blue-900 focus:outline-none ml-1 rounded-full hover:bg-blue-200 w-4 h-4 flex items-center justify-center leading-none"
              >
                &times;
              </button>
            </span>
          ))}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
             <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {options.map(option => (
              <div
                key={option}
                onClick={() => toggleOption(option)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors"
              >
                <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${selected.includes(option) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {selected.includes(option) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    )}
                </div>
                <span className="capitalize">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
