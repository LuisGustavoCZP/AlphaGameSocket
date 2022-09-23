import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import GlobalContext from "../contexts/global-context";
import { useContext, useEffect, useState } from "react";
import logo from '../assets/sprites/logo.png'
import logoname from '../assets/sprites/perguntenovamenteescritobranco.png'
import { ModalError } from '../components/erro-modal';

export function Register()
{
    const {server} = useContext(GlobalContext);
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

    async function registerPlayer(){
        
        if((document.getElementById('register-user-password')as HTMLInputElement).value != (document.getElementById('register-user-password-confirm') as HTMLInputElement).value ){
            return
        }

        const body = {
            "name":(document.getElementById('register-user-input')as HTMLInputElement).value,
            "email":(document.getElementById('register-email-input')as HTMLInputElement).value,
            "password":(document.getElementById('register-user-password')as HTMLInputElement).value
        }
        const resposta = await fetch(`https://${server}/users/register`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-type": "application/json;charset=UTF-8"}
        }).then(resp => resp.json())
        .catch(err => {console.log(err); return null});

        if(!resposta || resposta.error){
            setTimeout(()=>{7
                setSlideState('translate-x-0');
            }, 500);
            setModalState('flex')
            setModalMessage(resposta.error)
            return
        }
        navigate('/login', { replace: true })
    }

    return (<div className={`h-screen w-screen flex justify-center content-center items-center bg-loginbg bg-cover bg-repeat animation-background`}>
        <div className='h-fit w-96 bg-[#D9D9D9] box-border overflow-y-auto'>
            <header className='flex items-center h-1/3 bg-[#1C1C1C] p-5'>
                <picture className='h-full p-4 w-2/5 flex items-center max-h-full'>< img className='max-h-full ' src={logo} alt="" /></picture>
                <picture className='p-5'><img src={logoname} alt="" /></picture>
            </header>
            <form className='flex flex-col justify-center items-center text-[#1C1C1C] gap-4 py-8 '>
                <div className='flex flex-col w-10/12'>
                    <label className='text-base' htmlFor="register-email-input">E-mail:</label>
                    <input className='w-full border-2 bg-transparent border-[#1C1C1C] text-base p-2' type="text" placeholder="Email" id="register-email-input" />
                </div>
                <div className='flex flex-col w-10/12'>
                    <label className='text-base' htmlFor="register-user-input">Nome de usuário:</label>
                    <input className='w-full border-2 bg-transparent border-[#1C1C1C] text-base p-2' type="text" placeholder="Nome de usuário:" id="register-user-input" />
                </div>
                <div className='flex flex-col w-10/12'>
                    <label className='text-base' htmlFor="register-user-password">Senha:</label>
                    <input className='w-full bg-transparent border-2 border-[#1C1C1C] text-base p-2' type="password" placeholder="Senha" id="register-user-password" />
                </div>
                <div className='flex flex-col w-10/12'>
                    <label className='text-base' htmlFor="register-user-password-confirm">Confirme a senha:</label>
                    <input className='w-full bg-transparent border-2 border-[#1C1C1C] text-base p-2' type="password" placeholder="Senha" id="register-user-password-confirm" />
                </div>
                <p className='text-sm cursor-pointer hover:decoration-solid hover:underline'><Link to={'/login'}>Já possui uma conta? Entre aqui</Link></p>
                <button onClick={registerPlayer} className='bg-[#1C1C1C] border-2 border-black leading-[35px] text-[25px] text-white cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white transition-all' type="button">Registrar</button>
            </form>
        </div>
        <ModalError message={modalMessage} state={modalState} slideState={slideState} closeModal={closeModal}/>
    
    </div>)
}