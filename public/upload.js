document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const imagePath = await response.text();
      const baseUrl = window.location.href.replace(/\/$/, ''); // Remove trailing slash, if any
      document.getElementById('imagePath').innerHTML = `Image uploaded successfully!<br>Path: <a href="${baseUrl}${imagePath}" target="_blank">${imagePath}</a>`;
    } else {
      document.getElementById('imagePath').innerHTML = 'Failed to upload image. Please try again.';
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
});

document.getElementById('listButton').addEventListener('click', async () => {
  try {
    const response = await fetch('/list');
    if (response.ok) {
      const fileList = await response.json();
      const baseUrl = window.location.href.replace(/\/$/, ''); // Remove trailing slash, if any
      document.getElementById('fileList').innerHTML = `<h2>Files in the "files" folder:</h2><ul>${fileList.map(file => `<li>${file} <button class="deleteButton" data-file="${file}">Delete</button></li>`).join('')}</ul>`;

      // Add event listener for each "Delete" button
      document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', async () => {
          const fileName = button.dataset.file;
          try {
            const deleteResponse = await fetch(`/delete/${fileName}`, {
              method: 'DELETE',
            });

            if (deleteResponse.ok) {
              alert(`File ${fileName} deleted successfully.`);
              // Refresh the file list
              document.getElementById('listButton').click();
            } else {
              alert(`Failed to delete file ${fileName}.`);
            }
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        });
      });
    } else {
      document.getElementById('fileList').innerHTML = 'Failed to retrieve the list of files.';
    }
  } catch (error) {
    console.error('Error fetching file list:', error);
  }
});
