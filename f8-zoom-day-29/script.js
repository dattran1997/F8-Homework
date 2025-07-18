const apiURL = "https://dummyjson.com/products";

// html dom object
const productGrid = document.querySelector('#productsGrid');
const productModal = document.querySelector('#productModal');
const productCards = document.querySelectorAll('.product-card');

const modalTitle = document.querySelector('#modalTitle');
const modalImage = document.querySelector('#modalImage');
const modalStarRating = document.querySelector('#productModal .stars');
const modalPrice = document.querySelector('#modalPrice');
const modalOriginalPrice = document.querySelector('#modalOriginalPrice');
const modalDiscount = document.querySelector('#modalDiscount');
const modalBrand = document.querySelector("#modalBrand");
const modalCategory = document.querySelector("#modalCategory");
const modalStock = document.querySelector("#modalStock");

let allProducts = [];
let selectedProduct = null;


// Function to generate stars based on rating
const generateStars = (rating) => {
    const fullstars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullstars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';

    // Add full stars
    for (let i = 0; i < fullstars; i++) {
        starsHTML += '<i class="fas fa-star filled"></i>';
    }

    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt filled"></i>';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fas fa-star empty"></i>';
    }

    return starsHTML;
};

const sendRequest = (method, url, callback) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            const status = xhr.status;
            // If ready state = 4, when the request been done
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // In case of successful
                if (status === 0 || (status >= 200 && status < 400)) {
                    const parsedData = JSON.parse(xhr.responseText);
                    resolve(parsedData);
                } else {
                    // When request have error
                    console.log("Error with status code", status);
                    reject("Error with status code", status)
                }
            }
        }

        xhr.open(method, url, true);
        xhr.send();
    });

    return promise;
}

const renderItem = (item) => {
    const { id, title, price, description, rating, discountPercentage, thumbnail } = item;
    const discountPrice = (price * discountPercentage) / 100;

    // round 2 decimal places
    const currentPrice = (price - discountPrice).toFixed(2);

    return (`
        <div class="product-card">
            <div class="product-image">
                <img src="${thumbnail}">
                <div class="product-overlay">
                    <button class="btn-quick-view" data-index="${id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${title}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(rating)}
                    </div>
                    <span class="rating-text">${rating}</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${currentPrice}</span>
                    <span class="original-price">${price}</span>
                    <span class="discount">-${discountPercentage}%</span>
                </div>
                <p class="product-description">${description || ''}</p>
            </div>
        </div>
    `)
}

sendRequest("GET", apiURL).then((data) => {
    if (!data.products) {
        productGrid.innerText = 'no data';
    }

    if (data?.products) {
        // add data to products
        allProducts = data?.products;

        // render product data
        const renderedData = data?.products.map((item) => renderItem(item)).join("");

        productGrid.innerHTML = renderedData;
    }
}).catch((error) => {
    console.log('error', error);
});

const handleProductClick = (event) => {
    const viewButton = event.target.closest('.btn-quick-view');

    if (viewButton) {
        const id = Number.parseInt(viewButton.dataset.index);

        // get selected data
        selectedProduct = allProducts.find(item => item.id === id);

        addModalData(selectedProduct);

        // show modal
        productModal.classList.toggle('hide');
    }
}

const handleProductModalClick = (event) => {
    const closeModalButton = event.target.closest('.close-modal');

    if (closeModalButton) {
        productModal.classList.toggle('hide');

        // reset selected product
        selectedProduct = null
    }
}

const addModalData = (data) => {
    console.log('addModalData', data);

    modalTitle.textContent = data.title;
    modalPrice.textContent = data.price;
    modalOriginalPrice.textContent = data.price;
    modalDiscount.textContent = data.discountPercentage;
    modalBrand.textContent = data.brand;
    modalCategory.textContent = data.category;
    modalStock.textContent = data.stock;

    // for dom comlex
    modalImage.setAttribute("src", data.thumbnail);
    modalStarRating.innerHTML = generateStars(data.rating);
}

const resetModalData = () => {
    modalTitle.textContent = '';
    modalPrice.textContent = '';
    modalOriginalPrice.textContent = "";
    modalDiscount.textContent = '';
    modalBrand.textContent = "";
    modalCategory.textContent = "";
    modalStock.textContent = "";

    // for dom comlex
    modalImage.setAttribute("src", "");
    modalStarRating.innerHTML = "";
}

productGrid.addEventListener('click', handleProductClick);
productModal.addEventListener('click', handleProductModalClick);

// continue work
// - search, sort, filter
// - handle open item detail modal