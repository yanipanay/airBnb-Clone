// Your code goes here

const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("search-input").value;
  // searchLocation(searchInput);
  localStorage.setItem("location", searchInput);
  window.open("./listing.html", "_blank");
});
