import { Contact } from '@/types/contact';

const STORAGE_KEY = 'contactos_agenda';

export class StorageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

export const contactStorage = {
  // Obtener todos los contactos
  getAll: (): Contact[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const contacts = JSON.parse(data);
      
      // Validar estructura básica de datos
      if (!Array.isArray(contacts)) {
        console.error('Datos corruptos en localStorage');
        return [];
      }
      
      return contacts;
    } catch (error) {
      console.error('Error al leer contactos:', error);
      throw new StorageError('No se pudieron cargar los contactos');
    }
  },

  // Guardar todos los contactos
  saveAll: (contacts: Contact[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error al guardar contactos:', error);
      throw new StorageError('No se pudieron guardar los contactos');
    }
  },

  // Agregar un contacto
  add: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
    try {
      const contacts = contactStorage.getAll();
      const now = new Date().toISOString();
      
      const newContact: Contact = {
        ...contact,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      
      contacts.push(newContact);
      contactStorage.saveAll(contacts);
      
      return newContact;
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      throw new StorageError('No se pudo agregar el contacto');
    }
  },

  // Actualizar un contacto
  update: (id: string, data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact | null => {
    try {
      const contacts = contactStorage.getAll();
      const index = contacts.findIndex(c => c.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updatedContact: Contact = {
        ...contacts[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      contacts[index] = updatedContact;
      contactStorage.saveAll(contacts);
      
      return updatedContact;
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      throw new StorageError('No se pudo actualizar el contacto');
    }
  },

  // Eliminar un contacto
  delete: (id: string): boolean => {
    try {
      const contacts = contactStorage.getAll();
      const filtered = contacts.filter(c => c.id !== id);
      
      if (filtered.length === contacts.length) {
        return false;
      }
      
      contactStorage.saveAll(filtered);
      return true;
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      throw new StorageError('No se pudo eliminar el contacto');
    }
  },

  // Exportar a JSON
  exportToJSON: (): string => {
    try {
      const contacts = contactStorage.getAll();
      return JSON.stringify(contacts, null, 2);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      throw new StorageError('No se pudieron exportar los contactos');
    }
  },

  // Importar desde JSON
  importFromJSON: (jsonString: string): void => {
    try {
      const contacts = JSON.parse(jsonString);
      
      // Validar estructura
      if (!Array.isArray(contacts)) {
        throw new Error('El archivo no contiene un array de contactos');
      }
      
      // Validar campos requeridos en cada contacto
      const isValid = contacts.every(contact => 
        contact.id &&
        contact.nombre &&
        contact.correo &&
        contact.telefono &&
        contact.createdAt &&
        contact.updatedAt
      );
      
      if (!isValid) {
        throw new Error('Formato de datos inválido');
      }
      
      contactStorage.saveAll(contacts);
    } catch (error) {
      console.error('Error al importar datos:', error);
      if (error instanceof SyntaxError) {
        throw new StorageError('Archivo JSON inválido');
      }
      throw new StorageError('No se pudieron importar los contactos: ' + (error as Error).message);
    }
  },
};
