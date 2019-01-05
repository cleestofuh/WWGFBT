import React, { Component } from 'react';

class SeeAllNearby extends Component {
	constructor(props) {
		super(props);
		this.shops = props.shops;
		this.getStarImages = props.getStarImages;
	}

    componentDidMount() {
        this.createSeeAllNearby(this.shops, this.getStarImages);
    }

    // Helper function to create See all nearby modal
    createSeeAllNearby(shops, getStarImages) {
        let div = document.getElementById("seeAllScroller");
        // Clears the previous contents of the scroller
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        // Update the value of results
        let results = document.getElementById("seeAllContentResults")
        let numOfShops = shops.data.length;
        results.innerHTML = "Results ("+numOfShops+")";

        // Loop through nearby shops to add data to scroller contents 
        for (let i = 0; i < numOfShops; i++) {
            let name = shops.data[i].name;
            let rating = shops.data[i].rating;
            let url = shops.data[i].url;

            let entry = document.createElement('div');
            entry.className = "see-all-entry"

            // Create clickable name element in its own line
            let line = document.createElement('p');
            let shop = document.createElement('a');
            line.className = "see-all-entry-container"
            shop.className = "clickable see-all-entry-name";
            shop.href = url;
            shop.target = "_blank";
            shop.innerHTML = name;
            line.appendChild(shop);
            entry.appendChild(line);

            // Grab stars img and apply to entry
            let stars = document.createElement('img');
            stars.className = "clickable see-all-entry-stars";
            stars.alt = "yelp rating";
            stars.onclick = function(){window.open(url)};
            stars.src = getStarImages(rating);
            entry.appendChild(stars);

            // Adds dividers in between entries
            if (i < numOfShops-1) {
                let divider = document.createElement('hr');
                divider.className = "entry-divider";
                entry.appendChild(divider);
            }
            div.appendChild(entry);
        }
    }

    // Turns modal on or off
    setModal(on) {
        let modal = document.getElementById('seeAllModal')
        if (on) {
            modal.style.display = "block"
        } else {
            modal.style.display = "none"
        }
    }

    // Closes see all nearby modal on clicking outside of modal
    checkExitModalOnClick(event) {
        let modal = document.getElementById('seeAllModal');
        let x = document.getElementsByClassName("close")[0];
        if (event.target === modal || event.target === x) {
            modal.style.display = "none";
        }
    }

    render() {
    	return (
            <div id="seeAllModal" onClick={this.checkExitModalOnClick} className="see-all">
                <div className="see-all-content">
                    <span className="clickable close" onClick={() => { this.setModal(false); }}>&times;</span>
                    <h1 className="see-all-content-header">All nearby bubble tea spots</h1>
                    <p id="seeAllContentResults"></p>
                    <div id="seeAllScroller">

                    </div>
                    <button type="button" id="closeButton" className='clickable close-btn brown-btn' onClick={() => { this.setModal(false); }}>Close</button>
                </div>
            </div>
        );
    }
}

export default SeeAllNearby;