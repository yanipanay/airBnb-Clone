// Your code goes here

const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("search-input").value;
  // searchLocation(searchInput);
  localStorage.setItem("location", searchInput);
  window.open("http://127.0.0.1:5500/listing.html", "_blank");
});
