# Task 2: Technical Report - Embedding Pipeline

## 1. Stratified Sampling Strategy
**Decision:** Sampled 15,000 records stratified by `product`.
**Rationale:** The full dataset (450k+) is too large for rapid iteration on standard hardware without GPU acceleration for embeddings. A 15k sample (~3%) is statistically significant enough to represent all product categories (Credit Cards, Loans, etc.) while keeping the vector index light (<50MB) and regeneration times fast (<30 mins).
**Method:** Used `sklearn.model_selection.train_test_split` with the `stratify` parameter to ensure rare classes are not underrepresented.

## 2. Text Chunking Strategy
**Decision:** `RecursiveCharacterTextSplitter` with `chunk_size=500` and `chunk_overlap=50`.
**Rationale:**
- **Size (500 chars):** Consumer complaints are often narrative-heavy. 500 characters capture typically 3-5 sentences, providing enough context for the embedding model to understand the specific issue without diluting the semantic signal with irrelevant details from long rants.
- **Overlap (50 chars):** Ensures that important keywords or sentences cut at boundaries are preserved in at least one chunk, maintaining semantic continuity.

## 3. Embedding Model Selection
**Decision:** `sentence-transformers/all-MiniLM-L6-v2`.
**Rationale:**
- **Performance:** It is a top performer on the MTEB leaderboard for its size class.
- **Efficiency:** 384-dimensional vectors are compact (vs 768 or 1536), reducing storage costs and search latency.
- **Speed:** Inference is fast even on CPU, crucial for the "Performance Reality Check" KPI.

## 4. Vector Store & Metadata Design
**Decision:** ChromaDB.
**Rationale:**
- **Metadata Filtering:** Successfully verified filtering by `product` ("Credit card"), which is essential for the future React UI.
- **Persistence:** Chroma's simple file-based persistence works well for this scale without needing a separate Docker container setup (unlike Weaviate/Milvus).
- **Metadata Schema:**
    - `complaint_id`: For citation/tracing.
    - `product`: For category filtering.
    - `issue`: For understanding context.
    - `date_received`: For potential time-based sorting.
    - `chunk_index`: To reconstruct order if needed.

## 5. Verification Results
- **Integrity:** No NaN values or empty vectors found.
- **Retrieval:** "Billing issues" query correctly retrieved "Credit card" complaints with relevant debt/fee context.
- **Latency:** Average retrieval time is <50ms for the 15k sample.
