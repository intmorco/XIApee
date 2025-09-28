import { Header } from '/components/header.js';

// Initialize header
Header();

let db = null;
let currentMart = null;

// DOM elements
const martTitle = document.getElementById('mart-title');
const martImage = document.getElementById('mart-image');
const martName = document.getElementById('mart-name');
const martLocation = document.getElementById('mart-location');
const martDescription = document.getElementById('mart-description');
const productsGrid = document.getElementById('products-grid');
const martNotFound = document.getElementById('mart-not-found');

// Get mart ID from URL parameters
function getMartId() {
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

// Find mart by ID
function findMart(id) {
    if (!db || !db.minimarts) return null;
    return db.minimarts.find(mart => mart.id === id);
}

// Render mart details
function renderMart(mart) {
    currentMart = mart;
    
    // Update page title
    document.title = `${mart.name} | XIApee`;
    martTitle.textContent = mart.name;
    
    // Update mart details
    if (mart.image) {
        martImage.innerHTML = `<img src="${mart.image}" alt="${mart.name}">`;
    } else {
        martImage.textContent = '🏪';
    }
    
    martName.textContent = mart.name;
    martLocation.textContent = mart.location;
    martDescription.textContent = mart.description;
    
    // Render products
    renderProducts(mart.products || []);
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
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '🏪'}
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">RM ${Number(product.price).toFixed(2)}</div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/pages/product/index.html?id=${product.id}&type=mart&vendorId=${currentMart.id}`;
    });
    
    return card;
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadDB();
    
    const martId = getMartId();
    if (!martId) {
        martNotFound.style.display = 'block';
        document.querySelector('.mart-content').style.display = 'none';
        return;
    }
    
    const mart = findMart(martId);
    if (!mart) {
        martNotFound.style.display = 'block';
        document.querySelector('.mart-content').style.display = 'none';
        return;
    }
    
    renderMart(mart);
});