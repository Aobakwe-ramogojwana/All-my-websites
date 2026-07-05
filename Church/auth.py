from flask import Blueprint, request, jsonify, session
from src.models.user import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Check for hardcoded admin credentials
    if username == 'aybee' and password == 'Ompatile@2':
        # Create admin user if doesn't exist
        admin_user = User.query.filter_by(username='aybee').first()
        if not admin_user:
            admin_user = User(
                username='aybee',
                email='admin@amalet.com',
                is_admin=True
            )
            admin_user.set_password('Ompatile@2')
            db.session.add(admin_user)
            db.session.commit()
        
        session['user_id'] = admin_user.id
        session['is_admin'] = True
        return jsonify({
            'success': True,
            'user': admin_user.to_dict(),
            'message': 'Admin login successful'
        })
    
    # Check database for other users
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        session['is_admin'] = user.is_admin
        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'message': 'Login successful'
        })
    
    return jsonify({
        'success': False,
        'message': 'Invalid username or password'
    }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    })

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({
                'authenticated': True,
                'user': user.to_dict()
            })
    
    return jsonify({
        'authenticated': False
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({
            'success': False,
            'message': 'Username already exists'
        }), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({
            'success': False,
            'message': 'Email already exists'
        }), 400
    
    # Create new user
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'User registered successfully'
    })

