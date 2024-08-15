document.addEventListener('DOMContentLoaded', () => {
    const itemsSection = document.getElementById('items-section');

    // Function to disable clicks on item cards
    const disableClicks = () => {
        itemsSection.classList.add('disable-clicks');
    };

    // Call the function to disable clicks (this can be conditional based on your needs)
    disableClicks();
});
