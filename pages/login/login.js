const URL = 'http://localhost:8080/auth/login';
//const URL = "https://swiftmarine.azurewebsites.net/auth/login";

const errorMessage = document.getElementById("errorMessage");

const message = localStorage.getItem('errorMessage');

if (message === 'notloggedin') {
  errorMessage.textContent = 'You are not logged in. Please log in to access this page.';
  errorMessage.style.display = 'block';
} else if (message === 'tokeninvalid') {
  errorMessage.textContent = 'Your session has expired. Please log in again.';
  errorMessage.style.display = 'block';
}

// Clear the error message from local storage
localStorage.removeItem('errorMessage');

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("loader").style.display = "block";
  document.getElementById("submitBtn").style.display = "none";
  const username = loginForm.elements["username"].value;
  const password = loginForm.elements["password"].value;
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid login credentials");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      document.getElementById("loader").style.display = "none";
      document.getElementById("submitBtn").style.display = "block";
      window.location.href = "../../index.html";
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById("loader").style.display = "none";
      document.getElementById("submitBtn").style.display = "block";
      errorMessage.textContent =
        "Invalid username or password. Please try again.";
      errorMessage.style.display = "block";
    });
});
