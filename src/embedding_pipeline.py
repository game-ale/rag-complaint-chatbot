import pandas as pd
import numpy as np
from tqdm import tqdm
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import os
import shutil

# Configuration
INPUT_FILE = 'data/processed/filtered_complaints.csv'
SAMPLE_OUTPUT_FILE = 'data/processed/complaints_sample.csv'
VECTOR_STORE_DIR = 'vector_store'
SAMPLE_SIZE = 15000
RANDOM_SEED = 42

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'

def ensure_dir_clean(directory):
    if os.path.exists(directory):
        # shutil.rmtree(directory) # Optional: Clear existing store? Maybe safer not to auto-delete unless requested.
        pass
    else:
        os.makedirs(directory)

def load_and_sample_data():
    print(f"Loading data from {INPUT_FILE}...")
    df = pd.read_csv(INPUT_FILE)
    print(f"Total records: {len(df)}")
    
    print("Creating stratified sample...")
    # Stratified sampling by Product
    # Use groupby and apply sample, handling cases where group size < required sample size
    # First, calculate weights
    product_counts = df['product'].value_counts(normalize=True)
    print("Product Distribution:\n", product_counts)
    
    # Simple stratified sampling
    # We can use train_test_split with stratify, but we just want a subset.
    # Let's use sklearn
    from sklearn.model_selection import train_test_split
    
    # If dataset is smaller than sample size, take it all
    if len(df) <= SAMPLE_SIZE:
        sample_df = df
    else:
        sample_df, _ = train_test_split(
            df, 
            train_size=SAMPLE_SIZE, 
            stratify=df['product'], 
            random_state=RANDOM_SEED
        )
    
    print(f"Sampled {len(sample_df)} records.")
    sample_df.to_csv(SAMPLE_OUTPUT_FILE, index=False)
    print(f"Saved sample to {SAMPLE_OUTPUT_FILE}")
    return sample_df

def chunk_data(df):
    print("Chunking data...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    
    documents = []
    
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Chunking"):
        narrative = row['cleaned_narrative']
        if pd.isna(narrative):
            continue
            
        chunks = text_splitter.split_text(str(narrative))
        total_chunks = len(chunks)
        
        for i, chunk in enumerate(chunks):
            # Create metadata dict
            meta = {
                'complaint_id': str(row['complaint_id']),
                'product': str(row['product']),
                'issue': str(row['issue']),
                'sub_issue': str(row.get('sub_issue', '')),
                'company': str(row['company']),
                'date_received': str(row['date_received']),
                'chunk_index': i,
                'total_chunks': total_chunks
            }
            # Clean none/nan values in metadata
            meta = {k: v if v != 'nan' else '' for k, v in meta.items()}
            
            documents.append({
                'text': chunk,
                'metadata': meta,
                'id': f"{row['complaint_id']}_{i}"
            })
            
    print(f"Generated {len(documents)} chunks from {len(df)} complaints.")
    return documents

def create_vector_store(documents):
    print(f"Initializing Embedding Model: {EMBEDDING_MODEL_NAME}...")
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    
    # Calculate embeddings
    texts = [doc['text'] for doc in documents]
    
    print("Generating Embeddings (this may take a while)...")
    # Batch processing for embeddings
    batch_size = 256
    embeddings = []
    for i in tqdm(range(0, len(texts), batch_size), desc="Embedding"):
        batch_texts = texts[i:i+batch_size]
        batch_embeddings = model.encode(batch_texts)
        embeddings.extend(batch_embeddings)
        
    print(f"Generated {len(embeddings)} embeddings.")
    
    # Initialize ChromaDB
    print(f"Initializing ChromaDB in {VECTOR_STORE_DIR}...")
    client = chromadb.PersistentClient(path=VECTOR_STORE_DIR)
    
    # Delete collection if exists to start fresh (for this task)
    try:
        client.delete_collection("complaints_rag")
    except Exception as e:
        print(f"Collection delete skipped: {e}")
        
    collection = client.create_collection(name="complaints_rag")
    
    # Add to ChromaDB in batches to avoid message size limits
    ids = [doc['id'] for doc in documents]
    metadatas = [doc['metadata'] for doc in documents]
    
    print("Indexing to ChromaDB...")
    chroma_batch_size = 5000 # Chroma limit is usually ~40k but safer lower
    for i in tqdm(range(0, len(ids), chroma_batch_size), desc="Indexing"):
        end_idx = i + chroma_batch_size
        collection.add(
            documents=texts[i:end_idx],
            embeddings=embeddings[i:end_idx],
            metadatas=metadatas[i:end_idx],
            ids=ids[i:end_idx]
        )
        
    print("Indexing Complete.")
    return client, collection

def sanity_check(collection):
    print("\n--- Sanity Retrieval Test ---")
    question = "Billing issues with credit cards"
    print(f"Query: {question}")
    
    # We need to embed the query using the same model, but Chroma handles if we set embedding function.
    # However, since we passed raw embeddings, we might need to embed the query manually or set the function in collection.
    # Simplest: Embed query manually here using the model we already loaded (re-instantiate or pass it).
    
    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    query_vec = model.encode([question]).tolist()
    
    results = collection.query(
        query_embeddings=query_vec,
        n_results=3
    )
    
    for i, (doc, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
        print(f"\nResult {i+1}:")
        print(f"Product: {meta.get('product')}")
        print(f"Issue: {meta.get('issue')}")
        print(f"Text Snippet: {doc[:200]}...")
        print("-" * 50)

if __name__ == "__main__":
    ensure_dir_clean(VECTOR_STORE_DIR)
    
    # 2. Sample
    sample_df = load_and_sample_data()
    
    # 3. Chunk
    chunks = chunk_data(sample_df)
    
    # 5 & 6. Embed and Index
    client, collection = create_vector_store(chunks)
    
    # 8. Test
    sanity_check(collection)
