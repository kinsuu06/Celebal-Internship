let currentRestaurantId = null;
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurants();

  document.getElementById('restaurant-list')
    .addEventListener('click', event => {
      if (event.target.matches('button')) {
        currentRestaurantId = event.target.dataset.id;
        fetchMenu(currentRestaurantId);
      }
    });

  document.getElementById('menu-list')
    .addEventListener('click', event => {
      if (event.target.matches('.add-to-cart')) {
        const itemName = event.target.dataset.name;
        const price = parseFloat(event.target.dataset.price);
        cart.push({ item_name: itemName, price });
        alert(`${itemName} added to cart`);
      }
    });

  document.getElementById('checkout-button')
    .addEventListener('click', placeOrder);
});

async function fetchRestaurants() {
  const res = await fetch('/api/restaurants');
  const data = await res.json();
  const list = document.getElementById('restaurant-list');
  list.innerHTML = data.map(r =>
    `<li>${r.name} — ${r.cuisine} <button data-id="${r.id}">View Menu</button></li>`
  ).join('');
}

async function fetchMenu(restaurantId) {
  const res = await fetch(`/api/restaurants/${restaurantId}/menu`);
  const data = await res.json();
  const list = document.getElementById('menu-list');
  list.innerHTML = data.map(item =>
    `<li>${item.item_name} — ₹${item.price.toFixed(2)} 
     <button class="add-to-cart" data-name="${item.item_name}" data-price="${item.price}">Add to Cart</button></li>`
  ).join('');
}

async function placeOrder() {
  if (!cart.length || !currentRestaurantId) {
    alert('Cart is empty or restaurant not selected.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurant_id: currentRestaurantId,
      items: cart,
      total_amount: total
    })
  });

  const result = await res.json();
  alert(result.message || 'Order placed!');
  cart = [];
}
