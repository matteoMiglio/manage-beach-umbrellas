from django.db import models

# Create your models here.

class Umbrella(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=3, blank=True)
    description = models.TextField(blank=True)
    beachLoungers = models.PositiveSmallIntegerField()
    row = models.SmallIntegerField(default=0)
    col = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code
        # return self.id

class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=4)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    beachLoungers = models.PositiveSmallIntegerField(default=2)
    SUBSCRIPTIONS_TYPE = (
        ('S', 'seasonal'),
        ('P', 'periodic'),
        ('C', 'custom'),
    )
    type = models.CharField(max_length=1, choices=SUBSCRIPTIONS_TYPE, default='S')
    custom_period = models.CharField(max_length=30, blank=True, default="")
    deposit = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    startDate = models.DateField(blank=True, null=True)
    endDate = models.DateField(blank=True, null=True)
    paid = models.BooleanField()
    # freePeriodList:
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code


class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    beachLoungers = models.PositiveSmallIntegerField(default=2)
    date = models.DateField(blank=True)
    paid = models.BooleanField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id

class Constant(models.Model):
    id = models.AutoField(primary_key=True)
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.id