
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("about-link");
    const span = document.getElementsByClassName("close-button")[0];

    // Modal functionality
    if (btn) {
        btn.onclick = function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            modal.style.display = "block";
        }
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Form validation and redirection for index.html
    const form = document.getElementById('signup-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            let isValid = true;
            const formElements = form.querySelectorAll('input[required]');
            formElements.forEach(input => {
                console.log(`${input.name}: ${input.value.trim()}`); // Debugging output
                if (input.value.trim() === '') {
                    isValid = false;
                }
            });

            if (isValid) {
                const userDetails = {
                    firstName: document.getElementById('first-name').value,
                    lastName: document.getElementById('last-name').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value
                };
                // Save user details in localStorage
                localStorage.setItem('userDetails', JSON.stringify(userDetails));
                window.location.href = '../home/home.html';
            } else {
                alert('Please fill out all fields.');
            }
        });
    }
});
