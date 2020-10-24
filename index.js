function formatNumber(num) {
//This function is responsible for formatting the json numerical data with proper commas
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

function displayNationalStats(responseJson){
//This function is responsible for displaying national Covid-19 data on the main page
    console.log('displayNationalStats ran')

//These variables are the data pulled from the Json object, but formatted with proper commas
    let newTotalCases = formatNumber(`${responseJson[0].positive}`)
    let newDeathStats = formatNumber(`${responseJson[0].death}`)
    let newRecovered = formatNumber(`${responseJson[0].recovered}`)
    let newHospitalized = formatNumber(`${responseJson[0].hospitalizedCurrently}`)

    $('#nationwide-stats').empty();
    $('#nationwide-stats').append(`
    <li class='label'>Total Cases <span class='stats-text'>${newTotalCases}</span>
    <li class='label'>Deaths <span class='stats-text'>${newDeathStats}</span>
    <li class='label'>Recovered<span class='stats-text'>${newRecovered}</span>
    <li class='label'>Hospitalized <span class='stats-text'>${newHospitalized}</span></li>
    `);
}

function getNationalData(){
//This function is responsible for calling the Covid-19 api & pulling national data
    const nationalURL = 'https://api.covidtracking.com/v1/us/current.json'
    console.log('getNationalData ran')
   fetch(nationalURL)
   .then(response => {
       if(response.ok){
           return response.json();
       }
       throw new Error(response.statusText);
   })
   .then(responseJson => displayNationalStats(responseJson))
   .catch(err => {
       $('#js-error-message').text(`Something went wrong ${err.message}`)
   })
}

function displayStateStats(responseJson){
//This function is responsible for displaying state data search results in the DOM
    console.log('displayStateStats ran')

//These variables are the data pulled from the Json object, but formatted with proper commas

let newPositive = formatNumber(`${responseJson.positive}`)
let newStateDeaths = formatNumber(`${responseJson.death}`)

    $('#results-list').empty();
    $('#results-list-heading').text(`COVID-19 STATS FOR:  ${responseJson.state}`);
    $('#results-list').append(`
    <li class='label'>Total cases <span class='stats-text'>${newPositive}</span></li>
    <li class='label'>Total deaths <span class='stats-text'>${newStateDeaths}</span>`)
    $('#results-section').removeClass('hidden');
}

function getStateData(stateCode){
//This function is responsible for calling the Covid-19 api & pulling the state data
    console.log('getStateData ran')
    
    const stateURL = `https://api.covidtracking.com/v1/states/${stateCode}/current.json`

    fetch(stateURL)
    .then(response =>{
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayStateStats(responseJson))
    .catch(err => {
        $('#results-section').removeClass('hidden');
        $('#results-list').empty();
        $('#results-list-heading').empty();
        $('#results-list').append(`<li class='instructions-text'>Something went wrong.  Make sure that you only enter the abbreviate state name, & that only lower case letters are used.  <br>(Ex. For California, enter 'ca'). <br> Thanks! ${err.message}</li>`);
    });
}


function getStateInfo(){
//This function is responsible for taking user's Covid-19 state & local info
    $('#state-search').submit(event => {
        event.preventDefault();
        console.log ('getStateInfo ran')
        const stateCode = $('#state-name').val();
        getStateData(stateCode)
    });
}

function loadMainPage(){
//This function is responsible for loading the main page once user clicks button from the landing page
    $('#landing-page').on('click', event => {
        event.preventDefault();
        console.log ('loadMainPage ran')
        $('#landing-page').addClass('hidden');
        $('.map').removeClass('hidden');
        $('#main-section').removeClass('hidden');
    })
}

//This function is responsible for calling back all functions when the page loads
function startApp() {
    console.log('startApp ran')
    loadMainPage();
    getStateInfo();
    getNationalData();
}

$(startApp)