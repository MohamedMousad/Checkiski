# ♟️ Chess Platform Task & Bug Tracker

> **🤖 GLOBAL AGENT CONSTRAINTS & ROUTINES:**
> - **Stack Context:** Real-time multiplayer chess application. Frontend: [e.g., React/Vite]. Backend: [e.g., Node.js/Socket.io/Express]. Database: [e.g., PostgreSQL/MongoDB].
> - **Execution Rule:** Select the lowest-numbered item with `Status: [ ] Open`. Do not attempt multiple items at once.
> - **Boundary Rule:** Restrict modifications strictly to files related to the defined `Target Scope`. Do not alter structural styling, layout components, or baseline routing unless explicitly listed.
> - **Lifecycle Completion:** Upon successful resolution, rewrite the status line to `Status: [x] Resolved`, fill out the `Resolution Manifest` with the modified files, and halt execution.

---

## 🎨 UI & Display Layers

- [x] **Task ID: BUG-01**
  - **Title:** Redundant/Verbose Clock Timer String Format & Static Initialization
  - **Symptom:** The time display/counter shows an overly long, unformatted timestamp string, and does not accurately reflect the chosen time control at the start.
  - **Expected Behavior:** Force time rendering to string format `MM:SS` exclusively. Ensure the initial time populated on the clock dynamically inherits the base time of the selected game mode.
  - **Target Scope:** UI Timer component, frontend string formatting utilities, game initialization state.
  - **Verification Criteria:** Starting a Bullet game displays `01:00` initially. Starting a Blitz game displays `05:00` initially. Starting a Rapid game displays `10:00` initially. At 1 second remaining for any mode, it must read `00:01`.
  - **Status:** [x] Resolved
  - **Resolution Manifest:** 
    - Checkiski.Client/src/components/GameClock.tsx
    - Checkiski.Client/src/components/ChessBoard.tsx

- [x] **Task ID: BUG-02**
  - **Title:** Hardcoded Homepage Statistics Elements
  - **Symptom:** Landing page metrics (active players, total games played) display static placeholder values.
  - **Expected Behavior:** Implement a backend database count or cache aggregation and fetch these statistics dynamically on frontend mount via a REST API endpoint.
  - **Target Scope:** Homepage UI component, Backend stats controller, Database client layer.
  - **Verification Criteria:** Manually altering counts in the database updates the homepage text values upon a browser refresh.
  - **Status:** [x] Resolved
  - **Resolution Manifest:** 
    - Checkiski.Client/src/app/page.tsx
    - Checkiski.Application/Stats/Queries/GetSystemStats/GetSystemStatsQuery.cs
    - Checkiski.WebApi/Controllers/StatsController.cs

## ⚙️ Core Game State & Mechanics

- [x] **Task ID: BUG-03**
  - **Title:** Missing Game Termination Event on Flag Fall (Timeout)
  - **Symptom:** When a player's timer counts down to `00:00`, the board remains active, allowing subsequent moves.
  - **Expected Behavior:** Intercept the `00:00` timer event. Fire a match termination action, freeze piece interactivity, and update game state to "Finished by Timeout".
  - **Target Scope:** Game engine loop, timer hook orchestration, board state reducer.
  - **Verification Criteria:** Artificially setting a player's time to 1 second and letting it lapse immediately displays the game over modal and locks piece manipulation.
  - **Status:** [x] Resolved
  - **Resolution Manifest:** 
    - Checkiski.Client/src/components/GameClock.tsx
    - Checkiski.Client/src/components/ChessBoard.tsx
    - Checkiski.WebApi/Controllers/GameController.cs
    - Checkiski.Application/Games/Commands/TimeoutGame/TimeoutGameCommand.cs

## 🌐 Multiplayer Networking & Profiles

- [x] **Task ID: BUG-04**
  - **Title:** Unilateral Resolution of Multi-Player Draw Action
  - **Symptom:** Pressing the "Draw" button invokes an instantaneous game termination draw state without requesting confirmation from the opponent.
  - **Expected Behavior:** Emitting a draw request must dispatch a socket event to the opponent's client displaying an alert/modal. A game draw state is only evaluated if the opponent returns an accept payload.
  - **Target Scope:** WebSocket service handlers, frontend match command panel, game room state handlers.
  - **Verification Criteria:** Player A clicks "Draw" -> Board remains active. Player B receives a prompt. Player B accepts -> Game terminates as a draw.
  - **Status:** [x] Resolved
  - **Resolution Manifest:** 
    - Checkiski.Application/Common/Interfaces/IGameNotifier.cs
    - Checkiski.WebApi/Services/GameNotifier.cs
    - Checkiski.Application/Games/Commands/OfferDraw/OfferDrawCommand.cs
    - Checkiski.Client/src/components/ChessBoard.tsx

- [x] **Task ID: TASK-05**
  - **Title:** Deprecation and Complete Removal of Match Abort Functionality
  - **Symptom:** The "Abort" button is broken, confusing, and unnecessary alongside the standard "Resign" feature.
  - **Expected Behavior:** Strip out the "Abort" button DOM elements from the UI completely. Clean up any related button handlers or obsolete abort socket listeners to prevent dead code accumulation.
  - **Target Scope:** Game control UI panels, game action socket routing.
  - **Verification Criteria:** Verify that the "Abort" button is visually completely absent from the gameplay interface and that "Resign" operates correctly.
  - **Status:** [x] Resolved
  - **Resolution Manifest:** 
    - Checkiski.Client/src/components/GameControls.tsx
    - Checkiski.Client/src/components/ChessBoard.tsx
    - Checkiski.WebApi/Controllers/GameController.cs
    - Checkiski.Application/Games/Commands/AbortGame/ (Removed)

- [x] **Task ID: BUG-06**
  - **Title:** Static Profile Rating Attributes Across Game Configurations
  - **Symptom:** User profile ratings fail to calculate and display variations following match conclusions.
  - **Expected Behavior:** Hook into the post-match termination routine. Read the match result and its specific time control format category (Bullet, Blitz, Rapid). Calculate Elo/Glicko shifts, update the database user record, and ensure the profile UI reads these dynamic values.
  - **Target Scope:** Match finalization backend hook, User schema model, Player Profile dashboard view.
  - **Verification Criteria:** Winning or losing a documented match results in a numeric shift exclusively within that specific time category on the user's statistics sheet.
  - **Status:** [x] Resolved
  - **Resolution Manifest:** 
    - Checkiski.Application/Common/Helpers/GameFinalizer.cs
    - Checkiski.Application/Games/Commands/SubmitMove/SubmitMoveCommand.cs
    - Checkiski.Application/Games/Commands/ResignGame/ResignGameCommand.cs
    - Checkiski.Application/Games/Commands/OfferDraw/OfferDrawCommand.cs
    - Checkiski.Application/Games/Commands/TimeoutGame/TimeoutGameCommand.cs

- [ ] **Task ID: BUG-07**
  - **Title:** Clock Countdown Active Prior to Complete Room Synchronization
  - **Symptom:** Online matchmaking clocks begin counting down while a player is sitting alone in a room waiting for an opponent.
  - **Expected Behavior:** Clocks must default to an active state of `false`. Timers must remain entirely paused until a handshake event confirms both players have established concurrent socket connections to the game room.
  - **Target Scope:** Matchmaking connection controller, web socket connection listeners, timer initialization state.
  - **Verification Criteria:** Joining an empty room presents the base clock layout frozen at maximum time allocation. Clock only begins ticking once the second socket ID connects.
  - **Status:** [ ] Open
  - **Resolution Manifest:** ---

## 📊 Leaderboards & Analytics

- [ ] **Task ID: BUG-08**
  - **Title:** Monolithic and Static System Leaderboard View
  - **Symptom:** The ranking page uses a flat, combined roster table that completely mixes game category modes together without dynamic updates.
  - **Expected Behavior:** Implement modular API logic and UI filtering tabs for discrete chess disciplines (Bullet, Blitz, Rapid). The table must query the database sorting values dynamically based on the active tab context.
  - **Target Scope:** Leaderboard database queries, ranking interface views, tab selection event controllers.
  - **Verification Criteria:** Toggling the "Blitz" tab executes a separate fetch request and displays only users with Blitz ratings sorted in descending order.
  - **Status:** [ ] Open
  - **Resolution Manifest:** ```

Save this exact text into your project workspace. This gives your agent a highly strict, analytical blueprint to work off of, dramatically minimizing any risk of the AI "hallucinating" or introducing wild code bugs elsewhere.