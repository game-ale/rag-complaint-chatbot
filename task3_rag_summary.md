# Task 3: RAG Core Logic & Evaluation

## 1. System Architecture
- **Retriever:** `ChromaDB` with `all-MiniLM-L6-v2` embeddings. Params: `k=5`.
- **Generator:** `google/flan-t5-base` loaded via Hugging Face `pipeline` (local execution).
- **Prompt:** A strict "Financial Analyst" role-based template to minimize hallucination.

## 2. Design Decisions
### Prompt Engineering
The prompt matches the requirement to prevent hallucination:
```text
You are a financial analyst Assistant for CrediTrust. Use the following context to answer the question. 
If the context does not contain the answer, say "I don't have enough information." and do not make up facts.
```
This forces the model to fallback safely.

### LLM Choice
Selected `google/flan-t5-base` because:
1. **Instruction Tuned:** Follows the "answer based on context" instruction well.
2. **Efficiency:** Runs on CPU/Standard Memory without heavy quantization needs (unlike Llama-2-7b).
3. **Local:** No API keys required, ensuring privacy and cost-free development.

## 3. UI Handoff (JSON Schema)
The API returns a JSON object ready for React.
**Schema:**
```json
{
  "question": "User's original query",
  "answer": "Generated natural language response",
  "sources": [
    {
      "text": "Full text of the complaint chunk...",
      "product": "Credit card",
      "company": "Citibank",
      "complaint_id": "123456"
    }
  ]
}
```
**Frontend Instructions:**
- Display `answer` as the main chat bubble.
- Render `sources` as an accordion or "Citations" list below the answer.
- All fields are strings.

## 4. Evaluation Strategy
The `notebooks/03_rag_evaluation.ipynb` performs a qualitative check on 5 distinct product categories.
**Metrics:**
- **Relevance:** Do sources match the product?
- **Grounding:** Does the answer come *only* from sources?
- **Format:** Is the JSON structure valid for the UI?

## 5. Known Limitations
- **Context Window:** Restricted to ~1000 characters to fit T5's input limit.
- **Speed:** CPU inference is slower than API calls (~2-5s per query).
