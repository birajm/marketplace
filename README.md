# Marketplace Application

A full-stack e-commerce marketplace application built with Django and React.

## Project Structure

- `marketplace_project/` - Django backend
- `marketplace-frontend/` - React frontend

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd marketplace_project
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd marketplace-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Deployment to Render

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn backend.wsgi:application --log-file -`
   - Environment Variables:
     - `PYTHON_VERSION`: 3.11.0
     - `SECRET_KEY`: (Generate a secure key)
     - `DEBUG`: False
     - `ALLOWED_HOSTS`: .onrender.com
     - `CORS_ALLOWED_ORIGINS`: https://marketplace-frontend.onrender.com
     - `DATABASE_URL`: (Add your PostgreSQL database URL)

### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Environment Variables:
     - `NODE_VERSION`: 18.17.0
     - `REACT_APP_API_URL`: https://marketplace-backend.onrender.com/api

## Environment Variables

### Backend (.env)

```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000/api
```

## License

MIT 