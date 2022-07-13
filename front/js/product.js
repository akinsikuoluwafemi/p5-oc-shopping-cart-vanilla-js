// selecting elements
const imageDetail = document.querySelector(".banniere");
const titleDetail = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const selectTag = document.getElementById("colors");
const quantityInput = document.getElementById("numbers");
const addToCartBtn = document.getElementById("addToCart");

// variables
let product = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = "";
let numofArticle = 0;
let productId;
let qty = 0;
// let data = JSON.parse(localStorage.getItem("singleProduct")) || {};
let currentProduct = {
  id: 0,
  color: selectedColor,
  quantity: qty,
};

// get a single product product
const getSingleProduct = async () => {
  // get the id of the product detail
  productId = window.location.search.slice(4);

  const singleProduct = await fetch(
    `http://localhost:3000/api/products/${productId}`
  );

  const data = await singleProduct.json();
  product.push(data);
  // console.log(data);
};

const renderProductDetailData = async () => {
  product.forEach((p) => {
    imageDetail.src = p.imageUrl;
    titleDetail.textContent = p.name;
    price.textContent = p.price;
    description.textContent = p.description;

    p.colors.forEach((color) => {
      let el = document.createElement("option");
      el.textContent = color;
      el.value = color;
      selectTag.appendChild(el);
    });
  });
};

// add event listeners

selectTag.addEventListener("change", (e) => {
  console.log(e.target.value);

  selectedColor = e.target.value;
  currentProduct.color = selectedColor;
  console.log(currentProduct);
});

quantityInput.addEventListener("change", (e) => {
  console.log(e.target.value);
  qty = e.target.value;
  currentProduct.quantity = e.target.value;
  console.log(currentProduct);
  console.log(cart);
  const newCart = cart.map((cartItems) => {
    if (
      currentProduct.id === cartItems.id &&
      currentProduct.color === cartItems.color
    ) {
      return { ...cartItems, quantity: e.target.value };
    } else {
      return cartItems;
    }
  });
  console.log(newCart);
  cart = newCart;
  // change the quantity when the quantity is adjusted
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(newCart, null, 2));
});
console.log(currentProduct);

// add to cart function
const addToCart = async () => {
  const data = {
    id: productId,
    quantity: parseInt(qty),
    color: selectedColor,
  };

  //   console.log(data);
  //   localStorage.setItem("singleProduct", JSON.stringify(data, null, 2));

  //   find existingCartItem
  const existingCartItem = cart.find(
    (cartItem) => cartItem.id === data.id && cartItem.color === data.color
  );

  if (existingCartItem) {
    return cart.map((cartItem) => {
      cartItem =
        cartItem.id === data.id && cartItem.color === data.color
          ? { ...cartItem, quantity: cartItem.quantity++ }
          : cartItem;

      // console.log(cartItem);
      console.log(cart);
      localStorage.setItem("cart", JSON.stringify(cart, null, 2));
      // quantityInput.disabled = true;
    });
  } else {
    cart = [...cart, { ...data, quantity: qty }];
    // console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart, null, 2));
    existing = false;
  }
};

addToCartBtn.addEventListener("click", (e) => {
  // function to add to cart
  addToCart();
});

window.addEventListener("load", async () => {
  await getSingleProduct();
  await renderProductDetailData();
  currentProduct.id = productId;
});
