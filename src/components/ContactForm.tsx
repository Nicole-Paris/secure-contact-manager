import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact } from '@/types/contact';
import { X } from 'lucide-react';

interface ContactFormProps {
  onSubmit: (data: ContactFormSchema) => void;
  onCancel: () => void;
  initialData?: Contact;
  isEditing?: boolean;
}

const ContactForm = ({ onSubmit, onCancel, initialData, isEditing }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData ? {
      nombre: initialData.nombre,
      correo: initialData.correo,
      telefono: initialData.telefono,
    } : undefined,
  });

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">
          {isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
        </h2>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            {...register('nombre')}
            placeholder="Ej: María García"
            className={errors.nombre ? 'border-destructive' : ''}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Solo letras, espacios y acentos. Máximo 80 caracteres.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">Correo Electrónico *</Label>
          <Input
            id="correo"
            type="email"
            {...register('correo')}
            placeholder="Ej: usuario@ejemplo.com"
            className={errors.correo ? 'border-destructive' : ''}
          />
          {errors.correo && (
            <p className="text-sm text-destructive">{errors.correo.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Formato estándar de correo. Máximo 120 caracteres.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            {...register('telefono')}
            placeholder="Ej: 5551234567"
            className={errors.telefono ? 'border-destructive' : ''}
          />
          {errors.telefono && (
            <p className="text-sm text-destructive">{errors.telefono.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Solo dígitos. Entre 7 y 15 caracteres.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" onClick={onCancel} variant="outline">
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Actualizar' : 'Agregar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
