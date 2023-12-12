const apiKey = 'OXLFREL48LCJ4HK6';
const stockSymbol = 'GAME';

const stockPriceElement = document.getElementById('stock-price');
const updateCounterElement = document.getElementById('update-counter');
const notificationElement = document.getElementById('notification');
const yahooButton = document.getElementById('yahoo-button');
const updateButton = document.getElementById('update-button');

let updateCounter = 0;
const maxUpdatesPerDay = 25;

function updateCounterDisplay() {
    updateCounterElement.textContent = `Updates today: ${updateCounter}`;
}

function fetchStockPrice() {
    if (updateCounter >= maxUpdatesPerDay) {
        console.log('Maximum updates per day reached. Stopping updates.');
        return;
    }

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const globalQuote = data['Global Quote'];
            if (globalQuote && globalQuote['05. price']) {
                const stockPrice = parseFloat(globalQuote['05. price']);
                stockPriceElement.textContent = `Stock Price: $${stockPrice.toFixed(2)}`;

                if (stockPrice > 2) {
                    hideNotification();
                } else {
                    showNotification('Go buy more stock!');
                }

                updateCounter++;
                updateCounterDisplay();

                if (updateCounter >= maxUpdatesPerDay) {
                    console.log('Maximum updates per day reached. Stopping updates.');
                }
            } else {
                throw new Error('Invalid response format from API');
            }
        })
        .catch(error => {
            console.error('Error fetching stock price:', error);
            stockPriceElement.textContent = 'Error loading stock price';
        });
}

function showNotification(message) {
    notificationElement.textContent = message;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    notificationElement.style.display = 'none';
}

yahooButton.addEventListener('click', () => {
    window.open('https://finance.yahoo.com/quote/GAME', '_blank');
});

updateButton.addEventListener('click', () => {
    fetchStockPrice();
});

fetchStockPrice();

setInterval(fetchStockPrice, 5000);
