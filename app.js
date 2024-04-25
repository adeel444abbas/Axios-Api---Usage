const button = document.querySelector(".fetch-data");
const pagination = document.querySelector(".pagination");
const previousBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageInfo = document.querySelector(".page-info");

nextBtn.classList.add("disp-none");
pageInfo.classList.add("disp-none")
previousBtn.classList.add("disp-none")


let currentPage = 1;
const postsPerPage = 5;

const addLoader = () => {
  document.querySelector(".loading").classList.add("d-block");
};

const removeLoader = () => {
  document.querySelector(".loading").classList.remove("d-block");
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
    removeLoader();
    alert(`${error}, An Error occured, while loading data`);
    throw Error(`${error}, An Error occured, while loading data`);
  }
};

const updatePage = (totalPosts) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  pageInfo.classList.remove("disp-none");
  nextBtn.classList.remove("disp-none");
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
  if(currentPage  > 1){
    previousBtn.classList.remove("disp-none");
  } else{
    previousBtn.classList.add("disp-none");
  }
  if(currentPage === 4){
    nextBtn.classList.add("disp-none")
  }
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
