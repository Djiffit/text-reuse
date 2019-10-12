import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const App: React.FC = () => {
  const [things, setThings] = useState([{}])

  useEffect(() => {
    test()
  }, [])

  const test = async () => {
    const res = await axios.get('http://localhost:5000/')
    setThings(res.data)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Api results:
          {things.map((t: any) => (
            <div>{t.test}</div>
          ))}
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
