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
    document.querySelector(".preferencesDiv").addEventListener("click", showOverlay);
    document.querySelector(".cancelButton").addEventListener("click", hideOverlay);
    document.querySelector(".overlay").addEventListener("click", hideOverlay);
    document.querySelector(".saveButton").addEventListener("click", ev => {
        //        let videoList = document.getElementsByName("video");
        //        let videoType = null;
        //        for (let i = 0; i < videoList.length; i++) {
        //            if (videoList[i].checked) {
        //                videoType = videoList[i].value;
        //                break;
        //            }
        //        }
        //        if (document.querySelector(".modal-radio").value = tv) {
        //            document.querySelector("#initialH1").textContent = "TV Series Recommendations";
        //        } else if (document.querySelector(".modal-radio").value = movie) {
        //            document.querySelector("#initialH1").textContent = "Movie Recommendations";
        //        }
    });
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
    } else {
        // this is a new search so you should reset any exisiting page data

        getSearchResults();
    }
}

function getSearchResults() {

    let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createPage(data);
        })
        .catch(error => alert(error));
}

function showOverlay(ev) {
    ev.preventDefault();
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("hide");
    overlay.classList.add("show");
    showModalWindow(ev);
}

function showModalWindow(ev) {
    ev.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("off");
    modal.classList.add("on");
}

function hideOverlay(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("show");
    overlay.classList.add("hide");
    hideModalWindow(ev);
}

function hideModalWindow(ev) {
    ev.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.remove("on");
    modal.classList.add("off");
}

function createPage(data) {
    let content = document.querySelector("#search-results>.content");
    let contentTitle = document.querySelector("#search-results>.title");

    let message = document.createElement("h2");
    content.innerHTML = "";
    contentTitle.innerHTML = "";

    if (data.total_results == 0) {
        message.textContent = `No results found for ${searchString}`;
    } else {
        message.textContent = `Showing results 1-${data.results.length} of ${data.total_results} for ${searchString}`;

    }
    document.querySelector("#search-results").classList.remove("page");
    document.querySelector("#initial-page").classList.add("page");
    contentTitle.appendChild(message);

    let documentFragment = new DocumentFragment();

    documentFragment.appendChild(createMovieCards(data.results));

    content.appendChild(documentFragment);

    let cardList = document.querySelectorAll(".content>div");
    cardList.forEach(card => {
        card.addEventListener("click", getRecommendations);
    })
}

function createMovieCards(results) {

    let documentFragment = new DocumentFragment();
    results.forEach(movie => {
        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let videoTitle = document.createElement("h4");
        let videoDate = document.createElement("p");
        let videoRating = document.createElement("p");
        let videoOverview = document.createElement("p");

        videoTitle.textContent = movie.title;
        videoDate.textContent = movie.release_date;
        videoRating.textContent = movie.vote_average;
        videoOverview.textContent = movie.overview;

        image.src = `${imageURL}${imageSizes[2]}${movie.poster_path}`;

        movieCard.setAttribute("data-title", movie.title);
        movieCard.setAttribute("data-id", movie.id);

        movieCard.className = "movieCard";
        section.className = "imageSection";

        section.appendChild(image);
        movieCard.appendChild(section);
        movieCard.appendChild(videoTitle);
        movieCard.appendChild(videoDate);
        movieCard.appendChild(videoRating);
        movieCard.appendChild(videoOverview);

        documentFragment.appendChild(movieCard);
    });

    return documentFragment;
}

function getRecommendations() {
    let movieTitle = this.getAttribute("data-title");
    searchString = movieTitle;
    let movieID = this.getAttribute("data-id")
    
    let url = `${movieDataBaseURL}movie/${movieID}/recommendations?api_key=${APIKEY}`
    fetch(url)
    .then(response => response.json())
    .then(data => {
        createPage(data);
    })
}




