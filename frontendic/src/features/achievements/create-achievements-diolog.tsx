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
import { useCreateAchievements } from "./model/use-create-achievements"

const createAchievementsSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  finalValue: z.number().min(0, "Цель должна быть неотрицательной"),
})

export type CreateAchievementsFormValues = z.infer<typeof createAchievementsSchema>

type CreateAchievementsDialogProps = {
  onSubmit?: (values: CreateAchievementsFormValues) => void
}

export function CreateAchievementsDialog({ onSubmit }: CreateAchievementsDialogProps) {
  const [open, setOpen] = useState(false)
  const { createAchievements, isPending } = useCreateAchievements();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAchievementsFormValues>({
    resolver: zodResolver(createAchievementsSchema),
    defaultValues: {
      name: "",
      description: "",
      finalValue: 0,

    },
  })

  const onSubmitForm = async (data: CreateAchievementsFormValues) => {
    try {
      await createAchievements({
        name: data.name,
        description: data.description,
        finalValue: data.finalValue
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
        <Button variant="default">Открыть диалог ачивки</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать ачивку</DialogTitle>
          <DialogDescription>
            Введите данные для создания ачивки
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
            <label className="block text-xs font-medium text-muted-foreground">Цель</label>
            <Input
              type="number"
              {...register("finalValue", { valueAsNumber: true })}
              placeholder="цель"
            />
            {errors.finalValue && (
              <p className="text-xs text-red-500">{errors.finalValue.message}</p>
            )}
          </div>

          <DialogFooter>
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