$(document).ready(function (){
    const apiKey = 'eba8b9a7199efdcb0ca1f96879b83c44';
    const baseUrl = 'https://api.themoviedb.org/3';
    const imagePath = 'https://image.tmdb.org/t/p/w500';

    function fetchMovies(category){
        let url;

        if (category === 'trending'){
            url = `${baseUrl}/trending/movie/day?api_key=${apiKey}`;
        } else{
            url = `${baseUrl}/movie/${category}?api_key=${apiKey}&language=en-US&page=1`;
        }
        $.ajax({
            url: url,
            method: 'GET',
            success: function (data){
                displayMovies(data.results);
            },
            error: function (error){
                console.error('Error fetching movies:', error);
            }
        });
    }

    function searchMovies(query){
        const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&language=en-US&page=1&query=${query}`;

        $.ajax({
            url: searchUrl,
            method: 'GET',
            success: function (data) {
                displayMovies(data.results);
            },
            error: function (error) {
                console.error('Error fetching movies:', error);
            }
        });
    }

    function displayMovies(movies){
        const container = $('#moviesContainer');
        container.empty();

        movies.forEach(function (movie){
            const rating = parseFloat(movie.vote_average).toFixed(1);

            const movieElement = $(`
                <div class="movie" style="display: none;">
                    <div class="movie-overlay">
                        <h3>${movie.title}</h3>                  
                        <p class="overview">${movie.overview}</p>
                        <p>Release Date: ${movie.release_date}</p>
                        <div class="rating-circle">
                            <div class="star-icons">${getStarIcons(rating)}</div>
                        </div>
                        <div class="rating-number">${rating}</div>
                    </div>
                    <img class="movie-poster" src="${imagePath}${movie.poster_path}" alt="${movie.title}">
                </div>
            `);

            container.append(movieElement);

            movieElement.fadeIn(800);

            movieElement.on('click', function (){
                const overlay = $(this).find('.movie-overlay');

                if (overlay.is(':visible')) {
                    overlay.animate({ width: 'hide', paddingLeft: 'hide', paddingRight: 'hide' }, 500);
                    overlay.fadeOut(500);
                } else {
                    overlay.css({ width: 'auto', paddingLeft: '10px', paddingRight: '10px' });
                    overlay.fadeIn(500);
                }
            });

            movieElement.css('border', '1px solid #ccc');
            movieElement.css('margin', '10px');
            movieElement.css('padding', '10px');
        });
    }

    function getStarIcons(rating){
        const fullStars = Math.floor(rating / 2);
        return '★'.repeat(fullStars);
    }

    $('#navbarToggle').on('click', function (){
        const navbarNav = $('#navbarNav');

        navbarNav.animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 500);

        navbarNav.toggleClass('active');
    });

    $('#searchInput').on('input', function (){
        const searchQuery = $(this).val();

        if (searchQuery.trim() !== ''){
            searchMovies(searchQuery);
        } else {
            fetchMovies('top_rated');
        }
    });

    $('#nowPlaying').on('click', function (){
        fetchMovies('now_playing');
    });

    $('#popular').on('click', function (){
        fetchMovies('popular');
    });

    $('#topRated').on('click', function (){
        fetchMovies('top_rated');
    });

    $('#trending').on('click', function (){
        fetchMovies('trending');
    });

    $('#upcoming').on('click', function (){
        fetchMovies('upcoming');
    });


    fetchMovies('top_rated');
});
