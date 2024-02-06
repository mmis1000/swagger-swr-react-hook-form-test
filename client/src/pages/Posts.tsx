import { useState } from "react"
import { apis } from "../api/useSwr"

const Posts = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data, mutate } = apis.apis.use_postList({ current: page, pageSize })

  const hasNextPage = data!= null && data.page.size * (data.page.current) < data.page.total
  const hasPrevPage = data!= null && page > 1

  const changePageSize = (size: number) => {
    setPage(1)
    setPageSize(size)
  }

  const removePost = async (id: number) => {
    await apis.apis.postDelete(id)
    mutate({...data!, data: data!.data.filter(i => i.id !== id)})
  }

  return <>
    {data?.data?.map(i => <div key={i.id}>
      title: {i.title}
      author: {i.author}
      <button onClick={() => removePost(i.id)}>Delete</button>
    </div>)}
    {hasPrevPage && <button onClick={() => setPage(page - 1)}>prev</button>}
    {hasNextPage && <button onClick={() => setPage(page + 1)}>next</button>}
    <br />
    <button onClick={() => changePageSize(10)}>10/page</button>
    <button onClick={() => changePageSize(30)}>30/page</button>
    <button onClick={() => changePageSize(50)}>50/page</button>
  </>
}

export default Posts
