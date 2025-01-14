// Función para obtener la lista de notebooks desde la API
function fetchNotebooksList() {
    fetch('/documentos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const notebooksList = document.getElementById('notebooks-list');
            if (!notebooksList) {
                console.error('No se encontró el elemento con ID "notebooks-list" en el HTML.');
                return;
            }
            
            notebooksList.innerHTML = ''; // Limpiar la lista antes de agregar los ítems

            if (data.length === 0) {
                notebooksList.innerHTML = '<li>No se encontraron archivos .ipynb</li>';
                return;
            }

            // Agregar cada archivo a la lista como un enlace
            data.forEach(notebook => {
                const li = document.createElement('li');
                li.textContent = notebook;
                li.style.cursor = 'pointer'; // Cambiar el cursor para indicar que es clicable
                li.onclick = () => fetchNotebookContent(notebook); // Abrir el contenido al hacer clic
                notebooksList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de notebooks:', error);
        });
}
