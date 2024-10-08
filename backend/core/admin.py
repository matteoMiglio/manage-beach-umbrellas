from django.contrib import admin
from .models.season import Season
from .models.audit import Audit
from .models.reservation import Reservation
from .models.subscription import Subscription
from .models.umbrella import Umbrella
from .models.printer import Printer

class AuditAdmin(admin.ModelAdmin):
    list_display = ('message', 'type')

class PrinterAdmin(admin.ModelAdmin):
    list_display = ('ip_address')

class SeasonAdmin(admin.ModelAdmin):
    list_display = ('season', 'start_date', 'end_date', 'active')

class UmbrellaAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'sunbeds', 'row', 'column', 'season')

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('umbrella', 'code', 'customer', 'start_date', 'end_date', 'sunbeds', 'paid', 'type', 'deposit', 'total', 'season', 'custom_period')

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('umbrella', 'code', 'customer', 'date', 'sunbeds', 'paid', 'price', 'season', 'subscription')

# Register your models here.
admin.site.register(Season, SeasonAdmin)
admin.site.register(Umbrella, UmbrellaAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Audit, AuditAdmin)