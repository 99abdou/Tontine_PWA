"""
Core models for Tontine Pro.
All money fields use DecimalField(max_digits=12, decimal_places=0) for CFA franc (no decimals).
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


# ─── User ────────────────────────────────────────────────────────────────────

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Administrateur'
        ORGANIZER = 'organizer', 'Organisateur'
        PARTICIPANT = 'participant', 'Participant'

    phone = models.CharField(
        max_length=20, unique=True, verbose_name='Téléphone',
        help_text='Numéro au format international, ex: +221771234567'
    )
    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.PARTICIPANT,
        verbose_name='Rôle'
    )
    avatar = models.ImageField(
        upload_to='avatars/', null=True, blank=True, verbose_name='Photo de profil'
    )

    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.phone})"


# ─── Tontine ─────────────────────────────────────────────────────────────────

class Tontine(models.Model):
    class TontineType(models.TextChoices):
        ROTATIVE = 'rotative', 'Rotative'
        EPARGNE = 'epargne', 'Épargne'
        PERSONNALISEE = 'personnalisee', 'Personnalisée'

    class Frequency(models.TextChoices):
        HEBDOMADAIRE = 'hebdomadaire', 'Hebdomadaire'
        BIMENSUEL = 'bimensuel', 'Bimensuel'
        MENSUEL = 'mensuel', 'Mensuel'

    class BeneficiaryOrder(models.TextChoices):
        FIXE = 'fixe', 'Fixe'
        ALEATOIRE = 'aleatoire', 'Aléatoire'
        MANUEL = 'manuel', 'Manuel'

    class Status(models.TextChoices):
        BROUILLON = 'brouillon', 'Brouillon'
        ACTIVE = 'active', 'Active'
        EN_PAUSE = 'en_pause', 'En pause'
        TERMINEE = 'terminee', 'Terminée'
        ANNULEE = 'annulee', 'Annulée'

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='organized_tontines', verbose_name='Organisateur'
    )
    name = models.CharField(max_length=200, verbose_name='Nom')
    description = models.TextField(blank=True, default='', verbose_name='Description')
    tontine_type = models.CharField(
        max_length=20, choices=TontineType.choices, default=TontineType.ROTATIVE,
        verbose_name='Type de tontine'
    )
    contribution_amount = models.DecimalField(
        max_digits=12, decimal_places=0, validators=[MinValueValidator(0)],
        verbose_name='Montant de la cotisation'
    )
    currency = models.CharField(max_length=3, default='XOF', verbose_name='Devise')
    frequency = models.CharField(
        max_length=20, choices=Frequency.choices, default=Frequency.MENSUEL,
        verbose_name='Fréquence'
    )
    participant_limit = models.PositiveIntegerField(
        default=10, verbose_name='Nombre maximum de participants'
    )
    start_date = models.DateField(verbose_name='Date de début')
    end_date = models.DateField(null=True, blank=True, verbose_name='Date de fin')
    payment_day = models.PositiveSmallIntegerField(
        default=1, verbose_name='Jour de paiement',
        help_text='Jour du mois/semaine pour le paiement'
    )
    first_payout_date = models.DateField(
        null=True, blank=True, verbose_name='Date du premier versement'
    )
    distribution_mode = models.CharField(
        max_length=50, blank=True, default='', verbose_name='Mode de distribution'
    )
    beneficiary_order = models.CharField(
        max_length=20, choices=BeneficiaryOrder.choices, default=BeneficiaryOrder.FIXE,
        verbose_name='Ordre des bénéficiaires'
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.BROUILLON,
        verbose_name='Statut'
    )
    rules = models.TextField(blank=True, default='', verbose_name='Règlement intérieur')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Dernière modification')

    class Meta:
        verbose_name = 'Tontine'
        verbose_name_plural = 'Tontines'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

    @property
    def active_members_count(self):
        return self.memberships.filter(status=Membership.Status.ACTIF).count()

    @property
    def total_expected(self):
        return self.contribution_amount * self.active_members_count


# ─── Membership ──────────────────────────────────────────────────────────────

class Membership(models.Model):
    class Status(models.TextChoices):
        INVITE = 'invite', 'Invité'
        ACTIF = 'actif', 'Actif'
        SUSPENDU = 'suspendu', 'Suspendu'
        ARCHIVE = 'archive', 'Archivé'

    tontine = models.ForeignKey(
        Tontine, on_delete=models.CASCADE, related_name='memberships',
        verbose_name='Tontine'
    )
    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='memberships', verbose_name='Participant'
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.INVITE,
        verbose_name='Statut'
    )
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'adhésion')
    position = models.PositiveIntegerField(
        default=0, verbose_name='Position dans le tour'
    )
    accepted_rules_at = models.DateTimeField(
        null=True, blank=True, verbose_name='Règlement accepté le'
    )

    class Meta:
        verbose_name = 'Adhésion'
        verbose_name_plural = 'Adhésions'
        unique_together = ('tontine', 'participant')
        ordering = ['position']

    def __str__(self):
        return f"{self.participant} → {self.tontine.name} (#{self.position})"


# ─── Contribution ────────────────────────────────────────────────────────────

class Contribution(models.Model):
    class Status(models.TextChoices):
        A_VENIR = 'a_venir', 'À venir'
        EN_ATTENTE = 'en_attente', 'En attente'
        PARTIELLEMENT_PAYE = 'partiellement_paye', 'Partiellement payé'
        PAYE = 'paye', 'Payé'
        EN_RETARD = 'en_retard', 'En retard'
        ANNULE = 'annule', 'Annulé'
        LITIGE = 'litige', 'Litige'

    tontine = models.ForeignKey(
        Tontine, on_delete=models.CASCADE, related_name='contributions',
        verbose_name='Tontine'
    )
    membership = models.ForeignKey(
        Membership, on_delete=models.CASCADE, related_name='contributions',
        verbose_name='Adhésion'
    )
    period_number = models.PositiveIntegerField(verbose_name='Numéro de période')
    expected_amount = models.DecimalField(
        max_digits=12, decimal_places=0, validators=[MinValueValidator(0)],
        verbose_name='Montant attendu'
    )
    paid_amount = models.DecimalField(
        max_digits=12, decimal_places=0, default=0,
        verbose_name='Montant payé'
    )
    due_date = models.DateField(verbose_name='Date d\'échéance')
    status = models.CharField(
        max_length=25, choices=Status.choices, default=Status.A_VENIR,
        verbose_name='Statut'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')

    class Meta:
        verbose_name = 'Cotisation'
        verbose_name_plural = 'Cotisations'
        unique_together = ('membership', 'period_number')
        ordering = ['period_number', 'membership__position']

    def __str__(self):
        return (
            f"Cotisation P{self.period_number} - "
            f"{self.membership.participant} ({self.get_status_display()})"
        )

    @property
    def remaining_amount(self):
        return self.expected_amount - self.paid_amount


# ─── Payment ─────────────────────────────────────────────────────────────────

class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        WAVE = 'wave', 'Wave'
        ORANGE_MONEY = 'orange_money', 'Orange Money'
        FREE_MONEY = 'free_money', 'Free Money'
        ESPECES = 'especes', 'Espèces'
        VIREMENT = 'virement', 'Virement bancaire'
        AUTRE = 'autre', 'Autre'

    class Status(models.TextChoices):
        EN_ATTENTE = 'en_attente', 'En attente'
        CONFIRME = 'confirme', 'Confirmé'
        ANNULE = 'annule', 'Annulé'

    contribution = models.ForeignKey(
        Contribution, on_delete=models.CASCADE, related_name='payments',
        verbose_name='Cotisation'
    )
    amount = models.DecimalField(
        max_digits=12, decimal_places=0, validators=[MinValueValidator(1)],
        verbose_name='Montant'
    )
    payment_method = models.CharField(
        max_length=20, choices=PaymentMethod.choices,
        verbose_name='Méthode de paiement'
    )
    reference = models.CharField(
        max_length=100, blank=True, default='',
        verbose_name='Référence de transaction'
    )
    proof = models.FileField(
        upload_to='proofs/%Y/%m/', null=True, blank=True,
        verbose_name='Preuve de paiement'
    )
    received_at = models.DateTimeField(verbose_name='Reçu le')
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='recorded_payments',
        verbose_name='Enregistré par'
    )
    comment = models.TextField(blank=True, default='', verbose_name='Commentaire')
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.EN_ATTENTE,
        verbose_name='Statut'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')

    class Meta:
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'
        ordering = ['-received_at']

    def __str__(self):
        return f"Paiement {self.amount} XOF via {self.get_payment_method_display()}"


# ─── Payout ──────────────────────────────────────────────────────────────────

class Payout(models.Model):
    class PaymentMethod(models.TextChoices):
        WAVE = 'wave', 'Wave'
        ORANGE_MONEY = 'orange_money', 'Orange Money'
        FREE_MONEY = 'free_money', 'Free Money'
        ESPECES = 'especes', 'Espèces'
        VIREMENT = 'virement', 'Virement bancaire'
        AUTRE = 'autre', 'Autre'

    class Status(models.TextChoices):
        PROGRAMME = 'programme', 'Programmé'
        COLLECTE_EN_COURS = 'collecte_en_cours', 'Collecte en cours'
        PRET = 'pret', 'Prêt'
        VERSE = 'verse', 'Versé'
        EN_RETARD = 'en_retard', 'En retard'
        SUSPENDU = 'suspendu', 'Suspendu'

    tontine = models.ForeignKey(
        Tontine, on_delete=models.CASCADE, related_name='payouts',
        verbose_name='Tontine'
    )
    beneficiary = models.ForeignKey(
        Membership, on_delete=models.CASCADE, related_name='payouts',
        verbose_name='Bénéficiaire'
    )
    round_number = models.PositiveIntegerField(verbose_name='Numéro du tour')
    expected_amount = models.DecimalField(
        max_digits=12, decimal_places=0, validators=[MinValueValidator(0)],
        verbose_name='Montant attendu'
    )
    actual_amount = models.DecimalField(
        max_digits=12, decimal_places=0, default=0,
        verbose_name='Montant réel versé'
    )
    planned_date = models.DateField(verbose_name='Date prévue')
    paid_at = models.DateTimeField(null=True, blank=True, verbose_name='Versé le')
    payment_method = models.CharField(
        max_length=20, choices=PaymentMethod.choices, blank=True, default='',
        verbose_name='Méthode de paiement'
    )
    reference = models.CharField(
        max_length=100, blank=True, default='',
        verbose_name='Référence de transaction'
    )
    proof = models.FileField(
        upload_to='receipts/%Y/%m/', null=True, blank=True,
        verbose_name='Preuve de versement'
    )
    status = models.CharField(
        max_length=25, choices=Status.choices, default=Status.PROGRAMME,
        verbose_name='Statut'
    )

    class Meta:
        verbose_name = 'Versement'
        verbose_name_plural = 'Versements'
        ordering = ['round_number']

    def __str__(self):
        return (
            f"Versement #{self.round_number} → "
            f"{self.beneficiary.participant} ({self.get_status_display()})"
        )


# ─── Notification ────────────────────────────────────────────────────────────

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        RAPPEL_COTISATION = 'rappel_cotisation', 'Rappel de cotisation'
        CONFIRMATION_PAIEMENT = 'confirmation_paiement', 'Confirmation de paiement'
        VERSEMENT_PROGRAMME = 'versement_programme', 'Versement programmé'
        VERSEMENT_EFFECTUE = 'versement_effectue', 'Versement effectué'
        INVITATION = 'invitation', 'Invitation'
        RETARD = 'retard', 'Retard de paiement'
        ALERTE_SYSTEME = 'alerte_systeme', 'Alerte système'
        CHANGEMENT_STATUT = 'changement_statut', 'Changement de statut'

    class Channel(models.TextChoices):
        WHATSAPP = 'whatsapp', 'WhatsApp'
        EMAIL = 'email', 'Email'
        IN_APP = 'in_app', 'In-App'

    class Status(models.TextChoices):
        EN_ATTENTE = 'en_attente', 'En attente'
        ENVOYEE = 'envoyee', 'Envoyée'
        ECHOUEE = 'echouee', 'Échouée'
        LUE = 'lue', 'Lue'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='notifications', verbose_name='Utilisateur'
    )
    tontine = models.ForeignKey(
        Tontine, on_delete=models.CASCADE, null=True, blank=True,
        related_name='notifications', verbose_name='Tontine'
    )
    notification_type = models.CharField(
        max_length=30, choices=NotificationType.choices,
        verbose_name='Type de notification'
    )
    channel = models.CharField(
        max_length=10, choices=Channel.choices, default=Channel.IN_APP,
        verbose_name='Canal'
    )
    message = models.TextField(verbose_name='Message')
    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.EN_ATTENTE,
        verbose_name='Statut'
    )
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name='Envoyée le')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_notification_type_display()} → {self.user}"


# ─── AuditLog ────────────────────────────────────────────────────────────────

class AuditLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='audit_logs', verbose_name='Utilisateur'
    )
    action = models.CharField(max_length=50, verbose_name='Action')
    entity_type = models.CharField(max_length=50, verbose_name='Type d\'entité')
    entity_id = models.PositiveIntegerField(verbose_name='ID de l\'entité')
    old_values = models.JSONField(null=True, blank=True, verbose_name='Anciennes valeurs')
    new_values = models.JSONField(null=True, blank=True, verbose_name='Nouvelles valeurs')
    reason = models.TextField(blank=True, default='', verbose_name='Raison')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date')

    class Meta:
        verbose_name = 'Journal d\'audit'
        verbose_name_plural = 'Journaux d\'audit'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} sur {self.entity_type}#{self.entity_id} par {self.user}"


# ─── Subscription ────────────────────────────────────────────────────────────

class Subscription(models.Model):
    class Plan(models.TextChoices):
        GRATUIT = 'gratuit', 'Gratuit'
        STANDARD = 'standard', 'Standard'
        PREMIUM = 'premium', 'Premium'

    class Status(models.TextChoices):
        ACTIF = 'actif', 'Actif'
        EXPIRE = 'expire', 'Expiré'
        ANNULE = 'annule', 'Annulé'

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='subscriptions', verbose_name='Organisateur'
    )
    plan = models.CharField(
        max_length=20, choices=Plan.choices, default=Plan.GRATUIT,
        verbose_name='Plan'
    )
    start_date = models.DateField(verbose_name='Date de début')
    end_date = models.DateField(null=True, blank=True, verbose_name='Date de fin')
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.ACTIF,
        verbose_name='Statut'
    )

    class Meta:
        verbose_name = 'Abonnement'
        verbose_name_plural = 'Abonnements'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.organizer} - {self.get_plan_display()} ({self.get_status_display()})"
