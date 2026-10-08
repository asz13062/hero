import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const users = [
    { email: 'user@school.ac.kr', password: '1234', role: 'user' },
    { email: 'admin@school.ac.kr', password: '1234', role: 'admin' }
  ]

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    const loginUser = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    )

    if (!loginUser) {
      setMessage('이메일 또는 비밀번호가 일치하지 않습니다.')
      return
    }

    localStorage.setItem('isLogin', 'true')
    localStorage.setItem('role', loginUser.role)

    if (loginUser.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/user')
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">

        <div className="login-header">
          <div className="logo">P</div>
          <h1>포인트 시스템</h1>
          <p>계정에 로그인하여 포인트를 관리하세요</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className="error-message">
              {message}
            </p>
          )}

          <button type="submit" className="login-button">
            로그인
          </button>

        </form>

        <div className="test-account">
          <p className="test-title">테스트 계정</p>

          <div className="account">
            <span className="account-badge user-badge">
              USER
            </span>

            <div>
              <strong>일반 사용자</strong>
              <p>user@school.ac.kr / 1234</p>
            </div>
          </div>

          <div className="account">
            <span className="account-badge admin-badge">
              ADMIN
            </span>

            <div>
              <strong>관리자</strong>
              <p>admin@school.ac.kr / 1234</p>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}

export default Login
