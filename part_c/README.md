# SwapShop Project

## Description

SwapShop is a web application designed to facilitate the swapping of items among users. It includes functionalities such as user sign-up, item filtering, item selection, and managing trades. The application consists of multiple pages including adding items, viewing trades, managing trades, and viewing user items.

## Project Structure

The project is organized into the following directories and files:

- `pages/`: Contains the mini flask environment (py,static,template) to all pages in the app.
- `screenshots/`: Include the pages images for this md.
- `static/`: All the static files for the common templates - global.
- `templates/`: Have all the templates that are wide use in the pages.
- `utilities/`: DB conectores files.
- `app.py/`: Main py file to the flask configuration.
- `settings/`: Predefine keys for app configuration based on the dot env file.

## Routes
Those are the routes that represent all the pages. In terms of application the routs and queries that needed. 
- `/add_item:` - Route to add new items to the collection.
- `/add_trade:`- Route to create a new trade.
- `/home:` - Route to the home page of the application.
- `/:` - Route to the index (landing) page of the application.
- `/my_items:` - Route to view items owned by the user.
- `/my_trades:` - Route to view trades the user is involved in.
- `/view_trade:` - Route to view details of a specific trade.

## DB
The DB connection based on MonogoDB cloud application - Atlas.
The ignition based on the `/utilities` files, set the connection and populate the raw data.
Each of the upcomings routes handle `POST` and `GER` requests for the app.

- `/get_session_user:` - Handled by function get_session_user in app.py
- `/get_items:` - Handled by function get_items in app.py
- `/get_item/<item_id>:` - Handled by function get_item in app.py
- `/get_user_ratings:` - Handled by function get_user_ratings in app.py
- `/get_user_by_email/<email>:` - Handled by function get_user_by_email in app.py
- `/get_image/<image_id>:` - Handled by function get_image in app.py
- `/check_trade_exists:` - Handled by function check_trade_exists in app.py
- `/create_trade:` - Handled by function create_trade in app.py
- `/add_new_item:` - Handled by function add_new_item in app.py
- `/get_trades/<email>:` - Handled by function get_trades in app.py
- `/get_trade/<trade_id>:` - Handled by function get_trade in app.py
- `/get_messages/<trade_id>:` - Handled by function get_messages in app.py
- `/add_message:` - Handled by function add_message in app.py
- `/update_trade_status:` - Handled by function update_trade_status in app.py

## App Walkthrough
0. **General:**
   - The browser zoom needs to be at 125% for a perfect CSS fit.


1. **Index Page:**
   - Navigate to `/` to view the landing page.
   - Add your info to register or to create new user.
   - `i` icon refer to about us in all pages

   ![Index Page](/part_c/screenshots/index.page.png)


2. **Home Page:**
   - After signing in, you will reach the home page all the un owned items will show up.
   - You can filter them, select the one you want, and redirect to the `add_trade` page by the `+` icon.
   - Yon can go back by the `<` icon and navigate to other pages by clicking the nav selections.

   ![Home Page](/part_c/screenshots/home.page.png)


3. **Add Trade:**

   - Select you item to be trade on the right side of the page, after that selection on the `+` icon will create new trade.
   - Clicking on the item of the other user show as some info about him.
   
   ![Add Trade Page](/part_c/screenshots/add_trade.page.png)


4. **Add Item:**

   - After filling all the field and upload of image - press on the `+` icon to add your item.

   ![Add Item Page](/part_c/screenshots/add_item.page.png)

   - Use the `add_trade` and `my_trades` directories to create and manage trades.


5. **My Items:**

   - The page provide interfaces to view your items. The `+` icon will redirect you to the `add_item` page.

   ![My Items Page](/part_c/screenshots/my_items.page.png)


6. **My Trades:**

   - The page provide interfaces to view your trades. The big `<` icons will redirect you to the `view_trade` page.

   ![My Trades Page](/part_c/screenshots/my_trades.page.png)


7. **View Trade:**
   - The page provide interfaces to view your specific trade details.
   - You can add messages in the chat.
   - You can confirm and chancel the trade and provide your taring to the other user by selecting the amount of stars.
   - Clicking on the `v` will save your updates on the trade.

   ![View Trade Page](/part_c/screenshots/view_trade.page.png)
