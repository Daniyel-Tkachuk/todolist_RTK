import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "../../../../app/appSelectors"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import s from "./Login.module.css"
import { loginTC, selectIsLoggedIn } from "../../model/authSlice"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInputs, authSchema } from "../../model/authSchemaValid"
import { Path } from "common/router/path"

export const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    control, // для регистрации компонента, + треб.исп. компонент <Controller/>
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const navigate = useNavigate()
  const themeMode = useAppSelector(selectThemeMode)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const theme = getTheme(themeMode)
  const dispatch = useAppDispatch()

  const onSubmit: SubmitHandler<LoginInputs> = (data: LoginInputs) => {
    dispatch(loginTC(data))
    reset()
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate(Path.Main)
    }
  }, [isLoggedIn])

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href={"https://social-network.samuraijs.com/"}
                target={"_blank"}
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <TextField label="Email" margin="normal" {...register("email")} />
              {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
              <TextField type="password" label="Password" margin="normal" {...register("password")} />
              {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>}
              <FormControlLabel
                label={"Remember me"}
                control={
                  <Controller
                    name={"rememberMe"}
                    control={control}
                    render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
