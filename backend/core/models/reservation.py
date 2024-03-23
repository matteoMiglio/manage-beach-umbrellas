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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id

    class Meta:
        unique_together = ('umbrella', 'date',)

    def save(self, *args, **kwargs):
        # This means that the model isn't saved to the database yet

        if self._state.adding and not self._state.fields_cache.get('subscription'):
            last_id = Reservation.objects.all().aggregate(largest=models.Max('code')).get('largest')

            if last_id is not None:
                self.code = last_id + 1

        super(Reservation, self).save(*args, **kwargs) 