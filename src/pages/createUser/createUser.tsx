import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOff, Eye, Loader2 } from 'lucide-react';
import './createUser.css';
import { authService } from '../../service/request/authService';

export function CreateUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }));
        setAddressVisible(true);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar campos obrigatórios
    if (!formData.nome || !formData.sobrenome || !formData.email || !formData.senha || !formData.cep) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoadingSubmit(true);
      await authService.register({
        email: formData.email,
        firstName: formData.nome,
        lastName: formData.sobrenome,
        password: formData.senha,
        CEP: formData.cep,
        street: formData.endereco,
        number: formData.numero,
        complement: formData.complemento,
        neighboor: formData.bairro,
        city: formData.cidade,
        state: formData.estado
      });

      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="registerContainer">
      <header className="registerNavbar">
        <div className="logoPlaceholder">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <path d="M10 30L30 10M15 35L35 15M5 25L25 5" stroke="black" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <button className="btnLogin" onClick={() => navigate('/login')}>Login</button>
      </header>

      <main className="registerContent">
        <div className="registerCard">
          <h1 className="registerTitle">Cadastre-se</h1>

          <form className="registerForm" onSubmit={handleSubmit}>
            <div className="row">
              <div className="inputGroup">
                <label className="inputLabel">Nome (Obrigatório)</label>
                <input id="nome" type="text" placeholder="ex: José" className="registerInput" onChange={handleChange} />
              </div>
              <div className="inputGroup">
                <label className="inputLabel">Sobrenome (Obrigatório)</label>
                <input id="sobrenome" type="text" placeholder="ex: Lima" className="registerInput" onChange={handleChange} />
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">E-mail (Obrigatório)</label>
              <input id="email" type="email" placeholder="insira seu e-mail" className="registerInput" onChange={handleChange} />
            </div>

            <div className="inputGroup">
              <label className="inputLabel">Senha de acesso (Obrigatório)</label>
              <div className="passwordWrapper">
                <input 
                  id="senha"
                  type={showPassword ? "text" : "password"} 
                  placeholder="insira sua senha" 
                  className="registerInput"
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="eyeButton">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel">CEP (Obrigatório)</label>
              <div className="inputWithLoader">
                <input 
                  id="cep" 
                  type="text" 
                  placeholder="00000-000" 
                  className="registerInput" 
                  onBlur={handleCepBlur}
                  onChange={handleChange}
                />
                {loadingCep && <Loader2 size={16} className="spinner" />}
              </div>
            </div>

            {addressVisible && (
              <div className="addressSection slideIn">
                <div className="inputGroup">
                  <label className="inputLabel">Endereço</label>
                  <input id="endereco" type="text" value={formData.endereco} className="registerInput inputReadOnly" readOnly />
                </div>

                <div className="row">
                  <div className="inputGroup" style={{ flex: '0.3' }}>
                    <label className="inputLabel">Número</label>
                    <input id="numero" type="text" placeholder="42" className="registerInput" onChange={handleChange} />
                  </div>
                  <div className="inputGroup">
                    <label className="inputLabel">Complemento</label>
                    <input id="complemento" type="text" placeholder="Sala 1302" className="registerInput" onChange={handleChange} />
                  </div>
                </div>

                <div className="inputGroup">
                  <label className="inputLabel">Bairro</label>
                  <input id="bairro" type="text" value={formData.bairro} className="registerInput inputReadOnly" readOnly />
                </div>

                <div className="row">
                  <div className="inputGroup">
                    <label className="inputLabel">Cidade</label>
                    <input id="cidade" type="text" value={formData.cidade} className="registerInput inputReadOnly" readOnly />
                  </div>
                  <div className="inputGroup" style={{ flex: '0.4' }}>
                    <label className="inputLabel">Estado</label>
                    <input id="estado" type="text" value={formData.estado} className="registerInput inputReadOnly" readOnly />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="errorText">{error}</p>}

            <button type="submit" className="submitButton" disabled={loadingSubmit}>
              {loadingSubmit ? 'Cadastrando...' : 'Cadastrar-se'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
