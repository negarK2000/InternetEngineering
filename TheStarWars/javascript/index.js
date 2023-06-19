//url of all movies we want to display in order
var movies_list = [`https://swapi.dev/api/films/4`, `https://swapi.dev/api/films/5`,
    `https://swapi.dev/api/films/6`, `https://swapi.dev/api/films/1`,
    `https://swapi.dev/api/films/2`, `https://swapi.dev/api/films/3`];

//our two pages
var home_page = document.getElementById('background_image');
var starships_page = document.getElementById('starship_background_image');

//fetching movie's name and date and episode and displaying it in html file
function getMovies(movie_url, el) {

    fetch(movie_url).then((data)=>{
        return data.json();
    }).then((completeData)=>{
        let movie = `Star Wars: ${completeData.title} - EPISODE ${completeData.episode_id} - ${completeData.release_date}`;
        el.innerHTML = movie;

    }).catch((error)=>{
        console.log(error);
    });
}

//first page - movies list
var movies_list_elements = document.getElementById("movie_list").getElementsByTagName("li");

//fetching each movie data
for(let i = 0; i < movies_list.length ; i++){
    getMovies(movies_list[i], movies_list_elements[i]);
}

//first page - starships buttons
var starships_buttons = document.getElementById('Starships_buttons').getElementsByClassName('button');
//second page - the two side lists
var starships_list_element = document.getElementById('starships_list').getElementsByTagName('ul');
var starships_prop_list = document.getElementById('starship_properties_list');

//adding event listener for al the starships buttons
for(let i = 0; i < starships_buttons.length ; i++){
    starships_buttons[i].addEventListener('click', evt => {
        getStarships(evt);
    });
}

//for saving the starships properties so that later on we can display them in multi pages
var starships_props = [];
//for managing properties pages
var property_pages = 0;
var page_num = 0;
//number of properties we want to be displayed in each page
const each_page = 5;

//fetching a movie's starships list on clicking the button and adding event listener to all of the starships
async function getStarships(event) {
    home_page.style.display = 'none';
    starships_page.style.display = 'block';

    var starships_objects = [];

    let movie_url = movies_list[event.target.name];
    let movie = await fetchContent(movie_url);
    let starships_list = movie.starships;

    let starships = '';
    for(let i = 0; i < starships_list.length ; i++ ){
        let starship = await fetchContent(starships_list[i]);
        starships += `<li><input type="submit" value="${starship.name}" name=${i}></li>`;

        starships_objects[i] = starship;
    }

    starships_list_element[0].innerHTML = starships;
    let starship_links = starships_list_element[0].getElementsByTagName('input');

    for(let j = 0; j < starship_links.length; j++){
        starship_links[j].addEventListener('click', evt => {
            property_pages = 0;
            page_num = 0;
            starships_props = [];
            let id = evt.target.name;

            getStarshipProp(starships_objects[id]);
            displayProperties();
        });
    }
}

//fetching each starship's details on clicking the starship's name
//the properties that are unknown have been removed because they didn't have any information for us
//the last url properties that was a link to the current properties was also removed since there wasn't any need for it
//all the other properties that had url values were fetched and their name was displayed
async function getStarshipProp(starships_object){
    let iter = 0;

    for(let i = 0; i < Object.keys(starships_object).length ; i++){
        let keyName = Object.keys(starships_object)[i];
        let valueName = Object.getOwnPropertyDescriptor(starships_object, keyName).value;

        if (!valueName.toString().includes("unknown") && !keyName.toString().includes("url")){

            if (Array.isArray(valueName)){

                let newValue = "";
                for (let j = 0; j < valueName.length; j++) {
                    let res = await fetchContent(valueName[j]);
                    let resName = Object.getOwnPropertyDescriptor(res, Object.keys(res)[0]).value;
                    newValue += resName + ", ";
                }

                if(newValue !== ""){
                    starships_props[iter] = "<li>" + keyName.toString() + ": " + newValue + "</li>";
                    iter++;
                }
            }
            else {
                if (valueName.toString().includes("http")){
                    let newValue = await fetchContent(valueName);
                    let resName = Object.getOwnPropertyDescriptor(newValue, Object.keys(newValue)[0]).value;
                    starships_props[iter] = "<li>" + keyName.toString() + ": " + resName + "</li>";

                } else
                    starships_props[iter] = "<li>" + keyName.toString() + ": " + valueName.toString() + "</li>";

                iter++;
            }
        }
    }

    starships_prop_list.style.display = 'block';

    property_pages = Math.ceil(iter / each_page);
}

//displaying the starship's details/properties in html file based on the current page we are
function displayProperties(){
    let props = '';
    let iter = each_page * page_num;

    for(let i = 0; i < each_page ; i++){

        if (i + iter < starships_props.length)
            props += starships_props[i + iter];
        else
            break
    }

    starships_prop_list.getElementsByTagName('ul')[0].innerHTML = props;
    starships_prop_list.getElementsByTagName('h4')[0].innerHTML = '. Page ' + (page_num + 1).toString() + ' .';
}

//fetching data from the given url and returning it
async function fetchContent(url) {
    try {
        let res = await fetch(url);
        return await res.json();

    } catch (error) {
        console.log(error);
    }
}

//adding event listener for the home button in second page for returning to the first/home page
var home_btn = document.getElementsByClassName('nav_button')[0].getElementsByTagName('input')[0];

home_btn.addEventListener('click', () => {

    home_page.style.display = 'block';
    starships_page.style.display = 'none';
    starships_prop_list.style.display = 'none';
});

//adding event listener for the next and previous button in second page, property list of the starship
var nav_btns = document.getElementsByClassName('nav_button')[1].getElementsByTagName('input');

//changing the page and displaying the properties again
for(let i = 0; i < nav_btns.length ; i++){
    nav_btns[i].addEventListener('click', () => {

        if (nav_btns[i].name === 'back'){
            if(page_num - 1 >= 0) {
                page_num--;
                displayProperties();
            }

        } else if (nav_btns[i].name === 'next'){
            if(page_num + 1 < property_pages) {
                page_num++;
                displayProperties();
            }
        }
    });
}
