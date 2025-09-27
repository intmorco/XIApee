import { Header } from '/components/header.js';
import { globalCart } from '/components/cart.js';

// Initialize header
Header();

// DOM elements
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCart = document.getElementById('empty-cart');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

const DELIVERY_FEE = 2.50;

// Render cart items
function renderCartItems() {
    const items = globalCart.getItems();
    const subtotal = globalCart.getTotal();
    const total = subtotal + DELIVERY_FEE;
    
    if (items.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.style.display = 'block';
        emptyCart.style.display = 'none';
        checkoutBtn.disabled = false;
        
        cartItemsContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-icon">${item.icon || '🍽️'}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${item.addons && item.addons.length > 0 ? `
                        <div class="cart-item-addons">
                            ${item.addons.map(addon => `<span class="cart-item-addon">+ ${addon.name}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="cart-item-category">${item.category || 'General'}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn dec">-</button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn inc">+</button>
                    </div>
                    <button class="remove-item-btn">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update summary
    subtotalElement.textContent = `RM ${subtotal.toFixed(2)}`;
    totalElement.textContent = `RM ${total.toFixed(2)}`;
}

// Handle cart interactions
function handleCartInteractions() {
    cartItemsContainer.addEventListener('click', (e) => {
        const btn = e.target;
        const itemEl = btn.closest('.cart-item');
        if (!itemEl) return;
        
        const id = itemEl.getAttribute('data-id');
        
        if (btn.classList.contains('inc')) {
            globalCart.changeQty(id, 1);
        } else if (btn.classList.contains('dec')) {
            globalCart.changeQty(id, -1);
        } else if (btn.classList.contains('remove-item-btn')) {
            if (confirm('Are you sure you want to remove this item?')) {
                globalCart.removeItem(id);
            }
        }
    });
}

// Handle checkout
function handleCheckout() {
    checkoutBtn.addEventListener('click', () => {
        const items = globalCart.getItems();
        if (items.length === 0) return;
        
        // For now, just show an alert. In a real app, this would redirect to payment
        const total = globalCart.getTotal() + DELIVERY_FEE;
        alert(`Checkout functionality would be implemented here.\nTotal: RM ${total.toFixed(2)}`);
    });
}

// Handle clear cart
function handleClearCart() {
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            globalCart.clear();
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Listen for cart changes
    globalCart.addListener(renderCartItems);
    
    // Set up event handlers
    handleCartInteractions();
    handleCheckout();
    handleClearCart();
    
    // Initial render
    renderCartItems();
});
