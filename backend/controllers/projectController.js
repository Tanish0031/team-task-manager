const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user.id, members: [req.user.id] });
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getProjects = async (req, res) => {
  try {
    // Admin sees ALL projects, members only see their own
    const filter = req.user.role === 'admin' ? {} : { members: req.user.id };
    const projects = await Project.find(filter)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email').populate('members', 'name email');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Not found' });
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Not authorized' });
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Not found' });
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Not authorized' });
    await project.deleteOne();
    res.json({ msg: 'Project deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project.members.includes(req.body.userId)) {
      project.members.push(req.body.userId);
      await project.save();
    }
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};