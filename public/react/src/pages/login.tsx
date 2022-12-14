import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import logo from '../assets/sprites/logo.png'
import logoname from '../assets/sprites/perguntenovamenteescritobranco.png'
import loginbg from '../assets/sprites/loginbg.png'
import { APIResponse } from '../models';
import { ModalError } from '../components/erro-modal';
import configs from '../utils/config';

export function Login(){
    
    const navigate = useNavigate();

    const [slideState, setSlideState] = useState('translate-x-full');
    const [modalState,setModalState]=useState('hidden')
    const [modalMessage,setModalMessage] = useState(' ')

    function closeModal(){
        setSlideState('translate-x-full');
        setTimeout(()=>{
            setModalState('hidden')
        }, 500);
    }

    async function loginPlayer(){
        
        const body = {
            "name":(document.getElementById('login-user-input')as HTMLInputElement).value,
            "password":(document.getElementById('login-user-password')as HTMLInputElement).value
        }

        //alterei o protocolo https=>http.
        const resposta : APIResponse = await fetch(`https://${configs.server}/users/login`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: 
            {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(resp => resp.json()).catch(err => {console.log(err); return {error:err}});
        //console.log(resposta)
        if(!resposta || resposta.error){
            setTimeout(()=>{
                setSlideState('translate-x-0');
            }, 500);
            setModalState('flex')
            setModalMessage(resposta.error)
            return
        }
        navigate('/', { replace: true })
    }
    return (
    <div className={`h-screen w-screen flex justify-center content-center items-center bg-loginbg bg-cover bg-repeat animation-background`}>
        <div className='h-fit w-96 bg-[#D9D9D9]'>
            <header className='flex items-center h-1/3 bg-[#1C1C1C]'>
                <picture className='h-full p-4 w-2/5 flex items-center max-h-full'>< img className='max-h-full ' src={logo} alt="" /></picture>
                <picture className='p-5'><img src={logoname} alt="" /></picture>
            </header>
            <form className='flex flex-col justify-center items-center text-[#1C1C1C] gap-8 py-12'>
                <div className='flex flex-col w-10/12 '>
                    <label className='text-lg' htmlFor="login-user-input">Usu??rio:</label>
                    <input className='leading-10 w-full border-2 bg-transparent border-[#1C1C1C]' type="text" placeholder="Usuario" id="login-user-input" />
                </div>
                <div className='flex flex-col w-10/12 '>
                    <label className='text-lg' htmlFor="login-user-password">Senha:</label>
                    <input className='leading-10 w-full bg-transparent border-2 border-[#1C1C1C]' type="password" placeholder="Senha" id="login-user-password" />
                </div>
                <p className='text-sm cursor-pointer hover:decoration-solid hover:underline'><Link to={'/register'}>N??o possui uma conta? Registre-se</Link></p>
                <button onClick={loginPlayer} className='bg-[#1C1C1C] border-2 border-black leading-[35px] text-[25px] text-white cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white transition-all' type="button">Entrar</button>
            </form>
        </div>
        <ModalError message={modalMessage} state={modalState} slideState={slideState} closeModal={closeModal}/>
    
    </div>)
}