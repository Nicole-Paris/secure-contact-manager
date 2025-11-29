import { z } from 'zod';

// Regex ancladas para validación segura
const NOMBRE_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const TELEFONO_REGEX = /^\d{7,15}$/;

export const contactSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, { message: "El nombre es obligatorio" })
    .max(80, { message: "El nombre debe tener máximo 80 caracteres" })
    .regex(NOMBRE_REGEX, { 
      message: "El nombre solo puede contener letras, espacios y acentos" 
    }),
  
  correo: z
    .string()
    .trim()
    .min(1, { message: "El correo es obligatorio" })
    .max(120, { message: "El correo debe tener máximo 120 caracteres" })
    .regex(EMAIL_REGEX, { 
      message: "Formato de correo inválido" 
    }),
  
  telefono: z
    .string()
    .trim()
    .min(1, { message: "El teléfono es obligatorio" })
    .regex(TELEFONO_REGEX, { 
      message: "El teléfono debe contener entre 7 y 15 dígitos" 
    }),
});

export type ContactFormSchema = z.infer<typeof contactSchema>;

// Casos de prueba documentados
export const validationTestCases = {
  nombre: {
    validos: [
      "Juan Pérez",
      "María José García",
      "José",
      "Ana María Rodríguez López",
    ],
    invalidos: [
      "", // Vacío
      "Juan123", // Contiene números
      "A".repeat(81), // Excede 80 caracteres
      "Juan@Perez", // Caracteres especiales no permitidos
    ]
  },
  correo: {
    validos: [
      "usuario@ejemplo.com",
      "test.user@empresa.co",
      "admin@dominio.org",
      "contacto_2024@email.es",
    ],
    invalidos: [
      "", // Vacío
      "usuario", // Sin @
      "@ejemplo.com", // Sin parte local
      "usuario@", // Sin dominio
      "a".repeat(110) + "@email.com", // Excede 120 caracteres
    ]
  },
  telefono: {
    validos: [
      "1234567", // 7 dígitos
      "123456789", // 9 dígitos
      "1234567890", // 10 dígitos
      "123456789012345", // 15 dígitos
    ],
    invalidos: [
      "", // Vacío
      "123456", // Menos de 7 dígitos
      "1234567890123456", // Más de 15 dígitos
      "12-345-678", // Contiene guiones
      "+1234567890", // Contiene símbolos
    ]
  }
};
