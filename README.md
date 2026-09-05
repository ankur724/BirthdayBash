# BirthdayBash

A birthday-surprise link you send a friend: they blow out candles, smash a cake with your face on
it, "buy" themselves an absurd fake gift, and get your real message with fireworks at the end.

- `reference/` — the original web (React) interactive preview this app is based on
- `mobile/` — Expo (React Native + TypeScript) app
- `backend/` — FastAPI + PostgreSQL API
- `docker-compose.yml` — local Postgres for development

## Quick start

```bash
docker compose up -d                 # postgres on localhost:5432
cd backend && <see backend/README.md>
cd mobile && <see mobile/README.md>
```

## How it fits together

1. The creator fills out the Setup screen in the app (name, age, message, theme, photo).
2. The app `POST`s to `/api/v1/drops`, which stores it and returns a `share_code`.
3. The experience screens (Greeting → Candles → Cake Smash → Gift Picker → Payment →
   Reveal → Message → Fireworks) walk through the surprise using that data.
4. Selecting a gift in the picker is persisted back via `PATCH /api/v1/drops/{share_code}`.

Sharing the drop with the recipient as a real deep link (rather than previewing it in the same
app session that created it) is the next piece to wire up — the backend already returns a
`share_code`, but the mobile app doesn't yet handle opening `Greeting` from a link with an
existing code instead of one just created via Setup.
