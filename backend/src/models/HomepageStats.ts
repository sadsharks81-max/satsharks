import mongoose, { Schema, Document } from "mongoose";

export interface IHomepageStats extends Document {
  // Stats
  successRate: string;
  studentsMentored: string;
  eliteAdmissions: string;
  avgSatGain: string;

  // SAT Pricing PK
  satPortalPk: string;
  satGroupPk: string;
  satOneOnOnePk: string;

  // SAT Pricing Intl
  satPortalIntl: string;
  satGroupIntl: string;
  satOneOnOneIntl: string;

  // LUMS Pricing
  lumsGuidedPk: string;
  lumsCompletePk: string;
  lumsGuidedIntl: string;
  lumsCompleteIntl: string;

  // Admission Pricing PK
  admGuidedUsaPk: string;
  admCompleteUsaPk: string;
  admGuidedCanadaPk: string;
  admCompleteCanadaPk: string;
  admGuidedUkPk: string;
  admCompleteUkPk: string;
  admGuidedTurkeyPk: string;
  admCompleteTurkeyPk: string;
  admGuidedEuropePk: string;
  admCompleteEuropePk: string;
  admGuidedGulfPk: string;
  admCompleteGulfPk: string;

  // Admission Pricing Intl
  admGuidedUsaIntl: string;
  admCompleteUsaIntl: string;
  admGuidedCanadaIntl: string;
  admCompleteCanadaIntl: string;
  admGuidedUkIntl: string;
  admCompleteUkIntl: string;
  admGuidedTurkeyIntl: string;
  admCompleteTurkeyIntl: string;
  admGuidedEuropeIntl: string;
  admCompleteEuropeIntl: string;
  admGuidedGulfIntl: string;
  admCompleteGulfIntl: string;
}

const HomepageStatsSchema: Schema = new Schema(
  {
    successRate: { type: String, default: "98%" },
    studentsMentored: { type: String, default: "1,500+" },
    eliteAdmissions: { type: String, default: "250+" },
    avgSatGain: { type: String, default: "+220" },

    // SAT Pricing PK
    satPortalPk: { type: String, default: "Rs 15,000" },
    satGroupPk: { type: String, default: "Rs 40,000" },
    satOneOnOnePk: { type: String, default: "Rs 100,000" },

    // SAT Pricing Intl
    satPortalIntl: { type: String, default: "$70" },
    satGroupIntl: { type: String, default: "$300" },
    satOneOnOneIntl: { type: String, default: "$500" },

    // LUMS Pricing
    lumsGuidedPk: { type: String, default: "Rs. 30,000" },
    lumsCompletePk: { type: String, default: "Rs. 60,000" },
    lumsGuidedIntl: { type: String, default: "$300" },
    lumsCompleteIntl: { type: String, default: "$550" },

    // Admission Pricing PK
    admGuidedUsaPk: { type: String, default: "4,00,000" },
    admCompleteUsaPk: { type: String, default: "8,00,000" },
    admGuidedCanadaPk: { type: String, default: "2,50,000" },
    admCompleteCanadaPk: { type: String, default: "4,50,000" },
    admGuidedUkPk: { type: String, default: "3,00,000" },
    admCompleteUkPk: { type: String, default: "6,00,000" },
    admGuidedTurkeyPk: { type: String, default: "2,00,000" },
    admCompleteTurkeyPk: { type: String, default: "3,50,000" },
    admGuidedEuropePk: { type: String, default: "2,50,000" },
    admCompleteEuropePk: { type: String, default: "4,50,000" },
    admGuidedGulfPk: { type: String, default: "3,00,000" },
    admCompleteGulfPk: { type: String, default: "5,00,000" },

    // Admission Pricing Intl
    admGuidedUsaIntl: { type: String, default: "$2,000" },
    admCompleteUsaIntl: { type: String, default: "$4,500" },
    admGuidedCanadaIntl: { type: String, default: "$1,500" },
    admCompleteCanadaIntl: { type: String, default: "$3,000" },
    admGuidedUkIntl: { type: String, default: "$1,800" },
    admCompleteUkIntl: { type: String, default: "$3,500" },
    admGuidedTurkeyIntl: { type: String, default: "$1,200" },
    admCompleteTurkeyIntl: { type: String, default: "$2,500" },
    admGuidedEuropeIntl: { type: String, default: "$1,500" },
    admCompleteEuropeIntl: { type: String, default: "$3,000" },
    admGuidedGulfIntl: { type: String, default: "$1,800" },
    admCompleteGulfIntl: { type: String, default: "$3,200" },
  },
  { timestamps: true }
);

export default mongoose.model<IHomepageStats>("HomepageStats", HomepageStatsSchema);
