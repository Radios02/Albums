const start = () => {
    fetch('http://localhost:3000/albums')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching album data');
            }
            return response.json();
        })
        .then(data => {
            const formattedData = formatData(data);
            populateTable(formattedData);
        })
        .catch(error => console.error('Error fetching album data:', error));
};

function formatData(data) {
    return data.map(item => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        releaseDate: item.releaseDate
    }));
}

function populateTable(data) {
    const tableBody = document.getElementById('albumTableBody');
    tableBody.innerHTML = '';

    data.forEach(album => {
        const row = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = album.title;
        row.appendChild(titleCell);

        const artistCell = document.createElement('td');
        artistCell.textContent = album.artist;
        row.appendChild(artistCell);

        const releaseDateCell = document.createElement('td');
        releaseDateCell.textContent = album.releaseDate;
        row.appendChild(releaseDateCell);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editAlbum(album.id));
        row.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteAlbum(album.id));
        row.appendChild(deleteButton);

        tableBody.appendChild(row);
    });
}

function addAlbum(title, artist, releaseDate) {
    fetch('http://localhost:3000/albums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, artist, releaseDate })
    })
    .then(response => response.json())
    .then(() => start())
    .catch(error => console.error('Error adding album:', error));
}

function editAlbum(id) {
    const newTitle = prompt('Enter new album title:');
    const newArtist = prompt('Enter new artist name:');
    const newReleaseDate = prompt('Enter new release date:');

    fetch(`http://localhost:3000/albums/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle, artist: newArtist, releaseDate: newReleaseDate })
    })
    .then(response => response.json())
    .then(() => start())
    .catch(error => console.error('Error editing album:', error));
}

function deleteAlbum(id) {
    fetch(`http://localhost:3000/albums/${id}`, {
        method: 'DELETE'
    })
    .then(() => start())
    .catch(error => console.error('Error deleting album:', error));
}

document.getElementById('search-bar').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('#album-table-body tr');

    tableRows.forEach(row => {
        const title = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const artist = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const albumTableBody = document.getElementById('album-table-body');
    const addAlbumForm = document.getElementById('add-album-form');

    // Albumok betöltése az API-ból
    const loadAlbums = () => {
        fetch('/albums')
            .then((response) => response.json())
            .then((albums) => {
                albumTableBody.innerHTML = ''; // Táblázat törlése
                albums.forEach((album) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${album.title}</td>
                        <td>${album.artist}</td>
                        <td>${album.releaseDate}</td>
                        <td class="actions">
                            <button onclick="editAlbum(${album.id})">Edit</button>
                            <button onclick="deleteAlbum(${album.id})">Delete</button>
                        </td>
                    `;
                    albumTableBody.appendChild(row);
                });
            })
            .catch((error) => console.error('Error loading albums:', error));
    };

    // Új album hozzáadása
    addAlbumForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const releaseDate = document.getElementById('releaseDate').value;
    
        fetch('/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, artist, releaseDate }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to add album');
                }
                return response.json();
            })
            .then(() => {
                addAlbumForm.reset();
                loadAlbums();
            })
            .catch((error) => console.error('Error adding album:', error));
    });

    // Album törlése
    window.deleteAlbum = (id) => {
        fetch(`/albums/${id}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete album');
                }
                loadAlbums();
            })
            .catch((error) => console.error('Error deleting album:', error));
    };

    // Album szerkesztése
    window.editAlbum = (id) => {
        const title = prompt('Enter new title:');
        const artist = prompt('Enter new artist:');
        const releaseDate = prompt('Enter new releaseDate:');
        if (title && artist && releaseDate){
            fetch(`/albums/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, artist, releaseDate }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to edit album');
                    }
                    loadAlbums();
                })
                .catch((error) => console.error('Error editing album:', error));
        }
    };

    // Albumok betöltése az oldal betöltésekor
    loadAlbums();
});