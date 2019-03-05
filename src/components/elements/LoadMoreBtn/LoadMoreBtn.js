import React from 'react';
import './LoadMoreBtn.css';
import PropTypes from 'prop-types';

const LoadMoreBtn = ({text, onClick}) => {
    return(
        <div className="rmdb-loadmorebtn" onClick={() => onClick(true)}>
            <p>{text}</p>
        </div>
    )
};

LoadMoreBtn.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default LoadMoreBtn;