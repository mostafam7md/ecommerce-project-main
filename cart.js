document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }

  function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.textContent = "$0.00";
      return;
    }
    cart.forEach((item, idx) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      if (item.quantity > item.stock) {
        item.quantity = item.stock;
        setCart(cart);
      }
      const leftProducts = item.stock > 0 ? item.stock - item.quantity : 0;
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-img">
                <div class="cart-item-info">
                    <h3>${item.name}</h3><br>
                    <p>${item.description}</p><br> 
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p> left in Stock: ${leftProducts}</p>

                    <div class="cart-item-controls">
                        <button class="decrease" data-idx="${idx}">-</button>
                        <input type="number" min="1" value="${
                          item.quantity
                        }" data-idx="${idx}" class="cart-qty-input">
                        <button class="increase" data-idx="${idx}">+</button>
                        <button class="remove" data-idx="${idx}">Remove</button>
                    </div>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
            `;
      cartItemsContainer.appendChild(itemDiv);
    });
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  cartItemsContainer.addEventListener("click", function (e) {
    const cart = getCart();
    if (e.target.classList.contains("remove")) {
      const idx = +e.target.dataset.idx;
      cart.splice(idx, 1);
      setCart(cart);
      renderCart();
    } else if (e.target.classList.contains("increase")) {
      const idx = +e.target.dataset.idx;
      cart[idx].quantity++;
      setCart(cart);
      renderCart();
    } else if (e.target.classList.contains("decrease")) {
      const idx = +e.target.dataset.idx;
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
        setCart(cart);
        renderCart();
      }
    }
  });

  cartItemsContainer.addEventListener("change", function (e) {
    if (e.target.classList.contains("cart-qty-input")) {
      const cart = getCart();
      const idx = +e.target.dataset.idx;
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      cart[idx].quantity = val;
      setCart(cart);
      renderCart();
    }
  });

  renderCart();
});
