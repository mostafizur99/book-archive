
const searchBook = () => {
    // clear-previous displayed items
    clearPrediousData('error-message');
    clearPrediousData('search-result');
    clearPrediousData('seach-number');

    const searchField = document.getElementById('search-input');
    const searchText = searchField.value;
    searchField.value = '';

    if (searchText.length > 0) {
        // turn on spinner
        document.getElementById("spinner").classList.remove("d-none");

        // fetch data 
        const url = `https://openlibrary.org/search.json?q=${searchText}`;
        fetchedData(url)
            .then(data => displaySearchResult(data));
    } else {
        document.getElementById("error-message").innerHTML =
            "<p class='text-center p-3 bg-danger'><b>Please enter a book name...</b></p>";
    }
};

// function for clearing previous data
const clearPrediousData = inputId => {
    const getField = document.getElementById(inputId);
    getField.textContent = '';
}

// function for data fetching 
const fetchedData = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
};

const displaySearchResult = data => {
    // turn off spinner
    document.getElementById("spinner").classList.add("d-none");

    const { docs, numFound } = data;

    // search-result number
    const searchResultNumber = document.getElementById('seach-number');
    if (numFound === 1) {
        searchResultNumber.innerHTML = `<span class="text-color">${numFound} result found</span>`;
    } else if (numFound > 1) {
        searchResultNumber.innerHTML = `<span class="text-color">${numFound} results found</span>`;
    } else {
        searchResultNumber.innerHTML = `<span class="text-danger">Sorry, no result found</span>`;
    }

    // showing result for 27 books 
    const searchResult = document.getElementById('search-result');
    const showedResult = docs.slice(0, 27);

    showedResult.forEach(book => {
        const { title, author_name, first_publish_year, publisher, cover_i } = book;

        // display portions with default value
        const firstPublisher = publisher?.slice(0, 1);
        const firstAuthor = author_name?.slice(0, 1);
        const loadSearch = (thumbUrl, firstAuthor = 'no author found', first_publish_year = 'no year found', firstPublisher = 'no publisher found') => {
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
                <div class="card h-100 shadow">
                    <img src="${thumbUrl}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title"><b>Book Name: <span class="text-color">${title}</span></b></h6>
                        <h6 class="card-title">Author: <span class="fst-italic text-color">${firstAuthor}</span></h6>
                        <h6 class="card-title">First published: <span class="text-color">${first_publish_year}</span></h6>
                    </div>
                    <div class="card-footer custom-bg">
                        <h6 class="card-title">Publisher: <span class="text-color">${firstPublisher}</span></h6>
                    </div>
                </div>
        `;
            searchResult.appendChild(div);
        };
        // default book-thumbnail 
        if (cover_i !== undefined) {
            const thumbUrl = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
            loadSearch(thumbUrl, firstAuthor, first_publish_year, firstPublisher);
        } else {
            const thumbUrl = './image/no-image.jpg';
            loadSearch(thumbUrl, firstAuthor, first_publish_year, firstPublisher);

        }

    });
};