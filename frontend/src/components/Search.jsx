// ...existing code...
import React, { useEffect, useRef, useState } from "react";

export default function Search({
  onSearch = (q) => {},
  placeholder = "Search for stores around...",
}) {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = navigator.language || "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      setQuery(text);
      // Optionally trigger search automatically:
      // onSearch(text);
    };

    recog.onend = () => {
      setListening(false);
    };

    recog.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recog;
    // cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        // start can throw if called twice quickly
      }
    }
  };

  const doSearch = (e) => {
    if (e) e.preventDefault();
    const q = query.trim();
    onSearch(q);
  };

  const speakQuery = () => {
    if (!("speechSynthesis" in window) || !query) return;
    const utter = new SpeechSynthesisUtterance(query);
    utter.lang = navigator.language || "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <form
      onSubmit={doSearch}
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        maxWidth: 720,
        margin: "0 auto",
        padding: "20px",
      }}
      aria-label="Search form"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 20,
          border: "3px solid #beb1b1ff",
          fontSize: 14,
        }}
      />

      <button
        type="button"
        onClick={toggleListen}
        title={
          supported
            ? listening
              ? "Stop listening"
              : "Start voice input"
            : "Voice not supported"
        }
        aria-pressed={listening}
        style={{
          padding: "8px 10px",
          borderRadius: 20,
          border: "3px solid #beb1b1ff",
          background: listening ? "#ffecec" : "#fff",
          cursor: supported ? "pointer" : "not-allowed",
        }}
        disabled={!supported}
      >
        {listening ? "🎙️…" : "🎤"}
      </button>

      <button
        type="button"
        onClick={speakQuery}
        title="Read query aloud"
        style={{
          padding: "8px 10px",
          borderRadius: 20,
          border: "3px solid #beb1b1ff",
          background: "#fff",
          cursor: query ? "pointer" : "not-allowed",
        }}
        disabled={!query}
      >
        🔊
      </button>

      <button
        type="submit"
        style={{
          padding: "8px 12px",
          borderRadius: 20,
          border: "2px solid #beb1b1ff",
          background: "#72bbb1ff",
          color: "#373535ff",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: "500",
          fontFamily: 
            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Search
      </button>
    </form>
  );
}

