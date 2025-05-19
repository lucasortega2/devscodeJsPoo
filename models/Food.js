export class Food {
  constructor({ id, name, ingredients, price, stock, rating, imageUrl }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.ingredients = ingredients;
    this.price = price;
    this.stock = stock;
    this.rating = rating;
    this.imageUrl = imageUrl;
  }
}
