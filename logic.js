document.addEventListener("DOMContentLoaded", function() {
    var dropdownBtn = document.querySelector('.dropdown .dropbtn');
    var dropdown = document.querySelector('.dropdown');

    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevents the dropdown from closing immediately
        dropdown.classList.toggle('active');
    });

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});
