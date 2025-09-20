import { useState, useEffect } from "react";
import axios from "axios";

// Bell sound
const bellSound =
  "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";

export default function Reminders({ token }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  const fetchReminders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data);
    } catch (err) {
      console.error("❌ Fetch reminders error:", err);
      setError("Failed to load reminders");
    }
  };

  const addReminder = async () => {
    try {
      if (!title || !dueDate) {
        setError("Please enter title and date");
        return;
      }

      const isoDate = new Date(dueDate).toISOString();

      await axios.post(
        "http://localhost:5000/api/reminders",
        { title, dueDate: isoDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDueDate("");
      setError("");
      fetchReminders();

      // show toast that reminder is added
      setNotification("✅ Reminder added!");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error("❌ Add reminder error:", err.response?.data || err.message);
      setError("Failed to add reminder");
    }
  };

  // check reminders every 5s
  useEffect(() => {
    fetchReminders();
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach((r) => {
        const reminderTime = new Date(r.dueDate);
        const diff = reminderTime - now;

        if (diff > 0 && diff < 5000) {
          // play sound
          const audio = new Audio(bellSound);
          audio.play();

          // show popup toast instead of blocking alert
          setNotification(`🔔 Reminder: ${r.title}`);
          setTimeout(() => setNotification(null), 5000);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">🔔 Reminders</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Notification Toast */}
      {notification && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-3 bg-dark text-white"
          style={{ zIndex: 1055 }}
        >
          <div className="toast-body">{notification}</div>
        </div>
      )}

      <input
        type="text"
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2"
      />

      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 mr-2"
      />

      <button
        onClick={addReminder}
        className="btn btn-success px-4 py-2"
      >
        Add Reminder
      </button>

      <ul className="mt-4">
        {reminders.map((r) => (
          <li key={r._id} className="mb-1">
            <span className="fw-bold">{r.title}</span> —{" "}
            {new Date(r.dueDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
