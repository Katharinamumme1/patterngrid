function initializeWorkspaces() {
    const workspaces = document.querySelectorAll('.category');

    workspaces.forEach((workspace) => {
        const svg = workspace.querySelector('svg');
        const patternType = workspace.dataset.type; // Musterart direkt im Container

        let isDrawing = false;
        let currentPath = null;

        // SVG skalieren
        resizeSVG(svg);
        window.addEventListener('resize', () => resizeSVG(svg));

        // Zeichnen starten
        svg.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const startX = e.offsetX;
            const startY = e.offsetY;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke', 'black');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('d', `M${startX},${startY}`);
            svg.appendChild(path);
            currentPath = path;
        });

        // Zeichnen fortsetzen
        svg.addEventListener('mousemove', (e) => {
            if (!isDrawing || !currentPath) return;
            const d = currentPath.getAttribute('d');
            const newSegment = ` L${e.offsetX},${e.offsetY}`;
            currentPath.setAttribute('d', d + newSegment);
        });

        // Zeichnen beenden und Muster generieren
        svg.addEventListener('mouseup', () => {
            isDrawing = false;

            const content = svg.innerHTML; // Originalinhalt
            svg.innerHTML = ''; // Leinwand leeren

            if (patternType.startsWith('grid')) {
                const gridType = patternType.split('-')[1];
                createGridPattern(svg, content, gridType);
            } else if (patternType.startsWith('spiral')) {
                const spiralType = patternType.split('-')[1];
                createSpiralPattern(svg, content, spiralType);
            } else if (patternType === 'kaleidoscope') {
                createKaleidoscopePattern(svg, content);
            }
        });
    });
}

function resizeSVG(svg) {
    svg.setAttribute('width', svg.parentElement.offsetWidth);
    svg.setAttribute('height', 300); // Feste Höhe
}

function createGridPattern(svg, content, type) {
    const cols = 6;
    const rows = 6;
    const cellWidth = svg.getAttribute('width') / cols;
    const cellHeight = svg.getAttribute('height') / rows;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            if (type === 'rectangular') {
                group.setAttribute('transform', `translate(${i * cellWidth}, ${j * cellHeight})`);
            } else if (type === 'hexagonal') {
                const xOffset = (j % 2 === 0 ? 0 : cellWidth / 2);
                group.setAttribute('transform', `translate(${i * cellWidth + xOffset}, ${j * (cellHeight * 0.866)})`);
            }

            group.innerHTML = content;
            svg.appendChild(group);
        }
    }
}

function createSpiralPattern(svg, content, type) {
    const centerX = svg.getAttribute('width') / 2;
    const centerY = svg.getAttribute('height') / 2;
    const turns = 6;
    const segmentsPerTurn = 12;
    const totalSegments = turns * segmentsPerTurn;

    for (let i = 0; i < totalSegments; i++) {
        const angle = (i / segmentsPerTurn) * (2 * Math.PI);
        let radius = 15 * i;

        if (type === 'archimedean') {
            radius = 15 * i;
        } else if (type === 'logarithmic') {
            radius = 10 * Math.pow(1.1, i);
        }

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${x}, ${y})`);
        group.innerHTML = content;
        svg.appendChild(group);
    }
}

function createKaleidoscopePattern(svg, content) {
    const centerX = svg.getAttribute('width') / 2;
    const centerY = svg.getAttribute('height') / 2;
    const numSegments = 12;

    for (let i = 0; i < numSegments; i++) {
        const angle = (360 / numSegments) * i;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${centerX}, ${centerY}) rotate(${angle})`);
        group.innerHTML = content;
        svg.appendChild(group);
    }
}

// Initialisierung der Arbeitsflächen
initializeWorkspaces();
