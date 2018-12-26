import React, { Component } from 'react'
import './App.css'
import { YELP_API_URL } from './profiles/dev'

class App extends Component {

  async getShopList(){
    let response = await fetch(YELP_API_URL + '/boba/San Jose')
    let shops = await response.json()

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
          <p onClick={() => this.getShopList()} className='clickable brown-btn'>
            See where we goin&rsquo;</p>
        </header>
      </div>
    );
  }
}

export default App;
