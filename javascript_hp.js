// Toggle dropdown menu
function shownav() {
    const navContents = document.querySelectorAll('.nav-content');
    navContents.forEach((nav) => {
        nav.classList.toggle('show');
    });
}
window.addEventListener('scroll', function () {
    var navbar = document.querySelector('.navbar'); // Target the navbar element
    if (window.scrollY > 50) { // If the scroll position is greater than 50px
        navbar.classList.add('navbar-scrolled'); // Add the scrolled class
    } else {
        navbar.classList.remove('navbar-scrolled'); // Remove the class when at the top
    }
});

let currentIndex = 0;

function moveSlide(step) {
    const slides = document.querySelectorAll('.slider-item');
    currentIndex += step;

    if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    } else if (currentIndex >= slides.length) {
        currentIndex = 0;
    }

    document.querySelector('.slider').style.transform = `translateX(-${currentIndex * 100}%)`;
}


// Sidebar toggle logic
const cartSidebar = document.getElementById('cart-sidebar');
const favoritesSidebar = document.getElementById('favorites-sidebar');
const searchSidebar = document.getElementById('search-sidebar');

const cartButton = document.querySelector('i[href="#cart"]');
const favoritesButton = document.querySelector('i[href="#favorites"]');
const searchButton = document.querySelector('i[href="#search"]');

const closeCartButton = document.getElementById('close-cart');
const closeFavoritesButton = document.getElementById('close-favorites');
const closeSearchButton = document.getElementById('close-search');
const body = document.body;

// Open the sidebar and blur the body
function openSidebar(sidebar) {
    sidebar.classList.add('active');
    body.classList.add('blur-active');
}

// Close the sidebar and remove blur from body
function closeSidebar(sidebar) {
    sidebar.classList.remove('active');
    body.classList.remove('blur-active');
}

// Cart Sidebar Logic
cartButton.addEventListener('click', (e) => {
    e.preventDefault();
    openSidebar(cartSidebar);
});
closeCartButton.addEventListener('click', () => {
    closeSidebar(cartSidebar);
});

// Favorites Sidebar Logic
favoritesButton.addEventListener('click', (e) => {
    e.preventDefault();
    openSidebar(favoritesSidebar);
});
closeFavoritesButton.addEventListener('click', () => {
    closeSidebar(favoritesSidebar);
});

// Search Sidebar Logic
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    openSidebar(searchSidebar);
});
closeSearchButton.addEventListener('click', () => {
    closeSidebar(searchSidebar);
});




const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
    const scrollbarThumb = document.querySelector(".scrollbar-thumb");

    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;
            const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

            scrollbarThumb.style.left = `${newThumbPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }


        // Remove event listeners on mouse up
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        // Add event listener for drag interaction
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    })

    // Slide images according to the slide button clicks.
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -0.5 : 0.5;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
    }
    //Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`
    }

    imageList.addEventListener("scroll", () => {
        handleSlideButtons();
        updateScrollThumbPosition();
    })
}
window.addEventListener("load", initSlider);

// Store the default order of products when the page loads
let defaultOrder = [];

document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.querySelector(".products-container");
    const products = Array.from(productsContainer.getElementsByClassName("product"));
    defaultOrder = [...products]; // Save the original order
});

function sortProducts() {
    const sortOption = document.getElementById("sort").value;
    const productsContainer = document.querySelector(".products-container");
    const products = Array.from(productsContainer.getElementsByClassName("product"));

    if (sortOption === "low-to-high") {
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector("p").textContent.replace(/[₱,]/g, ""));
            const priceB = parseFloat(b.querySelector("p").textContent.replace(/[₱,]/g, ""));
            return priceA - priceB;
        });
    } else if (sortOption === "high-to-low") {
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector("p").textContent.replace(/[₱,]/g, ""));
            const priceB = parseFloat(b.querySelector("p").textContent.replace(/[₱,]/g, ""));
            return priceB - priceA;
        });
    } else if (sortOption === "default") {
        productsContainer.innerHTML = ""; // Clear the container
        defaultOrder.forEach(product => {
            productsContainer.appendChild(product); // Re-add products in original order
        });
        return; // Exit to avoid reappending below
    }

    // Clear and append sorted products
    productsContainer.innerHTML = "";
    products.forEach(product => {
        productsContainer.appendChild(product);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Selectors for the sidebars
    const cartItemsContainer = document.getElementById("cart-items");
    const favoritesItemsContainer = document.getElementById("favorites-items");
    const totalPriceElement = document.getElementById("total-price");

    // Load cart and favorites from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let totalPrice = calculateTotalPrice(cart);

    // Add event listeners to product buttons
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        // Get product details
        const productName = product.querySelector("h3").textContent;
        const productPrice = parseFloat(product.querySelector("p").textContent.replace(/[₱,]/g, ""));
        const productImage = product.querySelector("img").src;

        // Add to Favorites button
        const favoritesButton = product.querySelector(".favorites-button");
        favoritesButton.addEventListener("click", () => {
            if (!favorites.some(item => item.name === productName)) {
                favorites.push({ name: productName, price: productPrice, image: productImage });
                updateFavoritesSidebar();
                saveDataToLocalStorage();
                alert(`${productName} has been added to your favorites!`); // Alert when added to favorites
            } else {
                alert(`${productName} is already in your favorites.`);
            }
        });

        // Add to Cart button
        const addToCartButton = product.querySelector(".addcart-button");
        addToCartButton.addEventListener("click", () => {
            const existingItem = cart.find(item => item.name === productName);
            if (!existingItem) {
                cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
                totalPrice += productPrice;
                updateCartSidebar();
                saveDataToLocalStorage();
                alert(`${productName} has been added to your cart!`); // Alert when added to cart
            } else {
                alert(`${productName} is already in your cart.`);
            }
        });
    });

    // Save data to localStorage
    function saveDataToLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    // Calculate the total price for the cart
    function calculateTotalPrice(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Update Favorites Sidebar
    function updateFavoritesSidebar() {
        favoritesItemsContainer.innerHTML = ""; // Clear current items
        favorites.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="sidebar-product-image">
                <span>${item.name}</span>
                <button class="add-to-cart-button" data-index="${index}">Add to Cart</button>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            favoritesItemsContainer.appendChild(listItem);

            // Add event listener for the add to cart button
            listItem.querySelector(".add-to-cart-button").addEventListener("click", () => {
                const existingItem = cart.find(cartItem => cartItem.name === item.name);
                if (!existingItem) {
                    cart.push({ name: item.name, price: item.price, image: item.image, quantity: 1 });
                    totalPrice += item.price;
                    updateCartSidebar();
                    saveDataToLocalStorage();
                    alert(`${item.name} has been added to your cart!`); // Alert when added to cart from favorites
                } else {
                    alert(`${item.name} is already in your cart.`);
                }
            });

            // Add event listener for the delete button
            listItem.querySelector(".delete-button").addEventListener("click", () => {
                favorites.splice(index, 1); // Remove the item from the array
                updateFavoritesSidebar(); // Re-render the sidebar
                saveDataToLocalStorage(); // Save updated data to localStorage
            });
        });
    }

    // Update Cart Sidebar
    function updateCartSidebar() {
        cartItemsContainer.innerHTML = ""; // Clear current items
        cart.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="sidebar-product-image">
                <span>${item.name}</span>
                <div class="quantity-controls">
                    <button class="decrease-button" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-button" data-index="${index}">+</button>
                </div>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            cartItemsContainer.appendChild(listItem);

            // Add event listener for the delete button
            listItem.querySelector(".delete-button").addEventListener("click", () => {
                totalPrice -= item.price * item.quantity; // Adjust total price
                cart.splice(index, 1); // Remove the item from the array
                updateCartSidebar(); // Re-render the sidebar
                saveDataToLocalStorage(); // Save updated data to localStorage
                
            });

            // Add event listener for the increase button
            listItem.querySelector(".increase-button").addEventListener("click", () => {
                item.quantity++;
                totalPrice += item.price; // Increase total price
                updateCartSidebar(); // Re-render the sidebar
                saveDataToLocalStorage(); // Save updated data to localStorage
            });

            // Add event listener for the decrease button
            listItem.querySelector(".decrease-button").addEventListener("click", () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    totalPrice -= item.price; // Decrease total price
                    updateCartSidebar(); // Re-render the sidebar
                    saveDataToLocalStorage(); // Save updated data to localStorage
                } else {
                    alert("Quantity cannot be less than 1. If you want to remove the item, please delete it.");
                }
            });
        });
        totalPriceElement.textContent = `TOTAL: ₱${totalPrice.toFixed(2)}`;
    }

    

    // Clear favorites button
    const clearFavoritesButton = document.getElementById("clear-favorites");
    clearFavoritesButton.addEventListener("click", () => {
        favorites = [];
        updateFavoritesSidebar();
        saveDataToLocalStorage(); // Save updated data to localStorage
    });

    // Close buttons for sidebars
    document.getElementById("close-cart").addEventListener("click", () => {
        document.getElementById("cart-sidebar").classList.remove("open");
    });

    document.getElementById("close-favorites").addEventListener("click", () => {
        document.getElementById("favorites-sidebar").classList.remove("open");
    });

    document.getElementById("close-search").addEventListener("click", () => {
        document.getElementById("search-sidebar").classList.remove("open");
    });

    // Initialize sidebars
    updateCartSidebar();
    updateFavoritesSidebar();
});



const checkoutButton = document.getElementById("checkout");

checkoutButton.addEventListener("click", () => {
    // Save cart to localStorage before redirecting to the checkout page
    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirect to the checkout page
    window.location.href = "checkout.html";
});
