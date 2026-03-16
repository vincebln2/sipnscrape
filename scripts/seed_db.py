import requests
import random

API_URL = "http://localhost:8000/beans/"

# Expanded flavor list to satisfy your request for variety
FLAVORS = {
    "Fruit": ["Peach", "Dried Mango", "Green Apple", "Blackberry", "Lychee", "Papaya"],
    "Sweet": ["Brown Sugar", "Toffee", "Honey", "Maple Syrup", "Nougat", "Caramel"],
    "Nutty": ["Almond", "Hazelnut", "Pistachio", "Pecan", "Cashew"],
    "Floral": ["Jasmine", "Rose", "Hibiscus", "Lavender", "Bergamot"],
    "Earth": ["Dark Chocolate", "Cedar", "Tobacco", "Cinnamon", "Clove"],
}

COUNTRIES = ["Ethiopia", "Colombia", "Costa Rica", "Kenya", "Vietnam", "Brazil"]
ROASTS = ["Light", "Medium", "Dark", "Espresso"]
PROCESSES = ["Washed", "Natural", "Honey", "Anaerobic"]


def get_random_notes():
    # Schema expects a List[str], so we return a list of 3 unique notes
    categories = random.sample(list(FLAVORS.keys()), 3)
    return [random.choice(FLAVORS[cat]) for cat in categories]


def seed_beans(count=120):
    for i in range(count):
        country = random.choice(COUNTRIES)

        # This dictionary matches your BeanCreate schema exactly
        bean_data = {
            "name": f"TEST_{i:03}_{country.upper()}",
            "roaster": "SipNScrape Lab",
            "roast_type": random.choice(ROASTS),
            "taste_notes": get_random_notes(),
            "elevation": random.randint(1200, 2400),  # Schema expects Optional[int]
            "country": country,
            "process": random.choice(PROCESSES),
            "hyperlink": f"https://example.com/beans/{i}",  # Schema expects 'hyperlink'
        }

        try:
            response = requests.post(API_URL, json=bean_data)
            if response.status_code == 200:
                if i % 10 == 0:
                    print(f"Success: {i}/{count} beans added.")
            else:
                # This will tell you EXACTLY what field is still failing
                print(f"Failed {bean_data['name']}: {response.json()}")
        except Exception as e:
            print(f"Connection error: {e}")


if __name__ == "__main__":
    seed_beans(120)
