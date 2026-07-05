from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100))
    price = db.Column(db.Float)
    location = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    images = db.Column(db.Text)  # JSON string of image URLs
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Car specific fields
    make = db.Column(db.String(50))
    model = db.Column(db.String(50))
    year = db.Column(db.Integer)
    transmission = db.Column(db.String(20))
    body_type = db.Column(db.String(30))
    kilometers = db.Column(db.Integer)
    colour = db.Column(db.String(30))
    fuel_type = db.Column(db.String(20))
    drive_type = db.Column(db.String(20))
    for_sale_by = db.Column(db.String(20))
    
    # Seller info
    seller_name = db.Column(db.String(100))
    seller_email = db.Column(db.String(120))
    seller_phone = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'subcategory': self.subcategory,
            'price': self.price,
            'location': self.location,
            'phone_number': self.phone_number,
            'images': self.images,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'transmission': self.transmission,
            'body_type': self.body_type,
            'kilometers': self.kilometers,
            'colour': self.colour,
            'fuel_type': self.fuel_type,
            'drive_type': self.drive_type,
            'for_sale_by': self.for_sale_by,
            'seller_name': self.seller_name,
            'seller_email': self.seller_email,
            'seller_phone': self.seller_phone
        }

class SellerApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(20))
    business_name = db.Column(db.String(100))
    category = db.Column(db.String(100))
    location = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'mobile': self.mobile,
            'business_name': self.business_name,
            'category': self.category,
            'location': self.location,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

