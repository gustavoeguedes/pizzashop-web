import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getManagedRestaurant,
  type GetManagedRestaurantResponse,
} from '../api/get-managed-restaurant'
import { UpdateProfile } from '../api/update-profile'
import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const storeProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string(),
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()
  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
      queryFn: getManagedRestaurant,
      queryKey: ['managed-restaurant'],
      staleTime: Infinity,
    })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    },
  })

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: UpdateProfile,
    onSuccess(_, { description, name }) {
      const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
        'managed-restaurant',
      ])

      if (cached) {
        queryClient.setQueryData<GetManagedRestaurantResponse>(
          ['managed-restaurant'],
          {
            ...cached,
            name,
            description,
          },
        )
      }
    },
  })

  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description,
      })

      toast.success('Perfil atualizado com sucesso.')
    } catch {
      toast.error('Erro ao atualizar o perfil. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="itens-center grid grid-cols-4 gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>
          <div className="itens-center grid grid-cols-4 gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="decription"
              {...register('description')}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'ghost'} type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant={'success'} disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
