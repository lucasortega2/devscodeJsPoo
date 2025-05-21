// app.js
import { FoodManager } from './services/FoodManager.js';

const foodManager = new FoodManager();
const foodList = document.getElementById('food-list');
const searchInput = document.getElementById('search');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const stockFilter = document.getElementById('stock-filter');
const createFoodButton = document.getElementById('create-food');
createFoodButton.addEventListener('click', () => openEditModal());

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
    editBtn.addEventListener('click', () => openEditModal(food));
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => openDeleteModal(food));

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

function clearEditForm() {
  editIdInput.value = '';
  editNameInput.value = '';
  editIngredientsInput.value = '';
  editPriceInput.value = '';
  editStockInput.value = 'true';
  editRatingInput.value = '1'; 
  editImageInput.value = '';
}

searchInput.addEventListener('input', applyFilters);
minPriceInput.addEventListener('input', applyFilters);
maxPriceInput.addEventListener('input', applyFilters);
stockFilter.addEventListener('change', applyFilters);

(async () => {
  await foodManager.getAllFoods();
  applyFilters(); // renderiza con los filtros iniciales
})();

// Modal elements
const editModal = document.getElementById('edit-modal');
const closeBtn = editModal.querySelector('.close');
const editForm = document.getElementById('edit-form');
const editIdInput = document.getElementById('edit-id');
const editNameInput = document.getElementById('edit-name');
const editIngredientsInput = document.getElementById('edit-ingredients');
const editPriceInput = document.getElementById('edit-price');
const editStockInput = document.getElementById('edit-stock');
const editRatingInput = document.getElementById('edit-rating');
const editImageInput = document.getElementById('edit-image');

// Delete modal elements
const deleteModal = document.getElementById('delete-food-modal');
const cancelDeleteButton = document.getElementById('cancel-delete-button');
const confirmDeleteButton = document.getElementById('confirm-delete-button');
let foodToDelete = null;
// Open modal and populate form with food data
function openEditModal(food) {
  if (food) {
    editIdInput.value = food.id;
    editNameInput.value = food.name;
    editIngredientsInput.value = food.ingredients;
    editPriceInput.value = food.price;
    editStockInput.value = food.stock.toString();
    editRatingInput.value = food.rating;
    editImageInput.value = food.imageUrl;
  } else {
    clearEditForm();
  }
  editModal.style.display = 'flex';
}

// Function to open the delete confirmation modal
function openDeleteModal(food) {
  foodToDelete = food;
  deleteModal.style.display = 'flex';
}

// Close modal when clicking on X
closeBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Close delete modal when clicking on Cancel
cancelDeleteButton.addEventListener('click', () => {
  deleteModal.style.display = 'none';
  foodToDelete = null;
});

// Handle delete confirmation
confirmDeleteButton.addEventListener('click', async () => {
  if (foodToDelete) {
    try {
      await foodManager.deleteFood(foodToDelete.id);
      deleteModal.style.display = 'none';
      foodToDelete = null;
      applyFilters(); // Refresh the food list
    } catch (error) {
      console.error('Error al eliminar el alimento:', error);
      alert('Hubo un error al eliminar la comida. Por favor, inténtalo de nuevo.');
    }
  }
});

// Close modals when clicking outside of them
window.addEventListener('click', (event) => {
  if (event.target === editModal) {
    editModal.style.display = 'none';
  }
  if (event.target === deleteModal) {
    deleteModal.style.display = 'none';
    foodToDelete = null;
  }
});

// Handle form submission
editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('edit-id').value;
  // Create updated food object from form data
  const food = {
    id: editIdInput.value,
    name: editNameInput.value,
    ingredients: editIngredientsInput.value,
    price: parseFloat(editPriceInput.value),
    stock: editStockInput.value === 'true',
    rating: parseFloat(editRatingInput.value),
    imageUrl: editImageInput.value,
  };

  try {
    if (id) {
      await foodManager.updateFood(food);
    } else {
      await foodManager.addFood(food);
    }
    // Close modal and refresh the food list
    editModal.style.display = 'none';
    applyFilters();
    console.log(foodManager.foods);
  } catch (error) {
    console.error('Error al actualizar el alimento:', error);
    alert(
      'Hubo un error con la carga de la comida. Por favor, inténtalo de nuevo.',
    );
  }
});
