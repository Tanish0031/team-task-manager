import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', assignedTo: '' });
  const [showForm, setShowForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    API.get(`/projects/${id}`).then(res => setProject(res.data));
    API.get(`/tasks?project=${id}`).then(res => setTasks(res.data));
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, project: id };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;
      const res = await API.post('/tasks', payload);
      setTasks([...tasks, res.data]);
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', assignedTo: '' });
      setShowForm(false);
      toast.success('Task created!');
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const updateStatus = async (taskId, status) => {
    const res = await API.put(`/tasks/${taskId}`, { status });
    setTasks(tasks.map(t => t._id === taskId ? res.data : t));
  };

  const deleteTask = async (taskId) => {
    await API.delete(`/tasks/${taskId}`);
    setTasks(tasks.filter(t => t._id !== taskId));
    toast.success('Task deleted');
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      // Find user by email via a new endpoint
      const res = await API.get(`/auth/find?email=${memberEmail}`);
      await API.post(`/projects/${id}/members`, { userId: res.data._id });
      toast.success('Member added!');
      setMemberEmail('');
      setShowAddMember(false);
      // Refresh project
      API.get(`/projects/${id}`).then(r => setProject(r.data));
    } catch (err) { toast.error(err.response?.data?.msg || 'User not found'); }
  };

  const isAdminOrOwner = user?.role === 'admin' || project?.owner?._id === user?.id;
  const statusCols = ['todo', 'in-progress', 'done'];

  if (!project) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {isAdminOrOwner && <span className="text-xs text-yellow-400">👑 You have full control of this project</span>}
        </div>
        <div className="flex gap-2">
          {isAdminOrOwner && (
            <button onClick={() => setShowAddMember(!showAddMember)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-sm">+ Add Member</button>
          )}
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold">+ Add Task</button>
        </div>
      </div>
      <p className="text-gray-400 mb-2">{project.description}</p>

      {/* Members list */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {project.members?.map(m => (
          <span key={m._id} className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
            👤 {m.name} {m._id === project.owner?._id ? <span className="text-yellow-400">👑</span> : ''}
          </span>
        ))}
      </div>

      {/* Add Member Form - Admin/Owner only */}
      {showAddMember && (
        <form onSubmit={handleAddMember} className="bg-gray-900 p-4 rounded-2xl mb-6 flex gap-3">
          <input
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500"
            placeholder="Enter member's email"
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            required
          />
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold" type="submit">Add</button>
        </form>
      )}

      {/* Add Task Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-900 p-5 rounded-2xl mb-6 grid grid-cols-2 gap-3">
          <input className="col-span-2 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Task Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className="col-span-2 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <select className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input type="date" className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
          <select className="col-span-2 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})}>
            <option value="">Assign to...</option>
            {project.members?.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <button className="col-span-2 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold" type="submit">Create Task</button>
        </form>
      )}

      {/* Kanban Board */}
      <div className="grid md:grid-cols-3 gap-4">
        {statusCols.map(status => (
          <div key={status} className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-lg font-semibold mb-4 capitalize border-b border-gray-700 pb-2">
              {status === 'todo' ? '📝 Todo' : status === 'in-progress' ? '⚡ In Progress' : '✅ Done'}
              <span className="ml-2 text-sm text-gray-400">({tasks.filter(t => t.status === status).length})</span>
            </h2>
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task._id} className="bg-gray-800 rounded-xl p-3 mb-3">
                <p className="font-semibold mb-1">{task.title}</p>
                <p className="text-xs text-gray-400 mb-2">{task.description}</p>
                <div className="flex gap-1 flex-wrap mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-700' : task.priority === 'medium' ? 'bg-yellow-700' : 'bg-gray-600'}`}>{task.priority}</span>
                  {task.assignedTo && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-800">👤 {task.assignedTo.name}</span>}
                  {task.dueDate && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700">📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {statusCols.filter(s => s !== status).map(s => (
                    <button key={s} onClick={() => updateStatus(task._id, s)} className="text-xs bg-gray-700 hover:bg-blue-700 px-2 py-1 rounded-lg capitalize">→ {s}</button>
                  ))}
                  {isAdminOrOwner && (
                    <button onClick={() => deleteTask(task._id)} className="text-xs bg-red-800 hover:bg-red-700 px-2 py-1 rounded-lg ml-auto">🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}