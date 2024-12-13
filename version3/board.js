document.addEventListener('DOMContentLoaded', function () {
    // Formular zum Hochladen eines Projekts
    const uploadForm = document.getElementById('upload-project-form');
    const board = document.getElementById('board');

    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Hole die Formulardaten
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const imageFile = document.getElementById('project-image').files[0];

        // Überprüfe, ob ein Bild ausgewählt wurde
        if (imageFile) {
            const reader = new FileReader();

            // Wenn das Bild geladen ist, füge es dem Board hinzu
            reader.onload = function (e) {
                // Erstelle ein neues Projekt
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project');
                projectDiv.innerHTML = `
                    <h1>${title}</h1>
                    <div class="postit">
                        <p>${description}</p>
                    </div>
                    <img class="project_images" src="${e.target.result}" alt="${title}">
                `;

                // Positioniere das Projekt zufällig im Grid
                projectDiv.style.gridColumn = Math.floor(Math.random() * 10) + 1;
                projectDiv.style.gridRow = Math.floor(Math.random() * 10) + 1;

                // Füge das Projekt zum Board hinzu
                board.appendChild(projectDiv);

                // Form zurücksetzen
                uploadForm.reset();
            };

            // Lese das Bild als Data URL
            reader.readAsDataURL(imageFile);
        }
    });
});
