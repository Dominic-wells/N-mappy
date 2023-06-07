// Get the drop zone, submit button, and feedback div
const dropZone = document.getElementById("drop-zone");
const submitButton = document.getElementById("submit-button");
const feedback = document.getElementById("feedback");

// Define possible command parts
let commandParts = {
  scanners: ["nmap"],
  options: ["-p", "-sS", "-O", "-v", "--script"],
  ports: ["80", "443", "22", "3389"],
  targets: ["192.30.255.113"],
};

// Define possible command structures
let commandStructures = [
  ["scanners", "options", "ports", "targets"],
  ["scanners", "options", "targets"],
  ["scanners", "ports", "targets"],
  ["scanners", "targets"],
];

// Variable to store the correct command
let correctCommand = "";

// Function to handle the start of a drag event
// Store the ID of the dragged element
function handleDragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Function to handle the end of a drag event
// Clear the stored data
function handleDragEnd(event) {
  event.dataTransfer.clearData();
}

// Function to handle a drag over event
// Prevent the default behavior to allow dropping
function handleDragOver(event) {
  event.preventDefault();
}

// Function to handle a drop event
// Prevent the default behavior
function handleDrop(event) {
  event.preventDefault();

  // Get the ID of the dragged element
  // Get the dragged element
  const data = event.dataTransfer.getData("text");

  const element = document.getElementById(data);

  // If the element exists
  if (element) {
    // Clone it and add it to the drop zone
    const clone = element.cloneNode(true);
    dropZone.appendChild(clone);
  }
}

// Function to handle the submit button click event
function handleSubmit() {
  // Get the dropped commands
  const droppedCommands = Array.from(dropZone.children)
    .map((child) => child.id)
    .join(" ");

  // If the dropped commands match the correct command
  if (droppedCommands === correctCommand) {
    // Give positive feedback and generate a new command
    feedback.textContent = `Correct! This command will scan the target. Here comes the next command!`;

    // Clear commands and drop zone
    document.getElementById("commands").innerHTML = "";
    dropZone.innerHTML = "";

    generateNewCommand();
  } else {
    // Give negative feedback and generate a new command
    feedback.textContent = `Incorrect. The correct command was: ${correctCommand}. Try again with a new command.`;

    // Clear commands and drop zone
    document.getElementById("commands").innerHTML = "";
    dropZone.innerHTML = "";

    generateNewCommand();
  }
}

// Function to generate a new command
function generateNewCommand() {
  // Choose a random structure
  let randomStructureIndex = Math.floor(
    Math.random() * commandStructures.length
  );
  let structure = commandStructures[randomStructureIndex];

  correctCommand = ""; // Clear the correct command

  // Generate a part for each part type in the structure
  structure.forEach((partType) => {
    let partOptions = commandParts[partType];
    let randomPartIndex = Math.floor(Math.random() * partOptions.length);
    let part = partOptions[randomPartIndex];

    // Add to correct command
    correctCommand += part + " ";

    // Create command element
    let commandElement = document.createElement("div");
    commandElement.classList.add("command");
    commandElement.setAttribute("draggable", true);
    commandElement.setAttribute("id", part);
    commandElement.textContent = part;

    // Add drag start and end event listeners
    commandElement.addEventListener("dragstart", handleDragStart);
    commandElement.addEventListener("dragend", handleDragEnd);

    // Add the command element to the DOM
    document.getElementById("commands").appendChild(commandElement);
  });

  correctCommand = correctCommand.trim(); // Remove trailing space
}

// Add event listeners for drag over and drop events
dropZone.addEventListener("dragover", handleDragOver);
dropZone.addEventListener("drop", handleDrop);

// Add event listener for submit button click event
submitButton.addEventListener("click", handleSubmit);

// Generate the initial command
generateNewCommand();
