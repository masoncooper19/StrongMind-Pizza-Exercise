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
   gcloud services enable run.googleapis.com sqladmin.googleapis.com
   ```

4. Create a Cloud SQL instance:
   ```
   gcloud sql instances create pizzas-db --tier=db-f1-micro --region=us-west2
   ```

5. Create a database:
   ```
   gcloud sql databases create pizzas --instance=pizzas-db
   ```

6. Get the connection name:
   ```
   gcloud sql instances describe pizzas-db --format='value(connectionName)'
   ```

7. Create a user:
   ```
   gcloud sql users create pizzas-user --instance=pizzas-db --password=YOUR_PASSWORD
   ```

8. Build and deploy the application:
   ```
   gcloud run deploy strongmind-pizza-exercise --source . --platform managed --region us-west2 --allow-unauthenticated --set-env-vars DATABASE_URL=postgresql://pizzas-user:YOUR_PASSWORD@/pizzas?host=/cloudsql/YOUR_CONNECTION_NAME --add-cloudsql-instances YOUR_CONNECTION_NAME
   ```

9. The deployment command will provide a Service URL. You can access your application at this URL.

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

If you're having issues with the deployed application, you can check the logs:

```
gcloud run logs read --service strongmind-pizza-exercise
```