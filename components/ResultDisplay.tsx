import React from 'react';

interface ResultDisplayProps {
  output: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ output }) => {
  // Simple parser to make the text look nicer
  const renderContent = (text: string) => {
    // Split by newlines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Clean up whitespace
      const trimmed = line.trim();
      
      if (!trimmed) {
        return <div key={index} className="h-4"></div>;
      }

      // Check for markdown links [text](url)
      // This regex handles multiple links in a line, but assumes simple structure
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        // Add text before link
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        
        // Add link
        parts.push(
          <a 
            key={`${index}-${match.index}`} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium break-all"
          >
            {match[1]}
          </a>
        );
        
        lastIndex = linkRegex.lastIndex;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // If no links were found, parts will be empty, so just use line
      const content = parts.length > 0 ? parts : line;

      // Identify Headers (simple heuristic: short line, no dash, usually title case)
      // Or lines that look like main section headers in the specific output format provided
      const isHeader = !line.startsWith('-') && !line.startsWith(' ') && line.length < 100 && (
         line.includes('Weather') || 
         line.includes('Movies') || 
         line.includes('Cinemas') || 
         line.includes('Restaurants') || 
         line.includes('Events') || 
         line.includes('Itinerary') ||
         line.includes('Notes') ||
         line.includes('Weekend Plan')
      );

      // Main Title
      if (index === 0 && !line.startsWith('-')) {
        return (
          <h1 key={index} className="text-3xl font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-200">
            {content}
          </h1>
        );
      }

      // Section Headers
      if (isHeader) {
        return (
          <h2 key={index} className="text-xl font-bold text-indigo-700 mt-6 mb-3 flex items-center">
            {content}
          </h2>
        );
      }

      // List Items
      if (line.trim().startsWith('-')) {
        return (
          <li key={index} className="ml-4 pl-2 border-l-2 border-blue-100 text-gray-700 py-1 list-none">
            {/* Remove the leading dash for cleaner look if we use border */}
            <span className="font-medium mr-2 text-blue-500">•</span>
            {/* If parts exists (links), render parts, else strip the dash */}
            {parts.length > 0 ? parts : line.replace(/^-/, '').trim()}
          </li>
        );
      }

      // Nested Items (simple heuristic based on spaces)
      if (line.startsWith('  -')) {
         return (
          <div key={index} className="ml-10 text-sm text-gray-600 py-0.5">
             {parts.length > 0 ? parts : line.replace(/^\s*-/, '').trim()}
          </div>
         )
      }

      // Sub-headers like "Friday", "Saturday"
      if ((line === 'Friday' || line === 'Saturday' || line === 'Sunday') && !line.includes('-')) {
          return (
              <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2 pl-2 border-l-4 border-yellow-400 bg-yellow-50 py-1 rounded-r">
                  {content}
              </h3>
          )
      }

      // Standard Paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-1">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 animate-fade-in">
      <div className="prose prose-blue max-w-none">
        {renderContent(output)}
      </div>
    </div>
  );
};

export default ResultDisplay;
