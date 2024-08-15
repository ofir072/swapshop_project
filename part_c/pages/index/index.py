from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify

# Define the blueprint for index
index_bp = Blueprint(
    'index_bp',
    __name__,
    static_folder='static',
    static_url_path='/index',
    template_folder='templates'
)

def convert_objectid_to_str(document):
    if '_id' in document:
        document['_id'] = str(document['_id'])
    return document

# Routes for index
@index_bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_details = {
            'FirstName': request.form['first-name'],
            'LastName': request.form['last-name'],
            'Email': request.form['email'],
            'Address': request.form['address'],
            'Rating': 0.0  # Initialize as a float
        }
        session['userDetails'] = user_details
        print("User details set in session:", user_details)  # Debugging print

        users_collection = current_app.config['USERS_COLLECTION']

        email = user_details['Email']
        user = users_collection.find_one({"Email": email})

        if user:
            return redirect(url_for('home_bp.home'))
        else:
            print("NEW USER!")
            result = users_collection.insert_one(user_details)
            user_details['_id'] = str(result.inserted_id)  # Convert ObjectId to string
            session['userDetails'] = user_details  # Update session with _id
            return redirect(url_for('home_bp.home'))

    return render_template('index.html')


@index_bp.route('/get_user', methods=['GET'])
def get_user():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    users_collection = current_app.config['USERS_COLLECTION']
    user = users_collection.find_one({"Email": email})

    if user:
        user = convert_objectid_to_str(user)
        return jsonify({"user": user}), 200
    else:
        return jsonify({"error": "User not found"}), 404
