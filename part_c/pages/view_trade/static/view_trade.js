let ratingSelected = false;
let statusSelected = false;

async function fetchMessages(tradeId) {
    try {
        const response = await fetch(`/get_messages/${tradeId}`);
        const data = await response.json();
        if (data.messages) {
            return data.messages;
        } else {
            console.error("Failed to fetch messages");
            return [];
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

function displayMessages(messages, currentUserEmail) {
    const messagesList = document.querySelector(".messages-list");
    messagesList.innerHTML = ''; // Clear existing messages

    messages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", message.SenderEmail === currentUserEmail ? 'me' : 'other');
        messageDiv.innerHTML = `<strong>${message.SenderEmail === currentUserEmail ? 'אני' : 'אחר'}:</strong> ${message.Content}`;
        messagesList.appendChild(messageDiv);
    });
}

async function handleSendMessage(tradeId, currentUserEmail) {
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    sendMessageButton.addEventListener('click', async () => {
        const messageContent = messageInput.value.trim();
        if (messageContent !== '') {
            const response = await fetch('/add_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    TradeID: tradeId,
                    Content: messageContent,
                    SenderEmail: currentUserEmail
                })
            });

            const data = await response.json();
            if (data.success) {
                messageInput.value = ''; // Clear the input
                const messages = await fetchMessages(tradeId);
                displayMessages(messages, currentUserEmail);
            } else {
                console.error("Failed to send message:", data.error);
            }
        }
    });
}

function handleRatingSelection(enabled) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.onclick = () => {
            if (!enabled) return; // Prevent clicking if not enabled
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
            ratingSelected = true;
            updateConfirmImageState();
            const rating = star.getAttribute('data-value');
            console.log(`Selected rating: ${rating}`);
        };
    });
}

function resetStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('filled'));
    ratingSelected = false;
}

function updateConfirmImageState() {
    const confirmImage = document.getElementById('confirm-image');
    if (statusSelected && ratingSelected) {
        confirmImage.classList.remove('disabled');
        confirmImage.classList.add('enabled');
    } else {
        confirmImage.classList.add('disabled');
        confirmImage.classList.remove('enabled');
    }
}

function handleStatusUpdate() {
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');

    confirmButton.addEventListener('click', () => {
        if (confirmButton.classList.contains('confirmed')) {
            confirmButton.classList.remove('confirmed');
            statusSelected = false;
            handleRatingSelection(false); // Disable star rating
            resetStars(); // Reset stars
            console.log('Confirmation undone');
        } else {
            confirmButton.classList.add('confirmed');
            cancelButton.classList.remove('canceled');
            statusSelected = true;
            handleRatingSelection(true); // Enable star rating
            console.log('Status confirmed');
        }
        updateConfirmImageState();
    });

    cancelButton.addEventListener('click', () => {
        if (cancelButton.classList.contains('canceled')) {
            cancelButton.classList.remove('canceled');
            statusSelected = false;
            handleRatingSelection(false); // Disable star rating
            resetStars(); // Reset stars
            console.log('Cancellation undone');
        } else {
            cancelButton.classList.add('canceled');
            confirmButton.classList.remove('confirmed');
            statusSelected = true;
            handleRatingSelection(true); // Enable star rating
            console.log('Status canceled');
        }
        updateConfirmImageState();
    });
}
async function updateTradeStatus(tradeId, status, rating, userEmail) {
    try {
        const response = await fetch('/update_trade_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TradeID: tradeId,
                TradeStatus: status,
                Rating: rating,
                SenderEmail: userEmail
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            console.log(`Trade status: ${status} and rating: ${rating} saved successfully.`);
            window.location.href = '../my_trades';
        } else {
            console.error("Failed to save trade status and rating:", data.error);
        }
    } catch (error) {
        console.error('Error updating trade status:', error);
    }
}

function handleConfirm(tradeId, currentUserEmail) {
    const confirmImage = document.getElementById('confirm-image');
    confirmImage.addEventListener('click', async () => {
        if (confirmImage.classList.contains('enabled')) {
            const filledStars = document.querySelectorAll('.star.filled');
            if (filledStars.length > 0) {
                const rating = filledStars[filledStars.length - 1].getAttribute('data-value');
                let status = document.getElementById('confirm-button').classList.contains('confirmed') ? 'Confirmed' : 'Canceled';
                status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // Capitalize first letter

                await updateTradeStatus(tradeId, status, rating, currentUserEmail);
            } else {
                console.error('No rating selected.');
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tradeId = urlParams.get('TradeID');

    const sessionResponse = await fetch('/get_session_user');
    const sessionData = await sessionResponse.json();

    if (sessionData.user) {
        const currentUserEmail = sessionData.user.Email;

        if (tradeId) {
            const messages = await fetchMessages(tradeId);
            displayMessages(messages, currentUserEmail);
            handleSendMessage(tradeId, currentUserEmail);
        } else {
            console.error("No TradeID found in the URL query parameters");
        }

        handleRatingSelection(false); // Initially disable star rating
        handleStatusUpdate();
        handleConfirm(tradeId, currentUserEmail);
    } else {
        console.error("User not logged in or session expired");
    }
});
