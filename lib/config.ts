export const config = {
  trainingCenter: {
    name: process.env.NEXT_PUBLIC_TRAINING_CENTER_NAME || 'থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার',
    address: process.env.NEXT_PUBLIC_TRAINING_CENTER_ADDRESS || 'বান্দ রোড, বরিশাল 8200',
    phone: process.env.NEXT_PUBLIC_TRAINING_CENTER_PHONE || '+8801707969391',
    email: process.env.NEXT_PUBLIC_TRAINING_CENTER_EMAIL || 'info@threestardriving.com',
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61557557160429',
    googleMapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.059527485678!2d90.36485357429086!3d22.688827828702358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37553592540275d5%3A0x8ff9f400f2f49933!2zMyDgprjgp43gpp_gpr7gprAg4Kah4KeN4Kaw4Ka-4KaH4Kat4Ka_4KaCIOCmn-CnjeCmsOCnh-CmqOCmv-CmgiDgprjgp4fgpqjgp43gpp_gp4fgprA!5e0!3m2!1sbn!2sbd!4v1768451664109!5m2!1sbn!2sbd',
    googleMapsPlaceId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACE_ID || '',
  },
};
