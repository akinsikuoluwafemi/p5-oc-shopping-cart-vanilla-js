// selecting elements
const itemsDiv = document.querySelector(".items");

// variables
let products = [];

// fetching products
const getProduct = async () => {
  const product = await fetch("http://localhost:3000/api/products/");
  const _products = [];

  const data = await product.json();
  products.push(...data);
};

const renderProducts = () => {
  console.log(products);
  itemsDiv.innerHTML = "";
  products.forEach((_product) => {
    const newLink = document.createElement("a");
    newLink.setAttribute("href", `./product.html?id=${_product._id}`);
    newLink.innerHTML = productTemplate(_product);
    itemsDiv.appendChild(newLink);

    // const newDiv = document.createElement("div");
    // const content = productTemplate(_product);
  });
};

const productTemplate = (_product) => {
  return ` 
    <article>
      <img src="${_product.imageUrl}" alt="${_product.name}">
      <h3 class="productName">${_product.name}</h3>
      <p class="productDescription">${_product.description}</p>
    </article>
  `;
};

window.addEventListener("load", async () => {
  await getProduct();
  renderProducts();
});
