# Terrarist-escape-board-game


## Short Description
A real-time, web-based board game for two players, inspired by classic board games with a twist of danger and strategy. Players race to the finish while avoiding terrorists, traps, and explosives, collecting knives, and using caves to leap ahead. Built with Flask and Flask-SocketIO for interactive multiplayer gameplay.

---
Preview:-
<img width="784" height="830" alt="image" src="https://github.com/user-attachments/assets/f411d928-b4b7-4352-8893-749b9da78cc2" />


---

## Features
- 🎲 Real-time, turn-based multiplayer gameplay (hot-seat or remote)
- 🗺️ 100-tile dynamic board with random placement of hazards and bonuses
- 😈 Terrorists, 🕳️ caves, 🏥 hospitals, 🔪 knives, ⚠️ traps, 💣 explosives
- Interactive UI with live updates using WebSockets
- Modern, responsive design with clear visual cues and emoji-based tiles
- Simple to run locally, no database required

---

## Gameplay Overview
- **Goal:** Be the first player to reach tile 100.
- **Turn:** Roll the dice and move forward.
- **Hazards:**
  - **Terrorist (😈):** Sent to the nearest hospital.
  - **Trap (⚠️):** Skip your next turn.
  - **Explosive (💣):** Sent to the nearest hospital and skip next turn.
- **Bonuses:**
  - **Knife (🔪):** Collect to eliminate the other player if you land on their tile.
  - **Cave (🕳️):** Jump forward to the next cave.
  - **Hospital (🏥):** Safe zone, respawn point.
- **Special:** Roll a 6 for an extra turn!

---


## Tech Stack
- **Backend:** Python, Flask, Flask-SocketIO
- **Frontend:** HTML, CSS, JavaScript (vanilla), Socket.IO

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd terrarist_game
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   > _Note: Use Flask 2.2.x for compatibility with Flask-SocketIO._
3. **Run the app:**
   ```bash
   python app.py
   ```
4. **Open your browser:**
   Go to [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## How to Play
- Open the game in your browser.
- Two players take turns rolling the dice.
- The board updates in real time with each move.
- Use knives to eliminate your opponent if you land on their tile.
- Avoid hazards and use caves to your advantage!
- First to reach tile 100 wins.

---

## Project Structure
```
app.py               # Main Flask backend and game logic
requirements.txt     # Python dependencies
/templates/
  index.html         # Main game UI
/static/
  style.css          # Game styles
  script.js          # Game logic and interactivity
```
