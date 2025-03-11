// validation.js

// Custom validation for user registration
const registerValidation = (data) => {
    const errors = [];

    // Validate name
    if (!data.name || data.name.trim().length < 6) {
        errors.push('Name must be at least 6 characters long.');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Invalid email address.');
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    return {
        error: errors.length > 0 ? errors.join(' ') : null,
    };
};

// Custom validation for user login
const loginValidation = (data) => {
    const errors = [];

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Invalid email address.');
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    return {
        error: errors.length > 0 ? errors.join(' ') : null,
    };
};

module.exports = { registerValidation, loginValidation };