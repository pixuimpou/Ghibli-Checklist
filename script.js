const app = document.getElementById("root");

const container = document.createElement("div");
container.classList.add("container");
app.appendChild(container);

const counter = document.getElementById("counter");
let total;

const storage = {
    get() {
        return JSON.parse(localStorage.getItem("watchedMovies")) || [];
    },

    set() {
        localStorage.setItem("watchedMovies", JSON.stringify(watcheds));
    }
}

let watcheds = storage.get();

const verifyMovie = (card) => {
    watcheds.forEach(movie => {
        if(movie === card.dataset.title) {
            card.classList.toggle("active");
            card.dataset.watched = "true";
            const checkBox = card.childNodes[0];
            const check = document.createElement("div");
            check.classList.add("check");
            checkBox.appendChild(check);
        }
    })
}

const getMovies = () => {

    fetch("https://ghibliapi.herokuapp.com/films")
        .then(response => {
            if(!response.ok) {
                throw new Error(`Ops...something went wrong: error ${response.status}, ${response.statusText}`);
            }
            return response.json()
        })
        .then(data => {
            data.forEach(movie => {
                total = data.length
                counter.innerText = `${watcheds.length}/${total}`;

                const card = document.createElement("div");
                card.classList.add("card");
                card.classList.toggle("active");
                card.setAttribute("onclick", "toggleMovie(this)");
                card.dataset.title = movie.title;
                
                container.appendChild(card);

                const checkBox = document.createElement("div");
                checkBox.classList.add("check-box");
                card.appendChild(checkBox);
                verifyMovie(card);
                const h1 = document.createElement("h1");
                h1.innerText = movie.title;
                card.appendChild(h1)
            });
        })
        .catch(err => {
            const warning = document.createElement("h1");
            warning.setAttribute("class", "warning");
            warning.textContent = err;
            container.appendChild(warning);
        })
}

const toggleMovie = (card) => {
    card.classList.toggle("active");
    const movieTitle = card.dataset.title;
    const checkBox = card.childNodes[0]
    if(!card.dataset.watched) {
        card.dataset.watched = "true";
        watcheds = [...watcheds, movieTitle];
        const check = document.createElement("div");
        check.classList.add("check");
        checkBox.appendChild(check);
        
        storage.set(watcheds);
    } else {
        card.removeAttribute("data-watched");
        card.childNodes[0].childNodes[0].remove();
        for(let i = 0; i < watcheds.length; i++) {
            let movie = watcheds[i];
            if(movieTitle == movie){
                watcheds.splice(i, 1);        
            }
            storage.set(watcheds);
        }
    }
    counter.innerText = `${watcheds.length}/${total}`;
}



    getMovies();


