// ---------- shared helpers ----------
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ---------- product data ----------
const products = [
  { name: "Local Coffee Beans", category: "food",  price: 8.5, image: "images/coffee.jpg", inStock: false },
  { name: "Rice Crackers",      category: "food",  price: 10.0, image: "images/crackers.jpg", inStock: false },
  { name: "Handmade Basket",    category: "craft", price: 15.0, image: "images/basket.jpg", inStock: false }
];
products.push({ name: "ARUNA Candle", category: "aroma candle", price: 12, image: "images/arunacandle.png", inStock: true });
products.push({ name: "Banana Duct-Tape", category: "fruit", price: 120, image: "images/banana.jpg", inStock: true });
products[1].price = 20;
products.splice (1,0); 


// ---------- S15: cart state + storage ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const totalEl = document.getElementById("cart-total");
  if (!countEl || !totalEl) return;

  const count = cart.length;
  const total = cart.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  countEl.textContent = count;
  totalEl.textContent = total.toFixed(2);
}

updateCartUI();

// ---------- products: render ----------
const productList = document.getElementById("product-list");

function renderProducts(list) {
  if (!productList) return;

  productList.innerHTML = "";

  list.forEach(function (item) {
    const card = document.createElement("article");
    card.classList.add("product-card");
    if (!item.inStock) {
      card.classList.add("product-out")
    }

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p>Status: <strong>${item.inStock ? "In Stock" : "Out of Stock" }</strong></p>
      <p><strong>$${item.price.toFixed(2)} USD</strong></p>
      <button type="button"
              class="btn-add ${item.inStock ? "" : "out-of-stock"}"
              data-name="${item.name}"
              data-price="${item.price}" ${item.inStock ? "" : "disabled"}>
        ${item.inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    `;

    productList.appendChild(card);
  });
}

// ---------- search + sort (products page) ----------
const searchBox = document.getElementById("search-box");
const sortMenu = document.getElementById("sort");

function updateView() {
  if (!productList) return;

  const keyword = (searchBox ? searchBox.value : "").toLowerCase();
  const sortBy = (sortMenu ? sortMenu.value : "name");

  let view = products.filter(function (p) {
    return p.name.toLowerCase().includes(keyword);
  });

  if (sortBy === "price") {
    view.sort(function (a, b) { return a.price - b.price; });
  } else {
    view.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }

  const countEl = document.getElementById("product-count");
  if (countEl) countEl.textContent = `Showing ${view.length} products`;

  renderProducts(view);
}

// render once on products page
if (productList) updateView();

// listeners
if (searchBox) searchBox.addEventListener("input", updateView);
if (sortMenu) sortMenu.addEventListener("change", updateView);

// ---------- cart: handle Add to Cart clicks (works after re-render) ----------
document.addEventListener("click", function (e) {
  const btn =e.target.clost(".btn-add");
  if (!btn) return;
    
  //Stop if button is disabled (out of stock)
  if (e.target.disabled) return;

  const name = e.target.dataset.name;
  const price = Number(e.target.dataset.price);

  cart.push({ name: name, price: price });
  saveCart();
  updateCartUI();
});

// ---------- contact form validation ----------
const contactForm = document.getElementById("contact-form");
const statusElement = document.getElementById("contact-status");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
      if (statusElement) statusElement.textContent = "All fields are required.";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      if (statusElement) statusElement.textContent = "Please enter a valid email address.";
      return;
    }

    if (statusElement) statusElement.textContent = "Message sent successfully (demo only).";
    contactForm.reset();
  });
}

/*
function testAPI() {
fetch ("https://jsonplaceholder.typicode.com/users")
.then(function(response) {
  return response.json(); 
})
.then(function(data){
console.log("API Data:",data);
})
.catch(function(error) {
console.log("Error:", error);
});
}
*/