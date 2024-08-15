const messages = [
    { tradeId: 1, content: "אחלה עסקה, האם זמין מידית", sender: "me" },
    { tradeId: 1, content: "בוודאי, מחר ב-9:00 אצלי?", sender: "other" },
    { tradeId: 1, content: "לא הבנתי", sender: "me" },
    { tradeId: 1, content: "מה?", sender: "other" }
    // Add more messages here
];

let ratingSelected = false;
let statusSelected = false;

function displayMessages(tradeId) {
    const messagesList = document.querySelector(".messages-list");
    messagesList.innerHTML = ''; // Clear existing messages
    const tradeMessages = messages.filter(message => message.tradeId === tradeId);

    tradeMessages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", message.sender);
        messageDiv.innerHTML = `<strong>${message.sender === 'me' ? 'אני' : 'אחר'}:</strong> ${message.content}`;
        messagesList.appendChild(messageDiv);
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
            // You can save the rating value to the backend or localStorage here
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

function handleConfirm() {
    const confirmImage = document.getElementById('confirm-image');
    confirmImage.addEventListener('click', () => {
        if (confirmImage.classList.contains('enabled')) {
            const filledStars = document.querySelectorAll('.star.filled');
            if (filledStars.length > 0) {
                const rating = filledStars[filledStars.length - 1].getAttribute('data-value');
                const status = document.getElementById('confirm-button').classList.contains('confirmed') ? 'confirmed' : 'canceled';
                console.log(`Saving trade status: ${status} and rating: ${rating}`);
                // Save the status and rating to the backend or localStorage here
                // Redirect to my_trades page
                window.location.href = '../my_trades/my_trades.html';
            } else {
                console.error('No rating selected.');
            }
        }
    });
}

function handleSendMessage(tradeId) {
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    sendMessageButton.addEventListener('click', () => {
        const messageContent = messageInput.value.trim();
        if (messageContent !== '') {
            const newMessage = { tradeId, content: messageContent, sender: "me" };
            messages.push(newMessage);
            displayMessages(tradeId);
            messageInput.value = ''; // Clear the input
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const selectedTradeId = localStorage.getItem('selectedTradeId');
    if (selectedTradeId) {
        displayMessages(parseInt(selectedTradeId, 10));
        handleRatingSelection(false); // Initially disable star rating
        handleStatusUpdate();
        handleConfirm();
        handleSendMessage(parseInt(selectedTradeId, 10));
    }
});
