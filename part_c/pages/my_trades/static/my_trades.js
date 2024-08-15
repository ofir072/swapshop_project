// Function to fetch item details by item ID
async function fetchItemDetails(itemID) {
    try {
        const response = await fetch(`/get_item/${itemID}`);
        const data = await response.json();
        if (data.item) {
            console.log(data.item.Image);
            return data.item.Image;
        } else {
            console.error("Failed to fetch selected item");
            return null;
        }
    } catch (error) {
        console.error("Error fetching selected item:", error);
        return null;
    }
}

async function saveTradeIdAndRedirect(tradeId) {
    try {
        const response = await fetch(`/get_trade/${tradeId}`);
        const data = await response.json();
        if (data.trade) {
            const selectedTrade = data.trade;
            const queryParams = new URLSearchParams(selectedTrade).toString();
            window.location.href = `../view_trade?${queryParams}`;
        } else {
            console.error("Trade not found:", data.error);
        }
    } catch (error) {
        console.error("Error fetching trade details:", error);
    }
}

function createHeaderRow() {
    const headerRow = document.createElement("div");
    headerRow.classList.add("trade-row");
    headerRow.innerHTML = `
        <div class="trade-cell header-cell"><strong>מזהה עסקה</strong></div>
        <div class="trade-cell header-cell"><strong>פריט שלי</strong></div>
        <div class="trade-cell header-cell"><strong>פריט מבוקש</strong></div>
        <div class="trade-cell header-cell"><strong>סטאטוס</strong></div>
        ${window.location.pathname.includes('my_trades') ? '<div class="trade-cell header-cell"><strong>לפרטים נוספים</strong></div>' : ''}
    `;
    return headerRow;
}

async function createTradeRow(trade) {
    const tradeRow = document.createElement("div");
    tradeRow.classList.add("trade-row");

    try {
        const userItemImage = await fetchItemDetails(trade.Items[0]);
        const requestedItemImage = await fetchItemDetails(trade.Items[1]);

        console.log('userItem 3:', userItemImage);
        console.log('requestedItem 3:', requestedItemImage);

        if (userItemImage && requestedItemImage) {
            tradeRow.innerHTML = `
                <div class="trade-cell">
                    <p>${trade.TradeID}</p>
                </div>
                <div class="trade-cell">
                    <img src="/get_image/${userItemImage}" alt="User Item">
                </div>
                <div class="trade-cell">
                    <img src="/get_image/${requestedItemImage}" alt="Requested Item">
                </div>
                <div class="trade-cell">
                    <p>${trade.TradeStatus}</p>
                </div>
                ${window.location.pathname.includes('my_trades') ? `
                <div class="trade-cell">
                    <a href="#" onclick="saveTradeIdAndRedirect('${trade.TradeID}')">
                        <img src="../static/png/arrow.png" alt="Details">
                    </a>
                </div>
                ` : ''}
            `;
        } else {
            tradeRow.innerHTML = `<p>Error loading item details.</p>`;
        }
    } catch (error) {
        tradeRow.innerHTML = `<p>Error loading item details.</p>`;
    }

    return tradeRow;
}

document.addEventListener("DOMContentLoaded", async function() {
    const tradeGrid = document.querySelector(".trade-grid");

    // Add header row
    const headerRow = createHeaderRow();
    tradeGrid.appendChild(headerRow);

    const currentPage = window.location.pathname.split("/").pop();
    console.log("Current page:", currentPage);

    // Fetch current user email from the session
    try {
        const response = await fetch('/get_session_user');
        const data = await response.json();
        if (data.user) {
            const currentUserEmail = data.user.Email;
            console.log("Current user email:", currentUserEmail);

            if (currentPage === 'my_trades') {
                const response = await fetch(`/get_trades/${currentUserEmail}`);
                const data = await response.json();
                if (data.trades) {
                    const userTrades = data.trades;
                    console.log("User trades:", userTrades);
                    for (const trade of userTrades) {
                        const tradeRow = await createTradeRow(trade);
                        tradeGrid.appendChild(tradeRow);
                    }
                } else {
                    console.error("Failed to fetch trades:", data.error);
                }
            } else if (currentPage === 'view_trade') {
                // Retrieve the selected item from the URL query parameters
                const urlParams = new URLSearchParams(window.location.search);
                const items = urlParams.get('Items').split(',');
                const selectedTrade = {
                    TradeID: urlParams.get('TradeID'),
                    OfferedByEmail: urlParams.get('OfferedByEmail'),
                    AcceptedByEmail: urlParams.get('AcceptedByEmail'),
                    TradeStatus: urlParams.get('TradeStatus'),
                    OfferedByRating: urlParams.get('OfferedByRating'),
                    AcceptedByRating: urlParams.get('AcceptedByRating'),
                    Items: items
                };
                console.log(selectedTrade);
                if (selectedTrade) {
                    tradeGrid.style.gridTemplateColumns = "repeat(4, 1fr)"; // Set to 4 columns for view_trade.html
                    // Populate only the selected trade for view_trade.html
                    const tradeRow = await createTradeRow(selectedTrade);
                    tradeGrid.appendChild(tradeRow);
                } else {
                    tradeGrid.innerHTML = `<p>לא נמצאו פרטי עסקה.</p>`;
                }
            }
        } else {
            console.error("Failed to fetch user details:", data.error);
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
});
