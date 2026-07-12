# FitSugar Pro

A responsive, multi-surface product prototype for culturally aware fitness coaching and gym management in India.

## Live app

https://indhupriya1989-akip.github.io/fitsugar-pro/

## Run

Open `landing.html` for the public sales website or `index.html` for the product. To enable installable PWA features, serve the folder:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Included

- Member dashboard with workouts, glucose check-in, hydration, meals, progress, and membership
- Public sales website with product, business, AI Coach, and conversion sections
- Exercise library with muscle-group filters and guidance dialogs
- Pan-India nutrition catalogue covering all 28 states and 8 union territories, plus a national mix
- FitSugar Coach conversational demo
- Gym owner console with revenue, attendance, renewals, leads, and member activity
- Persistent nine-language UI and meal localization (English, Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, and Gujarati)
- Six familiar foods per Indian region, with three selectable alternatives for every daily meal
- Three selectable alternatives for every protein drink
- Multilingual Voice Guide with screen reading, workout/meal/Coach audio, pause, resume, stop, and adjustable speed
- Installable Android/iOS PWA with launcher icons, maskable icon, offline shell and in-app installation guidance
- Dark mode, working global search, keyboard shortcut, and responsive mobile navigation
- Real royalty-free imagery loaded from Unsplash
- Offline shell caching and installable web-app metadata

## Production architecture

The prototype is intentionally dependency-free. A production build can use:

- **Web:** Next.js/React with a shared design system
- **Mobile:** React Native/Expo (Android and iOS)
- **Desktop:** Tauri wrapping the web client
- **API:** NestJS with REST/OpenAPI and background jobs
- **Data:** PostgreSQL, Redis, object storage, row-level gym tenancy
- **Auth:** Email/phone OTP plus refresh-token rotation and role-based access
- **Payments:** Razorpay subscriptions and webhooks
- **Messaging:** WhatsApp Business API, push notifications, email/SMS
- **AI:** Retrieval-backed assistant limited to reviewed exercise/nutrition content
- **i18n:** ICU message catalogues with per-locale content review

Health guidance should be reviewed by qualified clinicians and dietitians before release. The AI must not diagnose, change medication, or prescribe treatment.

## Install on a phone

Deploy the folder to an HTTPS host before installing on another device. `localhost` on a phone refers to that phone, not the development computer.

- **Android / Chrome:** open the HTTPS URL, tap **Install app** in FitSugar Pro, then confirm.
- **iPhone / Safari:** open the HTTPS URL, tap **Share**, choose **Add to Home Screen**, enable **Open as Web App**, then tap **Add**.
