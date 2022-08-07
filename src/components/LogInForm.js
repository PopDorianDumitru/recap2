
const LogInForm = ({username, password, handleSubmit, handleUsernameChange, handlePasswordChange})=>{
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    Username: <input type='text' value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    Password: <input type='password' value={password} onChange={handlePasswordChange} />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}
export default LogInForm