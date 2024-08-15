document.addEventListener('DOMContentLoaded', () => {
    const itemsSelection = document.getElementById('items-selection');
    const modal = document.getElementById('item-details-modal');
    const closeButton = document.getElementById('item-details-close-button');
    const modalItemDetails = document.getElementById('modal-item-details');
    const tradeAnimationContainer = document.getElementById('trade-animation-container');

    // Function to open modal with item details
    const openModal = (item) => {
        modalItemDetails.innerHTML = `
            <p>מזהה פריט: ${item.id}</p>
            <p>דירוג: ${item.rating}</p>
            <p>מיקום: ${item.location}</p>
            <p>תיאור: ${item.description}</p>
            <p>קטגוריה: ${item.category}</p>
        `;
        modal.style.display = 'block';
    };

    // Close the modal
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal when the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Retrieve the selected item from localStorage
    const selectedItem = JSON.parse(localStorage.getItem('selectedItem'));

    // Display the selected item card
    if (selectedItem) {
        const selectedCard = createItemCard(selectedItem);
        selectedCard.classList.add('selected-item-card');
        selectedCard.addEventListener('click', () => openModal(selectedItem));
        document.getElementById('selected-item-container').appendChild(selectedCard);
    }

    // Display user items
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userEmail = userDetails ? userDetails.email : null;
    const userItems = items.filter(item => item.ownerEmail === userEmail);

    userItems.forEach(item => {
        const card = createItemCard(item);
        itemsSelection.appendChild(card);
    });
});