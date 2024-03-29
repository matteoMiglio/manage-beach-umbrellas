from django.db import models
from .season import Season
from .umbrella import Umbrella
from datetime import datetime

class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.PositiveSmallIntegerField(default=1)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField(default=2)
    SUBSCRIPTIONS_TYPE = (
        ('S', 'seasonal'), # from the start to the end of the season
        ('P', 'periodic'), # period of time fixed, i.e. the month of June
        ('C', 'custom'), # custom period, i.e. every week-end
    )
    type = models.CharField(max_length=1, choices=SUBSCRIPTIONS_TYPE, default='S')
    custom_period = models.CharField(max_length=30, blank=True, null=True)
    deposit = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    total = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, null=True, blank=True)
    paid = models.BooleanField()
    # freePeriodList:
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['code', 'season'], name='unique_code_within_season')
        ]

    def _str_(self):
        return self.code
    
    def save(self, *args, **kwargs):
        # This means that the model isn't saved to the database yet
        if self._state.adding:

            current_season = Season.objects.get(active=True)

            last_id = Subscription.objects.filter(season__exact=current_season).aggregate(largest=models.Max('code')).get('largest')

            # aggregate can return None! Check it first.
            # If it isn't none, just use the last ID specified (which should be the greatest) and add one to it
            if last_id is not None:
                self.code = last_id + 1

        super(Subscription, self).save(*args, **kwargs)  