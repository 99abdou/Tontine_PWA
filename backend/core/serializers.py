"""
Serializers for Tontine Pro API.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

from .models import (
    User, Tontine, Membership, Contribution, Payment,
    Payout, Notification, AuditLog, Subscription,
)


# ─── Auth / User ─────────────────────────────────────────────────────────────

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Add custom claims to JWT tokens."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['phone'] = user.phone
        token['full_name'] = user.get_full_name()
        return token


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'first_name', 'last_name',
            'password', 'password_confirm', 'role',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError(
                {'password_confirm': 'Les mots de passe ne correspondent pas.'}
            )
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'first_name', 'last_name',
            'full_name', 'role', 'avatar', 'is_active', 'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'avatar']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Mot de passe actuel incorrect.')
        return value


# ─── Tontine ─────────────────────────────────────────────────────────────────

class TontineListSerializer(serializers.ModelSerializer):
    organizer_name = serializers.SerializerMethodField()
    active_members_count = serializers.ReadOnlyField()
    total_expected = serializers.ReadOnlyField()

    class Meta:
        model = Tontine
        fields = [
            'id', 'name', 'tontine_type', 'contribution_amount', 'currency',
            'frequency', 'participant_limit', 'start_date', 'status',
            'organizer', 'organizer_name', 'active_members_count',
            'total_expected', 'created_at',
        ]

    def get_organizer_name(self, obj):
        return obj.organizer.get_full_name() or obj.organizer.username


class TontineDetailSerializer(serializers.ModelSerializer):
    organizer_name = serializers.SerializerMethodField()
    active_members_count = serializers.ReadOnlyField()
    total_expected = serializers.ReadOnlyField()
    memberships = serializers.SerializerMethodField()

    class Meta:
        model = Tontine
        fields = [
            'id', 'organizer', 'organizer_name', 'name', 'description',
            'tontine_type', 'contribution_amount', 'currency', 'frequency',
            'participant_limit', 'start_date', 'end_date', 'payment_day',
            'first_payout_date', 'distribution_mode', 'beneficiary_order',
            'status', 'rules', 'active_members_count', 'total_expected',
            'memberships', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'organizer', 'created_at', 'updated_at']

    def get_organizer_name(self, obj):
        return obj.organizer.get_full_name() or obj.organizer.username

    def get_memberships(self, obj):
        memberships = obj.memberships.select_related('participant').all()
        return MembershipSerializer(memberships, many=True).data


class TontineCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tontine
        fields = [
            'id', 'name', 'description', 'tontine_type', 'contribution_amount',
            'currency', 'frequency', 'participant_limit', 'start_date',
            'end_date', 'payment_day', 'first_payout_date', 'distribution_mode',
            'beneficiary_order', 'status', 'rules',
        ]
        read_only_fields = ['id']

    def validate_contribution_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'Le montant de la cotisation doit être supérieur à 0.'
            )
        return value

    def validate(self, attrs):
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and end <= start:
            raise serializers.ValidationError(
                {'end_date': 'La date de fin doit être après la date de début.'}
            )
        return attrs


# ─── Membership ──────────────────────────────────────────────────────────────

class MembershipSerializer(serializers.ModelSerializer):
    participant_name = serializers.SerializerMethodField()
    participant_phone = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = [
            'id', 'tontine', 'participant', 'participant_name',
            'participant_phone', 'status', 'joined_at', 'position',
            'accepted_rules_at',
        ]
        read_only_fields = ['id', 'joined_at']

    def get_participant_name(self, obj):
        return obj.participant.get_full_name() or obj.participant.username

    def get_participant_phone(self, obj):
        return obj.participant.phone


class MembershipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ['id', 'tontine', 'participant', 'position']
        read_only_fields = ['id']

    def validate(self, attrs):
        tontine = attrs['tontine']
        # Check participant limit
        active_count = tontine.memberships.filter(
            status__in=['actif', 'invite']
        ).count()
        if active_count >= tontine.participant_limit:
            raise serializers.ValidationError(
                'Le nombre maximum de participants est atteint.'
            )
        return attrs


# ─── Contribution ────────────────────────────────────────────────────────────

class ContributionSerializer(serializers.ModelSerializer):
    participant_name = serializers.SerializerMethodField()
    remaining_amount = serializers.ReadOnlyField()
    payments = serializers.SerializerMethodField()

    class Meta:
        model = Contribution
        fields = [
            'id', 'tontine', 'membership', 'participant_name',
            'period_number', 'expected_amount', 'paid_amount',
            'remaining_amount', 'due_date', 'status', 'payments',
            'created_at',
        ]
        read_only_fields = ['id', 'paid_amount', 'created_at']

    def get_participant_name(self, obj):
        return (
            obj.membership.participant.get_full_name()
            or obj.membership.participant.username
        )

    def get_payments(self, obj):
        payments = obj.payments.all()
        return PaymentSerializer(payments, many=True).data


class ContributionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = [
            'id', 'tontine', 'membership', 'period_number',
            'expected_amount', 'due_date',
        ]
        read_only_fields = ['id']


# ─── Payment ─────────────────────────────────────────────────────────────────

class PaymentSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'contribution', 'amount', 'payment_method', 'reference',
            'proof', 'received_at', 'recorded_by', 'recorded_by_name',
            'comment', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'recorded_by', 'created_at']

    def get_recorded_by_name(self, obj):
        if obj.recorded_by:
            return obj.recorded_by.get_full_name() or obj.recorded_by.username
        return None

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Le montant doit être supérieur à 0.')
        return value


# ─── Payout ──────────────────────────────────────────────────────────────────

class PayoutSerializer(serializers.ModelSerializer):
    beneficiary_name = serializers.SerializerMethodField()

    class Meta:
        model = Payout
        fields = [
            'id', 'tontine', 'beneficiary', 'beneficiary_name',
            'round_number', 'expected_amount', 'actual_amount',
            'planned_date', 'paid_at', 'payment_method', 'reference',
            'proof', 'status',
        ]
        read_only_fields = ['id']

    def get_beneficiary_name(self, obj):
        return (
            obj.beneficiary.participant.get_full_name()
            or obj.beneficiary.participant.username
        )


class PayoutCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = [
            'id', 'tontine', 'beneficiary', 'round_number',
            'expected_amount', 'planned_date',
        ]
        read_only_fields = ['id']


# ─── Notification ────────────────────────────────────────────────────────────

class NotificationSerializer(serializers.ModelSerializer):
    tontine_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'tontine', 'tontine_name', 'notification_type',
            'channel', 'message', 'status', 'sent_at', 'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def get_tontine_name(self, obj):
        return obj.tontine.name if obj.tontine else None


# ─── AuditLog ────────────────────────────────────────────────────────────────

class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_name', 'action', 'entity_type',
            'entity_id', 'old_values', 'new_values', 'reason', 'created_at',
        ]
        read_only_fields = '__all__'

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return None


# ─── Subscription ────────────────────────────────────────────────────────────

class SubscriptionSerializer(serializers.ModelSerializer):
    organizer_name = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            'id', 'organizer', 'organizer_name', 'plan',
            'start_date', 'end_date', 'status',
        ]
        read_only_fields = ['id', 'organizer']

    def get_organizer_name(self, obj):
        return obj.organizer.get_full_name() or obj.organizer.username


# ─── Dashboard ───────────────────────────────────────────────────────────────

class DashboardSerializer(serializers.Serializer):
    """Read-only dashboard summary."""
    total_tontines = serializers.IntegerField()
    active_tontines = serializers.IntegerField()
    total_members = serializers.IntegerField()
    total_contributions_expected = serializers.DecimalField(max_digits=15, decimal_places=0)
    total_contributions_paid = serializers.DecimalField(max_digits=15, decimal_places=0)
    collection_rate = serializers.FloatField()
    upcoming_payouts = PayoutSerializer(many=True)
    overdue_contributions = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
