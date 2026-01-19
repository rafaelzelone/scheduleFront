import React, { useEffect, useState } from 'react';
import { EyeOff, Loader2 } from 'lucide-react';
import { userService } from '../../service/request/userService';
import { clientService } from '../../service/request/clientService';
import './myAccount.css';
import { ModalWarning } from '../../components/modalWarning/modalWarning';

export const MyAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await userService.getById("me");
        const user = userResponse.data;
        setUserId(user.id);

        const clientResponse = await clientService.getMe();
        const client = clientResponse.data;
        setClientId(client.id);

        setFormData({
          nome: user.firstName || '',
          sobrenome: user.lastName || '',
          email: user.email || '',
          senha: 'password123',
          cep: client.CEP || '',
          endereco: client.street || '',
          numero: client.number || '',
          complemento: client.complement || '',
          bairro: client.neighboor || '',
          cidade: client.city || '',
          estado: client.state || ''
        });
      } catch (error) {
        console.error(error);
        setModalMessage("Erro ao carregar dados do usuário e cliente");
        setModalOpen(true);
      }
    };
    fetchData();
  }, []);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            cep: e.target.value
          }));
        }
      } catch (error) {
        console.error(error);
        setModalMessage("Erro ao buscar CEP");
        setModalOpen(true);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId || !clientId) return;
    setIsSaving(true);
    try {
      await userService.update(userId, {
        firstName: formData.nome,
        lastName: formData.sobrenome,
        email: formData.email,
        password: formData.senha
      });

      await clientService.update(clientId, {
        CEP: formData.cep,
        street: formData.endereco,
        number: formData.numero,
        complement: formData.complemento,
        neighboor: formData.bairro,
        city: formData.cidade,
        state: formData.estado
      });

      setModalMessage("Dados salvos com sucesso!");
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalMessage("Ocorreu um erro ao salvar os dados");
      setModalOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Minha conta</h1>
        <p>Ajuste informações da sua conta de forma simples</p>
      </header>

      <main className="form-wrapper">
        <div className="card">
          <form className="account-form" onSubmit={e => e.preventDefault()}>
            <div className="row">
              <div className="field">
                <label>NOME <span>(Obrigatório)</span></label>
                <input name="nome" type="text" value={formData.nome} onChange={handleChange} />
              </div>
              <div className="field">
                <label>SOBRENOME <span>(Obrigatório)</span></label>
                <input name="sobrenome" type="text" value={formData.sobrenome} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label>E-MAIL <span>(Obrigatório)</span></label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="field">
              <label>SENHA DE ACESSO <span>(Obrigatório)</span></label>
              <div className="input-with-icon">
                <input type={showPassword ? "text" : "password"} value={formData.senha} onChange={handleChange} name="senha" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  <EyeOff size={18} />
                </button>
              </div>
            </div>

            <div className="field">
              <label>CEP <span>(Obrigatório)</span></label>
              <div className="input-with-icon">
                <input name="cep" type="text" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} />
                {isLoadingCep && <Loader2 size={18} className="spinner" />}
              </div>
            </div>

            <div className="field">
              <label>ENDEREÇO</label>
              <input type="text" value={formData.endereco} className="disabled" readOnly />
            </div>

            <div className="row">
              <div className="field">
                <label>NÚMERO</label>
                <input name="numero" type="text" value={formData.numero} onChange={handleChange} />
              </div>
              <div className="field">
                <label>COMPLEMENTO</label>
                <input name="complemento" type="text" value={formData.complemento} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label>BAIRRO</label>
              <input type="text" value={formData.bairro} className="disabled" readOnly />
            </div>

            <div className="row">
              <div className="field">
                <label>CIDADE</label>
                <input type="text" value={formData.cidade} className="disabled" readOnly />
              </div>
              <div className="field">
                <label>ESTADO</label>
                <input type="text" value={formData.estado} className="disabled" readOnly />
              </div>
            </div>

            <button type="button" className="btn-save" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 size={18} className="spinner" /> : 'Salvar'}
            </button>
          </form>
        </div>
      </main>

      <ModalWarning
        isOpen={modalOpen}
        title='Atualização de dados'
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};
