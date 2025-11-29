import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ContactItemProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactItem = ({ contact, onEdit, onDelete }: ContactItemProps) => {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-card-foreground">
        {contact.nombre}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {contact.correo}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {contact.telefono}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onEdit(contact)}
            variant="ghost"
            size="sm"
            className="h-8 gap-2 hover:bg-accent hover:text-accent-foreground"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Button>
          <Button
            onClick={() => onDelete(contact.id)}
            variant="ghost"
            size="sm"
            className="h-8 gap-2 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ContactItem;
