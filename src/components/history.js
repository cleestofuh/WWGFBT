import React, { Component } from 'react'

class History extends Component {
    constructor(props) {
        super(props);
        this.maxHistory = 5;
    }

    // Helper function to add shop+url to history
    static addShopToHistory(shop, url) {
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

    render() {
    	return (
    		<React.Fragment>
		    	<p id="history-title">History</p>
	        	<div id="historyContainer">
	        	</div>
	        </React.Fragment>
        );
    }
}

export default History