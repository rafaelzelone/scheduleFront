import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "lucide-react";
import "./login.css";
import { authService } from "../../service/request/authService";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const response = await authService.login(email, password);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/schedule");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "E-mail ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 30L30 10M15 35L35 15M5 25L25 5"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="loginTitle">Login Admin</h1>

        <form onSubmit={handleLogin} className="loginForm">
          <div className="inputGroup">
            <label className="inputLabel">E-mail (Obrigatório)</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mateus@goldspell.com.br"
              className="loginInput"
            />
          </div>

          <div className="inputGroup">
            <label className="inputLabel">Senha de acesso (Obrigatório)</label>
            <div className="passwordWrapper">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="***************"
                className="loginInput"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eyeButton"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {error && <span className="loginError">{error}</span>}

          <button
            type="submit"
            className="submitButton"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Acessar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
