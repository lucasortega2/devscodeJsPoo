// app.js
import { FoodManager } from './services/FoodManager.js';

const foodManager = new FoodManager();
const foodList = document.getElementById('food-list');
const searchInput = document.getElementById('search');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const stockFilter = document.getElementById('stock-filter');

function renderFoods(foods) {
  foodList.innerHTML = '';
  foods.forEach((food) => {
    const card = document.createElement('div');
    card.className = 'food-card';
    // Imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    const image = document.createElement('img');
    image.src = food.imageUrl;
    image.alt = food.name;
    image.className = 'food-img';
    imageContainer.append(image);

    // Contenedor de la info textual
    const infoWrapper = document.createElement('div');
    infoWrapper.className = 'info-wrapper';

    // Título
    const titleRow = document.createElement('div');
    titleRow.className = 'title-row'; // display: flex, justify-between

    const title = document.createElement('h3');
    title.className = 'food-title';
    title.textContent = food.name;

    // Botones de acción
    const actions = document.createElement('div');
    actions.className = 'food-actions'; // podés darle gap y tamaño

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️'; // o '<i class="fa fa-pencil"></i>'
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => updateFood(food));
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.classList.add('delete-btn');

    actions.append(editBtn, deleteBtn);
    titleRow.append(title, actions);

    // Descripción
    const descWrapper = document.createElement('div');
    descWrapper.className = 'food-description';
    const descTitle = document.createElement('p');
    descTitle.classList = 'title-description';
    descTitle.textContent = 'Description:';
    const ingredients = document.createElement('p');
    ingredients.textContent = food.ingredients;
    descWrapper.append(descTitle, ingredients);

    const priceStockWrapper = document.createElement('div');
    priceStockWrapper.className = 'price-stock';

    // Precio
    const price = document.createElement('p');
    price.innerHTML = `<strong>Price: $${food.price.toFixed(2)}</strong>`;
    price.style.fontSize = '1.2rem';

    // Agrupar texto + stock
    const stockWrapper = document.createElement('div');
    stockWrapper.className = 'stock-wrapper';

    const textStock = document.createElement('p');
    textStock.textContent = 'Availability:';
    textStock.style.fontWeight = 'bold';

    const stock = document.createElement('p');
    stock.textContent = `${food.stock ? 'In Stock' : 'Out Of Stock'}`;
    stock.classList.add('food-stock', food.stock ? 'inStock' : 'outOfStock');

    // Agregar a contenedor de stock
    stockWrapper.append(textStock, stock);

    // --- Estrellas según food.rating (valor de 0 a 5) ---
    const ratingWrapper = document.createElement('div');
    ratingWrapper.className = 'rating';

    const rating = Math.round(food.rating || 0); // redondeamos
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = i <= rating ? '★' : '☆'; // completada o vacía
      ratingWrapper.appendChild(star);
    }

    // Agregar ambos al wrapper principal
    priceStockWrapper.append(price, stockWrapper, ratingWrapper);

    // Armar info textual
    infoWrapper.append(titleRow, descWrapper, priceStockWrapper);

    // Armar estructura visual

    card.append(imageContainer, infoWrapper);
    foodList.appendChild(card);
  });
}

function applyFilters() {
  const filters = {
    search: searchInput.value,
    min: Number(minPriceInput.value) || 0,
    max: Number(maxPriceInput.value) || 30000,
    stock: stockFilter.value,
  };
  const filteredFoods = foodManager.getFilteredFoods(filters);
  renderFoods(filteredFoods);
}

searchInput.addEventListener('input', applyFilters);
minPriceInput.addEventListener('input', applyFilters);
maxPriceInput.addEventListener('input', applyFilters);
stockFilter.addEventListener('change', applyFilters);

(async () => {
  await foodManager.getAllFoods();
  applyFilters(); // renderiza con los filtros iniciales
})();
