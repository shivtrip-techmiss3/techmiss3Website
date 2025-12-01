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

// EmailJS setup
emailjs.init("DoUP9lSL9aiQN2bKR");

// UNIVERSAL EMAIL FUNCTION
function sendEmail(formId = "contact-form") {
    const form = document.getElementById(formId);
    if (!form) {
        alert("Form not found!");
        return;
    }

   const params = {
    name:
        form.querySelector("#name")?.value ||
        form.querySelector("#fullName")?.value ||
        form.querySelector("#demo_name")?.value ||
        "Not Provided",

    email:
        form.querySelector("#email")?.value ||
        form.querySelector("#userEmail")?.value ||
        form.querySelector("#demo_email")?.value ||
        "Not Provided",

    mobile:
        form.querySelector("#mobile")?.value ||
        form.querySelector("#phone")?.value ||
        form.querySelector("#demo_phone")?.value ||
        "Not Provided",

    message:
        form.querySelector("#message")?.value ||
        form.querySelector("#msg")?.value ||
        form.querySelector("#demo_message")?.value ||
        "No message provided",

    subject:
        form.querySelector("#position")?.value ||
        "Demo Request"
};


    emailjs
        .send("service_h6u79mw", "template_1d0u42b", params)
        .then(() => {
            alert("Message sent successfully!");

            // ⭐ FIX: Reset the EXACT form that was submitted
            form.reset();
        })
        .catch(() => {
            alert("Failed to send email. Please try again.");
        });
}
