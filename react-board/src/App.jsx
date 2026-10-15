import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((data) => {
      setPosts(data)
      setLoading(false)})
    },[])
    if (loading) {
      return (
        <main className="page">
          <p>불러오는 중...</p>
        </main>
      )
  }
  const filteredPosts = posts.filter((post) =>
    post.title
    .toLowerCase()
    .includes(search.toLowerCase())
  )

  return (
    <main className="page">
      <h1>React 게시판</h1>
      { }
      <div className="search-area">
        <input type="text" placeholder="게시글 제목 검색" valuse={search}
        onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      { }
      <p className="search-count">
        검색 결과 : {' '} {filteredPosts.length}개
      </p>

      { }
      {filteredPosts.map((post) => (
        <article
          className={search !== ''
            ? 'post-card post-card-search'
            : 'post-card'
          }

          key={post.id}>
            <span className="post-number">
              게시글 #{post.id}
            </span>
            { }
            <h2>{post.title}</h2>
            { }
            <p>{post.body}</p>
          </article>
      ))}
      { }
      {filteredPosts.length === 0 && (
        <p className="no-result">
          검색 결과가 없습니다.
        </p>
      )}

      {posts.map((post) => (
        <article className="post-card" key={post.id}>
          { }

          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </main>
  )
}

export default App