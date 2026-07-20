# Nest Cosmos Connect

A complete apartment management platform prototype for Nest Cosmos Apartment, Pondicherry Pattai Salai, Sholinganallur, Chennai.

## Included

- Responsive resident, admin, security, staff, accountant and auditor dashboards
- Role-based workspace switcher covering all requested user roles
- Maintenance billing, payment status, cash recording and receipt download demo
- Complaint workflow from resident to admin, staff assignment, progress and rating
- Visitor, vehicle, delivery, maid and driver gate management
- Facility booking for hall, terrace, club house, gym, play area, party hall and guest parking
- Notices, emergency alerts, polls, documents and community modules
- Staff attendance/work order cards and finance expense reporting
- PWA manifest, service worker, install prompt and offline app shell
- PostgreSQL schema draft in `database.sql`
- Production architecture notes for Next.js, Node/Express, PostgreSQL, Prisma, JWT, FCM, S3, Razorpay/Cashfree, Docker and CI/CD

## Run

Open `index.html` directly for the static prototype. For full PWA install/service-worker behavior, serve the folder:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Production Build Notes

The current implementation is a dependency-free interactive prototype. A production implementation should split the system into:

- Web: Next.js, TypeScript, Tailwind CSS
- Mobile: React Native or Capacitor apps for Android/iOS app store packaging
- API: Node.js with Express or NestJS, OpenAPI documentation and background jobs
- Database: PostgreSQL with Prisma migrations and tenant-ready community schema
- Auth: OTP, email/password, JWT refresh rotation, optional Google/Apple login and 2FA for admins
- Payments: Razorpay, Cashfree and optional PhonePe with signed webhooks
- Notifications: Firebase Cloud Messaging, email, SMS and future WhatsApp API
- Storage: S3 or Cloudinary for complaint media, documents and PDFs
- Deployment: Docker, Nginx, HTTPS on Ubuntu and GitHub Actions CI/CD
