import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get('/tasks').then(res => setTasks(res.data));
    API.get('/projects').then(res => setProjects(res.data));
  }, []);

  const myTasks = tasks.filter(t => t.assignedTo?._id === user?.id);
  const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');
  const done = myTasks.filter(t => t.status === 'done');
  const inProgress = myTasks.filter(t => t.status === 'in-progress');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard 📊</h1>
      <p className="text-gray-400 mb-8">Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Projects', value: projects.length, color: 'bg-blue-600' },
          { label: 'My Tasks', value: myTasks.length, color: 'bg-purple-600' },
          { label: 'In Progress', value: inProgress.length, color: 'bg-yellow-600' },
          { label: 'Overdue', value: overdue.length, color: 'bg-red-600' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm mt-1 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
          {myTasks.length === 0 && <p className="text-gray-500">No tasks assigned yet.</p>}
          {myTasks.map(task => (
            <div key={task._id} className="flex justify-between items-center py-3 border-b border-gray-800">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-400">{task.project?.name}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'done' ? 'bg-green-700' : task.status === 'in-progress' ? 'bg-yellow-700' : 'bg-gray-700'}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-5">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {projects.length === 0 && <p className="text-gray-500">No projects yet. <Link to="/projects" className="text-blue-400">Create one!</Link></p>}
          {projects.map(project => (
            <Link to={`/projects/${project._id}`} key={project._id} className="flex justify-between items-center py-3 border-b border-gray-800 hover:text-blue-400">
              <p className="font-medium">{project.name}</p>
              <span className="text-xs text-gray-400">{project.members?.length} members</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}