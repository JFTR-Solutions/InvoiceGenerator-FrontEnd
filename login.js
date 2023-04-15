const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const username = loginForm.elements['username'].value;
	const password = loginForm.elements['password'].value;
	fetch('http://localhost:8080/auth/login', {
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
		window.location.href = 'index.html';
	})
	.catch(error => {
		alert(error.message);
	});
});

