from flask import Blueprint, render_template

# Define the blueprint
my_items_bp = Blueprint(
    'my_items_bp',
    __name__,
    static_folder='static',
    static_url_path='/my_items',
    template_folder='templates'
)

# Routes
@my_items_bp.route('/my_items')
def my_items():
    return render_template('my_items.html')
