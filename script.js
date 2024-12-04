document.addEventListener('DOMContentLoaded', () => {
  // Login/Logout button functionality
  const authButton = document.getElementById("login-button"); // Changed to match your button's ID

  if (authButton) {
      // Check login state from localStorage
      let isLoggedIn = localStorage.getItem("loggedIn") === "true";

      // Update button text based on login state
      authButton.textContent = isLoggedIn ? "LOGOUT" : "LOGIN";

      // Add event listener for button click 
      authButton.addEventListener("click", () => {
          if (isLoggedIn) {
              // Handle logout
              localStorage.setItem("loggedIn", "false");
              alert("You are now logged out!");
              authButton.textContent = "LOGIN";
              isLoggedIn = false; // Update state
          } else {
              // Handle login
              localStorage.setItem("loggedIn", "true");
              alert("You are now logged in!");
              authButton.textContent = "LOGOUT";
              isLoggedIn = true; // Update state
          }
      });
  }

  // "See More" button functionality
  const seeMoreButton = document.getElementById("see-more");
  if (seeMoreButton) {
      seeMoreButton.addEventListener("click", () => {
          window.location.href = "shop.html";
      });
  }

  // Cart functionality
  const items = document.querySelectorAll(".items");

  items.forEach(item => {
      const minusButton = item.querySelector(".minus");
      const plusButton = item.querySelector(".plus");
      const quantityDisplay = item.querySelector(".quantity");
      const addToCartButton = item.querySelector(".add-to-cart");

      let quantity = 0;

      // Plus button functionality
      plusButton.addEventListener("click", () => {
          quantity++;
          quantityDisplay.textContent = quantity;
      });

      // Minus button functionality
      minusButton.addEventListener("click", () => {
          if (quantity > 0) {
              quantity--;
              quantityDisplay.textContent = quantity;
          }
      });

      // Add to cart button functionality
      addToCartButton.addEventListener("click", () => {
          if (quantity > 0) {
              const cartItem = {
                  id: item.getAttribute("data-ID"),
                  name: item.querySelector(".name").textContent,
                  price: parseFloat(item.querySelector(".price").textContent.replace("$", "")),
                  quantity: quantity,
                  total: quantity * parseFloat(item.querySelector(".price").textContent.replace("$", "")),
                  image: item.querySelector(".img img").src
              };

              let cart = JSON.parse(localStorage.getItem("cart")) || [];

              const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.getAttribute("data-ID"));

              if (existingItemIndex > -1) {
                  cart[existingItemIndex].quantity += quantity;
                  cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
              } else {
                  cart.push(cartItem);
              }

              localStorage.setItem("cart", JSON.stringify(cart));

              quantity = 0;
              quantityDisplay.textContent = quantity;

              alert(`${cartItem.name} has been added to your cart!`);
          } else {
              alert("Please select at least 1 item before adding to cart.");
          }
      });
  });

  // Call renderCart to display cart items
  renderCart();
});

// Improved renderCart function with dynamic element creation and error handling
function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");

  if (!cartItemsDiv) {
      console.error();
      return;
  }

  cartItemsDiv.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      return;
  }

  let totalPrice = 0;

  cart.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <p><strong>${item.name}</strong></p>
          <p>Price: $${item.price.toFixed(2)}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Total: $${item.total.toFixed(2)}</p>
      `;
      cartItemsDiv.appendChild(itemDiv);
      totalPrice += item.total;
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total";
  totalDiv.innerHTML = `<p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>`;
  cartItemsDiv.appendChild(totalDiv);
}
