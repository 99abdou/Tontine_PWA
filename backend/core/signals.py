"""
Signals for Tontine Pro.
"""
from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Payment, Contribution, Membership, Notification, AuditLog


@receiver(post_save, sender=Payment)
def update_contribution_on_payment(sender, instance, created, **kwargs):
    """When a confirmed payment is saved, update the contribution's paid_amount and status."""
    if instance.status != 'confirme':
        return

    contribution = instance.contribution
    # Recalculate total paid from all confirmed payments
    total_paid = contribution.payments.filter(
        status='confirme'
    ).aggregate(
        total=models.Sum('amount')
    )['total'] or 0

    contribution.paid_amount = total_paid

    if total_paid >= contribution.expected_amount:
        contribution.status = Contribution.Status.PAYE
    elif total_paid > 0:
        contribution.status = Contribution.Status.PARTIELLEMENT_PAYE
    else:
        contribution.status = Contribution.Status.EN_ATTENTE

    contribution.save(update_fields=['paid_amount', 'status'])


@receiver(post_save, sender=Membership)
def notify_member_on_invite(sender, instance, created, **kwargs):
    """Create an in-app notification when a member is invited."""
    if created and instance.status == Membership.Status.INVITE:
        Notification.objects.create(
            user=instance.participant,
            tontine=instance.tontine,
            notification_type=Notification.NotificationType.INVITATION,
            channel=Notification.Channel.IN_APP,
            message=(
                f"Vous avez été invité(e) à rejoindre la tontine "
                f"\"{instance.tontine.name}\" organisée par "
                f"{instance.tontine.organizer.get_full_name() or instance.tontine.organizer.username}."
            ),
        )


@receiver(post_save, sender=Payment)
def notify_on_payment_confirmation(sender, instance, created, **kwargs):
    """Notify the participant when their payment is confirmed."""
    if instance.status == 'confirme':
        participant = instance.contribution.membership.participant
        Notification.objects.create(
            user=participant,
            tontine=instance.contribution.tontine,
            notification_type=Notification.NotificationType.CONFIRMATION_PAIEMENT,
            channel=Notification.Channel.IN_APP,
            message=(
                f"Votre paiement de {instance.amount} XOF pour la tontine "
                f"\"{instance.contribution.tontine.name}\" a été confirmé."
            ),
        )


# Import models at module level for the Sum aggregation
from django.db import models as models
