from django.db import models

# Create your models here.

class Umbrella(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    row = models.SmallIntegerField(default=0)

    def _str_(self):
        return self.code

class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=5)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE)
    customer = models.TextField(blank=True)
    beachLoungers = models.PositiveSmallIntegerField(default=1)
    SUBSCRIPTIONS_TYPE = (
        ('S', 'seasonal'),
        ('P', 'periodic'),
        ('C', 'custom'),
    )
    subscriptionType = models.CharField(max_length=1, choices=SUBSCRIPTIONS_TYPE, default='S')
    startDate = models.DateField(blank=True)
    endDate = models.DateField(blank=True)
    paid = models.BooleanField()
    # freePeriodList: 

    def _str_(self):
        return self.code


class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    umbrella = models.ForeignKey(Umbrella, related_name='umbrella', on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    beachLoungers = models.PositiveSmallIntegerField(default=2)
    date = models.DateField(blank=True)
    paid = models.BooleanField(null=True)

    def _str_(self):
        return self.id

class Constant(models.Model):
    id = models.AutoField(primary_key=True)
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)

    def _str_(self):
        return self.id