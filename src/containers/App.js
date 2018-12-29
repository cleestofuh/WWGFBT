import React, { Component } from 'react'
import './App.css'
import { YELP_API_URL } from '../profiles/dev'

import BobaSVG from '../components/bobaSVG'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            history: new Map()
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.placeholder = 'Enter City or Zip';
        this.category = 'bubbletea';
        this.maxHistory = 6;
    }

    // Mounts event listener after first render
    componentDidMount() {
        document.addEventListener('keydown', this.onKeyPressed.bind(this))
    }

    // Listens to enter keystroke to display new shop
    onKeyPressed(e) {
        if (e.key === 'Enter') {
            this.handleSubmit(e)
        }
    }

    // Handles any change & keystroke on input field
    handleChange(event) {
        this.setState({ location: event.target.value });
    }

    // Handles form submission
    handleSubmit(event) {
        this.showHTML('weOutDiv')
        this.showHTML('tryAgain')
        this.hideHTML('locationInput')
        this.getShopList();
        event.preventDefault();
    }

    // Helper function to hide HTML
    hideHTML(tagID) {
        document.getElementById(tagID).style.display = 'none'
    }

    // Helper function to show HTML
    showHTML(tagID) {
        if (tagID === 'weOutDiv' || tagID === 'locationRef') {
            document.getElementById(tagID).style.display = 'block'
        } else {
            document.getElementById(tagID).style.display = 'initial'
        }

    }

    async getShopList() {
        let response, shops

        // Checking localstorage for existence of location array
        if (window.localStorage.getItem(this.state.location)) {
            shops = JSON.parse(window.localStorage.getItem(this.state.location))
        }
        else {
            // Calls API, converts to json synchronously 
            response = await fetch(`${YELP_API_URL}?category=${this.category}&location=${this.state.location}`)
            shops = await response.json()
            window.localStorage.setItem(this.state.location, JSON.stringify(shops))
        }
        // Error check for API response
        if (!shops.message.error && shops.data.length !== 0) {
            this.showRandomShop(shops)
        }
        else {
            this.showErrorText()
            this.hideHTML('weOutDiv')
            this.hideHTML('goButton')
        }
    }

    // Helper function to display a random boba shop
    showRandomShop(shops) {
        // RNG number from 0 to array length
        let RNG = Math.floor(Math.random() * shops.data.length)
        // Updating result container
        let container = document.getElementById('shopNameContainer')
        let errorContainer = document.getElementById('errorText')
        let ratingContainer = document.getElementById('yelpRating')
        let reviewCountContainer = document.getElementById('reviewCount')
        let locationRef = document.getElementById('locationRef')
        let address = shops.data[RNG].location.display_address
        locationRef.innerHTML = address.join(", ")

        // Adding content to history
        this.addShopToHistory(shops.data[RNG].name, shops.data[RNG].url)

        // Truncate result based on screen size
        let maxNameLength = 20
        let name = shops.data[RNG].name
        if (shops.data[RNG].name.length > maxNameLength && window.screen.width <= 600) {
            name = shops.data[RNG].name.substring(0, maxNameLength) + "..."
        }
        else {
            name = name + '!'
        }

        // Updating content of container
        errorContainer.innerHTML = ''
        container.innerHTML = name
        container.href = shops.data[RNG].url

        let rating = shops.data[RNG].rating
        ratingContainer.src = this.getStarImages(rating)

        reviewCountContainer.innerHTML = shops.data[RNG].review_count + ' Reviews'
    }

    // Helper function to add shop+url to history
    addShopToHistory(shop, url) {
        // Only adds to history of new shop+url is not a duplicate
        if (!this.state.history.has(url)) {
            // Deletes oldest shop+url if map is at capacity
            if (this.state.history.size === this.maxHistory) {
                this.state.history.delete(this.state.history.entries().next().value[0]);
            }
            // Set key as url because some regions may have have multiple of the same franchise
            this.state.history.set(url, shop); 
        }
    }

    // Helper function to return yelp star img based on rating
    getStarImages(rating) {

        switch (rating) {
            case 0:
                let zeroStars = require("../assets/yelpstars/regular_0@3x.png")
                return zeroStars

            case 1:
                let oneStars = require("../assets/yelpstars/regular_1@3x.png")
                return oneStars

            case 1.5:
                let oneHalfStars = require("../assets/yelpstars/regular_1_half@3x.png")
                return oneHalfStars

            case 2:
                let twoStars = require("../assets/yelpstars/regular_2@3x.png")
                return twoStars

            case 2.5:
                let twoHalfStars = require("../assets/yelpstars/regular_2_half@3x.png")
                return twoHalfStars

            case 3:
                let threeStars = require("../assets/yelpstars/regular_3@3x.png")
                return threeStars

            case 3.5:
                let threeHalfStars = require("../assets/yelpstars/regular_3_half@3x.png")
                return threeHalfStars

            case 4:
                let fourStars = require("../assets/yelpstars/regular_4@3x.png")
                return fourStars

            case 4.5:
                let fourHalfStars = require("../assets/yelpstars/regular_4_half@3x.png")
                return fourHalfStars

            case 5:
                let fiveStars = require("../assets/yelpstars/regular_5@3x.png")
                return fiveStars

            default:
                break
        }
    }

    // Helper function to handle error condition
    showErrorText() {
        // TODO: I've created the error condition, do what you want with this part!
        let errorContainer = document.getElementById('errorText')
        errorContainer.innerHTML = 'We couldn&rsquo;t find bubble tea places matching your location.'
        // console.log(shops.message.error)
    }

    // Helper function to render form
    renderForm() {
        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input id="locationInput" className="input-form" value={this.state.location} onChange={this.handleChange} placeholder={this.placeholder} onFocus={e => e.target.select()} />
                    </div>
                    <p id='errorText'></p>
                    {/*eslint-disable-next-line*/}
                    <div className="we-out" id="weOutDiv">
                        <span id="locationRef"></span>
                        {/*eslint-disable-next-line*/}
                        <p className="we-out-text">We out to <a target="_blank" id='shopNameContainer' href="#"></a></p>
                        <img height="20px" alt="yelp rating" id="yelpRating" src={require("../assets/yelpstars/regular_5@3x.png")} />
                        <span id="reviewCount"></span>
                    </div>
                    <br />
                    <button id="goButton" className='clickable brown-btn'>See where we goin&rsquo;</button>
                </form>
                <span className="clickable under-btn" id="tryAgain" onClick={() => { this.showHTML('locationInput'); this.showHTML('goButton'); this.hideHTML('weOutDiv'); this.hideHTML('tryAgain') }}>Try another location</span>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="flex-container">
                        <div className="main">
                            <h1 className="main-header">Where we goin&rsquo;  for<br />bubble tea?</h1>
                            {this.renderForm()}
                        </div> {/* end main */}
                        <BobaSVG />
                    </div> {/* end flex-container */}
                </header>
            </div>
        );
    }


}
export default App;