from flask import Blueprint, request, jsonify
from src.models.user import db, Listing, SellerApplication
import json

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('/submit-listing', methods=['POST'])
def submit_listing():
    data = request.get_json()
    
    # Create new listing
    listing = Listing(
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        subcategory=data.get('subcategory'),
        price=data.get('price'),
        location=data.get('location'),
        phone_number=data.get('phone_number'),
        images=json.dumps(data.get('images', [])),
        
        # Car specific fields
        make=data.get('make'),
        model=data.get('model'),
        year=data.get('year'),
        transmission=data.get('transmission'),
        body_type=data.get('body_type'),
        kilometers=data.get('kilometers'),
        colour=data.get('colour'),
        fuel_type=data.get('fuel_type'),
        drive_type=data.get('drive_type'),
        for_sale_by=data.get('for_sale_by'),
        
        # Seller info
        seller_name=data.get('seller_name'),
        seller_email=data.get('seller_email'),
        seller_phone=data.get('seller_phone')
    )
    
    db.session.add(listing)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Listing submitted successfully. It will be reviewed by our admin team.',
        'listing_id': listing.id
    })

@listings_bp.route('/submit-seller-application', methods=['POST'])
def submit_seller_application():
    data = request.get_json()
    
    # Create new seller application
    seller_app = SellerApplication(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        mobile=data.get('mobile'),
        business_name=data.get('business_name'),
        category=data.get('category'),
        location=data.get('location'),
        description=data.get('description')
    )
    
    db.session.add(seller_app)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Seller application submitted successfully. We will review your application and get back to you.',
        'application_id': seller_app.id
    })

@listings_bp.route('/approved-listings', methods=['GET'])
def get_approved_listings():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Listing.query.filter_by(status='approved')
    
    if category:
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(
            Listing.title.contains(search) | 
            Listing.description.contains(search)
        )
    
    listings = query.order_by(Listing.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'success': True,
        'listings': [listing.to_dict() for listing in listings.items],
        'pagination': {
            'page': page,
            'pages': listings.pages,
            'per_page': per_page,
            'total': listings.total
        }
    })

@listings_bp.route('/listing/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = Listing.query.filter_by(id=listing_id, status='approved').first_or_404()
    return jsonify({
        'success': True,
        'listing': listing.to_dict()
    })

@listings_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = [
        {
            'name': 'Automotive Vehicles',
            'subcategories': ['Cars & Bakkies', 'Motorcycles', 'Trucks', 'Boats', 'Parts & Accessories']
        },
        {
            'name': 'Property',
            'subcategories': ['Houses for Sale', 'Houses to Rent', 'Flats & Apartments', 'Commercial Property', 'Land']
        },
        {
            'name': 'Goods',
            'subcategories': ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports Equipment', 'Home & Garden']
        },
        {
            'name': 'Services',
            'subcategories': ['Business Services', 'Personal Services', 'Education', 'Health & Beauty', 'Events']
        },
        {
            'name': 'Everything else',
            'subcategories': ['Pets', 'Jobs', 'Community', 'Personals']
        }
    ]
    
    return jsonify({
        'success': True,
        'categories': categories
    })

