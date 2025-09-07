from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL,
    status TEXT,
    eta TEXT
)
""")
conn.commit()

cursor.execute("SELECT COUNT(*) FROM deliveries")
if cursor.fetchone()[0] == 0:
    sample_data = [
        ("John Doe", "123 Main St", 37.7749, -122.4194, "In-Transit", "15 min"),
        ("Alice Smith", "456 Park Ave", 37.7849, -122.4094, "Preparing", "30 min"),
        ("Bob Johnson", "789 Elm St", 37.7649, -122.4294, "Delivered", "0 min"),
    ]
    cursor.executemany(
        "INSERT INTO deliveries (customer_name, address, latitude, longitude, status, eta) VALUES (?, ?, ?, ?, ?, ?)",
        sample_data
    )
    conn.commit()

class Delivery(BaseModel):
    id: int
    customer_name: str
    address: str
    latitude: float
    longitude: float
    status: str
    eta: str

@app.get("/deliveries", response_model=List[Delivery])
def get_deliveries(status: str = None):
    if status and status != "All":
        cursor.execute("SELECT * FROM deliveries WHERE status=?", (status,))
    else:
        cursor.execute("SELECT * FROM deliveries")
    rows = cursor.fetchall()
    deliveries = [Delivery(id=row[0], customer_name=row[1], address=row[2],
                           latitude=row[3], longitude=row[4], status=row[5], eta=row[6]) for row in rows]
    return deliveries

@app.get("/deliveries/{delivery_id}", response_model=Delivery)
def get_delivery(delivery_id: int):
    cursor.execute("SELECT * FROM deliveries WHERE id=?", (delivery_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return Delivery(id=row[0], customer_name=row[1], address=row[2],
                    latitude=row[3], longitude=row[4], status=row[5], eta=row[6])