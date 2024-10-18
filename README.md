# StrongMind-Pizza-Exercise

This is a Flask-based web application for managing pizzas and their toppings.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/masoncooper19/StrongMind-Pizza-Exercise.git
   cd StrongMind-Pizza-Exercise
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

5. Run the application:
   ```
   flask run
   ```

The application should now be running at `http://localhost:5000`.

## Features

- View, add, update, and delete toppings
- View, add, update, and delete pizzas
- Associate toppings with pizzas

## API Endpoints

- `/toppings`
  - GET: Retrieve all toppings
  - POST: Add a new topping
- `/toppings/<id>`
  - PUT: Update a topping
  - DELETE: Delete a topping
- `/pizzas`
  - GET: Retrieve all pizzas
  - POST: Add a new pizza
- `/pizzas/<id>`
  - PUT: Update a pizza
  - DELETE: Delete a pizza

## Deployment

This application is configured for deployment to Google Cloud Run. To deploy:

1. Install the Google Cloud SDK by following the instructions at https://cloud.google.com/sdk/docs/install

2. Initialize the Google Cloud SDK:
   ```
   gcloud init
   ```

3. Enable the necessary APIs:
   ```
   gcloud services enable run.googleapis.com
   ```

4. Build and deploy the application:
   ```
   gcloud run deploy --source . --platform managed
   ```

5. Follow the prompts to select your project, region, and service name.

6. Once deployed, Google Cloud Run will provide a URL where your application is accessible.

## Testing

To run the tests:

```
python -m unittest discover tests
```

## Troubleshooting

If you encounter any issues with package versions, try updating your packages:

```
pip install --upgrade -r requirements.txt
```

Then, recreate the database:

```
flask db stamp head
flask db migrate
flask db upgrade
```