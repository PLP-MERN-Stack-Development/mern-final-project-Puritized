import Review from "../models/reviewModel.js";

// Add review
export const addReview = async (req, res) => {
  try {
    const review = await Review.create({
      user: req.user._id,
      course: req.body.courseId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.id }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};