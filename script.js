// Mock Data Produk
const products = [
    { id: 1, name: 'Apel ', price: 35000, img: 'o_1a220t3t51r0o2h7ih318031c9oa.jpg' },
    { id: 2, name: 'Jeruk ', price: 28000, img: 'ARTIKEL_2024-09-09_Thumbnail Artikel Website (3).jpg' },
    { id: 3, name: 'Pisang ', price: 20000, img: 'images.jpg' },
    { id: 4, name: 'Anggur Merah', price: 55000, img: 'images (1).jpg' },
    { id: 5, name: 'Alpukat ', price: 45000, img: 'buah-alpukat-aligator-1024x683.webp' },
    { id: 6, name: 'Strawberry', price: 30000, img: 'gallery-1432664914-strawberry-facts1.jpg' }
];

let cart = [];

// Render Produk
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => `
        <div class="card">
            <img src="${product.img}" alt="${product.name}" class="card__img">
            <div class="card__info">
                <h3 class="card__title">${product.name}</h3>
                <span class="card__price">Rp ${product.price.toLocaleString('id-ID')} /kg</span>
                <button onclick="addToCart(${product.id})" class="btn btn--primary btn--full">Tambah ke Keranjang</button>
            </div>
        </div>
    `).join('');
}

// Tambah ke Keranjang
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    alert(`${product.name} ditambahkan ke keranjang!`);
};

// Update UI Keranjang
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    cartCount.innerText = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Keranjang Anda kosong.</p>';
        totalPrice.innerText = 'Rp 0';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>Rp ${item.price.toLocaleString('id-ID')}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Form Handle
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }
    
    alert('Terima kasih! Pesanan Anda sedang diproses.');
    cart = [];
    updateCartUI();
    this.reset();
});

// Navbar Active Link
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar__link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});