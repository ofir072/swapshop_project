from flask import Blueprint, render_template, request, session

# Define the blueprint
add_trade_bp = Blueprint(
    'add_trade_bp',
    __name__,
    static_folder='static',
    static_url_path='/add_trade',
    template_folder='templates'
)

# Routes
@add_trade_bp.route('/add_trade')
def add_trade():
    selected_item = {
        'id': request.args.get('id'),
        'image': request.args.get('image'),
        'location': request.args.get('location'),
        'ownerEmail': request.args.get('ownerEmail'),
        'description': request.args.get('description'),
        'category': request.args.get('category'),
        'rating': request.args.get('rating')
    }
    session['selectedItem'] = selected_item
    return render_template('add_trade.html', selected_item=selected_item)
