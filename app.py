import os
import logging
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app and configure it
app = Flask(__name__, static_url_path='/static')
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Define Topping model
class Topping(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

# Define relationship between Pizza and Topping
pizza_toppings = db.Table('pizza_toppings',
    db.Column('pizza_id', db.Integer, db.ForeignKey('pizza.id'), primary_key=True),
    db.Column('topping_id', db.Integer, db.ForeignKey('topping.id'), primary_key=True)
)

# Define Pizza model
class Pizza(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    toppings = db.relationship('Topping', secondary=pizza_toppings, lazy='subquery',
                               backref=db.backref('pizzas', lazy=True))

with app.app_context():
    try:
        db.create_all()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for managing toppings (GET all, POST new)
@app.route('/toppings', methods=['GET', 'POST'])
def manage_toppings():
    if request.method == 'POST':
        # Add new topping
        name = request.json['name']
        if Topping.query.filter_by(name=name).first():
            return jsonify({'error': 'Topping already exists'}), 400
        new_topping = Topping(name=name)
        db.session.add(new_topping)
        db.session.commit()
        return jsonify({'message': 'Topping added successfully', 'id': new_topping.id}), 201
    # Get all toppings
    toppings = Topping.query.all()
    return jsonify([{'id': t.id, 'name': t.name} for t in toppings])

# Route for updating or deleting a specific topping
@app.route('/toppings/<int:topping_id>', methods=['PUT', 'DELETE'])
def update_delete_topping(topping_id):
    topping = Topping.query.get_or_404(topping_id)
    if request.method == 'PUT':
        # Update topping
        name = request.json['name']
        if Topping.query.filter_by(name=name).first() and name != topping.name:
            return jsonify({'error': 'Topping already exists'}), 400
        topping.name = name
        db.session.commit()
        return jsonify({'message': 'Topping updated successfully'})
    # Delete topping
    db.session.delete(topping)
    db.session.commit()
    return jsonify({'message': 'Topping deleted successfully'})

# Route for managing pizzas (GET all, POST new)
@app.route('/pizzas', methods=['GET', 'POST'])
def manage_pizzas():
    if request.method == 'POST':
        # Add new pizza
        name = request.json['name']
        topping_ids = request.json['toppings']
        if Pizza.query.filter_by(name=name).first():
            return jsonify({'error': 'Pizza already exists'}), 400
        new_pizza = Pizza(name=name)
        toppings = Topping.query.filter(Topping.id.in_(topping_ids)).all()
        new_pizza.toppings = toppings
        db.session.add(new_pizza)
        db.session.commit()
        return jsonify({'message': 'Pizza added successfully', 'id': new_pizza.id}), 201
    # Get all pizzas    
    pizzas = Pizza.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'toppings': [{'id': t.id, 'name': t.name} for t in p.toppings]} for p in pizzas])

# Route for updating or deleting a specific pizza
@app.route('/pizzas/<int:pizza_id>', methods=['PUT', 'DELETE'])
def update_delete_pizza(pizza_id):
    pizza = Pizza.query.get_or_404(pizza_id)
    if request.method == 'PUT':
        # Update pizza
        name = request.json['name']
        topping_ids = request.json['toppings']
        if Pizza.query.filter_by(name=name).first() and name != pizza.name:
            return jsonify({'error': 'Pizza already exists'}), 400
        pizza.name = name
        toppings = Topping.query.filter(Topping.id.in_(topping_ids)).all()
        pizza.toppings = toppings
        db.session.commit()
        return jsonify({'message': 'Pizza updated successfully'})
    # Delete pizza
    db.session.delete(pizza)
    db.session.commit()
    return jsonify({'message': 'Pizza deleted successfully'})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)