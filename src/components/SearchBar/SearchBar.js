import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchBar.css';
import Suggestion from '../Suggestion/Suggestion';
const yelpApiKey = process.env.REACT_APP_YELP_API_KEY;
const placesApiKey = process.env.REACT_APP_PLACES_API_KEY;
const CORS = 'https://cors-anywhere.herokuapp.com/';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: '',
            location: '',
            sortBy: 'best_match',

            termSuggestions: [],
            locationSuggestions: [],
        };
        this.sortByOptions = {
            'Best Match': 'best_match',
            'Highest Rated': 'rating',
            'Most Reviewed': 'review_count',
        };
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleTermClick = this.handleTermClick.bind(this);
        this.handleLocationClick = this.handleLocationClick.bind(this);
        this.handleLocationEnter = this.handleLocationEnter.bind(this);
        this.handleTermEnter = this.handleTermEnter.bind(this);
    }
    getSortByClass(sortByOption) {
        return (this.state.sortBy === sortByOption) ? 'active' : '';
    }
    handleSortByChange(sortByOption) {
        this.setState({ sortBy: sortByOption });
    }

    handleTermChange(e) {
        this.setState({
            term: e.target.value,
        });
        this.findTermSuggestions(document.getElementById("Term-Search-Field").value);
    }

    handleLocationChange(e) {
        this.setState({
            location: e.target.value,
        });
        this.findLocationSuggestions(document.getElementById("Location-Field").value);
    }

    handleSearch(e) {
        e.preventDefault();
        this.props.searchYelp(this.state.term, this.state.location, this.state.sortBy);
    }

    renderSortByOptions() {
        return Object.keys(this.sortByOptions).map((sortByOption) => {
            let sortByOptionValue = this.sortByOptions[sortByOption];
            return (
                <li key={sortByOptionValue} className={this.getSortByClass(sortByOptionValue)} onClick={this.handleSortByChange.bind(this, sortByOptionValue)}>
                    {sortByOption}
                </li>
            );
        });
    }

    handleTermClick(e) {
        document.getElementById("Term-Search-Field").value = e.target.value;
        this.setState({
            term: e.target.value,
            termSuggestions: []
        });
    }
    handleLocationClick(e) {
        document.getElementById("Location-Field").value = e.target.value;
        this.setState({
            location: e.target.value,
            locationSuggestions: []
        });
    }

    handleTermEnter(e) {
        if (e.key === "Enter") {
            document.getElementById("Term-Search-Field").value = e.target.value;
            this.setState({ termSuggestions: [] });
        }
    }
    handleLocationEnter(e) {
        if (e.key === "Enter") {
            document.getElementById("Location-Field").value = e.target.value;
            this.setState({ locationSuggestions: [] });
        }
    }

    async findTermSuggestions(term) {
        if (term !== '') {
            const endpoint = `${CORS}https://api.yelp.com/v3/autocomplete?text=${term}`;
            try {
                const response = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${yelpApiKey}`
                    }
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    if (jsonResponse.terms) {
                        const response = jsonResponse.terms.map(suggestion => {
                            return suggestion.text;
                        });
                        this.setState({
                            termSuggestions: response,
                        });
                    }
                }
            }
            catch (error) {
                console.log(error);
                this.setState({ termSuggestions: [] });
            }
        } else {

            this.setState({ termSuggestions: [] });
        }
    }

    async findLocationSuggestions(location) {
        if (location !== '') {
            const endpoint = `${CORS}https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&language=en&key=${placesApiKey}`;
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const jsonResponse = await response.json();
                    if (jsonResponse.predictions) {
                        const response = jsonResponse.predictions.map(suggestion => {
                            return suggestion.description;
                        });
                        this.setState({
                            locationSuggestions: response,
                        });
                    }
                }
            }
            catch (error) {
                console.log(error);
                this.setState({ locationSuggestions: [] });
            }
        } else {
            this.setState({ locationSuggestions: [] });
        }
    }

    render() {
        return (
            <>
                <style type="text/css">
                    {`
                    .Term-Search {
                        position: absolute;
                        z-index:3;
                        top:10rem;
                        height: 0%;
                        padding-left:6rem;
                        margin-bottom:0;
                    }
                    .SearchBar-location {
                        position: absolute;
                        z-index:2;
                        height: 0%;
                        left:0%;
                        top:10rem;
                        left:50%;
                        padding-right:6rem;
                    }
                    .SearchBar-submit{
                        margin-top:6rem;
                        margin-bottom:2rem;
                        position:relative;
                        z-index:1;
                    }

                    @media (max-width: 768px) {
                        .SearchBar-options{
                            font-size:1rem;
                        }
                        .Term-Search {
                            padding-left:3rem;
                        }
                        .SearchBar-location {
                            padding-right:3rem;
                        }
                        .SearchBar-submit{
                            margin-top:6rem;
                        }
                    }
                    @media (max-width: 576px) {
                        .SearchBar-options{
                            font-size:1rem;
                        }
                        .Term-Search {
                            top:10rem;
                            padding-left:2rem;
                            padding-right:2rem;
                        }
                        .SearchBar-location {
                            top:12.5rem;
                            left:0%;
                            padding-left:2rem;
                            padding-right:2rem;
                        }
                        .SearchBar-submit{
                            margin-top:7rem;
                        }
                    }
                    `}
                </style>
                <Container className="SearchBar" fluid>
                    <div className='SearchBar-sort-options'>
                        <ul >{this.renderSortByOptions()}</ul>
                    </div>
                    <Row>
                        <Col className="Term-Search" sm={6}>
                            <Form.Control type="text" id="Term-Search-Field" placeholder="Search Businesses" onKeyDown={this.handleTermEnter} onChange={this.handleTermChange} />
                            <Suggestion onClick={this.handleTermClick} list={this.state.termSuggestions} />
                        </Col>
                        <Col id="Location-Search" className="SearchBar-location" sm={6}>
                            <Form.Control type="text" id="Location-Field" placeholder="Where?" onKeyDown={this.handleLocationEnter} onChange={this.handleLocationChange} />
                            <Suggestion onClick={this.handleLocationClick} list={this.state.locationSuggestions} />
                        </Col>
                    </Row>
                    <Row align="center">
                        <Col sm={12} >
                            <Button id="Submit-Button" className="SearchBar-submit" onClick={this.handleSearch} variant="danger">Let's Go</Button>
                        </Col>
                    </Row>
                </Container >
            </>
        );
    }
};
export default SearchBar;