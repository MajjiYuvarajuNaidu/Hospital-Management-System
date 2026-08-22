import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5001/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Store JWT token
            localStorage.setItem("token", data.token);

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            console.log("Login successful");
            console.log("Role:", data.user.role);

            // Redirect based on role
            if (data.user.role === "admin") {
                navigate("/admin/dashboard");
            } 
            else if (data.user.role === "doctor") {
                navigate("/doctor/dashboard");
            } 
            else if (data.user.role === "patient") {
                navigate("/patient/dashboard");
            }

        } catch (error) {

            console.error("Login error:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    return (
        <div>

            <h1>Login</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />
                </div>


                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        required
                    />
                </div>


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}

export default Login;