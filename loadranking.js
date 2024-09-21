const loadRankingFromJSON = async () => {
    try {
        const response = await fetch('ranking.json');
        const data = await response.json();

        const rankingContainer = document.getElementById('ranking-container');
        rankingContainer.innerHTML = '';  // Καθαρίστε το περιεχόμενο αν υπάρχει

        // Δημιουργία του πίνακα
        const table = document.createElement('table');
        table.style.width = '100%'; // Κάνει τον πίνακα να εκτείνεται σε όλο το πλάτος του container
        table.style.borderCollapse = 'collapse'; // Για να έχει πιο ωραία εμφάνιση

        // Δημιουργία επικεφαλίδων
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Θέση', 'Ομάδα', 'Βαθμοί'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.border = '1px solid #ddd'; // Στυλ για τις επικεφαλίδες
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Δημιουργία του σώματος του πίνακα
        const tbody = document.createElement('tbody');
        data.ranking.forEach(team => {
            const row = document.createElement('tr');
            const positionCell = document.createElement('td');
            positionCell.textContent = team.position;
            positionCell.style.border = '1px solid #ddd'; // Στυλ για τα κελιά
            positionCell.style.padding = '8px';
            const nameCell = document.createElement('td');
            nameCell.textContent = team.name;
            nameCell.style.border = '1px solid #ddd';
            nameCell.style.padding = '8px';
            const pointsCell = document.createElement('td');
            pointsCell.textContent = team.points;
            pointsCell.style.border = '1px solid #ddd';
            pointsCell.style.padding = '8px';
            row.appendChild(positionCell);
            row.appendChild(nameCell);
            row.appendChild(pointsCell);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Εισαγωγή του πίνακα στον container
        rankingContainer.appendChild(table);

    } catch (error) {
        console.error('Error loading ranking data:', error);
    }
};

document.addEventListener('DOMContentLoaded', loadRankingFromJSON);
