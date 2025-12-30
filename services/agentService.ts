import { PlannerFormData, AgentResponse } from '../types';

// The backend does not handle OPTIONS preflight requests (returns 405),
// so we use a CORS proxy to wrap the request. 
const TARGET_URL = 'https://fastapidemo-mihx.onrender.com/agent';
const API_URL = `https://corsproxy.io/?${encodeURIComponent(TARGET_URL)}`;

// Set a timeout (60 seconds) - assuming the backend acknowledges quickly before sending email async
// If backend is still synchronous but just slow, we might need a longer timeout, 
// but since the UI flow is now email-based, we treat this as a submission trigger.
const REQUEST_TIMEOUT_MS = 60 * 1000; 

export const fetchHolidayPlan = async (formData: PlannerFormData): Promise<AgentResponse> => {
  // Construct the natural language query
  const parts = [];
  parts.push(`Make a holiday plan for ${formData.city}`);
  
  if (formData.date) {
    parts.push(`starting on ${formData.date}`);
  }
  
  if (formData.cuisine && formData.cuisine.length > 0) {
    parts.push(`I prefer ${formData.cuisine.join(' and ')} cuisine`);
  }
  
  if (formData.genre && formData.genre.length > 0) {
    parts.push(`I like ${formData.genre.join(' and ')} movies`);
  }
  
  if (formData.eventType) {
    if (formData.eventType === 'ALL') {
       parts.push(`I am interested in all types of events`);
    } else {
       parts.push(`I am interested in ${formData.eventType} events`);
    }
  }

  const query = parts.join('. ') + '.';

  // Setup AbortController for custom timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        email: formData.email, // Pass the email to the backend
        verbose: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Attempt to read error text if available
      const errorText = await response.text().catch(() => 'No error details');
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error fetching plan:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('The request timed out. Please try again.');
    }
    
    throw error;
  }
};
