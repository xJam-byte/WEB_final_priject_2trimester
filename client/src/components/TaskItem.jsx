const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.status

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className={`task-item ${task.status ? 'completed' : ''}`}>
      <button
        className={`task-checkbox ${task.status ? 'checked' : ''}`}
        onClick={() => onToggle(task._id, task.status)}
        aria-label={task.status ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.status && '✓'}
      </button>

      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          {task.dueDate && (
            <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
              📅 {formatDate(task.dueDate)}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task._id)} title="Edit task">
          ✏️
        </button>
        <button className="delete" onClick={() => onDelete(task._id)} title="Delete task">
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TaskItem
