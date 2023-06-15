const CART_PRODUCTOS = "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadProductsCart();
});

function getProductsDb() {
    const url = "../dbProducts.json";

   return fetch(url)
    .then(response => {
        return response.json();
    })
    .then(result => {
        return result;
    })
    .catch(err => {
        console.log(err);
    });
}

async function loadProducts() {
    const products = await getProductsDb();
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class="col-sm-6 col-md-4 col-lg-3 product-container">
                <div class="card product">
                    <img 
                        src="${product.image}"
                        class="card-img-top" 
                        alt="${product.name}"
                    />
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.extraInfo}</p>
                        <p class="card-text">${product.price} € / Unidad</p>
                        <button type="button" class="btn btn-primary btn-cart" onclick=(addProductCart(${product.id}))>Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `
    });

    document.getElementsByClassName("products")[0].innerHTML = html;
}

function openCloseCart() {
    const containerCart = document.getElementsByClassName("cart-products")[0];
    
    containerCart.classList.forEach(item => {
        if(item == "hidden") {
            containerCart.classList.remove("hidden");
            containerCart.classList.add("active");
        }

        if(item == "active") {
            containerCart.classList.remove("active");
            containerCart.classList.add("hidden");
        }
    })
}

function addProductCart(idProduct) {
    let arrayProductsId = [];

    let localStorageItems = localStorage.getItem(CART_PRODUCTOS);

    if(localStorageItems === null) {
        arrayProductsId.push(idProduct);
        localStorage.setItem(CART_PRODUCTOS, arrayProductsId);
    } else {
        let productsId = localStorage.getItem(CART_PRODUCTOS);
        if(productsId.length > 0) {
            productsId += "," + idProduct;        
        } else {
            productsId = productId
        }
        localStorage.setItem(CART_PRODUCTOS, productsId);
    }

    loadProductsCart();
}

async function loadProductsCart() {
    const products = await getProductsDb();

    // Convertimos el resultado del localStorage en un array
    const localStorageItems = localStorage.getItem(CART_PRODUCTOS);

    let html = "";
    if(!localStorageItems) {
        html = `
            <div class="cart-product empty">
                <p>Carrito vacio.</p>
            </div>
        `;
    } else {

    const idProductsSplit = localStorageItems.split(',');
    
    // Eliminamos los IDs duplicados
    const idProductsCart = Array.from(new Set(idProductsSplit));

    idProductsCart.forEach(id => {
        products.forEach(product => {

            if(id == product.id) {
                    const quantity = countDuplicatesID(id, idProductsSplit);
                    const totalPrice = product.price * quantity;
                html += `
                    <div class="cart-product">
                        <img src="${product.image}" alt="${product.name}" />
                        <div class="cart-product-info">
                            <span class="quantity">${quantity}</span>
                            <p>${product.name}</p>
                            <p>${totalPrice.toFixed(2)}</p>
                            <p class="change-quantity">
                                <button onclick="decreaseQuantity(${product.id})">-</button>
                                <button onclick="increaseQuantity(${product.id})">+</button>
                            </p>
                            <p class="cart-product-delete">
                                <button onclick=(deleteProductCart(${product.id}))>Eliminar</button>
                            </p>
                        </div>
                    </div>
                `;
            }
        });
    });
    
    }

    document.getElementsByClassName('cart-products')[0].innerHTML = html;
}

function deleteProductCart(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(',');
    const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);

    if(resultIdDelete) {
        let count = 0;
        let idsString = "";

        resultIdDelete.forEach(id => {
            count++;
            if(count < resultIdDelete.length) {
                idsString += id + ',';
            } else {
                idsString += id;
            }
        });

        localStorage.setItem(CART_PRODUCTOS, idsString);
    }

    const idsLocalStorage = localStorage.getItem(CART_PRODUCTOS);
    if(!idsLocalStorage) {
        localStorage.removeItem(CART_PRODUCTOS);
    }

    loadProductsCart();
}

function increaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(",");
    arrayIdProductsCart.push(idProduct);

    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
        count++;
        if(count < arrayIdProductsCart.length) {
            idsString += id + ",";
        } else {
            idsString += id;
        }
    });
    localStorage.setItem(CART_PRODUCTOS, idsString);
    loadProductsCart();
}

function decreaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(",");

    const deleteItem = idProduct.toString();
    let index = arrayIdProductsCart.indexOf(deleteItem);
    if(index > -1) {
        arrayIdProductsCart.splice(index, 1); 
    }

    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
        count++;
        if(count < arrayIdProductsCart.length) {
            idsString += id + ",";
        } else {
            idsString += id;
        }
    });
    localStorage.setItem(CART_PRODUCTOS, idsString);
    loadProductsCart();
}

function countDuplicatesID(value, arrayIds) {
    let count = 0;

    arrayIds.forEach(id => {
        if(value == id) {
            count++;
        }
    });
    return count;
}

function deleteAllIds(id, arrayIds) {
    return arrayIds.filter(itemId => {
        return itemId != id;
    })
}