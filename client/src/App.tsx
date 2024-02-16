import { SubmitHandler, useForm } from 'react-hook-form'
import './App.css'
import { apis, useCurrentToken } from './api/useSwr'
import Posts from './pages/Posts'
import { LoginCreatePayload } from './api/api'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Form, Input } from 'antd'
import { FormItem } from 'react-hook-form-antd'
import { useOpenNotification } from './utils/useOpenNotification'


const LOCAL_STORAGE_KEY = 'token'


function App() {
  const  { openNotification, contextHolder } = useOpenNotification()
  
  const [token, setToken] = useCurrentToken()

  const schema = z.object({
    username: z.string().min(1, { message: 'Required' }),
    password: z.string().min(1, { message: 'Required' }),
  });

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<LoginCreatePayload>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      const controller = new AbortController()
      const signal = controller.signal

      apis.apis.getMe({signal, headers: {
        Authorization: 'bearer ' + localStorage.getItem(LOCAL_STORAGE_KEY)
      }}).then(() => {
        setToken(localStorage.getItem(LOCAL_STORAGE_KEY))
        apis.setToken(localStorage.getItem(LOCAL_STORAGE_KEY)!)
      })

      return () => {
        controller.abort()
      }
    }
  })

  const onSubmit: SubmitHandler<LoginCreatePayload> = async (data) => {
    if (data.username && data.password) {
      try {
        const res = await apis.apis.loginCreate(data)
        if (res.data.token) {
          localStorage.setItem(LOCAL_STORAGE_KEY, res.data.token)
          setToken(res.data.token)
          apis.setToken(localStorage.getItem(LOCAL_STORAGE_KEY)!)
        }
      } catch (err) {
        openNotification('top', String(err))
      }
    }
  }

  console.log(watch('username')) // watch input value by passing the name of it
  console.log(watch('password')) // watch input value by passing the name of it

  const onLogout = async () => {
    await apis.apis.logoutCreate()
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setToken(null)
    apis.setToken(null)
  }

  return (
    <>
      {contextHolder}
      {
        token == null && <>
        <Form
          style={{ maxWidth: 600 }}
          onFinish={handleSubmit(onSubmit)}
        >
            {/* register your input into the hook by invoking the "register" function */}
            <FormItem control={control} name="username" label="Username">
              <Input />
            </FormItem>

            <FormItem control={control} name="password" label="Password">
              <Input.Password />
            </FormItem>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      }
      {
        token && <>
          <Button onClick={onLogout}>Logout</Button>
        </>
      }
      {
        token != null && <Posts></Posts>
      }
    </>
  )
}

export default App
