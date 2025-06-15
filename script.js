document.addEventListener('DOMContentLoaded', function() {
    // Загальні функції
    updateCartCount();
    
    // Фільтрація товарів на сторінці products.html
    if (document.querySelector('.filter')) {
        setupFilter();
    }
    
    // Додавання товару до кошика
    if (document.querySelector('.add-to-cart')) {
        setupAddToCart();
    }
    
    // Відображення кошика
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }
    
    // Видалення товару з кошика
    if (document.querySelector('.cart-item-remove')) {
        setupRemoveFromCart();
    }
    
    // Оформлення замовлення
    if (document.querySelector('.checkout-btn')) {
        setupCheckout();
    }
});

// Оновлення лічильника товарів у кошику
function updateCartCount() {
    const cart = getCart();
    const countElements = document.querySelectorAll('.cart-count');
    
    countElements.forEach(el => {
        el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    });
}

// Налаштування фільтра товарів
function setupFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Оновити активну кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фільтрувати товари
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// Налаштування додавання товару до кошика
function setupAddToCart() {
    const addButtons = document.querySelectorAll('.add-to-cart');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImg = productCard.querySelector('.product-img').src;
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg,
                quantity: 1
            });
            
            // Оновити лічильник кошика
            updateCartCount();
            
            // Показати сповіщення
            showAlert(`${productName} додано до кошика`);
        });
    });
}

// Додати товар до кошика
function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Отримати вміст кошика
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Відобразити товари в кошику
function displayCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartSummary.style.display = 'block';
    
    // Очистити контейнер перед додаванням нових елементів
    cartItemsContainer.innerHTML = '';
    
    // Додати кожен товар до кошика
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${item.price}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Оновити підсумок
    updateCartSummary();
    
    // Налаштувати кнопки видалення
    setupRemoveFromCart();
}

// Оновити підсумок кошика
function updateCartSummary() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/\s/g, '').replace('грн', ''));
        return total + (price * item.quantity);
    }, 0);
    
    document.querySelector('.total-items').textContent = totalItems;
    document.querySelector('.total-price').textContent = totalPrice.toLocaleString('uk-UA') + ' грн';
}

// Налаштування видалення товару з кошика
function setupRemoveFromCart() {
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            removeFromCart(productId);
            displayCartItems();
            updateCartCount();
        });
    });
}

// Видалити товар з кошика
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Налаштування оформлення замовлення
function setupCheckout() {
    const checkoutButton = document.querySelector('.checkout-btn');
    
    checkoutButton.addEventListener('click', function() {
        const cart = getCart();
        
        if (cart.length === 0) {
            showAlert('Кошик порожній', 'error');
            return;
        }
        
        // Тут можна додати логіку оформлення замовлення
        // Наприклад, відкрити форму оформлення або відправити дані на сервер
        
        // Після успішного оформлення:
        localStorage.removeItem('cart');
        displayCartItems();
        updateCartCount();
        showAlert('Замовлення успішно оформлено! Дякуємо за покупку!', 'success');
    });
}

// Показати сповіщення
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}