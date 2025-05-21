import { Food } from '../models/Food.js';

const API_URL = 'https://6820a339259dad2655ad21f6.mockapi.io/api/products';

function formatFoodToDb(foodData) {
  const formatedFood = {
    id: foodData.id,
    name: foodData.name,
    ingredients: foodData.ingredients,
    price: foodData.price,
    stock: foodData.stock,
    rating: foodData.rating,
    image_url: foodData.imageUrl,
  };
  return formatedFood;
}

export async function fetchFoods() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    return data.map(
      (food) =>
        new Food({
          id: food.id,
          name: food.name,
          ingredients: food.ingredients,
          price: food.price,
          stock: food.stock,
          rating: food.rating,
          imageUrl: food.image_url,
        }),
    );
  } catch (error) {
    console.error('Error al cargar los alimentos:', error);
  }
}

export async function createFood(foodData) {
  const formatedFood = formatFoodToDb(foodData);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formatedFood),
  });
  const newFood = await response.json();
  return new Food({ ...newFood, imageUrl: newFood.image_url });
}

export async function updateFood(foodData) {
  const url = `${API_URL}/${food.id}`;
  const formatedFood = formatFoodToDb(foodData);
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formatedFood),
  });
  const updatedFood = await response.json();

  return new Food({ ...updatedFood, imageUrl: updatedFood.image_url });
}

export async function deleteFood(id) {
  const url = `${API_URL}/${id}`;
  const response = await fetch(url, {
    method: 'Delete',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al eliminar la comida');
  
}
