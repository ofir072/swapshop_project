from flask import Blueprint, render_template, request, session

# Define the blueprint
view_trade_bp = Blueprint(
    'view_trade_bp',
    __name__,
    static_folder='static',
    static_url_path='/view_trade',
    template_folder='templates'
)

# Routes
@view_trade_bp.route('/view_trade')
def view_trade():
    selected_trade = {
        'id': request.args.get('id'),
        'userEmail': request.args.get('userEmail'),
        'userItemImage': request.args.get('userItemImage'),
        'requestedItemImage': request.args.get('requestedItemImage'),
        'status': request.args.get('status'),
        'items': [request.args.get('Items[0]'), request.args.get('Items[1]')]
    }
    session['selectedTrade'] = selected_trade
    return render_template('view_trade.html')
