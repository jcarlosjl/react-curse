import React, {Component} from 'react';
import { API_KEY, API_URL } from '../../config';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Spinner from '../elements/Spinner/Spinner';
import './Movie.css';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import Actor from '../elements/Actor/Actor';

class Movie extends Component {
    state = { 
        movie: null,
        actors: null,
        directors: [],
        loading: false,
    }

    componentDidMount() {
        this.setState({loading: true});
        const movieState = localStorage.getItem(`${this.props.match.params.movieId}`);
        
        if (movieState) {
            this.setState({...JSON.parse(movieState)});
            return;
        }

        const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=es-ES`;
        this.fetchItems(endpoint);
    }

    fetchItems = async endpoint => {
        const {match} = this.props;
        let result = await (await fetch(endpoint)).json();
        
        console.log(result);

        if (result.status_code) {
            this.setState({'loading': false});
            return;
        }

        this.setState({movie: result});
        const creditsEndpoint = `${API_URL}movie/${match.params.movieId}/credits?api_key=${API_KEY}&language=es-ES`;

        result = await (await fetch(creditsEndpoint)).json();

        if (result.status_code) {
            this.setState({loading: false});
            return;
        }

        const directors = result.crew.filter((member) => member.job === 'Director');
        this.setState({
            loading: false,
            actors: result.cast,
            directors
        }, () => {
            localStorage.setItem(`${match.params.movieId}`, JSON.stringify(this.state));
        });
    }

    render() {
        return (
            <div className="rmdb-movie">
            {this.state.movie ? 
                <div>
                    <Navigation movie={this.props.location.movieName} />
                    <MovieInfo movie={this.state.movie} directors={this.state.directors} />
                    <MovieInfoBar time={this.state.movie.runtime} budget={this.state.movie.budget} revenue={this.state.movie.revenue} />
                </div>
                : null}
            {this.state.actors ? 
                <div className="rmdb-movie-grid">
                    <FourColGrid header="Actors">
                    {this.state.actors.map((element, i) => {
                        return <Actor key={i} actor={element} />
                    })}
                    </FourColGrid>
                </div>
                : null}
                {this.state.loading ? <Spinner /> : null}
                {!this.state.actors && !this.state.loading ? <h1>No Movie Found!!!</h1> : null}
            </div>
        );
    }
}

export default Movie;