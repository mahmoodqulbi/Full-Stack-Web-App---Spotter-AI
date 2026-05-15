# Spotter AI - Truck Trip Planner & ELD Generator

A production-ready full-stack application for truck route planning and HOS (Hours of Service) compliance simulation.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Leaflet.js, Axios.
- **Backend**: Django, Django REST Framework, Geopy.

## Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## API Documentation

### POST `/api/trips/generate/`
Generates a trip plan and ELD logs.

**Request Body:**
```json
{
  "current_location": "New York, NY",
  "pickup_location": "Chicago, IL",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_used": 0
}
```

**Response:**
Returns route geometry, summary statistics, and day-by-day HOS logs.

## Deployment

- **Frontend**: Can be deployed to Vercel/Netlify. Ensure `VITE_API_URL` is set in environment variables.
- **Backend**: Can be deployed to Render/Railway. Set `SECRET_KEY`, `DEBUG=False`, and `ALLOWED_HOSTS`.

---

