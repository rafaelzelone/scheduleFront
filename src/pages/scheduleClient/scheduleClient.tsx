import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, X, ChevronRight, UserCircle } from 'lucide-react';
import './scheduleClient.css';
import { Pagination } from '../../components/page/pagination';
import { ModalNovoAgendamento } from '../../components/modalSchedule/modalSchedule';

export function MeusAgendamentos() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [agendamentos, setAgendamentos] = useState([
    { id: 1, data: '22/01/2026 às 16:00', nome: 'Camila Mendes', sala: 'Sala 012', status: 'Em análise' },
    { id: 2, data: '21/01/2026 às 16:00', nome: 'Camila Mendes', sala: 'Sala 012', status: 'Em análise' },
    { id: 3, data: '20/01/2026 às 16:00', nome: 'Camila Mendes', sala: 'Sala 012', status: 'Agendado' },
    { id: 4, data: '19/01/2026 às 16:00', nome: 'Camila Mendes', sala: 'Sala 012', status: 'Agendado' },
    { id: 5, data: '18/01/2026 às 16:00', nome: 'Camila Mendes', sala: 'Sala 012', status: 'Cancelado' },
    { id: 6, data: '17/01/2026 às 10:00', nome: 'Camila Mendes', sala: 'Sala 012', status: 'Agendado' },
  ]);

  // Lógica de Paginação
  const totalPages = Math.ceil(agendamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = agendamentos.slice(startIndex, startIndex + itemsPerPage);

  const handleAddAgendamento = (data: string, sala: string) => {
    const novoItem = {
      id: Date.now(),
      data: `${data.split('-').reverse().join('/')} às 09:00`,
      nome: 'Camila Mendes',
      sala: `Sala ${sala}`,
      status: 'Em análise'
    };
    setAgendamentos([novoItem, ...agendamentos]);
    setCurrentPage(1); // Volta para a primeira página para ver o novo item
    setIsModalOpen(false);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Agendado': return 'status-agendado';
      case 'Cancelado': return 'status-cancelado';
      default: return 'status-analise';
    }
  };

  return (
    <div className="adminContainer">
 

      <main className="mainContent">
        <header className="contentHeader">
          <h1>Agendamento</h1>
          <p>Acompanhe todos os seus agendamentos de forma simples</p>
        </header>

        <div className="tableCard">
          <div className="tableFilters">
            <div className="searchWrapper">
              <Search size={18} className="searchIcon" />
              <input type="text" placeholder="Filtre por nome..." />
            </div>
            <button className="btnNovoAgendamento" onClick={() => setIsModalOpen(true)}>
              Novo Agendamento
            </button>
          </div>

          <table className="agendamentosTable">
            <thead>
              <tr>
                <th>Data agendamento</th>
                <th>Nome</th>
                <th>Sala</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className={item.status === 'Cancelado' ? 'row-cancelada' : ''}>
                  <td>{item.data}</td>
                  <td>
                    <div className="cellUser">
                      <strong>{item.nome}</strong>
                      <span>Cliente</span>
                    </div>
                  </td>
                  <td><span className="badgeSala">{item.sala}</span></td>
                  <td>
                    <span className={`statusBadge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td><button className="btnActionDelete"><X size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Integração do seu componente Pagination */}
          <div className="paginationWrapper">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </main>

      <ModalNovoAgendamento
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}