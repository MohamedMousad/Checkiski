# Checkiski

Checkiski is a modern, real-time multiplayer chess platform built with a Next.js React frontend and a .NET 8 WebApi backend. It features an integrated custom C# chess engine, real-time WebSocket communication, and an interactive UI powered by Stockfish WebAssembly.

## Architecture & Tech Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind/Custom CSS, `chess.js` (for UI board validation), SignalR Client, Stockfish.js (WebAssembly).
- **Backend**: .NET 8 WebApi, MediatR (CQRS Pattern), Entity Framework Core (PostgreSQL), ASP.NET Core SignalR (Real-time events).
- **Caching & Matchmaking**: Redis.
- **Authentication**: JWT Bearer Tokens.

## Project Features

### Real-Time Multiplayer
- Live move broadcasting via SignalR.
- Seamless reconnects and persistent game states using PGN loading.
- Sub-second synchronized Game Clocks for true Bullet/Blitz/Rapid gameplay.

### Gameplay Mechanics
- **Custom Game Creation**: Select Time Controls (Bullet 1|0, Blitz 3|0, Rapid 10|0, Classical 30|0), Color (White, Black, Random), and Ranked status.
- **In-Game Actions**: Resign, Offer Draw, Abort Game.
- **Live Chat**: Send messages instantly to your opponent within the match room.
- **Move Tracking**: Interactive Move History panel with step-by-step PGN review.

### Analysis & Stockfish
- Built-in Stockfish 16.1 engine running directly in the browser via WebAssembly.
- Analysis mode after game completion, rendering evaluation bars and drawing arrows for the best mathematical move on the board.

### Player Ecosystem
- User authentication and secure JWT validation.
- User Profiles: View and edit Username, Avatar URL, Bio, and Country.
- ELO tracking framework.

---

## Testing & Quality Assurance

Extensive testing has been done to ensure engine stability and network reliability. Below are the key test cases executed:

### 1. Engine & Rules Validation (C# xUnit Tests)
- **Pawn Mechanics**: Validated standard pushes, double-step pushes, diagonal captures, En Passant edge cases, and automated Queen promotion.
- **King & Castling**: Tested absolute bounds limits, ensuring castling calculations don't throw Out-Of-Bounds exceptions. Ensured castling is prohibited if moving through check.
- **Mate Detection**: Validated deep Checkmate and Stalemate scenarios. Ensured the color checking logic perfectly switches turns and evaluates the correct king.

### 2. Networking & API Testing
- **Game Creation**: Validated complex JSON payloads, fixing initial 400 Bad Request issues by mapping parameters cleanly to DTOs.
- **Circular Serialization**: Confirmed EF Core navigational loops (e.g. `Game` -> `WhitePlayer` -> `GamesAsWhite`) do not break API responses, successfully mitigated by DTO mapping and `.IgnoreCycles` configuration.

### 3. Real-Time Sync (SignalR)
- **Clock Synchronization**: Validated that the backend properly broadcasts `WhiteClock` and `BlackClock` remaining times upon every move, and that the frontend updates its timers accurately.
- **State Preservation**: Confirmed that refreshing the browser fetches the latest PGN and FEN, cleanly rebuilding the board state without desynchronizing.

### 4. End-to-End UI Testing (Playwright)
- Verified automated login flows.
- Automated tests simulating piece dragging/dropping.
- Validated real-time UI reactions to game end conditions (Checkmate overlays, Resign handshakes).

---

## Getting Started (How to Run)

To run this project on your local machine, ensure you have the following prerequisites installed:
- **Node.js** (v18 or higher)
- **.NET 8 SDK**
- **PostgreSQL** (Running on default port 5432)
- **Redis** (Running on default port 6379)

*(Note: On Windows, you can right-click and run `install_dbs.ps1` with PowerShell to automatically install PostgreSQL and Redis via Chocolatey).*

### Quick Start (Windows)
We have included a startup script to make running the project as easy as possible:
1. Open PowerShell and navigate to the root of the project.
2. Run the `start_project.ps1` script:
   ```powershell
   .\start_project.ps1
   ```
This script will automatically:
- Install all Node.js dependencies (`npm install`) for the frontend.
- Apply Entity Framework Core database migrations to create the PostgreSQL tables.
- Launch the **Backend API** in a new window (`http://localhost:5000`).
- Launch the **Next.js Frontend** in a new window (`http://localhost:3000`).

### Manual Setup
If you are on macOS/Linux or prefer to run the commands manually:

1. **Database Setup**:
   Ensure PostgreSQL and Redis are running. Verify your connection string in `Checkiski.WebApi/appsettings.json`.
   ```bash
   cd Checkiski.Infrastructure
   dotnet ef database update --startup-project ../Checkiski.WebApi
   ```

2. **Start Backend**:
   ```bash
   cd Checkiski.WebApi
   dotnet run
   ```

3. **Start Frontend**:
   ```bash
   cd Checkiski.Client
   npm install
   npm run dev
   ```
Open `http://localhost:3000` in your browser and enjoy the game!
