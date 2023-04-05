from django.contrib import admin
from .models import Umbrella
from .models import Subscription
from .models import Reservation
from .models import Constant
from .models import Audit

class AuditAdmin(admin.ModelAdmin):
    list_display = ('message', 'type')

class ConstantAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')

class UmbrellaAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'sunbeds', 'row', 'column')

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('code', 'umbrella', 'customer', 'start_date', 'end_date', 'sunbeds', 'paid', 'type', 'deposit', 'total', 'custom_period')

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('umbrella', 'customer', 'date', 'sunbeds', 'paid', 'subscription')

# Register your models here.
admin.site.register(Constant, ConstantAdmin)
admin.site.register(Umbrella, UmbrellaAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Audit, AuditAdmin)