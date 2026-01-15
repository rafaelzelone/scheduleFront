import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import "./loginClient.css";
import { authService } from "../../service/request/authService";

export function LoginClient() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  useEffect(() => {
    setIsEmailValid(!!validateEmail(email));
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValid || password.length === 0) return;

    try {
      setLoading(true);
      const response = await authService.login(email, password);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.admin) {
        navigate("/admin/schedule");
      } else {
        navigate("/my-schedule");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <header className="loginNavbar">
        <div className="logoPlaceholder">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 30L30 10M15 35L35 15M5 25L25 5" stroke="black" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </header>

      <main className="loginContent">
        <div className="loginCard">
          <h1 className="loginTitle">Entre na sua conta</h1>

          <form onSubmit={handleLogin} className="loginForm">
            <div className="inputGroup">
              <label className="inputLabel">E-mail (Obrigatório)</label>
              <input
                required
                type="email"
                placeholder="insira seu e-mail"
                className="loginInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {isEmailValid && (
              <div className="inputGroup slideIn">
                <label className="inputLabel">Senha de acesso (Obrigatório)</label>
                <div className="passwordWrapper">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="***************"
                    className="loginInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            )}

            {error && <p className="errorText">{error}</p>}

            <button
              type="submit"
              className={`submitButton ${(!isEmailValid || password.length === 0 || loading) ? 'btnDisabled' : ''}`}
              disabled={!isEmailValid || password.length === 0 || loading}
            >
              {loading ? "Entrando..." : "Acessar conta"}
            </button>
          </form>

          <p className="footerText">
            Ainda não tem uma conta?{' '}
            <span className="linkText" onClick={() => navigate('/create')}>
              Cadastre-se
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
