# gRPCTalk — gRPC Chat System

gRPCTalk is a modern team chat application built around a gRPC/Connect backend and a React frontend. It is designed for rooms, direct messages, presence, typing indicators, notifications, search, and real-time collaboration.

> **Current status:** The repository currently contains the frontend demo application with local dummy data. The backend endpoint inventory below is the planned contract for the production implementation; it is documentation, not a claim that every RPC already exists.

## Product capabilities

- Email-based registration and login
- Protected workspace with rooms and direct messages
- Public room discovery and joining
- Real-time messages through a server stream
- Online, away, and offline presence
- Typing indicators
- Message history and pagination
- Message search
- Notifications and unread counts
- Profile, theme, and notification preferences
- Responsive desktop and mobile layouts
- Light, dark, and system themes

## Repository structure

```text
.
├── frontend/
│   ├── public/                 # Static assets and illustrations
│   ├── src/
│   │   ├── app/                # Providers and application routing
│   │   ├── components/ui/      # Reusable design-system primitives
│   │   ├── dev/                # Hidden design-system showcase
│   │   ├── features/workspace/ # Functional dummy-data workspace
│   │   ├── hooks/              # Shared React hooks
│   │   ├── lib/                # Theme, toast, and utility modules
│   │   └── styles/             # Tokens, globals, and animations
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── package.json
```

## Frontend demo

The current frontend is a self-contained demo and does not require a running backend.

### Run locally

```powershell
npm --prefix frontend install
npm --prefix frontend run dev
```

Open <http://localhost:5173/>.

### Available commands

```powershell
npm --prefix frontend run dev        # Start Vite development server
npm --prefix frontend run typecheck  # Run TypeScript checks
npm --prefix frontend run lint       # Run Oxlint
npm --prefix frontend run test       # Run Vitest tests
npm --prefix frontend run build      # Create a production build
npm --prefix frontend run preview    # Preview the production build
```

### Demo behavior

- Use **Explore the demo workspace** to bypass authentication.
- Use the room list to switch conversations.
- Send messages locally from the composer.
- Use `Ctrl+K` or `Cmd+K` to open search.
- Use the notification and settings controls in the top bar.
- Use `/dev/design` to inspect the design system.

## Planned production architecture

### Backend

- Go
- gRPC service definitions in Protocol Buffers
- Connect-Web compatible transport for browser clients
- PostgreSQL for users, rooms, memberships, messages, and preferences
- Redis or an equivalent pub/sub layer for multi-instance real-time fan-out
- JWT access tokens with refresh-token rotation
- Server-streaming subscription for messages, presence, and typing events

### Frontend

- React + TypeScript + Vite
- React Router
- TanStack Query for server state
- Zustand for UI and real-time state
- `@connectrpc/connect-web` for generated RPC clients
- React Hook Form + Zod for forms and validation
- Vitest + Testing Library

## Planned backend API / RPC inventory

Because this is a gRPC application, the items below are **RPC methods**, not traditional REST URLs. A Connect-Web deployment exposes each method through an HTTP endpoint generated from the service definition.

The planned contract contains **32 core RPC methods** across 7 services. With the two optional invitation-management methods, the full contract would contain **34 methods**.

| Service | Methods | Count |
|---|---|---:|
| `AuthService` | Register, Login, RefreshToken, Logout, GetSession | 5 |
| `UserService` | GetUser, UpdateProfile, SearchUsers, ListPresence, UpdatePresence | 5 |
| `RoomService` | CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom, JoinRoom, LeaveRoom, ListMembers | 8 |
| `MessageService` | SendMessage, GetMessage, EditMessage, DeleteMessage, ListMessages, SearchMessages | 6 |
| `RealtimeService` | Subscribe | 1 |
| `NotificationService` | ListNotifications, MarkNotificationRead, MarkAllNotificationsRead, GetUnreadCount | 4 |
| `PreferencesService` | GetPreferences, UpdatePreferences, UpdateNotificationPreferences | 3 |
| **Core total** |  | **32** |

> Optional additions: `CreateInvite` and `RevokeInvite` (+2). Add these only if invitation management is included in the first production release.

### 1. AuthService

| RPC | Purpose |
|---|---|
| `Register` | Create an account and return an authenticated session |
| `Login` | Validate credentials and issue access/refresh tokens |
| `RefreshToken` | Rotate an expired access token using a refresh token |
| `Logout` | Revoke the current refresh-token session |
| `GetSession` | Return the current authenticated user and session metadata |

### 2. UserService

| RPC | Purpose |
|---|---|
| `GetUser` | Fetch a user profile by ID |
| `UpdateProfile` | Update display name, avatar, bio, or timezone |
| `SearchUsers` | Search users to start a direct message |
| `ListPresence` | Return presence for a set of users |
| `UpdatePresence` | Set online, away, or offline status |

### 3. RoomService

| RPC | Purpose |
|---|---|
| `CreateRoom` | Create a public or private room |
| `GetRoom` | Fetch room metadata |
| `ListRooms` | List rooms visible to the current user |
| `UpdateRoom` | Update room name, description, or visibility |
| `DeleteRoom` | Archive or delete a room |
| `JoinRoom` | Join a public room |
| `LeaveRoom` | Leave a room |
| `ListMembers` | List room members and their presence |

### 4. MessageService

| RPC | Purpose |
|---|---|
| `SendMessage` | Send a message to a room or direct conversation |
| `GetMessage` | Fetch one message by ID |
| `EditMessage` | Edit a message owned by the current user |
| `DeleteMessage` | Soft-delete a message |
| `ListMessages` | Fetch paginated message history |
| `SearchMessages` | Search messages by text, room, author, and date |

`ListMessages` should use cursor pagination so the client can load older messages when scrolling upward. `SearchMessages` should return room metadata and message snippets so results can deep-link into a conversation.

### 5. RealtimeService

| RPC | Purpose |
|---|---|
| `Subscribe` | Server stream for new messages, edits, deletes, presence, typing, and read-state events |

The stream should accept a subscription request containing the user ID/session, room IDs, and the last received event ID. This allows reconnects to resume without silently losing events.

### 6. NotificationService

| RPC | Purpose |
|---|---|
| `ListNotifications` | Fetch paginated notifications |
| `MarkNotificationRead` | Mark one notification as read |
| `MarkAllNotificationsRead` | Mark every notification as read |
| `GetUnreadCount` | Return the notification badge count |

### 7. PreferencesService

| RPC | Purpose |
|---|---|
| `GetPreferences` | Fetch theme and notification preferences |
| `UpdatePreferences` | Save theme and general user preferences |
| `UpdateNotificationPreferences` | Configure mentions, messages, and browser notifications |

## Common request and response rules

- Every authenticated RPC receives the access token through the `Authorization: Bearer <token>` header.
- The backend must validate ownership and room membership on every message mutation.
- IDs should be opaque strings or UUIDs; clients must not depend on database integer IDs.
- Timestamps should be serialized as protobuf `Timestamp`.
- List methods should return `items`, `next_page_token`, and `total_size` where a total is cheap to calculate.
- Mutating methods should be idempotent where practical by accepting a client request ID.
- Errors should use standard gRPC status codes:
  - `Unauthenticated` for missing or expired credentials
  - `PermissionDenied` for valid users without access
  - `NotFound` for missing resources
  - `AlreadyExists` for duplicate registration or room membership
  - `InvalidArgument` for validation failures
  - `Unavailable` when a dependency is temporarily unavailable

## Core data model

The first production schema should include:

- `users`
- `sessions`
- `refresh_tokens`
- `rooms`
- `room_members`
- `direct_conversations`
- `direct_conversation_members`
- `messages`
- `message_reactions`
- `notifications`
- `user_preferences`
- `notification_preferences`

Messages should be soft-deletable so existing conversation history remains structurally consistent. Room membership should have a role column for future owner/moderator permissions.

## Real-time event types

`Subscribe` should be able to emit at least:

- `MESSAGE_CREATED`
- `MESSAGE_UPDATED`
- `MESSAGE_DELETED`
- `REACTION_UPDATED`
- `PRESENCE_UPDATED`
- `TYPING_STARTED`
- `TYPING_STOPPED`
- `NOTIFICATION_CREATED`
- `READ_STATE_UPDATED`

The frontend should reconnect with exponential backoff, avoid duplicate events using event IDs, and show an explicit connection state to the user.

## Security requirements

- Hash passwords with Argon2id or bcrypt; never store plaintext passwords.
- Store refresh tokens hashed at rest and rotate them on refresh.
- Validate message and room input on the server, not only in the browser.
- Enforce room membership for reads, writes, streams, and search.
- Rate-limit login, registration, search, and message creation.
- Do not expose database errors or token values to clients.
- Configure CORS only for known frontend origins.
- Log authentication failures and authorization denials without logging secrets.

## Suggested implementation order

1. Define `.proto` messages and service contracts.
2. Generate Go server and TypeScript Connect-Web clients.
3. Implement users, sessions, registration, login, and refresh tokens.
4. Implement rooms and memberships.
5. Implement message history and mutations.
6. Implement `Subscribe` with reconnect-safe event IDs.
7. Add notifications and preferences.
8. Replace the frontend dummy repository with generated RPC clients.
9. Add integration tests with two browser sessions and a real database.

## Production definition of done

The project is ready for release when two browser windows can:

1. Register or log in as different users.
2. Join the same room.
3. Exchange messages in real time.
4. See typing indicators and presence changes.
5. Search message history.
6. Receive and clear notifications.
7. Refresh expired access tokens without losing the session.
8. Use the application on desktop and mobile in both themes.

## License

No license has been defined for this repository yet.
