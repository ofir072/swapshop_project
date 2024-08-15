// global.js

// Item data
const items = [
    {
        id: "item1",
        image: "../png/item_1.png",
        location: "Location A",
        ownerEmail: "1@1",
        description: "Description for item 1",
        category: "אומנות",
        rating: 4.5
    },
    {
        id: "item2",
        image: "../png/item_2.png",
        location: "Location B",
        ownerEmail: "1@1",
        description: "Description for item 2",
        category: "עציצים",
        rating: 3.8
    },
    {
        id: "item3",
        image: "../png/item_3.png",
        location: "Location C",
        ownerEmail: "1@1",
        description: "Description for item 3",
        category: "בגדים",
        rating: 4.0
    },
    {
        id: "item4",
        image: "../png/item_4.png",
        location: "Location D",
        ownerEmail: "2@2",
        description: "Description for item 4",
        category: "אומנות",
        rating: 4.7
    },
    {
        id: "item5",
        image: "../png/item_5.png",
        location: "Location E",
        ownerEmail: "2@2",
        description: "Description for item 5",
        category: "עציצים",
        rating: 3.5
    },
    {
        id: "item6",
        image: "../png/item_6.png",
        location: "Location F",
        ownerEmail: "3@3",
        description: "Description for item 6",
        category: "בגדים",
        rating: 4.2
    }
];

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    card.dataset.location = item.location;
    card.dataset.ownerEmail = item.ownerEmail;
    card.dataset.description = item.description;
    card.dataset.category = item.category;
    card.dataset.rating = item.rating;

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = 'Item Image';

    const p = document.createElement('p');
    p.className = 'item-rating';
    p.textContent = `#${item.id} / Rating: ${item.rating}`;

    card.appendChild(img);
    card.appendChild(p);

    return card;
}


function displayItems(containerId, itemsToDisplay = items) {
    const container = document.getElementById(containerId);
    const currentHtmlname = window.location.pathname.split("/").pop();
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userEmail = userDetails ? userDetails.email : null;

    if (currentHtmlname === 'home.html') {
        itemsToDisplay = itemsToDisplay.filter(item => item.ownerEmail !== userEmail);
    } else {
        itemsToDisplay = itemsToDisplay.filter(item => item.ownerEmail === userEmail);
    }

    container.innerHTML = ""; // Clear existing items
    itemsToDisplay.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    console.log('DOMContentLoaded event fired'); // Add this line

    // Dynamically create and append items-section if necessary
    if (!window.location.pathname.includes('my_trades.html') & !window.location.pathname.includes('add_item.html') &
    !window.location.pathname.includes('index.html') & !window.location.pathname.includes('view_trade.html')) {
        const mainElement = document.querySelector('main');
        const itemsSection = document.createElement('section');
        itemsSection.id = 'items-section';
        mainElement.appendChild(itemsSection);

        console.log('items-section dynamically added');
        displayItems('items-section');
    }

    const modal = document.getElementById("modal");
    const btn = document.getElementById("about-link");
    const span = document.getElementsByClassName("close-button")[0];
    const backButton = document.getElementById("back-button");
    const addButton = document.getElementById("add-image");
    const navLinks = document.querySelectorAll('.profile-info a');

    let selectedCard = null;

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Handle the navigation click event if necessary
            console.log(`Navigating to ${link.getAttribute('href')}`);
      });
    });

    // Modal functionality
    if (btn) {
        console.log('About link button found');
        btn.onclick = function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            modal.style.display = "block";
        }
     } else {
        console.log('About link button not found');
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Back button functionality
    if (backButton) {
        console.log('Back button found');
        backButton.onclick = function() {
            window.history.back();
        }
    } else {
        console.log('Back button not found');
    }

    // Card selection functionality
    const cards = document.querySelectorAll('.item-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (card === selectedCard) {
                // If the clicked card is already selected, deselect it
                card.classList.remove('selected');
                selectedCard = null;
                addButton.classList.add('disabled');
            } else {
                // If a different card is clicked, select it
                if (selectedCard) {
                    selectedCard.classList.remove('selected');
                }
                card.classList.add('selected');
                selectedCard = card;
                addButton.classList.remove('disabled');
            }
        });
    });

    // Handle Add Button Click
    if (addButton) {
        addButton.onclick = function() {
            if (!addButton.classList.contains('disabled')) {
                const selectedItem = items.find(item => item.id === selectedCard.dataset.id);
                if (window.location.pathname.includes('add_trade.html')) {
                    const tradeAnimationContainer = document.getElementById('trade-animation-container'); // Ensure it's defined here
                    localStorage.setItem('tradedItem', JSON.stringify(selectedItem));
                    tradeAnimationContainer.style.display = 'flex'; // Show the trade animation container
                    setTimeout(() => {
                        tradeAnimationContainer.style.display = 'none'; // Hide the animation
                        window.location.href = '../home/home.html'; // Redirect to the home page
                    }, 2000); // Display the animation for 4 seconds
                } else {
                    localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
                    window.location.href = '../add_trade/add_trade.html'; // Redirect to add_item page
                }
            }
        }
    }

    // Filter functionality
    const filterModal = document.getElementById("filter-modal");
    const filterButton = document.getElementById("filter-button");
    const filterCloseButton = document.querySelector("#filter-modal .close-button");
    const applyFilterButton = document.getElementById("apply-filter");
    const ratingInput = document.getElementById("rating");

    ratingInput.addEventListener('input', function() {
        const rating = parseFloat(this.value);
        if (isNaN(rating) || rating < 0 || rating > 5) {
            this.value = '';
            alert("הכנס מספר בין 0 ל-5");
        }
    });

    // Filter modal functionality
    if (filterButton) {
        filterButton.onclick = function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            filterModal.style.display = "block";
        }
    }

    if (filterCloseButton) {
        filterCloseButton.onclick = function() {
            filterModal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == filterModal) {
            filterModal.style.display = "none";
        }
    }

    // Apply filter functionality
    if (applyFilterButton) {
        applyFilterButton.onclick = function() {
            const category = document.getElementById("category").value;
            const location = document.getElementById("location").value.trim().toLowerCase();
            const rating = parseFloat(document.getElementById("rating").value);

            const filteredItems = items.filter(item => {
                const matchesCategory = category === "all" || item.category === category;
                const matchesLocation = location === "" || item.location.toLowerCase().includes(location);
                const matchesRating = isNaN(rating) || item.rating >= rating;
                return matchesCategory && matchesLocation && matchesRating;
            });

            displayItems('items-section', filteredItems);

            // Reapply event listeners to new cards
            const newCards = document.querySelectorAll('.item-card');
            newCards.forEach(card => {
                card.addEventListener('click', () => handleCardClick(card));
            });

            // Close the filter modal
            filterModal.style.display = "none";
            // Card selection functionality
            const cards = document.querySelectorAll('.item-card');
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    if (card === selectedCard) {
                        // If the clicked card is already selected, deselect it
                        card.classList.remove('selected');
                        selectedCard = null;
                        addButton.classList.add('disabled');
                    } else {
                        // If a different card is clicked, select it
                        if (selectedCard) {
                            selectedCard.classList.remove('selected');
                        }
                        card.classList.add('selected');
                        selectedCard = card;
                        addButton.classList.remove('disabled');
                    }
                });
            });
        }
    }
});
