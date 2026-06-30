import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught rendering error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onNavigate) {
      this.props.onNavigate("Home");
    } else {
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px 24px",
            maxWidth: "500px",
            margin: "60px auto",
            background: "#fffdf8",
            border: "1px solid rgba(138, 59, 36, 0.15)",
            borderRadius: "16px",
            boxShadow: "0 15px 35px rgba(63, 43, 24, 0.08)",
            textAlign: "center",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            fontFamily: "inherit"
          }}
        >
          {this.props.logoUrl && (
            <img
              src={this.props.logoUrl}
              alt="Jyotisha Logo"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(63, 43, 24, 0.1)",
                marginBottom: "4px"
              }}
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            <h2
              style={{
                margin: 0,
                color: "#2d2419",
                fontSize: "1.35rem",
                fontWeight: "800",
                letterSpacing: "0.2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              ⚠️ Something went wrong
            </h2>
            <p
              style={{
                margin: 0,
                color: "#6b6255",
                fontSize: "0.96rem",
                lineHeight: "1.6"
              }}
            >
              An unexpected error occurred while loading this page. This could be due to a slow network connection or a caching issue.
            </p>
          </div>

          <div
            style={{
              width: "100%",
              background: "#fffdfb",
              border: "1px solid rgba(138, 59, 36, 0.15)",
              borderRadius: "8px",
              padding: "12px 16px",
              boxSizing: "border-box",
              textAlign: "left"
            }}
          >
            <details style={{ cursor: "pointer" }}>
              <summary
                style={{
                  fontSize: "0.85rem",
                  color: "#8a3b24",
                  fontWeight: "700",
                  outline: "none",
                  userSelect: "none"
                }}
              >
                View details
              </summary>
              <pre
                style={{
                  margin: "12px 0 0 0",
                  fontSize: "0.8rem",
                  color: "#6b6255",
                  overflowY: "auto",
                  maxHeight: "180px",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  lineHeight: "1.5",
                  paddingRight: "4px"
                }}
              >
                {this.state.error && this.state.error.toString()}
                {"\n\n"}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              width: "100%",
              justifyContent: "center"
            }}
          >
            <button
              onClick={this.handleReload}
              style={{
                background: "linear-gradient(135deg, #8a3b24, #702f1c)",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.95rem",
                boxShadow: "0 4px 15px rgba(138, 59, 36, 0.2)"
              }}
            >
              🔄 Reload App
            </button>
            <button
              onClick={this.handleGoHome}
              style={{
                background: "#f7f2e8",
                color: "#51483d",
                border: "1px solid rgba(122, 83, 48, 0.16)",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.95rem"
              }}
            >
              🏠 Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
