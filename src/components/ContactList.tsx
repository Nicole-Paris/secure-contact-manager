import { Contact } from '@/types/contact';
import ContactItem from './ContactItem';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ContactList = ({ contacts, onEdit, onDelete, onAdd }: ContactListProps) => {
  if (contacts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              No hay contactos registrados
            </h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tu primer contacto a la agenda
            </p>
          </div>
          <Button onClick={onAdd} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Agregar Primer Contacto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-toolbar border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-card-foreground">
            Contactos ({contacts.length})
          </h2>
          <Button onClick={onAdd} size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Nuevo
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Correo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Teléfono
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
