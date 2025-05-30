import {
  createFood,
  deleteFood as deleteFoodFromApi,
  fetchFoods,
  updateFood as updateFoodFromApi,
} from './db.js';

export class FoodManager {
  constructor() {
    this.foods = [];
  }

  async getAllFoods() {
    try {
      this.foods = await fetchFoods();
    } catch (error) {
      console.error(error);
    }
  }

  getFilteredFoods({ search = '', min = 0, max = 30000, stock = 'all' }) {
    return this.foods.filter((food) => {
      const matchSearch = food.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchPrice = food.price >= min && food.price <= max;
      const matchStock =
        stock === 'all' ||
        (stock === 'in' && food.stock) ||
        (stock === 'out' && !food.stock);
      return matchSearch && matchPrice && matchStock;
    });
  }
  async addFood(foodData) {
    const newFood = await createFood(foodData);
    this.foods.push(newFood);
  }

  async updateFood(food) {
    const updatedFood = await updateFoodFromApi(food);

    this.foods = this.foods.map((item) =>
      item.id === updatedFood.id ? updatedFood : item,
    );
  }

  async deleteFood(id) {
    try {
      const isDeleted = await deleteFoodFromApi(id);
      this.foods = this.foods.filter((food) => food.id !== id)
    } catch (error) {
      console.error(error);
    }
  }
}
