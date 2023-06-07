// Get the drop zone, submit button, and feedback div
const dropZone = document.getElementById("drop-zone");
const commandsDiv = document.getElementById("commands");
const submitButton = document.getElementById("submit-button");
const feedback = document.getElementById("feedback");

// Initialize Sortable.js on the drop-zone and commands divs
new Sortable(dropZone, {
  group: "shared", // set both lists to same group
  animation: 150,
  ghostClass: "ghost",
  filter: ".disabled",
});

new Sortable(commandsDiv, {
  group: "shared",
  animation: 150,
  ghostClass: "ghost",
  filter: ".disabled",
});

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

// Info to be passed to the feedback div
let commandDescriptions = {
  nmap: "nmap is the actual command so should always begin with this.",
  "-p": "The -p option allows you to specify the port number.",
  "-sS": "-sS is used to perform a TCP SYN scan.",
  "-O": "-O is used to enable OS detection.",
  "-v": "-v is used for verbose mode, which increases the amount of information the command displays.",
  "--script": "--script is used to specify a script that the scan will run.",
  80: "Port 80 is commonly used for HTTP traffic.",
  443: "Port 443 is commonly used for HTTPS traffic.",
  22: "Port 22 is commonly used for SSH.",
  3389: "Port 3389 is commonly used for Microsoft's Remote Desktop Protocol (RDP).",
  "192.30.255.113": "192.30.255.113 is the target IP address.",
};

// Variable to store the correct command
let correctCommand = "";

function handleSubmit() {
  // Get the dropped commands
  const droppedCommands = Array.from(dropZone.children)
    .map((child) => child.id)
    .join(" ");

  // If the dropped commands match the correct command
  if (droppedCommands === correctCommand) {
    // Give positive feedback
    feedback.textContent = `Correct! This command will scan the target.`;
  } else {
    // Give negative feedback
    feedback.textContent = `Incorrect. The correct command was: ${correctCommand}.`;
  }

  // Explain the command
  correctCommand.split(" ").forEach((part) => {
    let description = commandDescriptions[part];
    if (description) {
      feedback.textContent += `\n${part}: ${description}`;
    }
  });

  // Clear commands and drop zone
  commandsDiv.innerHTML = "";
  dropZone.innerHTML = "";

  // Generate a new command
  generateNewCommand();
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

    // Add the command element to the DOM
    commandsDiv.appendChild(commandElement);
  });

  correctCommand = correctCommand.trim(); // Remove trailing space
}

// Add event listener for submit button click event
submitButton.addEventListener("click", handleSubmit);

// Generate the initial command
generateNewCommand();
