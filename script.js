// Slideshow logic
let slideIndex = 1;
let timer;
showSlides(slideIndex);

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].className += " active";
    timer = setTimeout(() => { showSlides(slideIndex += 1); }, 5000); // 5 seconds per slide
}

function pauseSlides() {
    clearTimeout(timer);
}

function resumeSlides() {
    timer = setTimeout(() => { showSlides(slideIndex += 1); }, 5000);
}

// EmailJS setup - Replace with your own EmailJS details
emailjs.init("DoUP9lSL9aiQN2bKR");

function sendEmail() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const message = document.getElementById('message').value;

    emailjs.send("service_h6u79mw", "template_1d0u42b", {
        name: name,
        email: email,
        mobile: mobile,
        message: message
    }).then(function(response) {
        alert('Email sent successfully!');
    }, function(error) {
        alert('Failed to send email. Please try again.');
    });
}