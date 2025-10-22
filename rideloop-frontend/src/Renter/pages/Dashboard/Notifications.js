import React from "react";
import { useNotifications } from "../context/NotificationsContext";
import "../../pagescss/RenterDashboard.css";
import NavBar from "../../../components/NavBar";


const Notifications = () => {
  const { notifications } = useNotifications();

  return (
    
    <div className="dashboard-container" style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <NavBar  />
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#555" }}>
          You have no notifications yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((note) => (
            <li
              key={note.id}
              className="notification-card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px 20px",
                marginBottom: "12px",
                backgroundColor: "#fefefe",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "transform 0.2s",
              }}
            >
              <strong style={{ display: "block", marginBottom: "5px", fontSize: "1.1rem" }}>
                {note.title}
              </strong>
              <p style={{ margin: "0 0 8px 0", color: "#333" }}>{note.message}</p>
              <small style={{ color: "#888" }}>
                {new Date(note.date).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
