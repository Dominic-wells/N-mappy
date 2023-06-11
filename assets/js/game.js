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
  options: [
    "-p",
    "-sS",
    "-O",
    "-v",
    "--script",
    "-sU",
    "-sT",
    "-sA",
    "-sW",
    "-sM",
  ],
  ports: [
    "80",
    "443",
    "22",
    "3389",
    "7",
    "20",
    "21",
    "22",
    "23",
    "25",
    "53",
    "69",
    "80",
    "88",
    "102",
    "110",
    "135",
    "137",
    "139",
    "143",
    "381",
    "383",
    "443",
    "464",
    "465",
    "587",
    "593",
    "636",
    "691",
    "902",
    "989",
    "990",
    "993",
    "995",
    "1025",
    "1194",
    "1337",
    "1589",
    "1725",
    "2082",
    "2083",
    "2483",
    "2484",
    "2967",
    "3074",
    "3306",
    "3724",
    "4664",
    "5432",
    "5900",
    "6665",
    "6669",
    "6881",
    "6999",
    "6970",
    "8080",
    "8086",
    "8087",
    "8222",
    "8443",
    "9100",
    "10000",
    "12345",
    "27374",
    "18006",
  ],
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
  7: "Echo service",
  20: "File Transfer Protocol data transfer",
  21: "File Transfer Protocol (FTP) control connection",
  22: "Secure Shell, secure logins, file transfers (scp, sftp), and port forwarding",
  23: "Telnet protocol—unencrypted text communications",
  25: "Simple Mail Transfer Protocol, used for email routing between mail servers",
  53: "Domain Name System name resolver",
  69: "Trivial File Transfer Protocol",
  80: "Hypertext Transfer Protocol (HTTP) uses TCP in versions 1.x and 2. HTTP/3 uses QUIC, a transport protocol on top of UDP",
  88: "Network authentication system",
  102: "ISO Transport Service Access Point (TSAP) Class 0 protocol",
  110: "Post Office Protocol, version 3 (POP3)",
  135: "Microsoft EPMAP (End Point Mapper), also known as DCE/RPC Locator service, used to remotely manage services including DHCP server, DNS server, and WINS. Also used by DCOM",
  137: "NetBIOS Name Service, used for name registration and resolution",
  139: "NetBIOS Session Service",
  143: "Internet Message Access Protocol (IMAP), management of electronic mail messages on a server",
  381: "HP data alarm manager",
  383: "HP data alarm manager",
  443: "Hypertext Transfer Protocol Secure (HTTPS) uses TCP in versions 1.x and 2. HTTP/3 uses QUIC, a transport protocol on top of UDP.",
  464: "Kerberos Change/Set password",
  465: "Authenticated SMTP over TLS/SSL (SMTPS), URL Rendezvous Directory for SSM (Cisco protocol)",
  587: "Email message submission",
  593: "HTTP RPC Ep Map, Remote procedure call over Hypertext Transfer Protocol, often used by Distributed Component Object Model services and Microsoft Exchange Server",
  636: "Lightweight Directory Access Protocol over TLS/SSL",
  691: "MS Exchange Routing",
  902: "VMware ESXi",
  989: "FTPS Protocol (data), FTP over TLS/SSL",
  990: "FTPS Protocol (control), FTP over TLS/SSL",
  993: "Internet Message Access Protocol over TLS/SSL (IMAPS)",
  995: "Post Office Protocol 3 over TLS/SSL",
  1025: "Microsoft operating systems tend to allocate one or more unsuspected, publicly exposed services (probably DCOM, but who knows) among the first handful of ports immediately above the end of the service port range (1024+).",
  1194: "OpenVPN",
  1337: "WASTE Encrypted File Sharing Program",
  1589: "Cisco VLAN Query Protocol (VQP)",
  1725: "Valve Steam Client uses port 1725",
  2082: "cPanel default",
  2083: "Secure RADIUS Service (radsec), cPanel default SSL",
  2483: "Oracle database listening for insecure client connections to the listener, replaces port 1521",
  2484: "Oracle database listening for SSL client connections to the listener",
  2967: "Symantec System Center agent (SSC-AGENT)",
  3074: "Xbox LIVE and Games for Windows Live",
  3306: "MySQL database system",
  3724: "some Blizzard games, Unofficial Club Penguin Disney online game for kids",
  4664: "Google Desktop Search",
  5432: "PostgreSQL database system",
  5900: "virtual Network Computing (VNC) Remote Frame Buffer RFB protocol",
  6665: "Internet Relay Chat",
  6669: "Internet Relay Chat",
  6881: "BitTorrent is part of the full range of ports used most often",
  6999: "BitTorrent is part of the full range of ports used most often",
  6970: "QuickTime Streaming Server",
  8080: "Hypertext Transfer Protocol (HTTP), Port that is generally used by web servers to make TCP connections if default port 80 is busy",
  8086: "Kaspersky AV Control Center",
  8087: "Kaspersky AV Control Center",
  8222: "VMware Server Management User Interface (insecure Web interface)",
  8443: "HyperText Transfer Protocol Secure (HTTPS) default port for Apache Tomcat",
  9100: "Data Stream, used for printing to certain network printers",
  10000:
    "Webmin, Web-based Unix/Linux system administration tool (default port)",
  12345: "NetBus remote administration tool (often Trojan horse)",
  27374: "Sub7 default",
  18006: "Back Orifice 2000 remote administration tools",
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
