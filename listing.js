window.addEventListener("DOMContentLoaded", (event) => {
  // Your code goes here
  const loc = localStorage.getItem("location");
  console.log(loc);
  searchLocation(loc);
  getUserLocation();
});

// console.log(loc);

const container = document.getElementById("left-col");

//---------------------------------------------------get user location------------------------------------------------------------------------------------//
let userLocation;

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }
};

//---------------------------------------------------search location function---------------------------------------------------------------------------------//

async function searchLocation(location) {
  const url = `https://airbnb13.p.rapidapi.com/search-location?location=${location}&checkin=2024-02-14&checkout=2024-02-15&adults=1&children=0&infants=0&pets=0&page=1&currency=INR`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "b1b0cc5eb3msh2134b7a81731c00p105f9cjsn108c98b485b2",
      "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    result.results.forEach((listing) => {
      const searchString = document.getElementById("searchString");
      searchString.innerText = location;
      const listingsContainer = document.getElementById("left-col");
      const listingCard = createListingCard(listing);
      listingsContainer.appendChild(listingCard);
    });
    // listToUI(result);
  } catch (error) {
    console.error(error);
  }
}

//--------------------------------------------------------create listing function----------------------------------------------------------------------------//

function createListingCard(house) {
  const houseLocation = { lat: house.lat, lng: house.lng };
  const distance = getDistance(userLocation, houseLocation);
  if (house.position === 1) {
    map.setCenter(houseLocation);
    console.log("1");
  }

  const card = document.createElement("div");
  card.classList.add("house-card");

  //-------------------left card for image-------------------------//

  const leftCard = document.createElement("div");
  leftCard.classList.add("house-dp");
  if (house.isSuperhost)
    leftCard.innerHTML = `<div class="superHost">Super Host</div>`;
  const dp = document.createElement("img");
  dp.src = house.images[0];
  dp.alt = "";
  leftCard.appendChild(dp);
  card.appendChild(leftCard);

  //----------------------right of card for details--------------//

  const rightCard = document.createElement("div");
  rightCard.classList.add("house-details");

  //-----------------top row title-------------------//
  const title = document.createElement("div");
  title.innerHTML = `<div class="title">
  <div>
    <p class="type">${house.type}</p>
    <h3 class="name">${house.name}</h3>
  </div>
  <div>
    <svg class="heart white" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9934 9.64436C14.0607 7.48008 10.8377 6.8979 8.41618 8.87972C5.99464 10.8616 5.65372 14.1751 7.55537 16.519L15.9934 24.3334L24.4313 16.519C26.333 14.1751 26.0337 10.8407 23.5705 8.87972C21.1074 6.91874 17.9261 7.48008 15.9934 9.64436Z" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
    <svg class="heart pink" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9934 9.64436C14.0607 7.48008 10.8377 6.8979 8.41618 8.87972C5.99464 10.8616 5.65372 14.1751 7.55537 16.519L15.9934 24.3334L24.4313 16.519C26.333 14.1751 26.0337 10.8407 23.5705 8.87972C21.1074 6.91874 17.9261 7.48008 15.9934 9.64436Z" fill="#FDA4AF" stroke="#F43F5E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </div>
  </div>`;
  rightCard.appendChild(title);

  //-----------------------amenities -------------------//
  const amenities = document.createElement("div");
  amenities.classList.add("amenities");
  const p1 = document.createElement("p");
  p1.innerText = `${house.persons} guests ·${house.bedrooms} bedrooms · ${house.beds} beds · ${house.bathrooms} bath`;
  amenities.appendChild(p1);

  const p2 = document.createElement("p");
  let s2 = "";
  for (let i = 0; i < house.previewAmenities.length; i++) {
    if (s2 === "") {
      s2 += house.previewAmenities[i];
    } else s2 += `· ${house.previewAmenities[i]}`;
  }
  p2.innerText = s2;

  amenities.appendChild(p2);

  //---------------------is rare find-------------------//

  const rare = document.createElement("div");
  rare.classList.add("rareFind");
  rare.innerHTML = `<img src="./images/diamond.png" height="15px" alt="" srcset="" />
  <span> Rare Find</span>`;
  if (house.rareFind) amenities.appendChild(rare);

  rightCard.appendChild(amenities);

  //--------------------------reviews and cost ------------------------//

  const numbers = document.createElement("div");
  numbers.classList.add("numbers");
  numbers.innerHTML = `<div class="ratings">
  <p class="bold">${house.rating}</p>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 3.95825L11.4583 8.54158H16.0417L12.2917 11.4583L13.5417 16.0416L10 13.1249L6.45834 16.0416L7.70834 11.4583L3.95834 8.54158H8.54168L10 3.95825Z" fill="#FCD34D" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
  <p class="">(${house.reviewsCount} reviews)</p>
  </div>`;

  const priceCrd = document.createElement("div");
  priceCrd.className = "price";
  priceCrd.innerHTML = `<p class="bold">₹ ${house.price.rate}</p>
  <p>/night</p>`;

  const costButton = document.createElement("button");
  costButton.innerText = "Cost Breakdown";
  costButton.className = "cardBtn";
  costButton.addEventListener("click", () => createModal(house));
  priceCrd.appendChild(costButton);

  numbers.appendChild(priceCrd);
  rightCard.appendChild(numbers);

  //------------------------host details , distance , direction ---------------//

  const hostC = document.createElement("div");
  hostC.classList.add("host");
  hostC.innerHTML = `<div class="hostDetails">
  <img src="${house.hostThumbnail}" alt="" />
  <span>Host Name</span>
</div>`;

  const distanceC = document.createElement("div");
  distanceC.className = "distance";
  distanceC.innerHTML = `<span>${distance} KM away</span>`;

  const directionsBtn = document.createElement("button");
  directionsBtn.className = "cardBtn";
  directionsBtn.innerText = "Get directions";
  directionsBtn.addEventListener("click", () => {
    openDirections(houseLocation);
  });

  distanceC.appendChild(directionsBtn);
  hostC.appendChild(distanceC);

  rightCard.appendChild(hostC);

  card.appendChild(rightCard);

  const position = { lat: house.lat, lng: house.lng };
  new google.maps.Marker({
    position: position,
    map,
    title: house.name,
  });

  return card;
}

// -------------------------------------------------------load map---------------------------------------------------------------------------------//

let map;
function initMap() {
  const myLatLng = {
    lat: 13.067439,
    lng: 80.237617,
  };
  map = new google.maps.Map(document.getElementById("gmp-map"), {
    zoom: 8,
    center: myLatLng,
    fullscreenControl: false,
    zoomControl: true,
    streetViewControl: false,
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "My location",
  });
}

//-------------------------------------google location matrix-----------------------------------------------------------//
function getDistance(origin, dest) {
  lon1 = (origin.lng * Math.PI) / 180;
  lon2 = (dest.lng * Math.PI) / 180;
  lat1 = (origin.lat * Math.PI) / 180;
  lat2 = (dest.lat * Math.PI) / 180;

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  let r = 6371;
  let dist = c * r;
  return Math.round(dist * 10) / 10;
}

// ---------------------------------------modal---------------------------------------------//
const modal = document.getElementById("modal");
let closeMdl = document.getElementById("modalClose");

function createModal(house) {
  console.log("running");
  const priceBD = house.price.priceItems;
  let adlCost = 0;
  for (let i = 1; i < priceBD.length; i++) {
    adlCost += priceBD[i].amount;
  }
  modal.innerHTML = `<div class="modal-content">
  <span onclick="closeModal()" class="close" id="modalClose"
    >&times;</span
  >
  <div class="matter">
    <h2>Booking Cost Breakdown</h2>
    <p>Base Rate: ₹${priceBD[0].amount}</p>
    <p>Additional Fees: ₹${adlCost}</p>
    <p>Total Cost: ₹${house.price.rate}</p>
  </div>
</div>`;
  openModal();
}

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//--------------------------------------------get directions-------------------------------------------------------------------//
function openDirections(location) {
  // Open Google Maps directions in a new tab
  const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${location.lat},${location.lng}`;
  window.open(url, "_blank");
}

// ---------------------------------useless code -------------------------------------------------------------------------//
function listToUI(result) {
  const results = result.results;
  for (let i = 0; i < results.length; i++) {
    let house = results[i];

    const listingLocation = `${house.latitude}-${house.longitude}`;
  }
}
