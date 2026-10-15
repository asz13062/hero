import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // 타자 연습 상태
  const [typingPost, setTypingPost] = useState(null)
  const [typedText, setTypedText] = useState('')
  const [typingStarted, setTypingStarted] = useState(false)
  const [typingFinished, setTypingFinished] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  const typingInputRef = useRef(null)
  const startTimeRef = useRef(null)

  // 게시물 불러오기
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('게시글을 불러오지 못했습니다.')
        }
        return response.json()
      })
      .then((data) => {
        setPosts(data)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // 타자 연습 시간 측정
  useEffect(() => {
    if (!typingStarted || typingFinished) return

    const timer = setInterval(() => {
      setElapsedTime(
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [typingStarted, typingFinished])

  // 검색 기능
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  )

  // 타자 연습 시작
  const startTyping = (post) => {
    setTypingPost(post)
    setTypedText('')
    setTypingStarted(false)
    setTypingFinished(false)
    setElapsedTime(0)
    startTimeRef.current = null

    setTimeout(() => {
      typingInputRef.current?.focus()
    }, 100)
  }

  // 타자 연습 입력 처리
  const handleTyping = (e) => {
    if (typingFinished) return

    const value = e.target.value
    const targetText = typingPost.body

    if (!typingStarted && value.length > 0) {
      setTypingStarted(true)
      startTimeRef.current = Date.now()
    }

    setTypedText(value)

    if (value === targetText) {
      setTypingFinished(true)
      setElapsedTime(
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      )
    }
  }

  // 처음부터 다시 연습
  const retryTyping = () => {
    setTypedText('')
    setTypingStarted(false)
    setTypingFinished(false)
    setElapsedTime(0)
    startTimeRef.current = null
    typingInputRef.current?.focus()
  }

  // 창 닫기
  const closeTyping = () => {
    setTypingPost(null)
    setTypedText('')
    setTypingStarted(false)
    setTypingFinished(false)
    setElapsedTime(0)
  }

  // 타자 정확도 계산
  const getAccuracy = () => {
    if (!typedText.length) return 100

    let correct = 0

    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === typingPost.body[i]) {
        correct++
      }
    }

    return Math.round((correct / typedText.length) * 100)
  }

  // 타자 속도 계산 (분당 타수)
  const getTypingSpeed = () => {
    if (elapsedTime === 0) return 0

    const correctChars = typedText
      .split('')
      .filter((char, index) => char === typingPost.body[index])
      .length

    return Math.round((correctChars / elapsedTime) * 60)
  }

  if (loading) {
    return (
      <main className="page">
        <p>불러오는 중...</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>React 게시판</h1>

      <div className="search-area">
        <input
          type="text"
          placeholder="게시글 제목 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="search-count">
        검색 결과: {filteredPosts.length}개
      </p>

      {filteredPosts.map((post) => (
        <article
          className={
            search !== ''
              ? 'post-card post-card-search'
              : 'post-card'
          }
          key={post.id}
        >
          <span className="post-number">
            게시글 #{post.id}
          </span>

          <h2>{post.title}</h2>
          <p>{post.body}</p>

          <button
            type="button"
            className="typing-button"
            onClick={() => startTyping(post)}
          >
            타자 연습하기
          </button>
        </article>
      ))}

      {filteredPosts.length === 0 && (
        <p className="no-result">
          검색 결과가 없습니다.
        </p>
      )}

      {/* 타자 연습 창 */}
      {typingPost && (
        <div
          className="typing-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeTyping()
            }
          }}
        >
          <section
            className="typing-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="typing-title"
          >
            <button
              type="button"
              className="typing-close"
              onClick={closeTyping}
              aria-label="닫기"
            >
              ✕
            </button>

            <h2 id="typing-title">타자 연습</h2>

            <p className="typing-post-title">
              게시글 #{typingPost.id}: {typingPost.title}
            </p>

            <p className="typing-guide">
              아래 문장을 보고 똑같이 입력해 보세요!
            </p>

            <div className="typing-target">
              {typingPost.body.split('').map((char, index) => {
                let charClass = ''

                if (index < typedText.length) {
                  charClass =
                    typedText[index] === char
                      ? 'correct'
                      : 'incorrect'
                }

                return (
                  <span
                    key={index}
                    className={charClass}
                  >
                    {char}
                  </span>
                )
              })}
            </div>

            <textarea
              ref={typingInputRef}
              className="typing-input"
              placeholder="여기에 위 문장을 그대로 입력하세요."
              value={typedText}
              onChange={handleTyping}
              disabled={typingFinished}
              autoFocus
              spellCheck={false}
            />

            <div className="typing-progress">
              <span>
                진행률:{' '}
                {Math.min(
                  100,
                  Math.round(
                    (typedText.length / typingPost.body.length) * 100
                  )
                )}%
              </span>

              <span>경과 시간: {elapsedTime}초</span>

              <span>정확도: {getAccuracy()}%</span>
            </div>

            {typingFinished ? (
              <div className="typing-result">
                <h3>🎉 타자 연습 완료!</h3>

                <p>
                  소요 시간: {elapsedTime}초
                </p>

                <p>
                  타자 속도: {getTypingSpeed()}타/분
                </p>

                <p>
                  정확도: {getAccuracy()}%
                </p>

                <div className="typing-actions">
                  <button
                    type="button"
                    onClick={retryTyping}
                  >
                    다시 연습하기
                  </button>

                  <button
                    type="button"
                    onClick={closeTyping}
                  >
                    게시판으로 돌아가기
                  </button>
                </div>
              </div>
            ) : (
              <div className="typing-actions">
                <button
                  type="button"
                  onClick={retryTyping}
                >
                  처음부터 다시
                </button>

                <button
                  type="button"
                  onClick={closeTyping}
                >
                  닫기
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default App