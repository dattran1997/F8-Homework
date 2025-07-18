document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.container');
    const slideContainer = document.querySelector('.slide-container');
    const indicator = document.querySelector('.indicator');

    let currentSlide = 0;
    const slides = [
        { src: "../images/1.jpg" },
        { src: "../images/2.jpg" },
        { src: "../images/3.jpg" },
    ];
    let moveDistance = 0;  //currentSlide: 1, moveDistance: -100
    const firstSlideIndex = 0;
    const lastSlideIndex = slides.length - 1;
    let isTransitioning = false; // Add flag to prevent multiple clicks during transition

    // Function to update active indicator
    const updateIndicator = () => {
        const indicatorItems = document.querySelectorAll('.indicator-item');
        indicatorItems.forEach((item, index) => {
            if (index === currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // Function to handle indicator clicks
    const handleIndicatorClick = (targetSlide) => {
        if (isTransitioning || targetSlide === currentSlide) return;

        isTransitioning = true;

        // Calculate the distance to move
        const slideDifference = targetSlide - currentSlide;
        const newMoveDistance = moveDistance - (slideDifference * 100);

        // Update current slide
        currentSlide = targetSlide;
        moveDistance = newMoveDistance;

        // Move the slide
        moveSlide();

        // Update indicator
        updateIndicator();

        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    };

    const handleContainerClick = (event) => {
        const previousButton = event.target.closest('.previous-btn');
        const nextButton = event.target.closest('.next-btn');
        const indicatorItem = event.target.closest('.indicator-item');

        // Handle indicator clicks
        if (indicatorItem) {
            const indicatorItems = document.querySelectorAll('.indicator-item');
            const clickedIndex = Array.from(indicatorItems).indexOf(indicatorItem);
            handleIndicatorClick(clickedIndex);
            return;
        }

        // Prevent multiple clicks during transition
        if (isTransitioning) return;

        // debugger;

        if (previousButton) {

            if (currentSlide > firstSlideIndex) {
                // currentSlide--;

                // 1 ---> 0 : 0
                // 2 ---> 1 : 1
                // 3 ---> 2 : 2

                // first slide not move & note decrease slide
                moveDistance = moveDistance + 100;
                currentSlide--;

                // move
                moveSlide();
                updateIndicator();
                return;
            }

            if (currentSlide === firstSlideIndex) {
                // Create smooth transition from first to last slide
                isTransitioning = true;

                // Move to the previous position (which will be a cloned last slide)
                moveDistance = moveDistance + 100;
                moveSlide();

                // After transition completes, reset to last slide without animation
                setTimeout(() => {
                    // Disable transition temporarily
                    slideContainer.style.transition = 'none';

                    // Reset to last slide position
                    moveDistance = -(lastSlideIndex + 1) * 100;
                    currentSlide = lastSlideIndex;
                    moveSlide();

                    // Re-enable transition after a brief moment
                    setTimeout(() => {
                        slideContainer.style.transition = '';
                        isTransitioning = false;
                    }, 10);
                }, 1000); // Match this with your CSS transition duration

                updateIndicator();
                return;
            }
        }

        if (nextButton) {
            debugger;
            if (currentSlide < lastSlideIndex) {
                // currentSlide++;

                // 0 --- 1: 1
                // 1 --- 2: 2
                // 2 --- 3: 3

                // last slide not move & not increase
                moveDistance = moveDistance - 100;
                currentSlide++;

                moveSlide();
                updateIndicator();
                return;
            }

            if (currentSlide === lastSlideIndex) {
                // Create smooth transition from last to first slide
                isTransitioning = true;

                // Move to the next position (which will be a cloned first slide)
                moveDistance = moveDistance - 100;
                moveSlide();

                // After transition completes, reset to first slide without animation
                setTimeout(() => {
                    // Disable transition temporarily
                    slideContainer.style.transition = 'none';

                    // Reset to first slide position
                    moveDistance = -100;
                    currentSlide = 0;
                    moveSlide();

                    // Re-enable transition after a brief moment
                    setTimeout(() => {
                        slideContainer.style.transition = '';
                        isTransitioning = false;
                    }, 10);
                }, 1000); // Match this with your CSS transition duration

                updateIndicator();
                return;
            }
        }
    }

    const render = () => {
        // Create infinite scroll effect by duplicating first and last slides
        const firstSlide = slides[0];
        const lastSlide = slides[slides.length - 1];

        const slidesWithClones = [lastSlide, ...slides, firstSlide];

        const renderedSlides = slidesWithClones.map(slide => (
            `<li><img src="${slide.src}" alt=""></li>`
        )).join("");

        // Render indicators with active state for first slide
        const renderedIndicator = slides.map((slide, index) => (`
            <span class="indicator-item ${index === 0 ? 'active' : ''}">O</span>
        `)).join("");

        slideContainer.innerHTML = renderedSlides;

        // Update the existing indicator container
        const existingIndicator = document.querySelector('.indicator');
        if (existingIndicator) {
            existingIndicator.innerHTML = renderedIndicator;
        }

        // Set initial position to show the first real slide (index 1 after clone)
        moveDistance = -100;
        moveSlide();
    }

    const moveSlide = () => {
        slideContainer.style.translate = `${moveDistance}%`;
    }

    container.addEventListener('click', handleContainerClick);

    // first render
    render();
});