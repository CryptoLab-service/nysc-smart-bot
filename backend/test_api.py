from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "NYSC AI is Live (Fine-Tuned)!"}

def test_auth_flow():
    # 1. Signup
    email = "test@example.com"
    signup_data = {
        "email": email,
        "password": "password123",
        "name": "Test User",
        "role": "Corps Member",
        "state": "Lagos",
        "state_code": "LA/24A/1234",
        "callup_number": "NYSC/REL/2024/001"
    }
    # Clean up DB potentially needed, but for now we rely on unique email check handling
    # If user exists, we try login
    
    # Try Signup
    response = client.post("/auth/signup", json=signup_data)
    if response.status_code == 400 and "already registered" in response.text:
        print("User already exists, proceeding to login...")
    else:
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["email"] == email

    # 2. Login
    login_data = {"email": email, "password": "password123"}
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    token = data["token"]
    assert token is not None

    # 3. Protected Route (/auth/me)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == email

    # 4. Protected Route (/api/timeline)
    response = client.get("/api/timeline", headers=headers)
    assert response.status_code == 200
    assert "days_to_camp" in response.json()

def test_public_routes():
    # News
    response = client.get("/api/news")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # Resources
    response = client.get("/api/resources")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

if __name__ == "__main__":
    try:
        test_read_main()
        test_auth_flow()
        test_public_routes()
        print("[OK] ALL TESTS PASSED")
    except Exception as e:
        print(f"[FAIL] TEST FAILED: {e}")
        exit(1)
