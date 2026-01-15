import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import './modalSchedule.css';
import { createSchedule } from '../../service/request/scheduleService';
import { roomService } from '../../service/request/roomService';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalNovoAgendamento({ isOpen, onClose }: ModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await roomService.list();
        // supondo que a API retorne array de { id, name }
        setRooms(response.data);
      } catch (err) {
        console.error('Erro ao buscar salas', err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!date || !time || !room) {
      setErrorMessage('Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await createSchedule({ date, time, room });
      setSuccessMessage('Agendamento criado com sucesso!');
      setDate('');
      setTime('');
      setRoom('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Ocorreu um erro ao criar o agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalAgendamento">
        <header className="modalHeader">
          <h2>Novo Agendamento</h2>
          <button onClick={onClose} className="btnCloseModal">
            <X size={20} />
          </button>
        </header>

        <form className="modalForm" onSubmit={handleSubmit}>
          <div className="modalInputGroup">
            <label>Selecione uma <strong>data</strong> (Obrigatório)</label>
            <div className="inputWrapper">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Calendar size={18} className="inputIcon" />
            </div>
          </div>

          <div className="modalInputGroup">
            <label>Selecione um <strong>horário</strong> (Obrigatório)</label>
            <div className="inputWrapper">
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              <Clock size={18} className="inputIcon" />
            </div>
          </div>

          <div className="modalInputGroup">
            <label>Selecione uma <strong>sala</strong> (Obrigatório)</label>
            <div className="selectWrapperModal">
              {loadingRooms ? (
                <p>Carregando salas...</p>
              ) : (
                <select value={room} onChange={(e) => setRoom(e.target.value)}>
                  <option value="" disabled>Selecione uma sala</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {errorMessage && <p className="modalError">{errorMessage}</p>}
          {successMessage && <p className="modalSuccess">{successMessage}</p>}

          <button type="submit" className="btnConfirmarAgendamento" disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  );
}
