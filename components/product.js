export function Product() {
    const card = document.createElement('div')
    const img = document.createElement('div')
    const content = document.createElement('div')
    const name = document.createElement('div')
    const meta = document.createElement('div')
    const rating = document.createElement('div')
    const price = document.createElement('span')

    card.classList.add('restaurant-card')
    img.classList.add('card-image')
    content.classList.add('card-content')
    name.classList.add('restaurant-name')
    meta.classList.add('restaurant-meta')
    rating.classList.add('rating')
    
    img.innerHTML = "🍳"
    name.innerHTML = "Sapid"
    rating.innerHTML = "★ 4.0"
    price.innerHTML = "12 RM"

    card.append(img, content)
    content.append(name, meta)
    meta.append(rating, price)

    const restaurant_grid = document.querySelector('.restaurant-grid')
    restaurant_grid.append(card)

}
