import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Login.css'

function Login() {
  const navigate = useNavigate()

  // DB에서 가져온 사용자 정보라고 가정
  const dbEmail = 'hero@gmail.com'
  const dbPassword = '1234'

  // 사용자가 입력한 값을 저장
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 오류 메시지 저장
  const [message, setMessage] = useState('')

  // 로그인 버튼을 눌렀을 때 실행
  const handleLogin = () => {
    console.log('입력 이메일:', email)
    console.log('DB 이메일:', dbEmail)
    console.log('DB 비밀번호:', dbPassword)

    // 사용자가 입력한 값과 DB 값 비교
    if (email === dbEmail && password === dbPassword) {
      // 로그인 성공
      navigate('/profile')
    } else {
      // 로그인 실패
      setMessage('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-label">
          STUDENT LOGIN
        </p>

        <h1>로그인</h1>

        <p className="login-guide">
          학교 이메일과 비밀번호를 입력하세요.
        </p>

        <div className="input-group">
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 로그인 실패 메시지 */}
        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <button onClick={handleLogin}>
          로그인
        </button>

        <p className="test-account">
          개인정보 담당자
          <br />
          이메일: hero@gmail.com
          <br />
          연락처: 010-5280-3196
        </p>
      </section>
    </main>
  )
}

export default Login
