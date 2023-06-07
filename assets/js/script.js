const commands = document.querySelectorAll(".command");
const dropZone = document.getElementById("drop-zone");
const submitButton = document.getElementById("submit-button");
const feedback = document.getElementById("feedback");

commands.forEach((command) => {
  command.addEventListener("dragstart", handleDragStart);
  command.addEventListener("dragend", handleDragEnd);
});

dropZone.addEventListener("dragover", handleDragOver);
dropZone.addEventListener("drop", handleDrop);

submitButton.addEventListener("click", handleSubmit);

function handleDragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function handleDragEnd(event) {
  event.dataTransfer.clearData();
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const element = document.getElementById(data);

  if (element) {
    const clone = element.cloneNode(true);
    dropZone.appendChild(clone);
  }
}

function handleSubmit() {
  const droppedCommands = Array.from(dropZone.children)
    .map((child) => child.id)
    .join(" ");

  if (droppedCommands === "nmap -p 80") {
    feedback.textContent = "Correct! This command will scan port 80.";
  } else {
    feedback.textContent = "Incorrect. Try again or ask for a hint.";
  }
}
