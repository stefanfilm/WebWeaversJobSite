$(document).ready(function() {
    $('.view-details').click(function() {
        $(this).parents('.job-listing').find('.job-description').slideToggle();
    });

    $('.close').click(function() {
        $(this).parent('.job-description').slideUp();
    });

    $('.apply-job').click(function() {
        
        alert('Apply button clicked!');
    });
});
