import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import re

# Configuration
RAW_DATA_PATH = 'data/raw/complaints.csv'
PROCESSED_DATA_PATH = 'data/processed/filtered_complaints.csv'
EDA_OUTPUT_DIR = 'notebooks/eda_outputs'
CHUNK_SIZE = 100000

# Business Scope
TARGET_PRODUCTS = [
    'Credit card',
    'Credit card or prepaid card', # Checking if mapping is needed, but user said "Credit card". I'll stick to exact matches first or check distribution.
    'Personal loan',
    'Savings account',
    'Money transfer',
    'Money transfer, virtual currency, or money service',
    'Checking or savings account'
]
# Note: CFPB categories change over time. I will inspect the unique products first in EDA to map them correctly.
# For now, I will use a broader list and then refine based on EDA.
# Actually, the user specified: "Credit card, Personal loan, Savings account, and Money transfers".
# I'll check exact strings during EDA.

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

ensure_dir(EDA_OUTPUT_DIR)
ensure_dir('data/processed')

def perform_eda():
    print("Starting EDA...")
    
    product_counts = {}
    narrative_counts = {'total': 0, 'with_narrative': 0, 'null_narrative': 0}
    narrative_lengths = []
    
    # 1. First Pass: EDA stats
    # Using chunking to avoid memory issues with 6GB file
    for chunk in pd.read_csv(RAW_DATA_PATH, chunksize=CHUNK_SIZE, low_memory=False):
        # Product Distribution
        if 'Product' in chunk.columns:
            counts = chunk['Product'].value_counts()
            for prod, count in counts.items():
                product_counts[prod] = product_counts.get(prod, 0) + count
        
        # Narrative Availability
        if 'Consumer complaint narrative' in chunk.columns:
            chunk_total = len(chunk)
            narrative_counts['total'] += chunk_total
            non_null = chunk['Consumer complaint narrative'].notnull().sum()
            narrative_counts['with_narrative'] += non_null
            narrative_counts['null_narrative'] += (chunk_total - non_null)
            
            # Narrative Lengths (on a sample or full? Full might be too big for list. Let's take a sample or just min/max/mean stats)
            # We'll take lengths of ALL non-null narratives to be accurate for histogram
            valid_narratives = chunk['Consumer complaint narrative'].dropna()
            # Calculate word counts
            lengths = valid_narratives.astype(str).apply(lambda x: len(x.split())).tolist()
            narrative_lengths.extend(lengths)

    # 2. Visualize and Report
    print("EDA Complete. Generating Reports...")
    
    # Product Distribution
    prod_df = pd.DataFrame(list(product_counts.items()), columns=['Product', 'Count']).sort_values('Count', ascending=False)
    print("\nTop 10 Products:")
    print(prod_df.head(10))
    
    plt.figure(figsize=(12, 6))
    sns.barplot(data=prod_df.head(15), x='Count', y='Product')
    plt.title('Top 15 Products by Complaint Volume')
    plt.tight_layout()
    plt.savefig(f'{EDA_OUTPUT_DIR}/product_distribution.png')
    plt.close()

    # Narrative Availability
    print("\nNarrative Availability:")
    print(narrative_counts)
    missing_pct = (narrative_counts['null_narrative'] / narrative_counts['total']) * 100
    print(f"Missing Narratives: {missing_pct:.2f}%")

    # Narrative Lengths
    if narrative_lengths:
        lengths_series = pd.Series(narrative_lengths)
        print("\nNarrative Length Stats (Words):")
        print(lengths_series.describe())
        
        plt.figure(figsize=(10, 5))
        sns.histplot(narrative_lengths, bins=50, kde=True)
        plt.title('Distribution of Complaint Narrative Lengths (Word Count)')
        plt.xlabel('Word Count')
        plt.xlim(0, 1000) # Limit x-axis to see the main distribution
        plt.savefig(f'{EDA_OUTPUT_DIR}/narrative_lengths_hist.png')
        plt.close()
    
    return prod_df['Product'].tolist()


def clean_text(text):
    if not isinstance(text, str):
        return ""
    # Lowercase
    text = text.lower()
    # Remove boilerplate - crude example, refine as needed based on observation
    text = text.replace('xx/xx/xxxx', '') # common in CFPB redactions
    text = text.replace('xxxx', '')
    # Remove "i am writing to file a complaint" and variations - risky to do blindly without regex, 
    # but let's stick to safe normalization
    
    # Simple whitespace normalization
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def filter_and_process():
    print("\nStarting Filtering and Preprocessing...")
    
    # Define exact target products based on typical CFPB names. 
    # We will need to map the user's "Credit Card" to actual dataset values like "Credit card or prepaid card" or just "Credit card".
    # Based on experience with CFPB:
    # 'Credit card', 'Credit card or prepaid card', 'Prepaid card'
    # 'Mortgage' (not requested)
    # 'Student loan' (not requested)
    # 'Vehicle loan or lease' (maybe Personal loan?)
    # 'Payday loan, title loan, or personal loan' -> Personal loan
    # 'Checking or savings account' -> Savings account
    # 'Money transfer, virtual currency, or money service' -> Money transfer
    
    # Let's be strictly inclusive of anything containing the keywords
    keywords = ['credit card', 'personal loan', 'savings', 'money transfer']
    
    processed_chunks = []
    
    chunk_iter = pd.read_csv(RAW_DATA_PATH, chunksize=CHUNK_SIZE, low_memory=False)
    
    total_processed = 0
    
    for i, chunk in enumerate(chunk_iter):
        # Filter by Product
        # We'll normalize product names for filtering
        if 'Product' not in chunk.columns or 'Consumer complaint narrative' not in chunk.columns:
            continue
            
        chunk['Product_Normalized'] = chunk['Product'].astype(str).str.lower()
        
        # Filter mask
        # Matches any of our keywords
        mask_product = chunk['Product_Normalized'].apply(lambda x: any(k in x for k in keywords))
        # Matches non-null narrative
        mask_narrative = chunk['Consumer complaint narrative'].notnull()
        
        filtered_chunk = chunk[mask_product & mask_narrative].copy()
        
        if len(filtered_chunk) > 0:
            # Clean text
            filtered_chunk['cleaned_narrative'] = filtered_chunk['Consumer complaint narrative'].apply(clean_text)
            
            # Select columns
            cols_to_keep = [
                'Complaint ID', 'Product', 'Issue', 'Sub-issue', 'Company', 'Date received', 'cleaned_narrative'
            ]
            # Rename columns to match checklist requirements (snake_case)
            rename_map = {
                'Complaint ID': 'complaint_id',
                'Product': 'product',
                'Issue': 'issue',
                'Sub-issue': 'sub_issue',
                'Company': 'company',
                'Date received': 'date_received'
            }
            
            # Handle potential missing columns (Sub-issue might be null but column should exist)
            existing_cols = [c for c in cols_to_keep if c in filtered_chunk.columns]
            filtered_chunk = filtered_chunk[existing_cols]
            filtered_chunk = filtered_chunk.rename(columns=rename_map)
            
            processed_chunks.append(filtered_chunk)
            total_processed += len(filtered_chunk)
            
        if i % 10 == 0:
            print(f"Processed chunk {i}, cumulative rows: {total_processed}")

    # Combine and Save
    if processed_chunks:
        final_df = pd.concat(processed_chunks, ignore_index=True)
        print(f"Saving final dataset with {len(final_df)} rows...")
        final_df.to_csv(PROCESSED_DATA_PATH, index=False)
        print(f"Saved to {PROCESSED_DATA_PATH}")
        
        # Verify
        print("Final Verification:")
        print(final_df.info())
        print(final_df.head())
    else:
        print("No data found matching criteria!")

if __name__ == "__main__":
    products = perform_eda()
    filter_and_process()
