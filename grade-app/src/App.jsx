import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

// 관리자 페이지에서 사용할 CSS 파일 가져오기
import './App.css'

// 분리한 컴포넌트 가져오기
import PointForm from './PointForm.jsx'
import UserList from './UserList.jsx'
import PointGraph from './PointGraph.jsx'
import PointHistory from './PointHistory.jsx'

function App() {
  // useNavigate()를 사용해서 다른 페이지로 이동할 수 있음
  const navigate = useNavigate()

  // 기본 사용자 데이터
  const defaultUsers = [
    { id: 1, name: '홍길동', point: 8500 },
    { id: 2, name: '김철수', point: 12000 },
    { id: 3, name: '이영희', point: 5500 }
  ]

  // localStorage에 저장된 users가 있으면 가져오고,
  // 없으면 기본 사용자 데이터를 사용
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')

    if (savedUsers) {
      return JSON.parse(savedUsers)
    }

    return defaultUsers
  })

  // users가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  // 그래프 표시 여부
  const [showGraph, setShowGraph] = useState(false)

  // 현재 선택한 사용자 ID
  const [selectedId, setSelectedId] = useState(1)

  // 포인트 타입 : add(적립), subtract(차감)
  const [pointType, setPointType] = useState('add')

  // 입력받은 포인트 값
  const [amount, setAmount] = useState('')

  // 포인트 처리 결과 메시지
  const [message, setMessage] = useState('')

  // 포인트 변경 이력
  // localStorage에 저장된 history가 있으면 가져옴
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('pointHistory')

    if (savedHistory) {
      return JSON.parse(savedHistory)
    }

    return []
  })

  // history가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('pointHistory', JSON.stringify(history))
  }, [history])

  // localStorage에 저장되어 있는 로그인 여부 가져오기
  const isLogin = localStorage.getItem('isLogin')

  // localStorage에 저장되어 있는 사용자 권한 가져오기
  const isAdmin = localStorage.getItem('role')

  // 관리자 접근 권한 확인
  if (!isLogin || isAdmin !== 'admin') {
    return <Navigate to="/" replace />
  }

  // 가장 큰 포인트 계산
  const maxPoint = Math.max(
    ...users.map((user) => user.point),
    1
  )

  // 포인트를 변경하는 함수
  const handlePointUpdate = () => {
    // input으로 입력받은 값은 문자열이므로 숫자로 변환
    const pointValue = Number(amount)

    // 포인트를 입력하지 않았거나 0 이하의 값을 입력한 경우
    if (amount === '' || pointValue <= 0) {
      setMessage('포인트는 1 이상이어야 합니다.')
      return
    }

    // 선택되어 있는 사용자 찾기
    const selectedUser = users.find(
      (user) => user.id === Number(selectedId)
    )

    // 사용자를 찾지 못한 경우
    if (!selectedUser) {
      setMessage('사용자를 찾을 수 없습니다.')
      return
    }

    // 차감할 포인트가 현재 포인트보다 큰 경우
    if (
      pointType === 'subtract' &&
      pointValue > selectedUser.point
    ) {
      setMessage(
        '현재 보유 포인트보다 많이 차감할 수 없습니다.'
      )
      return
    }

    // 사용자 배열 변경
    const updatedUsers = users.map((user) => {
      // 선택한 사용자가 아니라면 기존 사용자 그대로 반환
      if (user.id !== Number(selectedId)) {
        return user
      }

      // 새로운 포인트 계산
      let newPoint

      if (pointType === 'add') {
        // 포인트 적립
        newPoint = user.point + pointValue
      } else {
        // 포인트 차감
        newPoint = user.point - pointValue
      }

      // 기존 사용자 정보는 유지하면서 point만 변경
      return {
        ...user,
        point: newPoint
      }
    })

    // 변경된 사용자 배열 저장
    setUsers(updatedUsers)
    window.dispatchEvent(new Event('usersUpdated'))

    

    // 포인트 변경 이력 생성
    const newHistory = {
      id: Date.now(),
      date: new Date().toISOString(),
      user: selectedUser.name,
      type: pointType,
      point: pointValue
    }

    // 새로운 이력을 기존 이력 앞에 추가
    setHistory((prevHistory) => [
      newHistory,
      ...prevHistory
    ])

    // 처리 완료 메시지
    setMessage('포인트가 정상적으로 반영되었습니다.')

    // 입력창 초기화
    setAmount('')
  }

  // 로그아웃 함수
  const handleLogout = () => {
    // 로그인 정보만 삭제
    localStorage.removeItem('isLogin')
    localStorage.removeItem('role')

    // 포인트와 이력은 삭제하지 않음
    navigate('/')
  }

  // 화면 출력
  return (
    <main className="admin-page">
      {/* 관리자 화면 제목 */}
      <h1>관리자 포인트 관리</h1>

      {/* 포인트 지급 / 차감 */}
      <PointForm
        users={users}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        pointType={pointType}
        setPointType={setPointType}
        amount={amount}
        setAmount={setAmount}
        message={message}
        handlePointUpdate={handlePointUpdate}
      />

      {/* 사용자 목록 */}
      <UserList users={users} />

      {/* 그래프 보기 / 닫기 */}
      <div className="button-area">
        <button
          onClick={() => setShowGraph(!showGraph)}
        >
          {showGraph ? '그래프 닫기' : '그래프 보기'}
        </button>

        {/* 로그아웃 */}
        <button onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {/* 사용자별 포인트 그래프 */}
      {showGraph && (
        <PointGraph
          users={users}
          maxPoint={maxPoint}
        />
      )}

      {/* 포인트 변경 이력 */}
      <PointHistory history={history} />
    </main>
  )
}

export default App