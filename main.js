import { Header } from "/components/header.js";
import { ProductCard } from "/components/product.js";
import { globalCart } from "/components/cart.js";

// Initialize header
Header();

document.addEventListener("DOMContentLoaded", async function () {
    // Load data from db.json
    let db = null;
    try {
        const response = await fetch('/data/db.json');
        db = await response.json();
    } catch (error) {
        console.error('Failed to load database:', error);
        return;
    }
    
    // Initialize restaurants and marts with cart integration
    createRestaurantsFromDB(db.restaurants || []);
    createMartsFromDB(db.minimarts || []);
    
    // Add cart functionality to product cards
    addCartFunctionality();

    const restaurantSection = document.querySelector(".restaurants-section");
    const martSection = document.querySelector(".minimarts-section");

    // Add tab interactivity
    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", function () {
            // Update tab states
            document.querySelectorAll(".tab").forEach((t) => {
                t.classList.remove("active");
                t.classList.add("inactive");
            });
            this.classList.remove("inactive");
            this.classList.add("active");

            // Reset search input
            const searchInput = document.querySelector(".logout_btn");
            if (searchInput) searchInput.value = "";

            // Remove active state from all categories
            document.querySelectorAll(".category").forEach((cat) => {
                cat.classList.remove("active");
            });

            if (this.textContent.includes("Restaurants")) {
                restaurantSection.style.display = "block";
                martSection.style.display = "none";
            } else if (this.textContent.includes("Minimarts")) {
                restaurantSection.style.display = "none";
                martSection.style.display = "block";
            }
        });
    });

    // Initialize search and filters
    initializeSearch();
    initializeCategoryFilters();

    // Set initial state - show restaurants by default
    restaurantSection.style.display = "block";
    martSection.style.display = "none";
    
    // Listen for balance updates from profile page
    window.addEventListener('balanceUpdated', (event) => {
        const newBalance = event.detail.newBalance;
        updateBalanceDisplay(newBalance);
    });
});

// Update balance display across the app
function updateBalanceDisplay(newBalance) {
    // Update any balance displays on the current page
    const balanceElements = document.querySelectorAll('[id*="balance"], [id*="Balance"]');
    balanceElements.forEach(element => {
        if (element.textContent.includes('RM')) {
            element.textContent = `RM ${newBalance.toFixed(2)}`;
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector(".logout_btn");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();
            filterCards(searchTerm);
        });
    }
}

// Filter cards based on search term
function filterCards(searchTerm) {
    const activeTab = document.querySelector(".tab.active");
    const isRestaurantTab =
        activeTab && activeTab.textContent.includes("Restaurants");

    if (isRestaurantTab) {
        document.querySelectorAll(".restaurant-card").forEach((card) => {
            const name = card
                .querySelector(".restaurant-name")
                .textContent.toLowerCase();
            const category = card
                .querySelector(".restaurant-meta span")
                .textContent.toLowerCase();

            card.style.display =
                name.includes(searchTerm) || category.includes(searchTerm)
                    ? "block"
                    : "none";
        });
    } else {
        document.querySelectorAll(".minimart-card").forEach((card) => {
            const name = card
                .querySelector(".restaurant-name")
                .textContent.toLowerCase();
            const category = card
                .querySelector(".restaurant-meta span")
                .textContent.toLowerCase();

            card.style.display =
                name.includes(searchTerm) || category.includes(searchTerm)
                    ? "block"
                    : "none";
        });
    }
}

// Category filter functionality
function initializeCategoryFilters() {
    const categories = document.querySelectorAll(".category");

    categories.forEach((category) => {
        category.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove active class from all categories
            categories.forEach((c) => c.classList.remove("active"));

            // Add active class to clicked category
            this.classList.add("active");

            // Filter by category
            const categoryName = this.textContent.toLowerCase();
            filterByCategory(categoryName);
        });
    });
    
    // Add "Show All" functionality
    addShowAllFunctionality();
}

// Add show all functionality
function addShowAllFunctionality() {
    // Add a "Show All" button or handle clicking outside categories
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('category') && !e.target.closest('.categories')) {
            // If clicking outside categories, show all restaurants/minimarts
            const activeCategory = document.querySelector('.category.active');
            if (activeCategory) {
                activeCategory.classList.remove('active');
                showAllRestaurantsAndMarts();
            }
        }
    });
}

// Show all restaurants and minimarts
function showAllRestaurantsAndMarts() {
    // Hide all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.remove();
    });
    
    // Show all restaurant and minimart cards
    document.querySelectorAll('.restaurant-card, .minimart-card').forEach((card) => {
        card.style.display = 'block';
    });
}

// Filter cards by category
function filterByCategory(categoryName) {
    const normalized = categoryName.toLowerCase();
    const showAll = normalized === 'all';

    // Hide all cards first
    document.querySelectorAll('.restaurant-card, .minimart-card').forEach((card) => {
        card.style.display = 'none';
    });

    if (showAll) {
        // Show all cards
        document.querySelectorAll('.restaurant-card, .minimart-card').forEach((card) => {
            card.style.display = 'block';
        });
    } else {
        // Show products from all restaurants/minimarts that match the category
        showProductsByCategory(normalized);
    }
}

// Show products by category
async function showProductsByCategory(categoryName) {
    try {
        const response = await fetch('/data/db.json');
        const db = await response.json();
        
        // Get all products from restaurants and minimarts
        const allProducts = [];
        
        // Add restaurant products
        if (db.restaurants) {
            db.restaurants.forEach(restaurant => {
                if (restaurant.products) {
                    restaurant.products.forEach(product => {
                        allProducts.push({
                            ...product,
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                            restaurantLocation: restaurant.location,
                            type: 'restaurant'
                        });
                    });
                }
            });
        }
        
        // Add minimart products
        if (db.minimarts) {
            db.minimarts.forEach(minimart => {
                if (minimart.products) {
                    minimart.products.forEach(product => {
                        allProducts.push({
                            ...product,
                            restaurantId: minimart.id,
                            restaurantName: minimart.name,
                            restaurantLocation: minimart.location,
                            type: 'minimart'
                        });
                    });
                }
            });
        }
        
        // Filter products by category
        const filteredProducts = allProducts.filter(product => {
            const productName = product.name.toLowerCase();
            const productDescription = (product.description || '').toLowerCase();
            const restaurantName = product.restaurantName.toLowerCase();
            
            // Map category names to search terms
            const categoryMappings = {
                'asian': ['asian', 'nasi', 'mee', 'roti', 'teh', 'sushi', 'miso', 'ayam'],
                'western': ['western', 'burger', 'pizza', 'pasta', 'sandwich'],
                'drinks': ['drinks', 'teh', 'coffee', 'juice', 'water', 'ais'],
                'desserts': ['desserts', 'cake', 'ice cream', 'sweet', 'dessert'],
                'halal': ['halal', 'muslim', 'islamic']
            };
            
            const searchTerms = categoryMappings[categoryName] || [categoryName];
            return searchTerms.some(term => 
                productName.includes(term) || 
                productDescription.includes(term) || 
                restaurantName.includes(term)
            );
        });
        
        // Display products
        displayProducts(filteredProducts);
        
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

// Display products in a grid
function displayProducts(products) {
    const activeTab = document.querySelector('.tab.active');
    const isRestaurantTab = activeTab && activeTab.textContent.includes("Restaurants");
    
    const container = isRestaurantTab ? 
        document.querySelector('.restaurant-grid') : 
        document.querySelector('.minimarts-grid');
    
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">No products found in this category.</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="card-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '🍽️'}
        </div>
        <div class="card-content">
            <div class="product-name">${product.name}</div>
            <div class="product-meta">
                <span>RM ${product.price.toFixed(2)}</span>
                <span>•</span>
                <span>${product.restaurantName}</span>
            </div>
            <div class="product-description">${product.description || ''}</div>
            <button class="add-btn">Add to Cart</button>
        </div>
    `;
    
    // Add click handler for the card
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-btn')) {
            if (product.type === 'restaurant') {
                window.location.href = `/pages/restaurant/index.html?id=${product.restaurantId}`;
            } else {
                window.location.href = `/pages/mart/index.html?id=${product.restaurantId}`;
            }
        }
    });
    
    // Add cart functionality
    const addBtn = card.querySelector('.add-btn');
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addProductToCart(product);
    });
    
    return card;
}

// Add product to cart
function addProductToCart(product) {
    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        icon: product.image || '🍽️',
        category: product.type,
        restaurantId: product.restaurantId,
        restaurantName: product.restaurantName
    };
    
    globalCart.addItem(cartProduct);
    
    // Show feedback
    const addBtn = event.target;
    const originalText = addBtn.textContent;
    addBtn.textContent = 'Added!';
    addBtn.style.background = '#28a745';
    
    setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.background = '#4a7c59';
    }, 1500);
}

// Function to create restaurants from db.json
function createRestaurantsFromDB(restaurants) {
    const restaurantGrid = document.querySelector('.restaurant-grid');
    if (!restaurantGrid) return;
    
    restaurantGrid.innerHTML = '';
    restaurants.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        restaurantGrid.appendChild(card);
    });
}

// Function to create minimarts from db.json
function createMartsFromDB(minimarts) {
    const martGrid = document.querySelector('.minimarts-grid');
    if (!martGrid) return;
    
    martGrid.innerHTML = '';
    minimarts.forEach(mart => {
        const card = createMartCard(mart);
        martGrid.appendChild(card);
    });
}

// Create restaurant card from db data
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
        <div class="card-image">${restaurant.image ? `<img src="${restaurant.image}" alt="${restaurant.name}">` : '🍽️'}</div>
        <div class="card-content">
            <div class="restaurant-name">${restaurant.name}</div>
            <div class="restaurant-meta">
                <span>${restaurant.cuisine}</span>
                <span>•</span>
                <span>${restaurant.location}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/pages/restaurant/index.html?id=${restaurant.id}`;
    });
    
    return card;
}

// Create mart card from db data
function createMartCard(mart) {
    const card = document.createElement('div');
    card.className = 'minimart-card';
    card.innerHTML = `
        <div class="card-image">${mart.image ? `<img src="${mart.image}" alt="${mart.name}">` : '🏪'}</div>
        <div class="card-content">
            <div class="restaurant-name">${mart.name}</div>
            <div class="restaurant-meta">
                <span>Minimart</span>
                <span>•</span>
                <span>${mart.location}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/pages/mart/index.html?id=${mart.id}`;
    });
    
    return card;
}

// Add cart functionality to product cards
function addCartFunctionality() {
    // Add event listeners to all product cards for cart functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) {
            const card = e.target.closest('.restaurant-card');
            if (!card) return;
            
            // Extract product info from the card
            const name = card.querySelector('.restaurant-name')?.textContent;
            const priceText = card.querySelector('.restaurant-meta span')?.textContent;
            const price = parseFloat(priceText?.replace('RM ', '') || '0');
            const icon = card.querySelector('.card-image')?.textContent || '🍽️';
            
            if (name && price) {
                const product = {
                    id: `main-${name.toLowerCase().replace(/\s+/g, '-')}`,
                    name: name,
                    price: price,
                    icon: icon,
                    category: 'General'
                };
                
                globalCart.addItem(product);
                
                // Show feedback
                const originalText = e.target.textContent;
                e.target.textContent = 'Added!';
                e.target.style.background = '#28a745';
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = '#4a7c59';
                }, 1500);
            }
        }
    });
}

