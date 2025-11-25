import Payout from "../models/payoutModel.js";

export async function seedPayouts(teachers, courses) {
  console.log("Seeding teacher payouts...");

  const payouts = [
    {
      teacher: teachers[0]._id,
      course: courses[0]._id,
      amount: 35, // Admin keeps 30%
      status: "pending",
    },
    {
      teacher: teachers[1]._id,
      course: courses[1]._id,
      amount: 52.5,
      status: "pending",
    },
  ];

  const created = await Payout.insertMany(payouts);
  console.log("Payouts seeded.");

  return created;
}