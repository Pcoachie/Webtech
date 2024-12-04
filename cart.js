document.addEventListener("DOMContentLoaded", () => {
    // Initialize cart data if not already present in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([
            { id: '1', name: 'Perfume A', quantity: 2, price: 25.00, total: 50.00, image: 'perfume-a.jpg' },
            { id: '2', name: 'Perfume B', quantity: 1, price: 40.00, total: 40.00, image: 'perfume-b.jpg' }
        ]));
    }

    const cartItemsDiv = document.getElementById("cart-items"); // Container for cart items
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve cart items from localStorage

    // Display cart items
    function renderCart() {
        cartItemsDiv.innerHTML = ""; // Clear previous content
        let totalPrice = 0;

        if (cart.length > 0) {
            cart.forEach(cartItem => {
                totalPrice += cartItem.total;

                // Create item element with a checkbox
                const itemDiv = document.createElement("div");
                itemDiv.className = "cart-item";
                itemDiv.innerHTML = `
                    <input type="checkbox" class="select-item" data-id="${cartItem.id}">
                    <img src="${cartItem.image}" alt="${cartItem.name}" class="cart-item-image">
                    <p><strong>Item:</strong> ${cartItem.name}</p>
                    <p><strong>Quantity:</strong> ${cartItem.quantity}</p>
                    <p><strong>Price per Item:</strong> $${cartItem.price.toFixed(2)}</p>
                    <p><strong>Total Price:</strong> $${cartItem.total.toFixed(2)}</p>
                    <button class="remove-item" data-id="${cartItem.id}">Remove Item</button>
                `;
                cartItemsDiv.appendChild(itemDiv);
            });

            // Append total price
            const totalDiv = document.createElement("div");
            totalDiv.className = "cart-total";
            totalDiv.innerHTML = `<p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>`;
            cartItemsDiv.appendChild(totalDiv);
        } else {
            cartItemsDiv.innerHTML = "<p>Your cart is empty. Add items to see them here.</p>";
        }
    }

    // Remove item from cart
    document.addEventListener("click", event => {
        if (event.target.classList.contains("remove-item")) {
            const itemId = event.target.getAttribute("data-id");

            // Confirm removal
            if (confirm("Are you sure you want to remove this item?")) {
                // Update cart
                cart = cart.filter(item => item.id !== itemId);
                localStorage.setItem("cart", JSON.stringify(cart));

                // Re-render the cart
                renderCart();
            }
        }
    });

    // Clear cart functionality
    const clearCartButton = document.getElementById("clear-cart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear the cart?")) {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            }
        });
    }

    // Place Order functionality
    const placeOrderButton = document.getElementById("place-order");
    if (placeOrderButton) {
        placeOrderButton.addEventListener("click", () => {
            const selectedCheckboxes = document.querySelectorAll(".select-item:checked");

            if (selectedCheckboxes.length === 0) {
                alert("Please select at least one item to place an order.");
                return;
            }

            // Get selected items
            const selectedItems = Array.from(selectedCheckboxes).map(checkbox => {
                const itemId = checkbox.getAttribute("data-id");
                return cart.find(item => item.id === itemId);
            });

            // Populate the checkout modal with selected items
            const checkoutItemsDiv = document.getElementById("checkout-items");
            checkoutItemsDiv.innerHTML = ""; // Clear previous content
            let totalCheckoutPrice = 0;

            selectedItems.forEach(item => {
                totalCheckoutPrice += item.total;
                const itemDiv = document.createElement("div");
                itemDiv.className = "checkout-item";
                itemDiv.innerHTML = `
                    <div class="checkout-item-details">
                        <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
                        <div>
                            <p><strong>Item:</strong> ${item.name}</p>
                            <p><strong>Quantity:</strong> ${item.quantity}</p>
                            <p><strong>Total Price:</strong> $${item.total.toFixed(2)}</p>
                        </div>
                    </div>
                `;
                checkoutItemsDiv.appendChild(itemDiv);
            });

            // Update total price in modal
            document.getElementById("checkout-total-price").textContent = totalCheckoutPrice.toFixed(2);

            // Show the modal
            const modal = document.getElementById("checkout-modal");
            modal.style.display = "block";
        });
    }

    // Close modal when clicking on the close button
    const closeButton = document.querySelector(".close-button");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            document.getElementById("checkout-modal").style.display = "none";
        });
    }

    // Close modal when clicking outside the modal content
    window.addEventListener("click", event => {
        const modal = document.getElementById("checkout-modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle Confirm Order button
    const confirmCheckoutButton = document.getElementById("confirm-checkout");
    if (confirmCheckoutButton) {
        confirmCheckoutButton.addEventListener("click", () => {
            alert("Order placed successfully!");
            document.getElementById("checkout-modal").style.display = "none";
            // Additional actions, like clearing the cart, can be added here
        });
    }

    // Initial render
    renderCart();
});
