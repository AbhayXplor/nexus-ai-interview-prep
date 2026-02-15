
export enum InterviewStatus {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  RESEARCHING = 'RESEARCHING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface FileItem {
  name: string;
  content: string;
  language: string;
  isOpen: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'INTERVIEWER' | 'CANDIDATE';
  text: string;
  timestamp: Date;
}

export interface InterviewState {
  status: InterviewStatus;
  userName: string;
  linkedInUrl: string;
  githubUrl: string;
  candidateSummary?: string; // Summary generated from research
  files: FileItem[];
  activeFileIndex: number;
  messages: ChatMessage[];
  isThinking: boolean;
  isMicActive: boolean;
  terminalOutput: string[];
  auditReport?: string;
}
