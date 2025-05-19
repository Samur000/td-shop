const basketItemsContainer = document.querySelector('.basket-items');
const emptyBasketMessage = document.querySelector('.basket-empty');
const checkoutButton = document.querySelector('.checkout-btn');
const basketCounter = document.querySelector('.basket-counter');

// Инициализация корзины из localStorage
let basketTovars = [];

try {
    const basketData = localStorage.getItem('basketGoods');
    basketTovars = basketData ? JSON.parse(basketData) : [];
} catch (e) {
    console.error('Error parsing basket data:', e);
    basketTovars = [];
}


// Функции для работы с корзиной
function calculateTotalAmount() {
    return basketTovars.reduce((total, product) => total + (parseInt(product.price) * product.count), 0);
}

function updateBasketState() {
    const isEmpty = basketTovars.length === 0;
    emptyBasketMessage.style.display = isEmpty ? 'flex' : 'none';
    basketItemsContainer.style.display = isEmpty ? 'none' : 'block';
    
    if (isEmpty) {
        checkoutButton.style.background = '#eee';
        checkoutButton.style.color = '#222';
        checkoutButton.style.cursor = 'no-drop';
    } else {
        checkoutButton.style.background = '#1557c9';
        checkoutButton.style.color = '#fff';
        checkoutButton.style.cursor = 'pointer';
    }
}

function getBasketItemTemplate(product) {
    const imgUrls = product.imgUrl.split(",");
    return `
    <div class="basket-item">
      <div class="item-img">
      <img src="${imgUrls[0]}" alt="${product.title}">
      </div>
      <div class="item-info">
        <div class="item-title">${product.title}</div>
        <div class="item-price">${product.price} ₽</div>
      </div>
      <div class="item-controls">
        <button class="quantity-btn minus" data-id="${product.id}">-</button>
        <span class="quantity">${product.count}</span>
        <button class="quantity-btn plus" data-id="${product.id}">+</button>
        <button class="remove-btn" data-id="${product.id}">
          <img src="https://cdn-icons-png.flaticon.com/512/3096/3096687.png" alt="Удалить">
        </button>
      </div>
    </div>`;
}

function increaseProductQuantity(productId) {
    const product = basketTovars.find(item => item.id === productId);
    if (product) {
        product.count += 1;
        saveAndRenderBasket();
    }
}

function decreaseProductQuantity(productId) {
    const productIndex = basketTovars.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (basketTovars[productIndex].count > 1) {
            basketTovars[productIndex].count -= 1;
        } else {
            basketTovars.splice(productIndex, 1);
        }
        saveAndRenderBasket();
    }
}

function removeProductFromBasket(productId) {
    basketTovars = basketTovars.filter(item => item.id !== productId);
    saveAndRenderBasket();
}

function addProductToBasket(productId) {
    if (!window.myTovars) {
        console.error('window.myTovars is not defined');
        return;
    }
    
    const product = window.myTovars.find(item => item.id === productId);
    if (product) {
        const existingProduct = basketTovars.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.count += 1;
        } else {
            basketTovars.push({ ...product, count: 1 });
        }
        saveAndRenderBasket();
    }
}


function saveAndRenderBasket() {
    localStorage.setItem('basketGoods', JSON.stringify(basketTovars));
    renderBasket();
}

function renderBasket() {
    basketItemsContainer.innerHTML = '';
    basketTovars.forEach(product => {
        basketItemsContainer.insertAdjacentHTML('beforeend', getBasketItemTemplate(product));
    });

    document.querySelector('.total-price').textContent = `${calculateTotalAmount().toLocaleString()} ₽`;
    basketCounter.textContent = basketTovars.length
    updateBasketState();

    // Привязываем обработчики событий
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', () => increaseProductQuantity(btn.dataset.id));
    });

    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', () => decreaseProductQuantity(btn.dataset.id));
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeProductFromBasket(btn.dataset.id));
    });
}

// Инициализация корзины
renderBasket();

// Делаем функцию доступной глобально
window.addProductToBasket = addProductToBasket;