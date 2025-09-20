import { useState, useContext } from "react";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";

export default function VoiceTransaction({ token }) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useContext(LanguageContext);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("❌ " + t("voice_not_supported"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Indian English
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(`${t("heard")}: ${transcript}`);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/voice-transaction",
          { text: transcript },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage(
          `✅ ${t("saved")}: ${res.data.transaction.category} - ₹${res.data.transaction.amount}`
        );
      } catch (err) {
        setMessage("❌ " + t("error_saving"));
      }
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleVoiceInput}
        className={`p-4 rounded-full shadow-md transition ${
          listening ? "bg-red-500 animate-pulse" : "bg-blue-500"
        }`}
      >
        🎙️
      </button>
      <p className="mt-2 text-center">{message}</p>
    </div>
  );
}
