import './Todo-Task.scss'
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

export default function TodoTask({ task, handleDelete, handleStatus, handleUpdate }) {
    return(
        <div className='todo-task'>
            <div className='task-box'>
                <div className='task-check'>
                    <Checkbox
                        checked={task.is_completed}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        onClick={()=>handleStatus(task.id, task.is_completed)}
                    />
                </div>
                <div className='task-title' style={{
                    textDecoration: task.is_completed ? 'line-through' : ''
                }}>
                    {task.task}
                </div>
            </div>
            <div className='task-actions'>
                <IconButton onClick={()=>handleUpdate(task.id, task.task)}>
                    <EditIcon />
                </IconButton>

                <IconButton onClick={()=>handleDelete(task.id)}>
                    <DeleteIcon style={{color: 'red'}} />
                </IconButton>
            </div>
        </div>
    )
}
