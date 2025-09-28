let allProducts = [];
let categories = [];
let productsList;
let categoryFilter;
let productSearch;

document.addEventListener("DOMContentLoaded", function () {
  productsList = document.getElementById("productsList");
  categoryFilter = document.getElementById("categoryFilter");
  productSearch = document.getElementById("productSearch");

  fetch("https://dummyjson.com/products?limit=20&skip=82")
    .then((res) => res.json())
    .then((data) => {
      allProducts = data.products;
      categories = Array.from(new Set(allProducts.map((p) => p.category)));
      BeachCollection();
      renderCategoryOptions();
      renderProducts(allProducts);
    });

  function renderCategoryOptions() {
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categoryFilter.appendChild(opt);
    });
  }

  categoryFilter.addEventListener("change", filterAndRender);
  productSearch.addEventListener("input", filterAndRender);

  function filterAndRender() {
    let filtered = allProducts;
    const cat = categoryFilter.value;
    const search = productSearch.value.trim().toLowerCase();
    if (cat !== "all") {
      filtered = filtered.filter((p) => p.category === cat);
    }
    if (search) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(search));
    }
    renderProducts(filtered);
  }
});

function renderProducts(products) {
  productsList.innerHTML = "";
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product-container";
    div.dataset.productId = product.id;
    div.innerHTML = `
      <div class="product-photo">
        <img src="${product.thumbnail}" alt="${product.title}" />
      </div>
      <div class="product-info">
        <div class="product-description">${product.title}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-details-row">
          <button class="add-to-cart-btn">Add to Cart</button>
          <div class="product-price">$${product.price}</div>
          <button class="love-btn" aria-label="Add to Favorite">
            <span class="love-icon">&#10084;</span>
          </button>
        </div>
      </div>
    `;
    const loveBtn = div.querySelector(".love-btn");
    if (favorites.some((f) => f.id == product.id)) {
      loveBtn.classList.add("active");
    }
    loveBtn.addEventListener("click", function () {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      loveBtn.classList.toggle("active");
      if (loveBtn.classList.contains("active")) {
        if (!favorites.some((p) => p.id == product.id)) {
          favorites.push({
            id: product.id,
            img: product.thumbnail,
            description: product.title,
            price: "$" + product.price,
            category: product.category,
          });
          localStorage.setItem("favorites", JSON.stringify(favorites));
        }
      } else {
        favorites = favorites.filter((p) => p.id != product.id);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    });

    const addToCartBtn = div.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", function () {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);
      if (!existing) {
        cart.push({
          id: product.id,
          name: product.title,
          price: product.price,
          description: product.description,
          stock: product.stock,
          image: product.thumbnail,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      addToCartBtn.textContent = "Added!";
      addToCartBtn.disabled = true;
      setTimeout(() => {
        addToCartBtn.textContent = "Add to Cart";
        addToCartBtn.disabled = false;
      }, 1000);
    });

    productsList.appendChild(div);
  });
}

function BeachCollection() {
  const ExploreCollectionBtn = document.getElementById("beachCollectionBtn");
  ExploreCollectionBtn.addEventListener("click", function () {
    let filtered = allProducts;
    filtered = filtered.filter((p) => p.category === "mens-shirts");
    renderProducts(filtered);
  });
}
