import { SubmitHandler, useForm } from "react-hook-form"
import { PatchPostRequest } from "../api/api"
import { apis } from "../api/useSwr"
import { Form, Input, Modal } from "antd"
import { FormItem } from "react-hook-form-antd"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
const PostViewPopup = ({
  id,
  onClose = () => { },
  onPostEdit = () => { }
}: {
  id: number,
  onClose: () => void,
  onPostEdit: (id: number, newContent: PatchPostRequest) => void
}) => {
  const { data, mutate } = apis.apis.use_postDetail(id)

  const schema = z.object({
    title: z.string().min(1, { message: 'Required' }),
    content: z.string().min(1, { message: 'Required' }),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<PatchPostRequest>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

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

  return <Modal title="Edit Post" open={true} onOk={handleSubmit(onSubmit)} onCancel={onClose} >
    {
      data &&
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
    }
    {
      data == null && <div>Loading...</div>
    }
  </Modal>
}

export default PostViewPopup
