# CollabBridge — Full-Stack Influencer Marketing Platform

CollabBridge is a modern, full-stack MERN application connecting leading brands and high-performing digital creators for verified marketing partnerships.

All project code, client frontend, server backend, and utilities are located in:
- Frontend: [`collabbridge/client/`](file:///Users/aparnakohad/Desktop/25070521055/collabbridge/client)
- Backend: [`collabbridge/server/`](file:///Users/aparnakohad/Desktop/25070521055/collabbridge/server)
- Documentation: [`collabbridge/README.md`](file:///Users/aparnakohad/Desktop/25070521055/collabbridge/README.md)

---

## Quick Start Commands

```bash
# 1. Start MongoDB (if not running)
brew services start mongodb/brew/mongodb-community

# 2. Seed Demo Data (realistic fictional creators, brands, campaigns, applications, reviews)
cd collabbridge/server && npm run seed

# 3. Start Backend Server (runs on http://localhost:5001)
cd collabbridge/server && npm start

# 4. Start Frontend App (runs on http://localhost:5173)
cd collabbridge/client && npm run dev

# 5. Run Complete Integration Test Suite (18 Automated Tests)
cd collabbridge/server && node utils/verifyAll.js
```

### Demo Accounts (Password for all: `Password123!`):
- **Brand Account:** `brand@auraaudio.com` (Aura Audio Co.)
- **Creator Account:** `marcus@techcreator.io` (Marcus Chen • Technology)

For detailed MongoDB Compass setup, architecture details, and full feature documentation, please view [collabbridge/README.md](file:///Users/aparnakohad/Desktop/25070521055/collabbridge/README.md).
