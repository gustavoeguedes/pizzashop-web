import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerRestaurant } from '../../api/register-restaurant'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const signUpForm = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email('E-mail inválido'),
})

type SignForm = z.infer<typeof signUpForm>

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignForm>()
  const navigate = useNavigate()

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  })

  async function handleSignUp(data: SignForm) {
    try {
      await registerRestaurantFn({
        email: data.email,
        managerName: data.managerName,
        phone: data.phone,
        restaurantName: data.restaurantName,
      })
      toast.success('Restaurante cadsatrado com sucesso.', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      })
    } catch {
      toast.error('Erro ao cadastrar o estabelecimento. Tente novamente.')
    }
  }
  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant={'ghost'} className="absolute top-8 right-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p>Seja um parceiro e comece suas vendas!</p>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input id="restaurantName" {...register('restaurantName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input
                id="managerName"
                type="text"
                {...register('managerName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Seu celular</Label>
              <Input id="phone" type="tel" {...register('phone')} />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              Finalizar cadastro
            </Button>

            <p className="text-muted-foreground px-6 text-center text-sm leading-relaxed">
              Ao continar, você concorda com nossos
              <a className="underline underline-offset-4">
                {' '}
                termos de serviço
              </a>{' '}
              e
              <a href="" className="underline underline-offset-4">
                {' '}
                políticas de privacidade.
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
