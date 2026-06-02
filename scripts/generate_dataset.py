import csv
import random
from datetime import datetime, timedelta

# Configuration
NUM_ROWS = 600
OUTPUT_FILE = 'public/subdistrict-sample-sales.csv'

# Reference Data
SUBDISTRICTS = [
    "Dhanmondi (Dhaka)", "Gulshan (Dhaka)", "Mirpur (Dhaka)", "Savar (Dhaka)", "Tongi (Gazipur)",
    "Gazipur Sadar", "Narayanganj Sadar", "Fatullah (Narayanganj)", "Hathazari (Chattogram)",
    "Patiya (Chattogram)", "Double Mooring (Chattogram)", "Halishahar (Chattogram)",
    "Kotwali (Sylhet)", "Dakshin Surma (Sylhet)", "Boalia (Rajshahi)", "Motihar (Rajshahi)",
    "Khulna Sadar", "Khalishpur (Khulna)", "Barishal Sadar", "Bogura Sadar",
    "Cumilla Sadar", "Feni Sadar", "Sadar (Cox's Bazar)", "Teknaf (Cox's Bazar)",
    "Sadar (Mymensingh)", "Sadar (Rangpur)"
]

CATEGORIES = ["Apparel", "Electronics", "Groceries", "Furniture", "Cosmetics", "Stationery"]

PRODUCTS = {
    "Apparel": [
        {"id": "SKU-A01", "name": "Cotton Panjabi", "unit_price": 1500, "cost_price": 900},
        {"id": "SKU-A02", "name": "Premium Jamdani Saree", "unit_price": 12000, "cost_price": 8000},
        {"id": "SKU-A03", "name": "Denim Jeans", "unit_price": 1800, "cost_price": 1000},
        {"id": "SKU-A04", "name": "Basic T-Shirt", "unit_price": 400, "cost_price": 200},
    ],
    "Electronics": [
        {"id": "SKU-E01", "name": "Smart Lamp", "unit_price": 1200, "cost_price": 800},
        {"id": "SKU-E02", "name": "Wireless Earbuds", "unit_price": 2500, "cost_price": 1500},
        {"id": "SKU-E03", "name": "Mechanical Keyboard", "unit_price": 3500, "cost_price": 2200},
        {"id": "SKU-E04", "name": "Power Bank 10000mAh", "unit_price": 1800, "cost_price": 1100},
    ],
    "Groceries": [
        {"id": "SKU-G01", "name": "Organic Rice (5kg)", "unit_price": 450, "cost_price": 320},
        {"id": "SKU-G02", "name": "Mustard Oil (1L)", "unit_price": 280, "cost_price": 200},
        {"id": "SKU-G03", "name": "Lentils (1kg)", "unit_price": 140, "cost_price": 100},
    ],
    "Furniture": [
        {"id": "SKU-F01", "name": "Ergonomic Desk Chair", "unit_price": 5500, "cost_price": 3500},
        {"id": "SKU-F02", "name": "Office Desk", "unit_price": 8500, "cost_price": 5000},
        {"id": "SKU-F03", "name": "Bookshelf", "unit_price": 4200, "cost_price": 2500},
    ],
    "Cosmetics": [
        {"id": "SKU-C01", "name": "Skincare Gift Set", "unit_price": 2200, "cost_price": 1200},
        {"id": "SKU-C02", "name": "Herbal Shampoo", "unit_price": 450, "cost_price": 250},
    ],
    "Stationery": [
        {"id": "SKU-S01", "name": "Notebook Bundle (5 pcs)", "unit_price": 600, "cost_price": 350},
        {"id": "SKU-S02", "name": "Gel Pen Set", "unit_price": 250, "cost_price": 120},
    ]
}

SALES_CHANNELS = ["Online", "Retail", "Wholesale"]
CUSTOMER_SEGMENTS = ["B2C", "B2B"]

# Helper to generate realistic data
def generate_row(date):
    category = random.choices(CATEGORIES, weights=[25, 20, 30, 10, 10, 5])[0]
    product = random.choice(PRODUCTS[category])
    
    # Introduce some logical constraints
    # Groceries are mostly Retail/Wholesale, Electronics are mostly Online
    if category == "Groceries":
        channel = random.choices(["Retail", "Wholesale", "Online"], weights=[60, 35, 5])[0]
    elif category == "Electronics":
        channel = random.choices(["Online", "Retail", "Wholesale"], weights=[70, 25, 5])[0]
    elif category == "Furniture":
        channel = random.choices(["Retail", "Online", "Wholesale"], weights=[50, 20, 30])[0]
    else:
        channel = random.choice(SALES_CHANNELS)
        
    # Segment logic
    if channel == "Wholesale":
        segment = "B2B"
    else:
        segment = "B2C" if random.random() > 0.1 else "B2B" # Mostly B2C for retail/online
        
    location = random.choice(SUBDISTRICTS)
    
    # Generate realistic quantities based on category and channel
    if channel == "Wholesale":
        units = random.randint(50, 500)
    elif category == "Groceries":
        units = random.randint(5, 100)
    elif category == "Furniture":
        units = random.randint(1, 10)
    else:
        units = random.randint(1, 30)
        
    # Revenue is usually exact, but let's add occasional discounts
    discount_multiplier = random.choices([1.0, 0.95, 0.90], weights=[80, 15, 5])[0]
    revenue = round(units * product["unit_price"] * discount_multiplier)
    
    # Stock level
    stock = random.randint(10, 1000)
    if channel == "Wholesale" and stock < units:
        stock += units * 2 # Ensure enough stock or simulate recent restock
        
    return {
        "Date": date.strftime("%Y-%m-%d"),
        "Product_ID": product["id"],
        "Product_Name": product["name"],
        "Category": category,
        "Location": location,
        "Sales_Channel": channel,
        "Units_Sold": units,
        "Revenue_BDT": revenue,
        "Unit_Price": product["unit_price"],
        "Cost_Price": product["cost_price"],
        "Current_Stock": stock,
        "Customer_Segment": segment
    }

def generate_dataset():
    start_date = datetime(2023, 12, 1)
    end_date = datetime(2024, 5, 31)
    delta_days = (end_date - start_date).days
    
    data = []
    # Generate rows distributed over time
    for _ in range(NUM_ROWS):
        random_days = random.randint(0, delta_days)
        row_date = start_date + timedelta(days=random_days)
        data.append(generate_row(row_date))
        
    # Sort by date
    data.sort(key=lambda x: x["Date"])
    
    # Write to CSV
    fieldnames = [
        "Date", "Product_ID", "Product_Name", "Category", "Location", 
        "Sales_Channel", "Units_Sold", "Revenue_BDT", "Unit_Price", 
        "Cost_Price", "Current_Stock", "Customer_Segment"
    ]
    
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)
            
    print(f"Successfully generated {NUM_ROWS} rows in {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_dataset()
