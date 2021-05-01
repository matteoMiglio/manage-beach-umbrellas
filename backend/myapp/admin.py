from django.contrib import admin
from .models import Umbrella

class UmbrellaAdmin(admin.ModelAdmin):
    list_display = ('code', 'description', 'state', 'pos_x', 'pos_y')

# Register your models here.

admin.site.register(Umbrella, UmbrellaAdmin)
