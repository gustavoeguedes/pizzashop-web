import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '../../api/sign-in'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const signInForm = z.object({
  email: z.string().email('E-mail inválido'),
})

type SignForm = z.infer<typeof signInForm>

export function SignIn() {
  const [searchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignForm>({
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignForm) {
    try {
      await authenticate({ email: data.email })
      toast.success('Enviamos um link de autenticação para seu e-mail.', {
        action: {
          label: 'Reenviar',
          onClick: () => handleSignIn(data),
        },
      })
    } catch {
      toast.error('Credenciais invállidas.')
    }
  }
  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant={'ghost'} className="absolute top-8 right-8">
          <Link to="/sign-up">Novo estabelecimento</Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p>Acompanhe suas vendas pelo painel do parceiro!</p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
