import requests
import json
import random
import time

# ETH
url1 = "http://localhost:8000/api/price_comparison/2"

# BTC
url2 = "http://localhost:8000/api/price_comparison/1"


headers = {
    "Content-Type": "application/json"
}

# ETH
lower1 = 0.0003
upper1 = 0.0006

# BTC
lower2 = 0.00001290
upper2 = 0.00001270

times = 20

prices1 = [random.uniform(lower1, upper1) for _ in range(times)]
prices2 = [random.uniform(lower2, upper2) for _ in range(times)]

data = []

for i in range(0, times):
    data.append({
        "url": url1,
        "data": {
            "price": prices1[i]
        }
    })
    data.append({
        "url": url2,
        "data": {
            "price": prices2[i]
        }
    })


for d in data:
    response = requests.put(d["url"], data=json.dumps(d["data"]), headers=headers)

    if response.status_code == 200:
        print("Response:", response.json())
    else:
        print(f"Failed to send the request. Status code: {response.status_code}")
        print("Response:", response.text)