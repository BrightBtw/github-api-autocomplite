const inputSearch = document.querySelector(".search-input");
const autocompleteList = document.querySelector(".autocomplete-list");
const repoList = document.querySelector(".repo-list");

async function fetchRepo(query) {
  if (!query.trim()) {
    clearInput();
    return;
  }

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`;
  try {
    const respons = await fetch(url);
    if (!respons.ok) {
      throw new Error("Ошибка, сервер вернул статус от 400 до 599");
    }
    const data = await respons.json();
    console.log(data.items);
    renderAutocompleteList(data.items || []);
  } catch (error) {
    console.log("Ошибка при получении данных", error.message);
  }
}

function clearInput() {
  autocompleteList.innerHTML = "";
}

const debounce = (fn, debounceTime) => {
  //code here
  let timeoutID;
  return function (...args) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

inputSearch.addEventListener(
  "input",
  debounce((event) => {
    fetchRepo(event.target.value);
  }, 400),
);

function renderAutocompleteList(repos) {
  clearInput();
  if (repos.length === 0) return;

  repos.forEach((repo) => {
    const createLi = document.createElement("li");
    createLi.className = "autocomplete-item";
    createLi.textContent = repo.name;
    createLi.addEventListener("click", () => {
      addCard(repo);
      inputSearch.value = "";
      clearInput();
    });
    autocompleteList.appendChild(createLi);
  });
}

function addCard(repo) {
  const createLi = document.createElement("li");
  createLi.className = "repo-item";
  createLi.innerHTML = `<div class="repo-info">
      <p class="repo-text">Name: ${repo.name}</p>
      <p class="repo-text">Owner: ${repo.owner.login}</p>
      <p class="repo-text">Stars: ${repo.stargazers_count}</p>
    </div>
    <button class="remove-btn"></button>`;

  const removeBtn = createLi.querySelector(".remove-btn");
  removeBtn.addEventListener("click", () => {
    createLi.remove();
  });
  repoList.appendChild(createLi);
}
