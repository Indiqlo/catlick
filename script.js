document.addEventListener('DOMContentLoaded', function() {
    const clickElement = document.getElementById('click');
    const catlickElement = document.getElementById('catlick');
    const youveBeenCatlickedElement = document.getElementById('youve-been-catlicked');
    const memeElement = document.getElementById('meme');
    const cat = document.getElementById('cat');
    const catSound = document.getElementById('catSound');
    const copyableTextElement = document.getElementById('copyable-text');
    let catlickTimeout;
    let cursorEvent;
    let catlickedCount = 0;

    cat.style.display = 'none'; // Ensure the cat image is hidden initially

    const moveImage = (event, element) => {
        const touch = event.touches ? event.touches[0] : event;
        const imageWidth = element.offsetWidth;
        const imageHeight = element.offsetHeight;

        // Position the image directly under the cursor, adjusted by 2px to the left and 5px down
        const left = touch.clientX - imageWidth / 2 - 2;
        const top = touch.clientY - imageHeight / 2 + 5;

        // Apply the calculated position
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    };

    const stopCatSound = () => {
        console.log("Stopping cat sound");
        catSound.pause();
        catSound.currentTime = 0; // Reset sound to the beginning
    };

    const showYouveBeenCatlicked = () => {
        console.log("Showing 'you've been catlicked' text");
        catlickElement.style.display = 'none';
        youveBeenCatlickedElement.style.display = 'block';

        catlickedCount += 1;

        // Show "you've been catlicked" for 2 seconds
        setTimeout(() => {
            youveBeenCatlickedElement.style.display = 'none';

            if (catlickedCount === 2) {
                // Show "that's it, that's the meme" for 2 seconds after the second time
                memeElement.style.display = 'block';
                setTimeout(() => {
                    memeElement.style.display = 'none';
                    clickElement.style.display = 'block';
                    catlickedCount = 0; // Reset the count
                }, 2000);
            } else {
                clickElement.style.display = 'block';
            }
        }, 2000);
    };

    const moveCat = (event) => moveImage(event, cat);

    const resetState = () => {
        clickElement.style.display = 'block';
        catlickElement.style.display = 'none';
        youveBeenCatlickedElement.style.display = 'none';
        memeElement.style.display = 'none';
    };

    const handleMouseDown = (event) => {
        console.log('Mouse down on "click" element');
        event.stopPropagation(); // Stop the event from bubbling up

        // Store the cursor event for later use
        cursorEvent = event.touches ? event.touches[0] : event;

        // Hide the "click" element and show the "catlick" element
        clickElement.style.display = 'none';
        catlickElement.style.display = 'block';

        // Change the cursor to pointer
        document.body.style.cursor = 'pointer';

        // Play and loop the cat sound
        catSound.loop = true;
        catSound.play();

        // Show the cat image
        cat.style.display = 'block';

        // Move the cat to the initial cursor position
        moveCat(event);

        // Add mousemove and touchmove event listeners to follow the cursor
        document.addEventListener('mousemove', moveCat);
        document.addEventListener('touchmove', moveCat);

        // Set timeout to show "you've been catlicked" text after 6 seconds
        catlickTimeout = setTimeout(() => {
            cat.style.display = 'none';
            stopCatSound();
            showYouveBeenCatlicked();
        }, 6000);
    };

    const handleMouseUp = () => {
        console.log("Mouse up");
        // Hide the cat image
        cat.style.display = 'none';

        // Reset the cursor to default
        document.body.style.cursor = 'default';

        // Stop the cat sound
        stopCatSound();

        // Remove mousemove and touchmove event listeners for the cat image
        document.removeEventListener('mousemove', moveCat);
        document.removeEventListener('touchmove', moveCat);

        // Clear the timeout if the mouse is released before 6 seconds
        clearTimeout(catlickTimeout);

        // Only show the "click" element if "you've been catlicked" is not displayed
        if (youveBeenCatlickedElement.style.display !== 'block') {
            clickElement.style.display = 'block';
            catlickElement.style.display = 'none';
        }
    };

    clickElement.addEventListener('mousedown', function(event) {
        handleMouseDown(event);
    });

    clickElement.addEventListener('touchstart', function(event) {
        handleMouseDown(event);
    });

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    // Function to copy text to clipboard
    window.copyText = function() {
        const copyText = copyableTextElement.innerText;
        navigator.clipboard.writeText(copyText).then(() => {
            console.log("Text copied to clipboard: " + copyText);
            copyableTextElement.classList.add('copied');
            setTimeout(() => {
                copyableTextElement.classList.remove('copied');
            }, 2000); // Remove the copied message after 2 seconds
        }).catch(err => {
            console.error("Error copying text: ", err);
        });
    };

    // Initial state
    resetState();
});
