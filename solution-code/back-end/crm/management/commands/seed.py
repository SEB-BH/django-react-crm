from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from crm.models import Contact, Interaction, Opportunity


class Command(BaseCommand):
    help = 'Create a small set of CRM demo data.'

    def handle(self, *args, **options):
        user, _created = User.objects.get_or_create(username='staff')
        user.set_password('staffpass123')
        user.save()

        Contact.objects.all().delete()

        sara = Contact.objects.create(
            first_name='Sara',
            last_name='Ahmed',
            email='sara@example.com',
            phone='+973 3900 1000',
            preferred_channel='whatsapp',
            instagram_handle='sara.travels',
        )
        omar = Contact.objects.create(
            first_name='Omar',
            last_name='Khalid',
            email='omar@example.com',
            phone='+973 3600 2000',
            preferred_channel='instagram',
            instagram_handle='omar.designs',
        )

        bag = Opportunity.objects.create(
            contact=sara,
            title='Limited-edition travel bag',
            product_name='Heritage Travel Bag',
            source='instagram',
            stage='qualified',
            estimated_value=Decimal('1200.00'),
            next_follow_up=timezone.localdate() + timedelta(days=2),
            assigned_to=user,
        )
        Opportunity.objects.create(
            contact=omar,
            title='Office furniture consultation',
            product_name='Executive Desk Set',
            source='referral',
            stage='contacted',
            estimated_value=Decimal('2400.00'),
            next_follow_up=timezone.localdate() + timedelta(days=5),
            assigned_to=user,
        )
        Interaction.objects.create(
            opportunity=bag,
            channel='instagram',
            summary='Customer asked whether the item is available in black.',
            created_by=user,
        )

        self.stdout.write(self.style.SUCCESS('Created demo user staff / staffpass123 and sample CRM data.'))
