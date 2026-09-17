// EmailJS — sends enquiries from the contact form on index.html and the service pages.
(function () {
    if (typeof emailjs === 'undefined') return;
    emailjs.init("ps8MLonoRH5kjqz7S");
})();

var TM_SERVICE_ID = "service_h6u79mw";
var TM_TEMPLATE_ID = "template_1d0u42b";
var tmSending = false;

function tmGetStatusEl(form) {
    var el = document.getElementById('form-status');
    if (!el && form) {
        el = document.createElement('p');
        el.id = 'form-status';
        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', 'polite');
        el.className = 'text-sm font-semibold text-center pt-1';
        form.appendChild(el);
    }
    return el;
}

function tmSetStatus(form, message, ok) {
    var el = tmGetStatusEl(form);
    if (!el) { if (message) window.alert(message); return; }
    el.textContent = message || '';
    el.style.color = ok ? '#15803d' : '#b91c1c';
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
    var problem = null;
    var focusEl = null;
    if (!name) { problem = 'Please enter your name.'; focusEl = nameEl; }
    else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { problem = 'Please enter a valid email address.'; focusEl = emailEl; }
    else if (mobile.replace(/[^0-9]/g, '').length < 7) { problem = 'Please enter a valid mobile number.'; focusEl = mobileEl; }
    else if (!message) { problem = 'Please tell us a little about your project.'; focusEl = messageEl; }

    if (problem) {
        tmSetStatus(form, problem, false);
        if (focusEl) focusEl.focus();
        return;
    }

    var slotField = document.getElementById('preferred-slot');
    var slot = (slotField && slotField.value) ? slotField.value : 'No preference given';

    var btn = document.getElementById('confirm-booking-btn') ||
              (form && form.querySelector('button[onclick*="sendEmail"]'));
    var originalLabel = btn ? btn.textContent : '';

    tmSending = true;
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    tmSetStatus(form, 'Sending your enquiry...', true);

    emailjs.send(TM_SERVICE_ID, TM_TEMPLATE_ID, {
        name: name,
        email: email,
        mobile: mobile,
        message: message,
        preferred_slot: slot
    }).then(function () {
        tmSending = false;
        if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
        if (form) form.reset();
        if (slotField) slotField.value = '';
        tmSetStatus(form, 'Thanks! Your enquiry has been sent. We usually reply within one business day.', true);
    }, function () {
        tmSending = false;
        if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
        tmSetStatus(form, 'Sorry, that did not send. Please try again, or email contact.trainhead@gmail.com directly.', false);
    });
}
