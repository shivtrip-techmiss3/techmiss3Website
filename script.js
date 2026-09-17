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

function sendEmail() {
    if (tmSending) return;

    var form = document.getElementById('contact-form');
    var nameEl = document.getElementById('name');
    var emailEl = document.getElementById('email');
    var mobileEl = document.getElementById('mobile');
    var messageEl = document.getElementById('message');
    if (!nameEl || !emailEl || !mobileEl || !messageEl) return;

    var name = nameEl.value.trim();
    var email = emailEl.value.trim();
    var mobile = mobileEl.value.trim();
    var message = messageEl.value.trim();

    // The submit button is type="button", so browser validation never runs. Validate here.
    var problem = null, focusEl = null;
    if (!name) { problem = 'Please enter your name.'; focusEl = nameEl; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { problem = 'Please enter a valid email address.'; focusEl = emailEl; }
    else if (mobile.replace(/[^0-9]/g, '').length < 7) { problem = 'Please enter a valid mobile number.'; focusEl = mobileEl; }
    else if (!message) { problem = 'Please tell us a little about your project.'; focusEl = messageEl; }
    if (problem) {
        tmStatus(form, problem, false);
        if (focusEl) focusEl.focus();
        return;
    }

    if (Date.now() - tmLastSentAt < TM_COOLDOWN_MS) {
        tmStatus(form, 'Your enquiry was just sent. Please wait a moment before sending another.', true);
        return;
    }

    // Ad blockers and flaky networks can stop the EmailJS library from loading at all.
    if (typeof emailjs === 'undefined') {
        tmStatus(form, 'Our form could not load. Please email us at ' + TM_INBOX + ' instead.', false);
        return;
    }

    var btn = document.getElementById('confirm-booking-btn') ||
              (form && form.querySelector('button[onclick*="sendEmail"]'));
    var label = btn ? btn.textContent : '';

    tmSending = true;
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    tmStatus(form, 'Sending your enquiry...', true);

    tmSendWithRetry({
        name: name,
        email: email,
        mobile: mobile,
        message: message,
        reply_to: email       // replies from the inbox go straight to the customer; also the EmailJS auto-reply address
    }).then(function () {
        tmLastSentAt = Date.now();
        if (form) form.reset();
        tmStatus(form, 'Thanks! Your enquiry has been sent. We usually reply within one business day.', true);
    }, function () {
        tmStatus(form, 'Sorry, that did not send. Please try again, or email ' + TM_INBOX + ' directly.', false);
    }).then(function () {
        tmSending = false;
        if (btn) { btn.disabled = false; btn.textContent = label; }
    });
}
