// Approval.js
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

const API_URL = `http://localhost:8080/rideloop/customerapproval/read`
const API_URL_UPDATE = `http://localhost:8080/rideloop/customerapproval/update`

const Approval = () => {
    const [approval, setApproval] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    const [customerApprovalData, setcustomerApprovalData] = useState({
        approval: "",
        customerApprovalId: "",
        licenseNumber: "",
    })

    const customerApprovalId = location.state?.approvalId

    console.log("Approval component loaded with customerApprovalId:", customerApprovalId)



    useEffect(() => {
        const fetchApproval = async () => {
            try {
                const res = await axios.get(`${API_URL}/${customerApprovalId}`)
                setApproval(res.data)
            } catch (err) {
                console.error("Error fetching approval:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchApproval()
    }, [customerApprovalId])

    const handleApprove = async () => {
        try {
            await axios.put(`${API_URL_UPDATE}/${customerApprovalId}`, { approval: true })
            setApproval({ ...customerApprovalData, approval: true });
            alert("Customer approved ✅")
            navigate("/CustomerApproval") // redirect back to list
        } catch (err) {
            console.error("Error approving customer:", err)
        }
    }

    const handleReject = async () => {
        try {
            await axios.put(`${API_URL_UPDATE}/${customerApprovalId}`, { approval: false })
            setApproval({ ...customerApprovalData, approval: false });
            alert("Customer rejected ❌")
            navigate("/CustomerApproval")
        } catch (err) {
            console.error("Error rejecting customer:", err)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const response = await axios.delete(`http://localhost:8080/rideloop/customerapproval/delete/${customerApprovalId}`)
            console.log("Delete Response:", response)
            if (response.status === 200) {
                setMessage("Report deleted successfully!")
                setTimeout(() => navigate("/CustomerApproval"), 1000) // redirect after 1 second
            } else {
                setMessage("Failed to delete report.")
            }
        } catch (error) {
            console.error("Error deleting report:", error)
            setMessage(error.response?.data?.message || "Server error. Try again later.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>Loading...</p>
    if (!approval) return <p>No approval found.</p>

    return (
        <div className="App">
            <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
                <button
                    type="button"
                    onClick={() => navigate("/CustomerApproval")}
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
                    <span style={{ fontSize: 22, marginRight: 4 }}>&larr;</span> Back to Approvals
                </button>
            </div>
            <form className="register-form">
                <h2>Customer Approval Details</h2>
                <p><strong>ID:</strong> {approval.customerApprovalId}</p>
                <p><strong>Status:</strong> {approval.approval === true ? "Aproved" : "Pending"}</p>
                <p><strong>Licence Number:</strong> {approval.licenseNumber}</p>

                <div style={{ marginTop: "20px" }}>
                    {/* <button type="button" onClick={handleApprove} style={{ marginLeft: "10px" }}>Approve</button> */}
                    {/* <button type="button" onClick={handleReject} style={{ marginLeft: "10px" }}>Reject</button> */}
                    <button type="button" onClick={handleDelete} style={{ marginLeft: "10px" }}>Delete</button>
                    <button  onClick={() => navigate("/CustomerApproval")} style={{ marginLeft: "10px" }}>
                        Back
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Approval
