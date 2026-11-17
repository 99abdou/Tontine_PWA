"""
Admin configuration for Tontine Pro.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    User, Tontine, Membership, Contribution, Payment,
    Payout, Notification, AuditLog, Subscription,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'phone', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'first_name', 'last_name', 'phone', 'email']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Tontine Pro', {'fields': ('phone', 'role', 'avatar')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Tontine Pro', {'fields': ('phone', 'role')}),
    )


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0
    readonly_fields = ['joined_at']


class PayoutInline(admin.TabularInline):
    model = Payout
    extra = 0


@admin.register(Tontine)
class TontineAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'organizer', 'tontine_type', 'contribution_amount',
        'frequency', 'status', 'start_date', 'created_at',
    ]
    list_filter = ['status', 'tontine_type', 'frequency', 'currency']
    search_fields = ['name', 'description', 'organizer__username']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MembershipInline, PayoutInline]


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['participant', 'tontine', 'status', 'position', 'joined_at']
    list_filter = ['status']
    search_fields = ['participant__username', 'participant__phone', 'tontine__name']
    readonly_fields = ['joined_at']


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = [
        'membership', 'tontine', 'period_number', 'expected_amount',
        'paid_amount', 'status', 'due_date',
    ]
    list_filter = ['status', 'tontine']
    search_fields = ['membership__participant__username', 'tontine__name']
    readonly_fields = ['created_at']
    inlines = [PaymentInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'contribution', 'amount', 'payment_method', 'status',
        'received_at', 'recorded_by',
    ]
    list_filter = ['status', 'payment_method']
    search_fields = ['reference', 'contribution__membership__participant__username']
    readonly_fields = ['created_at']


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = [
        'tontine', 'beneficiary', 'round_number', 'expected_amount',
        'actual_amount', 'status', 'planned_date',
    ]
    list_filter = ['status']
    search_fields = ['tontine__name', 'beneficiary__participant__username']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'notification_type', 'channel', 'status',
        'sent_at', 'created_at',
    ]
    list_filter = ['notification_type', 'channel', 'status']
    search_fields = ['user__username', 'message']
    readonly_fields = ['created_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'entity_type', 'entity_id', 'created_at']
    list_filter = ['entity_type', 'action']
    search_fields = ['user__username', 'reason']
    readonly_fields = ['created_at', 'old_values', 'new_values']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['organizer', 'plan', 'status', 'start_date', 'end_date']
    list_filter = ['plan', 'status']
    search_fields = ['organizer__username']
