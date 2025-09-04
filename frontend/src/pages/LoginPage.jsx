import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form.email, form.password);
      nav("/admin");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={form.email}
          onChange={(e)=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password}
          onChange={(e)=>setForm({...form, password:e.target.value})}/>
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
