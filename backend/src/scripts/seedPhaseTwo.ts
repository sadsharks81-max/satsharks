import "../config/env";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import QuestionCategory from "../models/QuestionCategory";
import Question from "../models/Question";
import DiagnosticTest from "../models/DiagnosticTest";

const categories = [
  { name: "Algebra", section: "MATH", description: "Linear equations, inequalities, and systems" },
  { name: "Advanced Math", section: "MATH", description: "Quadratics, polynomials, and exponentials" },
  { name: "Geometry & Trigonometry", section: "MATH", description: "Area, volume, angles, and trig" },
  { name: "Problem Solving", section: "MATH", description: "Data analysis, ratios, and percentages" },
  { name: "Reading Comprehension", section: "READING_WRITING", description: "Passage analysis and inference" },
  { name: "Grammar & Usage", section: "READING_WRITING", description: "Standard English conventions" },
  { name: "Vocabulary in Context", section: "READING_WRITING", description: "Word meaning and usage" },
  { name: "Expression of Ideas", section: "READING_WRITING", description: "Organization and rhetoric" },
];

const sampleQuestions = [
  {
    text: "If 3x + 7 = 22, what is the value of x?",
    options: [
      { label: "A", text: "3" },
      { label: "B", text: "5" },
      { label: "C", text: "7" },
      { label: "D", text: "15" },
    ],
    correctAnswer: "B",
    explanation: "3x + 7 = 22 → 3x = 15 → x = 5",
    categoryName: "Algebra",
    difficulty: "EASY",
    section: "MATH",
  },
  {
    text: "A rectangle has a length that is 3 times its width. If the perimeter is 48, what is the width?",
    options: [
      { label: "A", text: "4" },
      { label: "B", text: "6" },
      { label: "C", text: "8" },
      { label: "D", text: "12" },
    ],
    correctAnswer: "B",
    explanation: "Let width = w. Length = 3w. Perimeter = 2(w + 3w) = 8w = 48. w = 6.",
    categoryName: "Geometry & Trigonometry",
    difficulty: "MEDIUM",
    section: "MATH",
  },
  {
    text: "If f(x) = x² - 4x + 3, what are the zeros of f?",
    options: [
      { label: "A", text: "1 and 3" },
      { label: "B", text: "-1 and -3" },
      { label: "C", text: "2 and 6" },
      { label: "D", text: "-1 and 3" },
    ],
    correctAnswer: "A",
    explanation: "x² - 4x + 3 = (x - 1)(x - 3) = 0. Zeros are x = 1 and x = 3.",
    categoryName: "Advanced Math",
    difficulty: "MEDIUM",
    section: "MATH",
  },
  {
    text: "A store increases its prices by 20%, then offers a 20% discount. What is the net effect on the original price?",
    options: [
      { label: "A", text: "No change" },
      { label: "B", text: "4% decrease" },
      { label: "C", text: "4% increase" },
      { label: "D", text: "2% decrease" },
    ],
    correctAnswer: "B",
    explanation: "Original = 100. After 20% increase = 120. After 20% discount on 120 = 120 × 0.8 = 96. Net = 4% decrease.",
    categoryName: "Problem Solving",
    difficulty: "HARD",
    section: "MATH",
  },
  {
    text: "Which choice best describes the function of the underlined sentence in the overall structure of the passage?",
    options: [
      { label: "A", text: "It provides a specific example to illustrate a general claim." },
      { label: "B", text: "It introduces a counterargument to the main thesis." },
      { label: "C", text: "It summarizes the findings of a cited study." },
      { label: "D", text: "It transitions between two contrasting viewpoints." },
    ],
    correctAnswer: "A",
    explanation: "The sentence gives a concrete instance that supports the broader argument made in the paragraph.",
    categoryName: "Reading Comprehension",
    difficulty: "MEDIUM",
    section: "READING_WRITING",
  },
  {
    text: 'Choose the option that correctly completes the sentence: "The committee _____ their decision yesterday."',
    options: [
      { label: "A", text: "have announced" },
      { label: "B", text: "announced" },
      { label: "C", text: "are announcing" },
      { label: "D", text: "announces" },
    ],
    correctAnswer: "B",
    explanation: '"Yesterday" indicates past tense. "Announced" is the simple past form that agrees with the subject.',
    categoryName: "Grammar & Usage",
    difficulty: "EASY",
    section: "READING_WRITING",
  },
];

const seedPhaseTwo = async () => {
  const connected = await connectDB();
  if (!connected) throw new Error("DATABASE_URL is required.");

  // Seed categories
  for (const cat of categories) {
    await QuestionCategory.updateOne(
      { name: cat.name },
      { $set: cat },
      { upsert: true }
    );
  }
  console.log(`Seeded ${categories.length} categories.`);

  // Seed sample questions
  const allCats = await QuestionCategory.find();
  const catMap = new Map(allCats.map((c) => [c.name, c._id]));

  for (const q of sampleQuestions) {
    const categoryId = catMap.get(q.categoryName);
    if (!categoryId) continue;
    await Question.updateOne(
      { text: q.text },
      {
        $set: {
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          category: categoryId,
          difficulty: q.difficulty,
          section: q.section,
          source: "MANUAL",
          status: "PUBLISHED",
        },
      },
      { upsert: true }
    );
  }
  console.log(`Seeded ${sampleQuestions.length} sample questions.`);

  // Create a sample diagnostic test
  const mathQuestions = await Question.find({ section: "MATH", status: "PUBLISHED" }).limit(4);
  if (mathQuestions.length > 0) {
    await DiagnosticTest.updateOne(
      { title: "SAT Math Diagnostic – Quick Test" },
      {
        $set: {
          title: "SAT Math Diagnostic – Quick Test",
          description: "A short diagnostic test to assess your math fundamentals.",
          section: "MATH",
          questions: mathQuestions.map((q) => q._id),
          timeLimit: 15,
          totalMarks: mathQuestions.length,
          isActive: true,
          accessLevel: "FREE",
        },
      },
      { upsert: true }
    );
    console.log("Seeded sample diagnostic test.");
  }

  const rwQuestions = await Question.find({ section: "READING_WRITING", status: "PUBLISHED" }).limit(2);
  if (rwQuestions.length > 0) {
    await DiagnosticTest.updateOne(
      { title: "SAT Reading & Writing – Mini Test" },
      {
        $set: {
          title: "SAT Reading & Writing – Mini Test",
          description: "A quick assessment of your reading and writing skills.",
          section: "READING_WRITING",
          questions: rwQuestions.map((q) => q._id),
          timeLimit: 10,
          totalMarks: rwQuestions.length,
          isActive: true,
          accessLevel: "FREE",
        },
      },
      { upsert: true }
    );
    console.log("Seeded sample R&W diagnostic test.");
  }

  console.log("Phase 2 seed complete!");
};

seedPhaseTwo()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
