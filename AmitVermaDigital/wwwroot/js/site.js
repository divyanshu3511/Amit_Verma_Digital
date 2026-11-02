// site.js - Amit Verma Digital 2.0 interactive behaviors

document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileNav.classList.toggle('d-none');
            const isExpanded = !mobileNav.classList.contains('d-none');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Language switcher handler
    const langSwitchers = document.querySelectorAll('.lang-switcher-btn');
    langSwitchers.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetLang = this.getAttribute('data-lang');
            document.cookie = `Preferred_Lang=${targetLang};path=/;max-age=${60 * 60 * 24 * 365}`;
            
            // Reload with lang param or current URL
            const url = new URL(window.location.href);
            url.searchParams.set('lang', targetLang);
            window.location.href = url.toString();
        });
    });

    // Contact form AJAX submission
    const contactForm = document.getElementById('publicContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const alertBox = document.getElementById('contactFormAlert');
            const originalBtnHtml = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;
            alertBox.classList.add('d-none');
            alertBox.className = 'alert d-none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const result = await response.json();
                alertBox.classList.remove('d-none');

                if (result.success) {
                    alertBox.className = 'alert alert-success d-flex align-items-center gap-2 mt-3';
                    alertBox.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> <div>${result.message}</div>`;
                    contactForm.reset();
                } else {
                    alertBox.className = 'alert alert-danger d-flex align-items-center gap-2 mt-3';
                    const errHtml = (result.errors && result.errors.length)
                        ? result.errors.map(err => `<li>${err}</li>`).join('')
                        : result.message;
                    alertBox.innerHTML = `<div><strong>Error:</strong> <ul>${errHtml}</ul></div>`;
                }
            } catch (err) {
                console.error("Submission failed", err);
                alertBox.classList.remove('d-none');
                alertBox.className = 'alert alert-danger mt-3';
                alertBox.innerText = "Network error while submitting. Please check your connection or reach out via email.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
});
