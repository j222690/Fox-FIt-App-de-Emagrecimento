import { useState, useEffect } from "react";
import { X, Share, Plus } from "lucide-react";

const IOS_INSTALL_KEY = "foxfit-ios-banner-dismissed";
const DISMISS_DAYS = 3;

function isIOS() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window as any).MSStream
  );
}

function isInStandaloneMode() {
  return (
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function wasDismissedRecently(): boolean {
  const ts = localStorage.getItem(IOS_INSTALL_KEY);
  if (!ts) return false;
  const diff = Date.now() - parseInt(ts, 10);
  return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function PWAInstallBanner() {
  const [showIOS, setShowIOS] = useState(false);
  const [showAndroid, setShowAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Android / Chrome: captura o evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroid(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari
    if (isIOS() && !isInStandaloneMode() && !wasDismissedRecently()) {
      // Pequeno delay para não aparecer imediatamente
      const t = setTimeout(() => setShowIOS(true), 2000);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismissIOS() {
    localStorage.setItem(IOS_INSTALL_KEY, Date.now().toString());
    setShowIOS(false);
  }

  async function installAndroid() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowAndroid(false);
    setDeferredPrompt(null);
  }

  // ── iOS Banner ──────────────────────────────────────────────
  if (showIOS) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "linear-gradient(135deg, #1a2332 0%, #0d1117 100%)",
          borderTop: "1px solid #22c55e44",
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px 32px",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
        }}
      >
        {/* Fechar */}
        <button
          onClick={dismissIOS}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "#ffffff18",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img
            src="/icon-192.png"
            alt="Fox Fit"
            style={{ width: 48, height: 48, borderRadius: 12 }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Instalar Fox Fit</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              Adicione à sua tela inicial
            </div>
          </div>
        </div>

        {/* Passos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Passo 1 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#ffffff0d",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                background: "#22c55e",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              1
            </div>
            <div style={{ fontSize: 14 }}>
              Toque no ícone{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#3b82f620",
                  border: "1px solid #3b82f660",
                  borderRadius: 6,
                  padding: "1px 6px",
                  gap: 3,
                  verticalAlign: "middle",
                }}
              >
                <Share size={13} color="#60a5fa" />
                <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: 13 }}>
                  Compartilhar
                </span>
              </span>{" "}
              no Safari
            </div>
          </div>

          {/* Passo 2 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#ffffff0d",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                background: "#22c55e",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              2
            </div>
            <div style={{ fontSize: 14 }}>
              Role e toque em{" "}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#22c55e20",
                  border: "1px solid #22c55e60",
                  borderRadius: 6,
                  padding: "1px 6px",
                  gap: 3,
                  verticalAlign: "middle",
                }}
              >
                <Plus size={13} color="#22c55e" />
                <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 13 }}>
                  Adicionar à Tela de Início
                </span>
              </span>
            </div>
          </div>

          {/* Passo 3 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#ffffff0d",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                background: "#22c55e",
                borderRadius: "50%",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              3
            </div>
            <div style={{ fontSize: 14 }}>
              Confirme tocando em{" "}
              <span style={{ color: "#22c55e", fontWeight: 700 }}>Adicionar</span>{" "}
              no canto superior direito
            </div>
          </div>
        </div>

        {/* Seta apontando para baixo */}
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 22,
            animation: "bounce 1.2s infinite",
          }}
        >
          👇
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
        `}</style>
      </div>
    );
  }

  // ── Android Banner ───────────────────────────────────────────
  if (showAndroid) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 9999,
          background: "linear-gradient(135deg, #1a2332 0%, #0d1117 100%)",
          border: "1px solid #22c55e44",
          borderRadius: 16,
          padding: "14px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
        }}
      >
        <img
          src="/icon-192.png"
          alt="Fox Fit"
          style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Instalar Fox Fit</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Adicione à tela inicial
          </div>
        </div>
        <button
          onClick={installAndroid}
          style={{
            background: "#22c55e",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Instalar
        </button>
        <button
          onClick={() => setShowAndroid(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            padding: 4,
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return null;
}
