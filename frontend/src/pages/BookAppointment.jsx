import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5001/api/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setDoctors(data.doctors);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Book appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            doctor,
            date,
            reason
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Appointment booked successfully!");

        setDoctor("");
        setDate("");
        setReason("");

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div>
      <h1>Book Appointment</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Choose Doctor</label>

          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Select a doctor</option>

            {doctors.map((doctor) => (
              <option
                key={doctor._id}
                value={doctor._id}
              >
                {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date & Time</label>

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Reason</label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for appointment"
            required
          />
        </div>

        <button type="submit">
          Book Appointment
        </button>

      </form>
    </div>
  );
}

export default BookAppointment;