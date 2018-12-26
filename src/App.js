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
          <p onClick={() => this.getShopList()} className='clickable'>
            FIND ME SOME FUCKING BOBA
          </p>
          <a target='_blank' id='shopNameContainer'></a>
        </header>
      </div>
    );
  }
}

export default App;
