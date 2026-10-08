function PointHistory({ history }) {
    return(
        <section className="history-area">
            <h2>포인트 변경 이력</h2>
            {history.length === 0 && (
                <p className="empty-history">
                    아직 포인트 변경 이력이 없습니다.
                </p>
            )}
            {history.map((item) => (
                <div className="history-item" key={item.id}>
                    <span className="history-name">{item.user} - </span>
                    <span>
                        {item.type === 'add' ? '적립' : '차감'}
                    </span>
                    <strong>
                        {item.type === 'add' ? '+' : '-'}
                        {item.point.toLocaleString()} P
                    </strong>
                    </div>
            ))}
        </section>
    )
}

export default PointHistory