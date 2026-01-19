import { useState, useEffect } from 'react';
import { Calendar, Users, List, ChevronDown, UserCircle, LogOut, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { getUser } from '../../service/user/data';

interface SidebarProps {
  role: 'admin' | 'client';
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState('')

  const menuItems = role === 'admin'
    ? [
      { name: 'Agendamentos', icon: Calendar, path: '/admin/schedule' },
      { name: 'Clientes', icon: Users, path: '/admin/client' },
      { name: 'Logs', icon: List, path: '/admin/logs' },
    ]
    : [
      { name: 'Agendamentos', icon: Calendar, path: '/my-schedule' },
      { name: 'Logs', icon: List, path: '/logs' },
      { name: 'Minha Conta', icon: UserCircle, path: '/account' },
    ];

  useEffect(() => {
    const user = getUser();
    if (user) setName(`${user.firstName} ${user.lastName}`)

  }, [])

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="topSection">
        <div className="logoArea" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="logoIconSquare">
            <div className="logoLine" />
            <div className="logoLine" />
            <div className="logoLine" />
          </div>
        </div>

        <nav className="sidebarNav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navItem ${isActive ? 'active' : ''}`}
              >
                {/* O ícone sempre aparece */}
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="linkText">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="userFooterContainer">
        {isMenuOpen && !isCollapsed && (
          <div className="userDropdownMenu">
            <button onClick={() => {
              if (role === 'admin') {
                navigate('/admin/account')
              } else {
                navigate('/account')
              }
            }} className="dropdownItem">
              <Settings size={16} /> <span>Editar Perfil</span>
            </button>
            <button onClick={() => {
              if (role === 'admin') {
                navigate('/admin/login')
              } else {
                navigate('/login')
              }
            }} className="dropdownItem logout">
              <LogOut size={16} /> <span>Sair</span>
            </button>
          </div>
        )}

        <button
          className="userFooter"
          onClick={() => isCollapsed ? setIsCollapsed(false) : setIsMenuOpen(!isMenuOpen)}
        >
          <div className="userInfo">
            <span className="userName">{name}</span>
            <span className="userRole">{role === 'admin' ? 'Admin' : 'Cliente'}</span>
          </div>
          <ChevronDown size={16} className={`chevronIcon ${isMenuOpen ? 'rotate180' : ''}`} />
        </button>
      </div>
    </aside>
  );
}