document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('item-details-modal');
    const closeButton = document.getElementById('item-details-close-button');
    const modalItemDetails = document.getElementById('modal-item-details');

    // Function to fetch item details
    function fetchItemDetails(itemID) {
        fetch(`/get_item/${itemID}`)
            .then(response => response.json())
            .then(data => {
                if (data.item) {
                    fetchOwnerDetails(data.item.OwnerEmail, data.item);
                } else {
                    console.error("Failed to fetch selected item");
                }
            })
            .catch(error => {
                console.error("Error fetching selected item:", error);
            });
    }

    // Function to fetch owner details
    function fetchOwnerDetails(ownerEmail, item) {
        fetch(`/get_user_by_email/${ownerEmail}`)
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    item.rating = data.user.Rating;
                    item.location = data.user.Address;
                    console.log('rating: ' + item.rating);
                    displaySelectedItem(item);
                } else {
                    console.error("Failed to fetch owner details");
                }
            })
            .catch(error => {
                console.error("Error fetching owner details:", error);
            });
    }

    function createItemCard(item, rating, location) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.id = item.ItemID;
        card.dataset.location = location;
        card.dataset.ownerEmail = item.OwnerEmail;
        card.dataset.description = item.Description;
        card.dataset.category = item.Category;
        card.dataset.rating = rating;

        const img = document.createElement('img');
        img.alt = 'Item Image';
        img.src = `/get_image/${item.Image}`;

        const p = document.createElement('p');
        p.className = 'item-rating';
        p.textContent = `#${item.ItemID} / Rating: ${rating}`;

        card.appendChild(img);
        card.appendChild(p);

        return card;
    }
    // Function to display selected item
    function displaySelectedItem(item) {
        const selectedItemContainer = document.getElementById('selected-item-container');
        selectedItemContainer.innerHTML = ''; // Clear existing content
        const card = createItemCard(item, item.rating, item.location);
        card.classList.add('selected-item-card', 'no-click-appearance'); // Add the no-click-appearance class
        card.addEventListener('click', () => openModal(item));
        selectedItemContainer.appendChild(card);
        localStorage.setItem('tradedItem', JSON.stringify(item)); // Save the selected item to localStorage
    }

    // Function to open modal with item details
    const openModal = (item) => {
        modalItemDetails.innerHTML = `
            <p>מזהה פריט: ${item.ItemID}</p>
            <p>דירוג: ${item.rating}</p>
            <p>מיקום: ${item.location}</p>
            <p>תיאור: ${item.Description}</p>
            <p>קטגוריה: ${item.Category}</p>
        `;
        modal.style.display = 'block';
    };

    // Close the modal
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal when the user clicks outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Retrieve the selected item from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedItemID = urlParams.get('ItemID');

    if (selectedItemID) {
        fetchItemDetails(selectedItemID);
    } else {
        console.error("No ItemID found in the URL query parameters");
    }
});
