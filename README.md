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

This application is configured for deployment to AWS Elastic Beanstalk. To deploy:

1. Install the EB CLI:
   ```
   pip install awsebcli
   ```

2. Initialize your EB application:
   ```
   eb init -p python-3.8 StrongMind-Pizza-Exercise --region us-west-2
   ```

3. Create an environment and deploy:
   ```
   eb create StrongMind-Pizza-Exercise-env
   ```

4. Open the deployed application:
   ```
   eb open
   ```

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