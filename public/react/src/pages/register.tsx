import { Route, Routes, Navigate, Link } from 'react-router-dom';
import logo from '../assets/sprites/logo.png'
import logoname from '../assets/sprites/perguntenovamenteescritobranco.png'


export function Register(){
    return (<div className={`h-screen w-screen flex justify-center content-center items-center bg-loginbg bg-cover bg-no-repeat`}>
        <div className='h-5/6 w-2/5 bg-[#D9D9D9] overflow-y-scroll'>
            <header className='flex items-center h-1/3 bg-[#1C1C1C]'>
                <picture className='h-full p-4 w-2/5 flex items-center max-h-full'>< img className='max-h-full ' src={logo} alt="" /></picture>
                <picture className='p-5'><img src={logoname} alt="" /></picture>
            </header>
            <form className='flex flex-col justify-center items-center text-[#1C1C1C] gap-8 py-12 '>
                {/* <div className='flex flex-col w-full px-[15%]'>
                    <label className='text-lg' htmlFor="register-email-input">E-mail:</label>
                    <input className='leading-10 w-full border-2 bg-transparent border-[#1C1C1C]' type="text" placeholder="Email" id="register-email-input" />
                </div> */}
                <div className='flex flex-col w-full px-[15%]'>
                    <label className='text-lg' htmlFor="register-user-input">Nome de usuário:</label>
                    <input className='leading-10 w-full border-2 bg-transparent border-[#1C1C1C]' type="text" placeholder="Nome de usuário:" id="register-user-input" />
                </div>
                <div className='flex flex-col w-full px-[15%]'>
                    <label className='text-lg' htmlFor="register-user-password">Senha:</label>
                    <input className='leading-10 w-full bg-transparent border-2 border-[#1C1C1C]' type="password" placeholder="Senha" id="register-user-password" />
                </div>
                <div className='flex flex-col w-full px-[15%]'>
                    <label className='text-lg' htmlFor="register-user-password-confirm">Confirme a senha:</label>
                    <input className='leading-10 w-full bg-transparent border-2 border-[#1C1C1C]' type="password" placeholder="Senha" id="register-user-password-confirm" />
                </div>
                <p className='text-sm cursor-pointer hover:decoration-solid hover:underline'><Link to={'/login'}>Já possui uma conta? Entre aqui</Link></p>
                <button className='bg-[#1C1C1C] border-2 border-black leading-[35px] text-[25px] text-white cursor-pointer hover:text-[#7A7A7A] hover:bg-white hover:border-white transition-all' type="button">Registrar</button>
            </form>
        </div>
    
    
    </div>)
}