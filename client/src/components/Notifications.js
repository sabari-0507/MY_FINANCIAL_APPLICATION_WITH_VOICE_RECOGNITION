import { useEffect } from "react";

export default function Notifications({ reminders }) {
  useEffect(() => {
    reminders.forEach(r => {
      const due = new Date(r.dueDate).getTime();
      const now = Date.now();
      if (due - now < 60000 && due > now) {
        alert(`⏰ Reminder: ${r.title} is due soon!`);
      }
    });
  }, [reminders]);

  return null;
}
