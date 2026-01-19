import { useEffect, useState } from "react";
import { Search, Calendar, Check, X } from "lucide-react";
import "./scheliude.css";
import { Pagination } from "../../components/page/pagination";
import { AdjustmentModal } from "../../components/adjustmentModal/ajustimentModal";
import { cancelSchedule, confirmSchedule, getSchedules } from "../../service/request/scheduleService";
import { ModalNovoAgendamento } from "../../components/modalSchedule/modalSchedule";
import notLogo from '../../../public/msgNot.svg';
import type { Schedule } from "../../type/schedule";

export function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Schedule[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadSchedules() {
    try {
      setLoading(true);
      const response = await getSchedules({
        page,
        pageSize: 10,
        customerName: searchName || undefined,
        date: searchDate || undefined,
      });

      setAgendamentos(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setIsAdmin(response.data.isAdmin);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, [page, searchName, searchDate]);

  async function handleCancel(id: string) {
    await cancelSchedule(id);
    loadSchedules();
  }

  async function handleConfirm(id: string) {
    await confirmSchedule(id);
    loadSchedules();
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Agendamentos</h1>
        <p className="subtitle">
          Acompanhe todos os agendamentos de clientes de forma simples
        </p>
      </header>

      <div className="conteiner-schedule">
        <div className="topActions">
          <div className="searchGroup">
            <div className="inputWrapper">
              <Search className="inputIcon" size={18} />
              <input
                type="text"
                placeholder="Filtre por nome"
                className="inputField"
                value={searchName}
                onChange={(e) => { setPage(1); setSearchName(e.target.value); }}
              />
            </div>

            <div className="inputWrapper" style={{ maxWidth: "160px" }}>
              <input
                type="date"
                className="inputField"
                value={searchDate}
                onChange={(e) => { setPage(1); setSearchDate(e.target.value); }}
              />
              <Calendar className="inputIcon" style={{ left: "auto", right: "12px" }} size={18} />
            </div>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btnAjustes">
            {isAdmin ? "Ajustes de agendamento" : "Novo agendamento"}
          </button>
        </div>

        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>Data agendamento</th>
                <th>Nome</th>
                <th>Sala de agendamento</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((item) => (
                <tr key={item.id} className={item.status === "CONFIRMED" ? "" : item.status === "CANCELED" ? "rowCanceled" : "rowConfirmed"}>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td><div className="clientCell"><span className="clientName">{item.customer.name}</span><span className="clientLabel">Cliente</span></div></td>
                  <td><span className="badgeSala">{item.room.name}</span></td>
                  <td><span className={`statusBadge ${item.status === "PEDDING" ? "statusPedding" : item.status === "CANCELED" ? "statusCanceled" : "statusConfirmed"}`}>{item.status}</span></td>
                  <td>
                    <div className="actionButtons">
                      <button className="iconBtn btnX" onClick={() => handleCancel(item.id)}><X size={14} /></button>
                      {isAdmin && item.status === "PEDDING" && <button className="iconBtn btnCheck" onClick={() => handleConfirm(item.id)}><Check size={14} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && agendamentos.length === 0 && (<tr><td colSpan={5} style={{ textAlign: "center" }}>
                <img
                  src={notLogo}
                  alt="Notification"
                  className="not-logo"
                />
              </td></tr>)}
            </tbody>
          </table>

          {isAdmin ? (
            <AdjustmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          ) : (
            <ModalNovoAgendamento isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
