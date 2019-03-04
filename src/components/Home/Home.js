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
        const{movies, heroImage, loading, currentPage, totalPages, searchTerm} = this.state;
        return (
            <div className="rmdb-home">
                {heroImage ?
                <div>
                    <HeroImage image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}`}
                    title={heroImage.original_title} 
                    text={heroImage.overview}/>
                    <SearchBar callback={this.searchItems}/>
                </div>: null }
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
                {currentPage <= totalPages && !loading ? <LoadMoreBtn onClick={this.loadMoreItems} text="Load more movies"/> : null}
            </div>
        )
    }
}