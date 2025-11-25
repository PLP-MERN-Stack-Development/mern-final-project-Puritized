import Enrollment from "../models/enrollmentModel.js";

export async function seedEnrollments(students, courses) {
  console.log("Seeding enrollments...");

  const enrollments = [
    {
      student: students[0]._id,
      course: courses[0]._id,
      progress: 10,
    },
    {
      student: students[1]._id,
      course: courses[1]._id,
      progress: 0,
    },
  ];

  const created = await Enrollment.insertMany(enrollments);
  console.log("Enrollments seeded.");

  return created;
}