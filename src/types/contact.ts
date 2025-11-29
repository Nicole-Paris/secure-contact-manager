export interface Contact {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactFormData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
