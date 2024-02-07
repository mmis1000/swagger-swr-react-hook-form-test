import { SubmitHandler, useForm } from 'react-hook-form'
import './App.css'
import { apis, useCurrentToken } from './api/useSwr'
import Posts from './pages/Posts'
import { LoginCreatePayload } from './api/api'
import { useEffect } from 'react'

const LOCAL_STORAGE_KEY = 'token'

function App() {
  const [token, setToken] = useCurrentToken()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginCreatePayload>()

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
      const res = await apis.apis.loginCreate(data)
      if (res.data.token) {
        localStorage.setItem(LOCAL_STORAGE_KEY, res.data.token)
        setToken(res.data.token)
        apis.setToken(localStorage.getItem(LOCAL_STORAGE_KEY)!)
      }
    }
  }

  console.log(watch('username')) // watch input value by passing the name of it
  console.log(watch('password')) // watch input value by passing the name of it
  return (
    <>
      {
        token == null && <>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input defaultValue="username" {...register('username')} />

            {/* include validation with required or other standard HTML validation rules */}
            <input {...register("password", { required: true })} />
            {/* errors will return when field validation fails  */}
            {errors.password && <span>This field is required</span>}

            <input type="submit" />
          </form>
        </>
      }
      {
        token != null && <Posts></Posts>
      }
    </>
  )
}

export default App
