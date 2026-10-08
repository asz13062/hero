import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import './Grade.css'

function Grade() {

    const navigate = useNavigate()
    const name='권영웅'
    const studentID='20221042'
    const department='멀티미디어학과'
    const [detection, setDetection] = useState(0);

    useEffect(() => {
  const interval = setInterval(() => {
    setDetection((prev) => {
      const next = prev + 1;

      if (next >= 100) {
        clearInterval(interval);
        navigate("/");
        return 100;
      }

      return next;
    });
  }, 30);

  return () => clearInterval(interval);
}, [navigate]);
    

    return (
        <main className="grade-page">
            <div className="detection-gauge">
  <div className="detection-info">
    <span>훔쳐보다 걸린다</span>
    <strong>{detection}%</strong>
  </div>

  <div className="detection-bar">
    <div
      className="detection-bar-fill"
      style={{ width: `${detection}%` }}
    />
  </div>
</div>
            <section className="grade-card">
                <p className="grade-label">MY GRADE</p>
                <h1>개인 성적 조회</h1>
                <div className="student-info">
                    <p>
                        <span>이름</span>
                        <strong>{name}</strong>
                    </p>

                    <p>
                        <span>학번</span>
                        <strong>{studentID}</strong>
                    </p>
                    
                    <p>
                        <span>학과</span>
                        <strong>{department}</strong>
                    </p>
                </div>

                <div className="grade-divider"></div>
                <h2>수강 과목 성적</h2>
                <div className="subject-list">
                    <div className="subject">
                        <span>프론트앤드프로그래밍</span>
                        <strong>A+</strong>
                    </div>
                    <div className="subject">
                        <span>멀티미디어프로그래밍</span>
                        <strong>A+</strong>
                    </div>
                    <div className="subject">
                        <span>데이터베이스</span>
                        <strong>A+</strong>
                    </div>
                </div>

                    <div className="gpa-box">
                        <span>평균 평점</span>
                        <strong>4.5 / 4.5</strong>
                    </div>

                <button onClick={() => navigate('/profile')}>
                    그만보기
                </button>
            </section>
        </main>
    )
}

export default Grade