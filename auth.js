const token = localStorage.getItem('token');
if (!token) {
	// User is not logged in, redirect to login page
	window.location.href = 'login.html';
}

async function checkifloggedin() {
  const token = localStorage.getItem('token');
  if (!token) {
    // User is not logged in, redirect to login page
    window.location.href = 'login.html';
  }

  try {
    const response = await fetch(URL + 'auth/validatetoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    // Handle network or server errors
    console.error(error);
    // Display an error message to the user
    localStorage.setItem('errorMessage', 'tokeninvalid');
    window.location.href = 'login.html';
    errorMessage.textContent = 'Invalid token. Please login again..';
  }
}



function logout() {
  localStorage.clear(); // Clears all data from localStorage
  window.location.replace(""); // Redirects to login page
}
