// app.js
const API_BASE = 'http://localhost:8081/api';

// Cart ID storage
let cartId = localStorage.getItem('cartId');

// Initialize cart on first load
async function initCart() {
    if (!cartId) {
        try {
            const response = await fetch(`${API_BASE}/cart`, {
                method: 'POST'
            });
            const cart = await response.json();
            cartId = cart.id;
            localStorage.setItem('cartId', cartId);
        } catch (error) {
            console.error('Error creating cart:', error);
        }
    }
}

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Image mapping for products
const productImages = {
    'Fresh Apples': 'https://images.unsplash.com/photo-1669295418566-f9833417f330?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Milk': 'https://images.unsplash.com/photo-1596151163116-98a5033814c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Whole Wheat Bread': 'https://images.unsplash.com/photo-1565181917578-a87c12e04ff7?q=80&w=2136&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Farm Eggs': 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Chicken Breast': 'https://images.unsplash.com/photo-1682991136736-a2b44623eeba?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Basmati Rice': 'https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Fresh Tomatoes': 'https://images.unsplash.com/photo-1640958905248-fb819ea1bc6b?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Potatoes': 'https://plus.unsplash.com/premium_photo-1724256032008-171384da9b89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Onions': 'https://images.unsplash.com/photo-1585849834908-3481231155e8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Carrots': 'https://plus.unsplash.com/premium_photo-1724849305127-341834a5ce14?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Greek Yogurt': 'https://images.unsplash.com/photo-1633893215271-f7e1fca081ad?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Butter': 'https://plus.unsplash.com/premium_photo-1700887568611-b26d190c04f0?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Cheddar Cheese': 'https://images.unsplash.com/photo-1654513547430-973fe7570159?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Orange Juice': 'https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Green Grapes': 'https://images.unsplash.com/photo-1725195398648-f3454b552b20?q=80&w=1706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Strawberries': 'https://plus.unsplash.com/premium_photo-1724256148329-3144ccee93fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Broccoli': 'https://plus.unsplash.com/premium_photo-1724250161295-ccb9c5f4f63d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Spinach': 'https://images.unsplash.com/photo-1578367622663-5b44691c3493?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Cucumber': 'https://images.unsplash.com/photo-1737945203617-f4fceb8ef475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Corn Flakes': 'https://images.unsplash.com/photo-1592058051424-93c594479fcc?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Oatmeal': 'https://images.unsplash.com/photo-1502747220144-846486e80891?q=80&w=1712&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Pasta': 'https://images.unsplash.com/photo-1676300184847-4ee4030409c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Olive Oil': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pinch-of-health.com%2Fwp-content%2Fuploads%2Folive-oil-bottle-on-a-rustic-wooden-table-in-a-tuscan-village.jpg&f=1&nofb=1&ipt=111cd7026e3cda97388bb50b84c273a8e8b09d13f3ab451ec1371bd6c2acabb6',
    'Sugar': 'https://images.unsplash.com/photo-1641679103706-fc8542e2a97a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Salt': 'https://images.unsplash.com/photo-1634612831148-03a8550e1d52?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Tea Bags': 'https://plus.unsplash.com/premium_photo-1762875982822-595b761245bc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg0fHx8ZW58MHx8fHx8',
    'Coffee': 'https://plus.unsplash.com/premium_photo-1725551070322-e2900c896111?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8',
    'Potato Chips': 'https://images.unsplash.com/photo-1647764430080-6000fbe7efee?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Cookies': 'https://images.unsplash.com/photo-1639779238456-92db5e070a03?q=80&w=1672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

// Get product image based on product name
function getProductIcon(name) {
    if (!name) return '';

    // Check if we have a predefined image for this product
    let imageUrl = productImages[name];

    // If the image is not set yet, return a simple placeholder or emoji
    if (!imageUrl || imageUrl.includes('YOUR_ID_HERE')) {
        return '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eee; color:#999;">No Image</div>';
    }

    return `<img src="${imageUrl}" alt="${name}" class="product-img-element">`;
}

// Load products from API
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const response = await fetch(`${API_BASE}/products`);
        let products = await response.json();

        // Check for search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            products = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query)) ||
                (product.category && product.category.toLowerCase().includes(query))
            );
        }

        if (products.length === 0) {
            grid.innerHTML = '<div class="empty-cart"><h2>No products available</h2><p>Add products using the API to see them here.</p></div>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">${getProductIcon(product.name)}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description || 'No description available'}</div>
                    <div class="product-category">${product.category || 'General'}</div>
                    <div class="product-price">₹ ${product.price ? product.price.toFixed(0) : '0'}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        grid.innerHTML = '<div class="empty-cart"><h2>Error loading products</h2><p>Make sure the backend is running.</p></div>';
    }
}

// Add product to cart
async function addToCart(productId, productName, price) {
    await initCart();

    try {
        const response = await fetch(`${API_BASE}/cart/${cartId}/add?productId=${productId}&quantity=1`, {
            method: 'POST'
        });

        if (response.ok) {
            showToast(`✅ ${productName} added to cart!`);
        } else {
            showToast('Error adding to cart', true);
        }
    } catch (error) {
        showToast('Error adding to cart', true);
    }
}

// Load cart items
async function loadCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    await initCart();

    container.innerHTML = '<div class="loading">Loading cart...</div>';

    try {
        const response = await fetch(`${API_BASE}/cart/${cartId}`);
        const cart = await response.json();

        if (!cart.items || cart.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <h2>🛒 Your cart is empty</h2>
                    <p>Browse our products and add items to your cart!</p>
                    <a href="products.html" class="checkout-btn" style="margin: 1rem auto;">Shop Now</a>
                </div>
            `;
            document.getElementById('cart-total').textContent = '₹ 0';
            return;
        }

        let total = 0;
        container.innerHTML = cart.items.map(item => {
            const price = item.product?.price || 0;
            const quantity = item.quantity || 1;
            const itemTotal = price * quantity;
            total += itemTotal;
            const icon = getProductIcon(item.product?.name || '');

            return `
                <div class="cart-item">
                    <div class="cart-item-image">${icon}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.product?.name || 'Product'}</div>
                        <div class="cart-item-price">₹ ${price.toFixed(0)} each</div>
                    </div>
                    <div class="quantity-controls">
                        <span>Qty: ${quantity}</span>
                    </div>
                    <div class="cart-item-price">₹ ${itemTotal.toFixed(0)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
        }).join('');

        document.getElementById('cart-total').textContent = `₹ ${total.toFixed(0)}`;
    } catch (error) {
        container.innerHTML = '<div class="empty-cart"><h2>Error loading cart</h2></div>';
    }
}

// Remove item from cart
async function removeFromCart(itemId) {
    try {
        const response = await fetch(`${API_BASE}/cart/${cartId}/item/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Item removed from cart');
            loadCart();
        } else {
            showToast('Error removing item', true);
        }
    } catch (error) {
        showToast('Error removing item', true);
    }
}

// Load orders
async function loadOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading orders...</div>';

    try {
        const response = await fetch(`${API_BASE}/orders`);
        const orders = await response.json();

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-orders">
                    <h2>📦 No orders yet</h2>
                    <p>Complete a checkout to see your orders here!</p>
                    <a href="products.html" class="checkout-btn" style="margin: 1rem auto;">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-status status-completed">Completed</span>
                </div>
                <div class="order-items">
                    ${order.items ? order.items.map(item => `
                        <div class="order-item">
                            <span>${getProductIcon(item.product?.name || '')} ${item.product?.name || 'Product'} x${item.quantity}</span>
                            <span>₹ ${(item.price || 0).toFixed(0)}</span>
                        </div>
                    `).join('') : '<div class="order-item">No items</div>'}
                </div>
                <div class="order-total">Total: ₹ ${(order.totalAmount || 0).toFixed(0)}</div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="empty-orders"><h2>Error loading orders</h2></div>';
    }
}

// Checkout
async function checkout() {
    await initCart();

    try {
        const response = await fetch(`${API_BASE}/orders/checkout/${cartId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showToast('✅ Order placed successfully!');
            // Clear cart
            localStorage.removeItem('cartId');
            cartId = null;
            // Create new cart
            await initCart();
            // Reload cart page
            setTimeout(() => window.location.href = 'orders.html', 1000);
        } else {
            showToast('Error placing order', true);
        }
    } catch (error) {
        showToast('Error placing order', true);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initChatWidget();
});

// Chat Widget Logic
function initChatWidget() {
    const chatHTML = `
        <div class="chat-widget">
            <button class="chat-toggle" id="chatToggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <span>GreenCrate Assistant</span>
                    <button class="chat-close" id="chatClose">✖</button>
                </div>
                
                <!-- User Intake Form -->
                <div id="chatIntakeForm" class="chat-intake-form">
                    <p style="text-align: center; margin-bottom: 1rem; color: #555;">Please share a few details to get started.</p>
                    <form id="userDataForm">
                        <input type="email" id="userEmail" class="chat-form-input" placeholder="Your Email" required>
                        <select id="userAgeGroup" class="chat-form-input" required>
                            <option value="">Select Age Group</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45+">45+</option>
                        </select>
                        <select id="userCategory" class="chat-form-input" required>
                            <option value="">Preferred Category</option>
                            <option value="fruits">Fruits & Veggies</option>
                            <option value="dairy">Dairy & Eggs</option>
                            <option value="snacks">Snacks & Beverages</option>
                            <option value="meat">Meat & Seafood</option>
                        </select>
                        <select id="userBudget" class="chat-form-input" required>
                            <option value="">Average Budget</option>
                            <option value="low">Under ₹500</option>
                            <option value="medium">₹500 - ₹2000</option>
                            <option value="high">Above ₹2000</option>
                        </select>
                        <input type="text" id="userInterests" class="chat-form-input" placeholder="Shopping Interests (e.g. Organic)">
                        <button type="submit" class="chat-form-submit">Start Chat</button>
                    </form>
                </div>

                <!-- Chat Interface (Hidden initially) -->
                <div id="chatInterface" class="chat-interface" style="display: none;">
                    <div class="chat-messages" id="chatMessages">
                        <div class="chat-message bot">Hi there! I'm your GreenCrate shopping assistant. How can I help you today?</div>
                    </div>
                    <div class="chat-suggestions" id="chatSuggestions">
                        <button class="suggestion-btn">Hi / Hello 👋</button>
                        <button class="suggestion-btn">What should I eat? 🤔</button>
                        <button class="suggestion-btn">Healthy options 🥗</button>
                        <button class="suggestion-btn">Fast delivery 🚚</button>
                        <button class="suggestion-btn">Any discounts? 💰</button>
                        <button class="suggestion-btn">Suggest me 💡</button>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                        <button class="chat-send" id="chatSend">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatToggle = document.getElementById('chatToggle');
    const chatClose = document.getElementById('chatClose');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    const chatIntakeForm = document.getElementById('chatIntakeForm');
    const userDataForm = document.getElementById('userDataForm');
    const chatInterface = document.getElementById('chatInterface');

    let collectedUserData = null;

    userDataForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect data
        collectedUserData = {
            email: document.getElementById('userEmail').value,
            ageGroup: document.getElementById('userAgeGroup').value,
            category: document.getElementById('userCategory').value,
            budget: document.getElementById('userBudget').value,
            interests: document.getElementById('userInterests').value
        };

        // This is where you would normally send the data to a backend API for analysis
        console.log("User Data Collected for Analysis:", collectedUserData);
        
        // Save email to localStorage for the feedback page
        localStorage.setItem('chatUserEmail', collectedUserData.email);

        // Hide intake form and show chat interface
        chatIntakeForm.style.display = 'none';
        chatInterface.style.display = 'flex';

        // Focus on chat input
        chatInput.focus();

        // Send an auto-message suggesting feedback
        setTimeout(() => {
            appendMessage('bot', 'Thanks for the details! By the way, we value your opinion. You can <a href="feedback.html" style="color: var(--primary); text-decoration: underline;">leave us feedback here</a> any time.');
        }, 1000);
    });

    function toggleChat() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);

    const suggestions = document.querySelectorAll('.suggestion-btn');
    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.textContent;
            sendMessage();
        });
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        appendMessage('user', text);
        chatInput.value = '';

        // Add loading indicator
        const loadingId = addTypingIndicator();

        try {
            const requestBody = { message: text };
            if (collectedUserData) {
                requestBody.user_data = collectedUserData;
            }

            const response = await fetch('http://localhost:5001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            removeMessage(loadingId);
            appendMessage('bot', data.reply);
        } catch (error) {
            removeMessage(loadingId);
            appendMessage('bot', "Sorry, I'm having trouble connecting right now.");
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;

        // Convert URLs to links and handle basic markdown-like bullet points
        let formattedText = text.replace(/\n/g, '<br>');
        msgDiv.innerHTML = formattedText;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}