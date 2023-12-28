import React, { useRef, useState } from 'react';
import classes from './AddMovie.module.css';

function AddMovie(props) {
  const titleRef = useRef('');
  const openingTextRef = useRef('');
  const releaseDateRef = useRef('');

  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [error, setError] = useState(null);

  function submitHandler(event) {
    event.preventDefault();

    const title = titleRef.current.value.trim();
    const openingText = openingTextRef.current.value.trim();
    const releaseDate = releaseDateRef.current.value.trim();

    if (!title || !openingText || !releaseDate) {
      setError('Fill up the boxes with relevant details');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    const movie = {
      title,
      openingText,
      releaseDate,
    };

    props.onAddMovie(movie);

    titleRef.current.value = '';
    openingTextRef.current.value = '';
    releaseDateRef.current.value = '';

    setIsFormExpanded(false);
  }

  return (
    <div>
      <button onClick={() => setIsFormExpanded(!isFormExpanded)}>
        {isFormExpanded ? 'Collapse Form' : 'Add Movie'}
      </button>
      {isFormExpanded && (
        <form onSubmit={submitHandler}>
          <div className={`${classes.control} ${error ? classes.error : ''}`}>
            <label htmlFor='title'>Title</label>
            <input type='text' id='title' ref={titleRef} />
          </div>
          <div className={`${classes.control} ${error ? classes.error : ''}`}>
            <label htmlFor='opening-text'>Opening Text</label>
            <textarea rows='5' id='opening-text' ref={openingTextRef}></textarea>
          </div>
          <div className={`${classes.control} ${error ? classes.error : ''}`}>
            <label htmlFor='date'>Release Date</label>
            <input type='text' id='date' ref={releaseDateRef} />
          </div>
          {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
          <button type="submit">Add Movie</button>
        </form>
      )};
    </div>
  );
}
export default AddMovie;