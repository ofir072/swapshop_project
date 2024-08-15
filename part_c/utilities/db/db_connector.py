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
images_collection = swap_shop_DB['IMAGES']
image_directory = r'C:\Users\אופיר גוטליב\PycharmProjects\swapshop-project\part_c\static\png'


def upload_images(directory):
    filename_to_id = {}
    for filename in os.listdir(directory):
        if filename.endswith(('.png', '.jpg', '.jpeg', '.gif')):
            file_path = os.path.join(directory, filename)
            with open(file_path, "rb") as f:
                image_data = f.read()
            result = images_collection.insert_one({
                "filename": filename,
                "data": image_data
            })
            filename_to_id[filename] = result.inserted_id
            print(f"Uploaded {filename}")
    return filename_to_id


# Insert sample data
def insert_sample_data():
    # Insert sample users
    users.insert_many([
        {
            "FirstName": "יוסי",
            "LastName": "כהן",
            "Email": "yossi.ko@example.com",
            "Address": "רחוב אלון 5, תל אביב",
            "Rating": [5]
        },
        {
            "FirstName": "דנה",
            "LastName": "לוי",
            "Email": "dana.levi@example.com",
            "Address": "שדרות הנשיא 10, חיפה",
            "Rating": [4]
        },
        {
            "FirstName": "אבי",
            "LastName": "אברהם",
            "Email": "avi.avraham@example.com",
            "Address": "דרך ים 3, ירושלים",
            "Rating": [5]
        }
    ])

    # Insert items into the ITEMS collection
    items.insert_many([
        {
            "ItemID": "item1",
            "Category": "אומנות",
            "Description": "אגרטל עתיק משוק הפשפשים ביפו",
            "Image": uploaded_files.get("item_1.png", ""),
            "OwnerEmail": "yossi.ko@example.com"
        },
        {
            "ItemID": "item2",
            "Category": "בגדים",
            "Description": "מעיל עור חום, מידה L",
            "Image": uploaded_files.get("item_2.png", ""),
            "OwnerEmail": "dana.levi@example.com"
        },
        {
            "ItemID": "item3",
            "Category": "עציצים",
            "Description": "סוקולנט קטן, 20*20*20",
            "Image": uploaded_files.get("item_3.png", ""),
            "OwnerEmail": "yossi.ko@example.com"
        },
        {
            "ItemID": "item4",
            "Category": "אומנות",
            "Description": "תמונה אבסטרקטית, 120*60",
            "Image": uploaded_files.get("item_4.png", ""),
            "OwnerEmail": "avi.avraham@example.com"
        },
        {
            "ItemID": "item5",
            "Category": "בגדים",
            "Description": "צעיף בהיר מחמם ברמות",
            "Image": uploaded_files.get("item_6.png", ""),
            "OwnerEmail": "dana.levi@example.com"
        },
        {
            "ItemID": "item6",
            "Category": "אומנות",
            "Description": "פטיפון רטרו, עובד פיקס",
            "Image": uploaded_files.get("item_8.png", ""),
            "OwnerEmail": "avi.avraham@example.com"
        }
    ])

    # Insert sample trades
    trades.insert_many([
        {
            "TradeID": "trade1",
            "OfferedByEmail": "yossi.ko@example.com",
            "AcceptedByEmail": "dana.levi@example.com",
            "TradeStatus": "Pending",
            "OfferedByRating": 5,
            "AcceptedByRating": 4,
            "Items": ["item1", "item2"]
        },
        {
            "TradeID": "trade2",
            "OfferedByEmail": "dana.levi@example.com",
            "AcceptedByEmail": "yossi.ko@example.com",
            "TradeStatus": "Confirmed",
            "OfferedByRating": 4,
            "AcceptedByRating": 5,
            "Items": ["item5", "item3"]
        },
        {
            "TradeID": "trade3",
            "OfferedByEmail": "avi.avraham@example.com",
            "AcceptedByEmail": "yossi.ko@example.com",
            "TradeStatus": "Pending",
            "OfferedByRating": 5,
            "AcceptedByRating": 5,
            "Items": ["item4", "item1"]
        },
        {
            "TradeID": "trade4",
            "OfferedByEmail": "dana.levi@example.com",
            "AcceptedByEmail": "avi.avraham@example.com",
            "TradeStatus": "Confirmed",
            "OfferedByRating": 4,
            "AcceptedByRating": 5,
            "Items": ["item2", "item6"]
        }
    ])

    # Insert sample messages
    messages.insert_many([
        {
            "MessageID": "message1",
            "SenderEmail": "yossi.ko@example.com",
            "ReceiverEmail": "dana.levi@example.com",
            "TradeID": "trade1",
            "Content": "שלום, אני מעוניין במעיל שלך.",
            "Timestamp": "2024-07-23T10:00:00Z"
        },
        {
            "MessageID": "message2",
            "SenderEmail": "dana.levi@example.com",
            "ReceiverEmail": "yossi.ko@example.com",
            "TradeID": "trade1",
            "Content": "בכיף, נחליף?",
            "Timestamp": "2024-07-23T11:00:00Z"
        },
        {
            "MessageID": "message3",
            "SenderEmail": "dana.levi@example.com",
            "ReceiverEmail": "yossi.ko@example.com",
            "TradeID": "trade2",
            "Content": "אני רוצה להחליף את הצעיף שלי בעציץ שלך.",
            "Timestamp": "2024-07-23T12:00:00Z"
        },
        {
            "MessageID": "message4",
            "SenderEmail": "yossi.ko@example.com",
            "ReceiverEmail": "dana.levi@example.com",
            "TradeID": "trade2",
            "Content": "זה נשמע טוב!",
            "Timestamp": "2024-07-23T13:00:00Z"
        },
        {
            "MessageID": "message5",
            "SenderEmail": "avi.avraham@example.com",
            "ReceiverEmail": "yossi.ko@example.com",
            "TradeID": "trade3",
            "Content": "שלום לך",
            "Timestamp": "2024-07-23T14:00:00Z"
        },
        {
            "MessageID": "message6",
            "SenderEmail": "yossi.ko@example.com",
            "ReceiverEmail": "avi.avraham@example.com",
            "TradeID": "trade3",
            "Content": "היי",
            "Timestamp": "2024-07-23T15:00:00Z"
        },
        {
            "MessageID": "message7",
            "SenderEmail": "dana.levi@example.com",
            "ReceiverEmail": "avi.avraham@example.com",
            "TradeID": "trade4",
            "Content": "היי, ערב טוב, רוצה לבצע החלפה?",
            "Timestamp": "2024-07-23T16:00:00Z"
        },
        {
            "MessageID": "message8",
            "SenderEmail": "avi.avraham@example.com",
            "ReceiverEmail": "dana.levi@example.com",
            "TradeID": "trade4",
            "Content": "בכיף, נחליף.",
            "Timestamp": "2024-07-23T17:00:00Z"
        },
        {
            "MessageID": "message9",
            "SenderEmail": "yossi.ko@example.com",
            "ReceiverEmail": "dana.levi@example.com",
            "TradeID": "trade1",
            "Content": "מתי נוכל להחליף?",
            "Timestamp": "2024-07-23T18:00:00Z"
        },
        {
            "MessageID": "message10",
            "SenderEmail": "dana.levi@example.com",
            "ReceiverEmail": "yossi.ko@example.com",
            "TradeID": "trade1",
            "Content": "אני פנוי היום בערב.",
            "Timestamp": "2024-07-23T19:00:00Z"
        }
    ])


# Drop existing collections
def drop_collections():
    swap_shop_DB['USERS'].drop()
    swap_shop_DB['ITEMS'].drop()
    swap_shop_DB['TRADES'].drop()
    swap_shop_DB['MESSAGES'].drop()
    swap_shop_DB['IMAGES'].drop()


if __name__ == '__main__':
    drop_collections()
    uploaded_files = upload_images(image_directory)
    insert_sample_data()
