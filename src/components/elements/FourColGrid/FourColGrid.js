import React from 'react';
import './FourColGrid.css';
import PropTypes from 'prop-types';

const FourColGrid = (props) => {
    const renderElements = () => {
        const gridElements = props.children.map((element, i) => {
            return (
                <div key={i} className="rmdb-grid-element">
                    {element}
                </div>
            );
        });

        return gridElements;
    };

    return (
        <div className="rmdb-grid">
            {props.header && !props.loading ? <h1>{props.header}</h1> : null}
            <div className="rmdb-grid-content">
                {renderElements()}
            </div>
        </div>
    )
}

FourColGrid.prototypes = {
    header: PropTypes.string,
    loading: PropTypes.bool.isRequired,
}

export default FourColGrid;