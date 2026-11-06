/**
 * Terms and Privacy text.
 *
 * NOTE: this is a plain-language starting draft for a ride-hailing app, not
 * legal advice. The operator must have it reviewed by a lawyer and replace the
 * company details (name, address, email) before launch. Each entry is a
 * heading + paragraphs so the screen can render it without a Markdown parser.
 */
export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { updated: string; sections: LegalSection[] };

const COMPANY = 'Al Ansar Ride';
const SUPPORT_EMAIL = 'support@alansartaxi.com';

export const terms: Record<'en' | 'bn', LegalDoc> = {
  en: {
    updated: 'Last updated: November 2026',
    sections: [
      {
        heading: '1. About these terms',
        body: [
          `These terms govern your use of the ${COMPANY} app. By creating an account or booking a ride, you agree to them. If you do not agree, please do not use the app.`,
        ],
      },
      {
        heading: '2. Your account',
        body: [
          'You must provide accurate information and keep your login details secure. You are responsible for activity on your account. You must be old enough to enter a binding contract in your country.',
        ],
      },
      {
        heading: '3. Rides and fares',
        body: [
          `${COMPANY} connects you with independent drivers. Fares shown are estimates; the final fare depends on distance, time, and any fare you agree with the driver. Payment is made directly to the driver in cash unless stated otherwise.`,
          'You agree to treat drivers with respect and to be ready at your pickup point. Drivers may decline or cancel rides.',
        ],
      },
      {
        heading: '4. Cancellations',
        body: [
          'You can cancel a ride before it starts. Repeated late cancellations may affect your ability to book.',
        ],
      },
      {
        heading: '5. Conduct',
        body: [
          'Do not use the app for anything unlawful, and do not harass, threaten, or endanger drivers or other users. We may suspend accounts that break these rules.',
        ],
      },
      {
        heading: '6. Liability',
        body: [
          `${COMPANY} provides the booking platform but is not the transport provider. To the extent allowed by law, we are not liable for the acts of independent drivers. Nothing here removes rights you have under local law.`,
        ],
      },
      {
        heading: '7. Changes and contact',
        body: [
          `We may update these terms and will post the new version in the app. Questions? Contact us at ${SUPPORT_EMAIL}.`,
        ],
      },
    ],
  },
  bn: {
    updated: 'সর্বশেষ হালনাগাদ: নভেম্বর ২০২৬',
    sections: [
      {
        heading: '১. এই শর্তাবলী সম্পর্কে',
        body: [
          `এই শর্তাবলী ${COMPANY} অ্যাপ ব্যবহারের ক্ষেত্রে প্রযোজ্য। অ্যাকাউন্ট তৈরি বা যাত্রা বুক করার মাধ্যমে আপনি এগুলো মেনে নিচ্ছেন। সম্মত না হলে অনুগ্রহ করে অ্যাপটি ব্যবহার করবেন না।`,
        ],
      },
      {
        heading: '২. আপনার অ্যাকাউন্ট',
        body: [
          'আপনাকে সঠিক তথ্য দিতে হবে এবং লগইন তথ্য নিরাপদ রাখতে হবে। আপনার অ্যাকাউন্টের কার্যকলাপের দায়িত্ব আপনার। চুক্তিতে আবদ্ধ হওয়ার মতো বয়স আপনার থাকতে হবে।',
        ],
      },
      {
        heading: '৩. যাত্রা ও ভাড়া',
        body: [
          `${COMPANY} আপনাকে স্বাধীন চালকদের সাথে যুক্ত করে। দেখানো ভাড়া আনুমানিক; চূড়ান্ত ভাড়া দূরত্ব, সময় এবং চালকের সাথে আপনার সম্মত ভাড়ার উপর নির্ভর করে। অন্যথায় উল্লেখ না থাকলে ভাড়া সরাসরি চালককে নগদে পরিশোধ করতে হয়।`,
          'আপনি চালকদের সাথে সম্মানজনক আচরণ করতে এবং যাত্রা শুরুর স্থানে প্রস্তুত থাকতে সম্মত হচ্ছেন। চালকরা যাত্রা প্রত্যাখ্যান বা বাতিল করতে পারেন।',
        ],
      },
      {
        heading: '৪. বাতিলকরণ',
        body: [
          'যাত্রা শুরুর আগে আপনি বাতিল করতে পারেন। বারবার দেরিতে বাতিল করলে বুকিং করার সক্ষমতা প্রভাবিত হতে পারে।',
        ],
      },
      {
        heading: '৫. আচরণ',
        body: [
          'অ্যাপটি কোনো বেআইনি কাজে ব্যবহার করবেন না এবং চালক বা অন্য ব্যবহারকারীদের হয়রানি, হুমকি বা বিপদে ফেলবেন না। এই নিয়ম ভাঙলে আমরা অ্যাকাউন্ট স্থগিত করতে পারি।',
        ],
      },
      {
        heading: '৬. দায়',
        body: [
          `${COMPANY} বুকিং প্ল্যাটফর্ম সরবরাহ করে, কিন্তু পরিবহন সেবাদাতা নয়। আইন যতটা অনুমতি দেয়, স্বাধীন চালকদের কাজের জন্য আমরা দায়ী নই। স্থানীয় আইনে আপনার যে অধিকার আছে তা এখানে কিছুই বাতিল করে না।`,
        ],
      },
      {
        heading: '৭. পরিবর্তন ও যোগাযোগ',
        body: [
          `আমরা এই শর্তাবলী হালনাগাদ করতে পারি এবং নতুন সংস্করণ অ্যাপে প্রকাশ করব। প্রশ্ন থাকলে ${SUPPORT_EMAIL} ঠিকানায় যোগাযোগ করুন।`,
        ],
      },
    ],
  },
};

export const privacy: Record<'en' | 'bn', LegalDoc> = {
  en: {
    updated: 'Last updated: November 2026',
    sections: [
      {
        heading: '1. What we collect',
        body: [
          'We collect the details you give us (name, phone, email), your location while you use the app to book and track rides, and ride history. We collect basic device and usage data to run the service.',
        ],
      },
      {
        heading: '2. How we use it',
        body: [
          'We use your data to match you with drivers, show the map and route, estimate fares, provide support, and keep the service safe. We share only what a driver needs to complete your ride.',
        ],
      },
      {
        heading: '3. Location',
        body: [
          'The app uses your location to set your pickup, show you on the map, and track an active ride. You can turn location off in your device settings, but some features will not work.',
        ],
      },
      {
        heading: '4. Sharing',
        body: [
          'We do not sell your personal data. We share data with drivers for your ride, and with service providers that help us run the app (such as maps and messaging), under appropriate safeguards.',
        ],
      },
      {
        heading: '5. Your choices',
        body: [
          `You can edit your profile in the app and ask us to delete your account. Contact ${SUPPORT_EMAIL} for data requests.`,
        ],
      },
      {
        heading: '6. Contact',
        body: [`Questions about your privacy? Email ${SUPPORT_EMAIL}.`],
      },
    ],
  },
  bn: {
    updated: 'সর্বশেষ হালনাগাদ: নভেম্বর ২০২৬',
    sections: [
      {
        heading: '১. আমরা যা সংগ্রহ করি',
        body: [
          'আপনার দেওয়া তথ্য (নাম, ফোন, ইমেইল), যাত্রা বুক ও ট্র্যাক করতে অ্যাপ ব্যবহারের সময় আপনার অবস্থান এবং যাত্রার ইতিহাস আমরা সংগ্রহ করি। সেবা চালাতে প্রাথমিক ডিভাইস ও ব্যবহারের তথ্য সংগ্রহ করি।',
        ],
      },
      {
        heading: '২. কীভাবে ব্যবহার করি',
        body: [
          'আপনার তথ্য আমরা চালকের সাথে মেলাতে, মানচিত্র ও রুট দেখাতে, ভাড়া অনুমান করতে, সহায়তা দিতে এবং সেবা নিরাপদ রাখতে ব্যবহার করি। যাত্রা সম্পন্ন করতে চালকের যা প্রয়োজন কেবল তাই শেয়ার করি।',
        ],
      },
      {
        heading: '৩. অবস্থান',
        body: [
          'অ্যাপটি আপনার অবস্থান ব্যবহার করে যাত্রা শুরুর স্থান ঠিক করতে, মানচিত্রে দেখাতে এবং সক্রিয় যাত্রা ট্র্যাক করতে। ডিভাইস সেটিংসে অবস্থান বন্ধ করতে পারেন, তবে কিছু সুবিধা কাজ করবে না।',
        ],
      },
      {
        heading: '৪. শেয়ার করা',
        body: [
          'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। আপনার যাত্রার জন্য চালকের সাথে এবং অ্যাপ চালাতে সহায়তাকারী সেবাদাতাদের (যেমন মানচিত্র ও বার্তা) সাথে উপযুক্ত সুরক্ষার অধীনে তথ্য শেয়ার করি।',
        ],
      },
      {
        heading: '৫. আপনার পছন্দ',
        body: [
          `অ্যাপে আপনি আপনার প্রোফাইল সম্পাদনা করতে এবং অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারেন। ডেটা সংক্রান্ত অনুরোধে ${SUPPORT_EMAIL} ঠিকানায় যোগাযোগ করুন।`,
        ],
      },
      {
        heading: '৬. যোগাযোগ',
        body: [`গোপনীয়তা নিয়ে প্রশ্ন? ইমেইল করুন ${SUPPORT_EMAIL}।`],
      },
    ],
  },
};
