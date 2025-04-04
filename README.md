# Marketplace Application

A full-stack marketplace application built with Django and React.

## Project Structure

```
marketplace/
├── marketplace_project/     # Django backend
├── marketplace-frontend/    # React frontend
├── .env                    # Environment variables
├── docker-compose.yml      # Docker development setup
└── render.yaml            # Render deployment configuration
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional)
- Git

## Local Development Setup

### Backend Setup

1. Create and activate virtual environment:
```bash
cd marketplace_project
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd marketplace-frontend
npm install
```

2. Start the development server:
```bash
npm start
```

### Using Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## Deployment

The application is configured for deployment on Render using the `render.yaml` configuration.

### Manual Deployment Steps

1. Push your code to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. On Render:
- Create a new Web Service
- Connect your GitHub repository
- Use the following settings:
  - Build Command: `cd marketplace_project && pip install -r requirements.txt`
  - Start Command: `cd marketplace_project && gunicorn backend.wsgi:application --log-file -`
  - Environment Variables: Configure as specified in render.yaml

3. Deploy the frontend:
- Create a new Static Site
- Connect your GitHub repository
- Use the following settings:
  - Build Command: `cd marketplace-frontend && npm install && npm run build`
  - Publish Directory: `marketplace-frontend/build`

## Environment Variables

### Backend (.env)
- DEBUG
- SECRET_KEY
- ALLOWED_HOSTS
- CORS_ALLOWED_ORIGINS
- DATABASE_URL

### Frontend (.env)
- REACT_APP_API_URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 