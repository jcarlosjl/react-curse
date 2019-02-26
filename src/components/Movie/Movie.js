import React, {Component} from 'react';
import { API_KEY, API_URL } from '../../config';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Spinner from '../elements/Spinner/Spinner';
import './Movie.css';

class Movie extends Component {
    state = {  }
    render() {
        return (
            <div>
                <FourColGrid></FourColGrid>
                <Spinner />
            </div>
        );
    }
}

export default Movie;