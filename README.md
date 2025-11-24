Inventory Management System

A full-stack Product Inventory Management System built using React (Frontend), Node.js + Express (Backend), and SQLite (Database).

This project includes search, filtering, inline editing, CSV import/export, and real-time inventory history tracking.


---

🚀 Features

🖥 Frontend (React)

Product search with real-time results

Category filter dropdown

Clean products table with:

Image, Name, Unit, Category, Brand, Stock, Status, Actions

Status badges → In Stock (Green) / Out of Stock (Red)


Inline editing (Save / Cancel)

CSV import & export (buttons on right header side)

Slide-in Inventory History panel per product

Fully responsive UI

Toast notifications for all actions



---

🗄 Backend (Node.js + Express + SQLite)

CSV Import

Ignores duplicates (checked by name, case-insensitive)

Returns { added, skipped, duplicates }


CSV Export

Downloads full product list as CSV


Products APIs

GET all products

Search products (partial, case-insensitive)

Update product with validation


Inventory History Tracking

Logs stock changes automatically

History endpoint included


Ready for deployment on Render/Railway



---

🛠 Tech Stack

Layer	Technologies

Frontend	React, Axios, React Router
Backend	Node.js, Express.js, Multer, CSV Parser, Express Validator
Database	SQLite 3
Deployment	Frontend → Vercel/Netlify <br> Backend → Render/Railway



---

📁 Folder Structure

inventory-management-app/
│
├── backend/
│   ├── server.js
│   ├── database/
│   │   └── inventory.db
│   ├── routes/
│   ├── controllers/
│   ├── uploads/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.js
│   ├── public/
│   └── package.json
│
└── README.md


---

⚙ Backend Setup

1. Navigate to backend folder

cd backend

2. Install dependencies

npm install

3. Start server

npm start

4. Default API Base URL

http://localhost:5000


---

⚙ Frontend Setup

1. Navigate to frontend

cd frontend

2. Install dependencies

npm install

3. Start development server

npm start

4. Default Frontend URL

http://localhost:3000


---

🔌 API Endpoints

Products

➤ Get All Products

GET /api/products

➤ Search by Name

GET /api/products/search?name=<query>

➤ Update Product

PUT /api/products/:id

Request Body:

{
  "name": "Product",
  "unit": "kg",
  "category": "Food",
  "brand": "BrandX",
  "stock": 20,
  "status": "In Stock"
}


---

CSV Import / Export

➤ Import CSV

POST /api/products/import
Form-data key → csvFile

➤ Export CSV

GET /api/products/export


---

Inventory History

➤ Get Product Inventory Logs

GET /api/products/:id/history


---

📊 Database Schema

Products Table

Field	Type	Notes

id	INTEGER PK	Auto Increment
name	TEXT	Unique
unit	TEXT	
category	TEXT	
brand	TEXT	
stock	INTEGER	Required
status	TEXT	In Stock / Out of Stock
image	TEXT	URL


Inventory History Table

Field	Type

id	INTEGER PK
product_id	INTEGER FK
old_quantity	INTEGER
new_quantity	INTEGER
change_date	ISO Timestamp
user_info	TEXT



---

🌐 Deployment

Backend Deployment (Render/Railway)

1. Create new Web Service


2. Select backend folder


3. Set build & start commands:

npm install
npm start


4. Ensure SQLite file is in persistent storage (or recreate on start)




---

Frontend Deployment (Vercel/Netlify)

Build Command

npm run build

Publish Directory

build/

Important:
Update all Axios base URLs to your deployed backend path.


---

🧪 Testing (Optional)

Backend tests using Jest + Supertest

Frontend tests using React Testing Library



---

📸 Screenshots (Add before submitting)

> (Replace these with actual screenshots)



Dashboard

Product Table

Inline Editing

Import CSV

Export CSV

Inventory History Panel



---

📬 Submission

Please share the following:

🔗 GitHub Repository Link

<repo-url>

🌍 Live Frontend URL

<vercel/netlify-url>

🌍 Live Backend URL

<render/railway-url>


---

🎉 Thank You

This project demonstrates full-stack development, database usage, clean API design, and production-ready deployment for an inventory management system.