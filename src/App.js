import React, { Component } from 'react'
import './App.css'
import { YELP_API_URL } from './profiles/dev'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            placeholder: 'Enter City or Zip',
            category: 'bubbletea'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Handles any change & keystroke on input field
    handleChange(event) {
        this.setState({ location: event.target.value });
    }

    // Handles form submission
    handleSubmit(event) {
        this.getShopList();
        event.preventDefault();
    }

    async getShopList() {
        let response, shops

        // Checking localstorage for existence of location array
        if(window.localStorage.getItem(this.state.location)){
            shops = JSON.parse(window.localStorage.getItem(this.state.location))
        }
        else{
            // Calls API, converts to json synchronously 
            response = await fetch(`${YELP_API_URL}?category=${this.state.category}&location=${this.state.location}`)
            shops = await response.json()
            window.localStorage.setItem(this.state.location, JSON.stringify(shops))
        }

        // Error check for API response
        if (!shops.message.error) {
            this.showRandomShop(shops)
        }
        else {
            this.showErrorText()
        }
    }

    // Helper function to display a random boba shop
    showRandomShop(shops){
        // RNG number from 0 to array length
        let RNG = Math.floor(Math.random() * shops.data.length)

        // Updating result container
        let container = document.getElementById('shopNameContainer')
        let errorContainer = document.getElementById('errorText')

        errorContainer.innerHTML = ''
        container.innerHTML = shops.data[RNG].name
        container.href = shops.data[RNG].url
    }

    // Helper function to handle error condition
    showErrorText(){
        // TODO: I've created the error condition, do what you want with this part!
        let errorContainer = document.getElementById('errorText')
        errorContainer.innerHTML = 'ENTUWU A FUWUCKING PWOPWER LOCAWTUWUN'
        // console.log(shops.message.error)
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="main-header">Where we goin&rsquo;  for<br />bubble tea?</h1>

                    {/*eslint-disable-next-line*/}
                    <p className="we-out">We out to <a target="_blank" id='shopNameContainer'></a>!</p>

                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input value={this.state.location} onChange={this.handleChange} placeholder={this.state.placeholder} />
                        </label>
                        <button className='clickable brown-btn'>See where we droppin&rsquo;</button>
                    </form>

                    <p id='errorText'></p>

                </header>
            </div>
        );
    }

}
export default App;