// import * as Carousel from "./Carousel.js";
// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");  // place inside the function, guarantee that the element is obtained when the function is called, which is typically after the HTML has been loaded, preventing the "TypeError: null is not an object (evaluating 'breedSelect.appendChild')" error.
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_EellOTjtNVybqKeQCOonBZ4M1Iqr3FQfvqTjAcUI8KKjkxkEcWYiwOMKnyhBYPOL";


// from Carousel.js ------------
// import * as bootstrap from "bootstrap";
// import { favourite } from "./index.js";

function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.addEventListener("click", () => {
    favourite(imgId);
  });

  return clone;
}

function clear() {
  const carousel = document.querySelector("#carouselInner");
  while (carousel.firstChild) {
    carousel.removeChild(carousel.firstChild);
  }
}

function appendCarousel(element) {
  const carousel = document.querySelector("#carouselInner");

  const activeItem = document.querySelector(".carousel-item.active");
  if (!activeItem) element.classList.add("active");

  carousel.appendChild(element);
}

function start() {
  const multipleCardCarousel = document.querySelector(
    "#carouselExampleControls"
  );
  if (window.matchMedia("(min-width: 768px)").matches) {
    const carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false
    });
    const carouselWidth = $(".carousel-inner")[0].scrollWidth;
    const cardWidth = $(".carousel-item").width();
    let scrollPosition = 0;
    $("#carouselExampleControls .carousel-control-next").unbind();
    $("#carouselExampleControls .carousel-control-next").on(
      "click",
      function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
    $("#carouselExampleControls .carousel-control-prev").unbind();
    $("#carouselExampleControls .carousel-control-prev").on(
      "click",
      function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
  } else {
    $(multipleCardCarousel).addClass("slide");
  }
}


/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
// const breedsUrl = 'https://api.thecatapi.com/v1/breeds';

// async function initialLoad() {
//   try {
//     const response = await fetch(breedsUrl);

//     if (!response.ok) {
//       throw new Error('Failed to retrieve breeds.')
//     }

//     const breeds = await response.json();
//     const breedSelect = document.getElementById("breedSelect");  // place inside the function, guarantee that the element is obtained when the function is called, which is typically after the HTML has been loaded, preventing the "TypeError: null is not an object (evaluating 'breedSelect.appendChild')" error.

//     breeds.forEach((breed) => {
//       const option = document.createElement('option');
//       option.value = breed.id;
//       option.textContent = breed.name;
//       breedSelect.appendChild(option);
//     });
//   } catch(error) {
//     console.error('Error', error);
//   }
// }

// initialLoad();


/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
const breedsUrl = 'https://api.thecatapi.com/v1/breeds';

async function initialLoad() {
  try {
    const response = await fetch(breedsUrl, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve breeds.')
    }

    const breeds = await response.json();
    // const breedSelect = document.getElementById("breedSelect");  // Place inside the function, guarantee that the element is obtained when the function is called, which is typically after the HTML has been loaded, preventing the "TypeError: null is not an object (evaluating 'breedSelect.appendChild')" error.

    // console.log(breeds);
    breeds.forEach((breed) => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
      // console.log(option)
    });

    // console.log(breedSelect)

    // Create event handler for breedSelect
    breedSelect.addEventListener('change', async(e) => {
      const selectBreedId = e.target.value;
      await retrieveBreedInfo(selectBreedId, breeds);
      // console.log(selectBreedId)
    });

    // console.log(breedSelect.value)
    retrieveBreedInfo(breedSelect.value, breeds);  // as a default

  } catch(error) {
    console.error('Error', error);
  }
}

initialLoad();

async function retrieveBreedInfo(breedId, breeds) {
  const selectBreedInfo = breeds.find(breed => breed.id === breedId)
  // console.log(selectBreedInfo)

  const breedImgUrl = `https://api.thecatapi.com/v1/images/search?limit=100&breed_ids=${breedId}&api_key=${API_KEY}`;
  const startTime = new Date();
  const response = await fetch(breedImgUrl, {
    headers: {
      metadata: { startTime }
    }
  }); 

  if (!response.ok) {
    throw new Error('Failed to retrieve breed information.');
  }

  const breedImg = await response.json();
  // console.log(breedImg)

  const carouselInner = document.getElementById('carouselInner');
  // const inforDump = document.getElementById('infoDump')

  // Clear exisiting carousel and infoDump content
  carouselInner.innerHTML = "";
  infoDump.innerHTML = "";

  // create a div to hold carousel items
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  // For each carousel with breed images
  breedImg.forEach((info, index) => {
    const img = document.createElement('img');
    img.src = info.url;
    img.classList.add('carousel-image');
    img.alt = 'breed image';
    img.style.display = index === 0 ? 'block' : 'none';  // show 1st image, hide others

    imageContainer.appendChild(img);
    
  });

  carouselInner.appendChild(imageContainer);

  // show/hide previous and next buttons
  const prevButton = document.querySelector('.carousel-control-prev');
  const nextButton = document.querySelector('.carousel-control-next');

  let currentIndex = 0;

  prevButton.addEventListener('click', () => {
    showImage(currentIndex - 1);
  })

  nextButton.addEventListener('click', () => {
    showImage(currentIndex + 1);
  })

  function showImage(index) {
    const images = document.querySelectorAll('.carousel-image');
    if (index < 0) {
      index = images.length - 1; 
    } else if (index >= images.length) {
      index = 0;
    }

    images.forEach((image, i) => {
      image.style.display = i === index ? 'block' : 'none';
    });

    currentIndex = index;
  }

  // Create information session within the infoDump element.
  const infoDumpContent = `
    <h2>${selectBreedInfo.name}</h2>
    <p><strong>Description:</strong> ${selectBreedInfo.description}</p>
    <p><strong>Temperament:</strong> ${selectBreedInfo.temperament}</p>
    <p><strong>Origin:</strong> ${selectBreedInfo.origin}</p>
    <p><strong>Life span:</strong> ${selectBreedInfo.life_span}</p>
    <p><strong>Its wikipedia page:</strong> ${selectBreedInfo.wikipedia_url}</p>
  `;
  infoDump.innerHTML = infoDumpContent;

}

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
