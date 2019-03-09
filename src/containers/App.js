import React, { Component } from 'react'
import './App.css'
import ReactGA from 'react-ga'

// User Imports
import { YELP_URL, YELP_AUTO_URL } from '../profiles/dev'
import BobaSVG from '../components/bobaSVG'
import History from '../components/history'
import SeeAllNearby from '../components/seeAllNearby'

ReactGA.initialize('UA-73963331-3')
ReactGA.pageview(window.location.pathname + window.location.search)

var http = require("http");
setInterval(function() {
    http.get("http://wwgfbt.herokuapp.com");
}, 1500000); // every 25 minutes (1,500,00)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            submittedOnce: false,
            modalOn: false
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTryAgain = this.handleTryAgain.bind(this)
        this.handleSeeAllNearby = this.handleSeeAllNearby.bind(this)
        this.placeholder = 'Enter Address, City, or Zip'
        this.category = 'bubbletea'
        this.longitude = null
        this.latitude = null
        this.autoLocation = false
    }

    // Mounts event listener after first render
    componentDidMount() {
        document.addEventListener('keydown', this.onKeyPressed.bind(this))
        this.getLocation()
    }

    // Asking user for current location
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude
                this.longitude = position.coords.longitude
                this.autoLocation = true
                this.handleSubmit(null)
            })
        }
    }

    // Listens to enter keystroke to display new shop
    onKeyPressed(e) {
        if (e.key === 'Enter' && !this.state.modalOn) {
            this.handleSubmit(e)
        }
        else if ((this.state.modalOn) && (e.key === "Esc" || e.key === "Escape")) {
            this.hideHTML(['seeAllModal']);
        }
    }


    // Handles any change & keystroke on input field
    handleChange(event) {
        this.autoLocation = false
        this.setState({ location: event.target.value });
    }

    // Handles form submission
    handleSubmit(event) {
        this.setState({ submittedOnce: true })
        this.hideHTML(['locationInput'])
        this.getShopList()
        this.restartBoba()
        this.moveBoba()
        if(event){
            event.preventDefault()
        }
    }

    // Handles try again button clicked
    handleTryAgain(){
        this.setState({ submittedOnce: false })
        this.setState({ modalOn: false })
        this.showHTML(['locationInput','goButton']);
        this.hideHTML(['weOutDiv','tryAgain','seeAllNearby','errorText'])
    }

    handleSeeAllNearby() {
        if (!this.state.modalOn) {
            this.setState({ modalOn: true })
        } else {
            this.showHTML(['seeAllModal'])
        }
    }

    // Helper function to hide HTML
    hideHTML(tagIDs) {
        tagIDs.forEach(function(tagID) {
            document.getElementById(tagID).style.display = 'none'
        });
    }

    // Helper function to show HTML
    showHTML(tagIDs) {
            tagIDs.forEach(function(tagID) {
            if (tagID === 'weOutDiv' || tagID === 'locationRef' || tagID === 'history-title') {
                document.getElementById(tagID).style.display = 'block'
            } else {
                document.getElementById(tagID).style.display = 'initial'
            }
        });
    }

    showWeOut() {
        this.showHTML(['weOutDiv','yelpRating','shopNameContainer',
                       'reviewCount','tryAgain','seeAllNearby',
                       'history-title','historyContainer','goButton','locationRef'])
        this.hideHTML(['loader'])
    }

    showLoader() {
        this.showHTML(['weOutDiv','loader'])
        this.hideHTML(['shopNameContainer','yelpRating','reviewCount',
                       'goButton', 'history-title', 'historyContainer',
                       'errorText', 'locationRef'])
    }

    // Adds boba movement class
    moveBoba() {
        document.getElementById('strawboba').classList.add('move-boba')
    }

    // Adds boba movement class
    restartBoba() {
        document.getElementById('strawboba').style.webkitAnimation = 'none';
        setTimeout(function () {
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
        else if(window.localStorage.getItem(this.longitude + ' ' + this.latitude ) && this.autoLocation){
            shops = JSON.parse(window.localStorage.getItem(this.longitude + ' ' + this.latitude))
        }
        else {
            this.showLoader()
            // Google Analytics handlers to push location info
            if(this.state.location){
                ReactGA.event({
                    category: 'Location',
                    action: this.state.location,
                })
            }
            else{
                ReactGA.event({
                    category: 'Location',
                    action: this.longitude + ' ' + this.latitude,
                })
            }
            
            // Get call based on if auto location or not
            // Also sets localStorage key as long/lat for autolocation instead of input parameter
            if(this.autoLocation){
                response = await fetch(`${YELP_AUTO_URL}?category=${this.category}&longitude=${this.longitude}&latitude=${this.latitude}`)
                shops = await response.json()
                window.localStorage.setItem(this.longitude + ' ' + this.latitude, JSON.stringify(shops))
            }
            else{
                response = await fetch(`${YELP_URL}?category=${this.category}&location=${this.state.location}`)
                shops = await response.json()
                window.localStorage.setItem(this.state.location, JSON.stringify(shops))
            }
        }

        // Error check for API response
        if (!shops.message.error && shops.data.length !== 0) {
            this.showRandomShop(shops)
            //SeeAllNearby.createSeeAllNearby(shops, this.getStarImages)
        }
        else {
            this.showErrorText()
            this.hideHTML(['weOutDiv','goButton','history-title','historyContainer'])
        }
    }

    // Helper function to display a random boba shop
    showRandomShop(shops) {
        this.showWeOut()
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
        History.addShopToHistory(shops.data[RNG].name, shops.data[RNG].url)

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
        this.showHTML(['errorText', 'tryAgain'])
        this.hideHTML(['loader'])
        // console.log(shops.message.error)
    }

    // Helper function to render modal
    renderModal()
    {
        let modal, shops;
        if (this.state.modalOn) {
            if (window.localStorage.getItem(this.state.location)) {
                shops = JSON.parse(window.localStorage.getItem(this.state.location));
            }
            else if(window.localStorage.getItem(this.longitude + ' ' + this.latitude ) && this.autoLocation){
                shops = JSON.parse(window.localStorage.getItem(this.longitude + ' ' + this.latitude));
            }
            modal = <SeeAllNearby shops={shops} getStarImages={this.getStarImages}/>;
        } else {
            modal = null;
        }
        return modal
    }

    // Helper function to render form
    renderForm() {
        return (
            <React.Fragment>
                <form>
                    <div>
                        <input id="locationInput" className="input-form" value={this.state.location} onChange={this.handleChange} placeholder={this.placeholder} onFocus={e => e.target.select()} />
                    </div>
                    <p id='errorText'></p>
                    {/*eslint-disable-next-line*/}
                    <div className="we-out" id="weOutDiv">
                        <span id="locationRef"></span>
                        {/*eslint-disable-next-line*/}
                        <p className="we-out-text">We out to <a target="_blank" id='shopNameContainer' href="#"></a></p>
                        <div className="loader" id="loader"></div>
                        <img height="20px" alt="yelp rating" id="yelpRating" src={require("../assets/yelpstars/regular_5@3x.png")} />
                        <span id="reviewCount"></span>
                    </div>
                    {this.renderModal()}
                    <br />
                    <button id="goButton" className='clickable brown-btn' onClick={this.handleSubmit}>
                        {!this.state.submittedOnce ?
                            <React.Fragment>See where we goin&rsquo;</React.Fragment>
                            : <React.Fragment>Find me another!</React.Fragment>
                        }
                    </button>
                </form>
                <span className="clickable under-btn" id="tryAgain" onClick={this.handleTryAgain}>Try another location</span>
                <span className="clickable under-btn" id="seeAllNearby" onClick={this.handleSeeAllNearby}>See all nearby</span>

                <History />
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
                    <br />
                    <small>&copy; Copyright 2018, made with <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">❤</span> in California</small>
                </footer>
            </div>
        );
    }


}
export default App;