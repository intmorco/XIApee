import { Header } from "/components/header.js";
import { ProductCard } from "/components/product.js";
import { createRestaurants, sampleRestaurants } from "/components/restaurant.js";
import { createMarts, sampleMarts } from "/components/mart.js";
import { globalCart } from "/components/cart.js";

// Initialize header
Header();

document.addEventListener("DOMContentLoaded", function () {
    // Initialize restaurants and marts with cart integration
    createRestaurants(sampleRestaurants);
    createMarts(sampleMarts);
    
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
});

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
}

// Filter cards by category
function filterByCategory(categoryName) {
    const activeTab = document.querySelector(".tab.active");
    const isRestaurantTab =
        activeTab && activeTab.textContent.includes("Restaurants");

    if (isRestaurantTab) {
        document.querySelectorAll(".restaurant-card").forEach((card) => {
            const cardCategory = card
                .querySelector(".restaurant-meta span")
                .textContent.toLowerCase();

            card.style.display =
                categoryName === "all" || cardCategory.includes(categoryName)
                    ? "block"
                    : "none";
        });
    } else {
        document.querySelectorAll(".minimart-card").forEach((card) => {
            const cardCategory = card
                .querySelector(".restaurant-meta span")
                .textContent.toLowerCase();

            card.style.display =
                categoryName === "all" || cardCategory.includes(categoryName)
                    ? "block"
                    : "none";
        });
    }
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

