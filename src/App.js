import React, { Component } from 'react'
import './App.css'
import { YELP_API_URL } from './profiles/dev'

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
    }

    // Mounts event listener after first render
    componentDidMount(){
        document.addEventListener('keydown', this.onKeyPressed.bind(this))
    }

    // Listens to enter keystroke to display new shop
    onKeyPressed(e){
        if(e.key === 'Enter'){
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
      if(tagID === 'weOutDiv' || tagID === 'locationRef') {
          document.getElementById(tagID).style.display = 'block'
      } else {
          document.getElementById(tagID).style.display = 'initial'
      }

    }

    async getShopList() {
        let response, shops

        // Checking localstorage for existence of location array
        if(window.localStorage.getItem(this.state.location)){
            shops = JSON.parse(window.localStorage.getItem(this.state.location))
        }
        else{
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
    showRandomShop(shops){
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

        // Truncate result based on screen size
        let maxNameLength = 20
        let name = shops.data[RNG].name
        if (shops.data[RNG].name.length > maxNameLength && window.screen.width <= 600) {
            name = shops.data[RNG].name.substring(0, maxNameLength) + "..."
        }
        else {
            name = name + '!'
        }


        errorContainer.innerHTML = ''
        container.innerHTML = name
        container.href = shops.data[RNG].url

        let rating = shops.data[RNG].rating
        ratingContainer.src = this.getStarImages(rating)

        reviewCountContainer.innerHTML = shops.data[RNG].review_count + ' Reviews'
    }

    getStarImages(rating) {

        switch(rating) {
            case 0:
                let zeroStars = require("./assets/yelpstars/regular_0@3x.png")
                return zeroStars
          
            case 1:
                let oneStars = require("./assets/yelpstars/regular_1@3x.png")
                return oneStars
       
            case 1.5:
                let oneHalfStars = require("./assets/yelpstars/regular_1_half@3x.png")
                return oneHalfStars
              
            case 2:
                let twoStars = require("./assets/yelpstars/regular_2@3x.png")
                return twoStars
         
            case 2.5:
                let twoHalfStars = require("./assets/yelpstars/regular_2_half@3x.png")
                return twoHalfStars
      
            case 3:
                let threeStars = require("./assets/yelpstars/regular_3@3x.png")
                return threeStars
          
            case 3.5:
                let threeHalfStars = require("./assets/yelpstars/regular_3_half@3x.png")
                return threeHalfStars
          
            case 4:
                let fourStars = require("./assets/yelpstars/regular_4@3x.png")
                return fourStars
        
            case 4.5:
                let fourHalfStars = require("./assets/yelpstars/regular_4_half@3x.png")
                return fourHalfStars
            
            case 5:
                let fiveStars = require("./assets/yelpstars/regular_5@3x.png")
                return fiveStars
           
            default:
                break
        }
    }

    // Helper function to handle error condition
    showErrorText(){
        // TODO: I've created the error condition, do what you want with this part!
        let errorContainer = document.getElementById('errorText')
        errorContainer.innerHTML = 'We couldn&rsquo;t find bubble tea places matching your location.'
        // console.log(shops.message.error)
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="flex-container">
                      <div className="main">

                        <h1 className="main-header">Where we goin&rsquo;  for<br />bubble tea?</h1>

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
                              <img height="20px" alt="yelp rating" id="yelpRating" src={require("./assets/yelpstars/regular_5@3x.png")}/>
                              <span id="reviewCount"></span>
                            </div>
                            <br/>
                            <button id="goButton" className='clickable brown-btn'>See where we goin&rsquo;</button>
                        </form>
                        <span className="clickable under-btn" id="tryAgain" onClick={() => {this.showHTML('locationInput') ; this.showHTML('goButton') ; this.hideHTML('weOutDiv') ; this.hideHTML('tryAgain')}}>Try another location</span>

                      </div> {/* end main */}

                      <div className="drink">

                        <svg className="boba" width="40vw" height="80vh" viewBox="0 0 210 459" version="1.1" xmlns="http://www.w3.org/2000/svg">
                          <title>big boba</title>
                          <desc>Created with Sketch.</desc>
                          <g id="mobile" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g id="Landing-page" transform="translate(-83.000000, -353.000000)" fillRule="nonzero">
                                  <g id="Group-9">
                                      <g id="Group-6" transform="translate(83.000000, 353.000000)">
                                          <path d="M0,115.818256 C7.53910825,123.020149 27.3856992,126.621096 59.5397727,126.621096 C80.4683879,126.621096 113.970807,118.869351 147.608411,115.818256 C159.636521,114.727248 177.433717,114.727248 201,115.818256 L186.16423,421.936296 C185.13128,443.249942 167.549784,460 146.211123,460 L54.7888774,460 C33.4502157,460 15.8687195,443.249942 14.8357704,421.936296 L0,115.818256 Z" id="Rectangle" fill="#E8C46F"></path>
                                          <g id="Group-5" transform="translate(19.000000, 390.000000)">
                                              <g id="Group-4" transform="translate(27.951564, 45.165714)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-11" transform="translate(16.429062, 21.565611)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy" transform="translate(47.292906, 36.620849)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-10" transform="translate(43.589245, 17.496628)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-3" transform="translate(70.749428, 21.565611)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-12" transform="translate(0.000000, 12.613848)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-4" transform="translate(132.408085, 17.496628)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-5" transform="translate(124.108696, 31.940077)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-8" transform="translate(101.613272, 42.724324)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-6" transform="translate(113.958810, 17.496628)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-13" transform="translate(129.596491, 0.000000)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-9" transform="translate(93.382914, 21.565611)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-14" transform="translate(78.156751, 6.510373)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-7" transform="translate(70.749428, 42.724324)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                              <g id="Group-4-Copy-2" transform="translate(6.982838, 31.492458)">
                                                  <ellipse id="Oval" fill="#544C45" cx="14.4031274" cy="14.2414414" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.460717" cy="15.8690347" rx="14.4031274" ry="14.2414414"></ellipse>
                                                  <path d="M8.65484602,8.15426941 C11.7483246,7.7734781 13.1653768,9.51334261 13.1917338,7.85691403 C13.2180909,6.20048545 10.5406689,5.8464918 8.73721527,5.87283902 C6.93376165,5.89918624 5.02209594,6.95165355 4.99573887,8.60808214 C4.9693818,10.2645107 5.56136746,8.53506072 8.65484602,8.15426941 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.093420, 7.592511) rotate(-33.000000) translate(-9.093420, -7.592511) "></path>
                                              </g>
                                          </g>
                                          <g id="Group-4-Copy-13" transform="translate(60.000000, 327.000000)">
                                              <ellipse id="Oval" fill="#544C45" cx="14.4666667" cy="14.6621622" rx="14.4666667" ry="14.6621622"></ellipse>
                                              <ellipse id="Oval" stroke="#222222" strokeWidth="6" cx="16.5333333" cy="16.3378378" rx="14.4666667" ry="14.6621622"></ellipse>
                                              <path d="M8.69610001,8.40841633 C11.8309071,7.99859566 13.2523271,9.78010255 13.2916136,8.07598045 C13.3309001,6.37185835 10.6229087,6.02337138 8.79684957,6.06102721 C6.97079049,6.09868304 5.0273683,7.19254165 4.98808176,8.89666376 C4.94879522,10.6007859 5.56129291,8.81823701 8.69610001,8.40841633 Z" id="Oval" fillOpacity="0.518653759" fill="#D8D8D8" transform="translate(9.139195, 7.839733) rotate(-33.000000) translate(-9.139195, -7.839733) "></path>
                                          </g>
                                          <g id="Group-3" transform="translate(20.000000, 0.000000)">
                                              <polygon id="Rectangle" fillOpacity="0.283429574" fill="#000000" points="172.178155 6.16670826 187.336004 1.99099203 51.0836996 418.295515 35.0087453 421.654586"></polygon>
                                              <path d="M147.03673,3.46351154 L184.035874,3.46351154 L46.41428,421.666213 C39.4190691,421.255058 32.8363526,422.514073 26.6661305,425.443256 C20.4959085,428.372439 11.6071983,433.552095 0,440.982224 L147.03673,3.46351154 Z" id="Rectangle" fillOpacity="0.626075634" fill="#FF7E7E"></path>
                                              <path d="M152.920177,6.72931379 L9.73667275,432.782465 C17.4874125,428.016167 23.7211607,424.512343 28.4600716,422.262644 C34.361649,419.460994 40.6228153,418.062884 47.2059807,418.071546 L184.261633,3.95578557 L152.920177,6.72931379 Z" id="Rectangle" stroke="#222222" strokeWidth="7"></path>
                                          </g>
                                          <path d="M5.50317027,102 L20.0742748,421.684697 C20.9748797,441.443637 37.2564461,457 57.0359008,457 L145.964326,457 C165.74378,457 182.025347,441.443637 182.925952,421.684697 L197.497056,102 L5.50317027,102 Z" id="Rectangle" stroke="#222222" strokeWidth="6" fillOpacity="0.0970901268" fill="#FFFFFF"></path>
                                      </g>
                                  </g>
                              </g>
                          </g>
                        </svg>

                      </div> {/* end drink */}

                    </div> {/* end flex-container */}
                </header>
            </div>
        );
    }


}
export default App;