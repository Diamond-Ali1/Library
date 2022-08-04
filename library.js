const formDisplayBtn = document.querySelector("#button");
const formCloseBtn = document.querySelector(".close");
const editFormCloseBtn = document.querySelector(".closeEditForm");
const bookShelf = document.querySelector("#bookShelf");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const pages = document.querySelector("#pages");
const read = document.querySelector("#read");
const form = document.querySelector("#formSection");
const editForm = document.querySelector("#edit")
const submitBtn = document.querySelector("#submit");
const entries = document.querySelector("form");
const confirmationMessage = document.querySelector(".confirmationMessage");
const editTitle = document.querySelector(".editTitle");
const editAuthor = document.querySelector(".editAuthor");
const editPages = document.querySelector(".editPages");
const editRead = document.querySelector(".read");
const cancel = document.querySelector(".choice .cancel");
const okay = document.querySelector(".choice .okay");
const addChanges = document.querySelector(".addChanges");
const body = document.querySelector("body");
const nameForm = document.querySelector("#nameForm");
const warning = document.querySelector(".warning")
let name = document.querySelector(".name");
let nameValue =  document.querySelector(".nameValue");
let progress = document.querySelector(".continue");
let formOpen = false, 
triedSubmitting = false;
class Books{
  constructor(title,author,pages,read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}
class BookContainer{
  constructor(title,author,pages,read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.readBook = this.read == "yes" ? true : false;
    this.circle = elt("div", {"class":"circle"}); 
    this.bar = elt("div", {"class":"bar"}); 
    this.readStatus = elt("span", {"class":"readStatus"}, createText("Not read❌"));
    this.deleteBook = elt("button", {"class":"delete"}, createText("Delete Book"));
    this.edit =  elt("button", {"class":"edit"}, createText("Edit Book")); 
    this.bookContainer = elt("div", {"class":"bookContainer"},
    elt("h3", {"class":"bookHeader"},createText(`Title: ${this.title}`)),
    elt("p", {"class":"bookParagraph"}, createText(`Author: ${this.author}`)),
    elt("p", {"class":"bookParagraph"}, createText(`Pages: ${this.pages}`)),
    elt("div", {"class":"statusBtn"},
    elt("span", {},createText("Status: ") ), this.bar, this.circle, this.readStatus),elt("div", {"class":"update"},this.deleteBook, this.edit)); 
  }
  draw() {
    bookShelf.appendChild(this.bookContainer);
  }
}
//books storage
let Library = [];
let bookContainers = [];
function displayForm() {
		form.style.display = "block";
		form.style.transform = "scale(1,1)";
		formDisplayBtn.style.transform = "rotate(45deg)";
		formDisplayBtn.style.transition = "0.5s"
		form.style.opacity = "1";
		formOpen = true;
}
function displayEditForm() {
  editForm.style.display = "block";
  editForm.style.transform = "scale(1,1)";
  editForm.style.opacity = "1"; 
}
function closeEditForm() {
  editForm.style.transition = "0.5s"
  editForm.style.transform = "scale(0,0)";
  editForm.style.opacity = "0"; 
}
//close the form
function  closeForm() {
		form.style.opacity = "0";
		form.style.transform = "scale(0,0)";
		formDisplayBtn.style.transform = "rotate(0)";
		formDisplayBtn.style.transition = "0.5s";
		form.style.transition = "0.5s";
		formOpen = false;
		entries.reset();
		triedSubmitting = false;
}
function saveData() {
  localStorage.setItem("library",
    JSON.stringify(Library));
}  
//makes new book and adds them to library
function addBookToLibrary(title, author, pages, read) {
  let book = new Books(title, author, pages, read);
  Library.push(book);
}
function createBookContainer(title, author, pages, read) {
  let container = new BookContainer(title, author, pages, read);
  bookContainers.push(container);
}
//creates a new element and assigns a class name to it
function elt(name,attrs,...children) {
  let newElt = document.createElement(name);
  for (attr of Object.keys(attrs)) {
    newElt.setAttribute(attr, attrs[attr]);
  }
  for (child of children) {
    newElt.appendChild(child);
  }
  return newElt;
}
//creates text
function createText(text) {
 return document.createTextNode(text);
}
function update() {
  bookContainers.map((book, index) => {
    book.circle.style.transition = "1s";
    book.readBook ? book.bar.style.background = "linear-gradient(to right, black,25%, green)" : book.bar.style.background = "linear-gradient(to right, red,75%, black)";
    book.readBook ? book.readStatus.innerHTML = "read✅" : book.readStatus.innerHTML = "not read❌"
    book.readBook ? book.circle.style.marginLeft = "125px" : book.circle.style.marginLeft = "75px"
    book.readBook ? book.bookContainer.style.borderLeftColor = "green" : book.bookContainer.style.borderLeftColor = "red";
    book.circle.onclick = () => {
      Library[index].read === "yes" ? Library[index].read = "no" : Library[index].read = "yes"
    }
  })
}
function deleteBook() {
  bookContainers.map((book, index) => {
    book.deleteBook.onclick = () => {
        confirmationMessage.style.display = "block";
        cancel.onclick = () => {
          confirmationMessage.style.display = "none";
        }
        Library.map((book) => {
          okay.onclick = () => {
            Library.splice(index, 1);
            confirmationMessage.style.display = "none";
          }
        })
    }
  })
}
function editBook() {
  bookContainers.map((book, index) => {
    book.edit.onclick = () => {
      editTitle.value = book.title;
      editAuthor.value = book.author;
      editPages.value = Number(book.pages);
      displayEditForm()
      editFormCloseBtn.onclick = closeEditForm;
      Library.map(item => {
        addChanges.onclick = () => {
          let newContainer = new BookContainer(editTitle.value, editAuthor.value, editPages.value, editRead.value);
          Library.splice(index, 1, newContainer);
          closeEditForm();
        }
      })
    }
  })
}
function render() {
  bookShelf.innerHTML = "";
  Library.map(book => {
    createBookContainer(book.title, book.author, book.pages, book.read);
  })
  bookContainers.map((book, index)=> {
    book.draw();
  })
  update();
  deleteBook();
  editBook();
  saveData();
  bookContainers = [];
}
function createBook() {
  if (!"".includes(title.value && author.value && pages.value)) {
    triedSubmitting = false;
    addBookToLibrary(title.value, author.value, pages.value, read.value);
    closeForm();
    render();
  } else {
    triedSubmitting = true;
  }
} 
addEventListener("click", () => {
  title.value === "" && triedSubmitting ? title.classList.add("empty") : title.classList.remove("empty");
  author.value === "" && triedSubmitting ? author.classList.add("empty") : author.classList.remove("empty");
  pages.value.length == 0 && triedSubmitting ? pages.classList.add("empty") : pages.classList.remove("empty");
  render();
})
addEventListener("load", () => {
  let library = localStorage.getItem("library"); 
  if (library) {
    Library = JSON.parse(library)
  }; 
  let user = localStorage.getItem("user");
  if (!user) {
  		nameForm.style.display = "block";
  }
  if (user) {
  		name.innerHTML = `${localStorage.getItem("user")}'s`
  }
  render();
});
progress.addEventListener("click", () => {
		if (nameValue.value.length > 2) {
				localStorage.setItem("user",nameValue.value);						
				name.innerHTML = `${localStorage.getItem("user")}'s`
				nameForm.style.display = "none";
				warning.style.display = "none";
		} else {
				warning.style.display = "block";
		}
})
formDisplayBtn.addEventListener("click", () => {
  formOpen ? closeForm() : displayForm();
});
formCloseBtn.addEventListener("click" , closeForm);
submitBtn.addEventListener("click", createBook);
setTimeout(() => {
  console.log(Library)
}, 10)
