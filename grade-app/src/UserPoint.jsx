import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserPoint.css'

// App.jsx와 동일한 localStorage key 사용
const USERS_KEY = 'users'

// 기본 사용자 데이터
const defaultUsers = [
  { id: 1, name: '홍길동', point: 8500 },
  { id: 2, name: '김철수', point: 12000 },
  { id: 3, name: '이영희', point: 5500 }
]

// localStorage에서 사용자 정보 가져오기
const getUsers = () => {
  const savedUsers = localStorage.getItem(USERS_KEY)

  if (savedUsers) {
    return JSON.parse(savedUsers)
  }

  // 처음 실행하는 경우 기본값 저장
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(defaultUsers)
  )

  return defaultUsers
}

function UserPoint() {
  const navigate = useNavigate()

  // 로그인한 사용자 ID
  const userId =
    Number(localStorage.getItem('userId')) || 1

  // 현재 사용자
  const [currentUser, setCurrentUser] = useState(() => {
    const users = getUsers()

    return users.find(
      (user) => user.id === userId
    )
  })

  // 현재 사용자의 포인트
  const [point, setPoint] = useState(
    currentUser ? currentUser.point : 0
  )

  const [betPoint, setBetPoint] = useState(500)

  const [choice, setChoice] = useState('')
  const [number, setNumber] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState(null)

  // ==========================================
  // localStorage의 포인트 변경 감지
  // ==========================================

  useEffect(() => {
    const updateUserPoint = () => {
      const users = getUsers()

      const user = users.find(
        (user) => user.id === userId
      )

      if (user) {
        setCurrentUser(user)
        setPoint(user.point)
      }
    }

    // 처음 실행할 때도 최신 데이터 확인
    updateUserPoint()

    // 다른 탭에서 localStorage가 변경됐을 때
    window.addEventListener(
      'storage',
      updateUserPoint
    )

    return () => {
      window.removeEventListener(
        'storage',
        updateUserPoint
      )
    }
  }, [userId])

  // ==========================================
  // 포인트 저장
  // ==========================================

  const savePoint = (newPoint) => {
    const users = getUsers()

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          point: newPoint
        }
      }

      return user
    })

    // 공통 users에 저장
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(updatedUsers)
    )

    // 현재 화면도 바로 변경
    setPoint(newPoint)

    const updatedUser = updatedUsers.find(
      (user) => user.id === userId
    )

    setCurrentUser(updatedUser)

    // 같은 탭에서도 다른 컴포넌트가 변경을 감지할 수 있도록
    window.dispatchEvent(
      new Event('usersUpdated')
    )
  }

  // ==========================================
  // 다른 컴포넌트에서 users가 변경됐을 때
  // ==========================================

  useEffect(() => {
    const updateUserPoint = () => {
      const users = getUsers()

      const user = users.find(
        (user) => user.id === userId
      )

      if (user) {
        setCurrentUser(user)
        setPoint(user.point)
      }
    }

    window.addEventListener(
      'usersUpdated',
      updateUserPoint
    )

    return () => {
      window.removeEventListener(
        'usersUpdated',
        updateUserPoint
      )
    }
  }, [userId])

  // ==========================================
  // 게임 시작
  // ==========================================

  const handlePlay = () => {
    if (isPlaying) return

    const bet = Number(betPoint)

    if (!bet || bet <= 0) {
      alert('베팅할 포인트를 입력해주세요.')
      return
    }

    if (bet > point) {
      alert('보유 포인트보다 많이 베팅할 수 없습니다.')
      return
    }

    if (!choice) {
      alert('홀 또는 짝을 선택해주세요.')
      return
    }

    setIsPlaying(true)
    setResult(null)
    setNumber(null)

    // 1 ~ 12 랜덤 숫자
    const randomNumber =
      Math.floor(Math.random() * 12) + 1

    setTimeout(() => {
      const resultType =
        randomNumber % 2 === 0
          ? '짝'
          : '홀'

      const isWin =
        choice === resultType

      if (isWin) {
        /*
          정답이면 베팅금만큼 순이익

          예:
          현재 8,500P
          500P 베팅
          정답 → 9,000P
        */

        const reward = bet * 2
        const newPoint = point + bet

        savePoint(newPoint)

        setResult({
          win: true,
          number: randomNumber,
          type: resultType,
          bet: bet,
          reward: reward,
          change: bet
        })
      } else {
        // 오답이면 베팅금 차감
        const newPoint = point - bet

        savePoint(newPoint)

        setResult({
          win: false,
          number: randomNumber,
          type: resultType,
          bet: bet,
          reward: 0,
          change: -bet
        })
      }

      setNumber(randomNumber)
      setIsPlaying(false)
    }, 1200)
  }

  // ==========================================
  // 로그아웃
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem('isLogin')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')

    navigate('/')
  }

  return (
    <main className="user-point-page">

      <section className="user-point-card">

        {/* 헤더 */}
        <div className="user-point-header">

          <div className="user-logo">
            P
          </div>

          <h1>포인트 게임</h1>

          <p>
            {currentUser?.name || '사용자'}님,
            홀짝을 맞히고 포인트를 획득하세요!
          </p>

        </div>

        {/* 현재 포인트 */}
        <div className="current-point">

          <span>현재 보유 포인트</span>

          <strong>
            {point.toLocaleString()}
            <small> P</small>
          </strong>

        </div>

        {/* 게임 */}
        <div className="game-section">

          <h2>🎲 홀짝 게임</h2>

          <p className="game-description">
            1부터 12까지의 숫자가 랜덤으로 나옵니다.
            <br />
            홀짝을 맞히면 베팅 포인트의 2배를 받습니다.
          </p>

          {/* 숫자 */}
          <div className="number-display">

            {isPlaying ? (
              <div className="rolling-number">
                ?
              </div>
            ) : (
              <div className="result-number">
                {number ?? '?'}
              </div>
            )}

          </div>

          {/* 결과 */}
          {result && !isPlaying && (
            <div
              className={
                result.win
                  ? 'game-result win'
                  : 'game-result lose'
              }
            >

              <span className="result-label">
                {result.win
                  ? '🎉 정답입니다!'
                  : '😢 아쉽습니다!'}
              </span>

              <strong>
                {result.number}
              </strong>

              <span>
                {result.type}입니다
              </span>

              <p>
                {result.change >= 0 ? '+' : ''}
                {result.change.toLocaleString()} P
              </p>

            </div>
          )}

          {/* 베팅 */}
          <div className="bet-area">

            <label>
              베팅 포인트
            </label>

            <div className="bet-input-area">

              <input
                type="number"
                min="1"
                value={betPoint}
                disabled={isPlaying}
                onChange={(e) =>
                  setBetPoint(e.target.value)
                }
              />

              <span>P</span>

            </div>

          </div>

          {/* 홀짝 선택 */}
          <div className="choice-area">

            <p>어떤 결과일까요?</p>

            <div className="choice-buttons">

              <button
                type="button"
                className={
                  choice === '홀'
                    ? 'choice-button selected odd'
                    : 'choice-button odd'
                }
                disabled={isPlaying}
                onClick={() => setChoice('홀')}
              >
                <span>1 · 3 · 5</span>
                <strong>홀</strong>
              </button>

              <button
                type="button"
                className={
                  choice === '짝'
                    ? 'choice-button selected even'
                    : 'choice-button even'
                }
                disabled={isPlaying}
                onClick={() => setChoice('짝')}
              >
                <span>2 · 4 · 6</span>
                <strong>짝</strong>
              </button>

            </div>

          </div>

          {/* 게임 버튼 */}
          <button
            className="play-button"
            onClick={handlePlay}
            disabled={isPlaying}
          >
            {isPlaying
              ? '🎲 숫자를 뽑는 중...'
              : '🎯 게임 시작'}
          </button>

          {/* 게임 설명 */}
          <div className="game-info">

            <div>
              <span>정답</span>
              <strong>+2배</strong>
            </div>

            <div>
              <span>오답</span>
              <strong>베팅금 차감</strong>
            </div>

          </div>

        </div>

        {/* 로그아웃 */}
        <button
          className="user-logout-button"
          onClick={handleLogout}
        >
          로그아웃
        </button>

      </section>

    </main>
  )
}

export default UserPoint