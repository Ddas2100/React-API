import React, { useState, useEffect, useCallback } from 'react';
import loading from './assets/loading.gif';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-70c9a-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = useCallback(async(movie) => {
    // console.log(movie);
    // setMovies((prevMovies) => [...prevMovies, movie]);
    try {
      const response= await fetch('https://react-http-70c9a-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type' : 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data= await response.json();
      console.log(data);
      fetchMoviesHandler();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [fetchMoviesHandler]);

  const deleteMovieHandler = useCallback(async (movieId) => {
    try {
      const response = await fetch(`https://react-http-70c9a-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      await fetchMoviesHandler(); 
    } catch (error) {
      setError(error.message);
    }
  }, [fetchMoviesHandler]);

  let content = <p>No Movies Found</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <img src={loading} alt="loading gif" />;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
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
