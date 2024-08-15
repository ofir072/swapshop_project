
# SwapShop Project

## Description

SwapShop is a web application designed to facilitate the swapping of items among users. It includes functionalities such as user sign-up, item filtering, item selection, and managing trades.
The application consists of multiple pages including adding items, viewing trades, managing trades, and viewing user items.

## Project Structure

The project is organized into the following directories and files:

- `add_item/`: Contains the code for adding new items.
- `add_trade/`: Manages the creation of new trades.
- `my_items/`: Displays the items owned by the user.
- `my_trades/`: Shows the trades the user is involved in.
- `view_trade/`: Displays details of a specific trade.
- `global/`: Contains global styles and scripts used across the application.
- `home/`: The home page of the application.
- `index/`: Entry point of the application.
- `png/`: Directory containing images used in the application.

## Usage

0. **General:**
   - The browser zoom need to be 125% to perfect css fit.

1. **Index Page:**
   - Navigate to `index.html` to view the landing page.
   - To see some base functionalty base on exsist data try the user emails: 1@1, 2@2, 3@3. Local storage is saved for thoes users.

2. **Home Page:**
   - After sign in  you will reach the home page.
   - From here, you can access different functionalities like viewing items, adding new items, and managing trades.

3. **Adding Items:**
   - Go to the `add_item` directory and open `add_item.html` to add new items to your collection.

4. **Managing Trades:**
   - Use the `add_trade` and `my_trades` directories to create and manage trades.

5. **Viewing Items and Trades:**
   - The `my_items` and `view_trade` directories provide interfaces to view your items and specific trade details respectively.

## System Assumptions

1. **Form Input Checks:**
   - All forms include basic input validation to ensure that required fields are filled out and data is in the correct format.
   - Client-side validation is implemented using JavaScript for instant feedback.

2. **Local Storage:**
   - User details and items are stored in the browser's local storage for quick access and easy retrieval.
   - This approach simulates a database and provides a seamless user experience without the need for server-side storage.

3. **Future Enhancements:**
   - In future updates, a backend database connection will be implemented to allow for persistent data storage and retrieval.
