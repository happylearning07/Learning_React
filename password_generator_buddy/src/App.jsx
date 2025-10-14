import { useState, useCallback, useEffect,useRef } from 'react'

function App() {
  const [length,setLength] = useState(8)
  const [numberAllowed,setNumberAllowed] = useState(false)
  const [charAllowed,setCharAllowed] = useState(false)
  const[password,setPassword] = useState("")

  //useRef hook
  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(()=>{
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if(numberAllowed) str+="0123456789"
    if(charAllowed) str+="!@#$%^&*(){}[]~`"

    for(let i=1;i<=length;i++){
      let char = Math.floor(Math.random()*str.length+1)
      pass += str.charAt(char)
    }

    setPassword(pass)

  },[length,numberAllowed,charAllowed,setPassword]) //setPassword used here for optimisation

  const copyPasswordToClipboard = useCallback(()=>{
    passwordRef.current?.select()  //to give that user experience better
    // passwordRef.current?.setSelectionRange(0,3)
    window.navigator.clipboard.writeText(password) //this window is not present in next js
  },[password])
  
  useEffect(()=>{
    passwordGenerator()
  },[length,numberAllowed,charAllowed,passwordGenerator])
  return (
      <div className="flex justify-center items-center bg-gray-900">
        <div className="w-full max-w-md mx-auto shadow-md rounded-lg my-8 px-4 py-3 bg-gray-800 text-white">
          <h1 className="text-white text-center my-3">Password generator</h1>
          <div className="flex shadow rounded-lg overflow-hidden mb-4">
            <input
              type="text"
              value={password}
              className="outline-none w-full py-1 px-3 bg-white text-gray-700"
              placeholder="Password"
              readOnly 
              ref={passwordRef}
            />

            <button 
            onClick = {copyPasswordToClipboard}
            className='outline-none bg-blue-700 cursor-pointer text-white px-3 py-0.5 shrink-0'>copy</button>
          </div>
          <div className='flex text-sm gap-x-2'>
            <div className='flex items-center gap-x-1'>
              <input type="range" min={6} max={100} value={length} className='cursor-pointer'
              onChange = {(e)=>{setLength(e.target.value)}}
              />
              <label className='text-amber-400'>Length:{length}</label>
            </div>
            <div className="flex items-center gap-x-1">
              <input
                type="checkbox"
                defaultChecked={numberAllowed}
                id="numberInput"
                onChange={()=>{
                  setNumberAllowed((prev)=>!prev);
                }}
              />
              <label htmlFor="numberInput">Numbers</label>
              <input
                type="checkbox"
                defaultChecked={charAllowed}
                id="characterInput"
                onChange={()=>{
                  setCharAllowed((prev)=>!prev);
                }}
              />
              <label htmlFor="characterInput">Characters</label>
            </div>
          </div>
        </div>
      </div>
  )
}

export default App
