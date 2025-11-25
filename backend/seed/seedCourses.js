import Course from "../models/courseModel.js";

export async function seedCourses(teachers) {
  console.log("Seeding courses...");

  const courses = [
    {
      title: "Introduction to Programming",
      description: "Learn the basics of programming from scratch.",
      teacher: teachers[0]._id,
      price: 50,
    },
    {
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript concepts.",
      teacher: teachers[1]._id,
      price: 75,
    },
  ];

  const created = await Course.insertMany(courses);
  console.log("Courses seeded.");

  return created;
}