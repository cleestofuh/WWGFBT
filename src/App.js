import React, { Component } from 'react'
import './App.css'
import { YELP_API_URL } from './profiles/dev'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      placeholder: 'Enter City or Zip'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({location: event.target.value});
  }

  handleSubmit(event) {
    this.getShopList();
    event.preventDefault();
  }

  async getShopList(){
    let response = await fetch(YELP_API_URL + '/bubbletea/' + this.state.location)

    console.log('location: ' + this.state.location)

    let shops = await response.json()

    console.log('results: ' + shops.data.length)

    let RNG = Math.floor(Math.random() * shops.data.length)

    let container = document.getElementById('shopNameContainer')
    container.innerHTML = shops.data[RNG].name
    container.href = shops.data[RNG].url      
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 class="main-header">Where we goin&rsquo;  for<br/>bubble tea?</h1>
          <p class="we-out">We out to <a target="_blank" id='shopNameContainer'></a>!</p>

          <form onSubmit={this.handleSubmit}>
            <label>
              <input value={this.state.location} onChange={this.handleChange} placeholder={this.state.placeholder}/>
            </label>
            <button className='clickable brown-btn'>See where we droppin&rsquo;</button>
          </form>

        </header>
      </div>
    );
  }

}
export default App;

