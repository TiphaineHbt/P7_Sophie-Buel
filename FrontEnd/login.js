
// ------- Requéte API ---------------------------

function requestLogin() {
    return fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "email": stockInputEmail,
            "password": stockInputPassword,
        })
    });
};
// ---- Récupération du dom -----------------------------------------
const inputPassword = document.querySelector('input[type="password"]');
const inputEmail = document.querySelector('input[type="email"]');
const submit = document.querySelector('input[type="submit"]');
const errorDisplay = document.querySelector('.error');
const login = document.getElementById("login");
//------ Variable de stockage valeur 
let stockInputPassword = inputPassword.value;
let stockInputEmail = inputEmail.value;
//--------- Evénement click formulaire + check 
submit.addEventListener('click', (e) => {
    e.preventDefault();
    stockInputEmail = inputEmail.value;
    stockInputPassword = inputPassword.value;
    requestLogin()
        .then((response) => response.json())
        .then(login => {
            if (login.token) {
                localStorage.setItem('token', login.token);
                window.location.href = "./index.html";
            } else {
                console.error("Le token n'a pas été trouvé");
                errorDisplay.innerHTML = "Identifiant ou Mot de passe incorrect";
            };
        });
});
// ------ Récupération des données --------------

inputEmail.addEventListener('input', (e) => {
    console.log(e.target.value);

});
inputPassword.addEventListener('input', (e) => {
    console.log(e.target.value);
});