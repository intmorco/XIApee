export function ProductCard(product, onAdd) {
    const card = document.createElement('div');
    const img = document.createElement('div');
    const content = document.createElement('div');
    const name = document.createElement('div');
    const meta = document.createElement('div');
    const price = document.createElement('span');
    const addBtn = document.createElement('button');

    card.classList.add('restaurant-card');
    img.classList.add('card-image');
    content.classList.add('card-content');
    name.classList.add('restaurant-name');
    meta.classList.add('restaurant-meta');

    img.innerHTML = product.icon || "🍽️";
    name.innerHTML = product.name || "Product";
    price.innerHTML = `RM ${Number(product.price || 0).toFixed(2)}`;

    addBtn.textContent = "Add";
    addBtn.className = "add-btn";

    card.append(img, content);
    content.append(name, meta, addBtn);
    meta.append(price);

    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof onAdd === 'function') onAdd(product);
    });

    // Add click event to navigate to product detail page
    card.addEventListener('click', (e) => {
        if (e.target === addBtn) return; // Don't navigate if clicking add button
        
        // Get vendor info from URL or context
        const currentPath = window.location.pathname;
        let vendorType = 'restaurant';
        let vendorId = '1';
        
        if (currentPath.includes('/mart/')) {
            vendorType = 'mart';
            const urlParams = new URLSearchParams(window.location.search);
            vendorId = urlParams.get('id') || '1';
        } else if (currentPath.includes('/restaurant/')) {
            vendorType = 'restaurant';
            const urlParams = new URLSearchParams(window.location.search);
            vendorId = urlParams.get('id') || '1';
        }
        
        // Navigate to product page
        window.location.href = `/pages/product/index.html?id=${product.id}&type=${vendorType}&vendorId=${vendorId}`;
    });

    return card;
}

// Sample products for detail pages, grouped by vendor (restaurant/mart) id
export const sampleProducts = {
    restaurant: {
        1: [
            { id: 'r1-p1', name: 'Nasi Lemak', price: 8.50, category: 'Asian', icon: '🍛' },
            { id: 'r1-p2', name: 'Teh Tarik', price: 3.00, category: 'Drinks', icon: '🥤' },
            { id: 'r1-p3', name: 'Roti Canai', price: 4.00, category: 'Asian', icon: '🥙' },
            { id: 'r1-p4', name: 'Cendol', price: 5.50, category: 'Desserts', icon: '🍨' },
        ],
        2: [
            { id: 'r2-p1', name: 'Mee Goreng', price: 9.20, category: 'Asian', icon: '🍜' },
            { id: 'r2-p2', name: 'Teh O Ais', price: 2.80, category: 'Drinks', icon: '🥤' },
            { id: 'r2-p3', name: 'Kaya Toast', price: 4.50, category: 'Desserts', icon: '🍞' },
        ],
        3: [
            { id: 'r3-p1', name: 'Salmon Nigiri', price: 12.00, category: 'Asian', icon: '🍣' },
            { id: 'r3-p2', name: 'Miso Soup', price: 4.20, category: 'Asian', icon: '🥣' },
            { id: 'r3-p3', name: 'Green Tea', price: 3.50, category: 'Drinks', icon: '🍵' },
        ],
        4: [
            { id: 'r4-p1', name: 'Ayam Geprek', price: 11.50, category: 'Asian', icon: '🍗' },
            { id: 'r4-p2', name: 'Es Teh', price: 2.50, category: 'Drinks', icon: '🧊' },
        ],
        5: [
            { id: 'r5-p1', name: 'Pepperoni Pizza', price: 15.90, category: 'Western', icon: '🍕' },
            { id: 'r5-p2', name: 'Mushroom Pizza', price: 14.50, category: 'Western', icon: '🍕' },
            { id: 'r5-p3', name: 'Soft Drink', price: 3.20, category: 'Drinks', icon: '🥤' },
        ],
        6: [
            { id: 'r6-p1', name: 'Cheeseburger', price: 10.50, category: 'Western', icon: '🍔' },
            { id: 'r6-p2', name: 'Fries', price: 4.00, category: 'Western', icon: '🍟' },
            { id: 'r6-p3', name: 'Vanilla Shake', price: 6.20, category: 'Desserts', icon: '🥤' },
        ],
    },
    mart: {
        1: [
            { id: 'm1-p1', name: 'Mineral Water', price: 1.80, category: 'Beverages', icon: '🥤' },
            { id: 'm1-p2', name: 'Bread', price: 3.50, category: 'Groceries', icon: '🍞' },
            { id: 'm1-p3', name: 'Eggs (6)', price: 5.20, category: 'Groceries', icon: '🥚' },
        ],
        2: [
            { id: 'm2-p1', name: 'Orange Juice', price: 4.50, category: 'Beverages', icon: '🧃' },
            { id: 'm2-p2', name: 'Bananas (1kg)', price: 6.90, category: 'Groceries', icon: '🍌' },
        ],
        3: [
            { id: 'm3-p1', name: 'Shampoo', price: 12.90, category: 'Health & Beauty', icon: '🧴' },
            { id: 'm3-p2', name: 'Toothpaste', price: 7.50, category: 'Health & Beauty', icon: '🪥' },
        ],
        4: [
            { id: 'm4-p1', name: 'Lipstick', price: 18.90, category: 'Health & Beauty', icon: '💄' },
        ],
        5: [
            { id: 'm5-p1', name: 'USB-C Cable', price: 9.90, category: 'Electronics', icon: '🔌' },
            { id: 'm5-p2', name: 'Power Bank', price: 49.90, category: 'Electronics', icon: '🔋' },
        ],
        6: [
            { id: 'm6-p1', name: 'Notebook', price: 3.90, category: 'Books & Stationery', icon: '📓' },
            { id: 'm6-p2', name: 'Pen (3pcs)', price: 2.50, category: 'Books & Stationery', icon: '🖊️' },
        ],
        7: [
            { id: 'm7-p1', name: 'Football', price: 29.90, category: 'Sports & Fitness', icon: '⚽' },
        ],
        8: [
            { id: 'm8-p1', name: 'Gift Card', price: 20.00, category: 'Gifts & Souvenirs', icon: '🎁' },
        ],
    }
};