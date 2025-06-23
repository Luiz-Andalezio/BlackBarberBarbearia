document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const leftArrow = document.querySelector(".carousel-arrow.left");
    const rightArrow = document.querySelector(".carousel-arrow.right");
    const slidesContainer = document.querySelector(".slides");
    let currentSlide = 0;
    let intervalId = null;
    let startX = null;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));
        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            resetInterval();
        });
    });

    if (leftArrow) leftArrow.addEventListener("click", () => { prevSlide(); resetInterval(); });
    if (rightArrow) rightArrow.addEventListener("click", () => { nextSlide(); resetInterval(); });

    // mouse drag/swipe
    slidesContainer.addEventListener("mousedown", (e) => {
        startX = e.clientX;
    });
    slidesContainer.addEventListener("mouseup", (e) => {
        if (startX === null) return;
        let diff = e.clientX - startX;
        if (diff > 50) {
            prevSlide();
            resetInterval();
        } else if (diff < -50) {
            nextSlide();
            resetInterval();
        }
        startX = null;
    });
    // touch support (mobile)
    slidesContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });
    slidesContainer.addEventListener("touchend", (e) => {
        if (startX === null) return;
        let endX = e.changedTouches[0].clientX;
        let diff = endX - startX;
        if (diff > 50) {
            prevSlide();
            resetInterval();
        } else if (diff < -50) {
            nextSlide();
            resetInterval();
        }
        startX = null;
    });

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 10000);
    }

    intervalId = setInterval(nextSlide, 10000);
});