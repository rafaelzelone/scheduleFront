import { useEffect, useState } from "react";
import { X as CloseIcon, Plus } from "lucide-react";
import "./adjustmentModal.css";
import { scheduleTimeService } from "../../service/request/scheduleTimeService";
import { roomService } from "../../service/request/roomService";
import { Toast } from "../toast/toast";

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoomSchedule {
  id?: string;
  roomName: string;
  startTime: string;
  endTime: string;
  blockMinutes: number;
}

export function AdjustmentModal({ isOpen, onClose }: AdjustmentModalProps) {
  const [rooms, setRooms] = useState<RoomSchedule[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      try {
        const { data } = await scheduleTimeService.list();
        const loadedRooms: RoomSchedule[] = data.map((item: any) => ({
          id: item.id,
          roomName: item.room.name,
          startTime: item.startTime,
          endTime: item.endTime,
          blockMinutes: item.blockMinutes,
        }));
        setRooms(loadedRooms);
      } catch (error) {
        console.error("Erro ao carregar dados das salas", error);
      }
    }

    loadData();
  }, [isOpen]);

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        roomName: "",
        startTime: "08:00",
        endTime: "09:00",
        blockMinutes: 30,
      },
    ]);
  };

  const handleRoomChange = (index: number, field: keyof RoomSchedule, value: any) => {
    const updated: any = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      for (const room of rooms) {
        if (!room.roomName || !room.startTime || !room.endTime) {
          setToast({ message: 'Campos obrigatórios não preenchidos.', type: 'error' });

          continue;
        }

        if (room.id) {
          await scheduleTimeService.update(room.id, {
            startTime: room.startTime,
            endTime: room.endTime,
            blockMinutes: room.blockMinutes,
          });
        } else {
          const { data: newRoom } = await roomService.create({ name: room.roomName });

          await scheduleTimeService.create({
            roomId: newRoom.id,
            startTime: room.startTime,
            endTime: room.endTime,
            blockMinutes: room.blockMinutes,
          });
        }
      }

      onClose();
    } catch (error) {
      setToast({ message: 'Ocorreu um erro ao altera o agendamento.', type: 'error' });

    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2 className="modalTitle">Ajustes de agendamento</h2>
          <button className="closeButton" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="modalBody">
          {rooms.map((room, index) => (
            <div key={index} className="roomCard">
              <div className="inputGroup">
                <label className="inputLabel">Nome da sala</label>
                <input
                  className="modalInput"
                  value={room.roomName}
                  onChange={(e) => handleRoomChange(index, "roomName", e.target.value)}
                  placeholder="Digite o nome da sala"
                />
              </div>

              <div className="inputGroup">
                <label className="inputLabel">Horário Inicial & Final da sala</label>
                <input
                  className="modalInput"
                  value={`${room.startTime} - ${room.endTime}`}
                  onChange={(e) => {
                    const [start, end] = e.target.value.split(" - ");
                    handleRoomChange(index, "startTime", start?.trim() || "");
                    handleRoomChange(index, "endTime", end?.trim() || "");
                  }}
                  placeholder="HH:MM - HH:MM"
                />
              </div>

              <div className="inputGroup">
                <label className="inputLabel">Bloco de Horários de agendamento</label>
                <select
                  className="modalSelect"
                  value={room.blockMinutes}
                  onChange={(e) => handleRoomChange(index, "blockMinutes", Number(e.target.value))}
                >
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                </select>
              </div>
            </div>
          ))}

          <button className="addRoomButton" onClick={handleAddRoom}>
            <Plus size={16} /> Adicionar nova sala
          </button>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="modalFooter">
          <button className="saveButton" onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
