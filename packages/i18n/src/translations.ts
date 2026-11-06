/**
 * English and Bangla strings for the app, as one flat map keyed by a dotted
 * path (e.g. "account.logout"). English is the source of truth and the
 * fallback: any key missing from Bangla falls back to its English text, so a
 * half-finished translation never shows a blank.
 *
 * Interpolation: wrap a slot in braces, e.g. "Member since {month}", and pass
 * `t('account.memberSince', { month })`.
 */
export const en = {
  // Tabs
  'tab.home': 'Home',
  'tab.services': 'Services',
  'tab.activity': 'Activity',
  'tab.account': 'Account',

  // Common
  'common.back': 'Back',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.retry': 'Retry',
  'common.close': 'Close',
  'common.comingSoon': 'Coming soon',

  // Home
  'home.greeting.morning': 'Good morning,',
  'home.greeting.afternoon': 'Good afternoon,',
  'home.greeting.evening': 'Good evening,',
  'home.whereTo': 'Where are you going today?',
  'home.driversOnline': '{count} drivers online near you',
  'home.searchPlaceholder': 'Where to?',
  'home.now': 'Now',

  // Booking / search
  'search.title': 'Plan your ride',
  'search.pickup': 'Pickup location',
  'search.whereTo': 'Where to?',
  'search.findingLocation': 'Finding your location…',
  'search.useCurrent': 'Use my current location',
  'search.pickupHere': 'Pickup where you are now',
  'search.locationOff': 'Location is off. Allow it, or type your pickup.',
  'search.setOnMap': 'Set location on map',
  'search.dragPickup': 'Drag the map to your pickup spot',
  'search.dragDropoff': 'Drag the map to your destination',
  'search.morePlaces': 'More places',
  'search.matching': 'Places matching “{text}”',
  'search.keepTyping': 'Keep typing…',
  'search.searching': 'Searching…',
  'search.noMatch': 'No places match “{text}”. Try a nearby landmark, or set it on the map.',
  'search.resolveFailed': "Couldn't load that place. Try another, or set it on the map.",
  'search.popular': 'Popular places',
  'search.popularError': "Couldn't load popular places.",
  'search.continueTo': 'Continue to {name}',
  'search.seeFares': 'See rides and fares',

  // Pick on map
  'pick.setDestination': 'Set your destination',
  'pick.setPickup': 'Set your pickup',
  'pick.dragPin': 'Drag the map to move the pin',
  'pick.confirmDestination': 'Confirm destination',
  'pick.confirmPickup': 'Confirm pickup',

  // Account
  'account.riderFallback': 'Al Ansar rider',
  'account.memberSince': 'Member since {month}',
  'account.personalInfo': 'Personal info',
  'account.mobile': 'Mobile',
  'account.email': 'Email',
  'account.account': 'Account',
  'account.active': 'Active',
  'account.editProfile': 'Edit profile',
  'account.map': 'Map',
  'account.mapGoogle': 'Google Maps',
  'account.mapGoogleBody': 'Default. Apple Maps on iPhone.',
  'account.mapMapbox': 'Mapbox',
  'account.mapMapboxBody': 'Clean, detailed maps by Mapbox.',
  'account.mapMapboxNoToken': 'Needs a Mapbox token; showing OpenStreetMap for now.',
  'account.language': 'Language',
  'account.languageEnglish': 'English',
  'account.languageBangla': 'বাংলা',
  'account.more': 'More',
  'account.settings': 'Settings',
  'account.scheduledRides': 'Scheduled rides',
  'account.help': 'Help & support',
  'account.terms': 'Terms & privacy',
  'account.logout': 'Log out',

  // Settings
  'settings.title': 'Settings',

  // Profile edit
  'profile.title': 'Edit profile',
  'profile.fullName': 'Full name',
  'profile.email': 'Email',
  'profile.mobile': 'Mobile',
  'profile.mobileLocked': 'Your mobile number is your login and cannot be changed here.',
  'profile.save': 'Save changes',
  'profile.saved': 'Profile updated.',
  'profile.saveError': "Couldn't save your profile. Please try again.",
  'profile.nameRequired': 'Please enter your name.',

  // Support
  'support.title': 'Help & support',
  'support.subtitle': 'We usually reply within a few hours.',
  'support.inputPlaceholder': 'Type your message…',
  'support.send': 'Send',
  'support.empty': 'Ask us anything about your rides, fares, or account.',
  'support.greeting': "Hi! How can we help you today?",
  'support.callUs': 'Call us',
  'support.emailUs': 'Email us',

  // Legal
  'legal.terms.title': 'Terms of Service',
  'legal.privacy.title': 'Privacy Policy',
} as const;

export type TranslationKey = keyof typeof en;

/**
 * Bangla strings. Keys not present here fall back to English. Fill in as the
 * translation progresses.
 */
export const bn: Partial<Record<TranslationKey, string>> = {
  // Tabs
  'tab.home': 'হোম',
  'tab.services': 'সেবা',
  'tab.activity': 'কার্যকলাপ',
  'tab.account': 'অ্যাকাউন্ট',

  // Common
  'common.back': 'পিছনে',
  'common.cancel': 'বাতিল',
  'common.confirm': 'নিশ্চিত করুন',
  'common.save': 'সংরক্ষণ',
  'common.retry': 'আবার চেষ্টা',
  'common.close': 'বন্ধ',
  'common.comingSoon': 'শীঘ্রই আসছে',

  // Home
  'home.greeting.morning': 'শুভ সকাল,',
  'home.greeting.afternoon': 'শুভ অপরাহ্ন,',
  'home.greeting.evening': 'শুভ সন্ধ্যা,',
  'home.whereTo': 'আজ কোথায় যাবেন?',
  'home.driversOnline': 'আপনার কাছে {count} জন চালক অনলাইনে',
  'home.searchPlaceholder': 'কোথায় যাবেন?',
  'home.now': 'এখন',

  // Booking / search
  'search.title': 'আপনার যাত্রা পরিকল্পনা',
  'search.pickup': 'যাত্রা শুরুর স্থান',
  'search.whereTo': 'কোথায় যাবেন?',
  'search.findingLocation': 'আপনার অবস্থান খোঁজা হচ্ছে…',
  'search.useCurrent': 'আমার বর্তমান অবস্থান ব্যবহার করুন',
  'search.pickupHere': 'আপনি এখন যেখানে আছেন সেখান থেকে',
  'search.locationOff': 'অবস্থান বন্ধ আছে। চালু করুন, অথবা যাত্রা শুরুর স্থান লিখুন।',
  'search.setOnMap': 'মানচিত্রে অবস্থান ঠিক করুন',
  'search.dragPickup': 'যাত্রা শুরুর স্থানে মানচিত্র টেনে নিন',
  'search.dragDropoff': 'গন্তব্যে মানচিত্র টেনে নিন',
  'search.morePlaces': 'আরও স্থান',
  'search.matching': '“{text}” এর সাথে মেলে এমন স্থান',
  'search.keepTyping': 'লিখতে থাকুন…',
  'search.searching': 'খোঁজা হচ্ছে…',
  'search.noMatch': '“{text}” এর সাথে কোনো স্থান মেলেনি। কাছের কোনো ল্যান্ডমার্ক দিন, অথবা মানচিত্রে ঠিক করুন।',
  'search.resolveFailed': 'স্থানটি লোড করা যায়নি। অন্যটি চেষ্টা করুন, অথবা মানচিত্রে ঠিক করুন।',
  'search.popular': 'জনপ্রিয় স্থান',
  'search.popularError': 'জনপ্রিয় স্থান লোড করা যায়নি।',
  'search.continueTo': '{name} এ এগিয়ে যান',
  'search.seeFares': 'যাত্রা ও ভাড়া দেখুন',

  // Pick on map
  'pick.setDestination': 'আপনার গন্তব্য ঠিক করুন',
  'pick.setPickup': 'আপনার যাত্রা শুরুর স্থান ঠিক করুন',
  'pick.dragPin': 'পিন সরাতে মানচিত্র টেনে নিন',
  'pick.confirmDestination': 'গন্তব্য নিশ্চিত করুন',
  'pick.confirmPickup': 'যাত্রা শুরুর স্থান নিশ্চিত করুন',

  // Account
  'account.riderFallback': 'আল আনসার যাত্রী',
  'account.memberSince': 'সদস্য {month} থেকে',
  'account.personalInfo': 'ব্যক্তিগত তথ্য',
  'account.mobile': 'মোবাইল',
  'account.email': 'ইমেইল',
  'account.account': 'অ্যাকাউন্ট',
  'account.active': 'সক্রিয়',
  'account.editProfile': 'প্রোফাইল সম্পাদনা',
  'account.map': 'মানচিত্র',
  'account.mapGoogle': 'গুগল ম্যাপস',
  'account.mapGoogleBody': 'ডিফল্ট। আইফোনে অ্যাপল ম্যাপস।',
  'account.mapMapbox': 'ম্যাপবক্স',
  'account.mapMapboxBody': 'ম্যাপবক্সের পরিষ্কার, বিস্তারিত মানচিত্র।',
  'account.mapMapboxNoToken': 'ম্যাপবক্স টোকেন দরকার; আপাতত OpenStreetMap দেখানো হচ্ছে।',
  'account.language': 'ভাষা',
  'account.languageEnglish': 'English',
  'account.languageBangla': 'বাংলা',
  'account.more': 'আরও',
  'account.settings': 'সেটিংস',
  'account.scheduledRides': 'নির্ধারিত যাত্রা',
  'account.help': 'সাহায্য ও সহায়তা',
  'account.terms': 'শর্তাবলী ও গোপনীয়তা',
  'account.logout': 'লগ আউট',

  // Settings
  'settings.title': 'সেটিংস',

  // Profile edit
  'profile.title': 'প্রোফাইল সম্পাদনা',
  'profile.fullName': 'পুরো নাম',
  'profile.email': 'ইমেইল',
  'profile.mobile': 'মোবাইল',
  'profile.mobileLocked': 'আপনার মোবাইল নম্বরই আপনার লগইন, এখানে পরিবর্তন করা যাবে না।',
  'profile.save': 'পরিবর্তন সংরক্ষণ',
  'profile.saved': 'প্রোফাইল হালনাগাদ হয়েছে।',
  'profile.saveError': 'আপনার প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।',
  'profile.nameRequired': 'অনুগ্রহ করে আপনার নাম লিখুন।',

  // Support
  'support.title': 'সাহায্য ও সহায়তা',
  'support.subtitle': 'আমরা সাধারণত কয়েক ঘণ্টার মধ্যে উত্তর দিই।',
  'support.inputPlaceholder': 'আপনার বার্তা লিখুন…',
  'support.send': 'পাঠান',
  'support.empty': 'আপনার যাত্রা, ভাড়া বা অ্যাকাউন্ট নিয়ে যেকোনো কিছু জিজ্ঞাসা করুন।',
  'support.greeting': 'হ্যালো! আজ আমরা কীভাবে সাহায্য করতে পারি?',
  'support.callUs': 'আমাদের কল করুন',
  'support.emailUs': 'আমাদের ইমেইল করুন',

  // Legal
  'legal.terms.title': 'সেবার শর্তাবলী',
  'legal.privacy.title': 'গোপনীয়তা নীতি',
};

export const translations = { en, bn } as const;
