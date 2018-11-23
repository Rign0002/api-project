/***************************************************************************
Filename: main.js
Author: Justin Rignault
Description: main javascript file linked to index.html for api project
Date: Nov 12 2018
***************************************************************************/

/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/"
let imageURL = null;
let imageSizes = [];
let searchString = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
    addEventListeners();
    getDataFromLocalStorage();
    let searchBar = document.querySelector("#search-input");
    searchBar.focus();



}

function addEventListeners() {
    let searchButton = document.querySelector(".searchButtonDiv");
    searchButton.addEventListener("click", startSearch);
}

function getDataFromLocalStorage() {
    // Check if image secure base url and sizes array are saved in local storage, if not call getPosterURLAndSizes()

    // If in local storage, check if saved over 60 minutes ago, if true call getPosterURLAndSizes()

    //in local storage and < 60 minutes old, load and use from local storage
    getPosterURLAndSizes();
}

function getPosterURLAndSizes() {
    let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`;

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            imageURL = data.images.secure_base_url;
            imageSizes = data.images.poster_sizes;
            console.log(imageURL);
            console.log(imageSizes);
        })
        .catch(error => {
            console.log(error);
        })
}

function startSearch() {
    searchString = document.querySelector("#search-input").value;
    if (!searchString) {
        alert("Please input something in the search bar.");
        document.querySelector("#search-input").focus();
        return;
    }

    // this is a new search so you should reset any exisiting page data

    getSearchResults();
}

function getSearchResults() {

    let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => alert(error));
}
