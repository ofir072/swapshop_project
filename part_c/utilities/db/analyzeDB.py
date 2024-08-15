import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

# Get your URI from the .env file
uri = os.environ.get('DB_URI')

# Create cluster and DB pointers
cluster = MongoClient(uri, server_api=ServerApi('1'))
swap_shop_DB = cluster['swap_shop_DB']
users = swap_shop_DB['USERS']
trades = swap_shop_DB['TRADES']
items = swap_shop_DB['ITEMS']
messages = swap_shop_DB['MESSAGES']


def print_collection_data(title, collection):
    print(f"\n--- {title} ---")
    for document in collection.find():
        print(document)

# Print current data in USERS collection
print_collection_data("USERS Collection", users)

# Print current data in TRADES collection
print_collection_data("TRADES Collection", trades)

# Print current data in ITEMS collection
print_collection_data("ITEMS Collection", items)

# Print current data in MESSAGES collection
print_collection_data("MESSAGES Collection", messages)
