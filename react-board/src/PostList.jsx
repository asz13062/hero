import PostItem from './PostItem.jsx'

function PostList({ posts }) {
    return (
        <div>
            { }
            {posts.map((post) => (
                <PostItem key={post.id} post={post}/>
            ))}
        </div>
    )
}

export default PostList