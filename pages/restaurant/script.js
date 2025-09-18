import { Header } from '/components/header.js';
import { sampleRestaurants } from '/components/restaurant.js';
import { ProductCard, sampleProducts } from '/components/product.js';
import { createCart } from '/components/cart.js';

Header();

const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id')) || 1;

const restaurant = sampleRestaurants.find(r => Number(r.id) === id) || sampleRestaurants[0];
const titleEl = document.getElementById('vendor-title');
titleEl.textContent = restaurant?.name || 'Restaurant';

const products = (sampleProducts.restaurant[String(id)] || sampleProducts.restaurant[id]) || [];
const productGrid = document.getElementById('product-grid');

const cart = createCart('#cart-container');

function renderProducts(list) {
    productGrid.innerHTML = '';
    list.forEach((p) => {
        const node = ProductCard(p, (prod) => cart.addItem(prod));
        productGrid.appendChild(node);
    });
}

function buildCategories(list) {
    const cats = Array.from(new Set(list.map(p => p.category))).sort();
    const container = document.getElementById('categories');
    container.innerHTML = '';

    const mk = (label) => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'category';
        a.textContent = label;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            container.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            a.classList.add('active');
            if (label === 'All') renderProducts(products);
            else renderProducts(products.filter(p => p.category === label));
        });
        return a;
    };

    const all = mk('All');
    all.classList.add('active');
    container.appendChild(all);
    cats.forEach(c => container.appendChild(mk(c)));
}

buildCategories(products);
renderProducts(products);