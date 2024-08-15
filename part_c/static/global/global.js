function createItemCard(item, userRating, userLocation) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.ItemID;
    card.dataset.location = userLocation;
    card.dataset.ownerEmail = item.OwnerEmail;
    card.dataset.description = item.Description;
    card.dataset.category = item.Category;
    card.dataset.rating = userRating;

    const img = document.createElement('img');
    img.alt = 'Item Image';
    img.src = `/get_image/${item.Image}`;

    const p = document.createElement('p');
    p.className = 'item-rating';
    p.textContent = `#${item.ItemID} / Rating: ${userRating}`;

    card.appendChild(img);
    card.appendChild(p);

    return card;
}

function fetchUserDetails(callback) {
    fetch('/get_session_user')
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                callback(data.user);
            } else {
                console.error("User not logged in or session expired");
                callback(null);
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            callback(null);
        });
}

function fetchItems(callback) {
    fetch('/get_items')
        .then(response => response.json())
        .then(data => {
            if (data.items) {
                callback(data.items);
            } else {
                console.error("Failed to fetch items");
                callback([]);
            }
        })
        .catch(error => {
            console.error("Error fetching items:", error);
            callback([]);
        });
}

function fetchUserRatings(callback) {
    fetch('/get_user_ratings')
        .then(response => response.json())
        .then(data => {
            if (data.ratings) {
                callback(data.ratings);
            } else {
                console.error("Failed to fetch user ratings");
                callback({});
            }
        })
        .catch(error => {
            console.error("Error fetching user ratings:", error);
            callback({});
        });
}

function fetchUserByEmail(email) {
    return fetch(`/get_user_by_email/${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                return data.user;
            } else {
                console.error("Failed to fetch user by email");
                return null;
            }
        })
        .catch(error => {
            console.error("Error fetching user by email:", error);
            return null;
        });
}

async function displayItems(containerId, userEmail, itemsToDisplay, userRatings) {
    const container = document.getElementById(containerId);
    const currentHtmlname = window.location.pathname.split("/").pop();

    if (currentHtmlname.includes('home')) {
        itemsToDisplay = itemsToDisplay.filter(item => item.OwnerEmail !== userEmail);
    } else {
        itemsToDisplay = itemsToDisplay.filter(item => item.OwnerEmail === userEmail);
    }

    container.innerHTML = ""; // Clear existing items
    for (const item of itemsToDisplay) {
        const owner = await fetchUserByEmail(item.OwnerEmail);
        const userLocation = owner ? owner.Address : "";
        const userRating = userRatings[owner.Email] || 0;
        const card = createItemCard(item, userRating, userLocation);
        card.addEventListener('click', () => handleCardClick(card)); // Add event listener for card click
        container.appendChild(card);
    }
}

let selectedCard = null;

function handleCardClick(card) {
    if (card === selectedCard) {
        card.classList.remove('selected');
        selectedCard = null;
        document.getElementById('add-image').classList.add('disabled');
    } else {
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
        card.classList.add('selected');
        selectedCard = card;
        document.getElementById('add-image').classList.remove('disabled');
    }
}

function checkAndCreateTrade(selectedItem, tradedItem, userEmail) {
    const acceptedByEmail = tradedItem.OwnerEmail;
    const offeredByEmail = userEmail;

    fetch(`/check_trade_exists?item1=${selectedItem.ItemID}&item2=${tradedItem.ItemID}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert("עסקה בין הפריטים הללו כבר קיימת. ניתן לצפות בפרטים בעמוד העסקאות שלי.");
            } else {
                const tradeDetails = {
                    TradeID: '',
                    OfferedByEmail: offeredByEmail,
                    AcceptedByEmail: acceptedByEmail,
                    TradeStatus: "Pending",
                    OfferedByRating: 0, // Initialize ratings
                    AcceptedByRating: 0,
                    Items: [selectedItem.ItemID, tradedItem.ItemID]
                };

                fetch('/create_trade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tradeDetails)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const tradeAnimationContainer = document.getElementById('trade-animation-container');
                            tradeAnimationContainer.style.display = 'flex';
                            setTimeout(() => {
                                tradeAnimationContainer.style.display = 'none';
                                window.location.href = '../home';
                            }, 2000);
                        } else {
                            console.error("Failed to create trade:", data.error);
                            alert("כישלון ביצירת העסקה.");
                        }
                    })
                    .catch(error => {
                        console.error("Error creating trade:", error);
                        alert("כישלון ביצירת העסקה.");
                    });
            }
        })
        .catch(error => {
            console.error("Error checking trade existence:", error);
            alert("שגיאה בבדיקת העסקה");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetails(user => {
        const userEmail = user ? user.Email : null;
        const userLocation = user ? user.Address : null;

        fetchItems(items => {
            fetchUserRatings(userRatings => {
                const modal = document.getElementById("modal");
                const btn = document.getElementById("about-link");
                const span = document.getElementsByClassName("close-button")[0];
                const backButton = document.getElementById("back-button");
                const addButton = document.getElementById("add-image");
                const navLinks = document.querySelectorAll('.profile-info a');

                // Dynamically create and append items-section if necessary
                if (!window.location.pathname.includes('my_trades') &&
                    !window.location.pathname.includes('add_item') &&
                    !window.location.pathname.includes('view_trade') &&
                    window.location.pathname !== '/') {
                    const mainElement = document.querySelector('main');
                    const itemsSection = document.createElement('section');
                    itemsSection.id = 'items-section';
                    mainElement.appendChild(itemsSection);

                    displayItems('items-section', userEmail, items, userRatings);
                }

                navLinks.forEach(link => {
                    link.addEventListener('click', (event) => {
                        console.log(`Navigating to ${link.getAttribute('href')}`);
                    });
                });

                // Modal functionality
                if (btn) {
                    btn.onclick = function(event) {
                        event.preventDefault();
                        modal.style.display = "block";
                    }
                }

                if (span) {
                    span.onclick = function() {
                        modal.style.display = "none";
                    }
                }

                window.onclick = function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }

                // Back button functionality
                if (backButton) {
                    backButton.onclick = function() {
                        window.history.back();
                    }
                }

                // Handle Add Button Click
                if (addButton) {
                    addButton.onclick = function() {
                        if (!addButton.classList.contains('disabled')) {
                            const selectedItem = items.find(item => item.ItemID === selectedCard.dataset.id);
                            if (window.location.pathname.includes('add_trade')) {
                                const tradedItem = JSON.parse(localStorage.getItem('tradedItem'));
                                checkAndCreateTrade(selectedItem, tradedItem, userEmail);
                            } else {
                                const queryParams = new URLSearchParams(selectedItem).toString();
                                window.location.href = `../add_trade?${queryParams}`;
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

                if (ratingInput) {
                    ratingInput.addEventListener('input', function() {
                        const rating = parseFloat(this.value);
                        if (isNaN(rating) || rating < 0 || rating > 5) {
                            this.value = '';
                            alert("הכנס מספר בין 0 ל-5");
                        }
                    });
                }

                if (filterButton) {
                    filterButton.onclick = function(event) {
                        event.preventDefault();
                        filterModal.style.display = "block";
                    }
                }

                if (filterCloseButton) {
                    filterCloseButton.onclick = function() {
                        filterModal.style.display = "none";
                    }
                }

                window.onclick = function(event) {
                    if (event.target === filterModal) {
                        filterModal.style.display = "none";
                    }
                }

                if (applyFilterButton) {
                    applyFilterButton.onclick = async function() {
                        const category = document.getElementById("category").value;
                        const location = document.getElementById("location").value.trim().toLowerCase();
                        const rating = parseFloat(document.getElementById("rating").value);

                        const filteredItems = [];
                        for (const item of items) {
                            const owner = await fetchUserByEmail(item.OwnerEmail);
                            const itemLocation = owner ? owner.Address.toLowerCase() : "";
                            const userRating = userRatings[owner.Email] || 0;

                            const matchesCategory = category === "all" || item.Category === category;
                            const matchesLocation = location === "" || itemLocation.includes(location);
                            const matchesRating = isNaN(rating) || userRating >= rating;

                            if (matchesCategory && matchesLocation && matchesRating) {
                                filteredItems.push(item);
                            }
                        }

                        displayItems('items-section', userEmail, filteredItems, userRatings);

                        const newCards = document.querySelectorAll('.item-card');
                        newCards.forEach(card => {
                            card.addEventListener('click', () => handleCardClick(card));
                        });

                        filterModal.style.display = "none";
                    }
                }
            });
        });
    });
});
