from django.contrib import admin
from .models import Umbrella
from .models import Subscription
from .models import Reservation
from .models import Constant

class ConstantAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')

class UmbrellaAdmin(admin.ModelAdmin):
    list_display = ('description', 'row')

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('code', 'umbrella', 'customer', 'startDate', 'endDate', 'beachLoungers', 'paid', 'type')

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('umbrella', 'customer', 'date', 'beachLoungers', 'paid', 'subscription')


# Register your models here.
admin.site.register(Constant, ConstantAdmin)
admin.site.register(Umbrella, UmbrellaAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Reservation, ReservationAdmin)
