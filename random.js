const loadRandomMoment = async () => {
    try {
        const response = await fetch('data/moments.json');
        const data = await response.json();
        const moments = data.moments;

        if (moments.length > 0) {
            const randomMoment = moments[Math.floor(Math.random() * moments.length)];
            displayMoment(randomMoment);
        }
    } catch (error) {
        console.error("Error loading moments:", error);
    }
};

const displayMoment = (moment) => {
    const container = document.getElementById('random-moment');
    container.innerHTML = `
        <img src="${moment.url}" alt="Moment">
        <p>${moment.caption}</p>
    `;
};

document.addEventListener('DOMContentLoaded', loadRandomMoment);