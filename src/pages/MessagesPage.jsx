import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HoroscopeHeader } from "../components/HoroscopeHeader.jsx";

export function MessagesPage({
  logoUrl,
  onNavigate,
}) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, archived

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("horo_messages") || "[]");
    setMessages(stored);
  }, []);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem("horo_messages", JSON.stringify(newMessages));
    // మెసేజెస్ అప్‌డేట్ అయిన వెంటనే App.jsx కి సిగ్నల్ పంపడానికి
    window.dispatchEvent(new Event("horo_messages_updated"));
  };

  const deleteMessage = (id) =>
    saveMessages(messages.filter((m) => m.id !== id));

  const deleteAll = () => {
    if (window.confirm("Are you sure you want to delete all messages?")) {
      saveMessages([]);
    }
  };

  const toggleRead = (id) =>
    saveMessages(
      messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m)),
    );

  const toggleArchive = (id) =>
    saveMessages(
      messages.map((m) => (m.id === id ? { ...m, archived: !m.archived } : m)),
    );

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.read && !m.archived;
    if (filter === "archived") return m.archived;
    return !m.archived; // "all" shows active messages
  });

  const unreadCount = messages.filter((m) => !m.read && !m.archived).length;
  const archivedCount = messages.filter((m) => m.archived).length;

  return (
    <main className="page">
      <HoroscopeHeader
        logoUrl={logoUrl}
        title={t("inbox", "My Inbox")}
        eyebrow="MESSAGES"
        subtitle={t("inboxDesc", "Important alerts and messages")}
      />

      <section
        className="workspace"
        style={{
          gridTemplateColumns: "1fr",
          padding: "10px",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        }}
      >
        <div
          className="form-panel"
          style={{ position: "static", padding: "15px" }}
        >


          {/* Filters & Actions Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid #8e44ad",
                  background: filter === "all" ? "#8e44ad" : "#fff",
                  color: filter === "all" ? "#fff" : "#8e44ad",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid #8e44ad",
                  background: filter === "unread" ? "#8e44ad" : "#fff",
                  color: filter === "unread" ? "#fff" : "#8e44ad",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Unread
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: "#e74c3c",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "1px 7px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter("archived")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid #8e44ad",
                  background: filter === "archived" ? "#8e44ad" : "#fff",
                  color: filter === "archived" ? "#fff" : "#8e44ad",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Archived
                {archivedCount > 0 && (
                  <span
                    style={{
                      background: "#e74c3c",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "1px 7px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {archivedCount}
                  </span>
                )}
              </button>
            </div>
            {messages.length > 0 && (
              <button
                onClick={deleteAll}
                style={{
                  color: "#e74c3c",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🗑️ Delete All
              </button>
            )}
          </div>

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#7f8c8d",
              }}
            >
              <span
                style={{
                  fontSize: "40px",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                📭
              </span>
              <p>No messages here!</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    background: msg.read ? "#f8f9fa" : "#f0f6ff",
                    borderLeft: msg.read
                      ? "4px solid #bdc3c7"
                      : "4px solid #3498db",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        color: "#2c3e50",
                      }}
                    >
                      {!msg.read && (
                        <span style={{ color: "#3498db", marginRight: "5px" }}>
                          ●
                        </span>
                      )}
                      {msg.title}
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "#95a5a6" }}>
                      {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "0 0 15px 0",
                      color: "#555",
                      lineHeight: "1.5",
                      fontSize: "0.95rem",
                    }}
                  >
                    {msg.body}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      {msg.targetUrl && (
                        <button
                          onClick={() => {
                            toggleRead(msg.id);
                            const base = import.meta.env.BASE_URL;
                            if (msg.targetUrl.startsWith(base) || msg.targetUrl.startsWith(window.location.origin + base)) {
                              window.location.href = msg.targetUrl;
                            } else {
                              window.open(msg.targetUrl, "_blank");
                            }
                          }}
                          style={{
                            padding: "6px 12px",
                            background: "#8e44ad",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            marginRight: "10px",
                          }}
                        >
                          Open Link 🔗
                        </button>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => toggleRead(msg.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3498db",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                        title={msg.read ? "Mark as Unread" : "Mark as Read"}
                      >
                        {msg.read ? "📖 Mark Unread" : "📘 Mark Read"}
                      </button>
                      <span style={{ color: "#bdc3c7" }}>|</span>
                      <button
                        onClick={() => toggleArchive(msg.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#f39c12",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                        title={msg.archived ? "Unarchive" : "Archive"}
                      >
                        {msg.archived ? "📤 Unarchive" : "📥 Archive"}
                      </button>
                      <span style={{ color: "#bdc3c7" }}>|</span>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#e74c3c",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer
        className="no-print"
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "13px",
          color: "#7f8c8d",
          marginTop: "auto",
        }}
      >
        <button
          onClick={() => onNavigate("Privacy")}
          style={{
            background: "none",
            border: "none",
            color: "#3498db",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "13px",
            padding: 0,
          }}
        >
          {t("Privacy", "Privacy Policy")}
        </button>
      </footer>
    </main>
  );
}
