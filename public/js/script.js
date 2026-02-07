const answers_no = [
    "No",
    "Are you sure?",
    "Are you really sure??",
    "Are you really realy sure???",
    "Think again?",
    "Don't believe in second chances?",
    "Why are you being so cold?",
    "Maybe we can talk about it?",
    "I am not going to ask again!",
    "Ok now this is hurting my feelings!",
    "You are now just being mean!",
    "Why are you doing this to me?",
    "Please give me a chance!",
    "I am begging you to stop!",
    "Ab no karke dikhao"
];

const answers_yes = "Yes";
const no_button = document.getElementById('no-button');
const yes_button = document.getElementById('yes-button');
let i = 1;
let size = 50;
let clicks = 0;
let evasiveMode = false;

no_button.addEventListener('click', () => {
    if (evasiveMode) return; // while evasive, ignore clicks
    // Change banner source
    let banner = document.getElementById('banner');
    if (clicks === 0) {
        banner.src = "public/images/no.gif";
        refreshBanner();
    }
    clicks++;
    // increase button height and width gradually to 250px
    const sizes = [40, 50, 30, 35, 45]
    const random = Math.floor(Math.random() * sizes.length);
    size += sizes[random]
    yes_button.style.height = `${size}px`;
    yes_button.style.width = `${size}px`;
    let total = answers_no.length;
    // change button text
    if (i < total - 1) {
        no_button.innerHTML = answers_no[i];
        i++;
    } else if (i === total - 1) {
        // Enter evasive mode: remove alert and make the No button dodge the cursor
        no_button.innerHTML = answers_no[i];
        evasiveMode = true;
        enableEvasiveBehavior();
    // update yes button text but keep its current size
    yes_button.innerHTML = answers_yes;
    }
});

yes_button.addEventListener('click', () => {
    // change banner gif path
    let banner = document.getElementById('banner');
    banner.src = "public/images/yes.gif";
    refreshBanner();
    // hide buttons div
    let buttons = document.getElementsByClassName('buttons')[0];
    buttons.style.display = "none";
    // show message div
    let message = document.getElementsByClassName('message')[0];
    message.style.display = "block";
});

function refreshBanner() {
    // Reload banner gif to force load  
    let banner = document.getElementById('banner');
    let src = banner.src;
    banner.src = '';
    banner.src = src;
}
// language switching removed; site uses English only

function enableEvasiveBehavior() {
    // position the button relative to the viewport so we can move it freely
    no_button.style.position = 'fixed';
    no_button.style.zIndex = 9999;
    no_button.style.transition = 'left 0.15s ease, top 0.15s ease';

    // move once to avoid immediate clicking
    moveNoButtonRandomly();

    // on hover/touch move the button to a new random place
    no_button.addEventListener('mouseenter', moveNoButtonRandomly);
    no_button.addEventListener('touchstart', moveNoButtonRandomly, {passive: true});

    // also move if the window resizes so it stays inside view
    window.addEventListener('resize', ensureButtonInViewport);
}

function moveNoButtonRandomly() {
    const btnRect = no_button.getBoundingClientRect();
    const margin = 20; // keep a margin from edges
    const maxLeft = Math.max(0, window.innerWidth - btnRect.width - margin);
    const maxTop = Math.max(0, window.innerHeight - btnRect.height - margin);
    const yesRect = yes_button.getBoundingClientRect();

    function rectsOverlap(r1, r2) {
        return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
    }

    // Try to find a position that doesn't overlap the Yes button
    const maxAttempts = 30;
    let attempt = 0;
    let left, top, candidateRect;
    do {
        left = Math.floor(Math.random() * maxLeft) + margin;
        top = Math.floor(Math.random() * maxTop) + margin;

        candidateRect = {
            left: left,
            top: top,
            right: left + btnRect.width,
            bottom: top + btnRect.height
        };

        attempt++;
    } while (attempt < maxAttempts && rectsOverlap(candidateRect, yesRect));

    // If after many attempts we still overlap, try to place the No button on the opposite side
    if (rectsOverlap(candidateRect, yesRect)) {
        // Prefer left or right side depending on yes button position
        if (yesRect.left > window.innerWidth / 2) {
            left = margin; // put No on left side
        } else {
            left = Math.max(margin, window.innerWidth - btnRect.width - margin); // put No on right
        }
        // Put vertically away from yes button
        if (yesRect.top > window.innerHeight / 2) {
            top = margin;
        } else {
            top = Math.max(margin, window.innerHeight - btnRect.height - margin);
        }
    }

    no_button.style.left = `${left}px`;
    no_button.style.top = `${top}px`;
}

function ensureButtonInViewport() {
    const btnRect = no_button.getBoundingClientRect();
    let left = btnRect.left;
    let top = btnRect.top;
    const margin = 20;
    const maxLeft = Math.max(0, window.innerWidth - btnRect.width - margin);
    const maxTop = Math.max(0, window.innerHeight - btnRect.height - margin);

    if (left > maxLeft) left = maxLeft;
    if (top > maxTop) top = maxTop;
    if (left < margin) left = margin;
    if (top < margin) top = margin;

    no_button.style.left = `${left}px`;
    no_button.style.top = `${top}px`;
}