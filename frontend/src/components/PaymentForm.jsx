import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object({
  amount: yup.number().required().positive(),
  email: yup.string().email().required(),
}).required();

export default function PaymentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('https://mern-final-project-puritized.onrender.com/routes/payments', data, { withCredentials: true });
      alert('Payment initiated successfully!');
    } catch (err) {
      console.error(err);
      alert('Payment failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 border rounded">
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input {...register('email')} className="w-full border px-2 py-1 rounded" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Amount</label>
        <input type="number" {...register('amount')} className="w-full border px-2 py-1 rounded" />
        <p className="text-red-500 text-sm">{errors.amount?.message}</p>
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Pay
      </button>
    </form>
  );
}