const orderId = document.getElementById("orderId");

const id = window.location.search.slice(22);

window.addEventListener("load", async () => {
  orderId.textContent = id;
});
