import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  createPayment,
  completePayment,
} from '../services/paymentService'

function Payment() {
  const [searchParams] = useSearchParams()

  const appointmentId = searchParams.get('appointmentId')

  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const amount = 500

  const handlePayment = async () => {
    try {
      setLoading(true)
      setError('')

      if (!appointmentId) {
        setError('Appointment ID is missing')
        return
      }

      // Step 1: Create payment
      const createResponse = await createPayment(
        appointmentId,
        amount,
        'upi'
      )

      const paymentData = createResponse.payment

      setPayment(paymentData)

      // Step 2: Simulate successful payment
      const transactionId = `TXN-${Date.now()}`

      const completeResponse = await completePayment(
        paymentData._id,
        transactionId
      )

      setPayment(completeResponse.payment)

    } catch (error) {
      console.error('Payment error:', error)

      setError(
        error.response?.data?.message ||
        'Payment failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2>Appointment Payment</h2>

        <div style={styles.details}>
          <p>
            <strong>Appointment ID:</strong>
          </p>

          <p>{appointmentId || 'Not provided'}</p>

          <p>
            <strong>Amount:</strong> ₹{amount}
          </p>

          <p>
            <strong>Payment Method:</strong> UPI
          </p>
        </div>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {!payment && (
          <button
            onClick={handlePayment}
            disabled={loading || !appointmentId}
            style={styles.button}
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        )}

        {payment && payment.status === 'paid' && (
          <div style={styles.success}>
            <h3>Payment Successful ✅</h3>

            <p>
              <strong>Amount:</strong> ₹{payment.amount}
            </p>

            <p>
              <strong>Status:</strong> {payment.status}
            </p>

            <p>
              <strong>Transaction ID:</strong>{' '}
              {payment.transactionId}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },

  card: {
    width: '400px',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    backgroundColor: '#fff',
  },

  details: {
    margin: '20px 0',
  },

  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },

  success: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#dcfce7',
  },

  error: {
    color: '#dc2626',
  },
}

export default Payment