from django.contrib import admin
from .models.season import Season
from .models.audit import Audit
from .models.reservation import Reservation
from .models.subscription import Subscription
from .models.umbrella import Umbrella
from .models.constant import Constant

class AuditAdmin(admin.ModelAdmin):
    list_display = ('message', 'type')

class ConstantAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')

class SeasonAdmin(admin.ModelAdmin):
    list_display = ('start_date', 'end_date')

class UmbrellaAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'sunbeds', 'row', 'column')

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('umbrella', 'code', 'customer', 'start_date', 'end_date', 'sunbeds', 'paid', 'type', 'deposit', 'total', 'custom_period')

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('umbrella', 'code', 'customer', 'date', 'sunbeds', 'paid', 'price', 'subscription')

# Register your models here.
admin.site.register(Constant, ConstantAdmin)
admin.site.register(Season, SeasonAdmin)
admin.site.register(Umbrella, UmbrellaAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Audit, AuditAdmin)