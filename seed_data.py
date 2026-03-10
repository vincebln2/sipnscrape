import requests
import json

API_URL = "http://localhost:8000/beans/"

coffee_data = [
    {
        "name": "Ardi Sidama", "roaster": "Onyx", "roast_type": "light",
        "taste_notes": ["Blueberry", "Cream", "Lemon"], "elevation": 2000,
        "country": "Ethiopia", "process": "Natural"
    },
    {
        "name": "Southern Weather", "roaster": "Onyx", "roast_type": "medium-light",
        "taste_notes": ["Milk Chocolate", "Walnut", "Plum"], "elevation": 1600,
        "country": "Colombia/Ethiopia", "process": "Washed"
    },
    {
        "name": "French Roast", "roaster": "Generic", "roast_type": "dark",
        "taste_notes": ["Smoke", "Cocoa", "Charcoal"], "elevation": 1200,
        "country": "Brazil", "process": "Washed"
    },
    {
        "name": "Blueberry Hill", "roaster": "Vince Roastery", "roast_type": "light",
        "taste_notes": ["Blueberry", "Honey", "Lavender"], "elevation": 1950,
        "country": "Ethiopia", "process": "Natural"
    }
]

def seed():
    print("--- Starting Seed Process ---")
    for bean in coffee_data:
        try:
            response = requests.post(API_URL, json=bean)
            if response.status_code == 200:
                print(f"Success: Added {bean['name']} (ID: {response.json().get('id')})")
            else:
                print(f"Failed: {bean['name']} - Status: {response.status_code} - {response.text}")
        except requests.exceptions.ConnectionError:
            print("Connection Error: Is your Docker container running on port 8000?")
            break

if __name__ == "__main__":
    seed()