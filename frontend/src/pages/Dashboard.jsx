import { Link } from "react-router-dom";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div>
            <h1>Dashboard</h1>

            <p>
                Welcome to Hospital Management System
            </p>

            {user?.role === "patient" && (
                <div>
                    <h2>Patient Dashboard</h2>

                    <Link to="/book-appointment">
                        <button>
                            Book Appointment
                        </button>
                    </Link>

                    <Link to="/medical-records">
                        <button>
                            My Medical Records
                        </button>
                    </Link>
                </div>
            )}

            {user?.role === "doctor" && (
                <div>
                    <h2>Doctor Dashboard</h2>

                    <Link to="/medical-records">
                        <button>
                            Medical Records
                        </button>
                    </Link>
                </div>
            )}

            {user?.role === "admin" && (
                <div>
                    <h2>Admin Dashboard</h2>
                </div>
            )}
        </div>
    );
}

export default Dashboard;