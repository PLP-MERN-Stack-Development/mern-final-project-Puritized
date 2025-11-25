import Lesson from "../models/lessonModel.js";

export async function seedLessons(courses) {
  console.log("Seeding lessons...");

  const lessons = [
    {
      course: courses[0]._id,
      title: "What is Programming?",
      content: "Programming is giving instructions to a computer.",
    },
    {
      course: courses[0]._id,
      title: "Variables & Data Types",
      content: "Explanation of variables.",
    },
    {
      course: courses[1]._id,
      title: "JavaScript DOM Manipulation",
      content: "Learn how the DOM works.",
    },
    {
      course: courses[1]._id,
      title: "Async JavaScript",
      content: "Promises, async/await.",
    },
  ];

  const created = await Lesson.insertMany(lessons);
  console.log("Lessons seeded.");

  return created;
}