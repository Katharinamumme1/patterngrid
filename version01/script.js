const svg = document.getElementById("patternCanvas");
const patternSelect = document.getElementById("patternType");
const generateButton = document.getElementById("generatePattern");
const clearButton = document.getElementById("clearCanvas");

let isDrawing = false;
let currentPath;

// Vollbild für SVG setzen
function resizeSVG() {
  svg.setAttribute("width", window.innerWidth);
  svg.setAttribute("height", window.innerHeight);
}
resizeSVG();
window.addEventListener("resize", resizeSVG);

// Benutzerzeichnung starten
svg.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("d", `M${e.clientX},${e.clientY}`);
  svg.appendChild(path);
  currentPath = path;
});

svg.addEventListener("mousemove", (e) => {
  if (!isDrawing || !currentPath) return;
  const d = currentPath.getAttribute("d");
  currentPath.setAttribute("d", `${d} L${e.clientX},${e.clientY}`);
});

svg.addEventListener("mouseup", () => {
  isDrawing = false;
});

// Muster generieren
generateButton.addEventListener("click", () => {
  const patternType = patternSelect.value;
  const originalContent = svg.innerHTML;
  svg.innerHTML = ""; // Leinwand leeren

  if (patternType.startsWith("grid")) {
    const gridType = patternType.split("-")[1];
    createGridPattern(originalContent, gridType);
  } else if (patternType.startsWith("spiral")) {
    const spiralType = patternType.split("-")[1];
    createSpiralPattern(originalContent, spiralType);
  } else if (patternType === "kaleidoscope") {
    createKaleidoscopePattern(originalContent);
  }
});

// Musterarten
function createGridPattern(content, type = "rectangular") {
  const cols = 6;
  const rows = 6;
  const cellWidth = window.innerWidth / cols;
  const cellHeight = window.innerHeight / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // Unterschiedliche Grid-Typen
      if (type === "rectangular") {
        group.setAttribute("transform", `translate(${i * cellWidth}, ${j * cellHeight})`);
      } else if (type === "hexagonal") {
        const xOffset = (j % 2 === 0 ? 0 : cellWidth / 2);
        group.setAttribute("transform", `translate(${i * cellWidth + xOffset}, ${j * (cellHeight * 0.866)})`); // 0.866 = sqrt(3)/2 für hexagonale Höhe
      } else if (type === "offset") {
        const xOffset = (j % 2 === 0 ? cellWidth / 4 : 0);
        group.setAttribute("transform", `translate(${i * cellWidth + xOffset}, ${j * cellHeight})`);
      }

      group.innerHTML = content;
      svg.appendChild(group);
    }
  }
}

function createSpiralPattern(content, type = "archimedean") {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const turns = 6;
  const segmentsPerTurn = 12;
  const totalSegments = turns * segmentsPerTurn;

  for (let i = 0; i < totalSegments; i++) {
    const angle = (i / segmentsPerTurn) * (2 * Math.PI);
    let radius;

    if (type === "archimedean") {
      radius = i * 15; // Abstände gleichmäßig
    } else if (type === "logarithmic") {
      radius = 15 * Math.exp(0.1 * i); // Abstände exponentiell
    }

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI})`);
    group.innerHTML = content;
    svg.appendChild(group);
  }
}

function createKaleidoscopePattern(content) {
  const segments = 8;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const angle = 360 / segments;

  for (let i = 0; i < segments; i++) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.innerHTML = content;
    group.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(${i * angle})`);
    svg.appendChild(group);

    // Spiegeln
    const mirroredGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    mirroredGroup.innerHTML = content;
    mirroredGroup.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(${i * angle + angle / 2}) scale(1, -1)`);
    svg.appendChild(mirroredGroup);
  }
}


// Leinwand leeren
clearButton.addEventListener("click", () => {
  svg.innerHTML = "";
});