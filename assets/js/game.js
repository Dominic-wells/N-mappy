// Get the drop zone, submit button, and feedback div
const dropZone = document.getElementById("drop-zone");
const commandsDiv = document.getElementById("commands");
const submitButton = document.getElementById("submit-button");
const feedback = document.getElementById("feedback");

// Initialize Sortable.js on the drop-zone and commands divs
const sortableDropZone = new Sortable(dropZone, {
  group: "shared", // set both lists to the same group
  animation: 150,
  ghostClass: "ghost",
  filter: ".disabled",
});

const sortableCommandsDiv = new Sortable(commandsDiv, {
  group: "shared",
  animation: 150,
  ghostClass: "ghost",
  filter: ".disabled",
});

// Define possible command parts
const commandParts = {
  scanners: ["nmap"],
  options: ["-p", "-sS", "-O", "-v", "--script"],
  ports: ["80", "443", "22", "3389"],
  targets: ["192.30.255.113"],
};

// Define wrong command parts
const wrongCommandParts = {
  scanners: ["Nm"],
  options: ["-pP", "-SS", "-oO", "-xc", "---script"],
  ports: ["70000", "800000"],
  targets: ["0.0.0.0"],
};

// Merge the commandParts and wrongCommandParts
const allCommandParts = {
  scanners: [...commandParts.scanners, ...wrongCommandParts.scanners],
  options: [...commandParts.options, ...wrongCommandParts.options],
  ports: [...commandParts.ports, ...wrongCommandParts.ports],
  targets: [...commandParts.targets, ...wrongCommandParts.targets],
};

// Define possible command structures
const commandStructures = [
  ["scanners", "options", "ports", "targets"],
  ["scanners", "options", "targets"],
  ["scanners", "ports", "targets"],
  ["scanners", "targets"],
];

// Info to be passed to the feedback div
const commandDescriptions = {
  nmap: "nmap is the actual command and should always begin with this.",
  "-p": "The -p option allows you to specify the port number.",
  "-sS": "-sS is used to perform a TCP SYN scan.",
  "-O": "-O is used to enable OS detection.",
  "-v": "-v is used for verbose mode, which increases the amount of information the command displays.",
  "--script": "--script is used to specify a script that the scan will run.",
  "---script": "This is not a valid option.",
  "-pP": "This is not a valid option.",
  "-SS": "This is not a valid option.",
  "-oO": "This is not a valid option.",
  "-xc": "This is not a valid option.",
  80: "Port 80 is commonly used for HTTP traffic.",
  443: "Port 443 is commonly used for HTTPS traffic.",
  22: "Port 22 is commonly used for SSH.",
  3389: "Port 3389 is commonly used for Microsoft's Remote Desktop Protocol (RDP).",
  "192.30.255.113": "192.30.255.113 is the target IP address.",
  Nm: "This is not a valid option.",
  "--incorrect": "This is not a valid option.",
  70000: "This port number is not valid.",
  800000: "This port number is not valid.",
  "0.0.0.0": "This is not a valid target.",
};

// Variable to store the correct command
let correctCommand = "";

// Function to generate a new command this is called when the page loads
// and when the user submits a command using the submit button
// corrrect syntax and incorrect syntax displayed
function generateNewCommand() {
  // Choose a random structure
  const randomStructureIndex = Math.floor(
    Math.random() * commandStructures.length
  );
  const structure = commandStructures[randomStructureIndex];

  correctCommand = ""; // Clear the correct command

  const commandElements = []; // Store all generated command elements here

  // Generate a part for each part type in the structure
  structure.forEach((partType) => {
    const partOptions = commandParts[partType];
    const randomPartIndex = Math.floor(Math.random() * partOptions.length);
    const part = partOptions[randomPartIndex];

    // If the part type is a port and `-p` doesn't exist, add `-p`
    if (partType === "ports" && !correctCommand.includes("-p")) {
      correctCommand += "-p ";

      // Create option `-p` command element
      const optionElement = document.createElement("div");
      optionElement.classList.add("command");
      optionElement.setAttribute("draggable", true);
      optionElement.setAttribute("id", "-p");
      optionElement.textContent = "-p";

      // Add the optionElement to commandElements array
      commandElements.push(optionElement);
    }

    // Add to correct command
    correctCommand += part + " ";

    // Create command element
    const commandElement = document.createElement("div");
    commandElement.classList.add("command");
    commandElement.setAttribute("draggable", true);
    commandElement.setAttribute("id", part);
    commandElement.textContent = part;

    // Add the commandElement to commandElements array
    commandElements.push(commandElement);
  });

  // After generating the correct command elements, add some wrong command parts to the mix
  Object.keys(wrongCommandParts).forEach((partType) => {
    const partOptions = wrongCommandParts[partType];
    const randomPartIndex = Math.floor(Math.random() * partOptions.length);
    const part = partOptions[randomPartIndex];

    // Create wrong command element
    const commandElement = document.createElement("div");
    commandElement.classList.add("command");
    commandElement.setAttribute("draggable", true);
    commandElement.setAttribute("id", part);
    commandElement.textContent = part;

    // Add the wrong commandElement to commandElements array
    commandElements.push(commandElement);
  });

  // Function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Shuffle commandElements array
  shuffleArray(commandElements);

  // Clear the commands div
  commandsDiv.innerHTML = "";

  // Add all elements from commandElements to the DOM
  commandElements.forEach((element) => {
    commandsDiv.appendChild(element);
  });

  correctCommand = correctCommand.trim(); // Remove trailing space
}

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
    const description = commandDescriptions[part];
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

// Add event listener for submit button click event
submitButton.addEventListener("click", handleSubmit);

// Generate the initial command
generateNewCommand();
