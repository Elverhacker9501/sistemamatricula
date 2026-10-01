'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Cloud,
  Database,
  Download,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react'

type Student = {
  id: number
  name: string
  email: string
  course: string
  status: 'Activo' | 'Pendiente' | 'Inactivo'
  joined: string
  initials: string
}

type Course = {
  id: number
  name: string
  instructor: string
  schedule: string
  students: number
  capacity: number
  color: string
}

const initialStudents: Student[] = [
  { id: 1, name: 'Sofía Ramírez', email: 'sofia.ramirez@mail.com', course: 'Diseño UX/UI', status: 'Activo', joined: '18 mar 2024', initials: 'SR' },
  { id: 2, name: 'Mateo Torres', email: 'mateo.torres@mail.com', course: 'Desarrollo Web', status: 'Activo', joined: '17 mar 2024', initials: 'MT' },
  { id: 3, name: 'Valentina Cruz', email: 'valentina.cruz@mail.com', course: 'Marketing Digital', status: 'Pendiente', joined: '16 mar 2024', initials: 'VC' },
  { id: 4, name: 'Nicolás Gómez', email: 'nicolas.gomez@mail.com', course: 'Data Analytics', status: 'Activo', joined: '14 mar 2024', initials: 'NG' },
  { id: 5, name: 'Camila Herrera', email: 'camila.herrera@mail.com', course: 'Diseño UX/UI', status: 'Inactivo', joined: '12 mar 2024', initials: 'CH' },
  { id: 6, name: 'Daniel Rojas', email: 'daniel.rojas@mail.com', course: 'Desarrollo Web', status: 'Activo', joined: '10 mar 2024', initials: 'DR' },
]

const courses: Course[] = [
  { id: 1, name: 'Diseño UX/UI', instructor: 'Laura Méndez', schedule: 'Mar y Jue · 18:00', students: 42, capacity: 50, color: 'blue' },
  { id: 2, name: 'Desarrollo Web', instructor: 'Julián Pardo', schedule: 'Lun y Mié · 19:00', students: 38, capacity: 45, color: 'orange' },
  { id: 3, name: 'Marketing Digital', instructor: 'Andrea Ruiz', schedule: 'Sábados · 09:00', students: 31, capacity: 40, color: 'green' },
]

const activity = [
  ['Nuevo registro', 'Valentina Cruz se inscribió en Marketing Digital', 'Hace 12 min', 'purple'],
  ['Curso actualizado', 'Se modificó el horario de Desarrollo Web', 'Hace 38 min', 'orange'],
  ['Pago recibido', 'Nicolás Gómez completó su matrícula', 'Hace 1 h', 'green'],
]

export default function Page() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [activeView, setActiveView] = useState('Resumen')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState({ name: '', email: '', course: 'Diseño UX/UI', status: 'Activo' as Student['status'] })

  useEffect(() => {
    const saved = window.localStorage.getItem('aula-estudiantes')
    if (saved) setStudents(JSON.parse(saved))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('aula-estudiantes', JSON.stringify(students))
  }, [students])

  const filteredStudents = useMemo(() => students.filter((student) => `${student.name} ${student.email} ${student.course}`.toLowerCase().includes(search.toLowerCase())), [students, search])

  function openCreate() {
    setEditing(null)
    setForm({ name: '', email: '', course: 'Diseño UX/UI', status: 'Activo' })
    setModalOpen(true)
  }

  function openEdit(student: Student) {
    setEditing(student)
    setForm({ name: student.name, email: student.email, course: student.course, status: student.status })
    setModalOpen(true)
  }

  function saveStudent(event: React.FormEvent) {
    event.preventDefault()
    const name = form.name.trim()
    if (!name || !form.email.trim()) return
    const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    if (editing) {
      setStudents((current) => current.map((student) => student.id === editing.id ? { ...student, ...form, name, email: form.email.trim(), initials } : student))
    } else {
      setStudents((current) => [{ id: Date.now(), ...form, name, email: form.email.trim(), joined: 'Hoy', initials }, ...current])
    }
    setModalOpen(false)
  }

  function deleteStudent(id: number) {
    setStudents((current) => current.filter((student) => student.id !== id))
  }

  const navItems = [
    { label: 'Resumen', icon: LayoutDashboard },
    { label: 'Estudiantes', icon: Users },
    { label: 'Cursos', icon: BookOpen },
    { label: 'Métricas', icon: BarChart3 },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><GraduationCap /></div><div><strong>Aula<span>+</span></strong><small>Gestión académica</small></div></div>
        <div className="workspace"><div className="workspace-icon">A</div><div><b>Academia Nova</b><small>Plan profesional</small></div><ChevronDown className="workspace-chevron" /></div>
        <nav className="nav-list" aria-label="Navegación principal">
          <p className="nav-label">GENERAL</p>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => setActiveView(label)}><Icon />{label}{label === 'Métricas' && <span className="live-dot" />}</button>)}
          <p className="nav-label second">GESTIÓN</p>
          <button className="nav-item" onClick={openCreate}><ClipboardList />Inscripciones</button>
          <button className={`nav-item ${activeView === 'Pagos' ? 'active' : ''}`} onClick={() => setActiveView('Pagos')}><Database />Pagos <span className="nav-count">4</span></button>
        </nav>
        <div className="sidebar-bottom"><button className={`nav-item ${activeView === 'Configuración' ? 'active' : ''}`} onClick={() => setActiveView('Configuración')}><Settings />Configuración</button><button className={`nav-item ${activeView === 'Centro de ayuda' ? 'active' : ''}`} onClick={() => setActiveView('Centro de ayuda')}><CircleHelp />Centro de ayuda</button><div className="profile"><div className="avatar avatar-indigo">LM</div><div><b>Lucía Martínez</b><small>Administradora</small></div><MoreHorizontal /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumbs"><span>Academia Nova</span><b>/</b><strong>{activeView}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notificaciones"><Bell /><i /></button><div className="top-avatar">LM</div></div></header>
        <div className="page-container">
          <div className="page-heading"><div><p className="eyebrow">{activeView === 'Métricas' ? 'OBSERVABILIDAD' : 'PANEL DE CONTROL'}</p><h1>{activeView === 'Resumen' ? 'Buenos días, Lucía' : activeView}</h1><p className="heading-sub">{activeView === 'Métricas' ? 'Monitorea el rendimiento de tu plataforma en tiempo real.' : 'Gestiona tu academia desde un solo lugar.'}</p></div><div className="heading-actions"><button className="button secondary"><Download />Exportar</button><button className="button primary" onClick={openCreate}><Plus />Nueva inscripción</button></div></div>

          {activeView === 'Estudiantes' ? <StudentsView students={filteredStudents} search={search} setSearch={setSearch} onEdit={openEdit} onDelete={deleteStudent} onCreate={openCreate} /> : activeView === 'Cursos' ? <CoursesView /> : activeView === 'Métricas' ? <MetricsView /> : activeView === 'Pagos' ? <PaymentsView /> : activeView === 'Configuración' ? <SettingsView /> : activeView === 'Centro de ayuda' ? <HelpView /> : <Dashboard students={students} onCreate={openCreate} />}
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}><form className="modal" onSubmit={saveStudent} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">{editing ? 'EDITAR REGISTRO' : 'NUEVA INSCRIPCIÓN'}</p><h2>{editing ? 'Actualizar estudiante' : 'Registrar estudiante'}</h2></div><button type="button" className="close-button" onClick={() => setModalOpen(false)}><X /></button></div><div className="form-grid"><label>Nombre completo<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Ana López" required /></label><label>Correo electrónico<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="ana@email.com" required /></label><label>Curso<select value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })}>{courses.map((course) => <option key={course.id}>{course.name}</option>)}</select></label><label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Student['status'] })}><option>Activo</option><option>Pendiente</option><option>Inactivo</option></select></label></div><div className="modal-footer"><button type="button" className="button secondary" onClick={() => setModalOpen(false)}>Cancelar</button><button className="button primary" type="submit"><Check />{editing ? 'Guardar cambios' : 'Registrar estudiante'}</button></div></form></div>}
    </div>
  )
}

function Dashboard({ students, onCreate }: { students: Student[]; onCreate: () => void }) {
  return <>
    <section className="metric-grid"><MetricCard icon={<Users />} label="Estudiantes totales" value={students.length + 1 + 234} trend="12.5%" caption="vs. mes anterior" tone="blue" /><MetricCard icon={<BookOpen />} label="Cursos activos" value="08" trend="2" caption="nuevos este mes" tone="orange" /><MetricCard icon={<Activity />} label="Tasa de asistencia" value="94.8%" trend="4.2%" caption="vs. mes anterior" tone="green" /><MetricCard icon={<Gauge />} label="Ingresos del mes" value="$24.8k" trend="8.1%" caption="vs. mes anterior" tone="purple" /></section>
    <section className="dashboard-grid"><div className="panel enrollment-panel"><div className="panel-header"><div><h2>Inscripciones</h2><p>Comportamiento de registros en los últimos 30 días</p></div><button className="select-button">Últimos 30 días <ChevronDown /></button></div><div className="chart-area"><div className="y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div><div className="chart"><div className="grid-line one" /><div className="grid-line two" /><div className="grid-line three" /><div className="chart-bars">{[32, 43, 35, 52, 48, 62, 45, 53, 58, 39, 51, 66, 55, 72, 61, 68, 78, 63, 76, 69, 84, 72, 80, 92, 76, 88, 82, 95, 87, 100].map((height, index) => <div className={`bar ${index > 21 ? 'highlight' : ''}`} style={{ height: `${height}%` }} key={index} />)}</div><div className="x-labels"><span>01 mar</span><span>08 mar</span><span>15 mar</span><span>22 mar</span><span>30 mar</span></div></div></div><div className="chart-legend"><span><i className="legend-dot blue-dot" />Inscripciones</span><b>+18.4% <small>vs periodo anterior</small></b></div></div><div className="panel activity-panel"><div className="panel-header"><div><h2>Actividad reciente</h2><p>Últimos movimientos</p></div><button className="more-button"><MoreHorizontal /></button></div><div className="activity-list">{activity.map(([title, description, time, color]) => <div className="activity-item" key={description}><div className={`activity-icon ${color}`}><Check /></div><div><b>{title}</b><p>{description}</p><small>{time}</small></div></div>)}</div><button className="text-link">Ver toda la actividad <span>→</span></button></div></section>
    <section className="panel table-panel"><div className="panel-header"><div><h2>Últimos estudiantes</h2><p>Personas inscritas recientemente</p></div><button className="text-link" onClick={onCreate}>Gestionar estudiantes <span>→</span></button></div><StudentTable students={students.slice(0, 4)} compact /></section>
    <section className="panel table-panel info-panel dashboard-info"><div className="info-intro"><p className="eyebrow">INFORMACIÓN</p><h2>Pagos, soporte y configuración</h2><p>Consulta estas secciones informativas para conocer el funcionamiento de Aula+.</p></div><div className="info-list"><div className="info-row"><div><b>Pagos y matrículas</b><p>Consulta ingresos, pagos completados y pendientes. No procesa pagos reales.</p></div><strong>Información</strong></div><div className="info-row"><div><b>Centro de ayuda</b><p>Guía rápida para estudiantes, inscripciones, métricas y soporte.</p></div><strong>soporte@aula.plus</strong></div><div className="info-row"><div><b>Configuración</b><p>Revisa el espacio de trabajo, plan, rol y almacenamiento local.</p></div><strong>Academia Nova</strong></div><div className="info-row"><div><b>Métricas</b><p>Indicadores informativos de observabilidad con referencias a Prometheus y Grafana.</p></div><strong>Prometheus · Grafana</strong></div></div></section>
  </>
}

function MetricCard({ icon, label, value, trend, caption, tone }: { icon: React.ReactNode; label: string; value: string | number; trend: string; caption: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><p>{label}</p><strong>{value}</strong><div className="metric-trend"><span>↗ {trend}</span><small>{caption}</small></div></div> }

function StudentsView({ students, search, setSearch, onEdit, onDelete, onCreate }: { students: Student[]; search: string; setSearch: (value: string) => void; onEdit: (student: Student) => void; onDelete: (id: number) => void; onCreate: () => void }) { return <section className="panel table-panel full-table"><div className="table-toolbar"><div className="search-box"><Search /><input placeholder="Buscar por nombre, correo o curso" value={search} onChange={(event) => setSearch(event.target.value)} /></div><button className="button primary" onClick={onCreate}><Plus />Añadir estudiante</button></div><StudentTable students={students} onEdit={onEdit} onDelete={onDelete} /></section> }

function StudentTable({ students, compact = false, onEdit, onDelete }: { students: Student[]; compact?: boolean; onEdit?: (student: Student) => void; onDelete?: (id: number) => void }) { return <div className="table-wrap"><table><thead><tr><th>ESTUDIANTE</th><th>CURSO</th><th>ESTADO</th><th>FECHA DE REGISTRO</th>{!compact && <th className="actions-col">ACCIONES</th>}</tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><div className="student-cell"><div className={`avatar avatar-${student.id % 3}`}>{student.initials}</div><div><b>{student.name}</b><small>{student.email}</small></div></div></td><td>{student.course}</td><td><span className={`status ${student.status.toLowerCase()}`}><i />{student.status}</span></td><td>{student.joined}</td>{!compact && <td><div className="row-actions"><button aria-label={`Editar ${student.name}`} onClick={() => onEdit?.(student)}><Pencil /></button><button aria-label={`Eliminar ${student.name}`} onClick={() => onDelete?.(student.id)}><Trash2 /></button></div></td>}</tr>)}</tbody></table>{students.length === 0 && <div className="empty-state">No encontramos estudiantes con esa búsqueda.</div>}</div> }

function CoursesView() { return <div className="course-grid">{courses.map((course) => <article className="course-card" key={course.id}><div className={`course-cover ${course.color}`}><BookOpen /><span>CURSO ACTIVO</span></div><div className="course-body"><div className="course-title"><h2>{course.name}</h2><button><MoreHorizontal /></button></div><p><UserRound /> {course.instructor}</p><p><Activity /> {course.schedule}</p><div className="capacity"><div><span>Inscritos</span><b>{course.students} / {course.capacity}</b></div><div className="progress"><i style={{ width: `${course.students / course.capacity * 100}%` }} /></div></div><button className="course-link">Gestionar curso →</button></div></article>)}</div> }

function InfoPanel({ eyebrow, title, description, items }: { eyebrow: string; title: string; description: string; items: { label: string; value: string; detail: string }[] }) { return <section className="panel table-panel info-panel"><div className="info-intro"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div><div className="info-list">{items.map((item) => <div className="info-row" key={item.label}><div><b>{item.label}</b><p>{item.detail}</p></div><strong>{item.value}</strong></div>)}</div></section> }

function PaymentsView() { return <InfoPanel eyebrow="GESTIÓN FINANCIERA" title="Pagos y matrículas" description="Consulta el estado general de los cobros de la academia. Esta sección es informativa y no procesa pagos reales." items={[{ label: 'Ingresos del mes', value: '$24.8k', detail: 'Total registrado en matrículas' }, { label: 'Pagos completados', value: '186', detail: 'Transacciones confirmadas' }, { label: 'Pendientes de pago', value: '4', detail: 'Requieren seguimiento administrativo' }, { label: 'Métodos disponibles', value: 'Tarjeta · Transferencia', detail: 'Canales configurados para referencia' }]} /> }

function SettingsView() { return <InfoPanel eyebrow="PREFERENCIAS" title="Configuración de la academia" description="Revisa la configuración actual del sistema y los permisos de tu espacio de trabajo." items={[{ label: 'Espacio de trabajo', value: 'Academia Nova', detail: 'Nombre visible para el equipo' }, { label: 'Plan actual', value: 'Profesional', detail: 'Funciones de gestión y métricas habilitadas' }, { label: 'Datos', value: 'Guardado local', detail: 'Los cambios de demostración se conservan en este navegador' }, { label: 'Rol', value: 'Administradora', detail: 'Acceso completo a estudiantes, cursos y reportes' }]} /> }

function HelpView() { return <InfoPanel eyebrow="SOPORTE" title="Centro de ayuda" description="Encuentra información rápida para utilizar Aula+ y administrar tus registros." items={[{ label: 'Gestionar estudiantes', value: 'CRUD', detail: 'Crea, edita, busca y elimina registros desde Estudiantes' }, { label: 'Inscripciones', value: 'Guía rápida', detail: 'Usa Nueva inscripción para asignar una persona a un curso' }, { label: 'Métricas', value: 'Prometheus · Grafana', detail: 'Panel informativo con indicadores de observabilidad simulados' }, { label: 'Soporte', value: 'soporte@aula.plus', detail: 'Canal de contacto para consultas administrativas' }]} /> }

function MetricsView() { return <><div className="observability-banner"><div className="observability-icon"><Activity /></div><div><b>Observabilidad en tiempo real</b><p>Datos simulados con métricas compatibles con Prometheus y paneles estilo Grafana.</p></div><span className="connected"><i /> Conectado</span></div><section className="metric-grid"><MetricCard icon={<Cloud />} label="Disponibilidad" value="99.98%" trend="0.02%" caption="últimas 24 horas" tone="green" /><MetricCard icon={<Activity />} label="Solicitudes / min" value="1,248" trend="14.2%" caption="vs. promedio" tone="blue" /><MetricCard icon={<Gauge />} label="Latencia p95" value="182 ms" trend="12 ms" caption="mejor que ayer" tone="orange" /><MetricCard icon={<ShieldCheck />} label="Errores 5xx" value="0.04%" trend="0.01%" caption="tasa saludable" tone="purple" /></section><section className="dashboard-grid metrics-lower"><div className="panel enrollment-panel"><div className="panel-header"><div><h2>Tráfico de la plataforma</h2><p>request_count_total · última hora</p></div><span className="live-pill"><i /> LIVE</span></div><div className="line-chart"><div className="line-grid" /><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="Gráfico de tráfico"><polyline points="0,145 45,132 90,144 135,98 180,115 225,73 270,92 315,46 360,68 405,38 450,57 495,24 540,43 600,12" fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><polyline points="0,160 45,157 90,150 135,154 180,140 225,145 270,135 315,137 360,126 405,131 450,120 495,125 540,105 600,113" fill="none" stroke="var(--orange)" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" /></svg><div className="chart-axis"><span>10:00</span><span>10:15</span><span>10:30</span><span>10:45</span><span>11:00</span></div></div><div className="chart-legend"><span><i className="legend-dot blue-dot" />Solicitudes</span><span><i className="legend-dot orange-dot" />Errores</span></div></div><div className="panel activity-panel"><div className="panel-header"><div><h2>Estado de servicios</h2><p>Monitores activos</p></div></div><div className="service-list">{[['API principal','api.aula.plus','99.99%'],['Base de datos','postgres-primary','100%'],['Autenticación','auth-service','99.98%'],['Notificaciones','email-worker','99.95%']].map(([name, endpoint, uptime]) => <div className="service-item" key={name}><div className="service-status"><i /><div><b>{name}</b><small>{endpoint}</small></div></div><span>{uptime}</span></div>)}</div></div></section><section className="panel prometheus-panel"><div className="prometheus-brand"><div className="prometheus-mark"><Activity /></div><div><b>Prometheus</b><small>Fuente de métricas</small></div></div><div className="prometheus-query"><span>PromQL</span><code>rate(http_requests_total{'{'}job="aula-api"{'}'}[5m])</code></div><div className="grafana-tag"><BarChart3 /> Panel Grafana <span>↗</span></div></section></> }
