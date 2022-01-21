import { useQuery, useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_ALL_TODO, ADD_TODO, FETCH_TODO_BY_EMAIL } from '../Graphql/queries';
import { authActions } from '../redux/store';

export default function TodoInput() {
    const dispatch = useDispatch();
    const { user_cred } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false);

    const [insert_todos, { loading }] = useMutation(ADD_TODO);
    const [text, setText] = useState('');

    const { loading: query_loading, error, data } = useQuery(FETCH_TODO_BY_EMAIL, {
        variables: {
            email: user_cred.email
        }
    });

    const handleSubmit = e => {
        e.preventDefault();
        try {
            insert_todos({
                variables: {
                    task: text,
                    user_email: user_cred.email
                }
            });
            setText('')
        } catch (error) {
            alert(error.message);
        }
    }

    if (query_loading) return <h1>Loading.....</h1>
    if (error) return <h1>{error}</h1>

    return (
        <div>
            <h1>Todo input</h1>
            <form onSubmit={handleSubmit}>
                <TextField variant='outlined' value={text} onChange={(e)=>setText(e.target.value)} />
                <button type='submit'>{loading? 'Loading....' : 'Submit'}</button>
            </form>
            <button onClick={()=>{
                dispatch(authActions.logout())
            }}>Logout</button>
        </div>
    )
}
