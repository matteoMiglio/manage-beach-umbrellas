from django.db import models

# Create your models here.

class Umbrella(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=3, blank=True)
    description = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField()
    row = models.SmallIntegerField(default=0)
    column = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _str_(self):
        return self.code

class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=4)
    umbrella = models.ForeignKey(Umbrella, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.TextField(blank=True)
    sunbeds = models.PositiveSmallIntegerField(default=2)
    SUBSCRIPTIONS_TYPE = (
        ('S', 'seasonal'),
        ('P', 'periodic'),
        ('C', 'custom'),
    )
    type = models.CharField(max_length=1, choices=SUBSCRIPTIONS_TYPE, default='S')
    custom_period = models.CharField(max_length=30, blank=True, default="")
    deposit = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    total = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
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
    sunbeds = models.PositiveSmallIntegerField(default=2)
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
    
class Audit(models.Model):
    id = models.AutoField(primary_key=True)
    message = models.TextField(blank=True)
    EVENT_TYPE = (
        ('A', 'add'),
        ('D', 'delete'),
        ('U', 'update'),
    )
    type = models.CharField(max_length=1, choices=EVENT_TYPE, default="A")
    CATEGORY_TYPE = (
        ('R', 'reservation'),
        ('S', 'subscription'),
        ('C', 'constant'),
    )
    category = models.CharField(max_length=1, choices=CATEGORY_TYPE, default="R")
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.id