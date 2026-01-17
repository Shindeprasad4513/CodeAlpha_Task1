
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  createdAt: number;
}

export interface CardFormData {
  question: string;
  answer: string;
}

export type ViewMode = 'study' | 'manage' | 'generate';
