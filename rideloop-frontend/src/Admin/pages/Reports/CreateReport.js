"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../../Authentication/pagescss/Register.css"

function CreateReport() {
    const navigate = useNavigate()
    const [reportData, setReportData] = useState({
        reportID: "",
        generateDate: "",
        timePeriod: "",
        exportFormat: "PDF",
        totalRevenue: 0,
        expenses: 0,
        netProfit: 0,
        rentalIncome: 0,
        insuranceIncome: 0,
        additionalCharges: 0
    })
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // input handler
    const handleChange = (e) => {
        const { name, value } = e.target
        setReportData({ ...reportData, [name]: value })
    }

    // create new report in backend
    const createReport = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/rideloop/financialReport/save",
                reportData
            )
            return response
        } catch (error) {
            throw error
        }
    }

    // form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setLoading(true)

        try {
            const response = await createReport()
            if (response.status === 200 || response.status === 201) {
                setMessage("Report created successfully!")
                console.log("Saved Report:", response.data)
                setTimeout(() => {
                    navigate("/Reports")
                }, 2000)
            } else {
                setMessage("Unexpected server response.")
            }
        } catch (error) {
            console.error("Error:", error)
            setMessage(error.response?.data?.message || "Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
            minimumFractionDigits: 2,
        }).format(amount || 0)
    }

    return (
        <div className="App">
            <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
                <button
                    type="button"
                    onClick={() => navigate("/Reports")}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#55d659",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back to Dashboard
                </button>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Create Financial Report</h2>
                {message && <p className="error-message-fr">{message}</p>}

                {/* Example fields for creating report */}
                {/* <div>
                    <label className="register-label">Report ID</label>
                    <input
                        type="number"
                        name="reportID"
                        className="register-input"
                        value={reportData.reportID}
                        onChange={handleChange}
                        required
                    />
                </div> */}

                <div>
                    <label className="register-label">Generate Date</label>
                    <input
                        type="date"
                        name="generateDate"
                        className="register-input"
                        value={reportData.generateDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="register-label">Time Period</label>
                    <input
                        type="text"
                        name="timePeriod"
                        className="register-input"
                        value={reportData.timePeriod}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="register-label">Total Revenue</label>
                    <input
                        type="number"
                        name="totalRevenue"
                        className="register-input"
                        value={reportData.totalRevenue}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="register-label">Expenses</label>
                    <input
                        type="number"
                        name="expenses"
                        className="register-input"
                        value={reportData.expenses}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="register-label">Net Profit</label>
                    <input
                        type="number"
                        name="netProfit"
                        className="register-input"
                        value={reportData.netProfit}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="register-label">Rental Income</label>
                    <input
                        type="number"
                        name="rentalIncome"
                        className="register-input"
                        value={reportData.rentalIncome}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="register-label">Insurance Income</label>
                    <input
                        type="number"
                        name="insuranceIncome"
                        className="register-input"
                        value={reportData.insuranceIncome}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="register-label">Additional Charges</label>
                    <input
                        type="number"
                        name="additionalCharges"
                        className="register-input"
                        value={reportData.additionalCharges}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="register-button" style={{ marginTop: "25px" }} disabled={loading}>
                    {loading ? "Saving..." : "Save Report"}
                </button>
            </form>
        </div>
    )
}

export default CreateReport
