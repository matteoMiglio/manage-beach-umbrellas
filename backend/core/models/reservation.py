from django.db import models
from .season import Season
from .subscription import Subscription
from .umbrella import Umbrella

class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.IntegerField(null=True, blank=True)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField(default=2)
    date = models.DateField(blank=True)
    paid = models.BooleanField(null=True)
    price = models.PositiveSmallIntegerField(default=0)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id

    class Meta:
        unique_together = ('umbrella', 'date',)

    def save(self, *args, **kwargs):
        # This means that the model isn't saved to the database yet

        # I don't care about codes when a reservation is related to a subcription
        if self._state.adding and not self._state.fields_cache.get('subscription'):

            current_season = Season.objects.get(active=True)
            last_id = Reservation.objects.filter(season__exact=current_season).aggregate(largest=models.Max('code')).get('largest')

            if last_id is not None:
                self.code = last_id + 1
            else:
                self.code = 1

        super(Reservation, self).save(*args, **kwargs) 