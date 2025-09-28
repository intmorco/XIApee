// components/cart.js
class CartManager {
    constructor() {
        this.items = new Map();
        this.loadFromStorage();
        this.listeners = [];
    }

    // Load cart from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('xiapee_cart');
            if (stored) {
                const items = JSON.parse(stored);
                this.items = new Map(items);
            }
        } catch (e) {
            console.warn('Failed to load cart from storage:', e);
        }
    }

    // Save cart to localStorage
    saveToStorage() {
        try {
            const items = Array.from(this.items.entries());
            localStorage.setItem('xiapee_cart', JSON.stringify(items));
        } catch (e) {
            console.warn('Failed to save cart to storage:', e);
        }
    }

    // Notify all listeners of cart changes
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.getItems(), this.getTotal()));
    }

    // Add listener for cart changes
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remove listener
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) this.listeners.splice(index, 1);
    }

    // Calculate total price
    getTotal() {
        let total = 0;
        this.items.forEach((item) => {
            total += item.price * item.qty;
        });
        return total;
    }

    // Get summary: subtotal, unique vendor count, delivery fee, total
    getCartSummary() {
        const items = this.getItems();
        const subtotal = this.getTotal();
        const uniqueVendors = new Set();
        items.forEach((item) => {
            const vendorKey = item.vendorId ? `${item.vendorType || 'vendor'}:${item.vendorId}` : 'global';
            uniqueVendors.add(vendorKey);
        });
        const vendorCount = uniqueVendors.size > 0 ? uniqueVendors.size : 0;
        const deliveryFee = vendorCount * 2.0; // RM2 per unique vendor
        const total = subtotal + deliveryFee;
        return { subtotal, vendorCount, deliveryFee, total };
    }

    // Get all items as array
    getItems() {
        return Array.from(this.items.values());
    }

    // Get item count
    getItemCount() {
        return Array.from(this.items.values()).reduce((sum, item) => sum + item.qty, 0);
    }

        // Add item to cart
    addItem(product, addons = [], vendorInfo = {}) {
        const id = this.generateItemId(product, addons, vendorInfo);
        const existing = this.items.get(id);
        
        if (existing) {
            existing.qty += 1;
        } else {
            const addonPrice = addons.reduce((sum, addon) => sum + (addon.price || 0), 0);
            this.items.set(id, {
                id,
                productId: product.id,
                name: product.name,
                price: Number(product.price || 0) + addonPrice,
                qty: 1,
                addons: addons,
                icon: product.icon,
                category: product.category,
                vendorId: vendorInfo.vendorId || product.vendorId || null,
                vendorName: vendorInfo.vendorName || product.vendorName || null,
                vendorType: vendorInfo.vendorType || product.vendorType || null,
                vendorLocation: vendorInfo.vendorLocation || product.vendorLocation || null
            });
        }
        
        this.saveToStorage();
        this.notifyListeners();
    }

    // Generate unique ID for item with addons
    generateItemId(product, addons, vendorInfo = {}) {
        const addonIds = addons.map(a => a.id).sort().join(',');
        const vendorKey = vendorInfo.vendorId || product.vendorId || '';
        return `${product.id}${vendorKey ? `@${vendorKey}` : ''}${addonIds ? `_${addonIds}` : ''}`;
    }

    // Remove item from cart
    removeItem(id) {
        this.items.delete(id);
        this.saveToStorage();
        this.notifyListeners();
    }

    // Change item quantity
    changeQty(id, delta) {
        const item = this.items.get(id);
        if (!item) return;
        
        item.qty += delta;
        if (item.qty <= 0) {
            this.items.delete(id);
        }
        
        this.saveToStorage();
        this.notifyListeners();
    }

    // Set item quantity to a specific value
    updateQty(id, qty) {
        const item = this.items.get(id);
        if (!item) return;
        const newQty = Number(qty);
        if (!Number.isFinite(newQty) || newQty <= 0) {
            this.items.delete(id);
        } else {
            item.qty = Math.floor(newQty);
        }
        this.saveToStorage();
        this.notifyListeners();
    }

    // Clear entire cart
    clear() {
        this.items.clear();
        this.saveToStorage();
        this.notifyListeners();
    }
}

// Global cart instance
export const globalCart = new CartManager();

// Legacy function for backward compatibility
export function createCart(containerSelector) {
    const container = document.querySelector(containerSelector);

    function render() {
        if (!container) return;
        const items = globalCart.getItems();
        const count = globalCart.getItemCount();
        const total = globalCart.getTotal();
        
        container.innerHTML = `
            <div class="cart-header">
                <h3>Your Cart</h3>
                <span>${count} item${count !== 1 ? 's' : ''}</span>
            </div>
            <div class="cart-items">
                ${items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-title">${item.name}</div>
                        ${item.addons && item.addons.length > 0 ? `
                            <div class="item-addons">
                                ${item.addons.map(addon => `<span class="addon">+ ${addon.name}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="item-controls">
                            <button class="qty-btn dec">-</button>
                            <span class="qty">${item.qty}</span>
                            <button class="qty-btn inc">+</button>
                            <span class="price">RM ${item.price.toFixed(2)}</span>
                            <button class="remove-btn">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-footer">
                <strong>Total: RM ${total.toFixed(2)}</strong>
                <button class="pay-btn">Ready to Pay</button>
            </div>
        `;
    }

    // Listen for cart changes
    globalCart.addListener(render);
    
    // Handle cart interactions
    if (container) {
        container.addEventListener('click', (e) => {
            const btn = e.target;
            const itemEl = btn.closest('.cart-item');
            if (!itemEl) return;
            const id = itemEl.getAttribute('data-id');

            if (btn.classList.contains('inc')) globalCart.changeQty(id, 1);
            else if (btn.classList.contains('dec')) globalCart.changeQty(id, -1);
            else if (btn.classList.contains('remove-btn')) globalCart.removeItem(id);
        });
    }

    render();

    return {
        addItem: (product, addons) => globalCart.addItem(product, addons),
        removeItem: (id) => globalCart.removeItem(id),
        changeQty: (id, delta) => globalCart.changeQty(id, delta),
        getItems: () => globalCart.getItems(),
        getTotal: () => globalCart.getTotal(),
        render,
    };
}