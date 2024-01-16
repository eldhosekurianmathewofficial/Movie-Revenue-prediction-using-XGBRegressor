function predictRevenue(event) {
    console.log("Predict Revenue button clicked.");
    event.preventDefault();
   
    document.getElementById('prediction-result').innerHTML = "";

    const formElement = document.getElementById('movie-form');
    const formData = new FormData(formElement);

    const actorPopularity = document.getElementById('actorPopularity').innerText;
    const actressPopularity = document.getElementById('actressPopularity').innerText;
    const directorPopularity = document.getElementById('directorPopularity').innerText;

    formData.append('actorPopularity', actorPopularity);
    formData.append('actressPopularity', actressPopularity);
    formData.append('directorPopularity', directorPopularity);

    const originalLanguageSelect = formElement.querySelector('#original_language');
    const originalLanguageValue = parseInt(originalLanguageSelect.options[originalLanguageSelect.selectedIndex].value);
    formData.append('original_language', originalLanguageValue);

    const genreSelect = formElement.querySelector('#genre');
    const genreValue = parseInt(genreSelect.options[genreSelect.selectedIndex].value);
    formData.append('genre', genreValue);

    const releaseDate = formElement.querySelector('#release_date').value;
    const [releaseYear, releaseMonth, releaseDay] = releaseDate.split('-');
    formData.append('release_year', parseInt(releaseYear));
    formData.append('release_month', parseInt(releaseMonth));
    formData.append('release_day', parseInt(releaseDay));
    console.log("Form data:", formData);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('prediction-result').innerHTML = data.result;
    })
    .catch(error => console.error('Error:', error));
}


function fetchActressPopularity() {
    
    const selectedActress = document.getElementById("actress").value;
    const tmdbApiKey = "775ffc67f20ef642f55ceb576824b014";  
    const tmdbApiUrl = `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&query=${selectedActress}`;

    fetch(tmdbApiUrl)
        .then(response => response.json())
        .then(data => {
            // Display actress popularity
            const actressPopularity = data.results[0].popularity;
            document.getElementById("actressPopularity").innerHTML = `Popularity: ${actressPopularity}`;

            // Display actress image
            const actressImage = data.results[0].profile_path;
            if (actressImage) {
                const imageUrl = `https://image.tmdb.org/t/p/w200${actressImage}`;
                document.getElementById("actressImage").innerHTML = `<img src="${imageUrl}" alt="${selectedActress}">`;
            } else {
                document.getElementById("actressImage").innerHTML = "Image not available";
            }

            // Fetch top 2 movies of the actress based on rating
            const actressId = data.results[0].id;
            const moviesUrl = `https://api.themoviedb.org/3/person/${actressId}/movie_credits?api_key=${tmdbApiKey}`;

            fetch(moviesUrl)
                .then(response => response.json())
                .then(movieData => {
                    
                    const sortedMovies = movieData.cast.sort((a, b) => b.vote_average - a.vote_average);
                    const top2Movies = sortedMovies.slice(0, 2);

                    const moviesList = top2Movies.map(movie => `<p>${movie.title} (${movie.vote_average})</p>`).join('');
                    document.getElementById("actressMovies").innerHTML = `<p>Top 2 Movies (Based on Rating):</p><ul>${moviesList}</ul>`;
                })
                .catch(error => console.error("Error fetching actress movies:", error));
        })
        .catch(error => console.error("Error fetching actress details:", error));
}


function fetchActorPopularity() {
    
    const selectedActor = document.getElementById("actor").value;
    const tmdbApiKey = "775ffc67f20ef642f55ceb576824b014"; 
    const tmdbApiUrl = `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&query=${selectedActor}`;

    fetch(tmdbApiUrl)
        .then(response => response.json())
        .then(data => {
            // Display actor popularity
            const actorPopularity = data.results[0].popularity;
            document.getElementById("actorPopularity").innerHTML = `Popularity: ${actorPopularity}`;

            // Display actor image
            const actorImage = data.results[0].profile_path;
            if (actorImage) {
                const imageUrl = `https://image.tmdb.org/t/p/w200${actorImage}`;
                document.getElementById("actorImage").innerHTML = `<img src="${imageUrl}" alt="${selectedActor}">`;
            } else {
                document.getElementById("actorImage").innerHTML = "Image not available";
            }

            // Fetch top 2 movies of the actor based on rating
            const actorId = data.results[0].id;
            const moviesUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${tmdbApiKey}`;

            fetch(moviesUrl)
                .then(response => response.json())
                .then(movieData => {

                    const sortedMovies = movieData.cast.sort((a, b) => b.vote_average - a.vote_average);

                    const top2Movies = sortedMovies.slice(0, 2);
                    const moviesList = top2Movies.map(movie => `<p>${movie.title} (${movie.vote_average})</p>`).join('');
                    document.getElementById("actorMovies").innerHTML = `<p>Top 2 Movies (Based on Rating):</p><ul>${moviesList}</ul>`;
                })
                .catch(error => console.error("Error fetching actor movies:", error));
        })
        .catch(error => console.error("Error fetching actor details:", error));
}
function fetchDirectorPopularity() {
    const directorName = document.getElementById('director').value;

    
    const tmdbApiKey = "775ffc67f20ef642f55ceb576824b014";  
    const tmdbApiUrl = `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&query=${directorName}`;

    fetch(tmdbApiUrl)
        .then(response => response.json())
        .then(data => {
            // Display director popularity
            const directorPopularity = data.results[0].popularity;
            document.getElementById('directorPopularity').innerText = `Popularity: ${directorPopularity}`;

            // Display director image
            const directorImage = data.results[0].profile_path;
            if (directorImage) {
                const imageUrl = `https://image.tmdb.org/t/p/w200${directorImage}`;
                document.getElementById('directorImage').innerHTML = `<img src="${imageUrl}" alt="${directorName}" width="100" height="150">`
            } else {
                document.getElementById('directorPopularity').innerHTML += "<br>Image not available";
            }
            
            const directorId = data.results[0].id;
            const moviesUrl = `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${tmdbApiKey}`;

            fetch(moviesUrl)
                .then(response => response.json())
                .then(movieData => {
  
                    const sortedMovies = movieData.cast.sort((a, b) => b.vote_average - a.vote_average);

                    const top2Movies = sortedMovies.slice(0, 2);

                    const moviesList = top2Movies.map(movie => `<p>${movie.title} (${movie.vote_average})</p>`).join('');
                    document.getElementById("directorMovies").innerHTML = `<p>Top 2 Movies (Based on Rating):</p><ul>${moviesList}</ul>`;
                })
                .catch(error => console.error("Error fetching actor movies:", error));
        })
        .catch(error => console.error("Error fetching actor details:", error));
}
let budgetAlertShown = false;

function validateBudget() {
    const budgetInput = document.getElementById('budget');
    const budgetValue = parseFloat(budgetInput.value);
    let budgetNoteShown = false;

    if (!budgetAlertShown && (!budgetValue || budgetValue < 1800636.00)) {
        alert('Film making is a very organised industry and require personnel of various field such as photography,editing,VFX,stunting etc. Hence, A good movie requires a budget of at least 18,00,636.00 USD (15 crore)');
        budgetAlertShown = true; 
    
        budgetInput.focus();
    } else {
        budgetAlertShown = false; 
    }
}
    let popularityNoteShown = false;

function validatePopularity() {
    const popularityInput = document.getElementById('popularity');
    const popularityValue = parseFloat(popularityInput.value);

    if (!popularityNoteShown && (!popularityValue || popularityValue < 14.598 || popularityValue> 2718.643)) {
        alert('Film popularity is an important subject for film historians and film theorists because of what it tells them about the tastes and preferences of film audiences and the strategies developed by producers to direct and satisfy them.According to my Datset, the Minimum value is 14.598 and Maximum value is 2718.643 !. So please adjust your value');
        popularityNoteShown = true; 
        popularityInput.focus();
    } else {
        popularityNoteShown = false; 
    }
}
let runtimeNoteShown = false;

function validateRuntime() {
    const runtimeInput = document.getElementById('runtime');
    const runtimeValue = parseFloat(runtimeInput.value);

    if (!runtimeNoteShown && (!runtimeValue || runtimeValue < 60 || runtimeValue > 300)) {
        alert('Note:Runtime is the time between the starting of the movie upto the end of the credits scene. A movie usually have minimum 60 minutes of watchtime and can last upto 5 hrs max(300m).Please adjust Accordingly');
        runtimeNoteShown = true;
        runtimeInput.focus();
    } else {
        runtimeNoteShown = false;
    }
}

let voteAverageNoteShown = false;

function validateVoteAverage() {
    const voteAverageInput = document.getElementById('vote_average');
    const voteAverageValue = parseFloat(voteAverageInput.value);

    if (!voteAverageNoteShown && (!voteAverageValue || voteAverageValue <0 || voteAverageValue >10)) {
        alert('The "vote average" in movies refers to the average rating given by viewers or critics to a particular movie.The vote average should be between  0 and 10');
        voteAverageNoteShown = true; 
        voteAverageInput.focus();
    } else {
        voteAverageNoteShown = false; 
    }
}

let voteCountNoteShown = false;

function validateVoteCount() {
    const voteCountInput = document.getElementById('vote_count');
    const voteCountValue = parseFloat(voteCountInput.value);

    if (!voteCountNoteShown && (!voteCountValue || voteCountValue < 1)) {
        alert('"Vote count" refers to the total number of votes or ratings that a movie has received from viewers or users The vote count should be minimum 1 and can range upto any value ');
        voteCountNoteShown = true; 
        voteCountInput.focus();
    } else {
        voteCountNoteShown = false; 
    }
}
