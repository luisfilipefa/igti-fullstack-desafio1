let allUsers = [];
let usersFound = [];
let usersFoundCounter = 0;
let totalMales = 0;
let totalFemales = 0;
let ageSum = 0;
let ageAverage = 0;
let form = null;
let searchInput = null;
let searchButton = null;
let userSection = null;
let statsSection = null;
let usersContainer = null;
let statsContainer = null;

window.addEventListener("load", () => {
  fetchData();

  form = document.querySelector("form");
  form.addEventListener("submit", (event) => event.preventDefault());

  searchInput = document.querySelector("#searchbar");
  searchbar.addEventListener("keyup", (event) => inputHandler(event));

  searchButton = document.querySelector("#search-button");
  searchButton.addEventListener("click", (event) => inputHandler(event));

  userSection = document.querySelector(".users-section");
  statsSection = document.querySelector(".stats-section");

  usersContainer = userSection.querySelector(".users-container");
  statsContainer = statsSection.querySelector(".stats-container");
});

const fetchData = async () => {
  const response = await fetch("http://localhost:3001/users");
  const json = await response.json();
  allUsers = json.map((user) => {
    const { dob, gender, name, picture } = user;

    return {
      age: dob.age,
      gender,
      name: `${name.first} ${name.last}`,
      picture: picture.thumbnail,
    };
  });
};

const render = () => {
  usersFound.sort((a, b) => a.name.localeCompare(b.name));

  usersFoundCounter = usersFound.length;

  let usersList = `
    <h2 class="section-title">${usersFoundCounter} user(s) found</h2>
    <ul class="users-list">
    `;

  let statsList = `
    <h2 class="section-title">Statistics</h2>
    <ul class="stats-list">
  `;

  usersFound.forEach((user) => {
    const { age, gender, name, picture } = user;

    if (gender.toLowerCase() === "male") {
      totalMales += 1;
    }
    if (gender.toLowerCase() === "female") {
      totalFemales += 1;
    }

    ageSum += age;

    let userItem = `
      <li class="user-item">
        <div class="img-container">
          <img src="${picture}" />
        </div>
        <span class="user-name">${name} | </span>
        <span class="user-age">${age} years</span>
      </li>
    `;

    usersList += userItem;
  });

  ageAverage = ageSum / usersFound.length;

  let statsItem = `
    <li class="stats-item">Male: ${totalMales}</li>
    <li class="stats-item">Female: ${totalFemales}</li>
    <li class="stats-item">Age sum: ${ageSum}</li>
    <li class="stats-item">Age average: ${Math.floor(ageAverage)}</li>
  `;

  statsList += statsItem;

  usersContainer.innerHTML = usersList;
  statsContainer.innerHTML = statsList;
};

const inputHandler = (event) => {
  if (event.target.id === "search-button") {
    const query = event.target.previousElementSibling.value;
    if (query) {
      filterUsers(query);
    }
  }

  if (event.target.id === "searchbar") {
    const query = event.target.value;
    if (event.key === "Enter" && query) {
      filterUsers(query);
    }
  }
};

const filterUsers = (query) => {
  usersFound = [];
  allUsers.forEach((user) => {
    const { age, gender, name, picture } = user;
    if (name.toLowerCase().includes(query.toLowerCase())) {
      let userFound = user;
      usersFound = [...usersFound, userFound];
    }
  });

  render();
};
