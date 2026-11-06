# Al Ansar Ride — বাকি কাজের তালিকা (TODO)

সর্বশেষ হালনাগাদ: ৬ নভেম্বর ২০২৬

এই ফাইলে যা যা বাকি আছে সব গোছানো আছে। যেটা করবে সেটা শুরু করার আগে এই ফাইল দেখো।

---

## ✅ যা শেষ হয়েছে (customer app)

- Google Maps/Places search (New) + 3D map + realtime driver marker
- পুরো অ্যাপ বাংলা i18n (English default, Settings থেকে বাংলা toggle)
- Settings, Profile edit, Support, Terms/Privacy পেজ
- Mishuk আইকন আলাদা করা
- সব commit + push (branch: `feature/booking`)

---

## 🚧 ১. Driver App (সবচেয়ে বড় — এখনো শুরু হয়নি)

`apps/driver/` ফোল্ডার আছে কিন্তু **সব খালি** (শুধু package.json + app.config.ts + tsconfig আছে, কোনো স্ক্রিন নেই)।

### ক) Scaffold (ভিত্তি তৈরি)
- [ ] `apps/driver/package.json`-এ customer-এর মতো সব expo dependency যোগ করা (এখন শুধু workspace packages আছে, expo/react-native নেই)
- [ ] `app.config.ts` ঠিক করা — driver-এর নিজস্ব package name (যেমন `com.inferloom.alansarridedriver`)
- [ ] `src/app/_layout.tsx` — root layout (auth guard, fonts, query client) — customer থেকে কপি করে driver-এ মানানসই করা
- [ ] `.env` — API URL, socket URL, Google key
- [ ] services/api.ts, services/storage.ts, hooks/useSession.ts (customer থেকে)

### খ) Auth (driver login)
- [ ] Driver login স্ক্রিন (role: driver) — customer-এর auth reuse করা যায়, শুধু role বদলে
- [ ] Driver registration/onboarding (গাড়ির তথ্য, লাইসেন্স ইত্যাদি — backend কী চায় দেখতে হবে)

### গ) মূল driver স্ক্রিন
- [ ] **Online/Offline toggle** — driver অনলাইন হলে রাইড রিকোয়েস্ট পাবে
- [ ] **Incoming ride requests** — নতুন রাইড এলে দেখানো (socket দিয়ে realtime)
- [ ] **Fare offer dialog** — customer-এর "নিজের ভাড়া"-র জবাবে driver accept/counter করবে (FLUTTER_TO_RN_MAP-এ `driver/fare_offer_dialog` আছে)
- [ ] **Active trip স্ক্রিন** — pickup-এ যাওয়া, arrived, started, completed; map + navigation
- [ ] **Earnings/history** — আয়ের হিসাব
- [ ] **Driver profile + account**

### ঘ) Backend endpoints যা লাগবে (নিশ্চিত করতে হবে)
- Driver-এর online/offline, location update (socket), ride accept/offer, trip status update
- `@alansar/realtime` প্যাকেজ (এখন খালি) — Socket.io client বানাতে হবে

---

## 🚧 ২. "নিজের ভাড়া বলুন" চালু করা (backend কাজ)

- অ্যাপের কোড ✅ তৈরি (ReviewScreen) — কিন্তু backend `negotiable: false` পাঠায়, তাই কার্ড দেখায় না
- **ঠিক করার জায়গা:** admin panel (`admin.alansartaxi.com`) বা backend `ride.service.js` এর `estimate()`
- backend-এ `/admin/pricing` + `/admin/vehicle-types` endpoint আছে (admin role লাগে)
- করতে হলে: admin panel-এ login করো, বা Coolify-তে `alansar-db` terminal খোলো — তখন Claude SQL query দিয়ে negotiable চালু করতে সাহায্য করবে

---

## 🚧 ৩. Vehicle 3D আইকন (premium look)

- সিদ্ধান্ত: AI (ChatGPT/Midjourney) দিয়ে প্রতিটা বাহনের 3D image বানানো (prompt দেওয়া হয়েছে)
- image বানানো হলে `apps/customer/assets/`-এ রেখে `VehicleArt.tsx`-এ `image_url` দিয়ে বসানো হবে
- বিকল্প: এখনকার SVG 3D-look রাখা (license-free)
- assets-এর পুরোনো ছবি (car.png, cng avif) ব্যবহারযোগ্য নয় (watermark/flat/JPG)

---

## 🚧 ৪. Customer app — ছোট বাকি

- [ ] Google login + auto profile image — Firebase prod-এ disabled (server-side setup তোমার কাজ); চালু হলে কোড-কাঠামো যোগ করা হবে
- [ ] Profile edit backend — অ্যাপ `PUT /users/me` ধরে কোড করা; backend-এ endpoint আছে কিনা নিশ্চিত করা দরকার
- [ ] গাড়ির নাম বাংলায় (Car/CNG/Mishuk — backend থেকে আসে, DB-তে বাংলা নাম দিতে হবে)
- [ ] আসল Android ডিভাইসে টেস্ট

---

## 🚧 ৫. তোমার হাতের কাজ (Google Console)

- [ ] API key restriction — package `com.inferloom.alansarridecustomer` + SHA-1
- [ ] Routes API `ComputeRoutes` per-day quota → 1,000 cap
- [ ] Maps SDK Android daily quota cap

---

## 🚧 ৬. Server items (তোমার VPS/Coolify)

- [ ] SMTP_PASSWORD Coolify-তে সেট (alansar-api env) — নইলে verification email যাবে না
- [ ] Firebase চালু করা (prod-এ disabled → Google login + push নেই)
- [ ] Expo account username (APK build-এর জন্য)

---

## নিয়ম (মনে রাখার জন্য)

- commit message শেষে: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- টেস্টে "Request ride" চাপা যাবে না (আসল চালকদের alert যায়)
- Production DB/server-এ হাত দেওয়ার আগে অনুমতি নিতে হবে
- পুরোনো Flutter/admin/backend repo-তে হাত দেওয়া নিষেধ
