import axios from 'axios'

const API_URL = 'http://localhost:5001/api'

// Create a payment
export const createPayment = async (
  appointmentId,
  amount,
  paymentMethod = 'upi'
) => {
  const token = localStorage.getItem('token')

  const response = await axios.post(
    `${API_URL}/payments/create`,
    {
      appointmentId,
      amount,
      paymentMethod,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Complete payment
export const completePayment = async (paymentId, transactionId) => {
  const token = localStorage.getItem('token')

  const response = await axios.post(
    `${API_URL}/payments/${paymentId}/pay`,
    {
      transactionId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

// Get payment
export const getPayment = async (paymentId) => {
  const token = localStorage.getItem('token')

  const response = await axios.get(
    `${API_URL}/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}