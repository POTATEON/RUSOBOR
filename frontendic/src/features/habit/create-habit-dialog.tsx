"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { useCreateHabit } from "./model/use-create-habit"

const createHabitSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  tagId: z.string().min(1, "ID тега обязательно"),
  cost: z.number().min(0, "Стоимость должна быть неотрицательной"),
  goal_days: z.number().min(0, "Цель в днях должна быть неотрицательной").default(0),
})

export type CreateHabitFormValues = z.infer<typeof createHabitSchema>

type CreateHabitDialogProps = {
  userId: string;
  onSubmit?: (values: CreateHabitFormValues) => void
}

export function CreateHabitDialog({ userId, onSubmit }: CreateHabitDialogProps) {
  const [open, setOpen] = useState(false)
  const { createHabit, isPending } = useCreateHabit();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateHabitFormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      description: "",
      tagId: "",
      cost: 0,
      goal_days: 0,
    },
  })

  const onSubmitForm = async (data: CreateHabitFormValues) => {
    try {
      await createHabit({
        name: data.name,
        description: data.description,
        tagId: data.tagId,
        cost: data.cost,
        goal_days: data.goal_days,
        userId,
      })
      reset()
      setOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="default">Открыть диалог привычки</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать привычку</DialogTitle>
          <DialogDescription>
            Введите данные для создания привычки
          </DialogDescription>
        </DialogHeader>

        <form className="mt-3 space-y-3" onSubmit={hookFormSubmit(onSubmitForm)}>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Название</label>
            <Input
              {...register("name")}
              placeholder="Название"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Описание</label>
            <Input
              {...register("description")}
              placeholder="Описание"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">ID тега</label>
            <Input
              {...register("tagId")}
              placeholder="ID тега"
            />
            {errors.tagId && (
              <p className="text-xs text-red-500">{errors.tagId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Стоимость</label>
            <Input
              {...register("cost", { valueAsNumber: true })}
              placeholder="Стоимость"
              type="number"
            />
            {errors.cost && (
              <p className="text-xs text-red-500">{errors.cost.message}</p>
            )}
          </div>
          <DialogFooter>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground">Цель (дни)</label>
            <Input
              {...register("goal_days", { valueAsNumber: true })}
              placeholder="Цель в днях"
              type="number"
            />
            {errors.goal_days && (
              <p className="text-xs text-red-500">{errors.goal_days.message}</p>
            )}
          </div>
            <Button type="submit" variant="default" disabled={isPending}>
              {isPending ? "Создание..." : "Создать"}
            </Button>
            <DialogClose render={<Button variant="outline">Отмена</Button>} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}