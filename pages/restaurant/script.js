import { Header } from '/components/header.js';

// Initialize header
Header();

let db = null;
let currentRestaurant = null;

// DOM elements
const restaurantTitle = document.getElementById('restaurant-title');
const restaurantImage = document.getElementById('restaurant-image');
const restaurantName = document.getElementById('restaurant-name');
const restaurantCuisine = document.getElementById('restaurant-cuisine');
const restaurantLocation = document.getElementById('restaurant-location');
const restaurantDescription = document.getElementById('restaurant-description');
const productsGrid = document.getElementById('products-grid');
const restaurantNotFound = document.getElementById('restaurant-not-found');

// Get restaurant ID from URL parameters
function getRestaurantId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load database
async function loadDB() {
    try {
        const response = await fetch('/data/db.json');
        db = await response.json();
    } catch (error) {
        console.error('Failed to load database:', error);
    }
}

// Find restaurant by ID
function findRestaurant(id) {
    if (!db || !db.restaurants) return null;
    return db.restaurants.find(restaurant => restaurant.id === id);
}

// Render restaurant details
function renderRestaurant(restaurant) {
    currentRestaurant = restaurant;
    
    // Update page title
    document.title = `${restaurant.name} | XIApee`;
    restaurantTitle.textContent = restaurant.name;
    
    // Update restaurant details
    if (restaurant.image) {
        restaurantImage.innerHTML = `<img src="${restaurant.image}" alt="${restaurant.name}">`;
    } else {
        restaurantImage.textContent = '🍽️';
    }
    
    restaurantName.textContent = restaurant.name;
    restaurantCuisine.textContent = restaurant.cuisine;
    restaurantLocation.textContent = restaurant.location;
    restaurantDescription.textContent = restaurant.description;
    
    // Render products
    renderProducts(restaurant.products || []);
}

// Render products
function renderProducts(products) {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '🍽️'}
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">RM ${Number(product.price).toFixed(2)}</div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/pages/product/index.html?id=${product.id}&type=restaurant&vendorId=${currentRestaurant.id}`;
    });
    
    return card;
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadDB();
    
    const restaurantId = getRestaurantId();
    if (!restaurantId) {
        restaurantNotFound.style.display = 'block';
        document.querySelector('.restaurant-content').style.display = 'none';
        return;
    }
    
    const restaurant = findRestaurant(restaurantId);
    if (!restaurant) {
        restaurantNotFound.style.display = 'block';
        document.querySelector('.restaurant-content').style.display = 'none';
        return;
    }
    
    renderRestaurant(restaurant);
});