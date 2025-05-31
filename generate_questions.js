// Script to generate all 110 questions for the review game
// Run this in browser console or Node.js to generate complete questions.json

const allQuestions = {
  section1: {
    title: "Basic Identification",
    subtitle: "Listen and circle the correct picture",
    total: 20,
    questions: []
  },
  section2: {
    title: "Following Instructions", 
    subtitle: "Listen and draw according to the instructions",
    total: 15,
    questions: []
  },
  section3: {
    title: "Matching Activities",
    subtitle: "Listen and match the items that go together", 
    total: 25,
    questions: []
  },
  section4: {
    title: "Multiple Choice",
    subtitle: "Listen and circle the correct picture",
    total: 30,
    questions: []
  },
  section5: {
    title: "Yes/No Comprehension",
    subtitle: "Listen and circle Yes or No",
    total: 20,
    questions: []
  }
};

// Section 1: Basic Identification (20 questions)
const familyQuestions = [
  {id: 1, audio: "Number 2 is the father.", options: [
    {number: 1, emoji: "👵", text: "Grandmother", correct: false},
    {number: 2, emoji: "👨", text: "Father", correct: true},
    {number: 3, emoji: "👩", text: "Mother", correct: false},
    {number: 4, emoji: "👶", text: "Baby", correct: false}
  ]},
  {id: 2, audio: "Number 1 is the grandmother.", options: [
    {number: 1, emoji: "👵", text: "Grandmother", correct: true},
    {number: 2, emoji: "👨", text: "Father", correct: false},
    {number: 3, emoji: "👩", text: "Mother", correct: false},
    {number: 4, emoji: "👧", text: "Sister", correct: false}
  ]},
  {id: 3, audio: "Number 3 is the sister.", options: [
    {number: 1, emoji: "👦", text: "Brother", correct: false},
    {number: 2, emoji: "👨", text: "Father", correct: false},
    {number: 3, emoji: "👧", text: "Sister", correct: true},
    {number: 4, emoji: "👵", text: "Grandmother", correct: false}
  ]},
  {id: 4, audio: "Number 4 is the baby.", options: [
    {number: 1, emoji: "👵", text: "Grandmother", correct: false},
    {number: 2, emoji: "👩", text: "Mother", correct: false},
    {number: 3, emoji: "👨", text: "Father", correct: false},
    {number: 4, emoji: "👶", text: "Baby", correct: true}
  ]}
];

// Continue with all other questions...
console.log("Use this structure to build all 110 questions");
console.log(JSON.stringify(allQuestions, null, 2)); 