import { useState, useEffect, useRef } from 'react';
import { Contact } from '@/types/contact';
import { contactStorage, StorageError } from '@/lib/storage';
import { ContactFormSchema } from '@/lib/validation';
import { toast } from 'sonner';
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import ContactList from '@/components/ContactList';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<{ id: string; nombre: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar contactos al iniciar
  useEffect(() => {
    try {
      const loadedContacts = contactStorage.getAll();
      setContacts(loadedContacts);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
      toast.error('Error al cargar los contactos');
    }
  }, []);

  // Agregar contacto
  const handleAdd = (data: ContactFormSchema) => {
    try {
      const contactData = {
        nombre: data.nombre,
        correo: data.correo,
        telefono: data.telefono,
      };
      const newContact = contactStorage.add(contactData);
      setContacts(prev => [...prev, newContact]);
      setShowForm(false);
      toast.success('Contacto agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      if (error instanceof StorageError) {
        toast.error(error.message);
      } else {
        toast.error('Error inesperado al agregar contacto');
      }
    }
  };

  // Actualizar contacto
  const handleUpdate = (data: ContactFormSchema) => {
    if (!editingContact) return;

    try {
      const contactData = {
        nombre: data.nombre,
        correo: data.correo,
        telefono: data.telefono,
      };
      const updated = contactStorage.update(editingContact.id, contactData);
      if (updated) {
        setContacts(prev => 
          prev.map(c => c.id === updated.id ? updated : c)
        );
        setEditingContact(null);
        toast.success('Contacto actualizado exitosamente');
      } else {
        toast.error('Contacto no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      if (error instanceof StorageError) {
        toast.error(error.message);
      } else {
        toast.error('Error inesperado al actualizar contacto');
      }
    }
  };

  // Confirmar eliminación
  const handleDeleteConfirm = () => {
    if (!deleteContact) return;

    try {
      const success = contactStorage.delete(deleteContact.id);
      if (success) {
        setContacts(prev => prev.filter(c => c.id !== deleteContact.id));
        toast.success('Contacto eliminado exitosamente');
      } else {
        toast.error('Contacto no encontrado');
      }
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      if (error instanceof StorageError) {
        toast.error(error.message);
      } else {
        toast.error('Error inesperado al eliminar contacto');
      }
    } finally {
      setDeleteContact(null);
    }
  };

  // Exportar a JSON
  const handleExport = () => {
    try {
      const jsonData = contactStorage.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contactos_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Contactos exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar contactos:', error);
      if (error instanceof StorageError) {
        toast.error(error.message);
      } else {
        toast.error('Error inesperado al exportar contactos');
      }
    }
  };

  // Importar desde JSON
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        contactStorage.importFromJSON(content);
        const loadedContacts = contactStorage.getAll();
        setContacts(loadedContacts);
        toast.success('Contactos importados exitosamente');
      } catch (error) {
        console.error('Error al importar contactos:', error);
        if (error instanceof StorageError) {
          toast.error(error.message);
        } else {
          toast.error('Error inesperado al importar contactos');
        }
      }
    };
    reader.readAsText(file);
    
    // Reset input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejadores de UI
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleShowNewForm = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-window">
      <Header onExport={handleExport} onImport={handleImportClick} />
      
      <main className="container mx-auto p-6 max-w-6xl">
        {(showForm || editingContact) && (
          <ContactForm
            onSubmit={editingContact ? handleUpdate : handleAdd}
            onCancel={handleCancelForm}
            initialData={editingContact || undefined}
            isEditing={!!editingContact}
          />
        )}

        <ContactList
          contacts={contacts}
          onEdit={handleEdit}
          onDelete={(id) => {
            const contact = contacts.find(c => c.id === id);
            if (contact) {
              setDeleteContact({ id: contact.id, nombre: contact.nombre });
            }
          }}
          onAdd={handleShowNewForm}
        />
      </main>

      <DeleteConfirmDialog
        open={!!deleteContact}
        onOpenChange={(open) => !open && setDeleteContact(null)}
        onConfirm={handleDeleteConfirm}
        contactName={deleteContact?.nombre || ''}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Index;
