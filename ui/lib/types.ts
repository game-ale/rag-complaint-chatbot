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
}

export interface QuestionRequest {
  question: string;
  filters?: {
    product?: string;
    company?: string;
  };
}
