const button = document.querySelector(".fetch-data");
const previousBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageInfo = document.querySelector(".page-info");

let currentPage = 1;
const postsPerPage = 5;

const addLoader = () => {
  document.querySelector(".loading").classList.add("d-block");
};

const removeLoader = () => {
  document.querySelector(".loading").classList.remove("d-block");
};

const handleError = (error) => {
  removeLoader();
  let body = document.querySelector("body");
  let para = document.createElement("p");
  para.setAttribute("class", "showError");
  para.textContent = `${error}, An Error occured, while loading data`;
  body.appendChild(para);
};

const handlePosts = async () => {
  addLoader();
  document.querySelector(".stories").innerHTML = "";
  try {
    let response = await axios.get("https://hn.algolia.com/api/v1/search"); // https://hn.algolia.com/api/v1/search
    console.log(response);
    if (response.status == 200) {
      removeLoader();
    }
    let data = response.data.hits;
    console.log(data);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const showData = paginatedData
      .map((data) => {
        return `<div class="story">
        <h3 class= "title">${data.title}</h3>
        <h4 class="info">${data.author}</h4>
        <p>${data.points}</p> 
        </div>`;
      })
      .join("");
    document.querySelector(".stories").innerHTML = showData;
    updatePage(data.length);
  } catch (error) {
    handleError(error);
  }
};

const updatePage = (totalPosts) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  previousBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
};

button.addEventListener("click", handlePosts);

nextBtn.addEventListener("click", () => {
  currentPage++;
  handlePosts();
});

previousBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    handlePosts();
  }
});

