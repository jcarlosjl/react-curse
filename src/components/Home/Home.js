import React, {Component} from 'react';
import './Home.css';
import HeroImage from '../elements/HeroImage/HeroImage'
import SearchBar from '../elements/SearchBar/SearchBar'
import FourColGrid from '../elements/FourColGrid/FourColGrid'
import MovieThumb from '../elements/MovieThumb/MovieThumb'
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn'
import Spinner from  '../elements/Spinner/Spinner'
import {API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE} from '../../config'

export default class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: '',
    }

    componentDidMount() {
        const localState = localStorage.getItem('HomeState');
        if (localState) {
            this.setState({...JSON.parse(localState)});
            return;
        }

        this.setState({loading: true});
        const endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
        this.fetchItems(endPoint);
    }

    searchItems = (searchTerm) => {
        let endPoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm
        });
        if (searchTerm === '') {
            endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
        } else {
            endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=es-ES&query=${searchTerm}`;
        }

        this.fetchItems(endPoint);
    }

    fetchItems = (endPoint) => {
        fetch(endPoint)
        .then(result => result.json())
        .then(result => {
            console.log(result);
            this.setState({
                movies: [...this.state.movies, ...result.results],
                heroImage: this.state.heroImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            },() => {
                if (this.state.searchTerm === '') {
                    localStorage.setItem('HomeState', JSON.stringify(this.state));
                }
            });
        });
    }

    loadMoreItems = () => {
        let endPoint = '';
        this.setState({ loading: true });

        if (this.state.searchTerm === '') {
            endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&lang=es-ES&page=${this.state.currentPage + 1}`
        } else {
            endPoint = `${API_URL}search/movie?api_key=${API_KEY}&lang=es-ES&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`
        }

        this.fetchItems(endPoint);
    }

    render() {
        return (
            <div className="rmdb-home">
                {this.state.heroImage ?
                <div>
                    <HeroImage image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${this.state.heroImage.backdrop_path}`}
                    title={this.state.heroImage.original_title} 
                    text={this.state.heroImage.overview}/>
                    <SearchBar callback={this.searchItems}/>
                </div>: null }
                <div className="rmdb-home-grid">
                    <FourColGrid 
                    header={this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
                    loading={this.state.loading}>
                        {this.state.movies.map((movie, i) => {
                            return (
                                <MovieThumb 
                                key={i}
                                clickable={true}
                                image={movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : './images/no_image.jpg'}
                                movieId={movie.id}
                                movieName={movie.original_title}/>
                            )
                        })}
                    </FourColGrid>
                </div>
                {this.state.loading ? <Spinner /> : null}
                {this.state.currentPage <= this.state.totalPages && !this.state.loading ? <LoadMoreBtn onClick={this.loadMoreItems} text="Load more movies"/> : null}
            </div>
        )
    }
}