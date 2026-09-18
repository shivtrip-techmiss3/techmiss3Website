// Contact form -> EmailJS. Used by index.html and the three service pages.
var TM_PUBLIC_KEY = "DoUP9lSL9aiQN2bKR";
var TM_SERVICE_ID = "service_h6u79mw";
var TM_TEMPLATE_ID = "template_1d0u42b";
var TM_INBOX = "contact.trainhead@gmail.com";
var TM_COOLDOWN_MS = 30000;

var tmSending = false;
var tmLastSentAt = 0;

(function () {
    if (typeof emailjs !== 'undefined') emailjs.init(TM_PUBLIC_KEY);
})();

function tmStatus(form, message, ok) {
    var el = document.getElementById('form-status');
    if (!el && form) {
        el = document.createElement('p');
        el.id = 'form-status';
        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', 'polite');
        el.className = 'text-sm font-semibold text-center pt-1';
        form.appendChild(el);
    }
    if (!el) return;
    el.textContent = message || '';
    el.style.color = ok ? '#16a34a' : '#dc2626';
}

// Rate limits (429), provider outages (5xx) and dropped connections are worth one more try.
// Configuration errors (400/404) are not: retrying would fail the same way.
function tmIsRetryable(err) {
    var s = err && typeof err.status === 'number' ? err.status : 0;
    return s === 0 || s === 429 || s >= 500;
}

function tmSendWithRetry(params) {
    return emailjs.send(TM_SERVICE_ID, TM_TEMPLATE_ID, params).catch(function (err) {
        if (!tmIsRetryable(err)) throw err;
        return new Promise(function (resolve) { setTimeout(resolve, 1500 + Math.random() * 1500); })
            .then(function () { return emailjs.send(TM_SERVICE_ID, TM_TEMPLATE_ID, params); });
    });
}


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

    clinic:
        form.querySelector("#demo_clinic")?.value ||
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
