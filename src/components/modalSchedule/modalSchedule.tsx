import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './modalSchedule.css';
import { createSchedule } from '../../service/request/scheduleService';
import { roomService } from '../../service/request/roomService';
import { Toast } from '../toast/toast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalNovoAgendamento({ isOpen, onClose }: ModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await roomService.list();
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


    if (!date || !time || !room) {
      setToast({ message: 'Todos os campos são obrigatórios.', type: 'error' });

      return;
    }

    setLoading(true);
    try {
      await createSchedule({ date, time, roomId: room });
      setToast({ message: 'Agendamento criado com sucesso!', type: 'success' });
      setDate('');
      setTime('');
      setRoom('');
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.response?.data?.message || 'Ocorreu um erro ao criar o agendamento.', type: 'error' });
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
            </div>
          </div>

          <div className="modalInputGroup">
            <label>Selecione um <strong>horário</strong> (Obrigatório)</label>
            <div className="inputWrapper">
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
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

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
          <button type="submit" className="btnConfirmarAgendamento" disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  );
}
