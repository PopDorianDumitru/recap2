///import Course from './components/Course'
import Note from './components/Notes'
import './index.css'
import { useState, useEffect, useRef } from 'react';
import noteService from './services/notes';
import loginService from './services/login';
import LogInForm from './components/LogInForm';
import Togglable from './components/Togglable';
import NoteForm from './components/NoteForm';

const Notification = ({message}) =>{
  if(message === null){
    return null;
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = ()=>{
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

const App = ()=>{
  const noteFormRef = useRef();
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const toggleImportanceOf = (id)=>{
    const note = notes.find(n => n.id === id);
    const changedNote = {...note, important: !note.important};
    noteService.update(id, changedNote)
    .then(updatedNote =>{
      setNotes(notes.map(note=> note.id !== id? note: updatedNote));
    })
    .catch(error =>{
      setErrorMessage(`Note ${note.content} was already deleted from server`);
      setNotes(notes.filter(n=> n.id !== id));
      setTimeout(()=>{
        setErrorMessage(null);
      },5000);
    })
  }
 
  const hook = () =>{
    console.log('effect');
   noteService.getAll()
   .then(initialNotes =>{
      setNotes(initialNotes);
    })
  }

  const hook2 = ()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if(loggedUserJSON)
    {
      const user2 = JSON.parse(loggedUserJSON);
      setUser(user2);
      console.log(user2, loggedUserJSON);
      noteService.setToken(user2.token);
    }
  }
  useEffect(hook, []);
  useEffect(hook2, []);

  
  

  const notesToShow = showAll? notes: notes.filter(note=> note.important === true);

  const handleLogin = async(event)=>{
    event.preventDefault();
    console.log('Loggin in with', username, password)
    try{
      const user = await loginService.login({username, password});
      setUser(user);
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      console.log(user.username);
      noteService.setToken(user.token);
      setUsername('');
      setPassword('');
    }
    catch{
      setErrorMessage('Wrong credentials');
      setTimeout(()=>{setErrorMessage(null)}, 5000);
    }
  }

  const loginForm = () => {
    return(
      <Togglable buttonLabel="login">
        <LogInForm username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}/>
      </Togglable>
    )
  }
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  const noteForm = ()=>{
    return(
      <Togglable buttonLabel="Add a new note" ref={noteFormRef}>
        <NoteForm createNote={addNote}/>
      </Togglable>
  )}
  const handleLogOut = ()=>{
    noteService.setToken(null);
    setUser(null);
    setPassword('');
    setUsername('');
    window.localStorage.removeItem('loggedNoteappUser');
  }
  return(
    <div>
      <h1>Notes</h1>
      {user === null ? loginForm() : 
        <div>
          <p>{user.username} logged <button onClick={handleLogOut}>logout</button></p>
          {noteForm()}
        </div>
      }
      <Notification message={errorMessage} />
      <ul>
        {notesToShow.map(note =>{
            return <Note  key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>
        })}
      </ul>
      
      <button type="button" onClick={()=> setShowAll(!showAll)}>show {showAll?"important": "all"}</button>
      <Footer />
    </div>
  )
}

export default App;
