export interface PlannerFormData {
  city: string;
  email: string;
  date: string;
  cuisine: string[];
  genre: string[];
  eventType: string;
}

export interface AgentResponse {
  output: string;
  raw?: {
    input: string;
    output: string;
  };
}

export enum MovieGenre {
  Action = 'action',
  Adventure = 'adventure',
  Animation = 'animation',
  Comedy = 'comedy',
  Crime = 'crime',
  Documentary = 'documentary',
  Drama = 'drama',
  Family = 'family',
  Fantasy = 'fantasy',
  History = 'history',
  Horror = 'horror',
  Music = 'music',
  Mystery = 'mystery',
  Romance = 'romance',
  ScienceFiction = 'science fiction',
  SciFi = 'scifi',
  TVMovie = 'tv movie',
  Thriller = 'thriller',
  War = 'war',
  Western = 'western',
}

export enum EventSegment {
  Music = 'music',
  Sports = 'sports',
  All = 'ALL',
}
