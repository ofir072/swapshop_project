const trades = [
    {
        id: 1,
        userEmail: "1@1", // Added user email
        userItemImage: "../png/item_1.png",
        requestedItemImage: "../png/item_7.png",
        status: "הושלמה"
    },
    {
        id: 2,
        userEmail: "2@2", // Added user email
        userItemImage: "../png/item_4.png",
        requestedItemImage: "../png/item_8.png",
        status: "ממתינה"
    }
    // Add more trade data here
];

function saveTradeIdAndRedirect(tradeId) {
    localStorage.setItem('selectedTradeId', tradeId);
    window.location.href = '../view_trade/view_trade.html';
}

function createHeaderRow() {
    const headerRow = document.createElement("div");
    headerRow.classList.add("trade-row");
    headerRow.innerHTML = `
        <div class="trade-cell header-cell"><strong>מזהה עסקה</strong></div>
        <div class="trade-cell header-cell"><strong>פריט שלי</strong></div>
        <div class="trade-cell header-cell"><strong>פריט מבוקש</strong></div>
        <div class="trade-cell header-cell"><strong>סטאטוס</strong></div>
        ${window.location.pathname.includes('my_trades.html') ? '<div class="trade-cell header-cell"><strong>לפרטים נוספים</strong></div>' : ''}
    `;
    return headerRow;
}

function createTradeRow(trade) {
    const tradeRow = document.createElement("div");
    tradeRow.classList.add("trade-row");

    tradeRow.innerHTML = `
        <div class="trade-cell">
            <p>${trade.id}</p>
        </div>
        <div class="trade-cell">
            <img src="${trade.userItemImage}" alt="User Item">
        </div>
        <div class="trade-cell">
            <img src="${trade.requestedItemImage}" alt="Requested Item">
        </div>
        <div class="trade-cell">
            <p>${trade.status}</p>
        </div>
        ${window.location.pathname.includes('my_trades.html') ? `
        <div class="trade-cell">
            <a href="#" onclick="saveTradeIdAndRedirect(${trade.id})">
                <img src="../png/arrow.png" alt="Details">
            </a>
        </div>
        ` : ''}
    `;

    return tradeRow;
}

document.addEventListener("DOMContentLoaded", function() {
    const tradeGrid = document.querySelector(".trade-grid");

    // Add header row
    const headerRow = createHeaderRow();
    tradeGrid.appendChild(headerRow);

    const currentPage = window.location.pathname.split("/").pop();

    // Retrieve current user email from local storage
    const currentUser = JSON.parse(localStorage.getItem('userDetails'));
    const currentUserEmail = currentUser ? currentUser.email : null;

    if (currentPage === 'my_trades.html') {
        // Populate only the trades for the current user
        const userTrades = trades.filter(trade => trade.userEmail === currentUserEmail);
        userTrades.forEach(trade => {
            const tradeRow = createTradeRow(trade);
            tradeGrid.appendChild(tradeRow);
        });
    } else if (currentPage === 'view_trade.html') {
        // Retrieve selected trade ID from localStorage
        const selectedTradeId = localStorage.getItem('selectedTradeId');
        const selectedTrade = trades.find(trade => trade.id == selectedTradeId);

        if (selectedTrade) {
            tradeGrid.style.gridTemplateColumns = "repeat(4, 1fr)"; // Set to 4 columns for view_trade.html
            // Populate only the selected trade for view_trade.html
            const tradeRow = createTradeRow(selectedTrade);
            tradeGrid.appendChild(tradeRow);
        } else {
            tradeGrid.innerHTML = `<p>לא נמצאו פרטי עסקה.</p>`;
        }
    }
});
