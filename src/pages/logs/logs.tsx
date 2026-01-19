import { useEffect, useState } from 'react';
import './log.css';
import { Pagination } from '../../components/page/pagination';
import { logService } from '../../service/request/logService';
import notLogo from '../../../public/msgNot.svg';
import { ActivityLabel, PageLabel, type Log } from '../../type/log';
import searchIcon from '../../../public/search-2-line.svg'

export function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const fetchLogs = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const response = await logService.list({
        page: pageNumber,
        search,
        date,
      });

      const { data, pagination } = response.data;
      setLogs(data);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLogs(page);
  }, [page, search]);

  return (
    <div className="logsContainer">
      <header className="logsHeader">
        <h1 className="logsTitle">Logs</h1>
        <p className="logsSubtitle">Acompanhe todos os Logs de clientes</p>
      </header>

      <div className="tableCard">
        <div className="logsFilters">
          <div className="searchBox">
            <img src={searchIcon} alt="Buscar" className="searchIcon" />
            <input
              type="text"
              placeholder="Filtre por cliente, tipo de atividade ou módulo..."
              className="searchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="dateFilter">
            <input
              type="date"
              className="dateInput"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="logsTable">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Tipo de atividade</th>
                <th>Módulo</th>
                <th>Data e Horário ↓</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>Carregando...</td>
                </tr>
              ) : logs.length === 0 ? (
                <td colSpan={5} className="area-image">
                  <div className="image-wrapper">
                    <img
                      src={notLogo}
                      alt="Notification"
                      className="not-logo"
                    />
                  </div>
                </td>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className='border-break item-of-log'>

                    <td>
                      {log.logUser.firstName} {log.logUser.lastName} <br />
                      <span className="clientTag">{log.logUser.admin ? "Admin" : "Cliente"}</span>
                    </td>
                    <td>
                      <span className="activityBadge">

                        {ActivityLabel[log.typeActivity]}

                      </span>
                    </td>
                    <td>
                      <div className="moduleInfo">
                        <div className='data-info'>
                          {/* <History size={14} /> */}
                          {PageLabel[log.page]}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="dateTimeBadge">{new Date(log.createdAt).toLocaleString()}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
