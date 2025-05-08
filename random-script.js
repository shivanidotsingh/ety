// Assuming data.js with etymologyData is loaded before this script

const wordDisplay = document.getElementById('word-display');
const storyDisplay = document.getElementById('story-display');
const yearDisplay = document.getElementById('year-display');
const imageDisplay = document.getElementById('image-display');
const nextEtymologyButton = document.getElementById('next-etymology-button');

// Color combinations from your other project's script.js
const colorCombos = [
  { bg: "#228DC8", text: "#FC7ED7" },
  { bg: "#FBA332", text: "#FA6128" },
  { bg: "#FA6128", text: "#0B690C" },

  { bg: "#CBA0AA", text: "#FAE397" },
  { bg: "#B6CAC0", text: "#C02A1B" },
  { bg: "#F9F7E8", text: "#62BFAD" },
  { bg: "#6C5B7B", text: "#C06C84" },
  { bg: "#355C7D", text: "#F67280" },
  { bg: "#F3C9DD", text: "#72AEC5" },
  { bg: "#119DA4", text: "#FFC857" },
  { bg: "#20AD65", text: "#FEC8BE" },
  { bg: "#9C9CDD", text: "#CAE9BF" },
  { bg: "#B2B2B2", text: "#E9FF27" },
  { bg: "#8AA9C6", text: "#D1BDFF" },
  { bg: "#393E41", text: "#E94F37" }
];

// Button phrases from your other project's script.js
const buttonPhrases = [
  "Tell me another story", // Keep the default
  "Hmm, what's next?",
  "Another one, please",
  "Surprise me again",
  "Next etymology!",
  "Show me a different word",
  "Keep 'em coming!",
  "More stories!"
];


let availableEtymologies = [...etymologyData]; // Start with all etymologies

function displayRandomEtymology() {
    if (availableEtymologies.length === 0) {
        // If we've shown all, reset to show all again
        availableEtymologies = [...etymologyData];
    }

    const randomIndex = Math.floor(Math.random() * availableEtymologies.length);
    const randomEtymology = availableEtymologies.splice(randomIndex, 1)[0]; // Remove displayed etymology

    wordDisplay.innerText = randomEtymology.word;
    storyDisplay.innerText = randomEtymology.story;
    yearDisplay.innerText = randomEtymology.year || ''; // Display year or empty string
    if (randomEtymology.imageUrl) {
        imageDisplay.src = randomEtymology.imageUrl;
        imageDisplay.style.display = 'block'; // Show image if URL exists
    } else {
        imageDisplay.src = ''; // Clear image source
        imageDisplay.style.display = 'none'; // Hide image element if no URL
    }


    // Apply random color combination
    const randomColor = colorCombos[Math.floor(Math.random() * colorCombos.length)];
    document.body.style.backgroundColor = randomColor.bg;
    document.body.style.color = randomColor.text;
    nextEtymologyButton.style.color = randomColor.text; // Style button text


    // Set random button phrase
    nextEtymologyButton.innerText = buttonPhrases[Math.floor(Math.random() * buttonPhrases.length)];
}

// Display an etymology when the page loads
document.addEventListener('DOMContentLoaded', displayRandomEtymology);

// Add event listener to the button
nextEtymologyButton.addEventListener('click', displayRandomEtymology);
