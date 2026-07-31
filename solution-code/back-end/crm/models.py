from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Contact(models.Model):
    CHANNEL_CHOICES = [
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
        ('instagram', 'Instagram'),
        ('email', 'Email'),
        ('in_person', 'In person'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30)
    preferred_channel = models.CharField(
        max_length=20,
        choices=CHANNEL_CHOICES,
        default='whatsapp',
    )
    instagram_handle = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Opportunity(models.Model):
    STAGE_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal', 'Proposal'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    SOURCE_CHOICES = [
        ('store', 'Store'),
        ('website', 'Website'),
        ('instagram', 'Instagram'),
        ('whatsapp', 'WhatsApp'),
        ('referral', 'Referral'),
        ('other', 'Other'),
    ]

    contact = models.ForeignKey(
        Contact,
        on_delete=models.CASCADE,
        related_name='opportunities',
    )
    title = models.CharField(max_length=150)
    product_name = models.CharField(max_length=150)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    stage = models.CharField(
        max_length=20,
        choices=STAGE_CHOICES,
        default='new',
    )
    estimated_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    next_follow_up = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='opportunities',
        null=True,
        blank=True,
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title


class Interaction(models.Model):
    CHANNEL_CHOICES = [
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
        ('instagram', 'Instagram'),
        ('email', 'Email'),
        ('in_person', 'In person'),
        ('note', 'Internal note'),
    ]

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='interactions',
    )
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    summary = models.TextField()
    occurred_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='interactions',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-occurred_at']

    def __str__(self):
        return f'{self.get_channel_display()}: {self.opportunity.title}'
