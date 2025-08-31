"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "../../../Authentication/pagescss/Register.css"

function UpdateReport() {
    const navigate = useNavigate()
    const location = useLocation()
    const reportID = location.state?.reportID // get reportID from navigation

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

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // Fetch existing report data on mount
    useEffect(() => {
        if (reportID) {
            fetchReport(reportID)
        }
    }, [reportID])

    const fetchReport = async (id) => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:8080/rideloop/financialReport/read/${id}`)
            console.log("Fetch Report Response:", response)
            if (response.status === 200 && response.data) {
                setReportData(response.data)
                setMessage("")
            } else {
                setMessage("Failed to load report.")
            }
        } catch (error) {
            console.error("Error fetching report:", error)
            setMessage("Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setReportData({ ...reportData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const response = await axios.put(
                `http://localhost:8080/rideloop/financialReport/update`,
                reportData
            )
            if (response.status === 200) {
                setMessage("Report updated successfully!")
                setTimeout(() => {
                    navigate("/Reports")
                }, 2000) // redirect back to reports list
            } else {
                setMessage("Failed to update report.")
            }
        } catch (error) {
            console.error("Error updating report:", error)
            setMessage(error.response?.data?.message || "Server error in updating. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
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
                    <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back to Reports
                </button>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Update Financial Report</h2>

                {loading && <p>Loading...</p>}
                {message && <p className="error-message-fr">{message}</p>}

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

                <button type="submit" className="register-button" disabled={loading} style={{ marginTop: "25px" }}>
                    {loading ? "Updating..." : "Update Report"}
                </button>
            </form>
        </div>
    )
}

export default UpdateReport
