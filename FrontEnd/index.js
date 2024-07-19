const logoutButton = document.getElementById("logout");
const token = localStorage.getItem("token");
let worksData; // stockage des données (projets)
let categoriesData; // stockage des categories
const portFolio = document.getElementById("portfolio");
const linkEdit = document.querySelector(".link__modal__portfolio");
//--------------------------------------------------------------------------------------------
//----------- Récupération des API -------------------------
async function fetchCategory() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    categoriesData = categories;
    return categories;
}
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    worksData = works;
    return works;
}
// --- fonction asynchrome afin d'attendre la récupération des données
async function fetchData() {
    const works = await fetchWorks();
    const categories = await fetchCategory();
    displayProjectAndCategories(categories, works);
}

//-------- Fonction refresh pour synchroniser les images supprimés
function refreshWorks() {
    fetchWorks().then((works) => {
        worksData = works;
        displayWorks();
    });
}
fetchData();
//---------------------------------------------------------------------------------------------
//**********/ Fonction qui comprend l'affichage des images **********
function displayWorks() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    worksData.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <figcaption>${project.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}
//------------------------------- Affichage des catégories et projets ---------------------------------------------------------------------------
function displayProjectAndCategories() {
    const buttonDiv = document.createElement("div");
    portFolio.appendChild(buttonDiv);
    const buttonADD = document.createElement("button");
    buttonADD.textContent = "Tous ";
    buttonADD.addEventListener("click", () => {
        displayWorks(worksData);
    });
    buttonADD.classList.add("button_category");
    buttonDiv.classList.add("button_div");
    buttonDiv.appendChild(buttonADD);
    categoriesData.forEach((category) => {
        const buttonCategory = document.createElement("button");
        buttonCategory.textContent = category.name;
        buttonCategory.classList.add("button_category");
        buttonDiv.appendChild(buttonCategory);
        buttonCategory.addEventListener("click", () => {
            const categoryName = buttonCategory.textContent;
            const gallery = document.querySelector(".gallery");
            const filterWorks = worksData.filter((work) => {
                return work.category.name === categoryName;
            });
            gallery.innerHTML = "";
            filterWorks.forEach((project) => {
                const figure = document.createElement("figure");
                figure.innerHTML = `
                    <img src="${project.imageUrl}" alt= "${project.title}">
                    <figcaption>${project.title}</figcaption>
                    `;
                gallery.appendChild(figure);
            });
            console.log(filterWorks);
        });
        displayWorks();
    });
    const secondChild = portFolio.children[1];
    portFolio.insertBefore(buttonDiv, secondChild);
}
//---------------------------------------------------------------------------------------------
//----- fonctionnalité administration ----------------------------
if (token) {
    administrator();
    logoutAdministrator();
    headbandBlack();
}
logoutButton.addEventListener("click", handleClickLogout);

function handleClickLogout() {
    if (logoutButton.textContent === "login") {
        window.location.href = "./login.html";
    } else if (logoutButton.textContent === "logout") {
        logoutButton.removeEventListener("click", handleClickLogout);
        window.location.href = "./index.html";
    }
}
function administrator() {
    if (token) {
        logoutButton.textContent = "logout";
        const linkModals = document.getElementsByClassName("link__modal");
        document.querySelector("header").style.marginTop = "100px ";
        for (let i = 0; i < linkModals.length; i++) {
            linkModals[i].style.visibility = "visible";
        }
    }
}
function logoutAdministrator() {
    const linkModals = document.getElementsByClassName("link__modal");
    logoutButton.addEventListener("click", function () {
        if (token) {
            localStorage.removeItem("token");
            document.getElementById("modal__header").style.visibility = "hidden";
            for (let i = 0; i < linkModals.length; i++) {
                linkModals[i].style.visibility = "hidden";
            }
        }
    });
}
function headbandBlack() {
    const header = document.querySelector("header");
    const displayHeadband = document.createElement("div");
    header.appendChild(displayHeadband);
    displayHeadband.innerHTML = `
    <aside
      id="modal__header"
      class="modal__header js-modal"
      aria-hidden="true"
      role="dialog"
      aria-modal="false"
      aria-labelledby="title_modal"
    >
      <div  class="modal__header__display">
        <p> <i class="fa-regular fa-pen-to-square"></i> Mode édition </p>
        <p class="modal__header__publish"> publier les changements </p>
      </div>
    </aside>
    `;
}

//---------------------------------------------------------------------------------------------
//-------- Modale ----------------------------------------------------------------------------
linkEdit.addEventListener("click", (event) => {
    displayModalsGallery();
    event.stopPropagation();
});
// --------- Requéte API delete picture
async function fetchDelete(imageId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            console.log("Image supprimée avec succès");
        } else {
            alert("Erreur lors de la suppression de l'image");
        }
    } catch (error) {
        console.log(error);
    };
};
// Fonction affichage de la modal----------------
let isModalOpened = false;
function displayModalsGallery() {
    const body = document.querySelector("body");
    modalGallery = document.createElement("div");
    modalGallery.classList.add("portfolio__link__modal");
    modalGallery.classList.add("modal__close");
    modalGallery.style.display = "block";
    let modalContent = `
        <aside id="modal" class="modal js-modal" aria-hidden="true" aria-labelledby="title_modal">
            <div class="modal__wrapper ">
                <i class="fa-solid fa-xmark close__icon"></i>
                <h3 id="title_modal">Galerie Photos</h3>
                <div class="gallery__modal" id="galleryModal">
    `;
    worksData.forEach((project) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <figure>
            <i class="fa-regular fa-trash-can" id="delete__picture"></i>
            <img  src="${project.imageUrl}" data-id=${project.id} alt="${project.id}">
            <figcaption>éditer</figcaption>
            </figure>
            `;
        modalContent += figure.innerHTML;
    });
    modalContent += `
                </div>
                <div id="submit__modal">
                    <form action="#" method="post">
                        <input type="button" id="submit__add__picture" value="Ajouter une photo" />
                    </form>
                    <span id="delete" class="error"> Supprimer la galerie</span>
                </div>
            </div>
        </aside>
    `;
    body.addEventListener("click", CloseModalClick);
    modalGallery.insertAdjacentHTML("beforeend", modalContent);
    const portFolioContainer = document.getElementById("portfolio");
    portFolioContainer.appendChild(modalGallery);
    const AddPictureInput = document.getElementById("submit__add__picture");
    AddPictureInput.style.fontSize = "14px";
    AddPictureInput.addEventListener("click", (event) => {
        event.stopPropagation();
        ModalNext();
    });
    deletePicture();
    closeModal();
}
function ModalNext() {
    const modalWrapper = document.querySelector(".modal__wrapper");
    modalGallery.style.display = "block";
    modalWrapper.innerHTML = modalWrapper.innerHTML = `
        <div class="icone">
            <i class="fa-solid fa-arrow-left" id="open__modal__previous"></i>
            <i class="fa-solid fa-xmark close__icon"></i>
        </div>
        <div class=add__global>
             <form action="#" class="display__form" method="post">
                <h3 id="title_modal">Ajout photo </h3>
            <div class="add__picture">
                 <i class="fa-regular fa-image previous__icone" ></i>
                 <input type="file" id="modal__add__picture" /> <br>
                 <label for="modal__add__picture" >+ Ajouter une photo</label>
                <p> jpg, png : 4mo max</p>
             </div>
            <div id="modal__title__categorie">
                <label for="name">Titre</label>
                <input type="text" name="name" id="name" autocomplete="name"  />
                 <label for="categories"> Catégorie </label>
                 <select id="categories" name="categories">
                 <option value= " " class="option__category" label="Sélectionner une catégorie" > </option>
                 ${categoriesData.map(
        (category) =>
            `<option value="${category.id}">${category.name}</option>`
    )}
                    </select>
                    </div>
                </form>
         <form action="#" class="form__valid" method="post">
             <input  type="submit" id="valid" value="Valider" />
         </form>
      </div>
            `;
    addPictureInput();
    closeModal();
    const previous = document.getElementById("open__modal__previous");
    previous.addEventListener("click", (event) => {
        event.stopPropagation();
        handleCloseModale();
        displayModalsGallery();
    });
}
function CloseModalClick(event) {
    const modalWrapper = document.querySelector(".modal__wrapper");
    document.querySelector(".modal__wrapper");
    if (modalWrapper.contains(event.target) === false) {
        handleCloseModale();
    }
}
function handleCloseModale() {
    document.body.removeEventListener("click", CloseModalClick);
    modalGallery.remove();
}
function closeModal() {
    const close = document.querySelector(".close__icon");
    close.addEventListener("click", handleCloseModale);
}
function deletePicture() {
    const galleryModal = document.getElementById("galleryModal");
    galleryModal.addEventListener("click", (event) => {
        if (event.target.classList.contains("fa-trash-can")) {
            event.preventDefault();
            const selectedPicture = event.target.parentNode.querySelector("img");
            if (selectedPicture) {
                const imageId = selectedPicture.dataset.id;
                console.log("Image ID:", imageId);
                fetchDelete(imageId).then(() => {
                    selectedPicture.parentNode.remove();
                    refreshWorks();
                });
            }
        }
    });
}
function addPictureInput() {
    const addInput = document.querySelector("#modal__add__picture");
    const divAddPicture = document.querySelector(".add__picture");
    const titleInput = document.querySelector("#name");
    const categoriesInput = document.querySelector("#categories");
    categoriesInput.addEventListener("input", (e) => {
        checker(categoriesInput.value, addInput.files[0], titleInput.value);
    });
    titleInput.addEventListener("input", (e) => {
        checker(categoriesInput.value, addInput.files[0], titleInput.value);
    });
    addInput.addEventListener("change", (e) => {
        const selectFile = e.target.files[0];
        const newFile = new FileReader();
        const fileName = selectFile.name;
        const fileExtension = fileName.split(".").pop().toLowerCase();
        if (fileExtension !== "jpg" && fileExtension !== "png") {
            alert(
                "Format de fichier non valide. Veuillez sélectionner un fichier au format JPG ou PNG."
            );
            return;
        }
        const fileSizeInBytes = selectFile.size;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        const maxSizeInMegabytes = 4;
        if (fileSizeInMegabytes > maxSizeInMegabytes) {
            alert(
                "Taille de fichier dépassée. Veuillez sélectionner un fichier de taille inférieure à 4 Mo."
            );
            return;
        }
        newFile.addEventListener("load", (e) => {
            const addImage = document.createElement("img");
            addImage.src = e.target.result;
            addImage.classList.add("add__img__display");
            divAddPicture.querySelectorAll("*").forEach((child) => {
                child.style.display = "none";
            });
            divAddPicture.appendChild(addImage);
            divAddPicture.style.flexDirection = "revert";
            checker(categoriesInput.value, addInput.files[0], titleInput.value);
        });
        newFile.readAsDataURL(selectFile);
    });
    const submit = document.querySelector(".form__valid");
    submit.addEventListener("submit", (event) => {
        event.preventDefault();
        const work = {
            title: titleInput.value,
            image: addInput.files[0],
            category: categoriesInput.value,
        };
        postLoadWorks(work);
    });
}
function checker(category, title, image) {
    const submitButton = document.getElementById("valid");
    const submit = document.querySelector(".form__valid");
    if (category.trim() !== '' && title && image) {
        submitButton.style.background = "#1D6154";
        submit.disabled = false;
    } else {
        submitButton.style.background = "#A7A7A7";
        submit.disabled = true;
    }
}
function postLoadWorks(work) {
    const token = localStorage.getItem(`token`);
    const formData = new FormData();
    formData.append("image", work.image);
    formData.append("title", work.title);
    formData.append("category", work.category);
    event.preventDefault();
    let request = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    };
    fetch("http://localhost:5678/api/works", request)
        .then((response) => {
            if (response.ok) {
                reinit();
                alert(`Votre projet ` + work.title + ` est en ligne`);
                return fetchWorks();
            } else {
                alert("Veuillez remplir les formulaires ");
                console.log("Erreur lors de la mise à jour de l'image ");
            }
        })
        .then((updateWorks) => {
            if (updateWorks) {
                worksData = updateWorks;
                displayWorks();
            }
        });
}
// Reinitialisation modaleNext
function reinit() {
    const reinitPicture = document.querySelector(".add__img__display");
    const titleInput = document.querySelector("#name");
    const categoriesInput = document.querySelector("#categories");
    const divAddPicture = document.querySelector(".add__picture");
    const submit = document.querySelector(".form__valid");
    const submitButton = document.getElementById("valid");
    reinitPicture.src = "";
    titleInput.value = "";
    categoriesInput.value = "Sélectionner une catégorie";
    submit.disabled = true;
    submitButton.style.background = "#A7A7A7";
    divAddPicture.querySelectorAll("*").forEach((child) => {
        child.style.display = "flex";
    });
    divAddPicture.style.flexDirection = "column";
    ModalNext();
}
