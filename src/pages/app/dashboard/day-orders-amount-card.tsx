import { useQuery } from '@tanstack/react-query'
import { Utensils } from 'lucide-react'

import { getDayOrdersAmount } from '../../../api/get-day-orders-amount'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { MetricCardSkeleton } from './metric-card-skeleton'

export function DayOrdersAmountCard() {
  const { data: dayOrdersAmount } = useQuery({
    queryFn: getDayOrdersAmount,
    queryKey: ['metrics', 'day-orders-amount'],
  })
  return (
    <Card>
      <CardHeader className="flex items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Pedidos (dia)</CardTitle>
        <Utensils className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-1">
        {dayOrdersAmount ? (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {dayOrdersAmount.amount.toLocaleString('pt-BR')}
            </span>
            <p className="text-muted-foreground text-xs">
              {dayOrdersAmount.diffFromYesterday >= 0 ? (
                <span className="text-rose-500 dark:text-emerald-400">
                  +{dayOrdersAmount.diffFromYesterday}%{' '}
                </span>
              ) : (
                <span className="text-rose-500 dark:text-red-400">
                  {dayOrdersAmount.diffFromYesterday}%{' '}
                </span>
              )}
              em relação a ontem
            </p>
          </>
        ) : (
          <MetricCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
