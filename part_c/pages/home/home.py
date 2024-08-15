from flask import Blueprint, render_template, session

# Define the blueprint for home
home_bp = Blueprint(
    'home_bp',
    __name__,
    static_folder='static',
    static_url_path='/home',
    template_folder='templates'
)

# Routes for home
@home_bp.route('/home')
def home():
    user_details = session.get('userDetails')
    return render_template('home.html', user_details=user_details)
