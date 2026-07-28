export const phaseOneSubscriptionPlans = [
  {
    name: "Local Free",
    price: "$0",
    period: "forever",
    description: "Basic SAT prep access for local students.",
    features: [
      "Access to free diagnostic test",
      "Basic study resources",
      "Community forum access",
      "1 college prep webinar per month",
    ],
    roleRequired: "LOCAL_FREE",
  },
  {
    name: "Local Premium",
    price: "$199",
    period: "per month",
    description: "Premium SAT prep and mentoring for local students.",
    features: [
      "Everything in Local Free",
      "Full proprietary curriculum",
      "4 expert mentoring sessions per month",
      "Unlimited essay reviews",
      "Personalized study plan",
    ],
    roleRequired: "LOCAL_PAID",
    highlight: true,
  },
  {
    name: "International Free",
    price: "$0",
    period: "forever",
    description: "Basic SAT prep access for international students.",
    features: [
      "Access to free diagnostic test",
      "Basic study resources",
      "International admissions guide",
      "Visa basics webinar",
    ],
    roleRequired: "INTL_FREE",
  },
  {
    name: "International Premium",
    price: "$299",
    period: "per month",
    description:
      "Complete SAT prep and admissions support for international students.",
    features: [
      "Everything in International Free",
      "Full proprietary curriculum",
      "4 expert mentoring sessions per month",
      "Unlimited essay reviews",
      "Comprehensive visa and admissions counseling",
    ],
    roleRequired: "INTL_PAID",
    highlight: true,
  },
];

export const phaseOneSuccessStories = [
  {
    name: "Sarah M.",
    score: "Scored 1580 (+210)",
    quote: "The personalized study plan was a game-changer.",
    university: "Harvard University",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    name: "David L.",
    score: "Scored 1550 (+180)",
    quote: "The instructors genuinely care about your success.",
    university: "Stanford University",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];
