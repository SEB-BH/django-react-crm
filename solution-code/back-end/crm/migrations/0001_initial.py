from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('phone', models.CharField(max_length=30)),
                ('preferred_channel', models.CharField(choices=[('phone', 'Phone'), ('whatsapp', 'WhatsApp'), ('instagram', 'Instagram'), ('email', 'Email'), ('in_person', 'In person')], default='whatsapp', max_length=20)),
                ('instagram_handle', models.CharField(blank=True, max_length=100)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={'ordering': ['last_name', 'first_name']},
        ),
        migrations.CreateModel(
            name='Opportunity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('product_name', models.CharField(max_length=150)),
                ('source', models.CharField(choices=[('store', 'Store'), ('website', 'Website'), ('instagram', 'Instagram'), ('whatsapp', 'WhatsApp'), ('referral', 'Referral'), ('other', 'Other')], max_length=20)),
                ('stage', models.CharField(choices=[('new', 'New'), ('contacted', 'Contacted'), ('qualified', 'Qualified'), ('proposal', 'Proposal'), ('won', 'Won'), ('lost', 'Lost')], default='new', max_length=20)),
                ('estimated_value', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('next_follow_up', models.DateField(blank=True, null=True)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('assigned_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='opportunities', to=settings.AUTH_USER_MODEL)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='opportunities', to='crm.contact')),
            ],
            options={'ordering': ['-updated_at']},
        ),
        migrations.CreateModel(
            name='Interaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel', models.CharField(choices=[('phone', 'Phone'), ('whatsapp', 'WhatsApp'), ('instagram', 'Instagram'), ('email', 'Email'), ('in_person', 'In person'), ('note', 'Internal note')], max_length=20)),
                ('summary', models.TextField()),
                ('occurred_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='interactions', to=settings.AUTH_USER_MODEL)),
                ('opportunity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='interactions', to='crm.opportunity')),
            ],
            options={'ordering': ['-occurred_at']},
        ),
    ]
