from django.contrib import admin
from .models import Contact, Interaction, Opportunity


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'preferred_channel')
    search_fields = ('first_name', 'last_name', 'email', 'phone')


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'contact', 'stage', 'estimated_value', 'next_follow_up')
    list_filter = ('stage', 'source')
    search_fields = ('title', 'product_name', 'contact__first_name', 'contact__last_name')


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ('opportunity', 'channel', 'occurred_at', 'created_by')
    list_filter = ('channel',)
