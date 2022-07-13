// selecting elements
let cartItemSection = document.getElementById("cart__items");
let numOfQuantity = document.getElementById("totalQuantity");
let cartTotal = document.getElementById("totalPrice");
let cartForm = document.querySelector(".cart__order__form");

// retrieving cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart"));
let allCart = [];

const getAllPrices = async () => {
  cart.map(async (item) => {
    const singleProduct = await fetch(
      `http://localhost:3000/api/products/${item.id}`
    );
    const data = await singleProduct.json();
    const price = data.price;
    const image = data.imageUrl;
    const name = data.name;
    // console.log(price);
    cart = { ...item, quantity: parseInt(item.quantity), price, image, name };
    allCart.push(cart);
    return allCart;
  });
};

const removeCartItem = (event) => {
  let buttonClicked = event.target;

  let currentElement =
    buttonClicked.parentElement.parentElement.parentElement.parentElement;
  let currentId = currentElement.getAttribute("data-id");
  let currentProductColor = currentElement.getAttribute("data-color");
  const remainingItem = allCart.filter(
    (product) =>
      product.color !== currentProductColor || product.id !== currentId
  );

  buttonClicked.parentElement.parentElement.parentElement.parentElement.remove();
  allCart = remainingItem;
  let itemsInCart = JSON.parse(localStorage.getItem("cart"));
  let newCartItem = itemsInCart.filter(
    (product) =>
      product.id !== currentId || product.color !== currentProductColor
  );
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(newCartItem));

  getAllTotals();
};

const quantityChanged = (event) => {
  let input = event.target;
  let currentElement =
    input.parentElement.parentElement.parentElement.parentElement;
  let currentId = currentElement.getAttribute("data-id");
  let currentProductColor = currentElement.getAttribute("data-color");

  console.log(input.value);
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }

  console.log(input.value);

  const newCartItem = allCart.map((product) => {
    if (product.id === currentId && product.color === currentProductColor) {
      let modifiedProduct = { ...product, quantity: parseInt(input.value) };
      console.log(modifiedProduct);
      allCart = modifiedProduct;
      return modifiedProduct;
    } else {
      return product;
    }
  });

  // let newCartItem = allCart.map((product) =>
  //   product.id === currentId || product.color === currentProductColor
  //     ? { ...product, quantity: parseInt(input.value) }
  //     : product
  // );
  allCart = newCartItem;
  console.log(newCartItem);
  const lsItem = newCartItem.map((item) => {
    return {
      id: item.id,
      color: item.color,
      quantity: item.quantity,
    };
  });
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(lsItem));
  getAllTotals();
};

const renderCarts = () => {
  cartItemSection.innerHTML = "";
  allCart.forEach((_product) => {
    const newArticle = document.createElement("article");
    newArticle.classList.add("cart__item");
    newArticle.setAttribute("data-id", _product.id);
    newArticle.setAttribute("data-color", _product.color);
    newArticle.innerHTML = cartTemplate(_product);
    cartItemSection.appendChild(newArticle);
    let deleteBtn = document.querySelectorAll(".deleteItem");
    let quantityInput = document.querySelectorAll(".itemQuantity");

    // add click event to all the delet button
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", removeCartItem);
    });

    quantityInput.forEach((btn) => {
      btn.addEventListener("change", quantityChanged);
    });
  });
};

const cartTemplate = (_product) => {
  return `
    <div class="cart__item__img">
      <img src="${_product.image}" alt="Photo of a ${_product.name}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${_product.name}</h2>
        <p>${_product.color}</p>
        <p>€${_product.price}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${_product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Delete</p>
        </div>
      </div>
    </div>
  `;
};

// const getTotals = () => {
//   setTimeout(() => {
//     const total = allCart?.reduce((prev, item) => {
//       return (prev += item.price);
//     }, 0);
//     cartTotal.textContent = total;
//   }, 1000);
// };

// const getTotalQuantity = () => {
//   setTimeout(() => {
//     const total = allCart?.reduce((prev, item) => {
//       return (prev += item.quantity);
//     }, 0);
//     numOfQuantity.textContent = total;
//   }, 1000);
// };

const getAllTotals = () => {
  setTimeout(() => {
    const total = allCart?.reduce(
      (prev, item) => {
        const { quantity, price } = item;
        const itemTotal = quantity * price;
        prev.price += itemTotal;
        prev.quantity += quantity;
        console.log(price, quantity);
        return prev;
      },
      {
        quantity: 0,
        price: 0,
      }
    );
    numOfQuantity.textContent = parseInt(total.quantity);
    cartTotal.textContent = parseInt(total.price);
  }, 500);
};

const makeOrder = async () => {
  let cart = JSON.parse(localStorage.getItem("cart"));

  const productArr = cart.map((product) => product.id);
  const productIds = [...new Set(productArr)];
  console.log(productIds);

  const data = {
    contact: {
      firstName: "Femi",
      lastName: "Akinsiku",
      address: "7 Baale street off Megida busstop, ayobo",
      city: "Alimosho",
      email: "akinsiku13@gmail.com",
    },
    products: productIds,
  };

  const response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const result = await response.json();
  console.log(result);
  let uri = `confirmation.html?confirmation?orderId=${result.orderId}`;
  let encode = encodeURI(uri);
  window.location.href = encode;

  return result;
};

cartForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await makeOrder();
});

window.addEventListener("load", async () => {
  await getAllPrices();

  setTimeout(() => {
    renderCarts();
  }, 600);
  //   getTotals();
  //   getTotalQuantity();
  getAllTotals();
});
