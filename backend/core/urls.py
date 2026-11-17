"""
URL configuration for Tontine Pro API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView, RegisterView, ProfileView, ChangePasswordView,
    UserViewSet, TontineViewSet, MembershipViewSet,
    ContributionViewSet, PaymentViewSet, PayoutViewSet,
    NotificationViewSet, AuditLogViewSet, SubscriptionViewSet,
    DashboardView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'tontines', TontineViewSet, basename='tontine')
router.register(r'memberships', MembershipViewSet, basename='membership')
router.register(r'contributions', ContributionViewSet, basename='contribution')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'payouts', PayoutViewSet, basename='payout')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'audit-logs', AuditLogViewSet, basename='auditlog')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # Router URLs
    path('', include(router.urls)),
]
