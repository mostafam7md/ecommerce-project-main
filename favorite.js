function renderFavorites() {
  const container = document.querySelector(".favorite-products");
  container.innerHTML = "";
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorite products yet.</p>";
    return;
  }
  favorites.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product-container";
    div.innerHTML = `
      <div class="product-photo">
        <img src="${product.img}" alt="Product Photo" />
      </div>
      <div class="product-info">
        <div class="product-description">${product.description}</div>
        <div class="product-details-row">
          <button class="add-to-cart-btn">Add to Cart</button>
          <div class="product-price">${product.price}</div>
          <button class="love-btn active" aria-label="Remove from Favorite">
            <span class="love-icon">&#10084;</span>
          </button>
        </div>
      </div>
    `;
    div.querySelector(".love-btn").addEventListener("click", function () {
      removeFavorite(product.id);
      div.remove();
      if (document.querySelectorAll(".product-container").length === 0) {
        container.innerHTML = "<p>No favorite products yet.</p>";
      }
    });
    container.appendChild(div);
  });
}

function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  favorites = favorites.filter((p) => p.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

document.addEventListener("DOMContentLoaded", renderFavorites);
