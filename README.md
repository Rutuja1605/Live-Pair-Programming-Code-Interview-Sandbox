# PairLab — Live Pair-Programming Code Interview Sandbox

A responsive, browser-based coding interview practice project built with HTML, CSS, and vanilla JavaScript.

## Features
- JavaScript code editor with line numbers, Tab indentation, adjustable font size, and Ctrl/Cmd + Enter to run.
- Runs candidate JavaScript in a sandboxed iframe and captures `console.log()` output and syntax/runtime errors.
- Three practice challenges: Two Sum, Palindrome Check, and FizzBuzz.
- Sample test-case panel, interview countdown timer, reset/pause/resume controls.
- Interview notes saved locally in the browser using `localStorage`.
- Share/copy room code and share-link actions where supported.
- Responsive layout for desktop and mobile.

## Run it
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For best results, serve the folder with VS Code Live Server or another static server.

## Important scope note
This is a working **local practice sandbox**, not a true multi-user real-time collaboration service. The room code/share button is a UI convenience; edits are not synchronized between separate browsers. Real collaborative editing requires a backend/WebSocket service (for example, Node.js + Socket.IO) and authentication/room management.

The code runner is intended for practice. Do not run untrusted code in a production environment; robust execution isolation requires a dedicated server/container sandbox with resource limits.
