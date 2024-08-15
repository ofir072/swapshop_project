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
});
