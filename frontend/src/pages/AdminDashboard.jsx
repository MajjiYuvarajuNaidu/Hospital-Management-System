import { useEffect, useState } from "react";

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5001/api/admin/dashboard",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch dashboard");
                }

                setDashboard(data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        };

        fetchDashboard();

    }, []);


    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }


    if (error) {
        return <h2>{error}</h2>;
    }


    return (
        <div>

            <h1>Admin Dashboard</h1>

            <div>
                <h3>Total Users</h3>
                <p>{dashboard.totalUsers}</p>
            </div>

            <div>
                <h3>Total Doctors</h3>
                <p>{dashboard.totalDoctors}</p>
            </div>

            <div>
                <h3>Total Patients</h3>
                <p>{dashboard.totalPatients}</p>
            </div>

            <div>
                <h3>Total Appointments</h3>
                <p>{dashboard.totalAppointments}</p>
            </div>


            <h2>Appointment Statistics</h2>

            <div>
                <p>
                    Pending: {dashboard.appointments.pending}
                </p>

                <p>
                    Confirmed: {dashboard.appointments.confirmed}
                </p>

                <p>
                    Completed: {dashboard.appointments.completed}
                </p>

                <p>
                    Cancelled: {dashboard.appointments.cancelled}
                </p>
            </div>


            <h2>Recent Appointments</h2>

            <div>

                {dashboard.recentAppointments.map((appointment) => (

                    <div key={appointment._id}>

                        <p>
                            Patient:{" "}
                            {appointment.patient?.userId?.name}
                        </p>

                        <p>
                            Doctor:{" "}
                            {appointment.doctor?.userId?.name}
                        </p>

                        <p>
                            Status: {appointment.status}
                        </p>

                        <p>
                            Date:{" "}
                            {new Date(
                                appointment.date
                            ).toLocaleString()}
                        </p>

                        <hr />

                    </div>

                ))}

            </div>

        </div>
    );
};


export default AdminDashboard;