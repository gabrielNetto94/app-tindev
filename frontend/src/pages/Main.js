import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';

export default function Main({ match }){

    const [users, setUsers] = useState([]);

    useEffect(() => {//método para buscar os devs da api
        async function loadUsers(){
            const response = await api.get('/devs',{
                headers: {user: match.params.id,
                }
            })
            
            setUsers(response.data);//chama o método para reendenizar na tela os usuários
        }
        loadUsers();

    }, [match.params.id]);

    async function handleLike(id){
        // 1º param caminho da api, 2º corpo do request, 3º header
        await api.post(`http://localhost:3333/devs/${id}/likes`, null,{
            headers:{user: match.params.id},
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id){
        // 1º param caminho da api, 2º corpo do request, 3º header
        await api.post(`http://localhost:3333/devs/${id}/dislikes`, null,{
            headers:{user: match.params.id},
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return(
        <div className="main-container">

            {/* importa o Link do react-router-dom para redirecionar para outra rota */}
            <Link to="/">
                <img src={ logo } alt="Tindev" />
            </Link>
            
            { users.length > 0 ? (
                <ul>  
                    {users.map(user => ( //users.map percorre o array de usuarios e cria um li para cada um inserindo as informações
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>

                            <div className="buttons">
                                {/* /*usa a arrow function () => para o método não ser executado instantaneamente, apenas quando for clicado*/}
                                <button type="button" onClick={() => handleDislike(user._id) }>
                                <img src={dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty">Acabou :(</div>
            ) }
                
        </div>
    )
}