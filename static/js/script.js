//Context Menu disabling
/*document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener("keydown", function (e) {
    // Disable F12 (Developer Tools)
    if (e.key === "F12") {
        e.preventDefault();
    }

    // Disable Ctrl+Shift+I (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
    }

    // Disable Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
    }
}) ;*/

// Select all elements to animate
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.animate');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Get the animation types from the data attribute
                const animations = entry.target.dataset.animation.split(',');
                const delay = parseInt(entry.target.getAttribute('data-index'));

                // Apply the first animation (on intersection)
                if (animations[0]) {
                    entry.target.classList.add(animations[0].trim());
                    if (!isNaN(delay)) {
                        entry.target.style.animationDelay = `${delay * 0.2}s`;
                    }
                }

                // Add a flag to mark that the element has entered
                entry.target.setAttribute('data-entered', 'true');

                // Unobserve the element after applying the first animation
                observer.unobserve(entry.target);
            }
        });
    }, 
    {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -10px 0px'
    });

    elements.forEach(element => observer.observe(element));
});

//switch to prediction pages
var pages = [
    'cardiology',
    'parkinsons', 
    'diabetes', 
    'breast-cancer'
] ;
var switchPage = document.querySelectorAll('#button') ;
switchPage.forEach(button => {
    button.addEventListener('click', () => {
        var index = button.getAttribute('data-button') ;
        setTimeout(() => {window.location.href = `/templates/${pages[index-1]}`, 2000}) ;
    })
}) ;

let videos = document.querySelectorAll('#backgroundVideo') ;
function setPlaybackSpeed(speed) {
    videos.forEach(video => {
        video.playbackRate = '0.75';
    })
}
setPlaybackSpeed() ;


