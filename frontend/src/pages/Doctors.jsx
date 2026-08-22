import { useEffect, useState } from "react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // Fetch all doctors
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

        console.log("DOCTORS RESPONSE:", data);

        if (response.ok) {
          setDoctors(data.doctors);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Create doctor
  const handleCreateDoctor = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/doctors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            phone,
            specialization
          })
        }
      );

      const data = await response.json();

      console.log("CREATE DOCTOR RESPONSE:", data);

      if (response.ok) {
        alert("Doctor created successfully");

        setDoctors((prevDoctors) => [
          ...prevDoctors,
          data.doctor
        ]);

        setUserId("");
        setPhone("");
        setSpecialization("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/doctors/${doctorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("DELETE DOCTOR RESPONSE:", data);

      if (response.ok) {
        alert("Doctor deleted successfully");

        setDoctors((prevDoctors) =>
          prevDoctors.filter(
            (doctor) => doctor._id !== doctorId
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleUpdateDoctor = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5001/api/doctors/${editingDoctorId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          phone,
          specialization
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Doctor updated successfully");

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === editingDoctorId
            ? data.doctor
            : doctor
        )
      );

      setEditingDoctorId(null);
      setUserId("");
      setPhone("");
      setSpecialization("");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error updating doctor:", error);
  }
};

  return (
    <div>
      <h1>Doctor Management</h1>

      <h2>Add Doctor</h2>

     <form
  onSubmit={
    editingDoctorId
      ? handleUpdateDoctor
      : handleCreateDoctor
  }
>
        <div>
          <label>User ID</label>

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            required
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div>
          <label>Specialization</label>

          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Enter specialization"
            required
          />
        </div>

       <button type="submit">
  {editingDoctorId ? "Update Doctor" : "Create Doctor"}
</button>
      </form>

      <hr />

      <h2>Doctors</h2>

      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        doctors.map((doctor) => (
          <div key={doctor._id}>
            <p>
              <strong>Phone:</strong> {doctor.phone}
            </p>

            <p>
              <strong>Specialization:</strong>{" "}
              {doctor.specialization}
            </p>
            <button
  onClick={() => {
    setEditingDoctorId(doctor._id);
    setUserId(doctor.userId);
    setPhone(doctor.phone);
    setSpecialization(doctor.specialization);
  }}
>
  Edit
</button>

            <button
              onClick={() => handleDeleteDoctor(doctor._id)}
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Doctors;