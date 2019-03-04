import React from 'react'
import './MovieThumb.css'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MovieThumb = ({image, movieName, movieId, clickable}) => {
    return (
        <div className="rmdb-moviethumb">
            {clickable ?
            <Link to={{ pathname: `/${movieId}`, movieName: `${movieName}` }}>
                <img src={image} alt="movie thumb"/>
            </Link>
            :
            <img src={image} alt="movie thumb"/>
            }
        </div>
    )
};

MovieThumb.propTypes = {
    image: PropTypes.string,
    movieName: PropTypes.string,
    movieId: PropTypes.number,
};

export default MovieThumb;
