from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from core.models import (
    User, Tontine, Membership, Contribution, Payment, Payout, AuditLog
)

class Command(BaseCommand):
    help = 'Peuple la base PostgreSQL avec des données de démonstration conformes au cahier des charges'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Début du peuplement de la base de données..."))

        # 1. Création de l'Administrateur Général
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'first_name': 'Moussa',
                'last_name': 'Fall',
                'email': 'admin@tontinepro.sn',
                'phone': '+221770000000',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        self.stdout.write(self.style.SUCCESS("Administrateur créé : admin / admin123"))

        # 2. Création de l'Organisatrice principale
        organizer, _ = User.objects.get_or_create(
            username='fatousow',
            defaults={
                'first_name': 'Fatou',
                'last_name': 'Sow',
                'email': 'fatou.sow@tontinepro.sn',
                'phone': '+221771234567',
                'role': User.Role.ORGANIZER,
            }
        )
        organizer.set_password('passer123')
        organizer.save()
        self.stdout.write(self.style.SUCCESS("Organisatrice créée : fatousow / passer123 (+221771234567)"))

        # 3. Création des Participantes
        participants_data = [
            ('aminata', 'Aminata', 'Diallo', '+221772345678', 'aminata@example.com'),
            ('mariama', 'Mariama', 'Ba', '+221773456789', 'mariama@example.com'),
            ('aissatou', 'Aïssatou', 'Diop', '+221774567890', 'aissatou@example.com'),
            ('khady', 'Khady', 'Ndiaye', '+221775678901', 'khady@example.com'),
            ('oumou', 'Oumou', 'Sy', '+221776789012', 'oumou@example.com'),
            ('coumba', 'Coumba', 'Gueye', '+221777890123', 'coumba@example.com'),
        ]

        participants = []
        for username, first, last, phone, email in participants_data:
            p, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': first,
                    'last_name': last,
                    'email': email,
                    'phone': phone,
                    'role': User.Role.PARTICIPANT,
                }
            )
            p.set_password('passer123')
            p.save()
            participants.append(p)
        self.stdout.write(self.style.SUCCESS(f"{len(participants)} participantes créées."))

        # 4. Création d'une Tontine Rotative active
        today = timezone.now().date()
        start_date = today.replace(day=1)

        tontine, created = Tontine.objects.get_or_create(
            organizer=organizer,
            name="Tontine Diamono Dakar",
            defaults={
                'description': "Tontine d'entraide et d'investissement solidaire - Dakar Plateau",
                'tontine_type': Tontine.TontineType.ROTATIVE,
                'contribution_amount': Decimal('50000'),
                'currency': 'XOF',
                'frequency': Tontine.Frequency.MENSUEL,
                'participant_limit': 6,
                'start_date': start_date,
                'end_date': start_date + timedelta(days=180),
                'payment_day': 5,
                'first_payout_date': start_date + timedelta(days=7),
                'distribution_mode': 'Ordre prédéfini',
                'beneficiary_order': Tontine.BeneficiaryOrder.FIXE,
                'status': Tontine.Status.ACTIVE,
                'rules': "1. Paiement obligatoire avant le 5 du mois.\n2. Versement le 7 du mois.\n3. Pénalité de 2 000 FCFA après 3 jours de retard.",
            }
        )

        # 5. Adhésions (Memberships)
        memberships = []
        for idx, p in enumerate(participants, start=1):
            m, _ = Membership.objects.get_or_create(
                tontine=tontine,
                participant=p,
                defaults={
                    'status': Membership.Status.ACTIF,
                    'position': idx,
                    'accepted_rules_at': timezone.now(),
                }
            )
            memberships.append(m)

        # 6. Tours et versements (Payouts)
        for idx, m in enumerate(memberships, start=1):
            payout_date = start_date + timedelta(days=(idx - 1) * 30 + 7)
            status = Payout.Status.VERSE if idx == 1 else (Payout.Status.COLLECTE_EN_COURS if idx == 2 else Payout.Status.PROGRAMME)
            payout, _ = Payout.objects.get_or_create(
                tontine=tontine,
                round_number=idx,
                defaults={
                    'beneficiary': m,
                    'expected_amount': Decimal('300000'),
                    'actual_amount': Decimal('300000') if idx == 1 else Decimal('0'),
                    'planned_date': payout_date,
                    'status': status,
                    'payment_method': Payout.PaymentMethod.WAVE if idx == 1 else '',
                    'reference': f"WAVE-PAYOUT-TR-{idx:03d}" if idx == 1 else '',
                    'paid_at': timezone.now() - timedelta(days=25) if idx == 1 else None,
                }
            )

        # 7. Cotisations et Paiements pour Période 1 et 2
        for period in [1, 2]:
            due_date = start_date + timedelta(days=(period - 1) * 30 + 5)
            for m in memberships:
                if period == 1:
                    status = Contribution.Status.PAYE
                    paid = Decimal('50000')
                elif period == 2:
                    if m.position in [1, 2]:
                        status = Contribution.Status.PAYE
                        paid = Decimal('50000')
                    elif m.position == 3:
                        status = Contribution.Status.PARTIELLEMENT_PAYE
                        paid = Decimal('30000')
                    elif m.position == 4:
                        status = Contribution.Status.EN_RETARD
                        paid = Decimal('0')
                    else:
                        status = Contribution.Status.EN_ATTENTE
                        paid = Decimal('0')

                contrib, _ = Contribution.objects.get_or_create(
                    tontine=tontine,
                    membership=m,
                    period_number=period,
                    defaults={
                        'expected_amount': Decimal('50000'),
                        'paid_amount': paid,
                        'due_date': due_date,
                        'status': status,
                    }
                )

                if paid > 0:
                    Payment.objects.get_or_create(
                        contribution=contrib,
                        amount=paid,
                        defaults={
                            'payment_method': Payment.PaymentMethod.WAVE if m.position % 2 == 0 else Payment.PaymentMethod.ORANGE_MONEY,
                            'reference': f"TX-{period:02d}-{m.id}-{int(paid)}",
                            'received_at': timezone.now() - timedelta(days=28 if period == 1 else 2),
                            'recorded_by': organizer,
                            'status': Payment.Status.CONFIRME,
                            'comment': f"Cotisation période {period} réglée avec succès",
                        }
                    )

        # 8. Log d'audit initial
        AuditLog.objects.get_or_create(
            user=organizer,
            action="INITIALISATION_TONTINE",
            entity_type="Tontine",
            entity_id=tontine.id,
            defaults={
                'reason': "Création et paramétrage de la Tontine Diamono Dakar",
                'new_values': {"nom": tontine.name, "montant": str(tontine.contribution_amount)},
            }
        )

        self.stdout.write(self.style.SUCCESS("Peuplement terminé avec succès dans PostgreSQL !"))
