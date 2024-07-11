$(document).ready(function() {
    
    $('.view-details').on('click', function() {
        var $jobListing = $(this).closest('.job-listing');
        $jobListing.find('.job-description').slideToggle();
    });

    
    $('.close').on('click', function() {
        $(this).closest('.job-description').slideUp();
    });

    
    $('.apply-job').on('click', function() {
        
        alert('Job application functionality to be implemented.');
    });
});
