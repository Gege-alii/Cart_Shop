// AOS initialization
AOS.init();

// Redirect to login if not authenticated
function checkAuth() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = 'index.html';
    }
}

// Handle signup
document.getElementById('signup-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
        Swal.fire({
            title: 'Error',
            text:('First name and last name should contain only letters.'),
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire({
            title: 'Error',
            text:('Passwords do not match.'),
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some(user => user.email === email);

    if (userExists) {
        Swal.fire({
            title: 'Error',
            text: ('An account with this email already exists.'),
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const newUser = {
        firstName,
        lastName,
        email,
        password,
        cart: [] 
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    Swal.fire({
        title: 'Success!',
        text: ('Signup successful! Please login.'),
        icon: 'success',
        confirmButtonText: 'OK'
    });
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
    
});

// Handle login
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('loggedIn', JSON.stringify(user));
        Swal.fire({
            title: 'Success!',
            text: `Welcome ${user.firstName}! You logged in successfully.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 3000);
    } else {
      
        Swal.fire({
            title: 'Error!',
            text: ('Invalid email or password.') ,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});


// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    Swal.fire({
        title: 'Success!',
        text: ('You have been logged out.'),
        icon: 'success',
        confirmButtonText: 'OK'
    });
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
}


// Add product to cart function
function addToCart(product) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === loggedInUser.email);

    if (!user) {
        Swal.fire({
            title: 'Error!',
            text: 'User not found.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let cart = user.cart || [];

    const productIndex = cart.findIndex(item => item.name === product.name);
    
    // Check if the product is already in the cart
    if (productIndex !== -1) {

        Swal.fire({
            title: 'Info',
            text: `${product.name} is already in your cart.`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    } else {
        product.quantity = 1;
        cart.push(product);

        Swal.fire({
            title: 'Success!',
            text: `${product.name} added to your cart.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    user.cart = cart;
    users = users.map(u => u.email === loggedInUser.email ? user : u);
    localStorage.setItem('users', JSON.stringify(users));
}

// Remove product from cart function
function removeFromCart(productName) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));

   {
        Swal.fire({
            title: 'Success!',
            text: `${productName} has removed from your cart.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === loggedInUser.email);

    if (!user) {
        Swal.fire({
            title: 'Error',
            text: ('User not found.'),
            icon: 'error',
            confirmButtonText: 'OK'
        });
       
        return;
    }

    let cart = user.cart || [];
    cart = cart.filter(product => product.name !== productName);
    user.cart = cart;

    users = users.map(u => u.email === loggedInUser.email ? user : u);
    localStorage.setItem('users', JSON.stringify(users));

    displayCart();
}


// Display products on home page function
function displayProducts() {
    const products = [
        { name: 'Product 2', image: 'img 4.avif', description: 'Description of product 2', price: 39.99 },
        { name: 'Product 3', image: 'img 5.avif', description: 'Description of product 3', price: 49.99 },
        { name: 'Product 4', image: 'img 6.avif', description: 'Description of product 4', price: 45 },
        { name: 'Product 5', image: 'img 1.jpg', description: 'Description of product 5', price: 30 },
        { name: 'Product 6', image: 'img7.avif', description: 'Description of product 6', price: 25 },
        { name: 'Product 7', image: 'img 2.jpg', description: 'Description of product 7', price: 32 },
        { name: 'Product 8', image: 'img8.jpg', description: 'Description of product 8', price: 50 },
        { name: 'Product 9', image: 'img9.jpg', description: 'Description of product 9', price: 55 },
    ];

    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const productCard = `

          <div class="col-md-4 mb-4" data-aos="fade-up">
    <div class="card card-custom">
        <img src="${product.image}" class="img-fluid img-custom" alt="${product.name}">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text">$${product.price.toFixed(2)}</p>

                 <div class="star">
                        <button class="btn btn-info" onclick='viewProductDetails(${JSON.stringify(product)})'>View</button>
                    </div>

                    <button type="submit" class="cart"  onclick='addToCart(${JSON.stringify(product)})'><i class="fas fa-shopping-cart"></i></button>

           
        </div>
    </div>
</div>

        `;
        container.innerHTML += productCard;
    });
}

// View each product function
function viewProductDetails(product) {
    localStorage.setItem('selectedProduct', JSON.stringify(product)); 
    window.location.href = 'viewproduct.html'; 
}

document.addEventListener('DOMContentLoaded', () => {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    
    if (product) {
        const detailsContainer = document.getElementById('product-details');
        detailsContainer.innerHTML = `
            <h3>${product.name}</h3>
            <table class="table">
                <tbody>
                    <tr>
                        <th>Description</th>
                        <td>${product.description}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>$${product.price.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th>Image</th>
                        <td><img src="${product.image}" class="w-75" alt="${product.name}"></td>
                    </tr>
                <tr>
                <th>Review</th>
                <td>
                <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>
        `;
    } else {
        document.getElementById('product-details').innerHTML = '<p>No product details available.</p>';
    }
});


// Display products on cart page function
function displayCart() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === loggedInUser.email);

    if (!user) {
        Swal.fire({
            title: 'Error',
            text: 'User not found.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const cart = user.cart || [];
    const container = document.getElementById('cart-container');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    let total = 0; 
    cart.forEach(product => {
        if (typeof product.price === 'number' && typeof product.quantity === 'number') {
            total += product.price * product.quantity; 
        }
        const cartItem = `
            <div class="col-md-12 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top w-25 h-25" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">$${product.price.toFixed(2)} x ${product.quantity}</p>
                        <p class="card-text">Total: $${(product.price * product.quantity).toFixed(2)}</p>
                        <button class="btn btn-warning" onclick='updateProductQuantity("${product.name}", "decrease")'>-</button>
                        <button class="btn btn-success" onclick='updateProductQuantity("${product.name}", "increase")'>+</button>
                        <button class="btn btn-danger" onclick='removeFromCart("${product.name}")'>Remove</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cartItem;
    });

    const totalElement = total > 0 ? `<h3>Total Price: $${total.toFixed(2)}</h3>` : '<h3>Total Price: $0.00</h3>';
    container.innerHTML += totalElement;
}


// update product quantity function
function updateProductQuantity(productName, action) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === loggedInUser.email);

    if (!user) return;

    const cart = user.cart || [];
    const product = cart.find(p => p.name === productName);

    if (product) {
        if (action === 'increase') {
            product.quantity++;
        } else if (action === 'decrease') {
            if (product.quantity > 1) {
                product.quantity--;
            }
        }
        localStorage.setItem('users', JSON.stringify(users)); 
    }

    // Refresh the cart display
    displayCart(); 
}


window.onload = displayCart;

// Initialize pages
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('home.html')) {
        checkAuth();
        displayProducts();
    } else if (window.location.pathname.includes('cart.html')) {
        checkAuth();
        displayCart();
    }
});

// forget password 

document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forget-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('reset-email').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user exists with this email
            const user = users.find(user => user.email === email);

            if (user) {
                document.getElementById('reset-message').innerHTML = 
                    `A reset link has been sent to ${email}.`;
                setTimeout(function() {
                    Swal.fire({
                        title: 'Enter your new password',
                        input: 'password',
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Submit',
                    }).then((result) => {
                        if (result.isConfirmed && result.value) {
                            const newPassword = result.value;
                            user.password = newPassword;
                            localStorage.setItem('users', JSON.stringify(users));
                            document.getElementById('reset-message').innerHTML = 
                                "Password has been successfully reset. Please log in with your new password.";
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 3000);
                        }
                    });
                }, 2000);
            } else {
                document.getElementById('reset-message').innerHTML = 
                    "No account found with this email address.";
            }
        });
    }
});



  
  
  


