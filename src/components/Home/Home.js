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
        this.fetchItems(this.popularEP(false)(''));
    }

    createEndpoint = type => loadMore => searchTerm =>
        `${API_URL}${type}?api_key=${API_KEY}&language=es-ES&page=${loadMore 
            && this.state.currentPage + 1}&query=${searchTerm}`;

    searchEP = this.createEndpoint('search/movie');
    popularEP = this.createEndpoint('movie/popular');

    updateItems = (loadMore, newSearchTerm) => {
        const {movies, searchTerm} = this.state;

        this.setState({
            movies: loadMore ? [...movies] : [],
            loading: true,
            searchTerm: loadMore ? searchTerm : newSearchTerm,
        }, () => {
            this.fetchItems(
                !this.state.searchTerm
                ? this.popularEP(loadMore)('')
                : this.searchEP(loadMore)(this.state.searchTerm)
            )
        });
    }

    fetchItems = async endPoint => {
        const {movies, heroImage, searchTerm} = this.state;
        const result = await (await fetch(endPoint)).json();
        try {
            this.setState({
                movies: [...movies, ...result.results],
                heroImage: heroImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            },() => {
                if (searchTerm === '') {
                    localStorage.setItem('HomeState', JSON.stringify(this.state));
                }
            });
        } catch(e) {
            console.log("There was an error: ", e)
        };
    };

    render() {
        const{movies, heroImage, loading, currentPage, totalPages, searchTerm} = this.state;
        return (
            <div className="rmdb-home">
                {heroImage && !searchTerm ?
                <div>
                    <HeroImage image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}`}
                    title={heroImage.original_title} 
                    text={heroImage.overview}/>
                </div>: null }
                <SearchBar callback={this.updateItems}/>
                <div className="rmdb-home-grid">
                    <FourColGrid 
                    header={searchTerm ? 'Search Result' : 'Popular Movies'}
                    loading={loading}>
                        {movies.map((movie, i) => {
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
                {loading ? <Spinner /> : null}
                {currentPage < totalPages && !loading ? <LoadMoreBtn onClick={this.updateItems} text="Load more movies"/> : null}
            </div>
        )
    }
}