import { SubmitHandler, useForm } from "react-hook-form"
import { AddPostRequest } from "../api/api"
import { apis } from "../api/useSwr"
import { Form, Input, Modal } from "antd"
import { FormItem } from "react-hook-form-antd"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const PostCreatePopup = ({
  onClose = () => {},
  onPostAdd = () => {}
}) => {
  const schema = z.object({
    title: z.string().min(1, { message: 'Required' }),
    content: z.string().min(1, { message: 'Required' }),
  });

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<AddPostRequest>({
    resolver: zodResolver(schema)
  })


  const onSubmit: SubmitHandler<AddPostRequest> = async (data) => {
    if (data.title && data.content) {
      await apis.apis.postCreate(data)
      onPostAdd()
    }
  }

  watch('title')
  watch('content')

  return <Modal title="Create Post" open={true} onOk={handleSubmit(onSubmit)} onCancel={onClose} >
  <Form
    style={{ maxWidth: 600 }}
    onFinish={handleSubmit(onSubmit)}
  >
    <FormItem control={control} name="title" label="title">
      <Input />
    </FormItem>
    <FormItem control={control} name="content" label="content">
      <Input.TextArea />
    </FormItem>
    </Form>
  </Modal>
}

export default PostCreatePopup
