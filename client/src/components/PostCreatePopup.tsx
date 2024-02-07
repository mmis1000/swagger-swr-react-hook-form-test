import { SubmitHandler, useForm } from "react-hook-form"
import { AddPostRequest } from "../api/api"
import { apis } from "../api/useSwr"

const PostCreatePopup = ({
  onClose = () => {},
  onPostAdd = () => {}
}) => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddPostRequest>()


  const onSubmit: SubmitHandler<AddPostRequest> = async (data) => {
    if (data.title && data.content) {
      await apis.apis.postCreate(data)
      onPostAdd()
    }
  }

  watch('title')
  watch('content')

  return <div className="create-post">
    <button onClick={onClose}>Close</button><br />
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="" {...register('title', {required: true})} /><br />
      {errors.title && <span>This field is required</span>}<br />
      <textarea defaultValue="" {...register('content', {required: true})} /><br />
      {errors.content && <span>This field is required</span>}<br />
      <button type="submit">create</button>
    </form>
  </div>
}

export default PostCreatePopup
