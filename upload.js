document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.querySelector('.btn-upload');
  
    uploadButton.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf'; // Add other accepted file types if needed, e.g. 'image/*' for images
      input.multiple = true; // Allow multiple files to be selected
  
      input.addEventListener('change', async () => {
        document.getElementById("loader").style.display = "block";
        const files = Array.from(input.files);
        if (files.length === 0) return;
  
        const formData = new FormData();
  
        files.forEach((file) => {
          formData.append('files', file);
        });
  
        try {
          const apiUrl = 'http://localhost:8080/invoices/byte';
          const response = await uploadFiles(formData, apiUrl);
  
          if (response.status === 200) {
            // Convert the response to a byte array using a FileReader
            const blob = await response.blob();
            const fileReader = new FileReader();
            fileReader.onload = () => {
              const byteArray = new Uint8Array(fileReader.result);
              // Use the byte array to download the file
              downloadFile(byteArray, 'Invoice.xlsx');
            };
            fileReader.readAsArrayBuffer(blob);
            document.getElementById("loader").style.display = "none";
          } else {
            console.error('Failed to upload files', response);
            document.getElementById("loader").style.display = "none";
          }
        } catch (error) {
          console.error('Error uploading files', error);
          document.getElementById("loader").style.display = "none";
        }
      });
  
      input.click();
    });
  });
  
  async function uploadFiles(formData, url) {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
  
    return response;
  }
  
  function downloadFile(byteArray, fileName) {
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }
