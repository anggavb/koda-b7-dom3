// import axios from "axios";

// const TMDB_API_KEY = 'ce56d5168166bd06bebbe91ca3947d95';
const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTU2ZDUxNjgxNjZiZDA2YmViYmU5MWNhMzk0N2Q5NSIsIm5iZiI6MTc3NDAyMDI5OC43MjMsInN1YiI6IjY5YmQ2NmNhMzZiMzczOThhNjhjMjA2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qZHzUibYrQURc_FyQxXTiahhPKZwpE63bK3ULcNR0dU';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const instance = axios.create({

    baseURL: TMDB_API_BASE_URL,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${TMDB_API_KEY}`
    }
})

const loginButton = document.getElementById('login-button');
const userProfile = document.getElementById('user-profile');
const breadcrumbMenu = document.getElementById('breadcrumb-menu');

const fetchMovieDetails = async (id) => {
    try {
        const { data } = await instance.get(`/movie/${id}?language=en-US&append_to_response=credits`);
        console.log(data);
        
        updateBreadcrumb(data);
        renderMovieDetails(data);
    } catch (e) {
        console.error("Failed to load movie details", e);
    }
};

const renderMovieDetails = (movie) => {
    const container = document.querySelector('.watchlist-container');
    container.innerHTML = `
        <div class="movie-card flex flex-col md:flex-row gap-8 items-start group">
            <div class="w-full md:w-48 shrink-0">
                <div class="w-full aspect-2/3 bg-vintage rounded-lg flex items-center justify-center text-main font-bold relative overflow-hidden shadow-lg shadow-black/50">
                      <img src="${TMDB_IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title} Poster" class="w-full h-full object-cover">
                </div>
            </div>
            
            <div class="flex grow flex-col pt-2 max-w-2xl">
                <div class="mb-3">
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${movie.genres?.map(genre => `<span class="border border-vintage text-vintage px-3 py-1 rounded-full text-sm">${genre.name}</span>`).join('') || 'No genres available.'}
                    </div>
                    <h2 class="text-3xl font-semibold font-heading text-ivory mb-2">${movie.title}</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-ivory text-2xl font-medium">${movie.vote_average?.toFixed(1) || 'N/A'} <span class="text-yellow-500">★</span></span>
                        <span class="bg-yellow-500 text-black text-xl font-bold px-1.5 py-0.5 rounded shadow">IMDb</span>
                    </div>
                </div>
                
                <p class="text-vintage text-sm leading-relaxed mb-2 opacity-80">
                    ${movie.overview || 'No description available.'}
                </p>

                <p class="text-vintage text-md font-medium leading-relaxed mb-2">Director: ${movie.credits.crew.filter(v => v.job === "Director").map(v => v.name).join(', ')}</p>

                <p class="text-vintage text-md font-medium leading-relaxed mb-6">Cast: ${movie.credits.cast.map(v => v.name).join(', ')}</p>
                
                <div class="flex gap-4">
                    <button class="bg-transparent border border-ivory text-ivory px-6 py-2 rounded-full font-bold text-sm tracking-wide hover:bg-ivory hover:text-main uppercase">Add To Watchlists</button>
                </div>
            </div>
        </div>
    `;
};

const updateBreadcrumb = (movie) => {
    breadcrumbMenu.innerHTML = `
        <a href="films.html" class="text-ivory hover:text-accent">All Films</a>
          <span class="text-ivory">/</span>
        <h6 class="text-ivory">${movie.title}</h6>
    `;
};

// Initialize
const loggedInUser = localStorage.getItem('loggedInUser');
if (loggedInUser) {
    loginButton.classList.add('hidden');
    userProfile.classList.remove('hidden');
    userProfile.textContent = loggedInUser === 'admin@moviespace.com' ? 'AD' : loggedInUser.charAt(0).toUpperCase();
} else {
    loginButton.classList.remove('hidden');
    userProfile.classList.add('hidden');
}

fetchMovieDetails(1523145);
