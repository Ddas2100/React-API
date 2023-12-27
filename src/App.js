import React, { useState, useEffect, useCallback } from 'react';
import loading from './assets/loading.gif';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if(!response.ok) {
        throw new Error('Something Went Wrong!');
      }

      const data= await response.json();
      
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>No Movies Found</p>;

  if(movies.length > 0) {
    content= <MoviesList movies={movies} />;
  }
  if(error) {
    content= <p>{error}</p>;
  }
  if(isLoading) {
    content= <img src= {loading} alt='loading gif' />;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section> {content} </section>
    </React.Fragment>
  );
}

export default App;


//Change the error from 'Something went Wrong' to 'Something went wrong ....Retrying'
//Whenever the api fails, retry calling the api again and again after intervals of 5 seconds , 
//uptill the time it passes. Put a cancel button to cancel retrying when the user wants to stop retrying.

// import React, { useState, useEffect } from 'react';
// import loading from './assets/loading.gif';
// import MoviesList from './components/MoviesList';
// import './App.css';

// function App() {
//   const [movies, setMovies] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [retrying, setRetrying] = useState(false);

//   useEffect(() => {
//     if (retrying) {
//       const intervalId = setInterval(() => {
//         fetchMovies();
//       }, 5000);

//       return () => {
//         clearInterval(intervalId);
//       };
//     }
//   }, [retrying]);

//   const fetchMovies = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('https://swapi.dev/api/film/');
//       if (!response.ok) {
//         throw new Error('Something went wrong....Retrying');
//       }

//       const data = await response.json();

//       const transformedMovies = data.results.map((movieData) => {
//         return {
//           id: movieData.episode_id,
//           title: movieData.title,
//           openingText: movieData.opening_crawl,
//           releaseDate: movieData.release_date,
//         };
//       });
//       setMovies(transformedMovies);
//       setRetrying(false);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFetchMoviesClick = () => {
//     setRetrying(true);
//     fetchMovies();
//   };

//   const handleCancelRetryClick = () => {
//     setRetrying(false);
//   };

//   let content = <p>No Movies Found</p>;

//   if (movies.length > 0) {
//     content = <MoviesList movies={movies} />;
//   }
//   if (error) {
//     content = (
//       <div>
//         <p>{error}</p>
//         {retrying && <button onClick={handleCancelRetryClick}>Cancel Retry</button>}
//       </div>
//     );
//   }
//   if (isLoading) {
//     content = <img src={loading} alt="loading gif" />;
//   }

//   return (
//     <React.Fragment>
//       <section>
//         <button onClick={handleFetchMoviesClick} disabled={retrying}>
//           Fetch Movies
//         </button>
//       </section>
//       <section>{content}</section>
//     </React.Fragment>
//   );
// }

// export default App;
