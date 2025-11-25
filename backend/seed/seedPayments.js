import Payment from "../models/paymentModel.js";

export async function seedPayments(students, courses) {
  console.log("Seeding payments...");

  const payments = [
    {
      student: students[0]._id,
      course: courses[0]._id,
      amount: courses[0].price,
      status: "completed",
      provider: "paystack",
    },
    {
      student: students[1]._id,
      course: courses[1]._id,
      amount: courses[1].price,
      status: "completed",
      provider: "paystack",
    },
  ];

  const created = await Payment.insertMany(payments);
  console.log("Payments seeded.");

  return created;
}