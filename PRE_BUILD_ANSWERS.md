# Pre-Build Answers — RitemastaPro
**Date:** June 19, 2026

---

## 1. Admin Email Correction
**Confirmed.** `.env.example` will use:
```
ADMIN_EMAIL="ritemasta@gmail.com"
```
Not blemafoods@gmail.com. Fixed before build starts.

---

## 2. Flutterwave vs Paystack — My Recommendation

ChatGPT is right about the long-term architecture. Here is my honest assessment:

**For your specific situation right now:**

| Factor | Paystack | Flutterwave |
|--------|----------|-------------|
| Ghana MoMo (MTN/Telecel/AirtelTigo) | ✅ Excellent | ✅ Excellent |
| Nigeria / Kenya / South Africa | Good | Better |
| International cards (USD/EUR) | Good | Better |
| Personal bank account allowed | ✅ Yes | ✅ Yes |
| No card required to register | ✅ Yes | ✅ Yes |
| Setup simplicity | Simpler | Slightly more complex |
| Ghana approval speed | Faster | Slightly slower |

**My recommendation: Start with Flutterwave as primary.**

Reason: RitemastaPro is a global product selling to authors worldwide — not only Ghana. A Ghanaian author in London, a Nigerian author in Lagos, an academic in Kenya — all need to pay you. Flutterwave handles this better from day one. You do not pay more for global reach with Flutterwave.

**Implementation plan:**
- **Primary**: Flutterwave (Ghana MoMo + African methods + international cards)
- **Secondary/fallback**: Manual crypto payment (BTC/SOL) — stays as-is
- **Future**: Add Paystack as Ghana-specific backup when volume grows

**Build will implement Flutterwave, not Paystack.**

---

## 3. Personal Bank Account — No Problem

Yes. You can use your **personal Access Bank Ghana account** for now.

Both Flutterwave and Paystack accept personal savings accounts for individual business owners / sole traders in Ghana. You are registered as Ritemasta Publications BN360822013 — that is sufficient.

Your **expired Visa/Mastercard does not matter at all.** To register:
- ✅ Active bank account (Access Bank Ghana — confirmed active)
- ✅ Business name / Ghana card
- ✅ Phone number (Telecel is fine)
- ✅ Email address
- ❌ Debit card NOT required for merchant account registration

**Recommendation: Use Access Bank Ghana as your settlement account.**

Register at: https://flutterwave.com/gh/signup

---

## 4. Test Mode Details Clarification

**The test card and test MoMo numbers I gave you are Paystack's official sandbox test credentials — they are not real card numbers and not real phone numbers.**

They are dummy values specifically designed for testing payment flows in sandbox/test mode only. They never touch real money. No one's account. Not yours, not anyone's.

When you switch to **live mode** (after registration), only real cards and real MoMo numbers work. Your expired cards are irrelevant in both test and live mode — for live mode, it is your **customers** who pay with their own valid cards/MoMo, not you.

**For Flutterwave test credentials (sandbox):**
- Test card: `5531 8866 5214 2950` · CVV: `564` · Expiry: `09/32` · PIN: `3310`
- Test MoMo (Ghana): `0551234987` (a dummy number — only works in sandbox)
- These are Flutterwave's official published test values — safe to use in development.

---

## 5. Automated License Activation After Payment

**Yes — fully automated.**

Here is how it works end-to-end:

```
Customer pays (MoMo/Card) 
→ Flutterwave confirms payment to your server via webhook 
→ Server verifies with Flutterwave API 
→ Server marks user as unlocked in database (isUnlocked: true) 
→ User sees "✓ Lifetime Access Activated" immediately 
→ No manual intervention needed
```

User does not need a code at all. Payment confirmed = access granted automatically.

---

## 6. Manual Unlock Codes for Crypto Payments

**Crypto stays manual — here is the clean hybrid system:**

**Automated (Flutterwave):** MoMo + Cards → instant auto-activation → no code needed.

**Manual (Crypto):** BTC/SOL deposits → you verify manually → you log into Admin Panel → generate a unique unlock code → send to customer via WhatsApp/email → customer enters code on Export page → activates instantly.

**Admin Panel enhancement for this build:**
- "Generate Unlock Code" button → creates a one-time code (e.g. `RM-2026-X9K4`)
- You can add customer name + payment method + amount for your records
- Code is single-use and expires after redemption
- You copy and send via WhatsApp to the crypto payer

This is already partially in your codebase. Will be polished and extended.

---

## 7. Public Author Profile Pages — Why Removed

Removed from this build because it requires:
- A unique URL routing system (`/author/username`) — server-side routing change
- A public-facing page that does not require login
- Author choosing which projects to make public vs private
- Profile photo serving publicly

This is a meaningful feature but adds 3–4 new files and server route changes. Given the size of this build (14 files already), it was deferred to keep this session focused and deliverable.

**Decision for this build:** Keep deferred, add to the next dedicated session after this build is deployed and tested. It will be one of the highest-value features for marketing (authors share their profile link on social media → drives traffic to RitemastaPro).

---

## 8. Summary of Changes to Implementation Plan V2

| Item | Change |
|------|--------|
| Admin email | `ritemasta@gmail.com` ✅ |
| Payment gateway | **Flutterwave** (not Paystack) |
| Personal bank account | Access Bank Ghana ✅ |
| Test credentials | Flutterwave sandbox values (corrected) |
| Auto-activation | Full webhook-based automation |
| Crypto payments | Manual code via Admin Panel (hybrid) |
| Public author profiles | Deferred to next build session |
| Social login buttons | Silent — not shown |
| Paystack | Future secondary option |

---

## 9. Flutterwave Registration — Step by Step for You

1. Go to https://flutterwave.com/gh/signup
2. Email: `ritemasta@gmail.com`
3. Business name: `Ritemasta Publications`
4. Business type: `Sole Proprietorship`
5. Country: `Ghana`
6. Phone: your Telecel number
7. After sign-up → Go to **Settings → Account Verification**
8. Upload: Ghana Card + Business Registration Certificate (BN360822013)
9. Settlement bank: **Access Bank Ghana** → account number → they verify
10. Once approved (usually 24–72 hours): go to **Settings → API Keys**
11. Copy `Public Key` (pk_live_...) and `Secret Key` (sk_live_...)
12. Add both to Render environment variables
13. Come back and tell me — I will activate live mode in the code

**While waiting for approval: use test keys to test everything works.**

---

## 10. Ready to Build

All concerns addressed. Build will proceed with:
- Flutterwave (not Paystack)
- `ADMIN_EMAIL=ritemasta@gmail.com`
- Hybrid payment: Flutterwave auto-activation + Manual crypto code via Admin Panel
- Public author profiles deferred
- All other items from V2 plan unchanged

**Reply "Build" to start file generation.**
