const container = document.querySelector('.container');
const slideContainer = document.querySelector('.slide-container');
let currentSlide = 0;
const slides = [
    { src: "../images/1.jpg" },
    { src: "../images/2.jpg" },
    { src: "../images/3.jpg" }
];
let moveDistance = 0;  //currentSlide: 1, moveDistance: -100
const firstSlideIndex = 0;
const lastSlideIndex = slides.length - 1;


const handleContainerClick = (event) => {
    const previousButton = event.target.closest('.previous-btn');
    const nextButton = event.target.closest('.next-btn');

    if (previousButton) {
        if (currentSlide >= firstSlideIndex) {
            // currentSlide--;

            // 1 ---> 0 : 0
            // 2 ---> 1 : 1
            // 3 ---> 2 : 2

            // first slide not decrease the slide

            if (currentSlide === firstSlideIndex) {
                moveDistance = -1 * currentSlide * 100;
            } else {
                moveDistance = -1 * --currentSlide * 100;
            }

            slideContainer.style.translate = `${moveDistance}%`;
        }
    }

    if (nextButton) {
        if (currentSlide <= lastSlideIndex) {
            // currentSlide++;

            // 0 --- 1: 1
            // 1 --- 2: 2
            // 2 --- 3: 3

            // last slide not increase slide 
            if (currentSlide === lastSlideIndex) {
                moveDistance = -1 * currentSlide * 100;
            } else {
                moveDistance = -1 * ++currentSlide * 100;
            }

            slideContainer.style.translate = `${moveDistance}%`;
        }
    }
}

const render = () => {
    const renderedSlides = slides.map(slide => (
        `<li><img src="${slide.src}" alt=""></li>`
    )).join("");

    slideContainer.innerHTML = renderedSlides;
}

container.addEventListener('click', handleContainerClick);

// first render
render();