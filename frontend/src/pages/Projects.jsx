import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { API.get('/projects').then(res => setProjects(res.data)); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/projects', form);
      setProjects([...projects, res.data]);
      setForm({ name: '', description: '' });
      setShowForm(false);
      toast.success('Project created!');
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch (err) { toast.error(err.response?.data?.msg || 'Not authorized'); }
  };

  const isOwnerOrAdmin = (project) =>
    user?.role === 'admin' || project.owner?._id === user?.id;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects 📁</h1>
          {user?.role === 'admin' && (
            <span className="text-xs text-yellow-400 mt-1 block">👑 Admin — you can manage all projects</span>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold">+ New Project</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-900 p-5 rounded-2xl mb-6 space-y-3">
          <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Project Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold" type="submit">Create</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project._id} className="bg-gray-900 rounded-2xl p-5 hover:border-blue-500 border border-gray-800 transition">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl font-bold">{project.name}</h3>
              {user?.role === 'admin' && project.owner?._id !== user?.id && (
                <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded-full">👑 Admin Access</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-1">{project.description || 'No description'}</p>
            <p className="text-xs text-gray-500 mb-1">👤 Owner: {project.owner?.name}</p>
            <p className="text-xs text-gray-500 mb-4">👥 {project.members?.length} members</p>
            <div className="flex gap-2">
              <Link to={`/projects/${project._id}`} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm">Open</Link>
              {isOwnerOrAdmin(project) && (
                <button onClick={() => handleDelete(project._id)} className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-lg text-sm">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}