// Restaurant Component
export function Restaurant(restaurantData) {
    const card = document.createElement('div');
    const img = document.createElement('div');
    const content = document.createElement('div');
    const name = document.createElement('div');
    const meta = document.createElement('div');
    const rating = document.createElement('div');
    const deliveryInfo = document.createElement('span');
    const promoBadge = document.createElement('div');

    // Set classes
    card.classList.add('restaurant-card');
    img.classList.add('card-image');
    content.classList.add('card-content');
    name.classList.add('restaurant-name');
    meta.classList.add('restaurant-meta');
    rating.classList.add('rating');
    promoBadge.classList.add('promo-badge');

    // Set content
    img.innerHTML = restaurantData.icon || "🍳";
    name.innerHTML = restaurantData.name || "Restaurant Name";
    rating.innerHTML = `★ ${restaurantData.rating || "4.0"}`;
    deliveryInfo.innerHTML = `RM ${restaurantData.deliveryFee || "1.2"}/${restaurantData.deliveryTime || "4.25"} min`;
    
    if (restaurantData.promo) {
        promoBadge.innerHTML = restaurantData.promo;
    }

    // Assemble the card
    card.append(img, content);
    content.append(name, meta);
    meta.append(rating, deliveryInfo);
    
    if (restaurantData.promo) {
        content.append(promoBadge);
    }

    // Add click event for navigation
    card.addEventListener('click', function() {
        // Determine if we're in a subdirectory (pages) or root
        const isInSubdirectory = window.location.pathname.includes('/pages/')
        const basePath = isInSubdirectory ? '../' : './'
        window.location.href = `${basePath}pages/restaurant/index.html?id=${restaurantData.id || '1'}`;
    });

    // Add hover effect
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
    });

    return card;
}

// Function to create multiple restaurants
export function createRestaurants(restaurantsData) {
    const restaurantGrid = document.querySelector('.restaurant-grid');
    
    if (!restaurantGrid) {
        console.error('Restaurant grid not found');
        return;
    }

    // Clear existing content
    restaurantGrid.innerHTML = '';

    restaurantsData.forEach(restaurant => {
        const restaurantCard = Restaurant(restaurant);
        restaurantGrid.appendChild(restaurantCard);
    });
}

// Sample restaurant data
export const sampleRestaurants = [
    {
        id: 1,
        name: "Nasi Lemak Makelk",
        icon: "🍳",
        rating: "4.0",
        deliveryFee: "1.2",
        deliveryTime: "4.25",
        promo: "RM5 OFF"
    },
    {
        id: 2,
        name: "Teh Tarik Corner",
        icon: "🍲",
        rating: "4.2",
        deliveryFee: "3.50",
        deliveryTime: "15",
        promo: "RM5 OFF"
    },
    {
        id: 3,
        name: "Sushi Ten",
        icon: "🍣",
        rating: "4.6",
        deliveryFee: "3.65",
        deliveryTime: "20",
        promo: "RM5 OFF"
    },
    {
        id: 4,
        name: "Ayam Geprek",
        icon: "🍖",
        rating: "4.3",
        deliveryFee: "2.50",
        deliveryTime: "18",
        promo: "Free pickup"
    },
    {
        id: 5,
        name: "Pizza Palace",
        icon: "🍕",
        rating: "4.1",
        deliveryFee: "4.00",
        deliveryTime: "25",
        promo: "RM10 OFF"
    },
    {
        id: 6,
        name: "Burger Junction",
        icon: "🍔",
        rating: "4.4",
        deliveryFee: "2.80",
        deliveryTime: "22",
        promo: "RM5 OFF"
    }
];
