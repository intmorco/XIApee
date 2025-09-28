import { Header } from '/components/header.js';
import { globalCart } from '/components/cart.js';

// Initialize header
Header();

// Will be populated from /data/db.json
let db = null;

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
// Vendor info elements
const vendorInfoBox = document.getElementById('vendor-info');
const vendorNameEl = document.getElementById('vendor-name');
const vendorCategoryEl = document.getElementById('vendor-category');
const vendorLocationEl = document.getElementById('vendor-location');
const vendorDescEl = document.getElementById('vendor-desc');
const vendorLinkEl = document.getElementById('vendor-link');
// Mini cart elements
const miniItems = document.getElementById('cart-items-mini');
const miniSubtotal = document.getElementById('mini-subtotal');
const miniDelivery = document.getElementById('mini-delivery');
const miniTotal = document.getElementById('mini-total');

// State
let currentProduct = null;
let selectedAddons = [];
let quantity = 1;
let currentVendor = null; // { vendorType, vendorId, vendorName, vendorLocation, cuisine/category }

// Get product from URL parameters
function getParams() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const vendorType = params.get('type') || params.get('vendor') || '';
    const vendorId = params.get('vendorId') || params.get('vendor') || '';
    return { productId, vendorType, vendorId };
}

// Render product details
function renderProduct(product) {
    currentProduct = product;
    
    // Update page title
    document.title = `${product.name} | XIApee`;
    productTitle.textContent = product.name;
    
    // Update product details
    if (product.image) {
        productImage.style.backgroundImage = `url(${product.image})`;
        productImage.style.backgroundSize = 'cover';
        productImage.style.backgroundPosition = 'center';
        productImage.textContent = '';
    } else {
        productImage.textContent = product.icon || '🍽️';
    }
    productName.textContent = product.name;
    productCategory.textContent = (product.category || currentVendor?.cuisine || 'General');
    productPrice.textContent = `RM ${Number(product.price).toFixed(2)}`;
    
    // Generate description based on product
    productDescription.textContent = product.description || generateProductDescription(product);
    
    // Update base price
    basePriceElement.textContent = `RM ${Number(product.price).toFixed(2)}`;
    
    // Check if product has addons
    const addons = product.addons || [];
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
            globalCart.addItem(currentProduct, selectedAddons, currentVendor || {});
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
            globalCart.addItem(currentProduct, selectedAddons, currentVendor || {});
        }
        
        // Redirect to cart page
        window.location.href = '/pages/cart/index.html';
    });
}

// Render vendor info block
function renderVendorInfo() {
    if (!currentVendor) return;
    vendorInfoBox.style.display = 'block';
    vendorNameEl.textContent = currentVendor.vendorName || 'Vendor';
    vendorCategoryEl.textContent = currentVendor.cuisine || currentVendor.category || 'General';
    vendorLocationEl.textContent = currentVendor.vendorLocation || '-';
    vendorDescEl.textContent = currentVendor.description || '';
    vendorLinkEl.href = currentVendor.vendorType === 'mart'
        ? `/pages/mart/index.html?id=${currentVendor.vendorId}`
        : `/pages/restaurant/index.html?id=${currentVendor.vendorId}`;
}

// Mini cart render
function renderMiniCart() {
    const items = globalCart.getItems();
    miniItems.innerHTML = items.map(it => `
        <div class="mini-item">
            <span>${it.icon || '🍽️'} ${it.name} × ${it.qty}</span>
            <span>RM ${(it.price * it.qty).toFixed(2)}</span>
        </div>
    `).join('') || '<div class="mini-item empty">No items yet</div>';
    const summary = globalCart.getCartSummary();
    miniSubtotal.textContent = `RM ${summary.subtotal.toFixed(2)}`;
    miniDelivery.textContent = `RM ${summary.deliveryFee.toFixed(2)}`;
    miniTotal.textContent = `RM ${summary.total.toFixed(2)}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    // Load DB
    try {
        const res = await fetch('/data/db.json');
        db = await res.json();
    } catch (e) {
        console.error('Failed to load DB', e);
    }

    const { productId, vendorType, vendorId } = getParams();
    if (!db || !productId) {
        productNotFound.style.display = 'block';
        document.querySelector('.product-content').style.display = 'none';
        return;
    }

    let vendorCollection = vendorType === 'mart' ? db.minimarts : db.restaurants;
    // If vendorId not provided, attempt to find the product across all vendors
    let product = null;
    let vendor = null;
    if (vendorId) {
        vendor = (vendorCollection || []).find(v => String(v.id) === String(vendorId));
        if (vendor) {
            product = (vendor.products || []).find(p => p.id === productId);
        }
    }
    if (!product) {
        outer: for (const v of vendorCollection || []) {
            const found = (v.products || []).find(p => p.id === productId);
            if (found) { product = found; vendor = v; break outer; }
        }
    }

    if (!product) {
        productNotFound.style.display = 'block';
        document.querySelector('.product-content').style.display = 'none';
        return;
    }

    currentVendor = vendor ? {
        vendorType: vendorType === 'mart' ? 'mart' : 'restaurant',
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorLocation: vendor.location,
        cuisine: vendor.cuisine,
        category: vendor.cuisine,
        description: vendor.description
    } : null;

    renderProduct(product);
    renderVendorInfo();
    handleQuantityControls();
    handleAddToCart();
    handleBuyNow();

    // Listen to cart updates
    globalCart.addListener(renderMiniCart);
    renderMiniCart();
});
