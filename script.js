// Mock Data Produk
const products = [
    { id: 1, name: 'Apel Manalagi', price: 35000, img: 'images (3).jpg', description: 'apel segar dan manis', shelfLife: 'Tahan 5 hari di kulkas', sold: 0, stock: 50 },
    { id: 2, name: 'Jeruk Sunkist', price: 28000, img: 'ARTIKEL_2024-09-09_Thumbnail Artikel Website (3).jpg', description: 'Jeruk segar kaya vitamin C', shelfLife: 'Tahan 7 hari di kulkas', sold: 0, stock: 50 },
    { id: 3, name: 'Pisang Ambon', price: 20000, img: 'images.jpg', description: 'Pisang matang sempurna', shelfLife: 'Tahan 3-4 hari di kulkas', sold: 0, stock: 50 },
    { id: 4, name: 'Anggur Merah', price: 55000, img: 'images (1).jpg', description: 'Anggur merah tanpa biji', shelfLife: 'Tahan 5 hari di kulkas', sold: 0, stock: 50 },
    { id: 5, name: 'Alpukat Mentega', price: 45000, img: 'buah-alpukat-aligator-1024x683.webp', description: 'Alpukat creamy dan lezat', shelfLife: 'Tahan 2-3 hari di kulkas', sold: 0, stock: 50 },
    { id: 6, name: 'Strawberry Mencir', price: 30000, img: 'gallery-1432664914-strawberry-facts1.jpg', description: 'Strawberry segar import', shelfLife: 'Tahan 3 hari di kulkas', sold: 0, stock: 50 },
    { id: 7, name: 'Nanas Madu', price: 32000, img: '052500500_1605602630-Menilik-Manfaat-Nanas-Madu-bagi-Kesehatan-Anda-shutterstock_1503954347.jpg', description: 'Nanas manis dan segar', shelfLife: 'Tahan 5-6 hari di kulkas', sold: 0, stock: 50 },
    { id: 8, name: 'Mangga Manalagi', price: 38000, img: 'mangga-manalagi.jpg', description: 'Mangga segar penuh nutrisi', shelfLife: 'Tahan 4-5 hari di kulkas', sold: 0, stock: 50 }
];

let cart = [];

// Data Ulasan
let reviews = JSON.parse(localStorage.getItem('productReviews')) || {};

// Fungsi untuk render rating bintang
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Fungsi untuk menghitung rating rata-rata dari ulasan
function calculateAverageRating(productId) {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / productReviews.length;
}

// Fungsi untuk menyimpan ulasan
function saveReview(productId, reviewData) {
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    reviews[productId].push(reviewData);
    localStorage.setItem('productReviews', JSON.stringify(reviews));
    
    // Update rating produk
    const product = products.find(p => p.id === productId);
    if (product) {
        product.rating = calculateAverageRating(productId);
    }
}

// Fungsi untuk render ulasan produk
function renderProductReviews(productId) {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) {
        return '<p class="no-reviews">Belum ada ulasan untuk produk ini.</p>';
    }
    
    return productReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <div class="review-rating">
                    ${renderStars(review.rating)}
                    <span class="rating-number">${review.rating}/5</span>
                </div>
            </div>
            <p class="review-comment">${review.comment}</p>
            <span class="review-date">${review.date}</span>
        </div>
    `).join('');
}
// Fungsi untuk menampilkan modal ulasan
window.showReviews = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="review-modal__overlay" onclick="closeReviewModal()"></div>
        <div class="review-modal__content">
            <div class="review-modal__header">
                <h3>Ulasan ${product.name}</h3>
                <button onclick="closeReviewModal()" class="close-btn">&times;</button>
            </div>
            <div class="review-modal__body">
                <div class="review-form">
                    <h4>Tambah Ulasan</h4>
                    <form id="review-form-${productId}" onsubmit="submitReview(event, ${productId})">
                        <div class="form-group">
                            <label>Nama:</label>
                            <input type="text" name="author" required placeholder="Masukkan nama Anda">
                        </div>
                        <div class="form-group">
                            <label>Rating:</label>
                            <div class="rating-input">
                                <input type="radio" name="rating" value="5" id="star5-${productId}">
                                <label for="star5-${productId}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="rating" value="4" id="star4-${productId}">
                                <label for="star4-${productId}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="rating" value="3" id="star3-${productId}">
                                <label for="star3-${productId}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="rating" value="2" id="star2-${productId}">
                                <label for="star2-${productId}"><i class="fas fa-star"></i></label>
                                <input type="radio" name="rating" value="1" id="star1-${productId}" required>
                                <label for="star1-${productId}"><i class="fas fa-star"></i></label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Komentar:</label>
                            <textarea name="comment" required placeholder="Tulis ulasan Anda..."></textarea>
                        </div>
                        <button type="submit" class="btn btn--primary">Kirim Ulasan</button>
                    </form>
                </div>
                <div class="reviews-list">
                    <h4>Ulasan Pelanggan</h4>
                    <div id="reviews-container-${productId}">
                        ${renderProductReviews(productId)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

// Fungsi untuk menutup modal ulasan
window.closeReviewModal = function() {
    const modal = document.querySelector('.review-modal');
    if (modal) {
        modal.remove();
    }
};

// Fungsi untuk submit ulasan
window.submitReview = function(event, productId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const reviewData = {
        author: formData.get('author'),
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment'),
        date: new Date().toLocaleDateString('id-ID')
    };
    
    saveReview(productId, reviewData);
    renderProducts();
    
    // Update ulasan di modal
    const reviewsContainer = document.getElementById(`reviews-container-${productId}`);
    if (reviewsContainer) {
        reviewsContainer.innerHTML = renderProductReviews(productId);
    }
    
    // Reset form
    form.reset();
    
    alert('Terima kasih atas ulasan Anda!');
};
// Penghitung Pengunjung
function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = 0;
    }
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    document.getElementById('visitor-count').textContent = count;
}

// Render Produk
function renderProducts(productList = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = productList.map(product => {
        const stockClass = product.stock > 10 ? 'card__stock--high' : product.stock > 5 ? 'card__stock--medium' : product.stock > 0 ? 'card__stock--low' : 'card__stock--out';
        const stockText = product.stock > 0 ? `${product.stock} tersisa` : 'Habis';
        const currentRating = calculateAverageRating(product.id);
        const stars = renderStars(currentRating);
        const reviewCount = (reviews[product.id] || []).length;
        
        return `
        <div class="card">
            <img src="${product.img}" alt="${product.name}" class="card__img">
            <div class="card__info">
                <h3 class="card__title">${product.name}</h3>
                <p class="card__description">${product.description}</p>
                <div class="card__rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-value">${currentRating.toFixed(1)} (${reviewCount} ulasan)</span>
                </div>
                <span class="card__shelf-life">${product.shelfLife}</span>
                <span class="card__stock ${stockClass}">${stockText}</span>
                <span class="card__price">Rp ${product.price.toLocaleString('id-ID')} /kg</span>
                <span class="card__sold">Terjual: ${product.sold || 0}</span>
                <div class="card__actions">
                    <button onclick="addToCart(${product.id})" class="btn btn--primary btn--full" ${product.stock <= 0 ? 'disabled' : ''}>${product.stock <= 0 ? 'Habis' : 'Tambah ke Keranjang'}</button>
                    <button onclick="showReviews(${product.id})" class="btn btn--secondary btn--full">Lihat Ulasan</button>
                </div>
            </div>
        </div>
    `}).join('');
}

function loadProductSales() {
    const salesByProduct = JSON.parse(localStorage.getItem('productSales')) || {};
    products.forEach(product => {
        product.sold = salesByProduct[product.id] || 0;
    });
}

function saveProductSales(cartItems) {
    const salesByProduct = JSON.parse(localStorage.getItem('productSales')) || {};
    cartItems.forEach(item => {
        salesByProduct[item.id] = (salesByProduct[item.id] || 0) + 1;
    });
    localStorage.setItem('productSales', JSON.stringify(salesByProduct));
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi rating untuk semua produk
    products.forEach(product => {
        product.rating = calculateAverageRating(product.id);
    });
    
    loadProductSales();
    renderProducts();
    updateVisitorCount();
    updateSalesDisplay();
    renderPurchaseHistory();
    renderSalesChart();
});

// Urutkan Produk
window.sortProducts = function(sortType) {
    let sortedProducts = [...products];
    
    if (sortType === 'low-high') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else {
        sortedProducts = [...products];
    }
    
    renderProducts(sortedProducts);
};

// Tambah ke Keranjang
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= 0) {
        alert('Maaf, stok produk ini sedang habis.');
        return;
    }
    product.stock -= 1;
    cart.push(product);
    updateCartUI();
    renderProducts();
    alert(`${product.name} ditambahkan ke keranjang!`);
};

window.removeFromCart = function(index) {
    const product = cart[index];
    if (product) {
        product.stock += 1;
    }
    cart.splice(index, 1);
    updateCartUI();
    renderProducts();
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
            <div class="cart-item__top">
                <span>${item.name}</span>
                <button class="btn btn--danger" onclick="removeFromCart(${index})">Batalkan</button>
            </div>
            <span>Rp ${item.price.toLocaleString('id-ID')}</span>
            <p>${item.description}</p>
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
    
    // Simpan data penjualan
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const salesData = {
        date: new Date().toLocaleString('id-ID'),
        items: cart.length,
        total: total,
        products: cart.map(item => item.name)
    };

    let sales = JSON.parse(localStorage.getItem('salesData')) || [];
    sales.push(salesData);
    localStorage.setItem('salesData', JSON.stringify(sales));

    saveProductSales(cart);
    loadProductSales();
    updateSalesDisplay();
    renderProducts();

    alert('Terima kasih! Pesanan Anda sedang diproses.');
    cart = [];
    updateCartUI();
    this.reset();
});

// Tampilkan Total Penjualan
function updateSalesDisplay() {
    let sales = JSON.parse(localStorage.getItem('salesData')) || [];
    const salesCountElement = document.getElementById('sales-count');
    if (salesCountElement) {
        salesCountElement.textContent = sales.length;
    }
    
    if (document.getElementById('total-transactions')) {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalItems = sales.reduce((sum, sale) => sum + sale.items, 0);
        
        document.getElementById('total-transactions').textContent = sales.length;
        document.getElementById('total-revenue').textContent = 'Rp ' + totalRevenue.toLocaleString('id-ID');
        document.getElementById('total-items').textContent = totalItems;
    }

    renderSalesChart();
    renderPurchaseHistory();
}


function renderPurchaseHistory() {
    const historyContainer = document.getElementById('purchase-history');
    const sales = JSON.parse(localStorage.getItem('salesData')) || [];

    if (!historyContainer) {
        return;
    }

    if (sales.length === 0) {
        historyContainer.innerHTML = '<p class="empty-msg">Belum ada riwayat transaksi.</p>';
        return;
    }

    historyContainer.innerHTML = sales.reverse().map(sale => {
        const productList = sale.products ? sale.products.join(', ') : '-';
        return `
            <div class="history-item">
                <div class="history-item__header">
                    <span class="history-item__date">${sale.date}</span>
                    <span class="history-item__total">Rp ${sale.total.toLocaleString('id-ID')}</span>
                </div>
                <div class="history-item__details">
                    <p><strong>Produk:</strong> ${productList}</p>
                    <p><strong>Jumlah item:</strong> ${sale.items}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Render Diagram Penjualan
function renderSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas || typeof Chart === 'undefined') {
        return;
    }

    const salesByProduct = JSON.parse(localStorage.getItem('productSales')) || {};
    const ctx = canvas.getContext('2d');

    const labels = products.map(product => product.name);
    const data = products.map(product => salesByProduct[product.id] || 0);

    try {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Terjual',
                    data: data,
                    backgroundColor: 'rgba(39, 174, 96, 0.6)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Chart render error:', error);
    }
}

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

// Navbar Active Link

