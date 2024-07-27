document.addEventListener('DOMContentLoaded', () => {
    // Function to toggle the visibility of a div by its ID
    window.toggleVisibility = function(divId) {
        const toggleDiv = document.getElementById(divId);
        if (toggleDiv) {
            toggleDiv.style.display = toggleDiv.style.display === 'block' ? 'none' : 'block';

            // Stop propagation to avoid closing the div immediately
            event.stopPropagation();

            // Add a click event to the document to hide the div if clicked outside
            document.addEventListener('click', function(event) {
                if (toggleDiv.style.display === 'block' && !toggleDiv.contains(event.target) && event.target.id !== divId) {
                    toggleDiv.style.display = 'none';
                }
            }, { once: true });
        }
    };
});
