export function Header() {
    const header_cont = document.createElement('div')
    const left = document.createElement('div')
    const middle = document.createElement('div')
    const right = document.createElement('div')
    const logo_img = document.createElement('a')
    const name = document.createElement('p')
    const home_icon = document.createElement('a')
    const cart_icon = document.createElement('a')
    const tracking_icon = document.createElement('a')
    const money_icon = document.createElement('a')
    const profile = document.createElement('a')
    const logout_btn = document.createElement('button')
    // const lens = document.createElement('img')

    // Determine if we're in a subdirectory (pages) or root
    const isInSubdirectory = window.location.pathname.includes('/pages/')
    const basePath = isInSubdirectory ? '../' : './'
    const pagesPath = isInSubdirectory ? '../' : './'

    logo_img.href = `${basePath}index.html`
    name.innerHTML = "XIApee"
    home_icon.href = `${basePath}index.html`
    cart_icon.href = `${basePath}index.html`
    tracking_icon.href = `${basePath}index.html`
    money_icon.href = `${basePath}index.html`
    profile.href = `${pagesPath}pages/profile/index.html`

    logout_btn.innerHTML = "Log out"
    logout_btn.onclick = () => {
        window.location.href = `${pagesPath}pages/login/index.html`
    }
    // lens.src = "/public/icons/lens_icon.svg"
    logo_img.style.backgroundImage = `url(${basePath}public/img/logo.png)`
    home_icon.style.backgroundImage = `url(${basePath}public/icons/home_icon.png)`
    cart_icon.style.backgroundImage = `url(${basePath}public/icons/cart_icon.png)`
    tracking_icon.style.backgroundImage = `url(${basePath}public/icons/tracking_icon.png)`
    money_icon.style.backgroundImage = `url(${basePath}public/icons/money_icon.png)`
    profile.style.backgroundImage = `url(${basePath}public/icons/profile_icon.svg)`

    header_cont.classList.add('header_cont')
    left.classList.add('left')
    middle.classList.add('middle')
    right.classList.add('right')
    logo_img.classList.add('logo_img')
    home_icon.classList.add('home_icon')
    cart_icon.classList.add('cart_icon')
    tracking_icon.classList.add('tracking_icon')
    money_icon.classList.add('money_icon')
    profile.classList.add('profile')
    logout_btn.classList.add('logout_btn')
    // lens.classList.add('lens')
    home_icon.classList.add('icon')
    cart_icon.classList.add('icon')
    tracking_icon.classList.add('icon')
    money_icon.classList.add('icon')
    profile.classList.add('icon')

    header_cont.append(left, middle, right)
    left.append(logo_img, name)
    middle.append(home_icon, cart_icon, tracking_icon, money_icon, profile)
    right.append(logout_btn)

    const header = document.querySelector('header')
    header.append(header_cont)
}