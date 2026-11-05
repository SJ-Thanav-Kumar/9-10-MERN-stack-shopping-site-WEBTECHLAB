# 9/10 Shopping Store

A shopping website built with the MERN stack (MongoDB, Express, React, Node.js). Made for Web Technologies Lab, Exercise 8.

Made by: SJ Thanav Kumar • Sreyas Shyam • Pranav Shreyas TC • SK Tharun Rakesh

## Features

- **Browse products** by category (Electronics, Clothing, Utilities) and search across them
- **Product pages** with details and customer reviews.
- **Cart** that saves between visits, with a checkout that asks you to log in first
- **Accounts**: register, log in and log out, and edit or delete your own profile
- **Catalogue** page with products stored in MongoDB (visible after logging in)
- **Wishlist** saved to your account
- **Reviews** in the style of Steam: recommend or not recommend a product, with optional text. One review per user per product, and you can edit or delete it.

## Tech used

- **Frontend:** React 19, Vite, React Router
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB Atlas
- **Login:** JWT tokens and bcrypt-hashed passwords

## Running it locally:

1. Backend: go to `code/backend`, create a `.env` file with `PORT`, `MONGO_URI`, `JWT_SECRET` and `CLIENT_ORIGIN`, then run:
`npm install
npm run seed
npm run dev`


2. Frontend: go to `code/frontend` and run:
`npm install
npm run dev`


3. Open `http://localhost:5173`

The backend runs on port 3000.
