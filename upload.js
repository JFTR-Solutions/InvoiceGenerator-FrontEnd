//const URL = 'http://localhost:8080/';
const URL = 'https://swiftmarine.azurewebsites.net/';

document.addEventListener('DOMContentLoaded', () => {
  checkifloggedin();
    const uploadButton = document.querySelector('.btn-upload');
  
    if (document.getElementById('numberInput')) {
      const numberInput = document.getElementById('numberInput');
    
      // Add an event listener to the input field
      numberInput.addEventListener('input', () => {
        // If the input value length is more than 7, remove the extra digits
        if (numberInput.value.length > 7) {
          numberInput.value = numberInput.value.slice(0, 7);
        }
    
        // Check if the input value is a valid 7-digit number
        if (numberInput.value.length === 7 && !isNaN(numberInput.value)) {
          // Enable the upload button
          uploadButton.disabled = false;
        } else {
          // Disable the upload button
          uploadButton.disabled = true;
        }
      });
    }

    
    if (document.getElementById('uploadButton')) {
      const uploadButton = document.getElementById('uploadButton');

    uploadButton.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.multiple = true; // Allow multiple files to be selected
  
      input.addEventListener('change', async () => {
        document.getElementById("loader").style.display = "block";
        document.getElementById("uploadButton").style.display = "none";
        const files = Array.from(input.files);
        const dispatchNumber = document.getElementById("numberInput").value;
        if (files.length === 0) return;
      
        const formData = new FormData();
        formData.append('dispatchNumber', dispatchNumber);
      
        files.forEach((file) => {
          formData.append('files', file);
        });
        try {
          const apiUrl = URL + 'invoices/byte';
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('User not logged in');
				}
				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`
					},
					body: formData
				});
  
          if (response.status === 200) {
            // Convert the response to a byte array using a FileReader
            const blob = await response.blob();
            const fileReader = new FileReader();
            fileReader.onload = () => {
              const byteArray = new Uint8Array(fileReader.result);
              // Use the byte array to download the file
              downloadFile(byteArray, dispatchNumber + '_Invoice.xlsx');
            };
            fileReader.readAsArrayBuffer(blob);
            document.getElementById("loader").style.display = "none";
            document.getElementById("uploadButton").style.display = "block";
          } else {
            console.error('Failed to upload files', response);
            document.getElementById("loader").style.display = "none";
            document.getElementById("uploadButton").style.display = "block";
          }
        } catch (error) {
          console.error('Error uploading files', error);
          document.getElementById("loader").style.display = "none";
          document.getElementById("uploadButton").style.display = "block";
        }
      });
  
      input.click();
    });
    }
  });
  async function uploadFiles(formData, url) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
  
    return response;
  }
  
  function downloadFile(byteArray, fileName) {
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }

/*   const token = localStorage.getItem('token');
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
 */