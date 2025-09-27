document.addEventListener("DOMContentLoaded", function () {
  const cartSummary = document.getElementById("checkout-cart-summary");
  const form = document.getElementById("checkout-form");
  const orderSuccess = document.getElementById("order-success");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }

  function renderCartSummary() {
    const cart = getCart();
    if (cart.length === 0) {
      cartSummary.innerHTML = "<p>Your cart is empty.</p>";
      form.style.display = "none";
      return;
    }
    let total = 0;
    let html = '<div class="checkout-cart-items">';
    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      html += `
                <div class="checkout-cart-item">
                    <img src="${item.image}" alt="${
        item.name
      }" class="checkout-cart-img">
                    <div class="checkout-cart-info">
                        <div class="checkout-cart-title">${item.name}</div>
                        <div class="checkout-cart-qty">Qty: ${
                          item.quantity
                        }</div>
                        <div class="checkout-cart-price">Subtotal: $${subtotal.toFixed(
                          2
                        )}</div>
                    </div>
                </div>
            `;
    });
    html += `</div><div class="checkout-cart-total">Total: $${total.toFixed(
      2
    )}</div>`;
    cartSummary.innerHTML = html;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Basic validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const address = form.address.value.trim();
    let valid = true;
    if (!name) {
      form.name.classList.add("input-error");
      valid = false;
    } else {
      form.name.classList.remove("input-error");
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      form.email.classList.add("input-error");
      valid = false;
    } else {
      form.email.classList.remove("input-error");
    }
    if (!address) {
      form.address.classList.add("input-error");
      valid = false;
    } else {
      form.address.classList.remove("input-error");
    }
    if (!valid) return;
    // Simulate order submission
    orderSuccess.style.display = "block";
    orderSuccess.textContent =
      "Thank you, " + name + "! Your order has been placed.";
    form.style.display = "none";
    localStorage.removeItem("cart");
  });

  renderCartSummary();
});
