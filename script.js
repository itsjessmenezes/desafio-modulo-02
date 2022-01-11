const bodyHtml = document.querySelector('body');
const input = document.querySelector('.input');
const themeInput = document.querySelector('.theme-input');
const subtitle = document.querySelector('.subtitle');

const moviesContainer = document.querySelector('.movies-container');
const movies = document.querySelector('.movies');
const btnTheme = document.querySelector('.btn-theme');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

const movieImg = document.createElement('img');

const highlightInfo = document.querySelector('.highlight__info');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenreLaunch = document.querySelector('.highlight__genre-launch');
const highlightGenre = document.querySelectorAll('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');

const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');


let paginas = 1;
let movieData = [];
let genresDark = [];
let launchDark = [];

const createMovies = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')
  .then(res => res.json()).then(resBody => {
    movieData = resBody.results;
    createMovieCard()
  });


const highlightVideoLink = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')
  .then(res => res.json()).then(resBody => {

    const highlightVideoLink = document.querySelector('.highlight__video-link');

    highlightVideoLink.href = `https://www.youtube.com/watch?v=${resBody.results[0].key}`;
  });

const highlightInfos = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')
  .then(res => {
    const promiseRes = res.json();


    promiseRes.then(resBody => {

      highlightVideo.style.backgroundImage = 'url(' + resBody.backdrop_path + ')';
      highlightTitle.textContent = resBody.title;
      highlightRating.textContent = resBody.vote_average;

      const genresLength = resBody.genres.length;
      resBody.genres.forEach((genre, index) => {
        const highlightGenres = document.createElement('span');
        highlightGenres.classList = 'highlight__genres';
        if (index + 1 === genresLength) {
          highlightGenres.textContent = genre.name + ' / ';
        } else {
          highlightGenres.textContent = genre.name + ', ';
        }
        genresDark.push(highlightGenres);
        highlightGenreLaunch.append(highlightGenres);

      });

      const highlightLaunch = document.createElement('div');

      const data = resBody.release_date.split('-').reverse();
      let mes = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
      let mesFormatado;

      mes.find((mes, idx) => {
        if (data[1].replace('0', '') == idx + 1) {
          mesFormatado = mes;
        }
      });

      highlightLaunch.classList = 'highlight__launch';
      highlightLaunch.textContent = ` ${data[0]} DE ${mesFormatado} DE ${data[2]}`;
      highlightGenreLaunch.append(highlightLaunch);

      launchDark.push(highlightLaunch)

      highlightDescription.textContent = resBody.overview;

    });

  });


function createMovieCard() {
  const itensMovie = document.querySelectorAll('.movie');

  for (let item of itensMovie) {
    item.remove();
  }
  movieData.forEach((item) => {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal__close');

    const movie = document.createElement('div');
    const movieInfo = document.createElement('div');
    const movieTitle = document.createElement('span');
    const rating = document.createElement('div');
    const star = document.createElement('img');
    const movieRating = document.createElement('span');

    movie.style.backgroundImage = 'url(' + item.poster_path + ')';
    movie.classList = 'movie';

    movieInfo.classList = 'movie__info';

    movieTitle.classList = 'movie__title';
    if (item.title.length > 9) {
      const titulo = item.title;

      movieTitle.textContent = titulo.slice(0, 9) + '...';
    } else {
      movieTitle.textContent = item.title;
    }

    rating.classList = 'rating';

    star.src = "./assets/estrela.svg";

    movieRating.textContent = item.vote_average;
    movieRating.classList = 'movie__rating';


    rating.append(star, movieRating);
    movieInfo.append(movieTitle, rating);
    movie.append(movieInfo);
    movies.append(movie);



    function movieModal() {
      const modalInfo = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${item.id}?language=pt-BR`)
        .then(res => {
          const promise = res.json();

          promise.then(movieId => {

            modalTitle.textContent = `${movieId.title}`;
            modalImg.src = `${movieId.backdrop_path}`;
            modalDescription.textContent = `${movieId.overview}`;
            modalAverage.textContent = movieId.vote_average;

            movieId.genres.forEach(genre => {
              const modalGenre = document.createElement('span');
              modalGenre.classList = 'modal__genre';
              modalGenre.textContent = genre.name;

              modalGenres.append(modalGenre);
            });
          });
        });
      modal.classList.remove('hidden');
      const movieGenres = document.querySelectorAll('.modal__genre');

      for (let genre of movieGenres) {
        genre.remove();
      }
    }

    function closeModal() {
      const modalGenre = document.querySelector('.modal__genres')
      modal.classList.add('hidden');
      modalGenre.value = '';
    }

    function stopProp(event) {
      event.stopPropagation();
    }

    movie.addEventListener('click', movieModal);
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', closeModal);
    modalImg.addEventListener('click', stopProp);
    modalDescription.addEventListener('click', stopProp);
    modalGenres.addEventListener('click', stopProp);
    modalAverage.addEventListener('click', stopProp);
  });
}

function btnPesquisar(e) {
  if (e.key === 'Enter') {
    paginas = 1;
    movies.scrollBy(-3840, 0);
    if (input.value !== '') {

      fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`)
        .then(res => {
          const promise = res.json();

          promise.then(resBody => {
            movieData = resBody.results;
            createMovieCard();

            input.value = '';
          });
        });

    } else {
      return;
    }
  } else {
    return;
  }
}


function btnPrevHandler() {
  if (paginas === 1) {
    paginas = 4;
    movies.scrollBy(2880, 0);
  } else {
    movies.scrollBy(-960, 0);
    paginas--;
  }
}

function btnNextHandler() {
  if (paginas === 4) {
    paginas = 1;
    movies.scrollBy(-3840, 0);
  } else {
    movies.scrollBy(960, 0);
    paginas++;
  }
}


function btnThemeHandler() {
  bodyHtml.classList.toggle('theme-background');
  input.classList.toggle('theme-background');
  highlightInfo.classList.toggle('theme-highlight');
  highlightDescription.classList.toggle('theme-color');
  subtitle.classList.toggle('theme-color');

  for (let genre of genresDark) {
    genre.classList.toggle('theme-color');
  }

  for (let launch of launchDark) {
    launch.classList.toggle('theme-color');
  }

  if (bodyHtml.classList.value === 'theme-background') {
    themeInput.style.color = 'white';
  } else {
    themeInput.style.color = 'black';
  }

  if (btnTheme.src === './assets/light-mode.svg') {
    btnTheme.src = './assets/dark-mode.svg';
  } else {
    btnTheme.src = './assets/light-mode.svg';
  }

  if (btnPrev.src.slice(22) === 'assets/seta-esquerda-preta.svg') {
    btnPrev.src = './assets/seta-esquerda-branca.svg'
    btnNext.src = './assets/seta-direita-branca.svg'
  } else {
    btnPrev.src = './assets/seta-esquerda-preta.svg'
    btnNext.src = './assets/seta-direita-preta.svg'
  }


}

btnPrev.addEventListener('click', btnPrevHandler);
btnNext.addEventListener('click', btnNextHandler);
btnTheme.addEventListener('click', btnThemeHandler);
input.addEventListener('keydown', btnPesquisar);