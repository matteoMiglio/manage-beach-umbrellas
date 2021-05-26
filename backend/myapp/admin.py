from django.contrib import admin
from .models import Umbrella
from .models import Subscription

class UmbrellaAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'row')

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('code', 'umbrella', 'customer', 'startDate', 'endDate', 'beachLoungers', 'paid', 'subscriptionType')

# Register your models here.

admin.site.register(Umbrella, UmbrellaAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
