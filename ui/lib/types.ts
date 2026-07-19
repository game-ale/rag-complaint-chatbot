// --- RAG Core Types ---
export interface Source {
  text: string;
  product: string;
  company: string;
  complaint_id: string;
}

export interface RAGResponse {
  question: string;
  answer: string;
  sources: Source[];
  response_time?: number;
}

export interface QuestionRequest {
  question: string;
  filters?: {
    product?: string;
    company?: string;
  };
  top_k?: number;
}

// --- Chat Types ---
export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  sources: Source[];
  product?: string;
  timestamp: number;
  feedback?: 'up' | 'down';
  responseTime?: number;
  isStreaming?: boolean;
}

// --- Dashboard Types ---
export interface DashboardStats {
  totalComplaints: number;
  products: number;
  todayQuestions: number;
  avgResponseTime: number;
}

export interface RecentActivity {
  id: string;
  question: string;
  product: string;
  timestamp: number;
}

// --- Complaint Explorer Types ---
export interface Complaint {
  id: string;
  product: string;
  issue: string;
  subIssue?: string;
  company: string;
  state: string;
  date: string;
  narrative: string;
}

export interface ComplaintFilters {
  product?: string;
  issue?: string;
  company?: string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// --- Analytics Types ---
export interface AnalyticsData {
  byProduct: { name: string; value: number }[];
  byMonth: { month: string; complaints: number; resolved: number }[];
  topIssues: { issue: string; count: number }[];
  topCompanies: { company: string; count: number }[];
  narrativeStats: {
    total: number;
    withNarrative: number;
    avgLength: number;
  };
}

// --- Evaluation Types ---
export interface EvaluationResult {
  id: number;
  question: string;
  answer: string;
  sources: Source[];
  qualityScore: number;
  comments: string;
  category: string;
}

// --- Comparison Types ---
export interface ComparisonResult {
  productA: { name: string; topIssues: { issue: string; count: number }[]; totalComplaints: number };
  productB: { name: string; topIssues: { issue: string; count: number }[]; totalComplaints: number };
}

// --- Trends Types ---
export interface TrendItem {
  issue: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  count: number;
}

export interface TrendData {
  trending: TrendItem[];
  timeline: { date: string; count: number }[];
}

// --- User Types ---
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin: number;
  totalQuestions: number;
}
