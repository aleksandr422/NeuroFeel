# MindDiary Security Notes

## Where data lives

- Entries, profile, and preferences are stored locally in the browser on this device.
- PIN protection stores a salted PBKDF2 hash in local storage.
- Session-only UI flags (hints, dismissals) are stored in session storage.

## Encryption status

- If PIN is **off**: entries are stored locally without encryption.
- If PIN is **on**: PIN hash is stored with PBKDF2 (`SHA-256`, `200000` iterations).
- Metadata trade-off: date and mood can remain readable for chart rendering without unlock flows.

## Threat model

In scope:
- Another person (parent/sibling/partner) using the same unlocked browser profile.
- Accidental data loss from browser cleanup.

Out of scope:
- Malware or keyloggers on the device.
- OS-level compromise.
- State-level adversaries.

## Explicit non-promises

- We do not protect against malware on your device.
- We do not provide account recovery for lost PIN.
- We do not guarantee forensic deletion from browser internals after cleanup.
