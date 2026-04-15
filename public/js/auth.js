/**
 * Auth pages — login & register against the Batch Alumni API.
 */

(function () {
    'use strict';

    var API_BASE = 'http://localhost:5000';
    var TOKEN_KEY = 'alumni_jwt';

    function ensureFeedbackEl(form) {
        var el = form.querySelector('[data-auth-feedback]');
        if (!el) {
            el = document.createElement('p');
            el.setAttribute('data-auth-feedback', 'true');
            el.className = 'auth-feedback';
            el.setAttribute('role', 'alert');
            el.hidden = true;
            form.insertBefore(el, form.firstChild);
        }
        return el;
    }

    function showFeedback(form, message, variant) {
        var el = ensureFeedbackEl(form);
        el.textContent = message;
        el.hidden = false;
        el.className =
            'auth-feedback' +
            (variant === 'error'
                ? ' auth-feedback--error'
                : variant === 'success'
                  ? ' auth-feedback--success'
                  : '');
    }

    function hideFeedback(form) {
        var el = form.querySelector('[data-auth-feedback]');
        if (el) {
            el.hidden = true;
            el.textContent = '';
        }
    }

    function parseJsonSafe(text) {
        if (!text || !String(text).trim()) {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            return null;
        }
    }

    function extractToken(body) {
        if (!body || typeof body !== 'object') {
            return '';
        }
        if (body.token) {
            return String(body.token);
        }
        if (body.access_token) {
            return String(body.access_token);
        }
        if (body.jwt) {
            return String(body.jwt);
        }
        if (body.data && typeof body.data === 'object') {
            return extractToken(body.data);
        }
        return '';
    }

    function errorMessageFromBody(body, fallback) {
        if (!body || typeof body !== 'object') {
            return fallback;
        }
        if (typeof body.message === 'string') {
            return body.message;
        }
        if (typeof body.error === 'string') {
            return body.error;
        }
        if (body.error && typeof body.error === 'object' && typeof body.error.message === 'string') {
            return body.error.message;
        }
        if (typeof body.msg === 'string') {
            return body.msg;
        }
        return fallback;
    }

    async function handleRegister(e) {
        e.preventDefault();
        var form = e.target;
        var nameEl = document.getElementById('register-name');
        var emailEl = document.getElementById('register-email');
        var passEl = document.getElementById('register-password');
        var submitBtn = form.querySelector('button[type="submit"]');

        var name = nameEl && nameEl.value ? nameEl.value.trim() : '';
        var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
        var password = passEl ? passEl.value : '';

        if (!name || !email || !password) {
            showFeedback(form, 'Please fill in all fields.', 'error');
            return;
        }

        hideFeedback(form);
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        try {
            var res = await fetch(API_BASE + '/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            var data = parseJsonSafe(await res.text());

            if (!res.ok) {
                showFeedback(
                    form,
                    errorMessageFromBody(data, 'Registration failed. Please try again.'),
                    'error'
                );
                return;
            }

            showFeedback(form, 'Account created. Redirecting to login…', 'success');
            setTimeout(function () {
                window.location.href = 'login.html';
            }, 600);
        } catch (err) {
            showFeedback(
                form,
                'Could not reach the server. Make sure it is running and try again.',
                'error'
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        var form = e.target;
        var emailEl = document.getElementById('login-email');
        var passEl = document.getElementById('login-password');
        var submitBtn = form.querySelector('button[type="submit"]');

        var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
        var password = passEl ? passEl.value : '';

        if (!email || !password) {
            showFeedback(form, 'Please enter your email and password.', 'error');
            return;
        }

        hideFeedback(form);
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        try {
            var res = await fetch(API_BASE + '/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            var data = parseJsonSafe(await res.text());

            if (!res.ok) {
                showFeedback(
                    form,
                    errorMessageFromBody(data, 'Invalid email or password.'),
                    'error'
                );
                return;
            }

            var token = extractToken(data);
            if (!token) {
                showFeedback(
                    form,
                    'Login succeeded but no authentication token was returned.',
                    'error'
                );
                return;
            }

            localStorage.setItem(TOKEN_KEY, token);
            window.location.href = 'index.html';
        } catch (err) {
            showFeedback(
                form,
                'Could not reach the server. Make sure it is running and try again.',
                'error'
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    }

    function init() {
        var loginForm = document.getElementById('login-form');
        var registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();