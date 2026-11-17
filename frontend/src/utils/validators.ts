import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(9, 'Le numéro de téléphone doit contenir au moins 9 chiffres')
    .regex(/^[0-9+\s]+$/, 'Numéro de téléphone invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(2, 'Le prénom est requis'),
    last_name: z.string().min(2, 'Le nom est requis'),
    phone: z
      .string()
      .min(9, 'Le numéro de téléphone doit contenir au moins 9 chiffres')
      .regex(/^[0-9+\s]+$/, 'Numéro de téléphone invalide'),
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirm'],
  });

export const tontineStep1Schema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  tontine_type: z.enum(['rotative', 'epargne', 'personnalisee'], {
    required_error: 'Veuillez choisir un type de tontine',
  }),
});

export const tontineStep2Schema = z.object({
  contribution_amount: z.number().min(1000, 'Le montant minimum est 1.000 FCFA'),
  currency: z.string().default('XOF'),
  frequency: z.enum(['hebdomadaire', 'bimensuel', 'mensuel'], {
    required_error: 'Veuillez choisir une fréquence',
  }),
});

export const tontineStep3Schema = z.object({
  participant_limit: z.number().min(2, 'Minimum 2 participantes').max(100, 'Maximum 100 participantes'),
  start_date: z.string().min(1, 'La date de début est requise'),
  payment_day: z.number().min(1).max(31),
  beneficiary_order: z.enum(['fixe', 'aleatoire', 'manuel']),
});

export const tontineStep4Schema = z.object({
  rules: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(1, 'Le montant est requis'),
  payment_method: z.enum(['wave', 'orange_money', 'free_money', 'especes', 'virement', 'autre'], {
    required_error: 'Veuillez choisir un moyen de paiement',
  }),
  reference: z.string().optional(),
  received_at: z.string().min(1, 'La date est requise'),
  comment: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TontineStep1Input = z.infer<typeof tontineStep1Schema>;
export type TontineStep2Input = z.infer<typeof tontineStep2Schema>;
export type TontineStep3Input = z.infer<typeof tontineStep3Schema>;
export type TontineStep4Input = z.infer<typeof tontineStep4Schema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
