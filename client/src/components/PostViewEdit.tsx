import { SubmitHandler, useForm } from "react-hook-form"
import { PatchPostRequest } from "../api/api"
import { apis } from "../api/useSwr"

const PostViewPopup = ({
  id,
  onClose = () => { },
  onPostEdit = () => { }
}: {
  id: number,
  onClose: () => void,
  onPostEdit: (id: number, newContent: PatchPostRequest) => void
}) => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PatchPostRequest>()


  const onSubmit: SubmitHandler<PatchPostRequest> = async (data) => {
    if (data.title && data.content) {
      await apis.apis.postPartialUpdate(data, id)
      // clear the form
      mutate(undefined, {revalidate: false})
      onPostEdit(id, data)
    }
  }

  watch('title')
  watch('content')

  const { data, mutate } = apis.apis.use_postDetail(id)

  return <div className="view-post">
    <button onClick={onClose}>Close</button><br />
    {
      data &&
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue={data.title} {...register('title', { required: true })} /> <br />
        {errors.title && <span>This field is required</span>} <br />
        <textarea defaultValue={data.content} {...register('content', { required: true })} /> <br />
        {errors.content && <span>This field is required</span>} <br />
        <button type="submit">edit</button>
      </form>
    }
    {
      data == null && <div>Loading...</div>
    }
  </div>
}

export default PostViewPopup
