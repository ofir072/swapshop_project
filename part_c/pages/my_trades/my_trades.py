from flask import Blueprint, render_template

# Define the blueprint
my_trades_bp = Blueprint(
    'my_trades_bp',
    __name__,
    static_folder='static',
    static_url_path='/my_trades',
    template_folder='templates'
)

# Routes
@my_trades_bp.route('/my_trades')
def my_trades():
    return render_template('my_trades.html')
