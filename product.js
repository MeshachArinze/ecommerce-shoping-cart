window.addEventListener('DOMContentLoaded', () => {
    //variables

    const cartBtn = document.querySelector(".cart-btn"),
        closeCartBtn = document.querySelector(".close-cart"),
        clearCartBtn = document.querySelector(".clear-cart"),
        cartDOM = document.querySelector(".cart"),
        cartOverLay = document.querySelector(".cart-overlay"),
        cartItems = document.querySelector(".cart-items"),
        cartTotal = document.querySelector(".cart-total"),
        cartContent = document.querySelector(".cart-content"),
        recipe = document.querySelector(".recipe"),
        productsDom = document.querySelector(".products-center");

    recipe.innerHTML = spreadWrap(recipe.textContent);

    function spreadWrap(words) {
        return [...words].map(letter => `<span>${letter}</span>`).join('');
    }

    // cart
    let cart = [];
    //button
    let buttomDOM = [];

    // getting the products
    class Products {
        products = [
                {
                    sys: { 
                        id: 1 
                    },
                    fields: {
                        title: "ice cream",
                        price: 5.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food1.jpg"
                                }
                            }
                        }
                    }
                },
                {
                    sys: { 
                        id: 2 
                    },
                    fields: {
                        title: "new ice",
                        price: 6.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food2.jpg"
                                }
                            }
                        }
                    }
                },
                {
                    sys: { 
                        id: 3
                    },
                    fields: {
                        title: "new ice",
                        price: 6.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food3.jpg"
                                }
                            }
                        }
                    }
                },
                {
                    sys: { 
                        id: 4
                    },
                    fields: {
                        title: "new ice",
                        price: 6.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food4.jpg"
                                }
                            }
                        }
                    }
                },
                {
                    sys: { 
                        id: 5
                    },
                    fields: {
                        title: "new ice",
                        price: 6.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food5.jpg"
                                }
                            }
                        }
                    }
                },
                {
                    sys: { 
                        id: 6
                    },
                    fields: {
                        title: "new ice",
                        price: 6.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food6.jpg"
                                }
                            }
                        }
                    }
                },
                {
                    sys: { 
                        id: 7
                    },
                    fields: {
                        title: "new ice",
                        price: 6.99,
                        image: { 
                            fields: {
                                file: {
                                url: "./food/food7.jpg"
                                }
                            }
                        }
                    }
                }
            ];
        // get the products
        async getProducts() {
        try {
            let result = await fetch("product.json");
            let data = await result.json();
            let products = data.items;
            products = products.map((item) => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
            return this.allProducts;
        }
    }
        get allProducts() {
            return this.products.map(product => ({
                title: product?.fields?.title || '',
                price: product?.fields?.price || 0,
                image: product?.fields?.image?.fields?.file?.url || '',
                id:  product?.sys?.id || 0
            }));
    }
    }

    // display products
    class UI {
        storage = new Storage();
        // create a display products
        displayProducts(products) {
            let result = "";
            products.forEach((product) => {
                result += `
                    <!--single product -->
                    <article class="product">
                        <div class="img-container">
                            <img src=${product.image} class="product-img" alt="food">
                            <button class="bag-btn" data-id="${product.id}">
                                <span class="cart-add">&equals;</span>
                                <span class="shoppping-cart-btn">add to cart</span>
                            </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>$${product.price}</h4>
                    </article>
                    <!--------end of single product --------->
                `;
            });
            productsDom.innerHTML = result;
        }
        //get all the id of the buttons
        getBagButtons() {
         const buttons = [...document.querySelectorAll(".bag-btn")];
            buttons.forEach((button) => {
              let id = Number(button.dataset.id);
                  // let inCart = cart.find((item) => item.id === id);
                /* if (inCart) {
                    button.innerText = "In Cart";
                    button.disabled = true;
                } */
                button.addEventListener("click", (_event) => {
                    // TODO: check cart if exist
                    const checkCart = this.storage.getProductFromCart(id);
                    
                    //get product from products
                    let cartItem = {};
                    if(checkCart){
                        cartItem = {...checkCart, amount: ++checkCart.amount}
                    } else{
                         cartItem = { ...Storage.getProduct(id), amount: 1 };
                    }
                    //add product the the cart:: update the nonsense
                    // cart = [...cart, cartItem];
                     cart = [...cart.filter((v) => v.id !== id), cartItem];
                    
                    //save the cart to local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem();
                    // show the cart
                    this.showCart();
                });
            });
        }
        setCartValues(cart) {
            let tempTotal = 0,
                itemsTotal = 0;
            cart.map(item => {
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount
            })
            cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
            cartItems.innerText = itemsTotal;
        }

        addCartItem() {
            // clear cartContent
            cartContent.innerHTML = '';

            const allCartProducts = this.storage.allCartProducts;
            // create a new div for the cart item
            allCartProducts.forEach((p) => {
                const div = document.createElement("div");
                div.classList.add("cart-item");
                div.innerHTML = `
                    <img src=${p.image} alt="food">
                    <div>
                        <h4>${p.title}</h4>
                        <h5>$${p.price}</h5>
                        <span class="remove-item" data-id=${p.id}>remove</span>
                    </div>
                    <div>
                        <span class="chevron-up" data-id=${p.id}>&UpArrow;</span>
                            <p class="item-amount">${p.amount}</p>
                        <span class="chevron-down" data-id=${p.id}>&downarrow;</span>
                    </div>
                `
                cartContent.appendChild(div);
            });

        }

        // show the cart
        showCart() {
            cartOverLay.classList.add('transparentBcg');
            cartDOM.classList.add('showCart');
        }

        setUpApp() {
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart)
        }

        populateCart(cart) {
            cart.forEach(item => this.addCartItem());
        }

        hideCart() {
            cartOverLay.classList.remove('transparentBcg');
            cartDOM.classList.remove('showCart');
        }

        cartLogic() {
            // clear cart button
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });

            // cart functionality
            cartContent.addEventListener('click', event => {
                if (event.target.classList.contains('remove-item')) {
                    let removeItem = event.target;
                    let id = removeItem.dataset.id;
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    this.removeItem(id);
                } else if (event.target.classList.contains('chevron-up')) {
                    this.processCartProductById(event.target.dataset.id);
                }
                else if (event.target.classList.contains('chevron-down')) {
                   this.processCartProductById(event.target.dataset.id, true);
                }
            })
        }
        processCartProductById(id, decrement = false){
            if(!id){
                alert('error');
            }
            // id should be number
            id = Number(id);
            const checkCart = this.storage.getProductFromCart(id);
            //get product from products
           let cartItem = {};
            if(checkCart){
                let amount = checkCart.amount;
                if(decrement){
                    amount = checkCart.amount === 0 ? 0 : --checkCart.amount;
                }else{
                     amount = ++checkCart.amount;
                }
                if(amount === 0){
                    cartItem = {};
                }else{
                    cartItem = {...checkCart, amount};
                }
            }else{
                cartItem = { ...Storage.getProduct(id), amount: 1 };
            }
            //add product the the cart:: update the nonsense
             cart = cart.filter((v) => v.id !== id);
            if(Object.keys(cartItem).length > 0){
                cart = [...cart, cartItem];
            }
            //save the cart to local storage
            Storage.saveCart(cart);
            //set cart values
            this.setCartValues(cart);
            //display cart item
            this.addCartItem();
        }

        clearCart() {
            let cartItems = cart.map(item => item.id);
            cartItems.forEach(id => this.removeItem(id));
            while (cartContent.children.length > 0) {
                cartContent.removeChild(cartContent.children[0])
            }
            this.hideCart();
        }

        removeItem(id) {
            cart = cart.filter(item => item.id !== id);
            this.setCartValues(cart);
            Storage.saveCart(cart);
            /* let button = this.getSingleButton(id);
            button.disabled = false;
            button.innerHTML = `
            <span class="cart-add">&equals;</span>
            <span class="shoppping-cart-btn">add to cart</span>
            ` */
        }
        getSingleButton(id) {
            return buttomDOM.find(button => button.dataset.id === id);
        }
    }

    //local storage
    class Storage {
        static saveProducts(products) {
            localStorage.setItem("products", JSON.stringify(products));
        }

        static getProduct(id) {
            let products = JSON.parse(localStorage.getItem("products"));
            return products.find((product) => product.id === id);
        }

        static saveCart(cart) {
            localStorage.setItem("cart", JSON.stringify(cart))
        }

        static getCart() {
            return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        }
        get allCartProducts() {
            return JSON.parse(localStorage.getItem("cart")) || [];
        }
        getProductFromCart(id){
            return this.allCartProducts.find((p) =>p.id === Number(id)) || null;
        }
    }


    const ui = new UI();
        const products = new Products();
        //setUpApp
        ui.setUpApp()
        // get all products
        products.getProducts()
            .then((products) => {
                ui.displayProducts(products);
                Storage.saveProducts(products);
            })
            .then(() => {
                ui.getBagButtons();
                ui.cartLogic();
            });

})