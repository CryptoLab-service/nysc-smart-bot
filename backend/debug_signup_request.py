import requests
import json

url = "http://localhost:8000/auth/signup"
headers = {"Content-Type": "application/json"}
data = {
    "email": "debug_test_user@example.com",
    "password": "password123",
    "name": "Debug User",
    "role": "Corps Member",
    "state": "Lagos",
    "gender": "Female",
    "phone": "08012345678",
    "state_code": "LA/24A/1234",
    "mobilization_date": "2024-01-01",
    "pop_date": "2025-01-01"
}

try:
    print(f"Sending request to {url} with data: {json.dumps(data, indent=2)}")
    response = requests.post(url, json=data, headers=headers, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
