import { Header } from '/components/header.js';
import { globalCart } from '/components/cart.js';
import { sampleProducts } from '/components/product.js';

// Initialize header
Header();

// Sample addons data for restaurant products
const sampleAddons = {
    'r1-p1': [ // Nasi Lemak
        { id: 'addon-1', name: 'Extra Chicken', price: 3.00 },
        { id: 'addon-2', name: 'Extra Sambal', price: 1.00 },
        { id: 'addon-3', name: 'Fried Egg', price: 2.00 },
        { id: 'addon-4', name: 'Cucumber', price: 0.50 }
    ],
    'r1-p2': [ // Teh Tarik
        { id: 'addon-5', name: 'Extra Sweet', price: 0.00 },
        { id: 'addon-6', name: 'Less Sweet', price: 0.00 },
        { id: 'addon-7', name: 'Extra Ice', price: 0.00 }
    ],
    'r5-p1': [ // Pepperoni Pizza
        { id: 'addon-8', name: 'Extra Cheese', price: 2.50 },
        { id: 'addon-9', name: 'Extra Pepperoni', price: 3.00 },
        { id: 'addon-10', name: 'Mushrooms', price: 1.50 },
        { id: 'addon-11', name: 'Bell Peppers', price: 1.00 }
    ],
    'r6-p1': [ // Cheeseburger
        { id: 'addon-12', name: 'Extra Cheese', price: 1.50 },
        { id: 'addon-13', name: 'Bacon', price: 2.50 },
        { id: 'addon-14', name: 'Extra Patty', price: 4.00 },
        { id: 'addon-15', name: 'Avocado', price: 2.00 }
    ]
};

// DOM elements
const productTitle = document.getElementById('product-title');
const productImage = document.getElementById('product-image');
const productName = document.getElementById('product-name');
const productCategory = document.getElementById('product-category');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const addonsSection = document.getElementById('addons-section');
const addonsContainer = document.getElementById('addons-container');
const qtyDisplay = document.getElementById('qty-display');
const basePriceElement = document.getElementById('base-price');
const addonsPriceLine = document.getElementById('addons-price-line');
const addonsPriceElement = document.getElementById('addons-price');
const totalPriceElement = document.getElementById('total-price');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const buyNowBtn = document.getElementById('buy-now-btn');
const productNotFound = document.getElementById('product-not-found');

// State
let currentProduct = null;
let selectedAddons = [];
let quantity = 1;

// Get product from URL parameters
function getProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const vendorType = params.get('type'); // 'restaurant' or 'mart'
    const vendorId = params.get('vendorId');
    
    if (!productId || !vendorType || !vendorId) {
        return null;
    }
    
    const products = sampleProducts[vendorType];
    if (!products || !products[vendorId]) {
        return null;
    }
    
    return products[vendorId].find(p => p.id === productId);
}

// Render product details
function renderProduct(product) {
    currentProduct = product;
    
    // Update page title
    document.title = `${product.name} | XIApee`;
    productTitle.textContent = product.name;
    
    // Update product details
    productImage.textContent = product.icon || '🍽️';
    productName.textContent = product.name;
    productCategory.textContent = product.category || 'General';
    productPrice.textContent = `RM ${Number(product.price).toFixed(2)}`;
    
    // Generate description based on product
    productDescription.textContent = generateProductDescription(product);
    
    // Update base price
    basePriceElement.textContent = `RM ${Number(product.price).toFixed(2)}`;
    
    // Check if product has addons
    const addons = sampleAddons[product.id] || [];
    if (addons.length > 0) {
        renderAddons(addons);
        addonsSection.style.display = 'block';
    } else {
        addonsSection.style.display = 'none';
    }
    
    // Update total price
    updateTotalPrice();
}

// Generate product description
function generateProductDescription(product) {
    const descriptions = {
        'r1-p1': 'Traditional Malaysian coconut rice served with spicy sambal, crispy anchovies, roasted peanuts, and a hard-boiled egg. A perfect blend of flavors and textures.',
        'r1-p2': 'Rich and creamy Malaysian pulled tea with the perfect balance of sweetness and creaminess. Served hot or cold.',
        'r5-p1': 'Classic pepperoni pizza with our signature tomato sauce, mozzarella cheese, and premium pepperoni. Baked to perfection in our wood-fired oven.',
        'r6-p1': 'Juicy beef patty with melted cheese, fresh lettuce, tomatoes, onions, and our special sauce. Served in a toasted brioche bun.',
        'm1-p1': 'Pure, refreshing mineral water. Perfect for staying hydrated throughout the day.',
        'm1-p2': 'Fresh, soft white bread perfect for sandwiches, toast, or any meal.',
        'm1-p3': 'Farm-fresh eggs, perfect for breakfast, baking, or any recipe.'
    };
    
    return descriptions[product.id] || `Delicious ${product.name.toLowerCase()} from our ${product.category.toLowerCase()} collection. Made with fresh ingredients and prepared with care.`;
}

// Render addons
function renderAddons(addons) {
    addonsContainer.innerHTML = addons.map(addon => `
        <div class="addon-option" data-addon-id="${addon.id}">
            <div class="addon-info">
                <input type="checkbox" class="addon-checkbox" id="addon-${addon.id}" data-addon-id="${addon.id}">
                <label for="addon-${addon.id}" class="addon-name">${addon.name}</label>
            </div>
            <div class="addon-price">${addon.price > 0 ? `+RM ${addon.price.toFixed(2)}` : 'Free'}</div>
        </div>
    `).join('');
    
    // Add event listeners for addon selection
    addonsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('addon-checkbox')) {
            const addonId = e.target.getAttribute('data-addon-id');
            const addon = addons.find(a => a.id === addonId);
            const addonOption = e.target.closest('.addon-option');
            
            if (e.target.checked) {
                selectedAddons.push(addon);
                addonOption.classList.add('selected');
            } else {
                selectedAddons = selectedAddons.filter(a => a.id !== addonId);
                addonOption.classList.remove('selected');
            }
            
            updateTotalPrice();
        }
    });
}

// Update total price
function updateTotalPrice() {
    if (!currentProduct) return;
    
    const basePrice = Number(currentProduct.price);
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + (addon.price || 0), 0);
    const totalPrice = (basePrice + addonsPrice) * quantity;
    
    if (addonsPrice > 0) {
        addonsPriceLine.style.display = 'flex';
        addonsPriceElement.textContent = `RM ${addonsPrice.toFixed(2)}`;
    } else {
        addonsPriceLine.style.display = 'none';
    }
    
    totalPriceElement.textContent = `RM ${totalPrice.toFixed(2)}`;
}

// Handle quantity controls
function handleQuantityControls() {
    const qtyDec = document.getElementById('qty-dec');
    const qtyInc = document.getElementById('qty-inc');
    
    qtyDec.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            qtyDisplay.textContent = quantity;
            updateTotalPrice();
        }
    });
    
    qtyInc.addEventListener('click', () => {
        quantity++;
        qtyDisplay.textContent = quantity;
        updateTotalPrice();
    });
}

// Handle add to cart
function handleAddToCart() {
    addToCartBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        
        // Add multiple items based on quantity
        for (let i = 0; i < quantity; i++) {
            globalCart.addItem(currentProduct, selectedAddons);
        }
        
        // Show success message
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = 'Added to Cart!';
        addToCartBtn.style.background = '#28a745';
        
        setTimeout(() => {
            addToCartBtn.textContent = originalText;
            addToCartBtn.style.background = '#4a7c59';
        }, 2000);
    });
}

// Handle buy now
function handleBuyNow() {
    buyNowBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        
        // Add to cart first
        for (let i = 0; i < quantity; i++) {
            globalCart.addItem(currentProduct, selectedAddons);
        }
        
        // Redirect to cart page
        window.location.href = '/pages/cart/index.html';
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const product = getProductFromURL();
    
    if (!product) {
        productNotFound.style.display = 'block';
        document.querySelector('.product-content').style.display = 'none';
        return;
    }
    
    // Render product
    renderProduct(product);
    
    // Set up event handlers
    handleQuantityControls();
    handleAddToCart();
    handleBuyNow();
});
