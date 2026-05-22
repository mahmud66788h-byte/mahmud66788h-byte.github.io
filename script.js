
const products = [
    { id: 1, name: 'Apel Manalagi', price: 36000, img: 'images (3).jpg', description: 'apel segar dan manis', shelfLife: 'Tahan 5 hari di kulkas', sold: 0, stock: 50 },
    { id: 2, name: 'Jeruk Sunkist', price: 28000, img: 'ARTIKEL_2024-09-09_Thumbnail Artikel Website (3).jpg', description: 'Jeruk segar kaya vitamin C', shelfLife: 'Tahan 7 hari di kulkas', sold: 0, stock: 50 },
    { id: 3, name: 'Pisang Ambon', price: 20000, img: 'images.jpg', description: 'Pisang matang sempurna', shelfLife: 'Tahan 3-4 hari di kulkas', sold: 0, stock: 50 },
    { id: 4, name: 'Anggur Merah', price: 56000, img: 'images (1).jpg', description: 'Anggur merah tanpa biji', shelfLife: 'Tahan 5 hari di kulkas', sold: 0, stock: 50 },
    { id: 5, name: 'Alpukat Mentega', price: 40000, img: 'buah-alpukat-aligator-1024x683.webp', description: 'Alpukat creamy dan lezat', shelfLife: 'Tahan 2-3 hari di kulkas', sold: 0, stock: 50 },
    { id: 6, name: 'Strawberry Mencir', price: 30000, img: 'gallery-1432664914-strawberry-facts1.jpg', description: 'Strawberry segar import', shelfLife: 'Tahan 3 hari di kulkas', sold: 0, stock: 50 },
    { id: 7, name: 'Nanas Madu', price: 32000, img: '052500500_1605602630-Menilik-Manfaat-Nanas-Madu-bagi-Kesehatan-Anda-shutterstock_1503954347.jpg', description: 'Nanas manis dan segar', shelfLife: 'Tahan 5-6 hari di kulkas', sold: 0, stock: 50 },
    { id: 8, name: 'Mangga Manalagi', price: 38000, img: 'mangga-manalagi.jpg', description: 'Mangga segar penuh nutrisi', shelfLife: 'Tahan 4-5 hari di kulkas', sold: 0, stock: 50 }
];

let cart = [];


let reviews = JSON.parse(localStorage.getItem('productReviews')) || {};


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

const DISCOUNT_RATE = 0.1;

function getMedianPrice(productList = products) {
    const prices = productList
        .map(product => product.price)
        .sort((a, b) => a - b);

    const middle = Math.floor(prices.length / 2);
    if (prices.length % 2 === 0) {
        return (prices[middle - 1] + prices[middle]) / 2;
    }
    return prices[middle];
}

function getDiscountedPrice(product) {
    const median = getMedianPrice(products);
    if (product.price >= median) {
        const discounted = Math.round(product.price * (1 - DISCOUNT_RATE));
        return discounted % 2 === 0 ? discounted : discounted - 1;
    }
    return product.price;
}


function calculateAverageRating(productId) {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / productReviews.length;
}


function saveReview(productId, reviewData) {
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    reviews[productId].push(reviewData);
    localStorage.setItem('productReviews', JSON.stringify(reviews));
    

    const product = products.find(p => p.id === productId);
    if (product) {
        product.rating = calculateAverageRating(productId);
    }
}


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


window.closeReviewModal = function() {
    const modal = document.querySelector('.review-modal');
    if (modal) {
        modal.remove();
    }
};


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
    
    
    const reviewsContainer = document.getElementById(`reviews-container-${productId}`);
    if (reviewsContainer) {
        reviewsContainer.innerHTML = renderProductReviews(productId);
    }
    
    
    form.reset();
    
    alert('Terima kasih atas ulasan Anda!');
};

function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = 0;
    }
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    document.getElementById('visitor-count').textContent = count;
}


function renderProducts(productList = products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = productList.map(product => {
        const stockClass = product.stock > 10 ? 'card__stock--high' : product.stock > 5 ? 'card__stock--medium' : product.stock > 0 ? 'card__stock--low' : 'card__stock--out';
        const stockText = product.stock > 0 ? `${product.stock} tersisa` : 'Habis';
        const currentRating = calculateAverageRating(product.id);
        const stars = renderStars(currentRating);
        const reviewCount = (reviews[product.id] || []).length;
        const discountedPrice = getDiscountedPrice(product);
        const isDiscounted = discountedPrice < product.price;
        
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
                ${isDiscounted ? `<div class="card__price-row">
                  <div class="card__price-group">
                        <span class="card__price card__price--original">Rp ${product.price.toLocaleString('id-ID')}</span>
                        <span class="card__price card__price--discounted">Rp ${discountedPrice.toLocaleString('id-ID')} /kg</span>
                    </div>
                    <span class="discount-badge">Diskon ${Math.round(DISCOUNT_RATE * 100)}%</span>
                </div>` : `<span class="card__price">Rp ${product.price.toLocaleString('id-ID')} /kg</span>`}
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


document.addEventListener('DOMContentLoaded', function() {
  
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


window.sortProducts = function(sortType) {
    if (sortType === 'low-high') {
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);
        renderProducts(sortedProducts);
    } else if (sortType === 'high-low') {
        const sortedProducts = [...products].sort((a, b) => b.price - a.price);
        renderProducts(sortedProducts);
    } else {
        renderProducts(products);
    }
};


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

    cartItems.innerHTML = cart.map((item, index) => {
        const itemPrice = getDiscountedPrice(item);
        const hasDiscount = itemPrice < item.price;
        return `
        <div class="cart-item">
            <div class="cart-item__top">
                <span>${item.name}</span>
                <button class="btn btn--danger" onclick="removeFromCart(${index})">Batalkan</button>
            </div>
            <span>${hasDiscount ? `<span class="card__price card__price--original">Rp ${item.price.toLocaleString('id-ID')}</span> <span class="card__price card__price--discounted">Rp ${itemPrice.toLocaleString('id-ID')}</span>` : `Rp ${itemPrice.toLocaleString('id-ID')}`}</span>
            <p>${item.description}</p>
        </div>
    `;
    }).join('');

    const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item), 0);
    totalPrice.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}


document.getElementById('payment-method').addEventListener('change', function(e) {
    const paymentDetails = document.getElementById('payment-details');
    const bankTransferDetails = document.getElementById('bank-transfer-details');
    const ewalletDetails = document.getElementById('ewallet-details');
    
    if (e.target.value === 'transfer') {
        paymentDetails.style.display = 'block';
        bankTransferDetails.style.display = 'block';
        ewalletDetails.style.display = 'none';
    } else if (e.target.value === 'e-wallet') {
        paymentDetails.style.display = 'block';
        bankTransferDetails.style.display = 'none';
        ewalletDetails.style.display = 'block';
    } else {
        paymentDetails.style.display = 'none';
        bankTransferDetails.style.display = 'none';
        ewalletDetails.style.display = 'none';
    }
});


document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }
    
  
    const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item), 0);
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



