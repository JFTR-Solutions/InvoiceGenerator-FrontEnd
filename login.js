<<<<<<< HEAD
//const URL = 'http://localhost:8080/auth/login';
const URL = 'https://swiftmarine.azurewebsites.net/auth/validate';
=======
//const URL = 'http://localhost:8080/auth/login';
const URL = 'https://swiftmarine.azurewebsites.net/auth/login';
>>>>>>> 6e5ff4ca9d6dd8f12eed0b78bb20a0b873fc5b69

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	document.getElementById("loader").style.display = "block";
	const username = loginForm.elements['username'].value;
	const password = loginForm.elements['password'].value;
	fetch(URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			password: password
		})
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Invalid login credentials');
		}
		return response.json();
	})
	.then(data => {
		localStorage.setItem('token', data.token);
		document.getElementById("loader").style.display = "none";
		window.location.href = 'index.html';
	})
	.catch(error => {
		console.log(error.message);
	});
});

