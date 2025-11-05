import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(form.name, form.email, form.password);
      nav("/admin");
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Create Admin Account</h2>
      {err && <p style={{color:"red"}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name}
          onChange={(e)=>setForm({...form, name:e.target.value})}/>
        <input placeholder="Email" value={form.email}
          onChange={(e)=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password}
          onChange={(e)=>setForm({...form, password:e.target.value})}/>
        <button type="submit">Sign up</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}