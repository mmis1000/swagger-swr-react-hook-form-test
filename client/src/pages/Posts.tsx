import { useState } from "react"
import { apis } from "../api/useSwr"
import PostCreatePopup from "../components/PostCreatePopup"
import PostViewPopup from "../components/PostViewEdit"
import { PatchPostRequest } from "../api/api"

const Posts = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data, mutate } = apis.apis.use_postList({ current: page, pageSize })

  const hasNextPage = data != null && data.page.size * (data.page.current) < data.page.total
  const hasPrevPage = data != null && page > 1

  const changePageSize = (size: number) => {
    setPage(1)
    setPageSize(size)
  }

  const removePost = async (id: number) => {
    await apis.apis.postDelete(id)
    // remove post from local, swr will reload it for latest data later
    setCreateVisible(false)
    mutate({ ...data!, data: data!.data.filter(i => i.id !== id) })
  }

  const onPostAdd = () => {
    setCreateVisible(false)
    // call mutate without args revalidate the data without change screen
    mutate()
  }
  const onPostEdit = (id: number, newContent: PatchPostRequest) => {
    setViewingPost(null)
    // call mutate without args revalidate the data without change screen
    mutate({ ...data!, data: data!.data.map(i => i.id !== id ? i : { ...i, ...newContent }) })
  }

  const [createVisible, setCreateVisible] = useState(false)
  const [viewingPost, setViewingPost] = useState<number | null>(null)

  return <>
    <button onClick={() => (setCreateVisible(true))}>Add post</button>
    <table>
    <tbody>
    {data?.data?.map(i => <tr key={i.id}>
      <td>
      title: {i.title}
      </td>
      <td>
      author: {i.author}
      </td>
      <td>
      <button onClick={() => removePost(i.id)}>Delete</button>
      <button onClick={() => setViewingPost(i.id)}>Edit</button>
      </td>
    </tr>)}
    </tbody>
    </table>
    {hasPrevPage && <button onClick={() => setPage(page - 1)}>prev</button>}
    {hasNextPage && <button onClick={() => setPage(page + 1)}>next</button>}
    <br />
    <button onClick={() => changePageSize(10)}>10/page</button>
    <button onClick={() => changePageSize(30)}>30/page</button>
    <button onClick={() => changePageSize(50)}>50/page</button>
    {createVisible && <PostCreatePopup onClose={() => setCreateVisible(false)} onPostAdd={onPostAdd} />}
    {viewingPost != null && <PostViewPopup id={viewingPost} onClose={() => setViewingPost(null)} onPostEdit={onPostEdit} />}
  </>
}

export default Posts
