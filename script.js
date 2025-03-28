const API_URL = "https://api.freeapi.app/api/v1/public/books";
const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const gridViewBtn = document.getElementById("gridView");
const listViewBtn = document.getElementById("listView");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
let totalPages = 1;
let allBooks = [];

async function fetchBooks(page = 1) {
  try {
    const response = await fetch(`${API_URL}?page=${page}&limit=10`);
    const data = await response.json();

    if (data.success) {
      allBooks = data.data.data;
      totalPages = data.data.totalPages;
      renderBooks(allBooks);
      updatePaginationControls();
    } else {
      throw new Error("Failed to fetch books");
    }
  } catch (error) {
    console.error("Error:", error);
    bookContainer.innerHTML = `<p>Error loading books: ${error.message}</p>`;
  }
}

function renderBooks(books) {
  bookContainer.innerHTML = "";
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    const thumbnailUrl =
      book.volumeInfo?.imageLinks?.thumbnail ||
      "https://via.placeholder.com/200x300?text=No+Image";

    bookCard.innerHTML = `
            <img src="${thumbnailUrl}" alt="${
      book.volumeInfo?.title || "Book"
    }">
            <div class="book-details">
                <h2>${book.volumeInfo?.title || "Unknown Title"}</h2>
                <p>Author: ${
                  book.volumeInfo?.authors?.join(", ") || "Unknown Author"
                }</p>
                <p>Publisher: ${
                  book.volumeInfo?.publisher || "Unknown Publisher"
                }</p>
                <p>Published: ${
                  book.volumeInfo?.publishedDate || "Unknown Date"
                }</p>
            </div>
        `;

    bookCard.addEventListener("click", () => {
      window.open(book.volumeInfo?.infoLink, "_blank");
    });

    bookContainer.appendChild(bookCard);
  });
}

function searchBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredBooks = allBooks.filter(
    (book) =>
      book.volumeInfo?.title.toLowerCase().includes(searchTerm) ||
      book.volumeInfo?.authors?.some((author) =>
        author.toLowerCase().includes(searchTerm)
      )
  );
  renderBooks(filteredBooks);
}

function sortBooks() {
  const sortValue = sortSelect.value;
  let sortedBooks = [...allBooks];

  switch (sortValue) {
    case "title-asc":
      sortedBooks.sort((a, b) =>
        a.volumeInfo?.title.localeCompare(b.volumeInfo?.title)
      );
      break;
    case "title-desc":
      sortedBooks.sort((a, b) =>
        b.volumeInfo?.title.localeCompare(a.volumeInfo?.title)
      );
      break;
    case "date-asc":
      sortedBooks.sort(
        (a, b) =>
          new Date(a.volumeInfo?.publishedDate) -
          new Date(b.volumeInfo?.publishedDate)
      );
      break;
    case "date-desc":
      sortedBooks.sort(
        (a, b) =>
          new Date(b.volumeInfo?.publishedDate) -
          new Date(a.volumeInfo?.publishedDate)
      );
      break;
  }

  renderBooks(sortedBooks);
}

function updatePaginationControls() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function changeView(viewType) {
  bookContainer.classList.toggle("book-list", viewType === "list");
}

// Event Listeners
searchInput.addEventListener("input", searchBooks);
sortSelect.addEventListener("change", sortBooks);
gridViewBtn.addEventListener("click", () => changeView("grid"));
listViewBtn.addEventListener("click", () => changeView("list"));

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchBooks(currentPage);
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchBooks(currentPage);
  }
});

// Initial Load
fetchBooks();
