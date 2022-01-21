import './Home.scss';
import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { Box, Button, IconButton, TextField, Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_ALL_TODO, ADD_TODO, FETCH_TODO_BY_EMAIL, DELTE_TODO_BY_ID, UPDATE_TODO_STATUS, FIND_TASK_BY_ID, UPDATE_TASK_TITLE } from '../../Graphql/queries';
import { authActions } from '../../redux/store';
import LinearProgress from '@material-ui/core/LinearProgress';
import TodoTask from '../Todo-Task/TodoTask';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Navbar/Navbar';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      width: '30%',
      height: '30%',
    },
    container: {
      paddingLeft: '30px',
      paddingRight: '30px',
      height: '88%',
    },
    close: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    textArea: {
        width: '100%',
    },
    submitBtn: {
        width: '100%',
        marginTop: '20px'
    }
}));

export default function Home() {
    const classes = useStyles();
    const client = useApolloClient();
    const dispatch = useDispatch();
    const { user_cred } = useSelector(state => state.auth);

    const [text, setText] = useState('');
    const [queryLoading, setQueryLoading] = useState(false);
    const [insertLoading, setInsertLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
    const [updateTitleLoading, setUpdateTitleLoading] = useState(false);
    const [findTaskLoading, setFindTaskLoading] = useState(false);
    const [taskById, setTaskById] = useState('');
    const [todoTasks, setTodoTasks] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            setQueryLoading(true);
            client
                .query({
                    query: FETCH_TODO_BY_EMAIL,
                    variables: {
                        email: user_cred.email
                    },
                    fetchPolicy: 'network-only',
                })
                .then(({ data: query_data }) => {
                    setTodoTasks(query_data.todos);
                })
                .catch(e => {
                    alert(e.message)
                })
                .finally(() => {
                    setQueryLoading(false);
                })
        }
        fetchData();
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        setInsertLoading(true);
        client
            .mutate({
                mutation: ADD_TODO,
                variables: {
                    task: text,
                    user_email: user_cred.email
                },
                fetchPolicy: 'network-only',
            })
            .then(({ data: new_task }) => {
                setTodoTasks(prev => [new_task.insert_todos.returning[0], ...prev]);
            })
            .catch(e => {
                alert(e.message)
            })
            .finally(() => {
                setInsertLoading(false);
                setText('')
            })
    }

    const handleDelete = (task_id) => {
        setDeleteLoading(true);
        client
            .mutate({
                mutation: DELTE_TODO_BY_ID,
                variables: {
                    id: task_id,
                },
                fetchPolicy: 'network-only',
            })
            .then(({ data: deleted_task }) => {
                setTodoTasks(prev => prev.filter(obj => obj.id !== deleted_task.delete_todos.returning[0].id));
            })
            .catch(e => {
                alert(e.message)
            })
            .finally(() => {
                setDeleteLoading(false);
            })
    }

    const handleStatus = (task_id, task_status) => {
        setUpdateStatusLoading(true);
        client
            .mutate({
                mutation: UPDATE_TODO_STATUS,
                variables: {
                    id: task_id,
                    status: !task_status
                },
                fetchPolicy: 'network-only',
            })
            .then(({ data: updated_task }) => {
                let values = todoTasks;
                const filteredItems = values.map(item => {
                    if(item.id === updated_task.update_todos.returning[0].id) return { ...updated_task.update_todos.returning[0] }
                    else return item
                })
                setTodoTasks(filteredItems);
            })
            .catch(e => {
                alert(e.message)
            })
            .finally(() => {
                setUpdateStatusLoading(false);
            })
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [updateTask, setUpdateTask] = useState('');
    const handleModalClose = () => {
        setModalOpen(false);
        setUpdateTask('');
        setTaskById(null);
    };

    const handleUpdate = (task_id, task_text) => {
        setModalOpen(true);
        setFindTaskLoading(true);
        client
            .query({
                query: FIND_TASK_BY_ID,
                variables: {
                    id: task_id
                },
                fetchPolicy: 'network-only',
            })
            .then(({ data: task_data }) => {
                setUpdateTask(task_data.todos[0].task);
                setTaskById(task_data.todos[0]);
            })
            .catch(e => {
                alert(e.message)
            })
            .finally(() => {
                setFindTaskLoading(false);
            })
    }

    const saveUpdate = () => {

        setUpdateTitleLoading(true);
        client
            .mutate({
                mutation: UPDATE_TASK_TITLE,
                variables: {
                    id: taskById.id,
                    task: updateTask
                },
                fetchPolicy: 'network-only',
            })
            .then(({ data: updated_task }) => {
                let values = todoTasks;
                const filteredItems = values.map(item => {
                    if(item.id === updated_task.update_todos.returning[0].id) return { ...updated_task.update_todos.returning[0] }
                    else return item
                })
                setTodoTasks(filteredItems);
            })
            .catch(e => {
                alert(e.message)
            })
            .finally(() => {
                setUpdateTitleLoading(false);
                setModalOpen(false);
                setUpdateTask('');
            })
    }
    

    if (queryLoading) return <LinearProgress/>

    return (
        <div className='home'>
            <Navbar />
            <Divider />
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="task-textfield" placeholder="Enter Task" value={text} onChange={e => setText(e.target.value)} />
                </form>
                <center>
                    {insertLoading && <LinearProgress style={{width: '70%', marginBottom: '1.5rem'}} />}
                    {deleteLoading && <LinearProgress style={{width: '70%', marginBottom: '1.5rem'}} />}
                    {updateStatusLoading && <LinearProgress style={{width: '70%', marginBottom: '1.5rem'}} />}
                    
                    <div className='todo-tasks'>
                        {
                            todoTasks.map((task, index) => {
                                return <TodoTask task={task} key={index} handleDelete={handleDelete} handleStatus={handleStatus} handleUpdate={handleUpdate} />
                            })
                        }
                    </div>

                    <div className='completed-tasks'>
                        
                    </div>
                </center>
            </div>
            <>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={modalOpen}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 200,
                    }}
                >
                    <Fade in={modalOpen}>
                        <Box className={classes.paper}>
                        
                        <Box className={classes.close}>
                            <IconButton onClick={handleModalClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box className={classes.container}>
                            {findTaskLoading && <LinearProgress />}
                            {updateTitleLoading && <LinearProgress style={{marginBottom: '1.2rem'}} />}
                            {!findTaskLoading && <Box>
                                <textarea className={classes.textArea} value={updateTask} onChange={(e)=>setUpdateTask(e.target.value)} />

                                <Button variant='contained' onClick={saveUpdate} disableElevation className={classes.submitBtn} >Save</Button>
                            </Box>
                            }
                        </Box>

                        </Box>
                    </Fade>
                </Modal>
            </>
        </div>
    )
}
