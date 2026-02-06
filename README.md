# CrediTrust Complaint Analysis - RAG Chatbot

An intelligent complaint analysis system using Retrieval-Augmented Generation (RAG) to answer questions about customer financial complaints with evidence-backed responses.

## 🎯 Features

- **Enterprise-Grade UI**: Polished, dashboard-style interface with Dark Mode support via `next-themes`.
- **Evidence-Based Answers**: AI responses grounded in real customer complaint data.
- **Structured Analysis**: Answers partitioned into **Executive Summaries (TL;DR)** and **Deep Context Analysis**.
- **Source Traceability**: Every answer includes traceable sources with Case Reference IDs and metadata.
- **Product Filtering**: Context-aware filtering by financial product categories.
- **Smart UX**: Rotating example questions and "Initiate Analysis" workflows to guide users.
- **Production-Ready**: Built with Next.js 16+, TypeScript, and TailwindCSS legacy-free architecture.

## 🏗️ Architecture

### Backend
- **FastAPI**: REST API serving the RAG pipeline
- **ChromaDB**: Vector database for semantic search
- **FLAN-T5**: Local LLM for answer generation
- **Sentence Transformers**: all-MiniLM-L6-v2 for embeddings

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: Accessible component library

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

2. **Run the embedding pipeline** (first time only):
```bash
python src/embedding_pipeline.py
```
This creates the vector store from the complaint data (~15k samples).

3. **Start the API server**:
```bash
uvicorn src.api:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to UI directory**:
```bash
cd ui
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

The UI will be available at `http://localhost:3000`

## 📡 API Documentation

### POST /ask

**Request**:
```json
{
  "question": "What are the main issues with credit cards?",
  "filters": {
    "product": "Credit card"
  }
}
```

**Response**:
```json
{
  "question": "What are the main issues with credit cards?",
  "answer": "Based on the complaints, the main issues include...",
  "sources": [
    {
      "text": "Full complaint narrative...",
      "product": "Credit card",
      "company": "Citibank",
      "complaint_id": "123456"
    }
  ]
}
```

## 📁 Project Structure

```
rag-complaint-chatbot/
├── src/
│   ├── api.py                 # FastAPI backend
│   ├── rag_pipeline.py        # RAG core logic
│   └── embedding_pipeline.py  # Vector store creation
├── ui/
│   ├── app/
│   │   └── page.tsx          # Main chat interface
│   ├── components/
│   │   ├── ChatInput.tsx     # Question input
│   │   ├── AnswerPanel.tsx   # AI response display
│   │   ├── SourceList.tsx    # Citations container
│   │   └── SourceCard.tsx    # Individual source
│   └── lib/
│       ├── api.ts            # API client
│       └── types.ts          # TypeScript definitions
├── data/
│   ├── raw/                  # Original complaint data
│   └── processed/            # Cleaned datasets
├── vector_store/             # ChromaDB persistence
└── notebooks/                # EDA and evaluation
```

## 🧪 Testing

### Backend API Test
```bash
python scripts/test_api.py
```

### Task 3 Verification
```bash
python scripts/verify_task3.py
```

## 📊 Data Pipeline

1. **Task 1**: EDA & Preprocessing
   - Filtered to 5 product categories
   - Cleaned 454k+ complaints
   - Removed empty narratives

2. **Task 2**: Embedding & Indexing
   - Stratified sampling (15k records)
   - Chunking (500 chars, 50 overlap)
   - Vector indexing with metadata

3. **Task 3**: RAG Core Logic
   - Retrieval from ChromaDB
   - Prompt engineering for grounding
   - FLAN-T5 generation

4. **Task 4**: React UI
   - Next.js TypeScript application
   - Real-time API integration
   - Source citation display

## 🔒 Environment Variables

Create `ui/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Documentation

- [Task 1 EDA Summary](task1_eda_summary.md)
- [Task 2 Technical Report](task2_technical_report.md)
- [Task 3 RAG Summary](task3_rag_summary.md)

## 🎨 UI Components

All components are fully typed with TypeScript:

- **ChatInput**: Multi-line textarea with submit handling
- **AnswerPanel**: Formatted AI response display
- **SourceList**: Top 5 sources with metadata
- **SourceCard**: Expandable complaint cards with badges

## 🚦 Production Deployment

### Backend
```bash
uvicorn src.api:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd ui
npm run build
npm start
```

## 📈 Performance

- **Retrieval**: <50ms (15k sample)
- **Generation**: ~20-25s (CPU, FLAN-T5-base)
- **Total Latency**: ~25s per query

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16 |
| Language | TypeScript |
| Styling | TailwindCSS |
| UI Components | shadcn/ui |
| Backend API | FastAPI |
| Vector DB | ChromaDB |
| Embeddings | all-MiniLM-L6-v2 |
| LLM | google/flan-t5-base |

## 📄 License

MIT

## 👤 Author

Built as a portfolio project demonstrating production-grade RAG system development.
