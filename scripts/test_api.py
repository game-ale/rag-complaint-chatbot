import requests
import json
import time

URL = "http://localhost:8000/ask"

payload = {
    "question": "What are fees mentioned for credit cards?",
    "filters": {
        "product": "Credit card"
    }
}

print(f"Sending POST request to {URL}...")
print(f"Payload: {payload}")

try:
    start = time.time()
    response = requests.post(URL, json=payload)
    latency = time.time() - start
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Response Received:")
        print(json.dumps(data, indent=2))
        
        # Validation
        assert "answer" in data
        assert "sources" in data
        print(f"\n⏱️ Latency: {latency:.2f}s")
    else:
        print(f"❌ Error: {response.text}")

except Exception as e:
    print(f"❌ Failed to connect: {e}")
