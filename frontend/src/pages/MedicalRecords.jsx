import { useEffect, useState } from "react";

function MedicalRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [appointment, setAppointment] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [prescription, setPrescription] = useState("");
    const [notes, setNotes] = useState("");

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    // =========================
    // FETCH RECORDS
    // =========================

    const fetchRecords = async () => {
        try {

            if (!token || !user) {
                throw new Error("Please login first");
            }

            let url = "";

            // Doctor
            if (user.role === "doctor") {

                url =
                    "http://localhost:5001/api/medical-records/doctor";
            }

            // Patient
            else if (user.role === "patient") {

                const patientResponse =
                    await fetch(
                        "http://localhost:5001/api/patients/me",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const patientData =
                    await patientResponse.json();

                if (!patientResponse.ok) {
                    throw new Error(
                        patientData.message ||
                        "Failed to get patient profile"
                    );
                }

                const patientId =
                    patientData.patient._id;

                url =
                    `http://localhost:5001/api/medical-records/patient/${patientId}`;
            }

            const response =
                await fetch(url, {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch records"
                );
            }

            setRecords(data);

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRecords();
    }, []);


    // =========================
    // CREATE MEDICAL RECORD
    // =========================

    const handleCreateRecord = async (e) => {

        e.preventDefault();

        try {

            const response =
                await fetch(
                    "http://localhost:5001/api/medical-records",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            appointment,
                            diagnosis,
                            symptoms,
                            prescription,
                            notes
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to create medical record"
                );

                return;
            }


            alert(
                "Medical record created successfully"
            );


            // Clear form
            setAppointment("");
            setDiagnosis("");
            setSymptoms("");
            setPrescription("");
            setNotes("");


            // Refresh records
            fetchRecords();

        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong"
            );
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div>
                <h2>
                    Loading medical records...
                </h2>
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div>

                <h2>
                    Error
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    return (

        <div style={{ padding: "30px" }}>

            <h1>
                Medical Records
            </h1>


            {/* ================================= */}
            {/* DOCTOR CREATE FORM */}
            {/* ================================= */}

            {user?.role === "doctor" && (

                <div>

                    <h2>
                        Create Medical Record
                    </h2>


                    <form
                        onSubmit={handleCreateRecord}
                    >

                        <div>
                            <label>
                                Appointment ID
                            </label>

                            <br />

                            <input
                                type="text"
                                value={appointment}
                                onChange={(e) =>
                                    setAppointment(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter appointment ID"
                                required
                            />
                        </div>


                        <br />


                        <div>
                            <label>
                                Diagnosis
                            </label>

                            <br />

                            <input
                                type="text"
                                value={diagnosis}
                                onChange={(e) =>
                                    setDiagnosis(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter diagnosis"
                                required
                            />
                        </div>


                        <br />


                        <div>
                            <label>
                                Symptoms
                            </label>

                            <br />

                            <textarea
                                value={symptoms}
                                onChange={(e) =>
                                    setSymptoms(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter symptoms"
                                required
                            />
                        </div>


                        <br />


                        <div>
                            <label>
                                Prescription
                            </label>

                            <br />

                            <textarea
                                value={prescription}
                                onChange={(e) =>
                                    setPrescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter prescription"
                                required
                            />
                        </div>


                        <br />


                        <div>
                            <label>
                                Notes
                            </label>

                            <br />

                            <textarea
                                value={notes}
                                onChange={(e) =>
                                    setNotes(
                                        e.target.value
                                    )
                                }
                                placeholder="Additional notes"
                            />
                        </div>


                        <br />


                        <button type="submit">
                            Create Medical Record
                        </button>

                    </form>

                </div>
            )}


            {/* ================================= */}
            {/* EXISTING RECORDS */}
            {/* ================================= */}

            <div>

                <h2>
                    {user?.role === "doctor"
                        ? "Your Medical Records"
                        : "My Medical History"}
                </h2>


                {records.length === 0 ? (

                    <p>
                        No medical records found.
                    </p>

                ) : (

                    records.map((record) => (

                        <div
                            key={record._id}
                            style={{
                                border:
                                    "1px solid #ddd",

                                borderRadius:
                                    "10px",

                                padding:
                                    "20px",

                                marginTop:
                                    "20px"
                            }}
                        >

                            <h3>
                                {record.diagnosis}
                            </h3>


                            <p>
                                <strong>
                                    Symptoms:
                                </strong>{" "}
                                {record.symptoms}
                            </p>


                            <p>
                                <strong>
                                    Prescription:
                                </strong>{" "}
                                {record.prescription}
                            </p>


                            <p>
                                <strong>
                                    Notes:
                                </strong>{" "}
                                {record.notes ||
                                    "No notes"}
                            </p>


                            <p>
                                <strong>
                                    Date:
                                </strong>{" "}
                                {record.createdAt
                                    ? new Date(
                                        record.createdAt
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </p>

                        </div>

                    ))
                )}

            </div>

        </div>
    );
}

export default MedicalRecords;