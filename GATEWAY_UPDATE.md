# Payment Gateway — Final Decision Update
**Date:** June 19, 2026

---

## Flutterwave — Rejected (Ghana waitlist, $5M+ volume requirement)
Not viable for RitemastaPro at this stage. Good to know early.

---

## Final Decision: Paystack ✅

Paystack Ghana is fully licensed, widely used, and accepts:
- MTN Mobile Money ✅
- Telecel Cash ✅
- AirtelTigo Money ✅
- Visa / Mastercard ✅
- Bank Transfer ✅
- USSD ✅

No minimum volume requirement. Designed exactly for businesses like yours.

---

## Your Paystack Registration Status

You registered but account activation is pending. To complete:

1. Log in at https://dashboard.paystack.com
2. Go to **Settings → Business Information**
3. Upload:
   - Ghana Card (both sides)
   - Business Registration Certificate (BN360822013)
   - Proof of bank account (Access Bank Ghana statement or cheque leaf)
4. Once submitted → approval usually within 24–48 hours
5. After approval → **Settings → API Keys & Webhooks**
6. Copy your **Public Key** (`pk_live_...`) and **Secret Key** (`sk_live_...`)
7. Add to Render environment variables:
   - `PAYSTACK_SECRET_KEY` = `sk_live_...`
   - `PAYSTACK_PUBLIC_KEY` = `pk_live_...`

---

## Test Mode (Use While Waiting for Activation)

You can test the full payment flow immediately with test keys:

- Go to **Settings → API Keys** → toggle to **Test Mode**
- Copy test keys (`pk_test_...` / `sk_test_...`)
- Test card: `4084 0840 8408 4081` · CVV: `408` · Expiry: `01/25`
- Test MoMo (Ghana): `0551234987` (dummy — sandbox only)

These let you verify the entire payment flow works before going live.

---

## Build Change: Paystack (Not Flutterwave)

All payment integration files will use Paystack API.
No other changes to the V2 implementation plan.

**Ready to build when you say "Build".**
