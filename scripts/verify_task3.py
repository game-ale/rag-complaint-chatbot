import sys
import os
import json
sys.path.append(os.path.abspath('src'))
from rag_pipeline import RAGPipeline

print("Initializing RAG Pipeline for Verification...")
rag = RAGPipeline()

print("\n--- 1. API / React Readiness (Schema Check) ---")
try:
    response = rag.answer_question("What are the fees for late payment?")
    # print(json.dumps(response, indent=2))

    assert "answer" in response, "Missing 'answer' field"
    assert "sources" in response, "Missing 'sources' field"
    if response['sources']:
        source = response['sources'][0]
        assert "text" in source, "Missing 'text' in source"
        assert "product" in source, "Missing 'product' in source"
        assert "company" in source, "Missing 'company' in source"
        assert "complaint_id" in source, "Missing 'complaint_id' in source"
        print("✅ PASS: Schema Validation Passed")
    else:
        print("⚠️ No sources returned (Schema check skipped for logic, but structure is valid)")
except Exception as e:
    print(f"❌ FAIL: Schema check failed: {e}")

print("\n--- 2. Hallucination & Prompt Guardrails ---")
out_of_scope_q = "Who won the 1994 World Cup?"
print(f"Query: {out_of_scope_q}")
response_oos = rag.answer_question(out_of_scope_q)
print(f"Answer: {response_oos['answer']}")

normalized_answer = response_oos['answer'].lower()
if "don't have enough information" in normalized_answer or "not enough information" in normalized_answer or "no information" in normalized_answer or "i don't have" in normalized_answer:
    print("✅ PASS: Guardrail Passed (Refused to Hallucinate)")
else:
    print(f"❌ FAIL: Guardrail Failed. Answered: {response_oos['answer']}")

print("\n--- 3. Edge Case Handling (Empty String) ---")
try:
    rag.answer_question("")
    print("✅ PASS: Handled empty string safely")
except Exception as e:
    print(f"❌ FAIL: Crashed on empty string: {e}")
