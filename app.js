const cardsContainer = document.querySelector('.cards');
const addCardContainer = document.querySelector('.add-card');
const currentUrl = window.location.href;
const isAdmin = currentUrl.includes('?admin');
const modalProductBody = document.querySelector('.modal-overlay')
const modalBody = document.querySelector('.modal-tovar')
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

document.querySelector('.modal-overlay').addEventListener('click', (event) => {
  if (event.target.className === 'modal-overlay' || event.target.className === 'btn-close') {
    modalProductBody.style.display = 'none'
    document.body.style.overflow = ''; // Восстанавливаем скролл

  }
})

document.getElementById('add-card-btn').addEventListener('click', addNewProduct);

function getProductCardTemplate(product) {
  const imgUrls = product.imgUrl.split(",");
  return `
    <div class="card" id="${product.id}">
      <div class="title">${product.title}</div>
      <div class="img">

        <img src="${imgUrls[0]}" alt="${product.title}">
        
      </div>
      <div class="price">${product.price} ₽</div>
      ${isAdmin ? `
        <button class="update-btn" data-id="${product.id}">Изменить</button>
        <button class="delete-btn" data-id="${product.id}">Удалить</button>
      ` : `
        <button class="basket-btn" data-id="${product.id}">Добавить в корзину</button>
        <button class="wishlist-btn" data-id="${product.id}">🔫</button>
      `}
    </div>
  `;
}
// Удаление карточек
function deleteProduct(id) {
  const index = myTovars.findIndex(tovar => tovar.id === id);
  if (index !== -1) {
    myTovars.splice(index, 1);
    localStorage.setItem('tovars', JSON.stringify(myTovars));
    renderProducts();
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
            <img src="${myTovars[index].imgUrl}" alt="">
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

const cactusBtns = document.querySelectorAll('.wishlist-btn')
cactusBtns.forEach((el) => {
  el.onclick = () => {
    modalProductBody.style.display = 'block'
    document.body.style.overflow = 'hidden'; // Блокируем скролл

    myTovars.forEach(elem => {
      const imgUrls = elem.imgUrl.split(",");
      if (elem.id === el.dataset.id) {
        modalBody.innerHTML = `
            <button class="btn-close">X</button>
            <div class="slider-container">
              <div class="slider">
                ${imgUrls.map(url => `<img src="${url}" alt="${elem.title}" class="slide">`).join('')}
              </div>
              ${imgUrls.length > 1 ? `
                <button class="slider-prev">❮</button>
                <button class="slider-next">❯</button>
                <div class="slider-dots">
                  ${imgUrls.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
                </div>
              ` : ''}
            </div>
            <div class="title">${elem.title}</div>
            <div class="subtitle">${elem.subtitle}</div>
            <div class="price">${elem.price} ₽</div>
        `;
        if (imgUrls.length > 1) {
          const slider = modalBody.querySelector('.slider');
          const slides = modalBody.querySelectorAll('.slide');
          const prevBtn = modalBody.querySelector('.slider-prev');
          const nextBtn = modalBody.querySelector('.slider-next');
          const dots = modalBody.querySelectorAll('.dot');

          let currentSlide = 0;

          // Функция для обновления слайдера
          const updateSlider = () => {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === currentSlide);
            });
          };

          // Кнопки "Вперёд" и "Назад"
          nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
          });

          prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
          });

          // Навигация по точкам
          dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
              currentSlide = i;
              updateSlider();
            });
          });
        }
      }
    })
  }
})


