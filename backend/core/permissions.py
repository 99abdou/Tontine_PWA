"""
Permissions for Tontine Pro.
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsOrganizer(permissions.BasePermission):
    """Allow access only to organizer users."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('admin', 'organizer')
        )


class IsOrganizerOrReadOnly(permissions.BasePermission):
    """Allow write access only to organizers; read-only for others."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('admin', 'organizer')
        )


class IsTontineOrganizer(permissions.BasePermission):
    """Object-level: allow only the organizer of a tontine to modify it."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # obj might be the tontine itself or have a tontine FK
        tontine = getattr(obj, 'tontine', obj)
        organizer = getattr(tontine, 'organizer', None)
        return organizer == request.user or request.user.role == 'admin'


class IsMemberOrOrganizer(permissions.BasePermission):
    """Allow access to tontine members and the organizer."""
    def has_object_permission(self, request, view, obj):
        tontine = getattr(obj, 'tontine', obj)
        if hasattr(tontine, 'organizer') and tontine.organizer == request.user:
            return True
        if request.user.role == 'admin':
            return True
        return tontine.memberships.filter(
            participant=request.user,
            status__in=['actif', 'invite']
        ).exists()


class IsOwnerOrAdmin(permissions.BasePermission):
    """Object-level: only the owner or admin can access."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        # Check common owner field names
        owner = getattr(obj, 'user', None) or getattr(obj, 'organizer', None)
        return owner == request.user
