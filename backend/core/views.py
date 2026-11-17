"""
Views for Tontine Pro API.
"""
from django.db.models import Sum, Q, Count
from django.utils import timezone
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    User, Tontine, Membership, Contribution, Payment,
    Payout, Notification, AuditLog, Subscription,
)
from .serializers import (
    CustomTokenObtainPairSerializer, UserRegistrationSerializer,
    UserSerializer, UserProfileUpdateSerializer, ChangePasswordSerializer,
    TontineListSerializer, TontineDetailSerializer, TontineCreateUpdateSerializer,
    MembershipSerializer, MembershipCreateSerializer,
    ContributionSerializer, ContributionCreateSerializer,
    PaymentSerializer,
    PayoutSerializer, PayoutCreateSerializer,
    NotificationSerializer,
    AuditLogSerializer,
    SubscriptionSerializer,
    DashboardSerializer,
)
from .permissions import (
    IsAdmin, IsOrganizer, IsOrganizerOrReadOnly,
    IsTontineOrganizer, IsMemberOrOrganizer, IsOwnerOrAdmin,
)


# ─── Auth ────────────────────────────────────────────────────────────────────

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UserProfileUpdateSerializer
        return UserSerializer


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response(
            {'detail': 'Mot de passe mis à jour avec succès.'},
            status=status.HTTP_200_OK,
        )


# ─── User Management (admin only) ───────────────────────────────────────────

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'first_name', 'last_name', 'phone', 'email']


# ─── Tontine ─────────────────────────────────────────────────────────────────

class TontineViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOrganizerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'tontine_type', 'frequency']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'start_date', 'name']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Tontine.objects.all()
        # Organizers see their own; participants see tontines they belong to
        return Tontine.objects.filter(
            Q(organizer=user) |
            Q(memberships__participant=user, memberships__status__in=['actif', 'invite'])
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'list':
            return TontineListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return TontineCreateUpdateSerializer
        return TontineDetailSerializer

    def perform_create(self, serializer):
        tontine = serializer.save(organizer=self.request.user)
        AuditLog.objects.create(
            user=self.request.user,
            action='creation',
            entity_type='Tontine',
            entity_id=tontine.id,
            new_values=serializer.data,
        )

    def perform_update(self, serializer):
        old_data = TontineDetailSerializer(self.get_object()).data
        tontine = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            action='modification',
            entity_type='Tontine',
            entity_id=tontine.id,
            old_values=old_data,
            new_values=serializer.data,
        )

    @action(detail=True, methods=['post'], url_path='activate')
    def activate(self, request, pk=None):
        """Activate a tontine (brouillon → active)."""
        tontine = self.get_object()
        if tontine.status != 'brouillon':
            return Response(
                {'detail': 'Seule une tontine en brouillon peut être activée.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if tontine.memberships.filter(status='actif').count() < 2:
            return Response(
                {'detail': 'Il faut au moins 2 membres actifs pour activer la tontine.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tontine.status = Tontine.Status.ACTIVE
        tontine.save(update_fields=['status'])
        AuditLog.objects.create(
            user=request.user,
            action='activation',
            entity_type='Tontine',
            entity_id=tontine.id,
        )
        return Response({'detail': 'Tontine activée avec succès.'})

    @action(detail=True, methods=['post'], url_path='pause')
    def pause(self, request, pk=None):
        """Pause an active tontine."""
        tontine = self.get_object()
        if tontine.status != 'active':
            return Response(
                {'detail': 'Seule une tontine active peut être mise en pause.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tontine.status = Tontine.Status.EN_PAUSE
        tontine.save(update_fields=['status'])
        return Response({'detail': 'Tontine mise en pause.'})

    @action(detail=True, methods=['post'], url_path='resume')
    def resume(self, request, pk=None):
        """Resume a paused tontine."""
        tontine = self.get_object()
        if tontine.status != 'en_pause':
            return Response(
                {'detail': 'Seule une tontine en pause peut être reprise.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tontine.status = Tontine.Status.ACTIVE
        tontine.save(update_fields=['status'])
        return Response({'detail': 'Tontine reprise.'})

    @action(detail=True, methods=['get'], url_path='stats')
    def stats(self, request, pk=None):
        """Get tontine statistics."""
        tontine = self.get_object()
        contributions = tontine.contributions.all()
        total_expected = contributions.aggregate(t=Sum('expected_amount'))['t'] or 0
        total_paid = contributions.aggregate(t=Sum('paid_amount'))['t'] or 0
        overdue = contributions.filter(status='en_retard').count()
        collection_rate = (
            (float(total_paid) / float(total_expected) * 100)
            if total_expected > 0 else 0
        )

        return Response({
            'tontine_id': tontine.id,
            'name': tontine.name,
            'active_members': tontine.active_members_count,
            'total_expected': total_expected,
            'total_paid': total_paid,
            'collection_rate': round(collection_rate, 1),
            'overdue_contributions': overdue,
            'payouts_completed': tontine.payouts.filter(status='verse').count(),
            'payouts_total': tontine.payouts.count(),
        })


# ─── Membership ──────────────────────────────────────────────────────────────

class MembershipViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tontine', 'status']
    search_fields = ['participant__username', 'participant__first_name', 'participant__phone']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Membership.objects.select_related('participant', 'tontine').all()
        return Membership.objects.select_related('participant', 'tontine').filter(
            Q(tontine__organizer=user) | Q(participant=user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return MembershipCreateSerializer
        return MembershipSerializer

    def perform_create(self, serializer):
        membership = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            action='ajout_membre',
            entity_type='Membership',
            entity_id=membership.id,
            new_values={
                'tontine': membership.tontine_id,
                'participant': membership.participant_id,
            },
        )

    @action(detail=True, methods=['post'], url_path='accept')
    def accept_invitation(self, request, pk=None):
        """Accept a tontine invitation."""
        membership = self.get_object()
        if membership.participant != request.user:
            return Response(
                {'detail': 'Vous ne pouvez accepter que vos propres invitations.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        if membership.status != 'invite':
            return Response(
                {'detail': 'Cette invitation n\'est plus valide.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        membership.status = Membership.Status.ACTIF
        membership.accepted_rules_at = timezone.now()
        membership.save(update_fields=['status', 'accepted_rules_at'])
        return Response({'detail': 'Invitation acceptée. Vous êtes maintenant membre actif.'})

    @action(detail=True, methods=['post'], url_path='suspend')
    def suspend_member(self, request, pk=None):
        """Suspend a member (organizer only)."""
        membership = self.get_object()
        if membership.tontine.organizer != request.user and request.user.role != 'admin':
            return Response(
                {'detail': 'Seul l\'organisateur peut suspendre un membre.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        membership.status = Membership.Status.SUSPENDU
        membership.save(update_fields=['status'])
        return Response({'detail': 'Membre suspendu.'})


# ─── Contribution ────────────────────────────────────────────────────────────

class ContributionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tontine', 'membership', 'status', 'period_number']
    ordering_fields = ['due_date', 'period_number', 'status']

    def get_queryset(self):
        user = self.request.user
        qs = Contribution.objects.select_related(
            'tontine', 'membership__participant'
        )
        if user.role == 'admin':
            return qs.all()
        return qs.filter(
            Q(tontine__organizer=user) | Q(membership__participant=user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return ContributionCreateSerializer
        return ContributionSerializer

    @action(detail=True, methods=['post'], url_path='mark-overdue')
    def mark_overdue(self, request, pk=None):
        """Mark a contribution as overdue."""
        contribution = self.get_object()
        if contribution.tontine.organizer != request.user and request.user.role != 'admin':
            return Response(
                {'detail': 'Seul l\'organisateur peut marquer une cotisation en retard.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        contribution.status = Contribution.Status.EN_RETARD
        contribution.save(update_fields=['status'])
        # Notify the participant
        Notification.objects.create(
            user=contribution.membership.participant,
            tontine=contribution.tontine,
            notification_type=Notification.NotificationType.RETARD,
            channel=Notification.Channel.IN_APP,
            message=(
                f"Votre cotisation pour la période {contribution.period_number} "
                f"de la tontine \"{contribution.tontine.name}\" est en retard."
            ),
        )
        return Response({'detail': 'Cotisation marquée en retard.'})


# ─── Payment ─────────────────────────────────────────────────────────────────

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['contribution', 'status', 'payment_method']
    ordering_fields = ['received_at', 'created_at', 'amount']

    def get_queryset(self):
        user = self.request.user
        qs = Payment.objects.select_related(
            'contribution__tontine',
            'contribution__membership__participant',
            'recorded_by',
        )
        if user.role == 'admin':
            return qs.all()
        return qs.filter(
            Q(contribution__tontine__organizer=user) |
            Q(contribution__membership__participant=user)
        ).distinct()

    def perform_create(self, serializer):
        payment = serializer.save(recorded_by=self.request.user)
        AuditLog.objects.create(
            user=self.request.user,
            action='enregistrement_paiement',
            entity_type='Payment',
            entity_id=payment.id,
            new_values={
                'amount': str(payment.amount),
                'method': payment.payment_method,
                'contribution': payment.contribution_id,
            },
        )

    @action(detail=True, methods=['post'], url_path='confirm')
    def confirm_payment(self, request, pk=None):
        """Confirm a pending payment (organizer only)."""
        payment = self.get_object()
        tontine = payment.contribution.tontine
        if tontine.organizer != request.user and request.user.role != 'admin':
            return Response(
                {'detail': 'Seul l\'organisateur peut confirmer un paiement.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        payment.status = Payment.Status.CONFIRME
        payment.save(update_fields=['status'])
        return Response({'detail': 'Paiement confirmé.'})

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_payment(self, request, pk=None):
        """Cancel a payment."""
        payment = self.get_object()
        tontine = payment.contribution.tontine
        if tontine.organizer != request.user and request.user.role != 'admin':
            return Response(
                {'detail': 'Seul l\'organisateur peut annuler un paiement.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        payment.status = Payment.Status.ANNULE
        payment.save(update_fields=['status'])
        return Response({'detail': 'Paiement annulé.'})


# ─── Payout ──────────────────────────────────────────────────────────────────

class PayoutViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tontine', 'status']
    ordering_fields = ['round_number', 'planned_date']

    def get_queryset(self):
        user = self.request.user
        qs = Payout.objects.select_related(
            'tontine', 'beneficiary__participant'
        )
        if user.role == 'admin':
            return qs.all()
        return qs.filter(
            Q(tontine__organizer=user) |
            Q(beneficiary__participant=user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return PayoutCreateSerializer
        return PayoutSerializer

    @action(detail=True, methods=['post'], url_path='mark-paid')
    def mark_paid(self, request, pk=None):
        """Mark a payout as paid."""
        payout = self.get_object()
        if payout.tontine.organizer != request.user and request.user.role != 'admin':
            return Response(
                {'detail': 'Seul l\'organisateur peut marquer un versement comme payé.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        payout.status = Payout.Status.VERSE
        payout.paid_at = timezone.now()
        payout.actual_amount = payout.expected_amount
        payout.save(update_fields=['status', 'paid_at', 'actual_amount'])

        # Notify the beneficiary
        Notification.objects.create(
            user=payout.beneficiary.participant,
            tontine=payout.tontine,
            notification_type=Notification.NotificationType.VERSEMENT_EFFECTUE,
            channel=Notification.Channel.IN_APP,
            message=(
                f"Votre versement de {payout.actual_amount} XOF pour la tontine "
                f"\"{payout.tontine.name}\" a été effectué."
            ),
        )
        return Response({'detail': 'Versement marqué comme payé.'})


# ─── Notification ────────────────────────────────────────────────────────────

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['notification_type', 'status', 'channel']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        notification.status = Notification.Status.LUE
        notification.save(update_fields=['status'])
        return Response({'detail': 'Notification marquée comme lue.'})

    @action(detail=False, methods=['post'], url_path='read-all')
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        updated = Notification.objects.filter(
            user=request.user,
            status__in=['en_attente', 'envoyee'],
        ).update(status=Notification.Status.LUE)
        return Response({'detail': f'{updated} notification(s) marquée(s) comme lue(s).'})

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """Get count of unread notifications."""
        count = Notification.objects.filter(
            user=request.user,
            status__in=['en_attente', 'envoyee'],
        ).count()
        return Response({'unread_count': count})


# ─── AuditLog ────────────────────────────────────────────────────────────────

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['entity_type', 'action', 'user']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return AuditLog.objects.select_related('user').all()


# ─── Subscription ────────────────────────────────────────────────────────────

class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['plan', 'status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Subscription.objects.all()
        return Subscription.objects.filter(organizer=user)

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


# ─── Dashboard ───────────────────────────────────────────────────────────────

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'admin':
            tontines = Tontine.objects.all()
        elif user.role == 'organizer':
            tontines = Tontine.objects.filter(organizer=user)
        else:
            tontines = Tontine.objects.filter(
                memberships__participant=user,
                memberships__status='actif',
            )

        total_tontines = tontines.count()
        active_tontines = tontines.filter(status='active').count()

        # Contributions stats
        if user.role in ('admin', 'organizer'):
            contributions = Contribution.objects.filter(tontine__in=tontines)
        else:
            contributions = Contribution.objects.filter(
                membership__participant=user,
                tontine__in=tontines,
            )

        total_expected = contributions.aggregate(t=Sum('expected_amount'))['t'] or 0
        total_paid = contributions.aggregate(t=Sum('paid_amount'))['t'] or 0
        overdue = contributions.filter(status='en_retard').count()

        collection_rate = (
            (float(total_paid) / float(total_expected) * 100)
            if total_expected > 0 else 0
        )

        # Upcoming payouts
        upcoming_payouts = Payout.objects.filter(
            tontine__in=tontines,
            status__in=['programme', 'collecte_en_cours', 'pret'],
        ).order_by('planned_date')[:5]

        # Unread notifications
        unread = Notification.objects.filter(
            user=user,
            status__in=['en_attente', 'envoyee'],
        ).count()

        # Total members
        total_members = Membership.objects.filter(
            tontine__in=tontines,
            status='actif',
        ).values('participant').distinct().count()

        data = {
            'total_tontines': total_tontines,
            'active_tontines': active_tontines,
            'total_members': total_members,
            'total_contributions_expected': total_expected,
            'total_contributions_paid': total_paid,
            'collection_rate': round(collection_rate, 1),
            'upcoming_payouts': PayoutSerializer(upcoming_payouts, many=True).data,
            'overdue_contributions': overdue,
            'unread_notifications': unread,
        }
        return Response(data)
