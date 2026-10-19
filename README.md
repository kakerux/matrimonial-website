Shaadi.com — Matrimonial Matching Platform

A full-stack matrimonial web application where users create a profile, discover compatible matches, send "hearts" (interest requests), and chat in real time once both sides accept. Includes a separate admin panel for managing users and verifying profiles.

Built as a learning project to practice Node.js, Express, MongoDB, JWT authentication, and real-time communication with Socket.IO, with a React frontend.

Features
For users
Sign up / Login with hashed passwords (bcrypt) and JWT-based sessions
Gender and religion captured once at sign up, then used to personalise the experience
Profile creation and editing with photo upload, an in-browser crop/zoom tool, and birth year auto-filled from age
Smart homepage feed — featured profiles default to the opposite gender and the user's own religion
Search and filtering by age range, religion, location, plus a "Browse Profiles By" menu (religion, caste, city, occupation, state)
Hearts system — send a heart, receive requests in an inbox, accept or decline; a mutual heart creates a match
Live notification badge in the navbar when a new heart arrives
Real-time chat between matched users using Socket.IO
Verified badge shown on profiles approved by an admin
For admins
Dashboard with live stats (total users, active profiles, pending verifications) and a user-growth chart
User management — view every user's photo, name, and email, open their profile, or delete the account
Profile verification queue
Site settings (site name, support contact details, about text)
Admin accounts are excluded from user lists and cannot send hearts or be deleted from the panel
UI / UX
Responsive layout built with Tailwind CSS
Framer Motion animations (rotating hero headline, scroll reveals, animated counters, page transitions)
Toast notifications instead of browser alerts
Protected routes that redirect visitors without a token to Sign Up
Tech Stack

Frontend

React (Vite), React Router
Tailwind CSS
Axios, Socket.IO Client
Framer Motion, Recharts, react-hot-toast, react-easy-crop, lucide-react

Backend

Node.js, Express
MongoDB with Mongoose
JSON Web Tokens (jsonwebtoken), bcrypt
Multer (file uploads)
Socket.IO