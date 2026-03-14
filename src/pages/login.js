import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BRAND = "#e55d6a";

export default function LoginPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/";
  const [tab, setTab] = useState("login");   // "login" | "register"
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (session) router.replace(callbackUrl); }, [session]);

  if (status === "loading") return null;

  const handleCredentials = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await signIn("credentials", {
      redirect: false, email, password: pass,
    });
    setLoading(false);
    if (res?.error) setErr("Invalid email or password");
    else router.replace(callbackUrl);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "linear-gradient(135deg,#fff5f5,#fff)",
      padding: "2rem", fontFamily: "'DM Sans',sans-serif"
    }}>

      <div style={{
        background: "#fff", borderRadius: 24, padding: "2.5rem 2rem",
        maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: "0 24px 60px rgba(229,93,106,.15)",
        border: "1.5px solid rgba(229,93,106,.15)"
      }}>

        <div style={{ fontSize: "2.8rem", marginBottom: ".5rem" }}>👡</div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontSize: "1.9rem",
          color: "#1a1a1a", margin: "0 0 .3rem"
        }}>POPPYPINK</h1>
        <p style={{ color: "#aaa", fontSize: ".85rem", marginBottom: "2rem" }}>
          Sign in to place your order
        </p>

        {/* Google */}
        <button onClick={() => signIn("google", { callbackUrl })}
          style={{
            width: "100%", padding: ".85rem", borderRadius: 12,
            border: "1.5px solid #e8e8e8", background: "#fff", cursor: "pointer",
            fontWeight: 700, fontSize: ".9rem", display: "flex", alignItems: "center",
            justifyContent: "center", gap: ".6rem", marginBottom: "1.25rem",
            transition: "box-shadow .2s"
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)"}
          onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={20} alt="G" />
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
          <span style={{ color: "#ccc", fontSize: ".75rem", fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "#f7f7f7", borderRadius: 10,
          padding: 3, marginBottom: "1.25rem"
        }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(""); }}
              style={{
                flex: 1, padding: ".55rem", border: "none", cursor: "pointer",
                borderRadius: 8, fontWeight: 700, fontSize: ".82rem",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? BRAND : "#aaa",
                boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                transition: "all .2s", textTransform: "capitalize"
              }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleCredentials}
          style={{ display: "flex", flexDirection: "column", gap: ".75rem", textAlign: "left" }}>
          <div>
            <label style={{
              fontSize: ".78rem", fontWeight: 700, color: "#555",
              display: "block", marginBottom: ".3rem"
            }}>Email</label>
            <input type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: "100%", padding: ".7rem .9rem", borderRadius: 10,
                border: `1.5px solid ${err ? "#dc2626" : "rgba(229,93,106,.2)"}`,
                fontSize: ".88rem", outline: "none", boxSizing: "border-box",
                fontFamily: "'DM Sans',sans-serif"
              }} />
          </div>
          <div>
            <label style={{
              fontSize: ".78rem", fontWeight: 700, color: "#555",
              display: "block", marginBottom: ".3rem"
            }}>Password</label>
            <input type="password" required value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: ".7rem .9rem", borderRadius: 10,
                border: `1.5px solid ${err ? "#dc2626" : "rgba(229,93,106,.2)"}`,
                fontSize: ".88rem", outline: "none", boxSizing: "border-box",
                fontFamily: "'DM Sans',sans-serif"
              }} />
          </div>

          {err && <p style={{ color: "#dc2626", fontSize: ".78rem", margin: 0 }}>{err}</p>}

          {tab === "register" && (
            <p style={{ color: "#aaa", fontSize: ".75rem", margin: 0 }}>
              Registration coming soon — use Google sign-in for now.
            </p>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: ".85rem", borderRadius: 12, border: "none",
              background: BRAND, color: "#fff", fontWeight: 800, fontSize: ".92rem",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1,
              boxShadow: "0 8px 24px rgba(229,93,106,.3)",
              fontFamily: "'DM Sans',sans-serif", transition: "all .3s"
            }}>
            {loading ? "Signing in…" : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p style={{ color: "#ccc", fontSize: ".72rem", marginTop: "1.5rem" }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}