import { useState, useEffect, useRef, lazy, Suspense } from "react";
const logoUrl = `${import.meta.env.BASE_URL}logo.png`;
import { Sidebar } from "./components/Sidebar.jsx";
import { BottomNav } from "./components/BottomNav.jsx";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";
import { API_URL, API_TOKEN, getInAppMessages } from "./services/astrologyApi.js";

// Dynamic Imports for Pages (To split code and improve load speed)
const HomePage = lazy(() =>
  import("./pages/HomePage.jsx").then((m) => ({ default: m.HomePage })),
);
const HoroscopePageNew = lazy(() =>
  import("./pages/HoroscopePageNew.jsx").then((m) => ({
    default: m.HoroscopePageNew,
  })),
);
const MatchPage = lazy(() =>
  import("./pages/MatchPage.jsx").then((m) => ({ default: m.MatchPage })),
);
const PanchangaPage = lazy(() =>
  import("./pages/PanchangaPage.jsx").then((m) => ({
    default: m.PanchangaPage,
  })),
);
const ProfilesPage = lazy(() =>
  import("./pages/ProfilesPage.jsx").then((m) => ({ default: m.ProfilesPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage.jsx").then((m) => ({ default: m.SettingsPage })),
);
const InstallPage = lazy(() =>
  import("./pages/InstallPage.jsx").then((m) => ({ default: m.InstallPage })),
);
const EpataPage = lazy(() =>
  import("./pages/EpataPage.jsx").then((m) => ({ default: m.EpataPage })),
);
const EPrashnaPage = lazy(() =>
  import("./pages/EPrashnaPage.jsx").then((m) => ({ default: m.EPrashnaPage })),
);
const EClockPage = lazy(() =>
  import("./pages/EClockPage.jsx").then((m) => ({ default: m.EClockPage })),
);
const SupportPage = lazy(() =>
  import("./pages/SupportPage.jsx").then((m) => ({ default: m.SupportPage })),
);
const MessagesPage = lazy(() =>
  import("./pages/MessagesPage.jsx").then((m) => ({ default: m.MessagesPage })),
);
const ChangelogPage = lazy(() =>
  import("./pages/ChangelogPage.jsx").then((m) => ({
    default: m.ChangelogPage,
  })),
);
const MePage = lazy(() =>
  import("./pages/MePage.jsx").then((m) => ({ default: m.MePage })),
);
const SankalpaPage = lazy(() =>
  import("./pages/SankalpaPage.jsx").then((m) => ({ default: m.SankalpaPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/PrivacyPage.jsx").then((m) => ({ default: m.PrivacyPage })),
);
const HelpPage = lazy(() =>
  import("./pages/HelpPage.jsx").then((m) => ({ default: m.HelpPage })),
);
const FeedbackPage = lazy(() =>
  import("./pages/FeedbackPage.jsx").then((m) => ({ default: m.FeedbackPage })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage.jsx").then((m) => ({ default: m.AdminPage })),
);
const EPrecisionTestPage = lazy(() =>
  import("./pages/EPrecisionTestPage.jsx").then((m) => ({ default: m.EPrecisionTestPage })),
);
const EclipsePage = lazy(() =>
  import("./pages/EclipsePage.jsx").then((m) => ({ default: m.EclipsePage })),
);
const ELibraryPage = lazy(() =>
  import("./pages/ELibraryPage.jsx").then((m) => ({ default: m.ELibraryPage })),
);

// VAPID Public Key
const VAPID_PUBLIC_KEY =
  "BBHl1damc8zA6nXsJXiyVFLRMeJnLbSa9xVjE4SsJJDHxAmlCtyozMquuvZZGyClgzJ5sIs5sYkyxkszRRf1zFs";

// బ్రౌజర్ కి అర్థమయ్యేలా కీ ని మార్చే ఫంక్షన్
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Helper functions for custom toast styling and icon categorization
function getToastIcon(type) {
  switch (type) {
    case "success":
      return "✔️";
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "info":
    default:
      return "✨";
  }
}

function getToastBackground(type) {
  switch (type) {
    case "success":
      return "linear-gradient(135deg, rgba(30, 126, 52, 0.95), rgba(40, 167, 69, 0.95))";
    case "error":
      return "linear-gradient(135deg, rgba(189, 33, 48, 0.95), rgba(220, 53, 69, 0.95))";
    case "warning":
      return "linear-gradient(135deg, rgba(211, 158, 0, 0.95), rgba(255, 193, 7, 0.95))";
    case "info":
    default:
      return "linear-gradient(135deg, rgba(158, 111, 96, 0.95), rgba(111, 42, 24, 0.95))";
  }
}

function getToastBorder(type) {
  switch (type) {
    case "success":
      return "1px solid rgba(40, 167, 69, 0.4)";
    case "error":
      return "1px solid rgba(220, 53, 69, 0.4)";
    case "warning":
      return "1px solid rgba(255, 193, 7, 0.4)";
    case "info":
    default:
      return "1px solid rgba(255, 255, 255, 0.2)";
  }
}

function getToastShadow(type) {
  switch (type) {
    case "success":
      return "0 8px 30px rgba(40, 167, 69, 0.35)";
    case "error":
      return "0 8px 30px rgba(220, 53, 69, 0.35)";
    case "warning":
      return "0 8px 30px rgba(255, 193, 7, 0.35)";
    case "info":
    default:
      return "0 8px 30px rgba(111, 42, 24, 0.35)";
  }
}

export default function App() {
  const { t } = useTranslation();

  // PWA Prompt Update States
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [toast, setToast] = useState(null); // { message: "", type: "info" }
  const [toastVisible, setToastVisible] = useState(false);

  // TV detection
  useEffect(() => {
    const isTV = /TV|SmartTV|AppleTV|AndroidTV|Roku|Tizen|WebOS|Chromecast|Viera|BRAVIA/i.test(navigator.userAgent);
    if (isTV) {
      document.body.classList.add("is-tv");
    }
  }, []);

  // Override global window.alert to show custom toast
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      const msgStr = String(msg);
      let type = "info";
      const msgLower = msgStr.toLowerCase();

      // Detection keywords for success, error, and warning messages
      const successKeywords = [
        "success",
        "successfully",
        "saved",
        "loaded",
        "imported",
        "merged",
        "added",
        "successful",
        "defaults",
        "విజయవంతంగా",
        "సేవ్",
        "పూర్తయింది",
        "సఫలం",
      ];
      const errorKeywords = [
        "fail",
        "error",
        "invalid",
        "busy",
        "offline",
        "denied",
        "empty",
        "not found",
        "cannot",
        "failed",
        "విఫలం",
        "తప్పు",
        "సరికాదు",
        "అనుమతి లేదు",
      ];
      const warningKeywords = [
        "warning",
        "sure",
        "caution",
        "attention",
        "careful",
        "హెచ్చరిక",
      ];

      if (successKeywords.some((keyword) => msgLower.includes(keyword))) {
        type = "success";
      } else if (errorKeywords.some((keyword) => msgLower.includes(keyword))) {
        type = "error";
      } else if (
        warningKeywords.some((keyword) => msgLower.includes(keyword))
      ) {
        type = "warning";
      }

      setToast({ message: msgStr, type });
      setToastVisible(true);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  // Auto-dismiss toast after 4 seconds (exit transition starts at 3.7s)
  useEffect(() => {
    let timer1, timer2;
    if (toastVisible) {
      timer1 = setTimeout(() => {
        setToastVisible(false);
      }, 3700);
    } else if (toast) {
      // When toast becomes invisible but is not null, wait for the exit animation (300ms) to complete and then clean up state
      timer2 = setTimeout(() => {
        setToast(null);
      }, 300);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [toastVisible, toast]);

  // Periodic check for PWA updates (checks every hour)
  useEffect(() => {
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      const delayTimeout = setTimeout(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg
            .update()
            .catch((e) => console.log("SW update check failed on mount", e));
        });
      }, 5000);

      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg
            .update()
            .catch((e) => console.log("SW periodic update check failed", e));
        });
      }, 3600000);

      return () => {
        clearTimeout(delayTimeout);
        clearInterval(interval);
      };
    }
  }, []);

  const [profileFirstName, setProfileFirstName] = useState(() => {
    try {
      const meProfile = JSON.parse(localStorage.getItem("me_page_profile") || "null");
      if (meProfile && meProfile.name) {
        const firstWord = meProfile.name.trim().split(/\s+/)[0];
        return firstWord.length > 10 ? firstWord.substring(0, 8) + ".." : firstWord;
      }
    } catch (e) {}
    return "";
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const meProfile = JSON.parse(localStorage.getItem("me_page_profile") || "null");
        if (meProfile && meProfile.name) {
          const firstWord = meProfile.name.trim().split(/\s+/)[0];
          setProfileFirstName(firstWord.length > 10 ? firstWord.substring(0, 8) + ".." : firstWord);
        } else {
          setProfileFirstName("");
        }
      } catch (e) {
        setProfileFirstName("");
      }
    };
    window.addEventListener("vaiswanara_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("vaiswanara_profile_updated", handleProfileUpdate);
    };
  }, []);

  // URL పరామీటర్ ని బట్టి ఆటోమేటిక్ గా పేజీ మార్చడం
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    let targetPage = params.get("page");

    if (targetPage === "EClock") targetPage = "e-Clock";
    if (targetPage === "Match") targetPage = "e-Match";
    if (targetPage === "EPrashna") targetPage = "echakra";

    let savedLandingPage = localStorage.getItem("vaiswanara_landing_page");
    // పాత యూజర్లకు Dashboard సేవ్ అయి ఉంటే దాన్ని Home కి మారుస్తున్నాము
    if (savedLandingPage === "Dashboard") savedLandingPage = "Home";
    return targetPage || savedLandingPage || "Home";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Scroll to top on page navigation and log pageview to Google Analytics
  useEffect(() => {
    window.scrollTo(0, 0);
    const workspaces = document.querySelectorAll(
      ".workspace, .page, .new-horo-page, .eclock-workspace",
    );
    workspaces.forEach((el) => {
      el.scrollTop = 0;
    });

    // Track Virtual Pageview in GA4
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: activePage,
        page_location: window.location.href,
        page_path: `/${activePage.toLowerCase()}`,
      });
    }
  }, [activePage]);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIosEligible, setIsIosEligible] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(() => {
    // పర్మిషన్ ముందే ఇచ్చినా, లేదా బ్లాక్ (denied) చేసినా బెల్ ని హైడ్ చేయాలి
    if (typeof window !== "undefined" && "Notification" in window) {
      return (
        Notification.permission === "granted" ||
        Notification.permission === "denied"
      );
    }
    return true; // సపోర్ట్ లేకపోతే హైడ్ చేయాలి
  });
  const [pushLoading, setPushLoading] = useState(false);
  const [pushPopup, setPushPopup] = useState(null);

  // In-App Message States
  const [inAppQueue, setInAppQueue] = useState([]);
  const [currentInApp, setCurrentInApp] = useState(null);

  // Helper to show next in-app message in queue
  const showNextInApp = (queue) => {
    if (queue.length > 0) {
      const next = queue[0];
      setCurrentInApp(next);
      setInAppQueue(queue.slice(1));
    } else {
      setCurrentInApp(null);
    }
  };

  const hasValidUrl = (url) => {
    if (!url) return false;
    const trimmed = url.trim();
    return trimmed !== "";
  };

  const performHardRefresh = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      }).catch(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  const handleDismissInApp = (msg, actionType) => {
    // 1. Add to seen list in localStorage
    const seenIdsStr = localStorage.getItem("seen_in_app_messages") || "[]";
    let seenIds = [];
    try {
      seenIds = JSON.parse(seenIdsStr);
    } catch (e) {
      seenIds = [];
    }
    if (!seenIds.includes(msg.id)) {
      seenIds.push(msg.id);
      localStorage.setItem("seen_in_app_messages", JSON.stringify(seenIds));
    }

    // 2. Mark as read in inbox (horo_messages)
    const localInboxStr = localStorage.getItem("horo_messages") || "[]";
    try {
      const localInbox = JSON.parse(localInboxStr);
      const updatedInbox = localInbox.map((m) => {
        if (m.id === msg.id) {
          return { ...m, read: true };
        }
        return m;
      });
      localStorage.setItem("horo_messages", JSON.stringify(updatedInbox));
      window.dispatchEvent(new Event("horo_messages_updated"));
    } catch (e) {}

    // 3. Navigate if actionType is link
    if (actionType === "link" && msg.url) {
      navigateToTargetUrl(msg.url);
    }

    // 4. Force Hard Refresh if required
    if (msg.forceRefresh) {
      performHardRefresh();
      return;
    }

    // 5. Show next message in queue
    showNextInApp(inAppQueue);
  };

  // Unread మెసేజెస్ ఎన్ని ఉన్నాయో స్టోర్ చేయడానికి
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      try {
        const msgs = JSON.parse(localStorage.getItem("horo_messages") || "[]");
        setUnreadCount(msgs.filter((m) => !m.read && !m.archived).length);
      } catch (e) {}
    };
    updateUnreadCount();
    window.addEventListener("horo_messages_updated", updateUnreadCount);
    return () =>
      window.removeEventListener("horo_messages_updated", updateUnreadCount);
  }, [pushPopup, currentInApp]);

  const lastInAppFetchRef = useRef(0);

  const fetchInAppWithThrottle = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastInAppFetchRef.current < 2000) { // 2 seconds throttle
      return;
    }
    lastInAppFetchRef.current = now;

    try {
      const data = await getInAppMessages();
      if (!Array.isArray(data)) return;

      // 1. Filter messages by Date Range and Active status
      const todayStr = new Date().toISOString().split("T")[0];
      const activeMessages = data.filter((msg) => {
        return msg.isActive && msg.startDate <= todayStr && msg.endDate >= todayStr;
      });

      if (activeMessages.length === 0) return;

      // 2. Sync with local inbox (horo_messages)
      const localInboxStr = localStorage.getItem("horo_messages") || "[]";
      let localInbox = [];
      try {
        localInbox = JSON.parse(localInboxStr);
      } catch (e) {
        localInbox = [];
      }

      let inboxModified = false;
      activeMessages.forEach((msg) => {
        if (!localInbox.some((m) => m.id === msg.id)) {
          // Add as new unread message at the start
          localInbox.unshift({
            id: msg.id,
            title: msg.title,
            body: msg.body,
            targetUrl: msg.url || "",
            date: Date.now(),
            read: false,
            archived: false,
            isInApp: true,
          });
          inboxModified = true;
        }
      });

      if (inboxModified) {
        localStorage.setItem("horo_messages", JSON.stringify(localInbox));
        window.dispatchEvent(new Event("horo_messages_updated"));
      }

      // 3. Find unseen messages for popups
      const seenIdsStr = localStorage.getItem("seen_in_app_messages") || "[]";
      let seenIds = [];
      try {
        seenIds = JSON.parse(seenIdsStr);
      } catch (e) {
        seenIds = [];
      }

      const unseenMessages = activeMessages.filter((msg) => !seenIds.includes(msg.id));
      if (unseenMessages.length > 0) {
        setCurrentInApp((current) => {
          if (!current) {
            setInAppQueue(unseenMessages.slice(1));
            return unseenMessages[0];
          } else {
            setInAppQueue((prevQueue) => {
              const combined = [...prevQueue];
              unseenMessages.forEach((um) => {
                if (current.id !== um.id && !combined.some((q) => q.id === um.id)) {
                  combined.push(um);
                }
              });
              return combined;
            });
            return current;
          }
        });
      }
    } catch (err) {
      console.warn("Failed to fetch in-app messages:", err);
      // Static fallback
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}static/in_app_messages.json?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const todayStr = new Date().toISOString().split("T")[0];
            const activeMessages = data.filter(msg => msg.isActive && msg.startDate <= todayStr && msg.endDate >= todayStr);
            if (activeMessages.length > 0) {
              const localInboxStr = localStorage.getItem("horo_messages") || "[]";
              let localInbox = JSON.parse(localInboxStr);
              let inboxModified = false;
              activeMessages.forEach((msg) => {
                if (!localInbox.some((m) => m.id === msg.id)) {
                  localInbox.unshift({
                    id: msg.id,
                    title: msg.title,
                    body: msg.body,
                    targetUrl: msg.url || "",
                    date: Date.now(),
                    read: false,
                    archived: false,
                    isInApp: true,
                  });
                  inboxModified = true;
                }
              });
              if (inboxModified) {
                localStorage.setItem("horo_messages", JSON.stringify(localInbox));
                window.dispatchEvent(new Event("horo_messages_updated"));
              }
              const seenIdsStr = localStorage.getItem("seen_in_app_messages") || "[]";
              const seenIds = JSON.parse(seenIdsStr);
              const unseenMessages = activeMessages.filter(msg => !seenIds.includes(msg.id));
              if (unseenMessages.length > 0) {
                setCurrentInApp((current) => {
                  if (!current) {
                    setInAppQueue(unseenMessages.slice(1));
                    return unseenMessages[0];
                  } else {
                    setInAppQueue((prevQueue) => {
                      const combined = [...prevQueue];
                      unseenMessages.forEach((um) => {
                        if (current.id !== um.id && !combined.some((q) => q.id === um.id)) {
                          combined.push(um);
                        }
                      });
                      return combined;
                    });
                    return current;
                  }
                });
              }
            }
          }
        }
      } catch (staticErr) {
        console.error("Static fallback fetch failed:", staticErr);
      }
    }
  };

  // Fetch when activePage changes (throttled to avoid spamming)
  useEffect(() => {
    fetchInAppWithThrottle();
  }, [activePage]);

  // Fetch when app comes to foreground (visibility change)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchInAppWithThrottle(true); // force fetch when resuming app
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    // చెక్: యూజర్ ఇప్పటికే నోటిఫికేషన్స్ సబ్‌స్క్రైబ్ చేసుకున్నారా?
    if ("serviceWorker" in navigator && "PushManager" in window) {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            setPushEnabled(!!sub);

            // సర్వర్‌తో సింక్ చేయడానికి (ఒకవేళ సర్వర్‌లో subscribers.json ఫైల్ డిలీట్ అయితే కవర్ చేయడానికి)
            if (sub) {
              fetch(API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-token": API_TOKEN,
                },
                body: JSON.stringify({
                  endpoint: "push_subscribe",
                  sub_endpoint: sub.endpoint,
                  keys: sub.toJSON().keys,
                  action: "subscribe",
                }),
              }).catch((e) => console.error("Background sync failed:", e));
            }
          });
        });
      } else if (Notification.permission === "default") {
        setPushEnabled(false); // పర్మిషన్ అడగాల్సి ఉంటే కచ్చితంగా బెల్ చూపించాలి
      }
    }
  }, []);

  // URL parameter ని బట్టి activePage ని నార్మలైజ్ చేసే ఫంక్షన్
  const getNormalizedPageName = (targetPage) => {
    if (!targetPage) return "Home";
    let normalized = targetPage;
    if (normalized === "EClock") normalized = "e-Clock";
    if (normalized === "Match") normalized = "e-Match";
    if (normalized === "EPrashna") normalized = "echakra";
    if (normalized === "Eclipse" || normalized === "EEclipse") normalized = "e-Eclipse";
    if (normalized === "eLibrary" || normalized === "ELibrary" || normalized === "Library") normalized = "e-Library";
    if (normalized === "Dashboard") normalized = "Home";
    return normalized;
  };

  // యూజర్ "OK, Got it!" క్లిక్ చేసినప్పుడు క్లయింట్-సైడ్ నావిగేట్ అవ్వడం
  const navigateToTargetUrl = (url) => {
    if (
      !url ||
      url.trim() === "" ||
      url.trim() === "current" ||
      url.trim() === "none"
    ) {
      return; // Stay on the current page without redirection
    }

    try {
      const urlObj = new URL(url, window.location.origin);
      // Check if this URL is within our app's domain/origin
      if (urlObj.origin === window.location.origin) {
        const targetPageParam = urlObj.searchParams.get("page");
        if (targetPageParam) {
          const normalized = getNormalizedPageName(targetPageParam);
          setActivePage(normalized);
          // బ్రౌజర్ URL ని అప్‌డేట్ చేస్తాము (రీలోడ్ అవ్వకుండా)
          const newUrl = window.location.pathname + `?page=${targetPageParam}`;
          window.history.pushState({}, "", newUrl);
          return;
        } else {
          // If it's just the root app URL or within the app without a specific page parameter, stay on Home page internally
          const cleanPath = urlObj.pathname.replace(/\/$/, ""); // remove trailing slash for comparison
          const appPath = window.location.pathname.replace(/\/$/, "");
          const baseNoSlash = import.meta.env.BASE_URL.replace(/\/$/, "");
          if (cleanPath === appPath || cleanPath === baseNoSlash) {
            setActivePage("Home");
            window.history.pushState({}, "", window.location.pathname);
            return;
          }
        }
      }
      // Fallback: ఒకవేళ వేరే ఏమైనా URL ఉంటే నార్మల్ గా బ్రౌజర్ రీడైరెక్ట్
      window.location.href = url;
    } catch (e) {
      console.error("Failed to parse navigation URL", e);
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      if (url === base + "/" || url === base) {
        setActivePage("Home");
        window.history.pushState({}, "", window.location.pathname);
      } else {
        window.location.href = url;
      }
    }
  };

  // నోటిఫికేషన్ ద్వారా వచ్చిన సందేశాన్ని హ్యాండిల్ చేయడం
  const handleIncomingNotification = (notificationUrl) => {
    try {
      const urlObj = new URL(notificationUrl, window.location.origin);
      const params = urlObj.searchParams;

      const pushTitle = params.get("push_title");
      const pushBody = params.get("push_body");
      const targetUrl = params.get("target_url");
      const pushImportant = params.get("push_important");
      const pushForceRefresh = params.get("push_force_refresh") === "1";
      const pushId = params.get("push_id") || Date.now().toString();

      if (pushTitle || pushBody) {
        // Important అయితే LocalStorage లో సేవ్ చేయడం
        if (pushImportant === "1") {
          try {
            const existingMessages = JSON.parse(
              localStorage.getItem("horo_messages") || "[]",
            );
            if (!existingMessages.find((m) => m.id === pushId)) {
              existingMessages.unshift({
                id: pushId,
                title: pushTitle,
                body: pushBody,
                targetUrl: targetUrl,
                date: Date.now(),
                read: false,
                archived: false,
                forceRefresh: pushForceRefresh,
              });
              localStorage.setItem(
                "horo_messages",
                JSON.stringify(existingMessages),
              );
              // కొత్త మెసేజ్ రాగానే కౌంట్ అప్‌డేట్ అవ్వడానికి ఈవెంట్ ని పంపుతాం
              window.dispatchEvent(new Event("horo_messages_updated"));
            }
          } catch (e) {
            console.error("Failed to save message in foreground", e);
          }
        }

        setPushPopup({ title: pushTitle, body: pushBody, targetUrl, forceRefresh: pushForceRefresh });
      }
    } catch (e) {
      console.error("Error handling incoming notification URL:", e);
    }
  };

  useEffect(() => {
    // మొదటిసారి యాప్ లోడ్ అయినప్పుడు URL పారామీటర్స్ చెక్ చేయడం
    handleIncomingNotification(window.location.href);

    // iOS లో క్లీన్ URL తో ఓపెన్ అయినప్పుడు, Cache Storage నుండి డేటా చెక్ చేయడం
    if ("caches" in window) {
      caches.open("pending-push-clicks").then((cache) => {
        cache.match("/latest-click").then((response) => {
          if (response) {
            response
              .json()
              .then((data) => {
                // రీసెంట్ గా జరిగిన క్లిక్ అయితేనే (లాస్ట్ 5 నిమిషాలలో) ప్రాసెస్ చేస్తాం
                if (Date.now() - data.timestamp < 300000) {
                  handleIncomingNotification(data.url);
                }
              })
              .catch((err) => console.error("Cache read error:", err));
            // చెక్ చేసిన తర్వాత క్యాచ్ ఎంట్రీని తొలగిస్తాము
            cache.delete("/latest-click");
          }
        });
      });
    }

    // క్లీన్-అప్: URL లోని పుష్ నోటిఫికేషన్ పారామీటర్స్ ని తొలగిస్తాము
    const params = new URLSearchParams(window.location.search);
    if (
      params.has("push_title") ||
      params.has("push_body") ||
      params.has("push_important") ||
      params.has("push_id") ||
      params.has("push_force_refresh") ||
      params.has("target_url")
    ) {
      params.delete("push_title");
      params.delete("push_body");
      params.delete("target_url");
      params.delete("push_important");
      params.delete("push_id");
      params.delete("push_force_refresh");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname + (newSearch ? "?" + newSearch : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Service Worker నుండి Broadcast Channel ద్వారా వచ్చే సందేశాల కోసం Listener
  useEffect(() => {
    const channel = new BroadcastChannel("push-notification-channel");
    channel.onmessage = (event) => {
      if (event.data && event.data.type === "PUSH_NOTIFICATION_CLICK") {
        handleIncomingNotification(event.data.url);
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    // మొదటిసారి యాప్ లోడ్ అయినప్పుడు డీఫాల్ట్ సెట్టింగ్స్ ని సెట్ చేయడం
    const targetDoshas = [
      "Saptamastha Graha",
      "Bhrigu Shatka",
      "Ashtamastha Kuja",
      "Sankranti Dosha",
      "Asthangatha",
      "Grahanam (Eclipse)",
      "Grahana Utpata Dosha",
      "Rahu Kalam"
    ];
    const prefsStr = localStorage.getItem("eclock_prefs");
    let parsedPrefs = {};
    try {
      if (prefsStr) {
        parsedPrefs = JSON.parse(prefsStr);
        if (parsedPrefs.active_doshas) {
          let cleaned = parsedPrefs.active_doshas.filter(d => targetDoshas.includes(d));
          targetDoshas.forEach(d => {
            if (!cleaned.includes(d)) cleaned.push(d);
          });
          parsedPrefs.active_doshas = cleaned;
          localStorage.setItem("eclock_prefs", JSON.stringify(parsedPrefs));
        }
      }
    } catch (e) {}

    if (
      !parsedPrefs.panchanga_columns ||
      !parsedPrefs.active_doshas ||
      !parsedPrefs.ayanamsha_type
    ) {
      fetch(`${import.meta.env.BASE_URL}static/preferences.json`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch preferences.json");
        })
        .then((data) => {
          const mergedData = {
            ayanamsha_type: "lahiri",
            ayanamsha_val: "lahiri",
            ...data,
            ...parsedPrefs,
          };
          localStorage.setItem("eclock_prefs", JSON.stringify(mergedData));
          if (!localStorage.getItem("vaiswanara_default_location")) {
            localStorage.setItem(
              "vaiswanara_default_location",
              JSON.stringify({
                city: data.default_location || "Bengaluru",
                latitude: data.default_lat || 12.9716,
                longitude: data.default_lon || 77.5946,
                timezone: data.default_tz || 5.5,
              }),
            );
          }
        })
        .catch((err) =>
          console.error("Error loading default preferences:", err),
        );
    }
  }, []);

  useEffect(() => {
    const checkStandalone =
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(checkStandalone);

    // Check for iOS Safari
    const isIos =
      (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // For modern iPads
    if (isIos && !checkStandalone) {
      setIsIosEligible(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // ఆటోమేటిక్ ప్రాంప్ట్ రాకుండా ఆపుతుంది
      setDeferredPrompt(e); // ఈవెంట్ ని సేవ్ చేసుకుంటాం
      setIsInstallable(true); // మన కస్టమ్ బటన్ చూపించడానికి
    };

    const handleAppInstalled = () => {
      setIsInstallable(false); // ఇన్‌స్టాల్ అయ్యాక బటన్ దాచేయడానికి
      setDeferredPrompt(null);

      // Track successful PWA installation
      const gaId = import.meta.env.VITE_GA_ID;
      if (gaId && window.gtag) {
        window.gtag("event", "pwa_install", {
          method: "PWA",
          status: "success"
        });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstallable && deferredPrompt) {
      deferredPrompt.prompt(); // బ్రౌజర్ ఇన్‌స్టాల్ పాప్-అప్ చూపిస్తుంది
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false); // యూజర్ యాక్సెప్ట్ చేస్తే బటన్ దాచేస్తాం
        
        // Track install prompt acceptance
        const gaId = import.meta.env.VITE_GA_ID;
        if (gaId && window.gtag) {
          window.gtag("event", "pwa_install_accepted");
        }
      }
      setDeferredPrompt(null);
    }
  };

  const getBackendUrl = (filename) => {
    if (
      window.location.hostname === "localhost" &&
      window.location.port === "5173"
    ) {
      return `http://localhost${import.meta.env.BASE_URL}${filename}`;
    }
    return `${import.meta.env.BASE_URL}${filename}`;
  };

  const handlePushEnable = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    // --- 1. Request Permission IMMEDIATELY (Before any await) ---
    // This satisfies browser's strict requirement for user-interaction context.
    if (!pushEnabled) {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert(t("permissionDenied", "Notification permission denied!"));
          return;
        }
      } catch (err) {
        console.error("Permission request failed", err);
        alert("Notification permission request failed.");
        return;
      }
    }

    setPushLoading(true);
    try {
      // Service Worker ఉందో లేదో ముందే చెక్ చేయడం (లేకపోతే హ్యాంగ్ అవ్వకుండా ఆపడం)
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        alert(
          "Service Worker is not registered! Please ensure you are on HTTPS and reload the app.",
        );
        setPushLoading(false);
        return;
      }
      reg = await navigator.serviceWorker.ready;

      if (pushEnabled) {
        // --- UNSUBSCRIBE LOGIC (Disable Alerts) ---
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          try {
            await fetch(API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-token": API_TOKEN,
              },
              body: JSON.stringify({
                endpoint: "push_subscribe",
                sub_endpoint: sub.endpoint,
                action: "unsubscribe",
              }),
            });
          } catch (e) {
            console.error("Server unsubscribe failed", e);
          }
          await sub.unsubscribe();
        }
        setPushEnabled(false);
        alert(t("alertsDisabled", "Daily alerts disabled."));
      } else {
        // --- SUBSCRIBE LOGIC (Enable Alerts) ---
        // Notification permission is already granted above!
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": API_TOKEN,
          },
          body: JSON.stringify({
            endpoint: "push_subscribe",
            sub_endpoint: sub.endpoint,
            keys: sub.toJSON().keys,
            action: "subscribe",
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.status === "error") {
          throw new Error("Server: " + responseData.message);
        }

        setPushEnabled(true);
        alert(
          t(
            "alertsEnabled",
            "Subscribed successfully! You will now receive daily alerts.",
          ),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Push setup failed: " + err.message);
    }
    setPushLoading(false);
  };

  return (
    <div className="app-shell">

      <Sidebar
        isOpen={isSidebarOpen}
        logoUrl={logoUrl}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setIsSidebarOpen(false);
        }}
        profileName={profileFirstName}
      />

      <style>{`
        @keyframes bell-shake {
          0% { transform: rotate(0); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          70% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
        @keyframes message-jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes spin-update {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-green {
          0% {
            box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
            background: rgba(46, 204, 113, 0.15);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(46, 204, 113, 0);
            background: rgba(46, 204, 113, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
            background: rgba(46, 204, 113, 0.15);
          }
        }
        @media (max-width: 480px) {
          .update-btn-text {
            display: none !important;
          }
          .header-update-btn {
            padding: 6px !important;
            border-radius: 50% !important;
          }
        }
      `}</style>
      {/* Unified Top App Bar */}
      <header
        className="app-top-bar"
        style={{
          background: "linear-gradient(135deg, #9e6f60, #6f2a18)",
          color: "#fff",
          padding: "calc(env(safe-area-inset-top, 0px) + 12px) 20px 12px 20px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "10px",
          alignItems: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: isSidebarOpen ? 900 : 998,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "29px",
              cursor: "pointer",
              padding: 0,
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            ☰
          </button>
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              title={t("updateAvailable", "Update Available - Click to Reload")}
              className="header-update-btn"
              style={{
                background: "rgba(46, 204, 113, 0.15)",
                border: "1px solid rgba(46, 204, 113, 0.4)",
                color: "#2ecc71",
                fontSize: "13px",
                fontWeight: "bold",
                borderRadius: "20px",
                padding: "5px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                animation: "pulse-green 2s infinite ease-in-out",
                boxShadow: "0 0 10px rgba(46, 204, 113, 0.2)",
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  animation: "spin-update 4s infinite linear",
                  display: "inline-block",
                }}
              >
                🔄
              </span>
              <span className="update-btn-text">Update</span>
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingLeft: "4px",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "#ffffff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {activePage === "Home"
              ? t("Home", "e-JYOTISHA")
              : activePage === "e-Jataka"
                ? t("Jataka", "e-JATAKA")
                : activePage === "e-Match"
                  ? t("Match", "e-MATCH")
                  : activePage === "Sankalpa"
                    ? t("Sankalpa", "SANKALPA")
                    : activePage === "Me"
                      ? (profileFirstName ? profileFirstName.toUpperCase() : t("Me", "ME"))
                    : activePage === "e-Panchanga"
                      ? t("Panchanga", "e-PANCHANGA")
                      : activePage === "Profiles"
                        ? t("profiles", "e-Profiles").toUpperCase()
                        : activePage === "Settings"
                          ? t("Settings", "Settings")
                          : activePage === "echakra"
                            ? t("Prashna", "e-PRASHNA")
                            : activePage === "e-PATA"
                              ? "e-PATA"
                              : activePage === "e-Clock"
                                ? t("AstroClock", "e-Clock").toUpperCase()
                                : activePage === "e-Eclipse"
                                  ? t("Eclipse", "ECLIPSE CENTRAL")
                                  : activePage === "e-Library"
                                    ? t("e-Library", "e-LIBRARY")
                                    : activePage === "e-Support"
                                      ? t("Support", "Support")
                                    : activePage === "Messages"
                                      ? t("Messages", "MESSAGES")
                                      : activePage === "changelog"
                                        ? t("whatsNew", "WHAT'S NEW")
                                        : activePage === "Help"
                                          ? t("Help", "FAQ")
                                          : activePage === "Privacy"
                                            ? t("Privacy", "PRIVACY POLICY")
                                            : activePage === "Feedback"
                                              ? t("Feedback", "FEEDBACK")
                                              : activePage === "Admin"
                                                ? "ADMIN DASHBOARD"
                                                : "e-JYOTISHA"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setActivePage("Messages")}
            title={t("messages", "Messages")}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "29px",
              cursor: "pointer",
              padding: 0,
              margin: 0,
              display: "flex",
              alignItems: "center",
              position: "relative",
              animation:
                unreadCount > 0
                  ? "message-jump 2s infinite ease-in-out"
                  : "none",
            }}
          >
            <svg
              width="29"
              height="29"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle
                cx="8"
                cy="10"
                r="1.5"
                fill="currentColor"
                stroke="none"
              ></circle>
              <circle
                cx="12"
                cy="10"
                r="1.5"
                fill="currentColor"
                stroke="none"
              ></circle>
              <circle
                cx="16"
                cy="10"
                r="1.5"
                fill="currentColor"
                stroke="none"
              ></circle>
            </svg>
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  background: "#e74c3c",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {!pushEnabled && (
            <button
              onClick={handlePushEnable}
              disabled={pushLoading}
              title={t("enableAlerts", "Enable Alerts")}
              style={{
                background: "transparent",
                border: "none",
                color: "#f1c40f",
                fontSize: "29px",
                cursor: pushLoading ? "wait" : "pointer",
                padding: 0,
                margin: 0,
                display: "flex",
                alignItems: "center",
                animation: pushLoading ? "none" : "bell-shake 2s infinite",
                opacity: pushLoading ? 0.5 : 1,
              }}
            >
              🔔
            </button>
          )}
        </div>
      </header>

      {/* Suspense Wraps the dynamic pages and shows a fallback loader */}
      <Suspense
        fallback={
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#8e44ad",
              fontWeight: "bold",
            }}
          >
            Loading page...
          </div>
        }
      >
        {activePage === "Home" && (
          <HomePage
            logoUrl={logoUrl}
            onNavigate={setActivePage}
            pushEnabled={pushEnabled}
            pushLoading={pushLoading}
            onEnablePush={handlePushEnable}
            needRefresh={needRefresh}
            updateServiceWorker={updateServiceWorker}
            isInstallable={isInstallable}
            isStandalone={isStandalone}
            isIosEligible={isIosEligible}
            profileName={profileFirstName}
          />
        )}
        {activePage === "Me" && (
          <MePage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}
        {activePage === "Sankalpa" && (
          <SankalpaPage onNavigate={setActivePage} />
        )}
        {activePage === "e-Jataka" && (
          <HoroscopePageNew logoUrl={logoUrl} onNavigate={setActivePage} />
        )}
        {activePage === "e-Match" && (
          <MatchPage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}
        {activePage === "e-Panchanga" && <PanchangaPage logoUrl={logoUrl} />}

        {activePage === "Profiles" && (
          <ProfilesPage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}
        {activePage === "Settings" && (
          <SettingsPage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}

        {activePage === "e-Install" && (
          <InstallPage
            logoUrl={logoUrl}
            isInstallable={isInstallable}
            isIosEligible={isIosEligible}
            onInstallClick={handleInstallClick}
            onNavigate={setActivePage}
            pushEnabled={pushEnabled}
            pushLoading={pushLoading}
            onEnablePush={handlePushEnable}
          />
        )}

        {activePage === "e-PATA" && (
          <EpataPage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}

        {activePage === "echakra" && <EPrashnaPage logoUrl={logoUrl} />}

        {activePage === "e-Clock" && <EClockPage logoUrl={logoUrl} />}

        {activePage === "e-Support" && <SupportPage logoUrl={logoUrl} />}
        {activePage === "Messages" && (
          <MessagesPage
            logoUrl={logoUrl}
            onNavigate={setActivePage}
            pushEnabled={pushEnabled}
            onEnablePush={handlePushEnable}
          />
        )}
        {activePage === "changelog" && <ChangelogPage logoUrl={logoUrl} />}
        {activePage === "Privacy" && <PrivacyPage logoUrl={logoUrl} />}
        {activePage === "Help" && (
          <HelpPage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}
        {activePage === "Feedback" && (
          <FeedbackPage logoUrl={logoUrl} onNavigate={setActivePage} />
        )}
        {activePage === "Admin" && <AdminPage onNavigate={setActivePage} />}
        {activePage === "PrecisionTest" && (
          <EPrecisionTestPage logoUrl={logoUrl} />
        )}
        {activePage === "e-Eclipse" && (
          <EclipsePage logoUrl={logoUrl} />
        )}
        {activePage === "e-Library" && (
          <ELibraryPage logoUrl={logoUrl} />
        )}
      </Suspense>

      <BottomNav
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        profileName={profileFirstName}
      />

      {/* Push Notification Popup Modal */}
      {pushPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "25px 20px",
              maxWidth: "400px",
              width: "100%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ overflowY: "auto", flex: 1, marginBottom: "20px", paddingRight: "5px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔔</div>
              <h2
                style={{
                  color: "#8e44ad",
                  marginTop: 0,
                  marginBottom: "15px",
                  fontSize: "22px",
                }}
              >
                {pushPopup.title || "Message"}
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#34495e",
                  lineHeight: "1.6",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {pushPopup.body}
              </p>
            </div>
            <button
              onClick={() => {
                const url = pushPopup.targetUrl;
                const needRefresh = pushPopup.forceRefresh;
                setPushPopup(null);
                navigateToTargetUrl(url);
                if (needRefresh) {
                  performHardRefresh();
                }
              }}
              style={{
                background: "linear-gradient(135deg, #8e44ad, #732d91)",
                color: "#fff",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
                boxShadow: "0 4px 15px rgba(142, 68, 173, 0.3)",
                flexShrink: 0,
              }}
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}
      {/* In-App Message Popup Modal */}
      {currentInApp && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.65)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            backdropFilter: "blur(5px)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px 25px 25px 25px",
              maxWidth: "450px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
              boxSizing: "border-box",
            }}
          >
            {/* Header Icon */}
            <div style={{ textAlign: "center", marginBottom: "15px", flexShrink: 0 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f39c12, #e67e22)",
                  boxShadow: "0 5px 15px rgba(230, 126, 34, 0.3)",
                fontSize: "35px",
                color: "#fff",
              }}
            >
              🔔
            </div>
            </div>

            {/* Scrollable Content Container */}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                marginBottom: "25px",
                paddingRight: "8px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  color: "#2c3e50",
                  marginTop: 0,
                  marginBottom: "15px",
                  fontSize: "22px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                }}
              >
                {currentInApp.title}
              </h2>
              <p
                style={{
                  fontSize: "15.5px",
                  color: "#555",
                  lineHeight: "1.6",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  textAlign: "left",
                }}
              >
                {currentInApp.body}
              </p>
            </div>

            {/* Actions Button Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
              {hasValidUrl(currentInApp.url) && (
                <button
                  onClick={() => handleDismissInApp(currentInApp, "link")}
                  style={{
                    background: "linear-gradient(135deg, #8e44ad, #732d91)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "100%",
                    boxShadow: "0 4px 15px rgba(142, 68, 173, 0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  🔗 Open Link & View
                </button>
              )}
              <button
                onClick={() => handleDismissInApp(currentInApp, "ok")}
                style={{
                  background: "#f1f2f6",
                  color: "#2c3e50",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.2s",
                }}
              >
                OK, Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "85px", // sits perfectly above the bottom navigation bar
            left: "50%",
            transform: toastVisible
              ? "translateX(-50%) translateY(0)"
              : "translateX(-50%) translateY(20px)",
            opacity: toastVisible ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            background: getToastBackground(toast.type),
            color: "#fffdf8",
            padding: "12px 24px",
            borderRadius: "30px",
            boxShadow: getToastShadow(toast.type),
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: "600",
            backdropFilter: "blur(6px)",
            animation: toastVisible
              ? "toast-spring-entry 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
              : "none",
            border: getToastBorder(toast.type),
            maxWidth: "90%",
            width: "max-content",
            pointerEvents: toastVisible ? "auto" : "none",
          }}
        >
          <span style={{ fontSize: "16px" }}>{getToastIcon(toast.type)}</span>
          <span
            style={{
              display: "inline-block",
              maxWidth: "300px",
              wordBreak: "break-word",
            }}
          >
            {toast.message}
          </span>
          <button
            onClick={() => setToastVisible(false)}
            style={{
              background: "none",
              border: "none",
              color: "#fffdf8",
              cursor: "pointer",
              fontSize: "18px",
              marginLeft: "8px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              opacity: 0.8,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "0.8";
            }}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
