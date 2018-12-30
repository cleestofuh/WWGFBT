import React, { Component } from 'react'
import './App.css'
import ReactGA from 'react-ga'

// User Imports
import { YELP_API_URL } from '../profiles/dev'
import BobaSVG from '../components/bobaSVG'

ReactGA.initialize('UA-73963331-3')
ReactGA.pageview(window.location.pathname + window.location.search)


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.placeholder = 'Enter City or Zip';
        this.category = 'bubbletea';
        this.maxHistory = 5;
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
        this.showHTML('history-title')
        this.showHTML('historyContainer')
        this.hideHTML('locationInput')
        this.getShopList()
        this.restartBoba()
        this.moveBoba()
        event.preventDefault()
    }

    // Helper function to hide HTML
    hideHTML(tagID) {
        document.getElementById(tagID).style.display = 'none'
    }

    // Helper function to show HTML
    showHTML(tagID) {
        if (tagID === 'weOutDiv' || tagID === 'locationRef' || tagID === 'history-title') {
            document.getElementById(tagID).style.display = 'block'
        } else {
            document.getElementById(tagID).style.display = 'initial'
        }
    }

    // Adds boba movement class
    moveBoba(){
        document.getElementById('strawboba').classList.add('move-boba')
    }

    // Adds boba movement class
    restartBoba(){
        document.getElementById('strawboba').style.webkitAnimation = 'none';
        setTimeout(function() {
            document.getElementById('strawboba').style.webkitAnimation = '';
        }, 1);
        document.getElementById('strawboba').classList.remove('move-boba')
    }

    async getShopList() {
        let response, shops

        // Checking localstorage for existence of location array
        if (window.localStorage.getItem(this.state.location)) {
            shops = JSON.parse(window.localStorage.getItem(this.state.location))
        }
        else {
            // Google Analytics handlers to push location info
            ReactGA.event({
                category: 'Location',
                action: this.state.location,
            })

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
            this.hideHTML('history-title')
            this.hideHTML('historyContainer')
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
        let div = document.getElementById("historyContainer");

        // Find potential duplicate in historyContainer div and remove it to readd it to the front
        let duplicates = div.querySelectorAll("a[href='"+url+"']");
        for (let i = 0; i < duplicates.length; i++) {
            div.removeChild(duplicates[i]);
        }

        // Removes the last entry in the history if the container reaches capacity
        if (div.childNodes.length >= this.maxHistory) {
            div.removeChild(div.lastChild);
        } 

        // Adds a new text node to the front of the history
        let item = document.createElement('a')
        item.href = url;
        item.innerHTML = shop;
        item.className = 'history';
        item.target = '_blank';
        div.insertBefore(item, div.firstChild);
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
                <span className="clickable under-btn" id="tryAgain" onClick={() => { this.hideHTML('history-title'); this.hideHTML('historyContainer'); this.showHTML('locationInput'); this.showHTML('goButton'); this.hideHTML('weOutDiv'); this.hideHTML('tryAgain') }}>Try another location</span>
                <p id="history-title">History</p>
                <div id="historyContainer">
                </div>
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
                <footer>
                    <small>Send us feedback at WWGFBT@gmail.com</small>
                    <br/>
                    <small>&copy; Copyright 2018, made with <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">❤</span>️ by ABBs</small>
                </footer>
            </div>
        );
    }


}
export default App;