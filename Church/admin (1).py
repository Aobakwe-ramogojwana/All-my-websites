from flask import Blueprint, request, jsonify, session
from src.models.user import db, Listing, SellerApplication

admin_bp = Blueprint('admin', __name__)

def require_admin():
    """Decorator to require admin authentication"""
    user_id = session.get('user_id')
    is_admin = session.get('is_admin')
    
    if not user_id or not is_admin:
        return jsonify({
            'success': False,
            'message': 'Admin access required'
        }), 403
    
    return None

@admin_bp.route('/dashboard-stats', methods=['GET'])
def dashboard_stats():
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    # Get statistics for admin dashboard
    pending_listings = Listing.query.filter_by(status='pending').count()
    approved_listings = Listing.query.filter_by(status='approved').count()
    rejected_listings = Listing.query.filter_by(status='rejected').count()
    total_listings = Listing.query.count()
    
    pending_sellers = SellerApplication.query.filter_by(status='pending').count()
    approved_sellers = SellerApplication.query.filter_by(status='approved').count()
    rejected_sellers = SellerApplication.query.filter_by(status='rejected').count()
    total_sellers = SellerApplication.query.count()
    
    return jsonify({
        'success': True,
        'stats': {
            'listings': {
                'pending': pending_listings,
                'approved': approved_listings,
                'rejected': rejected_listings,
                'total': total_listings
            },
            'sellers': {
                'pending': pending_sellers,
                'approved': approved_sellers,
                'rejected': rejected_sellers,
                'total': total_sellers
            }
        }
    })

@admin_bp.route('/pending-listings', methods=['GET'])
def get_pending_listings():
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    listings = Listing.query.filter_by(status='pending').paginate(
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

@admin_bp.route('/pending-sellers', methods=['GET'])
def get_pending_sellers():
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    sellers = SellerApplication.query.filter_by(status='pending').paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'success': True,
        'sellers': [seller.to_dict() for seller in sellers.items],
        'pagination': {
            'page': page,
            'pages': sellers.pages,
            'per_page': per_page,
            'total': sellers.total
        }
    })

@admin_bp.route('/approve-listing/<int:listing_id>', methods=['POST'])
def approve_listing(listing_id):
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    listing = Listing.query.get_or_404(listing_id)
    listing.status = 'approved'
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Listing approved successfully'
    })

@admin_bp.route('/reject-listing/<int:listing_id>', methods=['POST'])
def reject_listing(listing_id):
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    listing = Listing.query.get_or_404(listing_id)
    listing.status = 'rejected'
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Listing rejected successfully'
    })

@admin_bp.route('/approve-seller/<int:seller_id>', methods=['POST'])
def approve_seller(seller_id):
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    seller = SellerApplication.query.get_or_404(seller_id)
    seller.status = 'approved'
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Seller application approved successfully'
    })

@admin_bp.route('/reject-seller/<int:seller_id>', methods=['POST'])
def reject_seller(seller_id):
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    seller = SellerApplication.query.get_or_404(seller_id)
    seller.status = 'rejected'
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Seller application rejected successfully'
    })

@admin_bp.route('/all-listings', methods=['GET'])
def get_all_listings():
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status', 'all')
    
    query = Listing.query
    if status != 'all':
        query = query.filter_by(status=status)
    
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

@admin_bp.route('/all-sellers', methods=['GET'])
def get_all_sellers():
    auth_check = require_admin()
    if auth_check:
        return auth_check
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status', 'all')
    
    query = SellerApplication.query
    if status != 'all':
        query = query.filter_by(status=status)
    
    sellers = query.order_by(SellerApplication.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'success': True,
        'sellers': [seller.to_dict() for seller in sellers.items],
        'pagination': {
            'page': page,
            'pages': sellers.pages,
            'per_page': per_page,
            'total': sellers.total
        }
    })

