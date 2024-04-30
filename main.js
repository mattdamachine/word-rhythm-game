// Drag and Drop Elements
const draggableElements = document.querySelectorAll(".draggable");
const droppableElements = document.querySelectorAll(".droppable");
const droppedElements = []; // array to keep track of which boxes have been dropped in already

// Sounds
const quarterNote = new Audio("./sounds/quarter_note.wav");
const eighthNotes = new Audio("./sounds/8th_notes.wav");
const eighthSixteenthNotes = new Audio("./sounds/8th+16th_notes.wav");
const sixteenthNotes = new Audio("./sounds/16th_notes.wav");
// todo change these to an actual voice recording vvv
const carVoice = new Audio("./sounds/car-voice.wav");
const sailboatVoice = new Audio("./sounds/sailboat-voice.wav");
const spaceshuttleVoice = new Audio("./sounds/spaceshuttle-voice.wav");
const helicopterVoice = new Audio("./sounds/helicopter-voice.wav");
const tentVoice = new Audio("./sounds/tent-voice.wav");
const compassVoice = new Audio("./sounds/compass-voice.wav");
const mosquitoVoice = new Audio("./sounds/mosquito-voice.wav");
const bottlewaterVoice = new Audio("./sounds/bottlewater-voice.wav");

const sounds = {
  wordSounds: {
    car: carVoice,
    sailboat: sailboatVoice,
    "shuttle-space": spaceshuttleVoice,
    helicopter: helicopterVoice,
    tent: tentVoice,
    compass: compassVoice,
    mosquito: mosquitoVoice,
    "bottle-water": bottlewaterVoice,
  },
  drumSounds: {
    car: quarterNote,
    sailboat: eighthNotes,
    "shuttle-space": eighthSixteenthNotes,
    helicopter: sixteenthNotes,
    tent: quarterNote,
    compass: eighthNotes,
    mosquito: eighthSixteenthNotes,
    "bottle-water": sixteenthNotes,
  },
};

// Radio Buttons
const wordSoundsBtn = document.getElementById("word-sounds");
const drumSoundsBtn = document.getElementById("drum-sounds");

// Icon Selector
const iconSelector = document.getElementById("icon-selector");
iconSelector.addEventListener("change", replaceIcons);

// Icon sets
const iconSets = {
  transportation: [
    { id: "helicopter", class: "fa-helicopter", color: "orange" },
    { id: "shuttle-space", class: "fa-shuttle-space", color: "darkmagenta" },
    { id: "sailboat", class: "fa-sailboat", color: "aqua" },
    { id: "car", class: "fa-car", color: "slateblue" },
  ],
  camping: [
    { id: "compass", class: "fa-compass", color: "red" },
    { id: "mosquito", class: "fa-mosquito", color: "brown" },
    { id: "bottle-water", class: "fa-bottle-water", color: "blue" },
    { id: "tent", class: "fa-tent", color: "green" },
  ],
};

// Strings for labels
const labelNames = {
  car: "Car",
  sailboat: "Sailboat",
  "shuttle-space": "Space Shuttle",
  helicopter: "Helicopter",
  compass: "Compass",
  mosquito: "Mosquito",
  "bottle-water": "Water Bottle",
  tent: "Tent",
};

// Background Element
const backgroundElement = document.getElementById("background");
const backgroundUrls = {
  transportation: "./images/transportation.jpg",
  camping: "./images/camping.jpg",
};

// Event Listeners
draggableElements.forEach((elem) => {
  elem.addEventListener("dragstart", dragStart);
});

droppableElements.forEach((elem) => {
  elem.addEventListener("dragenter", dragEnter);
  elem.addEventListener("dragover", dragOver);
  elem.addEventListener("dragleave", dragLeave);
  elem.addEventListener("drop", drop);
});

// Drag and Drop Functions
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove("droppable-hover");

  const draggableElementData = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(draggableElementData);
  const droppableElementId = event.target.getAttribute("data-draggable-id");
  const droppableElement = document.querySelector(
    `[data-draggable-id="${droppableElementId}"]`
  );
  const currentElementName = droppableElement.getAttribute(
    "data-current-element"
  );

  // Remove current droppable element if it exists
  if (currentElementName.length > 0) {
    droppableElement.childNodes.forEach((child) => {
      droppableElement.removeChild(child);
    });
  }

  // Update drop box styles
  event.target.classList.add("dropped");
  event.target.style.backgroundColor = draggableElement.style.color;

  // Drop box will keep track of which element is currently placed inside
  droppableElement.setAttribute(
    "data-current-element",
    `${draggableElementData}`
  );

  // add dropped box to array if it's not already in there
  if (!droppedElements.includes(droppableElement)) {
    droppedElements.push(droppableElement);
  }

  // Insert icon into box
  event.target.insertAdjacentHTML(
    "afterbegin",
    `<i class="fa-solid fa-${draggableElementData}"></i>`
  );

  // Update Label
  updateLabel(draggableElementData, droppableElementId);
}

function dragEnter(event) {
  event.target.classList.add("droppable-hover");
}

function dragLeave(event) {
  event.target.classList.remove("droppable-hover");
}

function updateLabel(draggableElementData, droppableElementId) {
  let label = document.querySelector(`[data-label-id="${droppableElementId}"]`);
  label.innerHTML = labelNames[draggableElementData];
}

// Helper Functions
function replaceIcons() {
  // Reset Drop boxes
  reset();

  // Clear existing icons
  let draggableIcons = document.querySelector(".draggable-elements");
  draggableIcons.innerHTML = "";

  let selectedIconSet = iconSelector.value;

  let icons = iconSets[selectedIconSet];
  icons.forEach((icon) => {
    const newIcon = document.createElement("i");
    newIcon.classList.add("draggable");
    newIcon.classList.add("fa-solid");
    newIcon.classList.add(icon.class);
    newIcon.id = icon.id;
    newIcon.draggable = true;
    newIcon.style.color = icon.color;
    newIcon.addEventListener("dragstart", dragStart);
    draggableIcons.appendChild(newIcon);
  });

  // Update Background
  backgroundElement.style.backgroundImage = `url(${backgroundUrls[selectedIconSet]})`;
}

function reset() {
  droppedElements.forEach((elem) => {
    elem.childNodes.forEach((child) => {
      // Reset Drop Box
      elem.removeChild(child);
      elem.classList.remove("dropped");
      elem.setAttribute("data-current-element", "");
      elem.style.backgroundColor = "#fff";

      // Reset Label
      let droppableId = elem.getAttribute("data-draggable-id");
      let label = document.querySelector(`[data-label-id="${droppableId}"]`);
      label.innerHTML = "";
    });
  });
  // Empty out dropped box array
  while (droppedElements.length > 0) {
    droppedElements.pop();
  }
}

// Sound Functions
function playAllSounds() {
  // If all four boxes are occupied, play the sounds. If not, prompt the user to fill all four boxes
  if (droppedElements.length == 4) {
    droppableElements.forEach((elem, index) => {
      let currentElement = elem.getAttribute("data-current-element");
      setTimeout(() => {
        playSound(currentElement);
      }, index * 1200); // Can adjust the delay here if needed
    });
  } else {
    alert("Please fill all 4 boxes before playing the sounds!");
  }
}

function playSound(draggableElementData) {
  let soundsToPlay;

  if (wordSoundsBtn.checked) {
    // Sounds for wordSounds checked
    soundsToPlay = sounds["wordSounds"];
  } else {
    // Sounds for wordSounds not checked
    soundsToPlay = sounds["drumSounds"];
  }

  let soundToPlay = soundsToPlay[draggableElementData];
  if (soundToPlay) {
    soundToPlay.load();
    soundToPlay.play();
  } else {
    console.log("No matching sound was found!");
  }
}
