import imgTutorial from '../assets/sprites/tutorial.png'

export function TutorialModal({closeModal}:any){
    return(        <div onClick={()=>{closeModal()}} className="flex bg-[#00000099] items-center justify-center w-screen h-screen fixed m-0 ">
        <div className={`flex flex-col content-center items-center transform transition-all w-fit h-3/5 overflow-y-scroll`}>
        <img className='w-[90%]' src={imgTutorial} alt="" />
        </div>
    </div>)
}