const apiUrl = 'http://localhost:8080/auth/login';
const loginForm = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

loginForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const username = usernameInput.value;
	const password = passwordInput.value;

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});
		if (response.ok) {
			console.log('Login successful');
			// Redirect to the dashboard or homepage
		} else {
			console.error('Login failed');
			// Display an error message to the user
		}
	} catch (error) {
		console.error('Login failed:', error);
		// Display an error message to the user
	}
});
