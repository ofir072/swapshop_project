from flask import Flask, session, jsonify, Response, request
from pages.index.index import index_bp  # Import the blueprint object
from pages.home.home import home_bp  # Import the blueprint object
from pages.add_trade.add_trade import add_trade_bp  # Import the blueprint object
from pages.my_items.my_items import my_items_bp  # Import the blueprint object
from pages.add_item.add_item import add_item_bp  # Import the blueprint object
from pages.my_trades.my_trades import my_trades_bp  # Import the blueprint object
from pages.view_trade.view_trade import view_trade_bp  # Import the blueprint object
import os
import random
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('settings.py')

    # Get your URI from the .env file
    uri = os.environ.get('DB_URI')

    # Create cluster and DB pointers
    cluster = MongoClient(uri, server_api=ServerApi('1'))
    swap_shop_DB = cluster['swap_shop_DB']

    # Add the database collections to the app config
    app.config['USERS_COLLECTION'] = swap_shop_DB['USERS']
    app.config['TRADES_COLLECTION'] = swap_shop_DB['TRADES']
    app.config['ITEMS_COLLECTION'] = swap_shop_DB['ITEMS']
    app.config['MESSAGES_COLLECTION'] = swap_shop_DB['MESSAGES']
    app.config['IMAGES_COLLECTION'] = swap_shop_DB['IMAGES']

    # Register blueprints
    app.register_blueprint(index_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(add_trade_bp)
    app.register_blueprint(my_items_bp)
    app.register_blueprint(add_item_bp)
    app.register_blueprint(my_trades_bp)
    app.register_blueprint(view_trade_bp)

    # Helper function to convert ObjectId to string
    def convert_objectid_to_str(document):
        if isinstance(document, dict):
            for key, value in document.items():
                if isinstance(value, ObjectId):
                    document[key] = str(value)
                elif isinstance(value, list):
                    document[key] = [convert_objectid_to_str(item) for item in value]
                elif isinstance(value, dict):
                    document[key] = convert_objectid_to_str(value)
        elif isinstance(document, list):
            document = [convert_objectid_to_str(item) for item in document]
        return document

    @app.route('/get_session_user', methods=['GET'])
    def get_session_user():
        user_details = session.get('userDetails')
        if user_details:
            return jsonify({"user": user_details}), 200
        else:
            return jsonify({"error": "User not logged in"}), 401

    @app.route('/get_items', methods=['GET'])
    def get_items():
        items_collection = app.config['ITEMS_COLLECTION']
        items = list(items_collection.find())
        items = convert_objectid_to_str(items)
        return jsonify({"items": items}), 200

    @app.route('/get_item/<item_id>', methods=['GET'])
    def get_item(item_id):
        items_collection = app.config['ITEMS_COLLECTION']
        item = items_collection.find_one({'ItemID': item_id})
        if item:
            item = convert_objectid_to_str(item)
            return jsonify({"item": item}), 200
        else:
            return jsonify({"error": "Item not found"}), 404

    @app.route('/get_user_ratings', methods=['GET'])
    def get_user_ratings():
        users_collection = app.config['USERS_COLLECTION']
        users = list(users_collection.find({}, {'Email': 1, 'Rating': 1}))
        user_ratings = {}
        for user in users:
            if 'Rating' in user:
                try:
                    user_ratings[user['Email']] = float(user['Rating'])
                except (ValueError, TypeError):
                    user_ratings[user['Email']] = 0
            else:
                user_ratings[user['Email']] = 0
        return jsonify({"ratings": user_ratings}), 200

    @app.route('/get_user_by_email/<email>', methods=['GET'])
    def get_user_by_email(email):
        users_collection = app.config['USERS_COLLECTION']
        user = users_collection.find_one({'Email': email})
        if user:
            user = convert_objectid_to_str(user)
            return jsonify({"user": user}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    @app.route('/get_image/<image_id>', methods=['GET'])
    def get_image(image_id):
        images_collection = app.config['IMAGES_COLLECTION']
        try:
            # Check if the image_id is a valid ObjectId
            if ObjectId.is_valid(image_id):
                image_document = images_collection.find_one({'_id': ObjectId(image_id)})
                if image_document and 'data' in image_document:
                    return Response(image_document['data'], mimetype='image/png')
                else:
                    return jsonify({"error": "Image not found"}), 404
            else:
                return jsonify({"error": "Invalid image ID"}), 400
        except Exception as e:
            print(f"Error fetching image: {e}")
            return jsonify({"error": "Internal server error"}), 500

    @app.route('/check_trade_exists', methods=['GET'])
    def check_trade_exists():
        item1 = request.args.get('item1')
        item2 = request.args.get('item2')
        trades_collection = app.config['TRADES_COLLECTION']
        existing_trade = trades_collection.find_one({
            "Items": {"$all": [item1, item2]}
        })
        if existing_trade:
            return jsonify({"exists": True}), 200
        else:
            return jsonify({"exists": False}), 200

    @app.route('/create_trade', methods=['POST'])
    def create_trade():
        trade_details = request.json
        trades_collection = app.config['TRADES_COLLECTION']
        existing_trades_ids = [trade['TradeID'] for trade in trades_collection.find({}, {'TradeID': 1})]
        while True:
            rand_trade_id = f"trade{random.randint(1, 999)}"
            if rand_trade_id not in existing_trades_ids:
                break
        trade_details['TradeID'] = rand_trade_id
        result = trades_collection.insert_one(trade_details)
        if result.inserted_id:
            return jsonify({"success": True}), 201
        else:
            return jsonify({"success": False, "error": "Failed to create trade"}), 500

    @app.route('/add_new_item', methods=['POST'])
    def add_new_item():
        items_collection = app.config['ITEMS_COLLECTION']
        images_collection = app.config['IMAGES_COLLECTION']
        # Generate a unique 3-digit ItemID
        existing_item_ids = [item['ItemID'] for item in items_collection.find({}, {'ItemID': 1})]
        while True:
            rand_item_id = f"item{random.randint(1, 999)}"
            if rand_item_id not in existing_item_ids:
                break
        item_id = rand_item_id
        category = request.form['Category']
        description = request.form['Description']
        owner_email = session.get('userDetails', {}).get('Email')  # Ensure the user is logged in

        if 'Image' in request.files:
            image_file = request.files['Image']
            image_data = image_file.read()
            image_document = {
                'filename': image_file.filename,
                'data': image_data
            }
            result = images_collection.insert_one(image_document)
            image_id = str(result.inserted_id)
        else:
            return jsonify({"success": False, "error": "Image upload failed"}), 400

        new_item = {
            "ItemID": item_id,
            "Category": category,
            "Description": description,
            "Image": image_id,  # Store ObjectId directly
            "OwnerEmail": owner_email
        }
        print(new_item)
        items_collection.insert_one(new_item)
        return jsonify({"success": True, "message": "Item added successfully"}), 200

    @app.route('/get_trades/<email>', methods=['GET'])
    def get_trades(email):
        trades_collection = app.config['TRADES_COLLECTION']
        trades = list(trades_collection.find({"$or": [{"OfferedByEmail": email}, {"AcceptedByEmail": email}]}))

        for trade in trades:
            if trade["AcceptedByEmail"] == email:
                trade["Items"] = trade["Items"][::-1]  # Reverse the Items array

        trades = convert_objectid_to_str(trades)
        return jsonify({"trades": trades}), 200

    @app.route('/get_trade/<trade_id>', methods=['GET'])
    def get_trade(trade_id):
        trades_collection = app.config['TRADES_COLLECTION']
        trade = trades_collection.find_one({"TradeID": trade_id})
        if trade:
            trade = convert_objectid_to_str(trade)
            return jsonify({"trade": trade}), 200
        else:
            return jsonify({"error": "Trade not found"}), 404

    @app.route('/get_messages/<trade_id>', methods=['GET'])
    def get_messages(trade_id):
        messages_collection = app.config['MESSAGES_COLLECTION']
        messages = list(messages_collection.find({"TradeID": trade_id}))
        messages = convert_objectid_to_str(messages)
        return jsonify({"messages": messages}), 200

    @app.route('/add_message', methods=['POST'])
    def add_message():
        messages_collection = app.config['MESSAGES_COLLECTION']
        data = request.get_json()
        new_message = {
            "MessageID": f"message{random.randint(1, 9999)}",
            "SenderEmail": data.get('SenderEmail'),
            "ReceiverEmail": data.get('ReceiverEmail'),
            "TradeID": data.get('TradeID'),
            "Content": data.get('Content'),
            "Timestamp": datetime.now().isoformat()
        }
        result = messages_collection.insert_one(new_message)
        new_message['_id'] = str(result.inserted_id)  # Convert ObjectId to string
        return jsonify({"success": True, "message": new_message}), 201

    @app.route('/update_trade_status', methods=['POST'])
    def update_trade_status():
        trades_collection = app.config['TRADES_COLLECTION']
        users_collection = app.config['USERS_COLLECTION']

        try:
            data = request.get_json()
            trade_id = data.get('TradeID')
            status = data.get('TradeStatus').capitalize()  # Capitalize the status
            rating = float(data.get('Rating'))
            user_email = data.get('SenderEmail')

            if not trade_id or not status or not user_email:
                return jsonify({"success": False, "error": "Missing required fields"}), 400

            trade = trades_collection.find_one({"TradeID": trade_id})
            if not trade:
                return jsonify({"success": False, "error": "Trade not found"}), 404

            # Update trade status and rating
            if trade['AcceptedByEmail'] == user_email:
                trades_collection.update_one({"TradeID": trade_id},
                                             {"$set": {"TradeStatus": status, "OfferedByRating": rating}})
                recalculate_user_rating(users_collection, trades_collection, trade['OfferedByEmail'])
            elif trade['OfferedByEmail'] == user_email:
                trades_collection.update_one({"TradeID": trade_id},
                                             {"$set": {"TradeStatus": status, "AcceptedByRating": rating}})
                recalculate_user_rating(users_collection, trades_collection, trade['AcceptedByEmail'])
            else:
                return jsonify({"success": False, "error": "User not authorized to update this trade"}), 403

            return jsonify({"success": True, "message": "Trade status and rating updated successfully"}), 200
        except Exception as e:
            print(f"Error in update_trade_status: {e}")
            return jsonify({"success": False, "error": "Internal server error"}), 500

    def recalculate_user_rating(users_collection, trades_collection, user_email):
        trades = trades_collection.find({
            "$or": [{"OfferedByEmail": user_email}, {"AcceptedByEmail": user_email}],
            "TradeStatus": {"$in": ["Confirmed", "Canceled"]}
        })

        ratings = []
        for trade in trades:
            if trade['OfferedByEmail'] == user_email and 'OfferedByRating' in trade:
                try:
                    ratings.append(float(trade['OfferedByRating']))
                except (ValueError, TypeError):
                    pass  # Ignore invalid ratings
            elif trade['AcceptedByEmail'] == user_email and 'AcceptedByRating' in trade:
                try:
                    ratings.append(float(trade['AcceptedByRating']))
                except (ValueError, TypeError):
                    pass  # Ignore invalid ratings

        print(f"Ratings for user {user_email}: {ratings}")  # Debug output

        if ratings:
            average_rating = round(sum(ratings) / len(ratings), 2)
        else:
            average_rating = 'NEW'

        print(f"Average rating for user {user_email}: {average_rating}")  # Debug output
        print(f"Type of average rating: {type(average_rating)}")  # Debug output

        users_collection.update_one({"Email": user_email}, {"$set": {"Rating": average_rating}})
        updated_user = users_collection.find_one({"Email": user_email})
        print(f"Updated user {user_email} rating: {updated_user['Rating']}")

    # Calculate rating
    users_collection = app.config['USERS_COLLECTION']
    users = users_collection.find()
    trades = app.config['TRADES_COLLECTION']
    for user in users:
        recalculate_user_rating(users_collection, trades, user['Email'])

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
