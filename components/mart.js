// Mart Component
export function Mart(martData) {
    const card = document.createElement('div');
    const img = document.createElement('div');
    const content = document.createElement('div');
    const name = document.createElement('div');
    const meta = document.createElement('div');
    const category = document.createElement('span');
    const status = document.createElement('div');

    // Set classes
    card.classList.add('minimart-card');
    img.classList.add('minimart-image');
    content.classList.add('card-content');
    name.classList.add('restaurant-name');
    meta.classList.add('restaurant-meta');
    status.classList.add('mart-status');

    // Set content
    img.innerHTML = martData.icon || "🏪";
    name.innerHTML = martData.name || "Mart Name";
    category.innerHTML = martData.category || "Groceries";
    
    if (martData.status) {
        status.innerHTML = martData.status;
        status.classList.add(martData.status.toLowerCase().replace(' ', '-'));
    }

    // Assemble the card
    card.append(img, content);
    content.append(name, meta);
    meta.append(category);
    
    if (martData.status) {
        content.append(status);
    }

    // Add click event for navigation
    card.addEventListener('click', function() {
        window.location.href = `/pages/mart/index.html?id=${martData.id || '1'}`;
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

// Function to create multiple marts
export function createMarts(martsData) {
    const martGrid = document.querySelector('.minimarts-grid');
    
    if (!martGrid) {
        console.error('Mart grid not found');
        return;
    }

    // Clear existing content
    martGrid.innerHTML = '';

    martsData.forEach(mart => {
        const martCard = Mart(mart);
        martGrid.appendChild(martCard);
    });
}

// Sample mart data
export const sampleMarts = [
    {
        id: 1,
        name: "Campus MiniMart",
        icon: "🏪",
        category: "Groceries",
        status: "Open"
    },
    {
        id: 2,
        name: "Fresh & Fruity",
        icon: "🥗",
        category: "Groceries - Beverages",
        status: "Open"
    },
    {
        id: 3,
        name: "Daily Essentials",
        icon: "🛒",
        category: "Essentials",
        status: "Open"
    },
    {
        id: 4,
        name: "Health & Beauty",
        icon: "💄",
        category: "Health & Beauty",
        status: "Open"
    },
    {
        id: 5,
        name: "Tech Store",
        icon: "📱",
        category: "Electronics",
        status: "Open"
    },
    {
        id: 6,
        name: "Book Corner",
        icon: "📚",
        category: "Books & Stationery",
        status: "Open"
    },
    {
        id: 7,
        name: "Sports Hub",
        icon: "⚽",
        category: "Sports & Fitness",
        status: "Open"
    },
    {
        id: 8,
        name: "Gift Shop",
        icon: "🎁",
        category: "Gifts & Souvenirs",
        status: "Open"
    }
];
