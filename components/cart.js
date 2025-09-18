// components/cart.js
export function createCart(containerSelector) {
    const state = {
        items: new Map(),
    };

    const container = document.querySelector(containerSelector);

    function total() {
        let t = 0;
        state.items.forEach((it) => { t += it.price * it.qty; });
        return t;
    }

    function render() {
        if (!container) return;
        const count = Array.from(state.items.values()).reduce((a, b) => a + b.qty, 0);
        container.innerHTML = `
            <div class="cart-header">
                <h3>Your Cart</h3>
                <span>${count} item${count !== 1 ? 's' : ''}</span>
            </div>
            <div class="cart-items">
                ${Array.from(state.items.values()).map(it => `
                    <div class="cart-item" data-id="${it.id}">
                        <div class="item-title">${it.name}</div>
                        <div class="item-controls">
                            <button class="qty-btn dec">-</button>
                            <span class="qty">${it.qty}</span>
                            <button class="qty-btn inc">+</button>
                            <span class="price">RM ${it.price.toFixed(2)}</span>
                            <button class="remove-btn">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-footer">
                <strong>Total: RM ${total().toFixed(2)}</strong>
                <button class="pay-btn">Ready to Pay</button>
            </div>
        `;
    }

    function addItem(product) {
        const id = product.id;
        const existing = state.items.get(id);
        if (existing) existing.qty += 1;
        else state.items.set(id, { id, name: product.name, price: Number(product.price || 0), qty: 1 });
        render();
    }

    function removeItem(id) {
        state.items.delete(id);
        render();
    }

    function changeQty(id, delta) {
        const it = state.items.get(id);
        if (!it) return;
        it.qty += delta;
        if (it.qty <= 0) state.items.delete(id);
        render();
    }

    if (container) {
        container.addEventListener('click', (e) => {
            const btn = e.target;
            const itemEl = btn.closest('.cart-item');
            if (!itemEl) return;
            const id = itemEl.getAttribute('data-id');

            if (btn.classList.contains('inc')) changeQty(id, 1);
            else if (btn.classList.contains('dec')) changeQty(id, -1);
            else if (btn.classList.contains('remove-btn')) removeItem(id);
        });
    }

    render();

    return {
        addItem,
        removeItem,
        changeQty,
        getItems: () => Array.from(state.items.values()),
        getTotal: () => total(),
        render,
    };
}