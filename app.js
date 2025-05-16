const cardsContainer = document.querySelector('.cards');
const addCardContainer = document.querySelector('.add-card');
const currentUrl = window.location.href;
const isAdmin = currentUrl.includes('?admin');
const modalUpdateOverlay = document.querySelector('.update-modal-overlay')

if (isAdmin) {
  addCardContainer.style.display = 'flex';
} else {
  addCardContainer.style.display = 'none';
}

// Инициализация товаров из localStorage или изначального массива
window.myTovars = JSON.parse(localStorage.getItem('tovars')) || [...window.tovars];

function addNewProduct() {
  const inputs = addCardContainer.querySelectorAll('input');
  const newProduct = {};

  inputs.forEach(input => {
    newProduct[input.dataset.name] = input.value;
  });

  if (!newProduct.title || !newProduct.subtitle || !newProduct.imgUrl || !newProduct.price || !newProduct.id) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  if (myTovars.some(product => product.id === newProduct.id)) {
    alert('Товар с таким ID уже существует');
    return;
  }

  myTovars.push(newProduct);
  localStorage.setItem('tovars', JSON.stringify(myTovars));

  inputs.forEach(input => {
    input.value = '';
  });

  renderProducts();
}

document.getElementById('add-card-btn').addEventListener('click', addNewProduct);

function getProductCardTemplate(product) {
  const imgUrls = product.imgUrl.split(",");
  return `
    <div class="card" id="${product.id}">
      <div class="title">${product.title}</div>
      <div class="img">
        <img src="${imgUrls[0]}" alt="${product.title}" onclick="window.location.href='tovar.html?id=${product.id}'">
      </div>
      <div class="price">${product.price} ₽</div>
      ${isAdmin ? `
        <button class="update-btn" data-id="${product.id}">Изменить</button>
        <button class="delete-btn" data-id="${product.id}">Удалить</button>
      ` : `
        <button class="basket-btn" data-id="${product.id}">Добавить в корзину</button>
        <button class="wishlist-btn" data-id="${product.id}" onclick="window.location.href='pages/tovar.html?id=${product.id}'">🔫</button>
      `}
    </div>
  `;
}

// Удаление карточек
function deleteProduct(id) {
  const index = myTovars.findIndex(tovar => tovar.id === id);
  const basketIindex = basketTovars.findIndex(tovar => tovar.id === id);
  if (index !== -1) {
    myTovars.splice(index, 1);
    localStorage.setItem('tovars', JSON.stringify(myTovars));
    renderProducts();
  }
  if (basketIindex !== -1) {
    basketTovars.splice(index, 1);
    localStorage.setItem('tovars', JSON.stringify(basketTovars));
    renderBasket();
  }
}

// Изменение карточек
let tovarId
function updateProduct(id) {
  const index = myTovars.findIndex(tovar => tovar.id === id);
  if (index !== -1) {
    modalUpdateOverlay.innerHTML = `
      <div class="update-modal" id=${myTovars[index].id}>
            <button data-inp="closed">X</button>
            <label for="">ссылка на зображение</label>
            <input id="upd-url" type="text" value="${myTovars[index].imgUrl}">
            <label for="">Название товара</label>
            <input id="upd-title" type="text" value="${myTovars[index].title}">
            <label for="">Описание товара</label>
            <input id="upd-subtitle" type="text" value="${myTovars[index].subtitle}">
            <label for="">Цена товара</label>
            <input id="upd-price" type="text" value="${myTovars[index].price}">
            <div>
                <button data-inp="apply">Прнннименить</button>
                <button data-inp="cancel">Отмена</button>
            </div>
        </div>
    `
    tovarId = myTovars[index].id
    modalUpdateOverlay.style.display = 'flex'
    document.body.style.overflow = 'hidden';
  }
}

function renderProducts() {
  cardsContainer.innerHTML = '';

  if (myTovars.length === 0) {
    cardsContainer.innerHTML = `
    <h5 style="text-align: center; width: 100%;">Товаров нет :(</h5>
    <h4 style="text-align: center; width: 100%;">Товаров нет :(</h4>
    <h3 style="text-align: center; width: 100%;">Товаров нет :(</h3>
    <h2 style="text-align: center; width: 100%;">Товаров нет :(</h2>
    <h1 style="text-align: center; width: 100%;">Товаров нет :(</h1>
    <h1 style="text-align: center; width: 100%;">Товаров нет :(</h1>
    <h2 style="text-align: center; width: 100%;">Товаров нет :(</h2>
    <h3 style="text-align: center; width: 100%;">Товаров нет :(</h3>
    <h4 style="text-align: center; width: 100%;">Товаров нет :(</h4>
    <h5 style="text-align: center; width: 100%;">Товаров нет :(</h5>
    `
  } else {
    myTovars.forEach(product => {
      cardsContainer.insertAdjacentHTML('beforeend', getProductCardTemplate(product));
    });
  }

  // Привязываем обработчики для кнопок корзины
  document.querySelectorAll('.basket-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      addProductToBasket(button.dataset.id);
    });
  });

  // Привязываем обработчики для кнопок удаления
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      deleteProduct(button.dataset.id);
    });
  });
  document.querySelectorAll('.update-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      updateProduct(button.dataset.id);
    });
  });
}

// Инициализация при загрузке
renderProducts();

// Обработка добавления в корзину из страницы товара
if (localStorage.getItem('addToBasket')) {
  const productId = localStorage.getItem('addToBasket');
  localStorage.removeItem('addToBasket');
  addProductToBasket(productId);
}