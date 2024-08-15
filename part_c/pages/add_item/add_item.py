from flask import Blueprint, render_template

# Define the blueprint
add_item_bp = Blueprint(
    'add_item_bp',
    __name__,
    static_folder='static',
    static_url_path='/add_item',
    template_folder='templates'
)

# Routes
@add_item_bp.route('/add_item')
def home():
    return render_template('add_item.html')
