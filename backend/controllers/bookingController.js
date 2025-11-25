import Booking from '../models/bookingModel.js';
import AdminAnalytics from '../models/AdminAnalytics.js';
import eventBus from '../utils/events.js';

/* ------------------------------------------
   CREATE BOOKING
------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const payload = {
      course: req.body.course,
      user: req.user.id,
      tutor: req.body.tutor || null,
      scheduledAt: req.body.scheduledAt,
      durationMinutes: req.body.durationMinutes || 60,
      location: req.body.location || 'online',
      notes: req.body.notes || ''
    };

    const booking = await Booking.create(payload);

    // increment analytics (bookings created)
    await AdminAnalytics.updateOne(
      { date: new Date().toISOString().slice(0,10) },
      { $inc: { bookingsCreated: 1 } },
      { upsert: true }
    );

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ------------------------------------------
   GET ALL BOOKINGS (ADMIN)
------------------------------------------- */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('course user tutor');
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ------------------------------------------
   GET CURRENT USER BOOKINGS
------------------------------------------- */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('course tutor');
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ------------------------------------------
   GET SINGLE BOOKING
------------------------------------------- */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('course user tutor');
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ------------------------------------------
   UPDATE BOOKING
------------------------------------------- */
export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ------------------------------------------
   DELETE BOOKING
------------------------------------------- */
export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ------------------------------------------
   HANDLE PAYMENT SUCCESS EVENT
------------------------------------------- */
export const handlePaymentSuccess = async ({ payment }) => {
  try {
    if (!payment) return;

    if (payment.booking) {
      await Booking.findByIdAndUpdate(payment.booking, { status: 'confirmed' });
    }

    const dateKey = new Date().toISOString().slice(0,10);
    await AdminAnalytics.updateOne(
      { date: dateKey },
      { $inc: { revenueCents: payment.amount, paymentsSucceeded: 1 } },
      { upsert: true }
    );
  } catch (err) {
    console.error('handlePaymentSuccess error', err);
  }
};

// Register event listener
eventBus.on('payment:success', handlePaymentSuccess);