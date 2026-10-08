import { useNavigate } from 'react-router-dom'

import { useState } from 'react'
import './App.css'
import { QRCodeSVG } from 'qrcode.react'

function App() {
  const name = '영웅'
  const department = '멀티미디어학과 · 학생'
  const goal = '만들기 편하고 점수 받기 좋은 웹 화면 만들기'
  const studentID = '20221042'

  const [profileImage, setProfileImage] = useState('/프로필.png')
  const [isHappy, setIsHappy] = useState(true)
  const [happiness, setHappiness] = useState(-100)
  const qrData = "찍지 마세요"

  const navigate = useNavigate()

  console.log(qrData)

  function click() {
    if (isHappy) {
      setIsHappy(false)
      setProfileImage('/프로필2.png')
      setHappiness(100)
    } else {
      setIsHappy(true)
      setProfileImage('/프로필.png')
      setHappiness(-100)
    }
  }

  return (
    <main className="page">
      <section className="profile-card">
        <span className="status">행복: {happiness}</span>

        <div className="avatar">
          <img src={profileImage} />
        </div>

        <p className="eyebrow">HERO REACT</p>
        <h1>{name}</h1>
        <p className="department">{department}</p>

        <div className="divider"></div>

        <p className="goal">목표: {goal}</p>

        <div className="tags">
          <span>HTML</span>
          <span>CSS</span>
          <span>JavaScript</span>
        </div>

        <div className="qr-area">
          <QRCodeSVG
            value={qrData}
            size={100}
            />
            <p>학생 QR</p>
        </div>

        <button className="task-button" onClick={click}>
          {isHappy ? '과제 제출하기' : '과제 시작하기'}
        </button>
        <button className="grade-button" onClick={() =>  navigate('/grade')}>
          성적 훔쳐보기
        </button>
      </section>
    </main>
  )
}

export default App