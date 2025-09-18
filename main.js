import { Header } from "./components/header";
import { Product } from "./components/product";
import { createRestaurants, sampleRestaurants } from "./components/restaurant";
import { createMarts, sampleMarts } from "./components/mart";

// Initialize header
Header();

// Wait for DOM to be ready before initializing components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize restaurants
    createRestaurants(sampleRestaurants);

    // Initialize marts
    createMarts(sampleMarts);
    
    // Add tab interactivity
    document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Update tab states
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.classList.add('inactive');
        });
        this.classList.remove('inactive');
        this.classList.add('active');

        // Get section elements
        const restaurantSection = document.querySelector('.restaurant-grid').parentElement;
        const martSection = document.querySelector('.minimarts-section');
        const restaurantTitle = restaurantSection.querySelector('.section-title');
        const martTitle = martSection.querySelector('.section-title');
        
        // Clear search input when switching tabs
        const searchInput = document.querySelector('.search_inp');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Remove active state from all categories
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        if (this.textContent.includes('Restaurants')) {
            // Show restaurants, hide marts
            restaurantSection.style.display = 'block';
            martSection.style.display = 'none';
            
            // Show all restaurant cards, hide all mart cards
            document.querySelectorAll('.restaurant-card').forEach(card => {
                card.style.display = 'block';
            });
            document.querySelectorAll('.minimart-card').forEach(card => {
                card.style.display = 'none';
            });
            
        } else if (this.textContent.includes('Minimarts')) {
            // Show marts, hide restaurants
            restaurantSection.style.display = 'none';
            martSection.style.display = 'block';
            
            // Show all mart cards, hide all restaurant cards
            document.querySelectorAll('.restaurant-card').forEach(card => {
                card.style.display = 'none';
            });
            document.querySelectorAll('.minimart-card').forEach(card => {
                card.style.display = 'block';
            });
        }
    });
    
    // Initialize search and filters
    initializeSearch();
    initializeCategoryFilters();
    
    // Set initial state - show restaurants by default
    const restaurantSection = document.querySelector('.restaurant-grid').parentElement;
    const martSection = document.querySelector('.minimarts-section');
    
    if (restaurantSection && martSection) {
        // Show restaurants, hide marts
        restaurantSection.style.display = 'block';
        martSection.style.display = 'none';
        
        // Show all restaurant cards, hide all mart cards
        document.querySelectorAll('.restaurant-card').forEach(card => {
            card.style.display = 'block';
        });
        document.querySelectorAll('.minimart-card').forEach(card => {
            card.style.display = 'none';
        });
    }
});

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search_inp');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterCards(searchTerm);
        });
    }
}

// Filter cards based on search term
function filterCards(searchTerm) {
    const activeTab = document.querySelector('.tab.active');
    const isRestaurantTab = activeTab && activeTab.textContent.includes('Restaurants');
    
    if (isRestaurantTab) {
        // Filter only restaurant cards
        const restaurantCards = document.querySelectorAll('.restaurant-card');
        restaurantCards.forEach(card => {
            const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
            const category = card.querySelector('.restaurant-meta span').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    } else {
        // Filter only mart cards
        const martCards = document.querySelectorAll('.minimart-card');
        martCards.forEach(card => {
            const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
            const category = card.querySelector('.restaurant-meta span').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Category filter functionality
function initializeCategoryFilters() {
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all categories
            categories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Filter by category
            const categoryName = this.textContent.toLowerCase();
            filterByCategory(categoryName);
        });
    });
}

// Filter cards by category
function filterByCategory(categoryName) {
    const activeTab = document.querySelector('.tab.active');
    const isRestaurantTab = activeTab && activeTab.textContent.includes('Restaurants');
    
    if (isRestaurantTab) {
        // Filter only restaurant cards
        const restaurantCards = document.querySelectorAll('.restaurant-card');
        restaurantCards.forEach(card => {
            const cardCategory = card.querySelector('.restaurant-meta span').textContent.toLowerCase();
            
            if (categoryName === 'all' || cardCategory.includes(categoryName)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    } else {
        // Filter only mart cards
        const martCards = document.querySelectorAll('.minimart-card');
        martCards.forEach(card => {
            const cardCategory = card.querySelector('.restaurant-meta span').textContent.toLowerCase();
            
            if (categoryName === 'all' || cardCategory.includes(categoryName)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}
});



